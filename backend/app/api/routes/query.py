from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from ...services.rag import query_rag

router = APIRouter()

@router.get("/query")
async def query_endpoint(query_text: str):
    if not query_text.strip():
        raise HTTPException(status_code=400, detail="Query text cannot be empty")
    response = query_rag(query_text)
    return JSONResponse(content={"response": response})

@router.get("/health")
async def health_check():
    return {"status": "healthy"}