from django.urls import path
from .views import *

urlpatterns = [
    
    path('exchange_token/', exchange_token, name='exchange_token'),
    path('create_sandbox_token/', create_sandbox_token, name='create_sandbox_token'),
    path('create-sandbox-token_view/', create_sandbox_token_view, name='create_sandbox_token'),
    path('transactions/<int:transaction_id>/', views.transaction_detail, name='transaction_detail'),
    path('fetch_transaction_view/', fetch_transaction_view, name='fetch_transactions'),
    path('fetch-data/', fetch_data, name='fetch_data'),
    path('store_data/', store_data, name='store_data'),
]