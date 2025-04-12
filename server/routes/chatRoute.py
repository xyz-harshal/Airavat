from fastapi import APIRouter, HTTPException
from models import ChatRequestModel, ChatResponseModel
import requests
import os
import logging

router = APIRouter()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"  # Update this URL
GROQ_MODEL = "llama-3.3-70b-versatile"  # Add this model

@router.post("/chatbot")
async def chatbot(req: dict):
    # Extract data from request
    alpha_context = req.get("alphaContext", "")
    conversation = req.get("conversation", [])
    new_message = req.get("newMessage", "")

    full_messages = [{
        "role": "system",
        "content": f"Context: {alpha_context}. You are being used as a AI chatbot for an EEG signal analyser. The main context you are receving is the content analysed from the EEG signal. You will also receive the context of the entire conversation you have with the user. Help the user with whatever he wants. Be concise, dont go deep unless the user asks you to."
    }]
    for msg in conversation:
        # msg is dict with 'role' and 'content'
        full_messages.append(msg)
    full_messages.append({"role": "user", "content": new_message})

    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set")
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": full_messages
    }
    
    logging.info(f"Sending request to Groq API: {payload}")
    response = requests.post(GROQ_API_URL, headers=headers, json=payload)
    
    if response.status_code != 200:
        logging.error(f"Failed to get response from Groq API: {response.text}")
        raise HTTPException(status_code=500, detail="Failed to get response from Groq API")
    
    try:
        data = response.json()
    except ValueError as e:
        logging.error(f"JSON decode error: {str(e)}")
        raise HTTPException(status_code=500, detail="Invalid JSON response from Groq API")

    logging.info(f"Received response from Groq API: {data}")
    if "choices" not in data or not data["choices"]:
        raise HTTPException(status_code=500, detail="Invalid response structure from Groq API")
    return {"error": False, "response": data["choices"][0]["message"]["content"]}