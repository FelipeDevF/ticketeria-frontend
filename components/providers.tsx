"use client"

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query-client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { CartProvider } from "@/components/CartContext"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
} 