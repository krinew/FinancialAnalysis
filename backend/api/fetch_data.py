import plaid
from plaid.api import plaid_api
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.sandbox_public_token_create_request import SandboxPublicTokenCreateRequest

from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from django.contrib.auth.models import User

from .models import Item, Account, Transaction
from .config import PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV 
from datetime import datetime, timedelta, date
from decimal import Decimal
import logging
from django.utils import timezone 

logger = logging.getLogger(__name__)

def generate_sandbox_token(user):
    client = get_plaid_client()
    try:
        request = SandboxPublicTokenCreateRequest(
            institution_id="ins_1",  # Mock institution
            initial_products=["transactions"]
        )
        response = client.sandbox_public_token_create(request)
        return response['public_token']
    except Exception as e:
        raise Exception(f"Error generating sandbox token: {e}")

# --- Plaid Client Setup (Same as before) ---
def get_plaid_environment(env_name=PLAID_ENV):
    """Gets the Plaid environment object based on the config string."""
    if env_name == 'sandbox':
        return plaid.Environment.Sandbox
    elif env_name == 'development':
        return plaid.Environment.Development
    elif env_name == 'production':
        return plaid.Environment.Production
    else:
        logger.error(f"Invalid PLAID_ENV specified: {env_name}")
        raise ValueError("Invalid PLAID_ENV specified")

def get_plaid_client():
    """Initializes and returns a Plaid API client instance."""
    try:
        configuration = plaid.Configuration(
            host=get_plaid_environment(),
            api_key={
                'clientId': PLAID_CLIENT_ID,
                'secret': PLAID_SECRET,
            }
        )
        api_client = plaid.ApiClient(configuration)
        return plaid_api.PlaidApi(api_client)
    except Exception as e:
        logger.exception("Failed to initialize Plaid client.")
        raise

# --- Token Exchange (Adapts to your Item model) ---
def exchange_public_token_and_save_item(public_token: str, user: User):
    """Exchanges public token, saves Item, fetches initial accounts."""
    client = get_plaid_client()
    try:
        request = ItemPublicTokenExchangeRequest(public_token=public_token)
        response = client.item_public_token_exchange(request)
        access_token = response['access_token']
        item_id = response['item_id']

        # ====> WARNING: Storing access_token in plaintext is a SEVERE security risk! <====
        # You MUST encrypt this token before saving it to the database.
        # Consider using a library like django-cryptography.
        # encrypted_access_token = encrypt_function(access_token) # Replace this
        plaintext_access_token_for_demo = access_token # DANGEROUS - FOR DEMO ONLY

        # Fetch institution details (optional but good for Item model)
        institution_name = "Unknown Institution"
        try:
            item_response = client.item_get(plaid.model.ItemGetRequest(access_token=access_token))
            inst_id = item_response['item']['institution_id']
            inst_response = client.institutions_get_by_id(plaid.model.InstitutionsGetByIdRequest(institution_id=inst_id, country_codes=[plaid.model.CountryCode('US')])) # Adjust country
            institution_name = inst_response['institution']['name']
        except Exception as item_ex:
            logger.warning(f"Could not fetch institution details for item {item_id}: {item_ex}")


        # Save to your Item model
        item_instance, created = Item.objects.update_or_create(
            item_id=item_id,
            defaults={
                'user': user,
                # 'access_token': encrypted_access_token, # SAVE ENCRYPTED TOKEN
                'access_token': plaintext_access_token_for_demo, # DANGEROUS - REPLACE
                'institution_name': institution_name,
            }
        )
        action = "Created" if created else "Updated"
        logger.info(f"{action} Item {item_id} for user {user.username}")

        # Fetch and store accounts immediately after linking
        if item_instance:
             fetch_and_store_accounts(item_instance) # Pass the newly created/updated Item

        return item_instance

    except plaid.ApiException as e:
        logger.error(f"Plaid API error during token exchange for user {user.username}: {e.body}")
        return None
    except Exception as e:
        logger.exception(f"Unexpected error during token exchange for user {user.username}")
        return None

# --- Account Fetching (Adapts to your Account model) ---

