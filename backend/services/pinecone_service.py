# services/pinecone_service.py
import pinecone
import os
from dotenv import load_dotenv

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")

pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)
index_name = "your-index-name"  # Replace with your index name
index = pinecone.Index(index_name)

async def store_vector(vector_data: str):
    vector = [vector_data]  # Transform your text into a vector representation
    metadata = {"text": vector_data}

    # Example: index upsert with a unique ID
    index.upsert(items=[("unique-id", vector, metadata)])
