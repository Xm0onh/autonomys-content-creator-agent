from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CHROMA_PATH: str = "chroma"
    DATA_PATH: str = "data"
    MODEL_NAME: str = "gpt-4"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    GOOGLE_API_KEY: str = ""
    GOOGLE_CSE_ID: str = ""
    DSN_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
