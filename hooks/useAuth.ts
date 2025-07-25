"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth(redirectTo = "/acesso-negado") {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Aguarda o carregamento

    if (!session) {
      // Usar window.location.href para forçar o redirecionamento
      window.location.href = redirectTo
    }
  }, [session, status, redirectTo])

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    user: session?.user
  }
} 