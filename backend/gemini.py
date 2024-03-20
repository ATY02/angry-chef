from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
import re
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

FORMAT_PROMPT = "Once Only at the very start of the response, format your emotion on it's own " \
                "line in the format: number} " \
                "If you are angry, number should be 1} " \
                "If you are condescending, number should be 2} " \
                "If you are helpful, number should be 3} " \
                "If you are feeling none of the above, number should be 5} "

PERSONALITY_PROMPT = "Answer all of my questions from the perspective of a angry, condescending gordon ramsay from " \
                     "hells kitchen who is usually angry but be brief in your answers and do not include your name " \
                     "in the responses. If asked for cooking advice, make sure to actually give it. Be creative with" \
                     "your insults. Don't always respond in full caps lock."


class Chatbot:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-pro")
        self.chat = self.model.start_chat(history=[])
        self.chat_history = []

        self.chat.send_message(
            PERSONALITY_PROMPT + FORMAT_PROMPT,
            safety_settings=SAFETY_SETTINGS,
        )

    def respond(self, message):
        response = self.chat.send_message(
            message,
            safety_settings=SAFETY_SETTINGS,
        )
        return response.text

    def add_to_history(self, message: str, response: str, emotion: int):
        self.chat_history.append({"message": message, "response": response, "emotion": emotion})


chatbot = Chatbot()


@app.post("/chat")
async def chat(message: str):
    response = chatbot.respond(message)

    # Extracts the emotional state
    actualResponse = extract_response(response)
    responseEmotion = 5
    responseText = actualResponse

    if isinstance(actualResponse, tuple):
        responseEmotion = actualResponse[0]

        if (responseEmotion < 0) or (responseEmotion > 5):
            responseEmotion = 5

        responseText = actualResponse[1]

    chatbot.add_to_history(message, responseText, responseEmotion)
    return {"message": responseText}


@app.get("/chat/history")
async def chat_history():
    return chatbot.chat_history


@app.post("/chat/history")
async def clear_chat_history():
    chatbot.chat = chatbot.model.start_chat(history=[])
    chatbot.chat.send_message(
        PERSONALITY_PROMPT + FORMAT_PROMPT,
        safety_settings=SAFETY_SETTINGS,
    )
    chatbot.chat_history = []


# Extracts the emotional state and the response
def extract_response(response):
    header_split = response.split("}")

    if len(header_split) == 1:
        return response
    else:
        # Regular expression removes anything but digits
        return int(re.sub("\D", "", header_split[0])), header_split[1]
