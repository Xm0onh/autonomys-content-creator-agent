from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import json
from pydantic import BaseModel

from ...services.rag import query_rag

router = APIRouter()

class QueryConfig(BaseModel):
    contentType: str
    tone: str
    creativityLevel: int
    seoOptimization: bool

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
