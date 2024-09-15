from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from services.whisper_service import process_audio 
from services.pinecone_service import store_vector
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/api/input")
async def process_input(
    image: UploadFile = File(...),
    audio: UploadFile = File(...)
):
    image_path = os.path.join(UPLOAD_DIRECTORY, image.filename)
    audio_path = os.path.join(UPLOAD_DIRECTORY, audio.filename)
    
    with open(image_path, "wb") as image_file:
        image_file.write(await image.read())
    
    with open(audio_path, "wb") as audio_file:
        audio_file.write(await audio.read())
    
    try:
        translated_text = await process_audio(audio_path)
    except Exception as e:
        return {"error": f"Error processing audio: {str(e)}"}
    
    if translated_text:
        await store_vector(translated_text)

    return {"message": "Files uploaded and processed successfully", "translated_text": translated_text}
