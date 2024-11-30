import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.deps import setup_middlewares
from .api.routes.query import router
from .core.config import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title="RAG API",
        description="API for RAG-powered question answering",
        version="1.0.0"
    )
    
    setup_middlewares(app)
    app.include_router(router)
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Add your frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )