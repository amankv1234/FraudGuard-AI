import sqlite3

def init_db():
    conn = sqlite3.connect('fraudguard.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS transactions
                 (id TEXT PRIMARY KEY, amount REAL, vpa TEXT, city TEXT, risk_score REAL, final_decision TEXT, feedback TEXT)''')
    conn.commit()
    conn.close()

def log_txn(txn):
    conn = sqlite3.connect('fraudguard.db')
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO transactions VALUES (?,?,?,?,?,?,?)", 
              (txn['txnId'], txn['amount'], txn['vpa'], txn['city'], txn.get('risk_score', 0), txn.get('decision', 'N/A'), txn.get('feedback', 'pending')))
    conn.commit()
    conn.close()

def get_logs():
    conn = sqlite3.connect('fraudguard.db')
    c = conn.cursor()
    c.execute("SELECT * FROM transactions ORDER BY rowid DESC")
    rows = c.fetchall()
    conn.close()
    return [{"txnId": r[0], "amount": r[1], "vpa": r[2], "city": r[3], "risk_score": r[4], "decision": r[5], "feedback": r[6]} for r in rows]
