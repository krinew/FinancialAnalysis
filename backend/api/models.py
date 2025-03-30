from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('investment', 'Investment'),
        ('debt', 'Debt'),
        ('loan', 'Loan'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.category}: {self.amount}"
class StockData(models.Model):
    symbol = models.CharField(max_length=10)
    timestamp = models.DateTimeField()
    close_price = models.FloatField()

    def __str__(self):
        return f"{self.symbol} - {self.close_price} at {self.timestamp}"
    


