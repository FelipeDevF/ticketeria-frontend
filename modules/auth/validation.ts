import { z } from "zod"

export const cadastroSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
  email: z.string().min(1, "E-mail é obrigatório").email("Digite um e-mail válido"),
  telefone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^(\(\d{2}\) \d{5}-\d{4})$/, "Formato: (11) 99999-9999"),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato: 000.000.000-00")
    .refine((cpf) => {
      const numbers = cpf.replace(/\D/g, "")
      if (numbers.length !== 11) return false
      if (/^(\d)\1{10}$/.test(numbers)) return false
      let sum = 0
      for (let i = 0; i < 9; i++) {
        sum += Number.parseInt(numbers[i]) * (10 - i)
      }
      let digit = 11 - (sum % 11)
      if (digit >= 10) digit = 0
      if (Number.parseInt(numbers[9]) !== digit) return false
      sum = 0
      for (let i = 0; i < 10; i++) {
        sum += Number.parseInt(numbers[i]) * (11 - i)
      }
      digit = 11 - (sum % 11)
      if (digit >= 10) digit = 0
      if (Number.parseInt(numbers[10]) !== digit) return false
      return true
    }, "CPF inválido"),
  dataNascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine((dateString) => {
      const [year, month, day] = dateString.split("-").map(Number)
      const birthDate = new Date(year, month - 1, day)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age >= 18
    }, "Você deve ter pelo menos 18 anos para se cadastrar"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  cep: z.string().min(1, "CEP é obrigatório").regex(/^\d{5}-\d{3}$/, "Formato: 00000-000"),
  estado: z.string().min(1, "Estado é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string().min(1, "Confirme sua senha"),
  acceptTerms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos de uso"),
  acceptNewsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export type CadastroFormData = z.infer<typeof cadastroSchema> 