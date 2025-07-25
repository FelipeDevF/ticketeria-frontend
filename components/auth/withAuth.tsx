"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface WithAuthProps {
  children: React.ReactNode
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === "loading") return // Aguarda o carregamento

      if (!session) {
        // Usar window.location.href para forçar o redirecionamento
        window.location.href = "/acesso-negado"
      }
    }, [session, status, router])

    // Mostra loading enquanto verifica a autenticação
    if (status === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-muted-foreground">Verificando autenticação...</p>
          </div>
        </div>
      )
    }

    // Se não estiver autenticado, não renderiza nada (será redirecionado)
    if (!session) {
      return null
    }

    // Se estiver autenticado, renderiza o componente
    return <WrappedComponent {...props} />
  }
} 