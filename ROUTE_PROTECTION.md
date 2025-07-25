# Proteção de Rotas - Ticketeria

## Visão Geral

Este projeto implementa uma estratégia dupla de proteção de rotas para garantir que apenas usuários autenticados tenham acesso a páginas específicas.

## Estratégia Implementada

### 1. Middleware (Proteção no Servidor)
- **Arquivo**: `middleware.ts`
- **Função**: Intercepta requisições antes de chegarem aos componentes
- **Vantagem**: Performance superior e segurança no servidor

### 2. Hook de Autenticação (Proteção no Cliente)
- **Arquivo**: `hooks/useAuth.ts`
- **Função**: Verificação adicional no cliente com redirecionamento
- **Vantagem**: UX melhorada com loading states

## Rotas Protegidas

As seguintes rotas estão protegidas:
- `/pagamento`
- `/confirmacao-pedido`
- `/meus-pedidos`

## Página de Acesso Negado

Quando um usuário não autenticado tenta acessar uma rota protegida, ele é redirecionado para `/acesso-negado`, que oferece:

- **Mensagem clara** sobre a necessidade de autenticação
- **Botão de Login** que redireciona para `/cadastro`
- **Botão de Cadastro** que redireciona para `/cadastro`
- **Botão Voltar** para retornar à página anterior

## Como Funciona

### Fluxo de Proteção

1. **Requisição chega** → Middleware intercepta
2. **Verifica token** → Se não existir, redireciona para `/acesso-negado`
3. **Se autenticado** → Continua para a página
4. **Hook verifica** → Proteção adicional no cliente
5. **Loading state** → Mostra spinner durante verificação

### Comportamento

- **Usuários não autenticados**: Redirecionados automaticamente para `/acesso-negado`
- **Usuários autenticados**: Acesso normal às páginas
- **Loading**: Estados de carregamento apropriados durante verificação

## Como Usar em Novas Páginas

### Opção 1: Usando o Hook (Recomendado)

```tsx
"use client"

import { useAuth } from "@/hooks/useAuth"
import { AuthLoading } from "@/components/auth"

export default function MinhaPaginaProtegida() {
  const { isAuthenticated, isLoading } = useAuth()

  // Verifica autenticação
  if (isLoading) {
    return <AuthLoading message="Verificando autenticação..." />
  }

  if (!isAuthenticated) {
    return null // Será redirecionado pelo hook
  }

  return (
    <div>
      {/* Conteúdo da página */}
    </div>
  )
}
```

### Opção 2: Usando o HOC

```tsx
"use client"

import { withAuth } from "@/components/auth"

function MinhaPagina() {
  return (
    <div>
      {/* Conteúdo da página */}
    </div>
  )
}

export default withAuth(MinhaPagina)
```

## Adicionando Novas Rotas Protegidas

Para proteger uma nova rota, adicione-a ao array `matcher` no `middleware.ts`:

```typescript
export const config = {
  matcher: [
    "/pagamento",
    "/confirmacao-pedido", 
    "/meus-pedidos",
    "/nova-rota-protegida" // Adicione aqui
  ]
}
```

## Componentes Disponíveis

### `useAuth()`
Hook que retorna:
- `session`: Dados da sessão
- `status`: Status da autenticação
- `isAuthenticated`: Boolean indicando se está autenticado
- `isLoading`: Boolean indicando se está carregando
- `user`: Dados do usuário

### `AuthLoading`
Componente de loading com spinner e mensagem customizável.

### `withAuth()`
HOC que envolve componentes para proteção automática.

## Segurança

- **Dupla verificação**: Servidor + Cliente
- **Redirecionamento seguro**: Sempre para `/acesso-negado`
- **Tokens JWT**: Validação automática via NextAuth
- **Sessões persistentes**: Configuradas para 3 dias

## Troubleshooting

### Problema: Loop de redirecionamento
**Solução**: Verifique se as rotas `/cadastro` e `/acesso-negado` não estão sendo protegidas pelo middleware.

### Problema: Loading infinito
**Solução**: Verifique se o `SessionProvider` está configurado corretamente no layout.

### Problema: Página não carrega
**Solução**: Verifique se o usuário está autenticado e se os tokens estão válidos. 