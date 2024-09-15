# services/whisper_service.py

import whisper
import asyncio
import torch

# Determine the device to run Whisper on (GPU if available)
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load the Whisper model once when the module is imported
model = whisper.load_model("base", device=device)  # You can also use 'small', 'medium', or 'large'

async def process_audio(file_path: str) -> str:
    # Run the transcribe function with translation in a thread to avoid blocking the event loop
    loop = asyncio.get_event_loop()
    
    # Translate the Cantonese audio to English directly
    try:
        result = await loop.run_in_executor(
            None, model.transcribe, file_path, {'task': 'translate'}  # 'task=translate' will translate to English
        )
        translated_text = result['text']
        return translated_text
    except Exception as e:
        print(f"Error during translation: {e}")
        raise e
