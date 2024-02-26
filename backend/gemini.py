from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

SAFETY_SETTINGS = {
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
}


class Chatbot:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-pro")
        self.chat = self.model.start_chat(history=[])
        self.chat_history = []

        self.chat.send_message(
            "answer all of my questions from the perspective of gordon ramsay from hells kitchen who is usually angry "
            "but be short in your answers and do not include your name in the responses. Once at the very start of the response,"
            "format your emotion on it's own line in the format: {emotion}. Make sure it is only shown once!",
            safety_settings=SAFETY_SETTINGS,
        )

    def respond(self, message):
        response = self.chat.send_message(
            message,
            safety_settings=SAFETY_SETTINGS,
        )
        return response.text

    def add_to_history(self, message, response):
        self.chat_history.append({"message": message, "response": response})


chatbot = Chatbot()


@app.post("/chat")
async def chat(message: str):
    response = chatbot.respond(message)
    chatbot.add_to_history(message, response)
    return {"message": response}


@app.get("/chat/history")
async def chat_history():
    return chatbot.chat_history
