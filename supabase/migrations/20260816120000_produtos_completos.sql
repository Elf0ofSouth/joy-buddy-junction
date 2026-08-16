-- Consolida a gestao de produtos: banner, desconto, tipo de entrega e estoque
-- passam a viver no proprio produto (as abas Banners e Estoque foram removidas).
--
-- Corrige tambem uma falha estrutural de permissao: as policies de RLS
-- ("Admins can manage products", etc.) existiam, mas as tabelas nunca receberam
-- os GRANTs correspondentes para o papel `authenticated`. Uma policy autoriza
-- QUAIS linhas o papel enxerga; ela nao concede o privilegio de escrita na
-- tabela. Sem os dois, nenhum admin logado pelo navegador conseguia criar,
-- editar ou excluir produto, nem mudar o status de um pedido.

-- ---------------------------------------------------------------------------
-- 1. Privilegios de tabela que faltavam
-- ---------------------------------------------------------------------------

-- products: authenticated so tinha SELECT.
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;

-- orders: authenticated so tinha SELECT e INSERT, entao marcar um pedido como
-- concluido/cancelado falhava.
GRANT UPDATE ON public.orders TO authenticated;

-- ...e nao havia policy de UPDATE em orders, so de SELECT.
DO $$ BEGIN
    CREATE POLICY "Admins can update orders" ON public.orders
        FOR UPDATE TO authenticated
        USING (public.has_role(auth.uid(), 'admin'))
        WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------------------------------------------------------------------------
-- 2. Campos novos do produto
-- ---------------------------------------------------------------------------

-- Ja criados na migration 20260813063117, repetidos com IF NOT EXISTS porque
-- `types.ts` estava dessincronizado e nao da para assumir o estado do banco.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS purchase_count INTEGER DEFAULT 0;

-- Banner largo, separado do icone do card.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Desconto percentual. O preco final e derivado de price_brl.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percent INTEGER NOT NULL DEFAULT 0;

-- 'automatic' = entrega por chave do estoque (stock_items).
-- 'manual'    = entrega feita a mao pelo admin.
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

DO $$ BEGIN
    ALTER TABLE public.products
        ADD CONSTRAINT products_price_non_negative
        CHECK (price_brl >= 0);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER set_products_updated_at
        BEFORE UPDATE ON public.products
        FOR EACH ROW
        EXECUTE PROCEDURE public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------------------------------------------------------------------------
-- 3. Estoque
-- ---------------------------------------------------------------------------

-- A tela de produtos conta o estoque disponivel por produto a cada carregamento.
CREATE INDEX IF NOT EXISTS stock_items_product_status_idx
    ON public.stock_items (product_id, status);
