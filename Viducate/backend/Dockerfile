FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libpango-1.0-0 \
    fonts-dejavu-core \
    gcc \
    g++ \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# Install CPU-only PyTorch first (saves ~3GB vs GPU version)
RUN pip install --no-cache-dir \
    torch==2.5.1 \
    --index-url https://download.pytorch.org/whl/cpu

# Install CPU-only PaddlePaddle (saves ~2GB vs GPU version)
RUN pip install --no-cache-dir \
    paddlepaddle==3.0.0 \
    -f https://www.paddlepaddle.org.cn/whl/linux/mkl/avx/stable.html

# Install everything else (torch/paddle already installed, pip will skip them)
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download ML models at build time
RUN python -c "from sentence_transformers import SentenceTransformer; \
    SentenceTransformer('intfloat/multilingual-e5-base')"
RUN python -c "from sentence_transformers import CrossEncoder; \
    CrossEncoder('BAAI/bge-reranker-base')"

COPY . .

RUN mkdir -p logs/ocr_outputs chroma_db

RUN chmod +x startup.sh

EXPOSE 8000

CMD ["./startup.sh"]