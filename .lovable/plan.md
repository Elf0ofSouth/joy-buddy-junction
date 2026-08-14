# Plano de Implementação: Fluxo de Login Discord

Implementação de um sistema de autenticação via Discord usando Supabase, com uma interface futurista e consistente com o design do Cipher Project.

## Alterações de Interface (UI)

- **Modal de Login**: Criação de um modal centralizado com efeito de desfoque de fundo (glassmorphism), bordas neon roxas e animações de escala suave.
- **Botão Discord**: Botão estilizado com a cor oficial do Discord e efeitos de brilho/pulso ao passar o mouse.
- **Estado Pós-Login**: Substituição do botão "ENTRAR" no navbar pelo avatar e nome do usuário logado.
- **Menu Dropdown**: Menu suspenso para o perfil do usuário com opções de "Minha Conta", "Meus Pedidos" e "Sair".

## Detalhes Técnicos

- **Supabase Auth**: Utilização de `signInWithOAuth` com o provider `discord`.
- **Gerenciamento de Estado**: Uso de `zustand` para controlar o estado global do usuário e a visibilidade do modal.
- **Animações**: Implementação de animações de entrada e interação usando `framer-motion`.
- **Notificações**: Feedback visual para sucesso ou erro usando `sonner`.
- **Sincronização**: O estado do usuário é persistido e atualizado automaticamente através do listener `onAuthStateChange`.

## Passos Realizados

1. Instalação de dependências (`zustand`, `sonner`, `framer-motion`).
2. Criação dos hooks de estado (`useAuthStore`, `useAuthModal`).
3. Desenvolvimento do componente `AuthModal` com design futurista.
4. Desenvolvimento do componente `UserNav` para gerenciar a exibição do usuário no navbar.
5. Integração global no `src/routes/__root.tsx` para monitorar a sessão e prover o modal em todo o site.
6. Atualização do `src/routes/index.tsx` para utilizar o novo fluxo de navegação de usuário.
