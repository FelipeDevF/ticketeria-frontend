import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAutoLogin() {
  const router = useRouter()

  const autoLogin = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        // Login bem-sucedido, redirecionar para home
        router.push("/")
        return { success: true }
      } else {
        // Login falhou
        return { success: false, error: result?.error }
      }
    } catch (error) {
      console.error("Erro no login automático:", error)
      return { success: false, error: "Erro interno" }
    }
  }

  return { autoLogin }
} 