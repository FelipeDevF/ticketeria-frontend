export interface RegisterPayload {
  name: string
  email: string
  password: string
  cpf: string
  phone: string
  birthDate: string
  address: string
  city: string
  state: string
  zipCode: string
  role: string
  acceptTerms: boolean
  acceptNewsletter: boolean
}

export interface AuthResponse {
  token: string
  refreshToken: string
} 