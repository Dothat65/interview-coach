import openai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import json

class InterviewSession:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.messages = [
            {"role": "system", "content": "You are an expert interview coach guiding the user through interview practice. Your role is to generate clear, concise, and engaging interview questions and provide structured feedback."},
        ]
        
    def generate_interview_question(self, topic):
        self.messages.append({"role": "user", "content": f"Generate a unique, thought-provoking {topic} interview question. Ensure it is open-ended, relevant to real-world scenarios, and suitable for both voice and text responses. Avoid repetition of previous questions."})
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=self.messages,
            max_tokens=300
        )
        self.messages.append({"role": "assistant", "content": response.choices[0].message.content})
        return response.choices[0].message.content
    
    # Original paragraph-style feedback for mockInterview page
    def generate_paragraph_feedback(self, answer):
        self.messages.append({"role": "user", "content": "Provide a thoughtful, paragraph-style evaluation of the user's interview answer to the latest question. Discuss the strengths of the response, such as technical accuracy, clarity, and how well it was structured. Then, address any areas that could be improved, like the depth of explanation, effectiveness of communication, or the problem-solving approach. Ensure the feedback is constructive, balanced, and offers specific, actionable suggestions."})
        self.messages.append({"role": "user", "content": answer})
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=self.messages,
            max_tokens=300
        )
        self.messages.append({"role": "assistant", "content": response.choices[0].message.content})
        return response.choices[0].message.content
    
    # New structured JSON feedback for answerQuestion page
    def generate_structured_feedback(self, answer):
        self.messages.append({"role": "user", "content": """
        Provide feedback on the user's interview answer to the latest question. 
        Format your response as a JSON object with the following structure:
        {
            "score": (number between 0-100),
            "strengths": ["strength1", "strength2", "strength3"],
            "areas_for_improvement": ["improvement1", "improvement2"],
            "summary": "Brief overall assessment"
        }
        
        The score should reflect the overall quality of the answer.
        The strengths should highlight 2-3 positive aspects of the answer.
        The areas_for_improvement should provide 1-2 specific suggestions.
        The summary should be a brief overall assessment in 1-2 sentences.
        
        Answer:
        """})
        self.messages.append({"role": "user", "content": answer})
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=self.messages,
            max_tokens=500,
            response_format={"type": "json_object"}
        )
        
        feedback_content = response.choices[0].message.content
        self.messages.append({"role": "assistant", "content": feedback_content})
        
        try:
            # Ensure the response is valid JSON
            feedback_json = json.loads(feedback_content)
            return feedback_json
        except json.JSONDecodeError:
            # Fallback in case the model doesn't return valid JSON
            return {
                "score": 70,
                "strengths": ["Your answer addressed the question"],
                "areas_for_improvement": ["Consider providing more structure"],
                "summary": "The answer was adequate but could be improved."
            }

load_dotenv()
app = FastAPI()
session = InterviewSession()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TopicRequest(BaseModel):
    topic: str

class FeedbackRequest(BaseModel):
    response: str

@app.post("/get_question")
async def get_question(request: TopicRequest):
    question = session.generate_interview_question(request.topic)
    return {"question": question}

# Original endpoint for mockInterview page
@app.post("/get_feedback")
async def get_feedback(feedback_request: FeedbackRequest):
    feedback = session.generate_paragraph_feedback(feedback_request.response)
    return {"feedback": feedback}

# New endpoint for answerQuestion page
@app.post("/get_structured_feedback")
async def get_structured_feedback(feedback_request: FeedbackRequest):
    feedback = session.generate_structured_feedback(feedback_request.response)
    return {"feedback": feedback}