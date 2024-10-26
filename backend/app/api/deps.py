from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost:5173",    # Vite's default port
    "http://localhost:3000",    # Just in case you use a different port
    "http://127.0.0.1:5173",   # Alternative localhost notation
]



def setup_middlewares(app: FastAPI):
    app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)