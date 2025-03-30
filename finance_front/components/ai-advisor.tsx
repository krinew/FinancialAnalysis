"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2, X } from "lucide-react"

export default function AIAdvisor() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | {
    isJustified: boolean
    explanation: string
    suggestions: string[]
  }>(null)
  const [expenseType, setExpenseType] = useState("necessity")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call to AI service
    setTimeout(() => {
      // Mock response based on input
      const amountNum = Number.parseFloat(amount)
      const mockResponse = {
        isJustified: true,
        explanation: "",
        suggestions: [],
      }

      if (expenseType === "necessity") {
        mockResponse.isJustified = true
        mockResponse.explanation = "This appears to be a necessary expense that aligns with your basic needs."
        mockResponse.suggestions = [
          "Consider looking for discounts or loyalty programs to save on regular expenses.",
          "Track this expense category over time to identify trends.",
        ]
      } else if (expenseType === "luxury" && amountNum > 100) {
        mockResponse.isJustified = false
        mockResponse.explanation =
          "This luxury purchase exceeds your typical discretionary spending and may impact your savings goals."
        mockResponse.suggestions = [
          "Consider delaying this purchase to next month after your budget refreshes.",
          "Look for more affordable alternatives that fulfill the same need.",
          "Check if this item goes on sale regularly before purchasing.",
        ]
      } else {
        mockResponse.isJustified = true
        mockResponse.explanation =
          "This discretionary purchase appears reasonable given your current financial situation."
        mockResponse.suggestions = [
          "Make sure this fits within your monthly entertainment/luxury budget.",
          "Consider tracking satisfaction with this purchase to inform future spending decisions.",
        ]
      }

      setResult(mockResponse)
      setLoading(false)
    }, 2000)
  }

  const resetForm = () => {
    setExpenseType("necessity")
    setAmount("")
    setDescription("")
    setResult(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Expenditure Advisor</CardTitle>
        <CardDescription>
          Ask our AI if your planned expenditure is justified based on your financial situation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-type">Type of expense</Label>
              <RadioGroup value={expenseType} onValueChange={setExpenseType} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="necessity" id="necessity" />
                  <Label htmlFor="necessity">Necessity (food, housing, utilities, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="want" id="want" />
                  <Label htmlFor="want">Want (entertainment, dining out, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="luxury" id="luxury" />
                  <Label htmlFor="luxury">Luxury (high-end items, vacation, etc.)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What are you planning to purchase? Provide some context."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Expenditure"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-1.5 ${result.isJustified ? "bg-green-100" : "bg-red-100"}`}>
                {result.isJustified ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className="font-medium">
                {result.isJustified ? "This expense appears justified" : "This expense may not be justified"}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">{result.explanation}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Suggestions:</h4>
              <ul className="list-disc list-inside space-y-1">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-4">
        {result ? (
          <Button variant="outline" onClick={resetForm} className="ml-auto">
            Analyze Another Expense
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            The AI advisor analyzes your spending patterns and financial goals to provide personalized advice.
          </p>
        )}
      </CardFooter>
    </Card>
  )
}

