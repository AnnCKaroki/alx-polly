'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

type AuthContextType = {
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({ session: null, isLoading: true })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
      } catch (error) {
        console.error("AuthContext: Error getting initial session:", error)
        // Optionally handle error state for UI
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false) // Ensure loading is false on any auth state change
    })

    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ session, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
