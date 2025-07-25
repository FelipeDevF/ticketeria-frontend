import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"
import { getApiUrl } from "@/lib/utils"

// Função utilitária para decodificar JWT (base64url)
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const apiUrl = getApiUrl()
          const response = await axios.post(`${apiUrl}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          })

          // Verifica se a resposta contém erro
          if (response.data.message && response.data.message.includes('inválidas')) {
            return null
          }

          // Verifica se a resposta tem a estrutura esperada
          if (!response.data.access_token) {
            return null
          }

          const { access_token, refresh_token } = response.data

          // Decodifica o token JWT para extrair dados do usuário
          const payload = parseJwt(access_token)

          if (!payload) {
            return null
          }

          return {
            id: payload.sub,
            email: payload.email,
            name: payload.username,
            role: payload.role,
            accessToken: access_token,
            refreshToken: refresh_token,
          }
        } catch (error: any) {
          console.error("Erro no login:", error.response?.status, error.response?.data)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
        session.user = {
          ...session.user,
          email: token.email,
          name: token.name,
          role: token.role,
          id: token.sub,
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Permite redirecionamento para a página principal após login
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: "/acesso-negado",
    error: "/acesso-negado",
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 3 dias em segundos
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 24 * 60 * 60, // 3 dias em segundos
      },
    },
  },
})

export { handler as GET, handler as POST } 