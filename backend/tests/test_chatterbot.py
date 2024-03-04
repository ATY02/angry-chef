"""
General tests for the chatterbot Ramsay AI to ensure it responds appropriately and sensibly given the scope
of our training.
"""

from main import read_recipes, Chatbot

def setup():
    bot = Chatbot()
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

def test_basic_response_2():
    bot = setup()
    prompt = "How do you properly cook a perfect ribeye steak?"
    response = "Seriously? Sear it on high heat and let it rest before slicing!"
    bot.respond(prompt)
    bot.add_to_history(prompt, response)
    
    assert bot.chat_history[0] == {"message": prompt, "response": response}

def test_precise_responses():
    bot = setup()

    response = bot.respond("How do you make a creamy risotto?")
    assert response == "You're clueless! Add the stock gradually and stir constantly!"
