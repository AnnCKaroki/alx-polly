"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Menu, 
  User, 
  LogOut,
  Plus
} from "lucide-react"
import { useAuth } from "@/app/auth/context/auth-context"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { session } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
        // Optionally, display a user-facing error message
      }
      router.push("/")
    } catch (error) {
      console.error("Unexpected error during sign out:", error)
    }
  }

  const isAuthenticated = !!session

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Polly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/polls" 
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Polls
            </Link>
            {isAuthenticated && (
              <Link 
                href="/dashboard" 
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button asChild>
                  <Link href="/polls/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Poll
                  </Link>
                </Button>
                <div className="relative">
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                  {/* TODO: Add user dropdown menu */}
                </div>
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t pt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/polls"
                className="text-foreground/60 hover:text-foreground transition-colors px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Polls
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/dashboard"
                  className="text-foreground/60 hover:text-foreground transition-colors px-4 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              <div className="border-t pt-3 mt-3">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 px-4">
                    <Button asChild className="justify-start">
                      <Link href="/polls/create" onClick={() => setIsOpen(false)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Poll
                      </Link>
                    </Button>
                    {/* Removed Settings Button */}
                    <Button variant="ghost" className="justify-start text-destructive" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 px-4">
                    <Button variant="ghost" asChild>
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
