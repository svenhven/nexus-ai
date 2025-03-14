from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
import sqlite3

app = FastAPI(title="Nexus AI")

# Tambahkan CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gunakan model pre-trained untuk sentiment-analysis
try:
    nlp = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    print("Model loaded successfully:", nlp("Test")[0])  # Debugging
except Exception as e:
    print(f"Error loading model: {e}")

# Koneksi SQLite
def get_db():
    conn = sqlite3.connect("db/nexus.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("CREATE TABLE IF NOT EXISTS queries (id INTEGER PRIMARY KEY, text TEXT, result TEXT)")
    conn.commit()
    conn.close()

init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to Nexus AI"}

@app.get("/analyze/{text}")
def analyze_text(text: str):
    try:
        result = nlp(text)
        sentiment = result[0]
        return {"text": text, "sentiment": {"label": sentiment["label"], "score": sentiment["score"]}}
    except Exception as e:
        return {"text": text, "sentiment": {"label": "ERROR", "score": 0.0}, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)