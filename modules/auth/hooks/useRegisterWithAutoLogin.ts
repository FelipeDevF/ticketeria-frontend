import { useMutation } from '@tanstack/react-query'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { RegisterPayload, AuthResponse } from '../types'
import { registerUser } from '../authService'

export function useRegisterWithAutoLogin() {
  const router = useRouter()

  return useMutation<AuthResponse, any, { payload: RegisterPayload; loginData: { email: string; password: string } }>({
    mutationFn: async ({ payload }) => {
      return await registerUser(payload)
    },
    onSuccess: async (data, variables) => {
      try {
        // Aguarda um pouco para garantir que o backend processou o cadastro
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Tenta logar automaticamente após o cadastro
        const result = await signIn("credentials", {
          email: variables.loginData.email,
          password: variables.loginData.password,
          redirect: false,
        })

        // Independente do resultado do signIn, redireciona para a página principal
        if (result?.ok) {
          toast.success("Conta criada com sucesso! Você já está logado.")
        } else {
          toast.success("Conta criada com sucesso! Faça login para continuar.")
        }
        router.push("/")
        router.refresh() // Força a atualização da sessão
      } catch (error) {
        // Mesmo se o signIn falhar, redireciona para a página principal
        toast.success("Conta criada com sucesso! Faça login para continuar.")
        router.push("/")
        router.refresh()
      }
    },
    onError: (error: any) => {
      let errorMessage = "Ocorreu um erro ao criar sua conta. Tente novamente."
      
      if (error?.response?.status === 409) {
        errorMessage = "Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail."
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      toast.error(errorMessage)
    },
  })
} 