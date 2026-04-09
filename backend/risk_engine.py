def evaluate_rules(txn):
    score = 0.0
    reasons = []
    if txn['amount'] > 50000:
        score += 0.4
        reasons.append("High amount threshold")
    # Add simple rules
    return {"score": score, "reasons": reasons}
