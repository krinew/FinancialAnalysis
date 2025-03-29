from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import Transaction
import json

# List or Create Transactions
@csrf_exempt
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

# Retrieve, Update or Delete a Transaction
@csrf_exempt
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
