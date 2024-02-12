from pydantic import BaseModel
from typing import Union

from fastapi import FastAPI

app = FastAPI()


class SessionData(BaseModel):
    username: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
