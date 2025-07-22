import { z } from "zod"

// Schema para login
export const loginSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("Digite um e-mail válido"),
  password: z.string().min(1, "Senha é obrigatória").min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export type LoginFormData = z.infer<typeof loginSchema>
