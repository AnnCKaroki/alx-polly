"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { RegisterData } from "@/types/user"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface FormErrors {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  password?: string
  general?: string
}

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "firstName":
        if (value.length > 0 && value.length < 2) {
          return "First name must be at least 2 characters"
        }
        if (value.length > 50) {
          return "First name must be less than 50 characters"
        }
        break

      case "lastName":
        if (value.length > 0 && value.length < 2) {
          return "Last name must be at least 2 characters"
        }
        if (value.length > 50) {
          return "Last name must be less than 50 characters"
        }
        break

      case "username":
        if (value.length === 0) {
          return "Username is required"
        }
        if (value.length < 3) {
          return "Username must be at least 3 characters"
        }
        if (value.length > 20) {
          return "Username must be less than 20 characters"
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          return "Username can only contain letters, numbers, underscores, and hyphens"
        }
        break

      case "email":
        if (value.length === 0) {
          return "Email is required"
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address"
        }
        break

      case "password":
        if (value.length === 0) {
          return "Password is required"
        }
        if (value.length < 8) {
          return "Password must be at least 8 characters"
        }
        if (!/(?=.*[a-z])/.test(value)) {
          return "Password must contain at least one lowercase letter"
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          return "Password must contain at least one uppercase letter"
        }
        if (!/(?=.*\d)/.test(value)) {
          return "Password must contain at least one number"
        }
        break
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) {
        newErrors[key as keyof FormErrors] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouched(allTouched)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // TODO: Implement actual registration logic
      console.log("Registration attempt:", formData)

      // Simulate API call with potential errors
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate different error scenarios
          const random = Math.random()
          if (random < 0.3) {
            reject(new Error("This email is already registered"))
          } else if (random < 0.5) {
            reject(new Error("This username is already taken"))
          } else {
            resolve(true)
          }
        }, 1000)
      })

      // Success - show success state briefly then redirect
      console.log("Registration successful!")
      setIsSuccess(true)

      // Brief delay to show success message, then redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again."

      // Handle specific error types
      if (errorMessage.includes("email")) {
        setErrors({ email: errorMessage })
      } else if (errorMessage.includes("username")) {
        setErrors({ username: errorMessage })
      } else {
        setErrors({ general: errorMessage })
      }
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

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const getFieldState = (fieldName: string) => {
    const hasError = errors[fieldName as keyof FormErrors]
    const isTouched = touched[fieldName]
    const hasValue = formData[fieldName as keyof RegisterData]

    if (hasError && isTouched) return "error"
    if (!hasError && isTouched && hasValue) return "success"
    return "default"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Message */}
      {isSuccess && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Account created successfully! Redirecting to your dashboard...
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name (Optional)
          </label>
          <div className="relative">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`pr-8 ${
                getFieldState("firstName") === "error"
                  ? "border-destructive focus-visible:ring-destructive"
                  : getFieldState("firstName") === "success"
                  ? "border-green-500 focus-visible:ring-green-500"
                  : ""
              }`}
            />
            {getFieldState("firstName") === "success" && (
              <CheckCircle2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
            {getFieldState("firstName") === "error" && (
              <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
            )}
          </div>
          {errors.firstName && touched.firstName && (
            <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name (Optional)
          </label>
          <div className="relative">
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`pr-8 ${
                getFieldState("lastName") === "error"
                  ? "border-destructive focus-visible:ring-destructive"
                  : getFieldState("lastName") === "success"
                  ? "border-green-500 focus-visible:ring-green-500"
                  : ""
              }`}
            />
            {getFieldState("lastName") === "success" && (
              <CheckCircle2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
            {getFieldState("lastName") === "error" && (
              <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
            )}
          </div>
          {errors.lastName && touched.lastName && (
            <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username *
        </label>
        <div className="relative">
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`pr-8 ${
              getFieldState("username") === "error"
                ? "border-destructive focus-visible:ring-destructive"
                : getFieldState("username") === "success"
                ? "border-green-500 focus-visible:ring-green-500"
                : ""
            }`}
          />
          {getFieldState("username") === "success" && (
            <CheckCircle2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {getFieldState("username") === "error" && (
            <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
          )}
        </div>
        {errors.username && touched.username && (
          <p className="text-xs text-destructive mt-1">{errors.username}</p>
        )}
        <p className="text-xs text-muted-foreground">
          3-20 characters, letters, numbers, underscores, and hyphens only
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email *
        </label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`pr-8 ${
              getFieldState("email") === "error"
                ? "border-destructive focus-visible:ring-destructive"
                : getFieldState("email") === "success"
                ? "border-green-500 focus-visible:ring-green-500"
                : ""
            }`}
          />
          {getFieldState("email") === "success" && (
            <CheckCircle2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {getFieldState("email") === "error" && (
            <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
          )}
        </div>
        {errors.email && touched.email && (
          <p className="text-xs text-destructive mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password *
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`pr-8 ${
              getFieldState("password") === "error"
                ? "border-destructive focus-visible:ring-destructive"
                : getFieldState("password") === "success"
                ? "border-green-500 focus-visible:ring-green-500"
                : ""
            }`}
          />
          {getFieldState("password") === "success" && (
            <CheckCircle2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {getFieldState("password") === "error" && (
            <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
          )}
        </div>
        {errors.password && touched.password && (
          <p className="text-xs text-destructive mt-1">{errors.password}</p>
        )}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Password must contain:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li className={formData.password.length >= 8 ? "text-green-600" : ""}>
              At least 8 characters
            </li>
            <li className={/(?=.*[a-z])/.test(formData.password) ? "text-green-600" : ""}>
              One lowercase letter
            </li>
            <li className={/(?=.*[A-Z])/.test(formData.password) ? "text-green-600" : ""}>
              One uppercase letter
            </li>
            <li className={/(?=.*\d)/.test(formData.password) ? "text-green-600" : ""}>
              One number
            </li>
          </ul>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || isSuccess}>
        {isSuccess ? "Account created! Redirecting..." : isLoading ? "Creating account..." : "Create Account"}
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
