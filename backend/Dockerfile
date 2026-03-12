FROM python:3.12-slim

WORKDIR /app

# System deps for sentence-transformers, Qiskit
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ libgomp1 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Bake MiniLM into image at build time (80MB, always needed)
RUN python -c "from sentence_transformers import SentenceTransformer; \
    SentenceTransformer('all-MiniLM-L6-v2')"

# Copy all source
COPY . .

# Create data dirs
RUN mkdir -p data/docs/starter data/docs/generated data/sessions

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
