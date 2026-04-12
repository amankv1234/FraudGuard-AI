# --- STAGE 1: Build Frontend ---
FROM node:18-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- STAGE 2: Build Backend & Run ---
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Copy the frontend build from Stage 1 into the location FastAPI expects
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the API port
EXPOSE 8000

# Run the unified server
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
