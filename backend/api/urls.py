from django.urls import path
from .views import transaction_list, transaction_detail

urlpatterns = [
    path('transactions/', transaction_list, name='transaction_list'),
    path('transactions/<int:transaction_id>/', transaction_detail, name='transaction_detail'),
]
