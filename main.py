from fastapi import FastAPI
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
