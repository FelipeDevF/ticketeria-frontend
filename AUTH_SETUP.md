# Configuração do NextAuth

## Configuração Inicial

1. **Variáveis de Ambiente**
   
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   ```

   **Importante**: Em produção, use uma chave secreta forte e única.

2. **Estrutura Implementada**

   - ✅ NextAuth configurado com Credentials Provider
   - ✅ Login automático após cadastro
   - ✅ Cookies configurados para 3 dias
   - ✅ Hooks personalizados para autenticação
   - ✅ SessionProvider configurado

## Hooks Disponíveis

### `useRegisterWithAutoLogin`
Hook que combina cadastro com login automático:

```typescript
const registerMutation = useRegisterWithAutoLogin()

const onCadastroSubmit = async (data: any) => {
  const payload: RegisterPayload = {
    name: data.nome,
    email: data.email,
    password: data.password,
    // ... outros campos
  }
  
  const loginData = {
    email: data.email,
    password: data.password
  }
  
  registerMutation.mutate({ payload, loginData })
}
```

### `useSession`
Hook para verificar o status da sessão:

```typescript
const { session, isAuthenticated, isLoading } = useSession()

if (isAuthenticated) {
  console.log('Usuário logado:', session?.user?.email)
}
```

### `useLogin`
Hook para fazer login manual:

```typescript
const loginMutation = useLogin({
  onSuccess: (data) => {
    // Login bem-sucedido
  },
  onError: (error) => {
    // Tratar erro
  }
})
```

## Funcionalidades

### Login Automático após Cadastro
- Quando o usuário se cadastra com sucesso, o sistema automaticamente faz login
- Se o login automático falhar, o usuário é redirecionado para uma página de sucesso
- Os tokens são armazenados nos cookies por 3 dias

### Cookies Seguros
- Cookies configurados como `httpOnly` para segurança
- `sameSite: "lax"` para compatibilidade
- `secure: true` em produção
- Expiração de 3 dias

### Redirecionamentos
- Login bem-sucedido: redireciona para `/`
- Cadastro com falha no login automático: redireciona para `/cadastro?success=true`

## Uso em Componentes

```typescript
import { useSession } from '@/modules/auth'
import { signIn, signOut } from 'next-auth/react'

// Verificar se está logado
const { isAuthenticated } = useSession()

// Fazer login
await signIn('credentials', {
  email: 'user@example.com',
  password: 'password',
  redirect: false
})

// Fazer logout
await signOut({ callbackUrl: '/' })
```

## Estrutura de Arquivos

```
modules/auth/
├── hooks/
│   ├── useLogin.ts
│   ├── useRegister.ts
│   ├── useRegisterWithAutoLogin.ts
│   ├── useAutoLogin.ts
│   └── useSession.ts
├── authService.ts
├── types.ts
└── validation.ts

app/api/auth/[...nextauth]/
└── route.ts

types/
└── next-auth.d.ts
```

## Próximos Passos

1. Configure as variáveis de ambiente
2. Teste o cadastro e login automático
3. Implemente proteção de rotas se necessário
4. Adicione refresh token se necessário
5. Configure middleware para proteção de rotas 