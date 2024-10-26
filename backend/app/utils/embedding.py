from langchain_ollama import OllamaEmbeddings


def get_embedding_function():
    embeddings = OllamaEmbeddings(model="llama3") 
    return embeddings
