-- First, ensure app_role type exists
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Second, create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Third, update user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Fourth, create the role checking function now that user_roles exists
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role::text = _role
  ) OR (
    -- Fallback to user_profiles.is_admin for simple admin check
    _role = 'admin' AND EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = _user_id AND is_admin = true
    )
  );
$$;

-- Fifth, create policies for user_roles
DO $$ BEGIN
    CREATE POLICY "Admins can manage roles" ON public.user_roles
        FOR ALL TO authenticated
        USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    subtitle text,
    image_url text NOT NULL,
    link_url text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

GRANT SELECT ON public.banners TO anon, authenticated;
GRANT ALL ON public.banners TO service_role;
GRANT ALL ON public.banners TO authenticated;

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Anyone can view active banners" ON public.banners
        FOR SELECT USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can manage banners" ON public.banners
        FOR ALL TO authenticated
        USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Stock Items Table
CREATE TABLE IF NOT EXISTS public.stock_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'available' CHECK (status IN ('available', 'sold', 'revoked')),
    order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    sold_at timestamp with time zone
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_items TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_items TO authenticated;

ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Admins can manage stock items" ON public.stock_items
        FOR ALL TO authenticated
        USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- RLS for existing tables
DO $$ BEGIN
    CREATE POLICY "Admins can manage products" ON public.products
        FOR ALL TO authenticated
        USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can view all orders" ON public.orders
        FOR SELECT TO authenticated
        USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can view all profiles" ON public.user_profiles
        FOR SELECT TO authenticated
        USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can update profiles" ON public.user_profiles
        FOR UPDATE TO authenticated
        USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Update trigger function and trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
    CREATE TRIGGER set_banners_updated_at
        BEFORE UPDATE ON public.banners
        FOR EACH ROW
        EXECUTE PROCEDURE public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;
