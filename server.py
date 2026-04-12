from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse, FileResponse
import asyncio
import json
import random
import os
import time
import psutil
from datetime import datetime
from dotenv import load_dotenv

# Load API Keys
load_dotenv()
from simulator import UPISimulator
from dna_engine import EvolutionManager
from vector_store import VectorStore
from agent import FraudAgent
from hindsight_agent import HindsightAgent

app = FastAPI()

# Enable CORS for React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Engines
dna_manager = EvolutionManager()
master_dna = dna_manager.population[0]
vector_store = VectorStore()
base_agent = FraudAgent()
hindsight = HindsightAgent(master_dna, vector_store)
simulator = UPISimulator()

# Load memory from previous training or sessions
hindsight.load_memory()

# Keep track of DNA evolution for charting
weight_history = [hindsight.dna.weights.copy()]

# --- API ROUTES ---

@app.get("/status")
async def get_status():
    return {
        "generation": dna_manager.generation,
        "weights": hindsight.dna.weights,
        "history": weight_history,
        "experience": len(hindsight.experience_bank),
        "recent_lessons": hindsight.experience_bank[-5:] if hasattr(hindsight, "experience_bank") else [],
        "chaos": {
            "cpu_utility": f"{psutil.cpu_percent()}%",
            "memory": f"{psutil.virtual_memory().percent}%",
            "nodes": "12 / 12"
        }
    }

@app.get("/memory_logs")
async def get_memory_logs():
    """Compatibility endpoint for React frontend."""
    logs = []
    for item in hindsight.memory:
        logs.append({
            "txnId": item['txn'].get('txnId'),
            "vpa": item['txn'].get('vpa'),
            "amount": item['txn'].get('amount'),
            "city": item['txn'].get('city'),
            "decision": "FRAUD" if item['prediction'] > 0.6 else "LEGIT",
            "feedback": item['label']
        })
    return {"logs": logs[::-1]} # Reverse for chronological

@app.get("/stream")
async def stream_transactions():
    """Server-Sent Events stream for transactions with Hindsight."""
    async def event_generator():
        while True:
            fraud_type = random.choice([None, None, None, "velocity", "travel"])
            txn = simulator.generate_transaction(fraud_type)
            
            signals = {
                "ml_anomaly": random.uniform(0, 0.4) if not fraud_type else random.uniform(0.7, 0.95),
                "vector_sim": vector_store.get_max_similarity(txn),
                "graph_mule": random.uniform(0, 0.3) if not fraud_type else random.uniform(0.6, 0.9),
                "velocity": 0.1 if not fraud_type else 0.85,
                "behavior_dev": random.uniform(0, 0.3) if not fraud_type else 0.75,
                "time_anomaly": 0.1 if random.randint(0, 10) > 2 else 0.9
            }
            
            risk_score, historical_matches, source = hindsight.predict(txn, signals)
            emb = vector_store.get_transaction_embedding(txn)
            hindsight.retain(txn, emb, risk_score)
            
            payload = {
                **txn,
                "riskScore": risk_score,
                "signals": signals,
                "source": source,
                "hasHistory": len(historical_matches) > 0
            }
            
            if risk_score > 0.6:
                payload["explanation"] = base_agent.explain_decision(txn, risk_score, signals)
            
            yield f"data: {json.dumps(payload)}\n\n"
            await asyncio.sleep(3)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/feedback")
async def handle_feedback(payload: dict = Body(...)):
    txn_id = payload.get("txnId")
    label = payload.get("label")
    was_learned = hindsight.reflect(txn_id, label)
    if was_learned:
        weight_history.append(hindsight.dna.weights.copy())
        hindsight.save_memory()
    return {"status": "success", "learned": was_learned}

@app.post("/analyze_transaction")
async def analyze_transaction(txn: dict):
    try:
        raw_amt = txn.get('amount', 0)
        amt = float(raw_amt) if raw_amt else 0
    except: amt = 0

    signals = {
        "ml_anomaly": random.uniform(0.4, 0.6),
        "vector_sim": vector_store.get_max_similarity(txn),
        "graph_mule": 0.5,
        "velocity": 0.8 if amt > 10000 else 0.2,
        "behavior_dev": 0.6,
        "time_anomaly": 0.3
    }
    
    start_time = time.time()
    risk_score, matches, source = hindsight.predict(txn, signals)
    explanation = base_agent.explain_decision(txn, risk_score, signals)
    debate = base_agent.generate_debate(txn, risk_score, signals)
    latency_ms = int((time.time() - start_time) * 1000)
    
    emb = vector_store.get_transaction_embedding(txn)
    hindsight.retain(txn, emb, risk_score)
    
    return {
        "risk_score": risk_score,
        "decision": "BLOCK" if risk_score > 0.6 else "ALLOW",
        "agents": {
            "risk_agent": {"score": signals['ml_anomaly'], "reasons": ["Unusual amount", "Pattern match"]},
            "behavior_agent": {"score": signals['behavior_dev'], "reasons": ["Location shift"]},
            "memory_agent": {"score": risk_score, "reasons": [explanation]}
        },
        "explanation": explanation,
        "debate": debate,
        "latency": f"{latency_ms}ms"
    }

# --- STATIC FILES & FRONTEND ROUTING ---

# Mount the React build directory
if os.path.exists("frontend/dist"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # If the path matches an API route, let FastAPI handle it (already handled above)
    # Otherwise, serve index.html for React Router
    if os.path.exists("frontend/dist/index.html"):
        return FileResponse("frontend/dist/index.html")
    return {"error": "Frontend build not found. Run 'npm run build' in frontend folder."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

