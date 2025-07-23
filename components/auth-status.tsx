"use client"

import { useSession } from '@/modules/auth'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

export function AuthStatus() {
  const { session, isAuthenticated, isLoading } = useSession()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span>Olá, {session?.user?.email}</span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sair
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span>Não autenticado</span>
    </div>
  )
} 