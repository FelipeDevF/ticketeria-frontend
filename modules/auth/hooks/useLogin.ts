import { useMutation } from '@tanstack/react-query'
import type { AuthResponse, LoginPayload } from '../types'
import { login } from '../authService'

export function useLogin(options?: {
  onSuccess?: (data: AuthResponse) => void
  onError?: (error: any) => void
}) {
  return useMutation<AuthResponse, any, LoginPayload>({
    mutationFn: login,
    ...options,
  })
} 