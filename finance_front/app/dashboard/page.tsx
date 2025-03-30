"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LogOut,
  PiggyBank,
  DollarSign,
  TrendingDown,
  TrendingUp,
  BarChart3,
  LineChart
} from "lucide-react"

// Import API functions
import { fetchTransactions } from "../../lib/api"

import TransactionForm from "@/components/transaction-form"
import AIAdvisor from "@/components/ai-advisor"

export default function Dashboard() {
  const router = useRouter()
  const [transactionType, setTransactionType] = useState("expense")
  const [transactions, setTransactions] = useState<any[]>([])
  const [message, setMessage] = useState<string>("")

  // Fetch transactions on mount
  useEffect(() => {
    refreshTransactions()
  }, [])

  const refreshTransactions = async () => {
    try {
      const data = await fetchTransactions()
      
      const mappedTransactions = data.transactions.map((t: any) => ({
        id: t.transaction_id,
        account_id: t.account_id,
        name: t.name,
        amount: t.amount,
        date: t.date,
        category: t.category?.join(" > "),
        payment_channel: t.payment_channel,
        currency: t.iso_currency_code,
      }))
      
  
      setTransactions(mappedTransactions)
    } catch (error: any) {
      setMessage("Error fetching transactions: " + error.message)
    }
  }

  const handleLogout = () => {
    router.push("/")
  }

  const categoryTotals: Record<string, number> = {}
    transactions.filter(t => t.amount < 0).forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount)
    })
  const topSpendingCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"


  const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0) * -1
  const totalBalance = income - expenses
  const investments = transactions.filter(t => t.category === "Investments").reduce((sum, t) => sum + t.amount, 0)
  const savingsRate = income > 0 ? ((totalBalance / income) * 100).toFixed(2) : "0"


  // Identify the biggest expense
const biggestExpense = transactions.filter(t => t.amount < 0).reduce((max, t) => (t.amount < max.amount ? t : max), { amount: 0, name: "None" });

// Get this month's and last month's expenses
const currentMonth = new Date().getMonth()
const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1

const currentMonthExpenses = transactions.filter(t => new Date(t.date).getMonth() === currentMonth && t.amount < 0)
const lastMonthExpenses = transactions.filter(t => new Date(t.date).getMonth() === lastMonth && t.amount < 0)

const currentTotal = currentMonthExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)
const lastTotal = lastMonthExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)

const spendingTrend = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <PiggyBank className="h-6 w-6" />
            <span>FinanceTrack</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center min-h-screen">

        <main className="max-w-3xl">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Track and manage your finances in one place.</p>
            </div>
            {/* <Button onClick={() => setTransactionType("expense")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button> */}
          </div>

          {message && <p className="text-center text-sm text-red-500">{message}</p>}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Updated in real-time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${income.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Based on recent transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${expenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Spent this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investments</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${investments.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Growth this month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="transactions" className="mt-6">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
              <TabsTrigger value="NLP">Advice</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    {transactions.length > 0 ? `You have ${transactions.length} transactions.` : "No transactions found."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                {transactions.map((t) => (
                  <div key={t.id} className="flex flex-col md:flex-row justify-between items-center border-b py-3">
                    <div className="w-full md:w-1/3">
                      <p className="font-medium">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.category || "Uncategorized"} • {t.payment_channel}</p>
                    </div>
                    
                    <div className="hidden md:block text-gray-500 w-1/3 text-center">
                      <p>{t.date}</p>
                      <p className="text-sm">{t.account_name} • ****{t.mask}</p>
                    </div>

                    <div className={`w-full md:w-1/3 text-right font-semibold ${t.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                      ${Math.abs(t.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
                </CardContent>
              </Card>
              <Button onClick={refreshTransactions}>Refresh Transactions</Button>
            </TabsContent>
            <TabsContent value="analysis">
              <Card className="p-6 shadow-lg rounded-xl bg-white border">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold">Financial Analysis</CardTitle>
                  <CardDescription className="text-gray-500">
                    Insights into your spending habits.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                    <div className="flex items-center gap-2 font-medium">
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                      Top Spending Category:
                    </div>
                    <p className="text-right font-semibold text-red-500">{topSpendingCategory}</p>

                    <div className="flex items-center gap-2 font-medium">
                      <DollarSign className="h-4 w-4 text-gray-600" />
                      Total Balance:
                    </div>
                    <p className="text-right font-semibold">${totalBalance.toFixed(2)}</p>

                    <div className="flex items-center gap-2 font-medium">
                      <LineChart className="h-4 w-4 text-gray-600" />
                      Savings Rate:
                    </div>
                    <p className="text-right">{savingsRate}%</p>

                    <div className="flex items-center gap-2 font-medium">
                      <TrendingUp className="h-4 w-4 text-gray-600" />
                      Income vs. Expenses Ratio:
                    </div>
                    <p className="text-right">{income > 0 ? `${(expenses / income * 100).toFixed(2)}%` : "N/A"}</p>

                    <div className="flex items-center gap-2 font-medium">
                      <TrendingDown className="h-4 w-4 text-gray-600" />
                      Biggest Expense:
                    </div>
                    <p className="text-right font-semibold text-red-500">
                      ${Math.abs(biggestExpense.amount).toFixed(2)} - {biggestExpense.name}
                    </p>

                    <div className="flex items-center gap-2 font-medium">
                      <PiggyBank className="h-4 w-4 text-gray-600" />
                      Total Investments:
                    </div>
                    <p className="text-right font-semibold text-blue-500">${investments.toFixed(2)}</p>

                    <div className="flex items-center gap-2 font-medium">
                      <LineChart className="h-4 w-4 text-gray-600" />
                      Spending Trend:
                    </div>
                    <p className={`text-right font-semibold ${spendingTrend > 0 ? "text-red-500" : "text-green-500"}`}>
                      {spendingTrend > 0 ? "↑ Up" : "↓ Down"} {Math.abs(spendingTrend).toFixed(2)}%
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                      Expenses Breakdown:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {Object.entries(categoryTotals).map(([category, amount]) => (
                        <li key={category} className="flex justify-between">
                          <span>{category}:</span>
                          <span className="font-semibold">${amount.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}