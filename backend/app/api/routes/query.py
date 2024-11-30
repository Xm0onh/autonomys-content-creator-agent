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
import shutil
import logging
from ...utils.encryption import encrypt_file_for_tee
from ...utils.tee_decryption import decrypt_tee_file

router = APIRouter()

logger = logging.getLogger(__name__)

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
                filename = content_disposition.split("filename=")[-1].strip('"') or f"{cid}.msgpack"
                encrypted_file_path = os.path.join(settings.DATA_PATH, filename)
                
                # Save encrypted file
                with open(encrypted_file_path, "wb") as f:
                    f.write(await response.read())

        # Decrypt the file
        decrypted_filename = filename.replace('.msgpack', '')
        decrypted_file_path = os.path.join(settings.DATA_PATH, decrypted_filename)
        
        if not decrypt_tee_file(
            encrypted_file_path=encrypted_file_path,
            private_key_path=settings.PRIVATE_KEY_PATH,
            output_file_path=decrypted_file_path
        ):
            raise HTTPException(status_code=500, detail="Failed to decrypt file")

        os.remove(encrypted_file_path)
        
        await update_database()
        
        return {
            "message": "File retrieved, decrypted, and database updated successfully",
            "name": decrypted_filename
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read file data
        file_data = await file.read()
        
        # Encrypt file data for TEE
        encrypted_bundle = encrypt_file_for_tee(
            file_data, 
            "public_key.pem"  # Assuming the key is in the root directory
        )
        
        # Create upload request
        base_url = "https://demo.auto-drive.autonomys.xyz"
        headers = {
            "Authorization": f"Bearer {settings.DSN_API_KEY}",
            "X-Auth-Provider": "apikey",
            "Content-Type": "application/json"
        }
        
        create_data = {
            "filename": f"{file.filename}.msgpack",
            "mimeType": "application/octet-stream",
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
            
            # Upload encrypted bundle
            chunk_headers = {
                "Authorization": f"Bearer {settings.DSN_API_KEY}",
                "X-Auth-Provider": "apikey"
            }
            
            form_data = aiohttp.FormData()
            form_data.add_field(
                "file", 
                encrypted_bundle,
                filename=f"{file.filename}.msgpack",
                content_type="application/octet-stream"
            )
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
            
            # print the response
            print(completion_data)

            return JSONResponse(content={
                "upload_id": completion_data["cid"],
                "status": "success",
                "completion": completion_data
            })
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-db")
async def upload_db():
    try:
        logger.info(f"Starting database backup process. Chroma path: {settings.CHROMA_PATH}")
        
        # Verify Chroma directory exists
        if not os.path.exists(settings.CHROMA_PATH):
            raise HTTPException(
                status_code=400, 
                detail=f"Chroma directory not found at {settings.CHROMA_PATH}"
            )

        # Create zip file
        zip_path = "chroma_backup.zip"
        try:
            logger.info("Creating zip archive...")
            shutil.make_archive(
                "chroma_backup",  # name of the file without extension
                'zip',           # archive format
                settings.CHROMA_PATH  # directory to zip
            )
            logger.info(f"Zip archive created successfully at {zip_path}")
        except Exception as e:
            logger.error(f"Failed to create zip archive: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create zip archive: {str(e)}"
            )

        try:
            # Verify zip file was created and get its size
            if not os.path.exists(zip_path):
                raise HTTPException(
                    status_code=500,
                    detail="Zip file was not created successfully"
                )
            
            file_size = os.path.getsize(zip_path)
            logger.info(f"Zip file size: {file_size} bytes")

            # Upload to DSN
            async with aiohttp.ClientSession() as session:
                # Create upload request
                headers = {
                    "Authorization": f"Bearer {settings.DSN_API_KEY}",
                    "X-Auth-Provider": "apikey",
                    "Content-Type": "application/json"
                }
                
                create_data = {
                    "filename": "chroma_backup.zip",
                    "mimeType": "application/zip",
                    "uploadOptions": None
                }
                
                logger.info("Creating upload request...")
                base_url = "https://demo.auto-drive.autonomys.xyz"
                
                # Create upload
                async with session.post(
                    f"{base_url}/uploads/file",
                    headers=headers,
                    json=create_data
                ) as response:
                    if response.status != 200:
                        response_text = await response.text()
                        logger.error(f"Failed to create upload. Status: {response.status}, Response: {response_text}")
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Failed to create upload: {response_text}"
                        )
                    upload_data = await response.json()
                    upload_id = upload_data["id"]
                    logger.info(f"Upload created with ID: {upload_id}")
                
                # Upload file chunk
                chunk_headers = {
                    "Authorization": f"Bearer {settings.DSN_API_KEY}",
                    "X-Auth-Provider": "apikey"
                }
                
                # Read the entire file into memory
                with open(zip_path, 'rb') as f:
                    file_data = f.read()
                
                form_data = aiohttp.FormData()
                form_data.add_field(
                    "file", 
                    file_data,
                    filename="chroma_backup.zip",
                    content_type="application/zip"
                )
                form_data.add_field("index", "0")
                
                logger.info("Uploading file chunk...")
                async with session.post(
                    f"{base_url}/uploads/file/{upload_id}/chunk",
                    headers=chunk_headers,
                    data=form_data
                ) as response:
                    if response.status != 200:
                        response_text = await response.text()
                        logger.error(f"Failed to upload chunk. Status: {response.status}, Response: {response_text}")
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Failed to upload chunk: {response_text}"
                        )
                    logger.info("File chunk uploaded successfully")
                
                # Complete upload
                logger.info("Completing upload...")
                async with session.post(
                    f"{base_url}/uploads/{upload_id}/complete",
                    headers=headers
                ) as response:
                    if response.status != 200:
                        response_text = await response.text()
                        logger.error(f"Failed to complete upload. Status: {response.status}, Response: {response_text}")
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Failed to complete upload: {response_text}"
                        )
                    completion_data = await response.json()
                    logger.info("Upload completed successfully")

        finally:
            # Clean up zip file
            try:
                if os.path.exists(zip_path):
                    os.remove(zip_path)
                    logger.info("Cleaned up temporary zip file")
            except Exception as e:
                logger.error(f"Failed to clean up zip file: {str(e)}")

        return {
            "message": "Database backup uploaded successfully",
            "upload_id": upload_id,
            "completion": completion_data
        }
            
    except Exception as e:
        logger.error(f"Unexpected error during database backup: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to backup database: {str(e)}"
        )
