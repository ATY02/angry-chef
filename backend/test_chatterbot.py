"""
General tests for the chatterbot Ramsay AI to ensure it responds appropriately and sensibly given the scope
of our training.
"""

from main import Chatbot

def setup():
    return Chatbot()

def test_precise_responses():
    bot = setup()

    response = bot.respond("How do you make a creamy risotto?")
    assert response == "You're clueless! Add the stock gradually and stir constantly!"