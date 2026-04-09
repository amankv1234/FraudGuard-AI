import requests

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
