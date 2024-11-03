import asyncio
from ..core.config import settings
from vdb.populate_db import main as populate_db

async def update_database():
    """
    Updates the Chroma database with new documents.
    Runs the populate_db script asynchronously.
    """
    # Run populate_db in a separate thread to avoid blocking
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, lambda: populate_db(reset=False))