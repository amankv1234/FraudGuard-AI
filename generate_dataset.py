"""
Synthetic Credit Card Fraud Dataset Generator
Mimics the Kaggle ULB creditcard.csv schema (Amount, V1-V28, Class)
Used when real dataset has permission/access issues.
"""
import pandas as pd
import numpy as np
import os

def generate_synthetic_fraud_data(n_samples=5000, fraud_ratio=0.02, output_path="creditcard_synthetic.csv"):
    print(f"[SYNTH] Generating {n_samples} synthetic fraud records ({fraud_ratio*100}% fraud)...")
    np.random.seed(42)
    
    n_fraud = int(n_samples * fraud_ratio)
    n_legit = n_samples - n_fraud

    # Legitimate transactions
    legit_amount = np.random.exponential(scale=88.0, size=n_legit)
    legit_features = np.random.randn(n_legit, 28)
    legit_time = np.linspace(0, 172800, n_legit)

    # Fraudulent transactions (higher amounts, anomalous features)
    fraud_amount = np.random.exponential(scale=200.0, size=n_fraud)
    fraud_features = np.random.randn(n_fraud, 28) + np.random.uniform(1.5, 4.0, (n_fraud, 28)) # Anomaly shift
    fraud_time = np.random.uniform(0, 172800, n_fraud)

    # Build DataFrames
    legit_data = np.hstack([legit_time.reshape(-1,1), legit_features, legit_amount.reshape(-1,1), np.zeros((n_legit, 1))])
    fraud_data = np.hstack([fraud_time.reshape(-1,1), fraud_features, fraud_amount.reshape(-1,1), np.ones((n_fraud, 1))])
    
    all_data = np.vstack([legit_data, fraud_data])
    np.random.shuffle(all_data)
    
    cols = ['Time'] + [f'V{i}' for i in range(1, 29)] + ['Amount', 'Class']
    df = pd.DataFrame(all_data, columns=cols)
    df['Class'] = df['Class'].astype(int)
    
    out = os.path.abspath(output_path)
    df.to_csv(out, index=False)
    print(f"[DONE] Saved to: {out}")
    print(f"[INFO] Records: {len(df)} | Fraud: {df['Class'].sum()} | Legit: {(df['Class']==0).sum()}")
    return out

if __name__ == "__main__":
    generate_synthetic_fraud_data()
