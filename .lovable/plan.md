# Plano de Tradução: Cipher Project

Tradução total da aplicação para Português Brasileiro (pt-BR), mantendo a estética hacker/cyber-syndicate.

## Alterações de Interface

- **SEO e Cabeçalho**: Atualizar meta-tags em `src/routes/index.tsx` e `src/routes/__root.tsx`.
- **Navegação**: "Store" -> "Loja", "Process" -> "Processo", "Support" -> "Suporte", "Cart" -> "Carrinho", "Login" -> "Entrar".
- **Herói (Hero)**: Traduzir chamadas de ação e slogans mantendo o tom de "elite network".
- **Catálogo de Produtos**: Traduzir títulos e descrições dos cards.
- **Processo (How it Works)**: Traduzir etapas e explicações técnicas.
- **FAQ**: Traduzir perguntas e respostas sobre pagamentos PIX e entrega.
- **Rodapé**: Traduzir avisos de copyright e acesso.

## Alterações de Banco de Dados

- Criar migração para atualizar as sementes (seeds) da tabela `products` com nomes e descrições em português.

## Detalhes Técnicos

- Atualizar `src/routes/index.tsx` com os novos textos.
- Executar `supabase--migration` para atualizar os dados no backend.
