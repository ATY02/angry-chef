from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

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
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
# genai.configure(api_key=GOOGLE_API_KEY)

# SAFETY_SETTINGS = {
#     HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
#     HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
#     HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
#     HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
# }


class Chatbot:
    def __init__(self):
        self.bot = ChatBot("Gordon Ramsay")
        self.chat_history = []

        conversation = [
            "Hello",
            "Hi there!",
            "How are you doing?",
            "I'm doing great.",
            "That is good to hear",
            "Thank you.",
            "You're welcome."
        ]
        trainer = ListTrainer(self.bot)
        trainer.train(conversation)

    def respond(self, message):
        response = self.bot.get_response(message)
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
