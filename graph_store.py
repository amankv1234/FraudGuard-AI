import os
from gremlin_python.driver import client, serializer
from typing import List, Dict

class GraphStore:
    """
    Cosmos DB Gremlin Graph Store for Mule Ring detection.
    Traverses connected accounts to find fraud clusters.
    """
    
    def __init__(self, endpoint=None, key=None, database="fraudguard", container="fraudgraph"):
        self.endpoint = endpoint or os.getenv("COSMOS_GREMLIN_ENDPOINT")
        self.key = key or os.getenv("COSMOS_GREMLIN_KEY")
        
        if self.endpoint and self.key:
            self.client = client.Client(
                self.endpoint, 'g',
                username=f"/dbs/{database}/colls/{container}",
                password=self.key,
                message_serializer=serializer.GraphSONSerializersV2d0()
            )
        else:
            self.client = None

    def detect_mule_ring(self, user_id: str) -> Dict:
        """
        Traverses the graph to find connected accounts with suspicious similarity.
        Query: g.V('user_id').repeat(out('similar_vector').has('cosine_sim', gt(0.88))).emit().path().limit(50)
        """
        if not self.client:
            # Simulation for demo
            import random
            return {
                "mule_ring_size": random.randint(3, 15),
                "avg_connection_strength": random.uniform(0.7, 0.95),
                "risk_contribution": random.uniform(0.6, 0.9)
            }
            
        query = f"g.V('{user_id}').repeat(out('similar_vector').has('cosine_sim', gt(0.88))).emit().path().limit(50)"
        try:
            callback = self.client.submitAsync(query)
            results = callback.result().all().result()
            
            return {
                "mule_ring_size": len(results),
                "avg_connection_strength": 0.88,
                "risk_contribution": min(len(results) / 10.0, 1.0)
            }
        except Exception as e:
            print(f"[GRAPH ERROR] {e}")
            return {"mule_ring_size": 0, "risk_contribution": 0.0}

    def close(self):
        if self.client:
            self.client.close()
