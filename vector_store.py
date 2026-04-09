import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict

class VectorStore:
    """Simulates Cosmos DB Vector Index for Semantic Fraud Matching."""
    
    def __init__(self):
        # Known Fraud DNA Patters (Mock Embeddings)
        # In production, these come from OpenAI Embeddings
        self.fraud_patterns = {
            "QR_swap": np.random.rand(1, 1536),
            "mule_ring": np.random.rand(1, 1536),
            "velocity_burst": np.random.rand(1, 1536),
            "device_hijack": np.random.rand(1, 1536)
        }
        self.feature_names = list(self.fraud_patterns.keys())
        self.patterns_matrix = np.vstack(list(self.fraud_patterns.values()))

    def get_transaction_embedding(self, txn: Dict) -> np.ndarray:
        """
        Mock embedding generation.
        In production: openai.embeddings.create(input=str(txn))
        """
        # Deterministic mock based on amount and txnType for demo consistency
        try:
            amt = float(txn.get('amount', 0))
            seed = int(amt) % 1000
        except (ValueError, TypeError):
            seed = random.randint(0, 999)
            
        np.random.seed(seed)
        return np.random.rand(1, 1536)

    def find_similarity(self, txn_embedding: np.ndarray) -> Dict[str, float]:
        """Calculates cosine similarity against known fraud patterns."""
        similarities = cosine_similarity(txn_embedding, self.patterns_matrix)[0]
        results = {name: float(sim) for name, sim in zip(self.feature_names, similarities)}
        return results

    def get_max_similarity(self, txn: Dict) -> float:
        emb = self.get_transaction_embedding(txn)
        results = self.find_similarity(emb)
        return max(results.values())
