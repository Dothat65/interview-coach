import openai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class InterviewSession:
    def __init__(self):
        openai.api_key = ""
        self.messages = [
            {"role": "system", "content": "You are an expert interview coach guiding the user on how to conduct effective interviews. Your role is to generate clear, concise, and engaging interview questions that can be answered through both voice and text. Only provide the questions in plaintext, without any additional explanations or formatting."},
        ]
        
    def generate_interview_question(self):
        self.messages.append({"role": "system", "content": f"Generate a unique, thought-provoking computerr science interview question. Ensure it is open-ended, relevant to real-world scenarios, and suitable for both voice and text responses. Avoid repetition of previous questions."})
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=self.messages,
            max_tokens=300
        )
        self.messages.append({"role": "assistant", "content": response.choices[0].message.content})
        return response.choices[0].message.content
    
    def generate_feedback(self, answer):
        self.messages.append({"role": "system", "content": "Evaluate the user's interview answer to the lastest question critically. Highlight strengths, including technical accuracy, clarity, and structure. Identify areas for improvement, such as depth of explanation, communication, or problem-solving approach. Keep feedback constructive and actionable."})
        self.messages.append({"role": "user", "content": answer})
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=self.messages,
            max_tokens=300
        )
        self.messages.append({"role": "assistant", "content": response.choices[0].message.content})
        return response.choices[0].message.content

app = FastAPI()
session = InterviewSession()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FeedbackRequest(BaseModel):
    response: str

@app.get("/get_question")
async def get_question():
    question = session.generate_interview_question()
    return {"question": question}

@app.post("/get_feedback")
async def get_feedback(feedback_request: FeedbackRequest):
    feedback = session.generate_feedback(feedback_request.response)
    return {"feedback": feedback}