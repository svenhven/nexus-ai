from transformers import pipeline

class TextAnalyzer:
    def __init__(self):
        self.nlp = pipeline("sentiment-analysis", model="distilbert-base-uncased")

    def analyze(self, text: str):
        result = self.nlp(text)
        return {"label": result[0]["label"], "score": result[0]["score"]}

    def summarize(self, text: str):
        # Placeholder untuk summarization (bisa diperluas nanti)
        return text[:100] + "..." if len(text) > 100 else text