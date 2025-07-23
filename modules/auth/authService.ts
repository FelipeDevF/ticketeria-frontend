import axios from 'axios'
import { getApiUrl } from '@/lib/utils'
import type { RegisterPayload, AuthResponse, LoginPayload } from './types'

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>(`${getApiUrl()}/auth/register`, payload)
  return response.data
} 

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>(`${getApiUrl()}/auth/login`, payload)
  return response.data
} 