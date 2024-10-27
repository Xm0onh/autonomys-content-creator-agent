from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import json
from pydantic import BaseModel

from ...services.rag import query_rag
from ...services.search import google_search, store_search_context

router = APIRouter()

class QueryConfig(BaseModel):
    contentType: str
    tone: str
    creativityLevel: int
    seoOptimization: bool

class SearchRequest(BaseModel):
    query: str

class ChatContextRequest(BaseModel):
    context: str

@router.get("/query")
async def query_endpoint(query_text: str, config: Optional[str] = None):
    if not query_text.strip():
        raise HTTPException(status_code=400, detail="Query text cannot be empty")
    
    try:
        # Parse the config JSON string
        config_dict = json.loads(config) if config else {}
        
        # Generate the response using the enhanced prompt
        response = query_rag(query_text, config_dict)
        return JSONResponse(content={"response": response})
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid configuration format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy"}

@router.post("/search")
async def search_endpoint(request: SearchRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    try:
        result = await google_search(request.query)
        return JSONResponse(content={"result": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/context")
async def add_chat_context(request: ChatContextRequest):
    if not request.context.strip():
        raise HTTPException(status_code=400, detail="Context cannot be empty")
    
    try:
        # Now store_search_context is properly imported
        await store_search_context(request.context)
        return JSONResponse(content={"status": "success"})
    except Exception as e:
        print(f"Error in add_chat_context: {str(e)}")  # Add logging
        raise HTTPException(status_code=500, detail=str(e))
