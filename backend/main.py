from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

import util
import gemini

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


class Chatbot:
    def __init__(self):
        self.bot = ChatBot("Gordon Ramsay")
        self.chat_history = []
        self.gemini_bot = gemini.Chatbot()
        self.gemini_bot.respond("whenever I ask for a recipe, provide it to me in a manner where every "
                                "instruction/step of the recipe is given in an insulting way and the words "
                                "of Gordon Ramsay. embed the insult into the instruction like for example: Get your hands on a good cut of meat, you donkey!, "
                                "Don't be stingy with the oil, you fool! "
                                "Season it properly, you idiot sandwich! "
                                "Add some garlic powder, you spoon! "
                                "And don't forget the onion powder, you donut! "
                                "Pat the steak dry with paper towels. You don't want it wet, you muppet! Remember not to include your name in the responses ever or mention giving a recipe. Think of it as a conversation")

        trainer = ListTrainer(self.bot)
        try:
            qna = util.parse_qna("data/qna.txt")
            recipes = util.parse_recipes("data/recipes.txt")
            trainer.train(qna)
            trainer.train(recipes)
        except FileNotFoundError:
            print("file not found")

    def respond(self, message):
        response = self.bot.get_response(message)
        self.gemini_bot.respond(message)  # still track messages in gemini
        if "!" not in response.text:  # check if the response is an output (contains "!")
            return self.respond(message)
        else:
            return response.text

    def respond_gemini(self, message):
        return self.gemini_bot.respond(message)

    def add_to_history(self, message, response):
        self.gemini_bot.add_to_history(message=message, response=response)


chatbot = Chatbot()


@app.post("/chat")
async def chat(message: str):
    if "recipe" in message:
        response = chatbot.respond_gemini(message)
    else:
        response = chatbot.respond(message)
    chatbot.add_to_history(message, response)
    return {"message": response}


@app.get("/chat/history")
async def chat_history():
    return chatbot.gemini_bot.chat_history
