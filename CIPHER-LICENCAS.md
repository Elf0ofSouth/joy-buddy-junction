# Sistema de licenças da extensão

Este site também hospeda a API de keys da extensão Cipher Project. Tudo que
foi adicionado vive em pastas próprias e não encosta na loja do Discord
(`products` / `orders` / `user_profiles`).

## O que foi adicionado

```
src/lib/cipher/
  licenses.server.ts    <- planos, geração de key, validação, expiração
  http.ts               <- CORS, JSON, auth do admin
src/routes/api/
  license/$action.ts    <- /api/license/validate | heartbeat | packages | plans | health
  admin/$.ts            <- /api/admin/*  (painel)
  services/$action.ts   <- IA, upload, proxies do Lovable
public/admin.html       <- painel de revenda
supabase/migrations/
  20260815000000_cipher_licensing.sql
tests/cipher-licenses.test.mjs
```

## Variáveis de ambiente

Veja `.env.example`. As que **precisam** existir na Vercel:

| Nome | Para quê |
|---|---|
| `SUPABASE_URL` | já usada pelo site |
| `SUPABASE_SERVICE_ROLE_KEY` | a API lê e escreve nas tabelas de licença |
| `CIPHER_ADMIN_TOKEN` | senha do painel em `/admin.html` |

Opcionais: `ANTHROPIC_API_KEY` (botão "Otimizar prompt"),
`CIPHER_RESET_PAGE_URL`, `CIPHER_AI_MODEL`.

> Depois de adicionar variável nova, **force um Redeploy**. Variável só passa
> a valer no próximo build.

## Rodar a migration

```bash
bunx supabase db push
```

Ou cole `supabase/migrations/20260815000000_cipher_licensing.sql` no SQL Editor
do Supabase.

## Testar

```bash
bun run test:cipher     # 39 checagens da lógica de licença, sem tocar no banco
curl https://SEUDOMINIO/api/license/health
```

## Duas coisas para não esquecer

**1. A service role key ignora o RLS.** Os route files (`src/routes/**`)
entram no bundle do cliente, então `client.server.ts` **nunca** pode ser
importado no topo deles. Por isso as rotas usam import dinâmico dentro do
handler:

```ts
const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
```

Esse é o mesmo aviso que está escrito no cabeçalho do próprio
`client.server.ts`. Se mexer nas rotas, mantenha o padrão.

**2. As tabelas de licença têm RLS ligado e zero policies.** Isso é de
propósito: nada nelas pode ser lido pela publishable key, que é pública e está
no bundle do site. Repare no contraste com `products`, que tem uma policy de
leitura pública porque a vitrine da loja precisa ser lida pelo navegador.
Se você criar uma policy nas tabelas de licença, estará abrindo a lista de keys
para qualquer visitante.

## Recursos ainda não ligados

Em `src/routes/api/services/$action.ts`, o mapa `LOVABLE_ROUTES` tem dois
valores `null`: **publicar projeto** e **remover marca d'água**. Os caminhos
reais da API do Lovable eram código privado do dono anterior. Para descobrir:
abra o `lovable.dev`, F12 → Network, use o recurso na interface nativa e copie
o caminho da requisição. Enquanto for `null`, o endpoint responde 501 com uma
mensagem clara.
