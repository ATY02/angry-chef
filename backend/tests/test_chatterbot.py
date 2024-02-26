"""
General tests for the chatterbot Ramsay AI to ensure it responds appropriately and sensibly given the scope
of our training.
"""

from main import read_recipes

def test_read_recipes():
    recipes = read_recipes("data/tworecipes.txt")

    assert len(recipes) == 4
    assert recipes[0] == "Can you give me a recipe for beef Wellington?"
