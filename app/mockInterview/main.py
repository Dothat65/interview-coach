import openai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

class InterviewSession:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.messages = [
            {"role": "system", "content": "You are an expert interview coach guiding the user on how to conduct effective interviews. Your role is to generate clear, concise, and engaging interview questions that can be answered through both voice and text. Only provide the questions in plaintext, without any additional explanations or formatting."},
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
    
    def generate_feedback(self, answer):
        self.messages.append({"role": "user", "content": "Provide a thoughtful, paragraph-style evaluation of the user's interview answer to the latest question. Discuss the strengths of the response, such as technical accuracy, clarity, and how well it was structured. Then, address any areas that could be improved, like the depth of explanation, effectiveness of communication, or the problem-solving approach. Ensure the feedback is constructive, balanced, and offers specific, actionable suggestions."})
        self.messages.append({"role": "user", "content": answer})
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=self.messages,
            max_tokens=300
        )
        self.messages.append({"role": "assistant", "content": response.choices[0].message.content})
        return response.choices[0].message.content

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

@app.post("/get_feedback")
async def get_feedback(feedback_request: FeedbackRequest):
    feedback = session.generate_feedback(feedback_request.response)
    return {"feedback": feedback}