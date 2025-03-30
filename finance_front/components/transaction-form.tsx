"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TransactionFormProps {
  type: "expense" | "income" | "investment"
}

export default function TransactionForm({ type }: TransactionFormProps) {
  const [date, setDate] = useState<Date>()
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    const transaction = {
      type,
      amount: Number.parseFloat(amount),
      category,
      description,
      date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    }

    console.log("Transaction saved:", transaction)
    // Here you would save the transaction to your backend

    // Reset form
    setAmount("")
    setCategory("")
    setDescription("")
    setDate(undefined)

    // Show success feedback
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`)
  }

  const categoryOptions = {
    expense: [
      "Food & Dining",
      "Shopping",
      "Housing",
      "Transportation",
      "Entertainment",
      "Health",
      "Utilities",
      "Travel",
      "Education",
      '  "Housing',
      "Transportation",
      "Entertainment",
      "Health",
      "Utilities",
      "Travel",
      "Education",
      "Personal Care",
      "Gifts",
      "Other",
    ],
    income: ["Salary", "Freelance", "Investments", "Rental Income", "Side Hustle", "Gifts", "Tax Refund", "Other"],
    investment: ["Stocks", "Bonds", "Crypto", "Real Estate", "Retirement", "ETFs", "Mutual Funds", "Other"],
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions[type].map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase().replace(/\s+/g, "-")}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add details about this transaction"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        Save {type.charAt(0).toUpperCase() + type.slice(1)}
      </Button>
    </form>
  )
}

