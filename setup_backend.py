import os

base_dir = "backend"
os.makedirs(base_dir, exist_ok=True)

db_code = """import sqlite3

def init_db():
    conn = sqlite3.connect('fraudguard.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS transactions
                 (id TEXT PRIMARY KEY, amount REAL, vpa TEXT, city TEXT, risk_score REAL, final_decision TEXT, feedback TEXT)''')
    conn.commit()
    conn.close()

def log_txn(txn):
    conn = sqlite3.connect('fraudguard.db')
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO transactions VALUES (?,?,?,?,?,?,?)", 
              (txn['txnId'], txn['amount'], txn['vpa'], txn['city'], txn.get('risk_score', 0), txn.get('decision', 'N/A'), txn.get('feedback', 'pending')))
    conn.commit()
    conn.close()

def get_logs():
    conn = sqlite3.connect('fraudguard.db')
    c = conn.cursor()
    c.execute("SELECT * FROM transactions ORDER BY rowid DESC")
    rows = c.fetchall()
    conn.close()
    return [{"txnId": r[0], "amount": r[1], "vpa": r[2], "city": r[3], "risk_score": r[4], "decision": r[5], "feedback": r[6]} for r in rows]
"""

hindsight_code = """import requests

# Hindsight Vectorize SDK Wrapper
HINDSIGHT_URL = "http://localhost:8888"

def retain(txn, decision, feedback):
    # Store experience in vector context
    try:
        requests.post(f"{HINDSIGHT_URL}/retain", json={"data": txn, "decision": decision, "feedback": feedback}, timeout=2)
    except:
        pass # Mock if docker not running

def recall(txn):
    # Retrieve similar past mistakes/fraud cases
    try:
        res = requests.post(f"{HINDSIGHT_URL}/recall", json={"query": txn}, timeout=2)
        return res.json().get('matches', [])
    except:
        return []

def reflect(txnId, correct_label):
    # Adjust learning loops based on Wrong click
    try:
        requests.post(f"{HINDSIGHT_URL}/reflect", json={"id": txnId, "label": correct_label}, timeout=2)
    except:
        pass
"""

risk_code = """def evaluate_rules(txn):
    score = 0.0
    reasons = []
    if txn['amount'] > 50000:
        score += 0.4
        reasons.append("High amount threshold")
    # Add simple rules
    return {"score": score, "reasons": reasons}
"""

behavior_code = """def analyze_pattern(txn):
    score = 0.0
    reasons = []
    # Dummy logic to mimic comparing past patterns
    if txn['city'].lower() not in ['mumbai', 'delhi', 'bangalore']:
        score += 0.3
        reasons.append("Unusual location variance")
    return {"score": score, "reasons": reasons}
"""

memory_code = """from .hindsight_service import recall

def retrieve_context(txn):
    matches = recall(txn)
    score = 0.0
    reasons = []
    if len(matches) > 0:
        score += 0.7
        reasons.append(f"Matched {len(matches)} historical fraud topologies.")
    return {"score": score, "matches": matches, "reasons": reasons}
"""

controller_code = """from .risk_engine import evaluate_rules
from .behavior_agent import analyze_pattern
from .memory_agent import retrieve_context
from .database import log_txn
from .hindsight_service import retain

def analyze_transaction(txn):
    # 1. multi-agent orchestration
    r1 = evaluate_rules(txn)
    r2 = analyze_pattern(txn)
    r3 = retrieve_context(txn)
    
    final_score = min(1.0, (r1['score'] + r2['score'] + r3['score']) / 1.5)
    decision = "FRAUD" if final_score > 0.6 else "SAFE"
    
    txn['risk_score'] = final_score
    txn['decision'] = decision
    
    log_txn(txn)
    retain(txn, decision, "pending")
    
    return {
        "risk_score": final_score,
        "decision": decision,
        "agents": {
            "risk_agent": r1,
            "behavior_agent": r2,
            "memory_agent": r3
        }
    }
"""

main_code = """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn

from backend.database import init_db, get_logs
from backend.agent_controller import analyze_transaction
from backend.hindsight_service import reflect

app = FastAPI(title="FraudGuard AI MVP")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

init_db()

class Txn(BaseModel):
    txnId: str
    amount: float
    vpa: str
    city: str

@app.post("/analyze_transaction")
async def analyze(txn: Txn):
    res = analyze_transaction(txn.dict())
    return res

@app.post("/feedback")
async def feedback(data: Dict[str, Any]):
    # Learn from mistakes
    reflect(data['txnId'], data['label'])
    return {"status": "reflected", "message": "Hindsight updated!"}

@app.get("/memory_logs")
async def mem_logs():
    return {"logs": get_logs()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
"""

with open(f"{base_dir}/database.py", "w") as f: f.write(db_code)
with open(f"{base_dir}/hindsight_service.py", "w") as f: f.write(hindsight_code)
with open(f"{base_dir}/risk_engine.py", "w") as f: f.write(risk_code)
with open(f"{base_dir}/behavior_agent.py", "w") as f: f.write(behavior_code)
with open(f"{base_dir}/memory_agent.py", "w") as f: f.write(memory_code)
with open(f"{base_dir}/agent_controller.py", "w") as f: f.write(controller_code)
with open(f"{base_dir}/__init__.py", "w") as f: f.write("")
with open("main.py", "w") as f: f.write(main_code)

print("Backend scaffolded successfully!")
