from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    groq_api_key: str = ""                          # Optional — Ollama fallback if missing
    ollama_url: str = "http://ollama:11434"         # Docker service name
    qdrant_url: str = "http://qdrant:6333"          # Docker service name
    cors_origins: str = "http://localhost:5173,http://localhost:8080"
    docs_starter_path: str = "data/docs/starter"
    docs_generated_path: str = "data/docs/generated"
    sessions_path: str = "data/sessions"
    hf_cache_dir: str = "/root/.cache/huggingface"
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
