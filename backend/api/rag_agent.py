from fetchai import Agent
import requests
from sentence_transformers import util
import torch
from transformers import pipeline
class RAGFinanceAgent(Agent):
    def __init__(self, vector_store_url):
        super().__init__()
        self.vector_store_url = vector_store_url
        self.embedder = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")

    def get_relevant_data(self, user_query):
        # Convert query to embedding
        query_embedding = self.embedder(user_query)[0]

        # Fetch data from Pathway vector store
        response = requests.get(f"{self.vector_store_url}/transactions")
        transactions = response.json()

        # Perform similarity search using cosine similarity
        embeddings = torch.tensor([txn['embedding'] for txn in transactions])
        query_embedding_tensor = torch.tensor(query_embedding).unsqueeze(0)

        similarity_scores = util.cos_sim(query_embedding_tensor, embeddings).squeeze()
        top_indices = torch.argsort(similarity_scores, descending=True)[:5]

        relevant_transactions = [transactions[i] for i in top_indices]
        return relevant_transactions

    def generate_insight(self, user_query):
        relevant_data = self.get_relevant_data(user_query)
        if not relevant_data:
            return "No relevant insights found."

        # Generate insight using Fetch AI's LLM
        prompt = f"Based on the following financial data: {relevant_data}\nUser Query: {user_query}\nProvide personalized financial insights."
        response = self.fetchai_generate(prompt)
        return response

    def fetchai_generate(self, prompt):
        # Send prompt to Fetch AI's LLM endpoint
        fetchai_url = "https://api.fetch.ai/v1/generate"
        headers = {"Authorization": "Bearer YOUR_API_KEY"}
        data = {"prompt": prompt, "max_tokens": 200}
        response = requests.post(fetchai_url, json=data, headers=headers)
        return response.json().get("text")
