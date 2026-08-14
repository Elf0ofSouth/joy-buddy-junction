# Plan: Conectar Supabase Externo

O usuário deseja desconectar o Lovable Cloud e conectar sua própria instância do Supabase. Como sou uma IA, não posso acessar fisicamente o painel do Lovable para "desmarcar" uma opção, mas posso configurar o código e o ambiente para usar as credenciais externas fornecidas.

## Ações
1. **Preparar Ambiente**: Solicitar formalmente a URL e a Chave Anon do Supabase do usuário (embora ele tenha pulado na rodada anterior, é necessário para a conexão funcionar).
2. **Atualizar Variáveis de Ambiente**: Configurar o arquivo `.env` com as novas credenciais.
3. **Instruções de Migração**: Fornecer os comandos SQL necessários para recriar as tabelas (`products`, `orders`, `user_profiles`) no novo banco de dados, garantindo que a estrutura do app não quebre.
4. **Verificação**: Confirmar que o cliente Supabase em `src/integrations/supabase/client.ts` está lendo as novas variáveis.

## Detalhes Técnicos
- O arquivo `src/integrations/supabase/client.ts` já está configurado para ler `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Precisaremos rodar um script SQL no novo Supabase para manter a compatibilidade com:
  - Tabela `products` (id, name, description, price_brl, category, icon, is_available).
  - Tabela `user_profiles` (id, username, avatar_url, discord_id).
  - Tabela `orders` (id, user_id, product_id, total_price, status, pix_code).
- O login via Discord precisará ser configurado manualmente no novo painel do Supabase pelo usuário.
