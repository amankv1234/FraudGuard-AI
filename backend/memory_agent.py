from .hindsight_service import recall

def retrieve_context(txn):
    matches = recall(txn)
    score = 0.0
    reasons = []
    if len(matches) > 0:
        score += 0.7
        reasons.append(f"Matched {len(matches)} historical fraud topologies.")
    return {"score": score, "matches": matches, "reasons": reasons}
