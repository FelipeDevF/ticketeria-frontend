import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Se chegou aqui, o usuário está autenticado
    return null
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token
      }
    },
  }
)

// Configura as rotas que devem ser protegidas
export const config = {
  matcher: [
    "/pagamento",
    "/confirmacao-pedido", 
    "/meus-pedidos"
  ]
} 