def fetch_and_store_accounts(item: Item):
    """Fetches accounts for an Item and stores/updates them in your Account model."""
    client = get_plaid_client()
    user = item.user # Get user from the Item

    try:
        # ====> WARNING: Using plaintext access_token! Decrypt if stored encrypted. <====
        # access_token = decrypt_function(item.access_token) # Use decrypted token
        access_token = item.access_token # DANGEROUS - Using plaintext

        request = AccountsGetRequest(access_token=access_token)
        response = client.accounts_get(request)
        accounts_data = response.to_dict().get('accounts', [])

        saved_accounts_map = {}
        for acc_data in accounts_data:
            # Safely get balance data
            balances = acc_data.get('balances', {})
            current_balance = balances.get('current')
            available_balance = balances.get('available')
            currency_code = balances.get('iso_currency_code')

            # Use update_or_create with your Account model fields
            account, created = Account.objects.update_or_create(
                account_id=acc_data['account_id'], # Plaid's unique account ID
                user=user, # Link directly to the User as per your model
                defaults={
                    'name': acc_data.get('name'),
                    'official_name': acc_data.get('official_name'),
                    'type': acc_data.get('type'),
                    'subtype': acc_data.get('subtype'),
                    'mask': acc_data.get('mask'),
                    # Store balances if available
                    'current_balance': Decimal(str(current_balance)) if current_balance is not None else None,
                    'available_balance': Decimal(str(available_balance)) if available_balance is not None else None,
                    'currency_code': currency_code,
                    # NOTE: Your Account model doesn't link back to the Item.
                }
            )
            saved_accounts_map[account.account_id] = account
            action = 'created' if created else 'updated'
            logger.debug(f"Account {action}: {account.account_id} ({account.name}) for user {user.username}")

        # Optional: Handle removed accounts (accounts present in DB but not in Plaid response)
        # ... logic to find and potentially delete or mark inactive Accounts ...

        return saved_accounts_map

    except plaid.ApiException as e:
        logger.error(f"Plaid API exception fetching accounts for item {item.item_id} (User: {user.username}): {e.body}")
        return {} # Return empty map on failure
    except Exception as e:
        logger.exception(f"Unexpected error fetching accounts for item {item.item_id} (User: {user.username})")
        return {}

# --- Category Mapping (Same basic example - Customize!) ---

def map_plaid_category_to_simple(plaid_category_list):
    """Maps Plaid's category list to your simple choices."""
    if not plaid_category_list:
        return 'expense' # Default or choose another default like 'other' if added
    primary = plaid_category_list[0].lower()
    # Customize this mapping based on Transaction.CATEGORY_CHOICES
    if primary == 'transfer': return 'expense' # Or map transfers differently?
    if primary == 'income': return 'income'
    if primary == 'loan payments': return 'loan'
    # Add debt/investment mapping if needed
    # Most others likely fall under expense
    if primary in ['travel', 'food and drink', 'shops', 'recreation', 'service', 'payment', 'rent', 'utilities', 'personal care', 'general services', 'government and non-profit', 'transportation', 'general merchandise']:
        return 'expense'
    return 'expense' # Default fallback

# --- Transaction Fetching (Adapts to your Transaction model) ---

