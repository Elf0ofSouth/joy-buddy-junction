-- ATENCAO: as migrations anteriores deste diretorio NAO descrevem o banco em
-- producao. Uma inspecao via information_schema mostrou que o banco real tem
-- apenas orders, products e user_profiles, com nomes diferentes dos arquivos
-- (products.price, nao price_brl; orders.amount, nao total_price) e sem as
-- tabelas stock_items, banners, user_roles e abandoned_carts.
--
-- Esta migration foi escrita a partir do banco real, e e ADITIVA: nao renomeia
-- nem remove nada. A aplicacao foi ajustada para usar os nomes ja existentes.

-- ---------------------------------------------------------------------------
-- 1. Quem e admin
-- ---------------------------------------------------------------------------

-- A funcao `has_role` que as migrations antigas assumiam nao existe no banco.
-- SECURITY DEFINER e obrigatorio aqui: a policy de UPDATE em user_profiles
-- precisa consultar user_profiles, e sem isso o Postgres entra em recursao
-- infinita de RLS.
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

REVOKE EXECUTE ON FUNCTION public.current_user_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_is_admin() TO service_role;

-- ---------------------------------------------------------------------------
-- 2. Campos novos do produto
-- ---------------------------------------------------------------------------

-- `is_available` nao existia: nao havia como tirar um produto da loja.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percent INTEGER NOT NULL DEFAULT 0;

-- 'automatic' = entrega por chave do estoque; 'manual' = entregue a mao.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS delivery_type TEXT NOT NULL DEFAULT 'manual';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

DO $$ BEGIN
    ALTER TABLE public.products
        ADD CONSTRAINT products_discount_percent_range
        CHECK (discount_percent >= 0 AND discount_percent <= 100);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.products
        ADD CONSTRAINT products_delivery_type_valid
        CHECK (delivery_type IN ('automatic', 'manual'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DO $$ BEGIN
    CREATE TRIGGER set_products_updated_at
        BEFORE UPDATE ON public.products
        FOR EACH ROW
        EXECUTE PROCEDURE public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------------------------------------------------------------------------
-- 3. Estoque digital
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.stock_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    content text NOT NULL,
    status text NOT NULL DEFAULT 'available'
        CHECK (status IN ('available', 'sold', 'revoked')),
    order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    sold_at timestamptz
);

CREATE INDEX IF NOT EXISTS stock_items_product_status_idx
    ON public.stock_items (product_id, status);

ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_items TO authenticated;
GRANT ALL ON public.stock_items TO service_role;

-- O conteudo e a chave entregue ao cliente: so admin enxerga.
DO $$ BEGIN
    CREATE POLICY "Admins gerenciam o estoque" ON public.stock_items
        FOR ALL TO authenticated
        USING (public.current_user_is_admin())
        WITH CHECK (public.current_user_is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------------------------------------------------------------------------
-- 4. Permissoes que faltavam para o painel admin
-- ---------------------------------------------------------------------------

-- Existiam apenas as policies "usuario ve/cria os proprios pedidos", entao a
-- aba Pedidos aparecia vazia mesmo para admin, e mudar status nao funcionava.
GRANT UPDATE ON public.orders TO authenticated;

DO $$ BEGIN
    CREATE POLICY "Admins veem todos os pedidos" ON public.orders
        FOR SELECT TO authenticated
        USING (public.current_user_is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins atualizam pedidos" ON public.orders
        FOR UPDATE TO authenticated
        USING (public.current_user_is_admin())
        WITH CHECK (public.current_user_is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- user_profiles so tinha UPDATE do proprio perfil, entao promover ou remover
-- um admin pela aba Usuarios falhava silenciosamente.
DO $$ BEGIN
    CREATE POLICY "Admins atualizam perfis" ON public.user_profiles
        FOR UPDATE TO authenticated
        USING (public.current_user_is_admin())
        WITH CHECK (public.current_user_is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;
