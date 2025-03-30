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
  Plus,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Home,
  BarChart3,
  Settings
} from "lucide-react"

// Import API functions
import {
  getTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  fetchStockData,
  storeStockData,
  fetchTransactionView
} from "../../lib/api"

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
      const data = await getTransactions()
      setTransactions(data)
    } catch (error: any) {
      setMessage("Error fetching transactions: " + error.message)
    }
  }

  // Example: Create a dummy transaction
  const handleCreateTransaction = async () => {
    try {
      const dummyData = {
        amount: 100,
        category: "Test Category",
        description: "Created via Dashboard API demo"
      }
      const response = await createTransaction(dummyData)
      setMessage(response.message)
      refreshTransactions()
    } catch (error: any) {
      setMessage("Error creating transaction: " + error.message)
    }
  }

  // Example: Update the first transaction in the list
  const handleUpdateTransaction = async () => {
    if (transactions.length === 0) {
      setMessage("No transactions available to update.")
      return
    }
    try {
      const firstTransaction = transactions[0]
      const updateData = { description: "Updated description" }
      const response = await updateTransaction(firstTransaction.id, updateData)
      setMessage(response.message)
      refreshTransactions()
    } catch (error: any) {
      setMessage("Error updating transaction: " + error.message)
    }
  }

  // Example: Delete the first transaction in the list
  const handleDeleteTransaction = async () => {
    if (transactions.length === 0) {
      setMessage("No transactions available to delete.")
      return
    }
    try {
      const firstTransaction = transactions[0]
      const response = await deleteTransaction(firstTransaction.id)
      setMessage(response.message)
      refreshTransactions()
    } catch (error: any) {
      setMessage("Error deleting transaction: " + error.message)
    }
  }

  // Example: Fetch stock data (e.g., for AAPL)
  const handleFetchStockData = async () => {
    try {
      const data = await fetchStockData()
      setMessage("Stock Data: " + data.status)
    } catch (error: any) {
      setMessage("Error fetching stock data: " + error.message)
    }
  }

  // Example: Store dummy stock data
  const handleStoreStockData = async () => {
    try {
      // Dummy values for the example
      const symbol = "AAPL"
      const timestamp = new Date().toISOString()
      const closePrice = 150.25
      await storeStockData(symbol, timestamp, closePrice)
      setMessage("Stock data stored successfully!")
    } catch (error: any) {
      setMessage("Error storing stock data: " + error.message)
    }
  }

  // Example: Fetch transaction view from external service
  const handleFetchTransactionView = async () => {
    try {
      const data = await fetchTransactionView()
      setMessage("Transaction View: " + data.message)
    } catch (error: any) {
      setMessage("Error fetching transaction view: " + error.message)
    }
  }

  const handleLogout = () => {
    // Handle logout logic here
    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] md:gap-6 lg:gap-10 mt-6">
        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="grid items-start gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground transition-all"
              >
                <Home className="h-5 w-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm font-medium">Reports</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </nav>
          </div>
        </aside>

        <main className="flex flex-col gap-6 pb-16">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Track and manage your finances in one place.</p>
            </div>
            <Button onClick={() => setTransactionType("expense")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>

          {message && <p className="text-center text-sm text-red-500">{message}</p>}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$8,421.50</div>
                <p className="text-xs text-muted-foreground">+5.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,550.00</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,345.00</div>
                <p className="text-xs text-muted-foreground">-3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investments</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$6,216.50</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="transactions" className="mt-6">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="add">Add Entry</TabsTrigger>
              <TabsTrigger value="ai-advisor">AI Advisor</TabsTrigger>
              <TabsTrigger value="api-demo">API Demo</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    {transactions.length > 0
                      ? `You have ${transactions.length} transactions.`
                      : "No transactions found."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {transactions.map((transaction, i) => (
                      <div key={i} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{transaction.category}</p>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        </div>
                        <div className="ml-auto font-medium">
                          ${parseFloat(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Button onClick={refreshTransactions}>Refresh Transactions</Button>
            </TabsContent>
            <TabsContent value="add" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add Financial Entry</CardTitle>
                  <CardDescription>Record a new transaction for your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={transactionType} onValueChange={setTransactionType}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="expense">Expense</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                      <TabsTrigger value="investment">Investment</TabsTrigger>
                    </TabsList>
                    <TabsContent value="expense">
                      <TransactionForm type="expense" />
                    </TabsContent>
                    <TabsContent value="income">
                      <TransactionForm type="income" />
                    </TabsContent>
                    <TabsContent value="investment">
                      <TransactionForm type="investment" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              <div className="flex gap-4">
                <Button onClick={handleCreateTransaction}>Create Dummy Transaction</Button>
                <Button onClick={handleUpdateTransaction}>Update First Transaction</Button>
                <Button onClick={handleDeleteTransaction}>Delete First Transaction</Button>
              </div>
            </TabsContent>
            <TabsContent value="ai-advisor" className="space-y-4">
              <AIAdvisor />
            </TabsContent>
            <TabsContent value="api-demo" className="space-y-4">
              <div className="flex flex-col gap-4">
                <Button onClick={handleFetchStockData}>Fetch Stock Data</Button>
                <Button onClick={handleStoreStockData}>Store Stock Data</Button>
                <Button onClick={handleFetchTransactionView}>Fetch Transaction View</Button>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}