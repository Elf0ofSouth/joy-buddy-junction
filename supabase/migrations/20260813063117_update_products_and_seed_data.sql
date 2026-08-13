-- Adicionar campos extras para produtos
ALTER TABLE public.products ADD COLUMN image_url TEXT;
ALTER TABLE public.products ADD COLUMN purchase_count INTEGER DEFAULT 0;

-- Atualizar produtos existentes com dados fictícios
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop', purchase_count = 128 WHERE name = 'CARGO VIP' OR name = 'VIP ROLE';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=800&auto=format&fit=crop', purchase_count = 256 WHERE name = 'EMBLEMA BOOSTER' OR name = 'BOOSTER BADGE';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', purchase_count = 84 WHERE name = 'TAG PERSONALIZADA' OR name = 'CUSTOM TAG';

-- Criar alguns perfis de usuários para o leaderboard se não existirem (apenas para demonstração)
-- Nota: user_profiles referencia auth.users, então em um cenário real seriam criados via trigger ou no cadastro.
-- Para o leaderboard de demo, vamos usar dados fictícios no componente se o banco estiver vazio.

GRANT SELECT ON public.user_profiles TO anon;
