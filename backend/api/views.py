from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import *
import json
from .fetch_data import *  
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.products import Products # <--- IMPORT ADDED
#import pathway as pw
#from .pathway_pipeline import run_pipeline
from datetime import datetime, timedelta
import requests

access_token = "access-sandbox-699cec58-11f0-462c-b0dc-c76dfdfdd7d0"  # Replace with actual sandbox token
API_KEY="SKESZURX98N0ASAX"


# List or Create Transactions
configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        'clientId':"67e82554f2516500245da664" ,
        'secret': "c524cf189dcbfef4790581719a45a7"
    }
)
api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)


@login_required
def transaction_list(request):
    if request.method == 'GET':
        transactions = Transaction.objects.filter(user=request.user).values()
        return JsonResponse(list(transactions), safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            transaction = Transaction.objects.create(
                user=request.user,
                amount=data.get('amount'),
                category=data.get('category'),
                description=data.get('description', '')
            )
            return JsonResponse({"message": "Transaction created successfully", "transaction_id": transaction.id}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@login_required
def transaction_detail(request, transaction_id):
    try:
        transaction = Transaction.objects.get(id=transaction_id, user=request.user)
    except Transaction.DoesNotExist:
        return JsonResponse({"error": "Transaction not found"}, status=404)

    if request.method == 'GET':
        return JsonResponse({
            "id": transaction.id,
            "amount": str(transaction.amount),
            "category": transaction.category,
            "timestamp": transaction.timestamp,
            "description": transaction.description
        })

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            transaction.amount = data.get('amount', transaction.amount)
            transaction.category = data.get('category', transaction.category)
            transaction.description = data.get('description', transaction.description)
            transaction.save()
            return JsonResponse({"message": "Transaction updated successfully"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    elif request.method == 'DELETE':
        transaction.delete()
        return JsonResponse({"message": "Transaction deleted successfully"})


def fetch_transaction_view(request):
    try: # Replace with your actual sandbox token
        client = get_plaid_client()

        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)

        # Request transactions from Plaid
        request_data = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date
        )
       
        response = client.transactions_get(request_data)

        # Return the raw Plaid API response as JSON
        return JsonResponse(response.to_dict(), safe=False, status=200)

    except Exception as e:
        logger.error(f"Error in fetch_transaction_view: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
    
@csrf_exempt
def exchange_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            public_token = access_token

            if not public_token:
                return JsonResponse({"error": "Missing public_token"}, status=400)

            client = get_plaid_client()
            exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
            exchange_response = client.item_public_token_exchange(exchange_request)

            access_token = exchange_response.access_token
            item_id = exchange_response.item_id

            # Save in the database
            item = Item.objects.create(
                user=request.user,
                access_token=access_token,
                item_id=item_id,
            )

            return JsonResponse({"message": "Access token saved successfully!"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
@csrf_exempt
def create_sandbox_token(request):
    try:
        client = get_plaid_client()

        request_data = SandboxPublicTokenCreateRequest(
            institution_id="ins_109508",
            initial_products=[
                Products('transactions'),
                Products('auth'),
                Products('balance')
            ]
        )
        response = client.sandbox_public_token_create(request_data)
        public_token = response.public_token

        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)

        access_token = exchange_response.access_token
        item_id = exchange_response.item_id

        return JsonResponse({'public_token': public_token, 'access_token': access_token, 'item_id': item_id})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def fetch_transaction_view(request):
    try:
        client = get_plaid_client()
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)

        # Request transactions from Plaid
        request_data = TransactionsGetRequest(
            access_token=access_token,  # Replace with actual token
            start_date=start_date,
            end_date=end_date
        )

        response = client.transactions_get(request_data)

        return JsonResponse(response.to_dict(), status=200)

    except Exception as e:
        logger.error(f"Error in fetch_transaction_view: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def fetch_accounts_without_user(request):
    try:
        access_token = access_token
        request_data = AccountsGetRequest(access_token=access_token)
        response = client.accounts_get(request_data)
        return JsonResponse(response.to_dict(), safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def create_sandbox_token_view(request):
    try:
        # Configure Plaid Client
        configuration = plaid.Configuration(
            host=plaid.Environment.Sandbox,
            api_key={
                'clientId': "67e82554f2516500245da664",
                'secret': "c524cf189dcbfef4790581719a45a7",
            }
        )
        api_client = plaid.ApiClient(configuration)
        client = plaid_api.PlaidApi(api_client)

        # Step 1: Create a public token
        request_data = SandboxPublicTokenCreateRequest(
            institution_id="ins_109508",  # Plaid's Test Bank
             initial_products=[
        Products('transactions'),
        Products('auth'),
    ]
        )
        response = client.sandbox_public_token_create(request_data)
        public_token = response.public_token

        # Step 2: Exchange public token for access token
        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response.access_token

        return JsonResponse({'public_token': public_token, 'access_token': access_token})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    
def fetch_stock_data(request):
    try:
        # Get stock symbols from request parameters (comma-separated)
        symbols = request.GET.get('symbols','AAPL,TSLA')
        if not symbols:
            return JsonResponse({"error": "Please provide at least one stock symbol using ?symbols=AAPL,TSLA"}, status=400)
        
        symbol_list = symbols.split(',')

        results = {}

        # Fetch data for each symbol
        for symbol in symbol_list:
            symbol = symbol.strip().upper()
            url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={API_KEY}&outputsize=compact"
            response = requests.get(url)
            data = response.json()

            # Handle errors for invalid symbols
            if "Error Message" in data:
                results[symbol] = {"error": data["Error Message"]}
                continue

            time_series = data.get("Time Series (Daily)", {})
            if not time_series:
                results[symbol] = {"error": "No data available for this symbol."}
                continue

            # Format data for JSON response
            formatted_data = [
                {
                    "date": date,
                    "open": float(values["1. open"]),
                    "high": float(values["2. high"]),
                    "low": float(values["3. low"]),
                    "close": float(values["4. close"]),
                    "volume": int(values["5. volume"])
                }
                for date, values in time_series.items()
            ]

            results[symbol] = formatted_data

        return JsonResponse(results)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)