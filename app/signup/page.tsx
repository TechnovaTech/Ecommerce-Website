"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('/')

  useEffect(() => {
    const redirect = searchParams.get('redirect')
    if (redirect) {
      setRedirectUrl(redirect)
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "⚠️ Password Mismatch",
        description: "Passwords do not match. Please check and try again.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Auto login after successful signup
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })
        
        const loginData = await loginResponse.json()
        
        if (loginResponse.ok) {
          localStorage.setItem('token', loginData.token)
          toast({
            title: "🎉 Account Created Successfully!",
            description: "Welcome to Shukan Mall! You are now logged in.",
            duration: 4000,
          })
          window.location.href = redirectUrl
        } else {
          toast({
            title: "✅ Account Created",
            description: "Account created successfully! Please login manually.",
            duration: 4000,
          })
          router.push('/login')
        }
      } else {
        toast({
          title: "❌ Signup Failed",
          description: data.error || "Failed to create account. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "❌ Signup Failed",
        description: "An error occurred while creating your account. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-center text-gray-600 mb-8">Join Shukan Mall today</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" required />
              <span>
                I agree to the{" "}
                <a href="#" className="text-teal-600 hover:text-teal-700">
                  terms and conditions
                </a>
              </span>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full text-white" style={{backgroundColor: 'lab(52.12% 47.1194 27.3658)'}}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Link href={`/login${redirectUrl !== '/' ? `?redirect=${redirectUrl}` : ''}`} className="text-teal-600 hover:text-teal-700 font-semibold">
              Login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
