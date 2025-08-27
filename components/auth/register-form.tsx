'use client'

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

import { AlertCircle, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client" // browser client

interface FormErrors {
  email?: string
  password?: string
  general?: string
  full_name?: string
}

export function RegisterForm() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), []) // use browser client only once
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.full_name) {
      newErrors.full_name = "Full name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          },
        },
      })

      if (error) {
        let errorMessage = "Registration failed. Please try again."
        if (error.message.includes("User already registered")) {
          errorMessage = "A user with this email already exists."
        } else if (error.message.includes("Password is too weak")) {
          errorMessage = "Password is too weak. Please choose a stronger password."
        }
        throw new Error(errorMessage)
      }

      // Success - show success state briefly then redirect
      setIsSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again."
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Message */}
      {isSuccess && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Account created successfully! Please check your email to verify your account.
            </span>
          </div>
        </div>
      )}

      {/* General Error Message */}
      {errors.general && !isSuccess && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">{errors.general}</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="full_name" className="text-sm font-medium">
          Full Name
        </label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          placeholder="John Doe"
          value={formData.full_name}
          onChange={handleInputChange}
          className={errors.full_name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.full_name && (
          <p className="text-xs text-destructive mt-1">{errors.full_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleInputChange}
          className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleInputChange}
          className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.password && (
          <p className="text-xs text-destructive mt-1">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || isSuccess}>
        {isSuccess ? "Account created!" : isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/auth/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  )
}
