# angry-chef

SWEN-356 Course Project

## Prerequisites

Make sure Python3 is available on your machine - this API is using version 3.11. If you have multiple versions of
Python, you can use a Python version manager such as [pyenv](https://github.com/pyenv/pyenv).

Similarly, make sure Node is available - the frontend is using Node18 and npm 9.8.1. For more information on installing
this, see their [docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Development

The following steps outline additional setups to work on this project.

### Backend

Navigate to the `backend` directory in your shell and install the dependencies using pip:

```bash
pip install -r requirements.txt
```

Next, install ChatterPy, the machine learning chatbot we use. This is a version of chatterbot with continued maintenance
for python 3.11. Learn more about it [here](https://github.com/ShoneGK/ChatterPy).

```bash
pip install git+https://github.com/ShoneGK/ChatterPy
```

You may need to install spacy, an additional dependency:

```bash
python -m spacy download en_core_web_sm
```

Now you are ready to start the FastAPI server! Run the application using Uvicorn (runs on http://localhost:8000/).

```bash
uvicorn main:app --reload
```
OR
```bash
python -m uvicorn main:app --reload
```

Note - in order for the frontend to work with both gemini and chatterbot, you need to run both serveres in separate
windows. To do this, run the below commands (also see google gemini setup instructions below):

```bash
uvicorn gemini:app --reload --port 8000
uvicorn main:app --reload --port 8001  # In a separate window
```
OR
```bash
python -m uvicorn gemini:app --reload --port 8000
python -m uvicorn main:app --reload --port 8001  # In a separate window
```

Alternatively, if you have all packages installed in the respective frontend/ and backend/ directories, you can
run `start.py` from the application base directory. You must first configure the `BASE_URL` variable as one that matches
the configuration of your machine (ex. `/Users/dummy/Documents/Github/angry-chef`) - then you can run:

```bash
python start.py
```

You can access the Swagger Documentation for the API while running the application
at http://localhost:8000/docs

### Frontend

Navigate to the `frontend` directory in a separate shell and install the dependencies using npm:

```bash
npm install
```

Now you are ready to start the frontend server! Run the frontend using npm (runs on http://localhost:5173/):

```bash
npm run dev
```
### Chatterbot Text Collection

While running both chatterbot and gemini APIs, chatterbot will send any recipe requests to the gemini API to increase the 
quality of its responses while we continue to train it on more recipes. To disable this feature, deactivate the gemini API.

## Development -- Google Gemini

The following steps and development directions set up an ideal version of our angry chef bot using the comprehensive
functionality of Google's Gemini GPT.

### Backend

Navigate to the `backend` directory in your shell and install the dependencies using pip (these are the same
dependencies as above):

```bash
pip install -r requirements.txt
```

Next, you need to obtain a Google API key from
the [Google Cloud Console](https://makersuite.google.com/app/apikey). Create
a .env file in the backend directory.
Add your Google API key to the .env file:

```
GOOGLE_API_KEY=your_api_key_here
```

Now you are ready to start the FastAPI server! Run the application using Uvicorn (runs on http://localhost:8000/):

```bash
uvicorn gemini:app --reload
```
OR
```bash
python -m uvicorn gemini:app --reload
```

You can access the Swagger Documentation for the API while running the application
at http://localhost:8000/docs

### Frontend

The frontend setup and usage remains the same as above.
