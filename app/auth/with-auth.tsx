'use client'

import { useAuth } from '@/app/auth/context/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const withAuth = (Component: React.ComponentType<any>) => {
  const Auth = (props: any) => {
    const { session, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && session === null) {
        router.push('/auth/login')
      }
    }, [session, isLoading, router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading authentication...</p>
        </div>
      ) // Or a more sophisticated loading spinner
    }

    if (session === null) {
      return null // Will be redirected by useEffect
    }

    return <Component {...props} />
  }

  return Auth
}
