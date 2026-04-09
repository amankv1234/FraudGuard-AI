def analyze_pattern(txn):
    score = 0.0
    reasons = []
    # Dummy logic to mimic comparing past patterns
    if txn['city'].lower() not in ['mumbai', 'delhi', 'bangalore']:
        score += 0.3
        reasons.append("Unusual location variance")
    return {"score": score, "reasons": reasons}
