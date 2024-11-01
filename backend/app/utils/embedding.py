from langchain_openai import OpenAIEmbeddings
from ..core.config import settings

def get_embedding_function():
    embeddings = OpenAIEmbeddings(
        api_key=settings.OPENAI_API_KEY,
        model="text-embedding-ada-002"
    )
    return embeddings
