import { useMutation } from '@tanstack/react-query'
import type { RegisterPayload, AuthResponse } from '../types'
import { registerUser } from '../authService'

export function useRegister(options?: {
  onSuccess?: (data: AuthResponse) => void
  onError?: (error: any) => void
}) {
  return useMutation<AuthResponse, any, RegisterPayload>({
    mutationFn: registerUser,
    ...options,
  })
} 