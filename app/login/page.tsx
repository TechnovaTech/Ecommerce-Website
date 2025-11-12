"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login button clicked')
    console.log('Email:', email, 'Password:', password)
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      console.log('Login response:', data)
      
      if (response.ok) {
        localStorage.setItem('token', data.token)
        if (data.user?.isAdmin) {
          localStorage.setItem('adminLoggedIn', 'true')
          console.log('Redirecting to admin')
          window.location.href = '/admin'
        } else {
          console.log('Redirecting to home')
          router.push('/')
        }
      } else {
        alert(data.error || 'Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-center text-gray-600 mb-8">Login to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-teal-600 hover:text-teal-700">
                Forgot password?
              </a>
            </div>

            <Button type="submit" disabled={isLoading}  className="w-full text-white" style={{backgroundColor: 'lab(52.12% 47.1194 27.3658)'}}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Don't have an account?</p>
            <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
