# Finance Management App - Backend

## Overview
This Django backend provides API endpoints for managing financial transactions, integrating with Plaid for bank account and transaction data, and offering a finance-based chatbot. The backend supports user authentication and interacts with Pathway for real-time financial analysis.

## Features
- **Transaction Management**: Create, list, update, and delete transactions.
- **Plaid Integration**: Fetch bank account details and transactions.
- **Finance Chatbot**: Provides financial insights based on user transactions.
- **Sandbox Token Handling**: Generates sandbox access tokens for testing with Plaid.
- **Pathway Integration**: Sends transaction data for real-time processing.

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Python 3.x
- Django
- Django REST Framework
- Plaid SDK
- Pathway SDK

### Installation Steps
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables (or use Django settings for API keys).
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

## API Endpoints
### 1. **Transaction Management**
- **List Transactions** (GET): `/transactions/`
- **Create Transaction** (POST): `/transactions/`
- **Retrieve Transaction** (GET): `/transactions/<id>/`
- **Update Transaction** (PUT): `/transactions/<id>/`
- **Delete Transaction** (DELETE): `/transactions/<id>/`

### 2. **Plaid Integration**
- **Exchange Token** (POST): `/exchange_token/`
- **Create Sandbox Token** (POST): `/create_sandbox_token/`
- **Fetch Transactions** (GET): `/fetch_transaction_view/`
- **Fetch Accounts** (GET): `/fetch_accounts_without_user/`

### 3. **Finance Chatbot**
- **Chatbot Interaction** (POST): `/chatbot/`
  - Request Body:
    ```json
    {
      "user_id": 1,
      "message": "How can I save more money?"
    }
    ```
  - Response:
    ```json
    {
      "response": "Based on your expenses, consider reducing discretionary spending."
    }
    ```

## Dependencies
- `Django`
- `Django REST Framework`
- `plaid`
- `pathway`
- `transformers` (for chatbot LLM API)

## Notes
- Ensure you replace `access_token` and `client_id` with actual Plaid credentials.
- The chatbot uses GPT-2 for text generation; consider switching to a more finance-specific model for better insights.

## License
This project is licensed under the MIT License.

