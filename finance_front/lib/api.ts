const API_BASE_URL = "http://localhost:8000/api"; // Update with your actual backend URL

export async function fetchTransactions() {
    try {
        const response = await fetch(`${API_BASE_URL}/fetch_transaction_view/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Ensure cookies or authentication headers are sent
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        throw error;
    }
}

export async function fetchAccounts() {
    try {
        const response = await fetch(`${API_BASE_URL}/fetch_accounts_without_user/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch accounts:", error);
        throw error;
    }
}

export async function createSandboxToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/create_sandbox_token_view/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create sandbox token:", error);
        throw error;
    }
}

// Fetch stock data
export async function fetchStockData(symbols: string = "AAPL,TSLA") {
    try {
        const response = await fetch(`${API_BASE_URL}/fetch-stock-data/?symbols=${encodeURIComponent(symbols)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch stock data:", error);
        throw error;
    }
}