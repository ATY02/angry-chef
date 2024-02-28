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

emotional_state = 9

# FORMAT_PROMPT = "Once at the very start of the response,format your emotion on it's own " \
#                 "line in the format: {emotion}. Make sure it is only shown once! "

FORMAT_PROMPT = "Once at the very start of the response, format your emotion on it's own " \
                "line in the format: {number}. " \
                "If you are angry, number should be 1. " \
                "If you are condescending, number should be 2. " \
                "If you are helpful, number should be 3. " \
                "If you are feeling none of the above, number should be 9. " \
                "Make sure it is only shown once!"

PERSONALITY_PROMPT = "Answer all of my questions from the perspective of a angry gordon ramsay from hells kitchen " \
                     "who is usually angry but be brief in your answers and do not include your name in the responses."


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

    def add_to_history(self, message, response):
        self.chat_history.append({"message": message, "response": response})


chatbot = Chatbot()


@app.post("/chat")
async def chat(message: str):
    response = chatbot.respond(message)

    # Extracts the emotional state
    actualResponse = extract_response(response)
    actualResponse = actualResponse + str(emotional_state)

    chatbot.add_to_history(message, actualResponse)
    return {"message": actualResponse}


@app.get("/chat/history")
async def chat_history():
    return chatbot.chat_history


# Extracts the emotional state and the response
def extract_response(response):
    header_split = response.split("}")

    if (len(header_split) == 1):
        return response
    else:
        number_split = header_split[0].split("{")

        global emotional_state
        emotional_state = int(number_split[1])

        return header_split[1]
