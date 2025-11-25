import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { checkAuthStatus } from '@/utils'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * Protected Route Component
 * Wraps children and only renders them if user is authenticated
 * Shows fallback UI while checking auth status
 */
export function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authState = checkAuthStatus()
    setIsAuthenticated(authState.isAuthenticated)
    setIsChecking(false)

    if (!authState.isAuthenticated) {
      navigate({
        to: redirectTo,
      })
    }
  }, [navigate, redirectTo])

  if (isChecking) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect, so don't render anything
  }

  return <>{children}</>
}

/**
 * Guest Route Component
 * Only renders children if user is NOT authenticated
 * Useful for login/register pages
 */
export function GuestRoute({
  children,
  fallback,
  redirectTo = '/'
}: ProtectedRouteProps) {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authState = checkAuthStatus()
    setIsAuthenticated(authState.isAuthenticated)
    setIsChecking(false)

    if (authState.isAuthenticated) {
      navigate({
        to: redirectTo,
        replace: true,
      })
    }
  }, [navigate, redirectTo])

  if (isChecking) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect, so don't render anything
  }

  return <>{children}</>
}
