"""
General tests for the chatterbot Ramsay AI to ensure it responds appropriately and sensibly given the scope
of our training.
"""

from main import read_recipes, Chatbot

def setup():
    bot = Chatbot(True)
    bot.train(read_recipes("backend/data/tworecipes.txt"))
    return bot

def test_read_recipes():
    recipes = read_recipes("backend/data/tworecipes.txt")

    assert len(recipes) == 4
    assert recipes[0] == "Can you give me a recipe for beef Wellington?"

def test_basic_response():
    bot = setup()
    response = bot.respond("How do you properly cook a perfect ribeye steak?")
    
    assert response == "Seriously? Sear it on high heat and let it rest before slicing!"
