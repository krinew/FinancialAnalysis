"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, PiggyBank, Plus, DollarSign, TrendingDown, TrendingUp, Home, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import TransactionForm from "@/components/transaction-form"
import AIAdvisor from "@/components/ai-advisor"

export default function Dashboard() {
  const router = useRouter()
  const [transactionType, setTransactionType] = useState("expense")

  const handleLogout = () => {
    // Handle logout logic
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
            </TabsList>
            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>You have made 12 transactions this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {[
                      {
                        type: "expense",
                        category: "Groceries",
                        amount: 120.5,
                        date: "2023-06-15",
                        description: "Weekly grocery shopping",
                      },
                      {
                        type: "income",
                        category: "Salary",
                        amount: 2500,
                        date: "2023-06-10",
                        description: "Monthly salary",
                      },
                      {
                        type: "expense",
                        category: "Entertainment",
                        amount: 45.99,
                        date: "2023-06-08",
                        description: "Movie tickets",
                      },
                      {
                        type: "investment",
                        category: "Stocks",
                        amount: 500,
                        date: "2023-06-05",
                        description: "AAPL shares purchase",
                      },
                      {
                        type: "expense",
                        category: "Utilities",
                        amount: 85.4,
                        date: "2023-06-01",
                        description: "Electricity bill",
                      },
                    ].map((transaction, i) => (
                      <div key={i} className="flex items-center">
                        <div
                          className={`mr-4 rounded-full p-2 ${
                            transaction.type === "income"
                              ? "bg-green-100 dark:bg-green-900"
                              : transaction.type === "expense"
                                ? "bg-red-100 dark:bg-red-900"
                                : "bg-blue-100 dark:bg-blue-900"
                          }`}
                        >
                          {transaction.type === "income" && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {transaction.type === "expense" && <TrendingDown className="h-4 w-4 text-red-500" />}
                          {transaction.type === "investment" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-blue-500"
                            >
                              <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                              <line x1="2" y1="20" x2="2" y2="20"></line>
                            </svg>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{transaction.category}</p>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        </div>
                        <div className="ml-auto font-medium">
                          {transaction.type === "income" && <span className="text-green-500">+</span>}
                          {transaction.type === "expense" && <span className="text-red-500">-</span>}
                          {transaction.type === "investment" && <span className="text-blue-500">→</span>}$
                          {transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
            </TabsContent>
            <TabsContent value="ai-advisor" className="space-y-4">
              <AIAdvisor />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

