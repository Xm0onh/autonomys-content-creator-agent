from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Optional
import json
from pydantic import BaseModel
import os
import aiohttp
from fastapi import Header
from ...core.config import settings
from ...services.rag import query_rag
from ...services.search import google_search, store_search_context
from ...services.db_manager import update_database
import mimetypes

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

def get_mime_type(filename):
    """Detect the MIME type of a file based on its extension"""
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type or 'application/octet-stream'

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

@router.get("/retrieve/{cid}")
async def retrieve_file(
    cid: str,
    authorization: str = Header(None) 
):
    try:
        # Create data directory if it doesn't exist
        os.makedirs(settings.DATA_PATH, exist_ok=True)
        
        # Download file from DSN
        async with aiohttp.ClientSession() as session:
            url = f"https://demo.auto-drive.autonomys.xyz/objects/{cid}/download"
            headers = {
                "Authorization": f"Bearer {settings.DSN_API_KEY}",
                "x-auth-provider": "apikey"
            }
            
            async with session.get(url, headers=headers) as response:
                if response.status != 200:
                    raise HTTPException(
                        status_code=response.status,
                        detail="Failed to download file from DSN"
                    )
                
                # Get filename from headers or use CID as filename
                content_disposition = response.headers.get("Content-Disposition", "")
                filename = content_disposition.split("filename=")[-1].strip('"') or f"{cid}.pdf"
                file_path = os.path.join(settings.DATA_PATH, filename)
                
                # Save file
                with open(file_path, "wb") as f:
                    f.write(await response.read())

        # Update the database
        await update_database()
        
        return {
            "message": "File retrieved and database updated successfully",
            "name": filename
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Step 1: Create upload request
        base_url = "https://demo.auto-drive.autonomys.xyz"
        headers = {
            "Authorization": f"Bearer {settings.DSN_API_KEY}",
            "X-Auth-Provider": "apikey",
            "Content-Type": "application/json"
        }
        
        create_data = {
            "filename": file.filename,
            "mimeType": get_mime_type(file.filename),
            "uploadOptions": None
        }
        
        async with aiohttp.ClientSession() as session:
            # Create upload
            async with session.post(
                f"{base_url}/uploads/file",
                headers=headers,
                json=create_data
            ) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status, detail="Failed to create upload")
                upload_data = await response.json()
                upload_id = upload_data["id"]
            
            # Upload file chunk
            chunk_headers = {
                "Authorization": f"Bearer {settings.DSN_API_KEY}",
                "X-Auth-Provider": "apikey"
            }
            
            form_data = aiohttp.FormData()
            form_data.add_field("file", 
                              await file.read(),
                              filename=file.filename,
                              content_type=get_mime_type(file.filename))
            form_data.add_field("index", "0")
            
            async with session.post(
                f"{base_url}/uploads/file/{upload_id}/chunk",
                headers=chunk_headers,
                data=form_data
            ) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status, detail="Failed to upload chunk")
            
            # Complete upload
            async with session.post(
                f"{base_url}/uploads/{upload_id}/complete",
                headers=headers
            ) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status, detail="Failed to complete upload")
                completion_data = await response.json()
            
            return JSONResponse(content={
                "upload_id": upload_id,
                "status": "success",
                "completion": completion_data
            })
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