def fetch_and_store_transactions(item: Item, days: int = 30):
    """
    Fetches transactions for a given Item using /transactions/get
    and stores/updates them using your Transaction model.

    Args:
        item: The Item object containing the user and access token.
        days: Number of past days to fetch transactions for.

    Returns:
        A string indicating the outcome.
    """
    client = get_plaid_client()
    user = item.user # Get user from the Item

    try:
        # ====> WARNING: Using plaintext access_token! Decrypt if stored encrypted. <====
        access_token = item.access_token # DANGEROUS - Using plaintext

        # Ensure accounts are available locally for linking
        # Query based on user since Account links to User in your model
        accounts_map = {acc.account_id: acc for acc in Account.objects.filter(user=user)}
        if not accounts_map:
             logger.info(f"No accounts found locally for user {user.username} associated with item {item.item_id}. Fetching now.")
             # Fetch accounts associated with THIS specific item's access token
             accounts_map = fetch_and_store_accounts(item)
             if not accounts_map:
                  logger.error(f"Failed to fetch accounts for item {item.item_id} (User: {user.username}). Cannot store transactions.")
                  return "Failed: Could not fetch or find accounts."

        # Define date range
        end_date = date.today()
        start_date = end_date - timedelta(days=days)

        # Prepare request
        request = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date,
            options=TransactionsGetRequestOptions(count=500, offset=0)
        )

        all_transactions_data = []
        total_fetched = 0
        while True: # Handle pagination
            response = client.transactions_get(request)
            fetched_batch = response.to_dict().get('transactions', [])
            all_transactions_data.extend(fetched_batch)
            total_fetched += len(fetched_batch)
            total_available = response.to_dict().get('total_transactions', total_fetched)
            logger.debug(f"Fetched batch of {len(fetched_batch)} txns for item {item.item_id}. Offset: {request.options.offset}")
            if total_fetched >= total_available: break
            request.options.offset = total_fetched

        logger.info(f"Fetched {total_fetched} total transactions for item {item.item_id} between {start_date} and {end_date}")

        # Store data in DB using your Transaction model
        count_created = 0
        count_updated = 0
        for txn_data in all_transactions_data:
            plaid_account_id = txn_data.get('account_id')
            plaid_transaction_id = txn_data.get('transaction_id')

            if not plaid_transaction_id:
                logger.warning(f"Skipping transaction with missing transaction_id for item {item.item_id}. Data: {txn_data.get('name')}")
                continue

            account_instance = accounts_map.get(plaid_account_id)
            if not account_instance:
                logger.warning(f"Skipping transaction {plaid_transaction_id} - Could not find local Account {plaid_account_id} for user {user.username}")
                continue

            try:
                amount = Decimal(str(txn_data['amount']))
                currency_code = txn_data.get('iso_currency_code')
                plaid_categories = txn_data.get('category') or []
                simple_category = map_plaid_category_to_simple(plaid_categories)
                description_text = txn_data.get('name', '') # Use Plaid's name as description
                pending_status = txn_data.get('pending', False)

                # ===> Limitation: Using auto_now_add timestamp <====
                # The 'timestamp' field in your model will record when this Django
                # record is created/updated, NOT the actual transaction date.
                # To store the actual date, you need to modify your Transaction model
                # to include a 'date' field (e.g., `date = models.DateField()`).
                # For now, we proceed, but the timestamp will not reflect reality.
                # You could store the date in the description for now:
                # actual_date_str = txn_data.get('date', 'unknown date')
                # description_text = f"[{actual_date_str}] {description_text}"

                obj, created = Transaction.objects.update_or_create(
                    transaction_id=plaid_transaction_id, # Use Plaid's ID as the key
                    user=user, # Ensure user is associated
                    defaults={
                        'account': account_instance,
                        'amount': amount,
                        'currency_code': currency_code,
                        'category': simple_category, # Your mapped category
                        'description': description_text, # Using Plaid's 'name'
                        'pending': pending_status,
                        # 'timestamp' will be set automatically by auto_now_add (on create)
                        # or left unchanged by Django on update.
                    }
                )
                if created:
                    count_created += 1
                else:
                    # If updated, explicitly update timestamp if you want it to reflect last sync time
                    # obj.timestamp = timezone.now()
                    # obj.save(update_fields=['timestamp'])
                    count_updated += 1

            except Exception as parse_or_db_error:
                 logger.error(f"Error processing/saving transaction {plaid_transaction_id} for user {user.id}: {parse_or_db_error}", exc_info=True)


        logger.info(f"Transaction sync DB update complete for item {item.item_id}. Created: {count_created}, Updated: {count_updated}")
        # NOTE: Your Item model doesn't have sync tracking fields. Add them for robust sync.
        return f"Transactions fetched: {total_fetched}. DB Created: {count_created}, DB Updated: {count_updated}."

    except plaid.ApiException as e:
        error_body = e.body if hasattr(e, 'body') else str(e)
        logger.error(f"Plaid API exception fetching transactions for item {item.item_id} (User: {user.username}): {error_body}")
        return f"Failed: Plaid API Error ({e.status}): Check logs."
    except Exception as e:
        logger.exception(f"Unexpected error fetching transactions for item {item.item_id} (User: {user.username})")
        return f"Failed: Unexpected error: Check logs."