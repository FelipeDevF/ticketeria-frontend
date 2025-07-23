import { useSession as useNextAuthSession } from 'next-auth/react'

export function useSession() {
  const { data: session, status } = useNextAuthSession()
  
  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  }
} 