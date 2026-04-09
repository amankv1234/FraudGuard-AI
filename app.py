import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import time
import random
from datetime import datetime
from simulator import UPISimulator
from dna_engine import FraudDNA, EvolutionManager
from vector_store import VectorStore
from agent import FraudAgent
from graph_store import GraphStore

# Page Config
st.set_page_config(page_title="FraudGuard AI v2.0", page_icon="🛡️", layout="wide")

# Custom CSS for Premium Look
st.markdown("""
<style>
    .main { background-color: #0e1117; color: #ffffff; }
    .stMetric { background-color: #1e2130; padding: 15px; border-radius: 10px; border: 1px solid #3e4150; }
    .fraud-block { border-left: 5px solid #ff4b4b; background-color: #2e1111; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .allow-block { border-left: 5px solid #28a745; background-color: #112e11; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .dna-tag { background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%); padding: 2px 8px; border-radius: 5px; font-size: 10px; }
</style>
""", unsafe_allow_html=True)

# Initialize Session State
if 'dna_manager' not in st.session_state:
    st.session_state.dna_manager = EvolutionManager()
    st.session_state.current_dna = st.session_state.dna_manager.population[0]
    st.session_state.txn_history = []
    st.session_state.fraud_count = 0
    st.session_state.total_processed = 0
    st.session_state.simulator = UPISimulator()
    st.session_state.vector_store = VectorStore()
    st.session_state.agent = FraudAgent()
    st.session_state.graph_store = GraphStore()
    st.session_state.is_running = False

# Sidebar
with st.sidebar:
    st.image("https://img.icons8.com/isometric-line/100/shield.png", width=80)
    st.title("FRAUDGUARD Engine")
    st.divider()
    
    # Chaos Controls
    st.subheader("🛠️ Chaos Engineering")
    eh_partition = st.slider("Event Hub Partition Health", 0, 100, 100)
    latency_spike = st.checkbox("Simulate Latency Spike")
    
    st.divider()
    
    # DNA Evolution Status
    st.subheader("🧬 Fraud DNA Status")
    st.write(f"Generation: {st.session_state.dna_manager.generation}")
    st.json(st.session_state.current_dna.weights)
    
    if st.button("🚀 EVOLVE DNA NOW"):
        st.session_state.current_dna = st.session_state.dna_manager.evolve_population([])
        st.success("DNA Mutated to Generation " + str(st.session_state.dna_manager.generation))

# Main Dashboard
col_t1, col_t2 = st.columns([3, 1])
with col_t1:
    st.title("🛡️ FraudGuard AI v2.0: Command Center")
    st.caption("Sub-400ms UPI-Scale Evolutionary Fraud Detection")

with col_t2:
    if not st.session_state.is_running:
        if st.button("▶️ START INGESTION", type="primary", use_container_width=True):
            st.session_state.is_running = True
            st.rerun()
    else:
        if st.button("⏹️ STOP SYSTEM", use_container_width=True):
            st.session_state.is_running = False
            st.rerun()

# Real-time Metrics
m1, m2, m3, m4 = st.columns(4)
m1.metric("Throughput", f"{50 + random.uniform(-2, 2) if st.session_state.is_running else 0:.1f}M TPS", "Peak Load")
m2.metric("P99 Latency", f"{397 + (50 if latency_spike else 0) if st.session_state.is_running else 0}ms", "-12ms")
m3.metric("Detected Fraud", st.session_state.fraud_count, f"+{random.randint(0,5)} last min")
m4.metric("FP Reduction", "83.4%", "DNA Benefit")

# Create Main Layout Columns
col_main, col_alerts = st.columns([2, 1])

with col_main:
    # Live Traffic Chart
    st.subheader("📡 Multi-Region Ingestion Flow")
    chart_data = pd.DataFrame({
        'Time': [datetime.now().strftime("%H:%M:%S") for _ in range(10)],
        'Central India': [random.randint(10, 20) for _ in range(10)],
        'South India': [random.randint(8, 15) for _ in range(10)]
    })
    fig = px.area(chart_data, x='Time', y=['Central India', 'South India'], 
                 template="plotly_dark", color_discrete_sequence=['#4b6cb7', '#182848'])
    fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), height=250)
    st.plotly_chart(fig, use_container_width=True)

    # DNA Weight Visualization
    st.subheader("🧬 Evolved Feature Importance")
    df_weights = pd.DataFrame({
        'Feature': st.session_state.current_dna.features,
        'Weight': [st.session_state.current_dna.weights[f] for f in st.session_state.current_dna.features]
    })
    fig_weights = px.bar(df_weights, x='Weight', y='Feature', orientation='h', 
                        color='Weight', template="plotly_dark", color_continuous_scale='Viridis')
    fig_weights.update_layout(margin=dict(l=0, r=0, t=0, b=0), height=300)
    st.plotly_chart(fig_weights, use_container_width=True)

with col_alerts:
    st.subheader("🚨 Real-time Alerts")
    alert_placeholder = st.empty()
    
    # Simulation Loop
    if st.session_state.is_running:
        for _ in range(5): # Process 5 txns per rerun
            # Randomly inject fraud for demo
            fraud_type = random.choice([None, None, None, "velocity", "travel"])
            txn = st.session_state.simulator.generate_transaction(fraud_type)
            
            # 1. Feature Signals
            graph_data = st.session_state.graph_store.detect_mule_ring(txn['userId'])
            signals = {
                "ml_anomaly": random.uniform(0, 0.5) if not fraud_type else random.uniform(0.7, 0.95),
                "vector_sim": st.session_state.vector_store.get_max_similarity(txn),
                "graph_mule": graph_data['risk_contribution'],
                "velocity": 0.1 if not fraud_type else 0.85,
                "behavior_dev": random.uniform(0, 0.4) if not fraud_type else 0.75,
                "time_anomaly": 0.1 if random.randint(0, 10) > 2 else 0.9
            }
            
            # 2. Risk Scoring
            risk_score = st.session_state.current_dna.calculate_risk(signals)
            st.session_state.total_processed += 1
            
            # Display Alert if Risk > 0.6
            if risk_score > 0.6:
                st.session_state.fraud_count += 1
                explanation = st.session_state.agent.explain_decision(txn, risk_score, signals)
                
                with alert_placeholder.container():
                    st.markdown(f"""
                    <div class="fraud-block">
                        <strong>🚨 HIGH RISK: {risk_score:.2f}</strong><br>
                        VPA: {txn['vpa']} | Amount: ₹{txn['amount']}<br>
                        <small>{txn['txnId']}</small>
                    </div>
                    """, unsafe_allow_html=True)
                    st.info(explanation)
            
            st.session_state.txn_history.append({"txn": txn, "score": risk_score})
            if len(st.session_state.txn_history) > 20:
                st.session_state.txn_history.pop(0)
            
            time.sleep(0.5)
        st.rerun()

# History Table
st.divider()
st.subheader("🗄️ Cosmos DB Triple Store: Latent Transaction Memory")
if st.session_state.txn_history:
    hist_data = [{
        "Timestamp": t['txn']['timestamp'],
        "VPA": t['txn']['vpa'],
        "Amount": t['txn']['amount'],
        "Risk": f"{t['score']:.2f}",
        "City": t['txn']['city'],
        "Type": t['txn']['txnType']
    } for t in reversed(st.session_state.txn_history)]
    st.table(hist_data)
else:
    st.info("Start ingestion to see transaction flow...")
