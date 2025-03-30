from django.db import models
from django.contrib.auth.models import User

class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_id = models.CharField(max_length=255, unique=True)  # From Plaid
    name = models.CharField(max_length=255)
    official_name = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(max_length=50)
    subtype = models.CharField(max_length=50)
    available_balance = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    current_balance = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    currency_code = models.CharField(max_length=10, null=True, blank=True)
    mask = models.CharField(max_length=4, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.name}"


class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('investment', 'Investment'),
        ('debt', 'Debt'),
        ('loan', 'Loan'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, null=True, blank=True)  # Linked to Plaid Account
    transaction_id = models.CharField(max_length=255, unique=True, null=True, blank=True)  # From Plaid
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency_code = models.CharField(max_length=10, null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    pending = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.category}: {self.amount}"


class Item(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=500)
    item_id = models.CharField(max_length=255, unique=True)
    institution_name = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)



class StockData(models.Model):
    symbol = models.CharField(max_length=10)
    timestamp = models.DateTimeField()
    close_price = models.FloatField()

    def __str__(self):
        return f"{self.symbol} - {self.close_price} at {self.timestamp}"
    


