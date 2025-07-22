# TicketHub

TicketHub é uma plataforma web para busca, visualização e compra de ingressos para eventos de diversos tipos, como música, teatro, comédia, gastronomia e tecnologia. O projeto é construído com **Next.js**, **React**, **TypeScript** e **Tailwind CSS**, com uma arquitetura moderna e componentes reutilizáveis.

## Índice

- [Funcionalidades](#funcionalidades)
- [Demonstração](#demonstração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Principais Tecnologias](#principais-tecnologias)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Detalhes Técnicos](#detalhes-técnicos)
- [Licença](#licença)

---

## Funcionalidades

- **Catálogo de Eventos:** Lista de eventos com busca, filtro por categoria e destaques.
- **Página de Detalhes do Evento:** Informações completas, setores, tipos de ingresso, vídeos, local de venda e compra direta.
- **Carrinho de Compras:** Adição, remoção e ajuste de quantidade de ingressos.
- **Fluxo de Compra:** Checkout com formulário, resumo do pedido e confirmação.
- **Cadastro e Login:** Formulários validados com autenticação simulada.
- **Meus Pedidos:** Histórico de compras do usuário, com detalhes e status.
- **Confirmação de Pedido:** Tela de sucesso com detalhes do pedido e instruções.
- **Tema Claro/Escuro:** Suporte a dark mode via `next-themes`.
- **Componentização:** Biblioteca extensa de componentes de UI reutilizáveis.
- **Validações Avançadas:** Uso de Zod para validação de formulários (login, cadastro, etc).
- **Responsividade:** Layout adaptado para dispositivos móveis e desktop.
- **Acessibilidade:** Uso de componentes acessíveis e boas práticas de UX.

---

## Demonstração

> **Nota:** O projeto não inclui backend real, sendo focado em prototipação e experiência de usuário.

---

## Estrutura do Projeto

```
ticketeria-frontend/
│
├── app/                    # Páginas e rotas do Next.js
│   ├── cadastro/           # Página de cadastro de usuário
│   ├── confirmacao-pedido/ # Página de confirmação de pedido
│   ├── evento/[id]/        # Página de detalhes do evento
│   ├── meus-pedidos/       # Histórico de pedidos do usuário
│   ├── pagamento/          # Página de pagamento
│   ├── page.tsx            # Página inicial (catálogo de eventos)
│   ├── layout.tsx          # Layout global
│   ├── loading.tsx         # Componente global de loading
│   └── globals.css         # Estilos globais (Tailwind)
│
├── components/             # Componentes React reutilizáveis
│   ├── theme-provider.tsx  # Provedor de tema (dark/light)
│   └── ui/                 # Biblioteca de componentes de UI (botão, card, input, etc)
│
├── hooks/                  # Hooks customizados (ex: use-toast, use-mobile)
│
├── lib/                    # Funções utilitárias, tipos e dados mockados
│   ├── events.ts           # Lista mockada de eventos
│   ├── types.ts            # Tipos TypeScript (Event, CartItem, OrderDetails, etc)
│   ├── utils.ts            # Funções utilitárias
│   └── validations.ts      # Schemas de validação (Zod)
│
├── public/                 # Imagens e arquivos estáticos
│
├── styles/                 # Estilos adicionais
│
├── tailwind.config.ts      # Configuração do Tailwind CSS
├── postcss.config.mjs      # Configuração do PostCSS
├── tsconfig.json           # Configuração do TypeScript
├── next.config.mjs         # Configuração do Next.js
├── package.json            # Dependências e scripts
└── pnpm-lock.yaml          # Lockfile do gerenciador de pacotes
```

---

## Principais Tecnologias

- **Next.js**: Framework React para SSR/SSG e rotas baseadas em arquivos.
- **React**: Biblioteca para construção de interfaces.
- **TypeScript**: Tipagem estática para maior robustez.
- **Tailwind CSS**: Utilitários CSS para estilização rápida e responsiva.
- **Radix UI**: Componentes acessíveis e semânticos.
- **Zod**: Validação de schemas para formulários.
- **React Hook Form**: Gerenciamento de formulários.
- **Lucide Icons**: Ícones SVG modernos.
- **next-themes**: Suporte a tema claro/escuro.
- **Outros**: date-fns, recharts, embla-carousel, etc.

---

## Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repo>
   cd ticketeria-frontend
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   # ou
   npm install
   # ou
   yarn install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm dev
   # ou
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

---

## Scripts Disponíveis

- `dev`: Inicia o servidor de desenvolvimento Next.js.
- `build`: Gera a build de produção.
- `start`: Inicia o servidor em modo produção.
- `lint`: Executa o linter.

---

## Detalhes Técnicos

- **Estrutura de Dados:** Os eventos, setores, tipos de ingresso e pedidos são mockados em arquivos TypeScript (`lib/events.ts`, `lib/types.ts`).
- **Validações:** Todos os formulários (login, cadastro, compra) usam validação robusta com Zod.
- **Persistência:** Carrinho e pedidos são salvos no `localStorage` para simulação de fluxo real.
- **Componentização:** Mais de 40 componentes de UI prontos para uso, baseados em Radix UI e estilizados com Tailwind.
- **Tema:** Suporte a dark/light mode via `next-themes` e CSS customizado.
- **Acessibilidade:** Componentes com foco em acessibilidade e navegação por teclado.
- **Responsividade:** Layouts adaptados para mobile, tablet e desktop.
- **Customização:** Fácil extensão de temas, cores e componentes via Tailwind e Radix.

---

## Licença

Este projeto é apenas para fins educacionais/prototipação. Adapte a licença conforme necessário. 