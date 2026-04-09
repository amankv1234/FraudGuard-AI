import numpy as np
import time
import json
import os
import time
from typing import List, Dict, Tuple
from vector_store import VectorStore
from dna_engine import FraudDNA

class HindsightAgent:
    """
    AI Agent that learns from mistakes using Hindsight Memory.
    Implements: retain(), recall(), reflect()
    """
    
    def __init__(self, dna: FraudDNA, vector_store: VectorStore):
        self.dna = dna
        self.vector_store = vector_store
        self.memory = [] # List of {txn, embedding, decision, label}
        self.experience_bank = [] # Successful learning tokens
        
    def retain(self, txn: Dict, embedding: np.ndarray, prediction: float, label: str = "pending"):
        """Store transaction in short-term memory."""
        self.memory.append({
            "txn": txn,
            "embedding": embedding,
            "prediction": prediction,
            "label": label,
            "timestamp": time.time()
        })
        # Keep memory manageable
        if len(self.memory) > 1000:
            self.memory.pop(0)

    def recall(self, txn: Dict) -> List[Dict]:
        """Search memory for similar historical cases."""
        if not self.memory:
            return []
            
        current_emb = self.vector_store.get_transaction_embedding(txn)
        similar_cases = []
        
        for item in self.memory:
            similarity = np.dot(current_emb, item['embedding'].T)[0][0] / (
                np.linalg.norm(current_emb) * np.linalg.norm(item['embedding'])
            )
            if similarity > 0.92: # High similarity threshold
                similar_cases.append({**item, "similarity": float(similarity)})
                
        # Sort by similarity
        similar_cases.sort(key=lambda x: x['similarity'], reverse=True)
        return similar_cases[:3]

    def predict(self, txn: Dict, signals: Dict) -> Tuple[float, List[Dict]]:
        """Predict risk using DNA + Hindsight Recall."""
        # 1. Base DNA Prediction
        base_score = self.dna.calculate_risk(signals)
        
        # 2. Hindsight Recall
        historical_matches = self.recall(txn)
        
        # 3. Adjust prediction based on historical mistakes/successes
        final_score = base_score
        adjustment_source = "DNA Analysis"
        
        if historical_matches:
            # If we found a case that we got WRONG in the past, correct it now
            for match in historical_matches:
                if match['label'] == 'fraud' and match['prediction'] < 0.5:
                    # We previously missed this! Boost the score.
                    final_score = max(final_score, 0.85)
                    adjustment_source = "Hindsight Memory (Missed Fraud Recovery)"
                elif match['label'] == 'legit' and match['prediction'] > 0.6:
                    # We previously False Positived this! Lower the score.
                    final_score = min(final_score, 0.2)
                    adjustment_source = "Hindsight Memory (False Positive Avoidance)"

        return min(max(final_score, 0.0), 1.0), historical_matches, adjustment_source

    def reflect(self, txn_id: str, correct_label: str):
        """Learn from a mistake."""
        # Find the transaction in memory
        target_item = None
        for item in self.memory:
            if item['txn']['txnId'] == txn_id:
                target_item = item
                break
        
        if not target_item:
            return False
            
        # Update label
        old_label = target_item['label']
        target_item['label'] = correct_label
        
        # Reflection Step: Modify DNA Weights slightly if it was a catastrophic error
        is_mistake = (correct_label == 'fraud' and target_item['prediction'] < 0.5) or \
                     (correct_label == 'legit' and target_item['prediction'] > 0.6)
                     
        if is_mistake:
            # Evolution Step: Mutate DNA to be more sensitive to this signal
            self.dna.mutate(factor=0.15)
            self.experience_bank.append({
                "type": "correction",
                "txnId": txn_id,
                "lesson": f"Learned that pattern was actually {correct_label}"
            })
            return True
        return False

    def save_memory(self, filename="experience_bank.json"):
        """Persist agent memory and DNA to disk."""
        data = {
            "weights": self.dna.weights,
            "memory": [],
            "experience_bank": []
        }
        for m in self.memory:
            data["memory"].append({
                "txn": m.get("txn"),
                "embedding": m.get("embedding").tolist() if hasattr(m.get("embedding"), "tolist") else m.get("embedding"),
                "prediction": m.get("prediction"),
                "label": m.get("label"),
                "timestamp": m.get("timestamp", time.time())
            })
        for eb in self.experience_bank:
            eb_copy = dict(eb)
            if "embedding" in eb_copy and hasattr(eb_copy["embedding"], "tolist"):
                eb_copy["embedding"] = eb_copy["embedding"].tolist()
            data["experience_bank"].append(eb_copy)
            
        with open(filename, 'w') as f:
            json.dump(data, f)
            
    def load_memory(self, filename="experience_bank.json"):
        """Load agent memory and DNA from disk."""
        if not os.path.exists(filename):
            print(f"[MEMORY] No existing memory found at {filename}")
            return
        try:
            with open(filename, 'r') as f:
                data = json.load(f)
            self.dna.weights = data.get("weights", self.dna.weights)
            
            # Reconstruct Experience Bank
            for eb in data.get("experience_bank", []):
                if "embedding" in eb:
                    eb["embedding"] = np.array(eb["embedding"])
                self.experience_bank.append(eb)
                
            # Reconstruct Short-term Memory
            for m in data.get("memory", []):
                self.memory.append({
                    "txn": m["txn"],
                    "embedding": np.array(m["embedding"]) if m.get("embedding") else None,
                    "prediction": m["prediction"],
                    "label": m["label"],
                    "timestamp": m.get("timestamp", time.time())
                })
            print(f"[MEMORY] Loaded {len(self.memory)} memories and {len(self.experience_bank)} experiences. Restored DNA weights.")
        except Exception as e:
            print(f"[MEMORY] Failed to load {filename}: {e}")

