from .risk_engine import evaluate_rules
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
