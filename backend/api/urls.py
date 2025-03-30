from django.urls import path
from . import views

urlpatterns = [
    path('transactions/', views.transaction_list, name='transaction_list'),
    path('transactions/<int:transaction_id>/', views.transaction_detail, name='transaction_detail'),
    path('fetch-data/', views.fetch_data, name='fetch_data'),
    path('store_data/', views.store_data, name='store_data'),
    path('fetch_transaction_view', views.fetch_transaction_view, name='fetch_transaction_view'),
]
