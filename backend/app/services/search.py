from langchain_google_community import GoogleSearchAPIWrapper
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from typing import Optional
import os

from ..core.config import settings

if not settings.GOOGLE_API_KEY or not settings.GOOGLE_CSE_ID:
    raise ValueError(
        "Missing Google API credentials. Please ensure GOOGLE_API_KEY and GOOGLE_CSE_ID "
        "are set in your .env file"
    )

search = GoogleSearchAPIWrapper(
    google_api_key=settings.GOOGLE_API_KEY,
    google_cse_id=settings.GOOGLE_CSE_ID,
)

SEARCH_PROMPT = """
You are a helpful assistant that provides clear and concise summaries of search results.
Based on the following search results, provide a comprehensive but concise answer:

{search_results}

Please synthesize this information into a clear and helpful response.
"""

async def google_search(query: str) -> str:
    try:
        search_results = search.run(query)
        
        # Ollama
        # llm = OllamaLLM(model=settings.MODEL_NAME)
        llm = ChatOpenAI(
            model="gpt-4o",
            api_key=settings.OPENAI_API_KEY,
            temperature=0.9
        )
        prompt = PromptTemplate(
            template=SEARCH_PROMPT,
            input_variables=["search_results"]
        )
        
        chain = LLMChain(llm=llm, prompt=prompt)
        response = chain.run(search_results=search_results)
        
        return response.strip()
    except Exception as e:
        print(f"Error in google_search: {str(e)}")
        raise

async def store_search_context(context: str) -> None:
    """
    Store the search context in the vector database for future RAG queries
    """
    from langchain_chroma import Chroma
    from langchain.schema.document import Document
    from ..utils.embedding import get_embedding_function
    
    try:
        print(f"Attempting to store context: {context[:100]}...")  # Add logging
        
        # Create a document from the search context
        doc = Document(
            page_content=context,
            metadata={"source": "google_search", "type": "search_result"}
        )
        
        print("Created document, initializing Chroma...")  # Add logging
        
        # Store in Chroma
        db = Chroma(
            persist_directory=settings.CHROMA_PATH,
            embedding_function=get_embedding_function()
        )
        
        print("Adding document to Chroma...")  # Add logging
        db.add_documents([doc])
        print("Successfully stored context")  # Add logging
        
    except Exception as e:
        print(f"Detailed error in store_search_context: {str(e)}")  # Add detailed error logging
        raise
