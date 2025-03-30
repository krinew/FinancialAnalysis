import pathway as pw
import requests
import json

from transformers import pipeline
embedder = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")
# Step 1: Define the input schema
class TransactionSchema(pw.Schema):
    account_id: str
    user_id: int
    name: str
    official_name: str
    type: str
    subtype: str
    available_balance: float
    current_balance: float
    currency_code: str
    mask: str
    description: str  # Add this
FETCHAI_API_KEY="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NDU5NjI3MzQsImlhdCI6MTc0MzM3MDczNCwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiI4Y2MzNGI3ODhmMWNlNmJmM2MyYWVhNDgiLCJzY29wZSI6ImF2OnJvIiwic3ViIjoiOGEwYjVkYzU5OTZmN2M4ZmQwNmI4YzhjYmI5ZWY1ZGY3MTYxNjJkNjkxOGYwM2I4In0.X58pAfswc9VdR3jUwxLgUq8qC891YaD5QjDygSDGw9w6jer-Dq9YtSzjBH9neJrT_YVJ4leQnBlmQezQzw3x5ua4M8oLa8sCJDfWrkoTtyQ0i9ek08mDsTpQ-JcS0p438Bd6AXBd0rVOMSog91F-0HWUsAoVXRx3J5pM3mNXN7NfalC4KJW6k3SzqVU3Tby9xirpTndvoPFQcTCeqc0twujA95KFiI3tRFrKcf42rS9MVGauinQP7LcbX8BhR1l0xOX5vpr5XX70QHmf96ITCJNS5mpzMWYLvjdWrbTDmOGddTunoocXVfaGEenQIXz3Mrfom0ZMsD-h5SFxRNNN_A"
FETCHAI_RAG_AGENT_ID="test-agent://agent1q0vpw20pafw25gy5t5kket24na5ugjy492anagg0w278v5p3uhqpq3vnsye"
# Step 2: Create an input stream from Django
@pw.io.http
def transaction_input_stream():
    return pw.input_table(TransactionSchema, url="http://localhost:8000/api/transactions")

# Step 3: Perform any real-time data transformations
def process_data(table):
    table = table.with_columns(
        embedding=pw.apply(generate_embedding, pw.col("description"))
    )
    table = table.with_columns(
        insights=pw.apply(send_to_rag_agent, pw.col("embedding"), pw.col("description"))
    )
    return table

def generate_embedding(description):
    return embedder(description)[0]

# Step 4: Create an output vector store (like a real-time vectorized DB)
@pw.io.vector_store
def output_store():
    return pw.output_table().with_columns(
        insights=pw.col("insights")
    )

# Step 5: Connect the pipeline
def run_pipeline():
    transactions = transaction_input_stream()
    processed_data = process_data(transactions)
    output_store().insert(processed_data)
    
def generate_embedding(description):
    return embedder(description)[0]
    
def send_to_rag_agent(embedding, description):
    url = f"https://api.fetch.ai/agents/{FETCHAI_RAG_AGENT_ID}/query"
    headers = {
        "Authorization": f"Bearer {FETCHAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "embedding": embedding,
        "description": description,
        "query": "Provide financial insights based on this transaction."
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        if response.status_code == 200:
            return response.json().get("insight", "No insight available")
        else:
            return f"Error: {response.status_code}, {response.text}"
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    run_pipeline()
