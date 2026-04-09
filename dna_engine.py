import numpy as np
import random
from typing import List, Dict

class FraudDNA:
    """
    Core Evolution Engine that simulates Genetic Algorithm mutations 
    for fraud feature weights.
    """
    def __init__(self, weights: Dict[str, float] = None):
        # Default Weights (Baseline)
        self.features = [
            "ml_anomaly", "vector_sim", "graph_mule", 
            "velocity", "behavior_dev", "time_anomaly"
        ]
        if weights:
            self.weights = weights
        else:
            self.weights = {f: 1.0/len(self.features) for f in self.features}
            
        self.fitness_score = 0.0
        self.mutation_history = []

    def calculate_risk(self, signals: Dict[str, float]) -> float:
        """Σ (Signal_i × Weight_i)"""
        score = sum(signals.get(f, 0) * self.weights.get(f, 0) for f in self.features)
        return min(max(score, 0.0), 1.0)

    def mutate(self, factor: float = 0.1):
        """Randomly mutates feature weights and re-normalizes."""
        feature_to_mutate = random.choice(self.features)
        change = random.uniform(-factor, factor)
        
        old_val = self.weights[feature_to_mutate]
        self.weights[feature_to_mutate] = max(0.01, self.weights[feature_to_mutate] + change)
        
        # Re-normalize to sum to 1.0
        total = sum(self.weights.values())
        for f in self.weights:
            self.weights[f] /= total
            
        self.mutation_history.append(f"Mutated {feature_to_mutate}: {old_val:.2f} -> {self.weights[feature_to_mutate]:.2f}")

    def crossover(self, other: 'FraudDNA') -> 'FraudDNA':
        """Combines weights from two 'Parents'."""
        child_weights = {}
        for f in self.features:
            child_weights[f] = (self.weights[f] + other.weights[f]) / 2.0
        return FraudDNA(child_weights)

class EvolutionManager:
    """Manages a population of FraudDNA 'individuals' and evolves them."""
    def __init__(self, population_size: int = 10):
        self.population = [FraudDNA() for _ in range(population_size)]
        self.generation = 1

    def evolve_population(self, feedback_data: List[Dict]):
        """
        Feedback loop: Evaluate fitness, select top performers, and mate them.
        In a real system, feedback comes from verified fraud/non-fraud labels.
        """
        # 1. Evaluate Fitness (simplified: high score on known fraud, low on legit)
        for dna in self.population:
            # Placeholder for fitness evaluation logic
            dna.fitness_score = random.uniform(0, 1) # Simulation
            
        # 2. Selection: Sort by fitness
        self.population.sort(key=lambda x: x.fitness_score, reverse=True)
        
        # 3. Best survives
        elite = self.population[:2]
        
        # 4. Generate next generation
        new_population = [elite[0], elite[1]]
        while len(new_population) < 10:
            parent1, parent2 = random.sample(elite, 2)
            child = parent1.crossover(parent2)
            if random.random() < 0.3: # 30% Mutation rate
                child.mutate()
            new_population.append(child)
            
        self.population = new_population
        self.generation += 1
        return elite[0] # Return the current best DNA
