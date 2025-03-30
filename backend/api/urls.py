from django.urls import path
from .views import *
urlpatterns = [
    path('transactions/', transaction_list, name='transaction_list'),
    path('transactions/<int:transaction_id>/', transaction_detail, name='transaction_detail'),
    path('fetch-data/', fetch_data, name='fetch_data'),
    path('store_data/', store_data, name='store_data'),
    path('fetch_transaction_view', fetch_transaction_view, name='fetch_transaction_view'),
]
