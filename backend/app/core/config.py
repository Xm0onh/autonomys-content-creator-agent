from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CHROMA_PATH: str = "chroma"
    DATA_PATH: str = "data"
    MODEL_NAME: str = "llama3:latest"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

settings = Settings()