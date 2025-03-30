"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PiggyBank } from "lucide-react"
import Link from "next/link"

export default function Auth() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("login")

  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      setActiveTab("signup")
    }
  }, [searchParams])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 font-semibold">
        <PiggyBank className="h-6 w-6" />
        <span>FinanceTrack</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="p-6">
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                          Forgot password?
                        </Link>
                      </div>
                      <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="signup" className="p-6">
                <form onSubmit={handleSignup}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        type="text"
                        autoCapitalize="words"
                        autoCorrect="off"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input
                        id="email-signup"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password-signup">Password</Label>
                      <Input id="password-signup" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}