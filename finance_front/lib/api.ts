// api.ts

export interface Transaction {
    id: number;
    amount: string;
    category: string;
    timestamp: string;
    description: string;
  }
  
  export interface CreateTransactionData {
    amount: number;
    category: string;
    description?: string;
  }
  
  export interface UpdateTransactionData {
    amount?: number;
    category?: string;
    description?: string;
  }
  
  const API_BASE = 'http://127.0.0.1:8000/'; // Adjust this if your API is hosted on a different base URL
  
  // Helper function to handle fetch responses
  async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || response.statusText);
    }
    return response.json();
  }
  
  // Get all transactions for the logged-in user
  export async function getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE}/transactions/`, {
      method: 'GET',
      credentials: 'include', // include cookies for authentication
    });
    return handleResponse<Transaction[]>(response);
  }
  
  // Create a new transaction
  export async function createTransaction(data: CreateTransactionData): Promise<{ message: string; transaction_id: number }> {
    const response = await fetch(`${API_BASE}/transactions/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }
  
  // Get details of a specific transaction
  export async function getTransaction(transactionId: number): Promise<Transaction> {
    const response = await fetch(`${API_BASE}/transactions/${transactionId}/`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  }
  
  // Update a specific transaction
  export async function updateTransaction(transactionId: number, data: UpdateTransactionData): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/transactions/${transactionId}/`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }
  
  // Delete a specific transaction
  export async function deleteTransaction(transactionId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/transactions/${transactionId}/`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(response);
  }
  
  // Fetch stock data (e.g., for 'AAPL')
  export async function fetchStockData(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE}/fetch-data/`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  }
  
  // Store stock data by calling the store_data endpoint.
  // Here, we assume a POST request with JSON data. Adjust if your endpoint expects otherwise.
  export async function storeStockData(symbol: string, timestamp: string, closePrice: number): Promise<Response> {
    // If your backend endpoint is modified to accept POST data, then use this function.
    const response = await fetch(`${API_BASE}/store_data/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ symbol, timestamp, close_price: closePrice }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || response.statusText);
    }
    return response;
  }
  
  // Fetch transaction data from an external source via the fetch_transaction_view endpoint.
  export async function fetchTransactionView(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/fetch_transaction_view`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  }  