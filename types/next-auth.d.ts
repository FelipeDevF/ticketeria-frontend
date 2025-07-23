import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    accessToken?: string
    refreshToken?: string
    role?: string
  }

  interface Session {
    accessToken?: string
    refreshToken?: string
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    role?: string
  }
} 