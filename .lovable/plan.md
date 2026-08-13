# Plano de Expansão: Cipher Project - Seções Aditivas

Adicionar as seções "EM DESTAQUE" (Carrossel) e "TOP CIPHERS" (Leaderboard) à página inicial, mantendo a identidade visual hacker/cyber-syndicate.

## 1. Carrossel de Produtos em Destaque
- **Localização**: Logo abaixo do Herói, antes da grade de produtos atual.
- **Visual**: Cards horizontais grandes estilo "biblioteca de jogos".
- **Detalhes**: Imagem de fundo full-bleed, emblema de contagem de compras, botão "Comprar Agora" neon.
- **Interatividade**: Navegação por setas, hover com brilho intenso e escala.

## 2. Leaderboard: "TOP CIPHERS"
- **Localização**: Abaixo do carrossel em destaque.
- **Visual**: Pódio para o Top 3 (1º lugar centralizado e maior) e lista para posições 4-10.
- **Dados**: Integração com Supabase para calcular o total gasto por usuário (pedidos pagos).
- **Estética**: Ícones de escudo/hexágono, cores ouro/prata/bronze integradas ao neon roxo.

## 3. Alterações Técnicas
- **Componentes**: Instalar `embla-carousel-react` via shadcn se necessário.
- **Backend**: Atualizar migrações para incluir campo `image_url` e `purchase_count` em `products` (ou simular via mock inicial).
- **Frontend**: Criar sub-componentes `FeaturedCarousel` e `Leaderboard` em `src/routes/index.tsx`.
