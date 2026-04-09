import time
import random
import uuid
from datetime import datetime

class UPISimulator:
    """Generates synthetic UPI 2.0 transaction data."""
    
    LOCATIONS = {
        "Mumbai": (19.0760, 72.8777),
        "Delhi": (28.6139, 77.2090),
        "Bangalore": (12.9716, 77.5946),
        "Hyderabad": (17.3850, 78.4867),
        "Chennai": (13.0827, 80.2707)
    }

    VPA_DOMAINS = ["@okaxis", "@okicici", "@okhdfcbank", "@paytm", "@ybl"]

    def __init__(self):
        self.user_base = [f"user_{i:03d}" for i in range(100)]
        self.merchants = [f"merchant_{i:02d}" for i in range(20)]

    def generate_transaction(self, fraud_type=None):
        user_id = random.choice(self.user_base)
        merchant_id = random.choice(self.merchants)
        city, (lat, lng) = random.choice(list(self.LOCATIONS.items()))
        
        txn = {
            "txnId": str(uuid.uuid4()),
            "userId": user_id,
            "vpa": f"{user_id}{random.choice(self.VPA_DOMAINS)}",
            "merchantVpa": f"{merchant_id}@merchant",
            "amount": float(random.randint(10, 50000)),
            "lat": lat + random.uniform(-0.01, 0.01),
            "lng": lng + random.uniform(-0.01, 0.01),
            "city": city,
            "deviceFingerprint": uuid.uuid4().hex[:12],
            "txnType": random.choice(["QR_PUSH", "COLLECT", "INTENT"]),
            "timestamp": datetime.now().isoformat()
        }

        if fraud_type == "velocity":
            txn["amount"] = 50000
            txn["txnType"] = "QR_PUSH"
        elif fraud_type == "travel":
            txn["lat"] = 28.6139 # Delhi
            txn["lng"] = 77.2090
            # Context would need to show they were elsewhere 5 mins ago
            
        return txn

    def stream_data(self, interval=1.0):
        while True:
            yield self.generate_transaction()
            time.sleep(interval)
