import pandas as pd
import numpy as np
import os
import json
from hindsight_agent import HindsightAgent
from dna_engine import EvolutionManager
from vector_store import VectorStore

class HindsightTrainer:
    """Trains the Hindsight Agent by populating memory and evolving DNA using historical CSV data."""
    
    def __init__(self, agent: HindsightAgent):
        self.agent = agent

    def train_from_csv(self, file_path: str, limit: int = 1000):
        abs_path = os.path.abspath(file_path)
        if not os.path.exists(abs_path):
            print(f"Error: Dataset not found at {abs_path}")
            return

        print(f"[TRAIN] Initializing Training Loop on {abs_path}...")
        try:
            df = pd.read_csv(abs_path, encoding='utf-8').head(limit)
        except PermissionError:
            print("[ERROR] PermissionError: Close the file if open in Excel, then retry.")
            return
        except Exception as e:
            print(f"[ERROR] Error reading CSV: {e}")
            return
        
        # 1. Experience Retention (Memory Building)
        for _, row in df.iterrows():
            # Map standard fraud dataset columns to our UPI format
            # Typical Kaggle columns: Amount, Time, Class, V1...V28
            txn = {
                "txnId": f"HIST-{_}",
                "amount": row.get('Amount', 0),
                "vpa": "historical_user@upi",
                "city": "Unknown (Historical)",
                "timestamp": str(row.get('Time', '0')),
                "is_fraud": int(row.get('Class', 0))
            }
            
            # Predict & Reflect (The Learning Loop)
            # Create mock signals based on PCA features if available, else random
            signals = {
                "ml_anomaly": 0.8 if txn['is_fraud'] else 0.2,
                "vector_sim": 0.5,
                "graph_mule": 0.4,
                "velocity": 0.5,
                "behavior_dev": 0.5,
                "time_anomaly": 0.2
            }
            
            # Predict
            score, matches, source = self.agent.predict(txn, signals)
            
            # Learn: If prediction differs from actual Class, Reflect!
            actual = 'fraud' if txn['is_fraud'] == 1 else 'legit'
            predicted = 'fraud' if score > 0.6 else 'legit'
            
            if predicted != actual:
                self.agent.reflect(txn['txnId'], actual)
                print(f"Reflected on HIST-{_}: Mistake corrected via Hindsight.")

            # Store in Vector Memory
            emb = np.random.rand(1, 1536) # Mock embedding for historical data
            self.agent.experience_bank.append({
                "txn": txn,
                "embedding": emb,
                "risk_score": score,
                "label": actual
            })

        print(f"[DONE] Training Complete. Experience Bank now has {len(self.agent.experience_bank)} events.")
        print(f"[DNA] Final Weights: {self.agent.dna.weights}")

if __name__ == "__main__":
    # Bootstrap for standalone testing
    dna_manager = EvolutionManager()
    vector_store = VectorStore()
    agent = HindsightAgent(dna_manager.population[0], vector_store)
    
    trainer = HindsightTrainer(agent)
    # trainer.train_from_csv('creditcard.csv') # Uncomment once user provides file
