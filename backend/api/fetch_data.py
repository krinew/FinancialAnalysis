import requests
from .models import StockData
import plaid
from plaid.api import plaid_api
from .models import Transaction
from datetime import datetime, timedelta
from .config import PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV
from datetime import datetime

ALPHA_VANTAGE_API_KEY = 'your_actual_api_key'

def fetch_stock_data(symbol='AAPL'):
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={ALPHA_VANTAGE_API_KEY}"
    response = requests.get(url)
    data = response.json()

    if 'Time Series (1min)' in data:
        time_series = data['Time Series (1min)']
        for timestamp, values in time_series.items():
            StockData.objects.create(
                symbol=symbol,
                timestamp=datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S'),
                close_price=float(values['4. close'])
            )
        print("Data successfully stored!")
    else:
        print("Error fetching data:", data.get('Error Message', 'Unknown error'))
        


# Initialize the Plaid API client
configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
    }
)
api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

def fetch_transaction_data(access_token):
    try:
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        end_date = datetime.now().strftime('%Y-%m-%d')

        request = plaid.TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date
        )
        response = client.transactions_get(request)

        transactions = response['transactions']
        for txn in transactions:
            Transaction.objects.create(
                user_id=1,
                amount=txn['amount'],
                category=txn['category'][0] if txn['category'] else 'Unknown',
                description=txn['name'],
                timestamp=datetime.strptime(txn['date'], '%Y-%m-%d')
            )
        return "Transactions fetched and saved successfully!"
    except Exception as e:
        return str(e)

