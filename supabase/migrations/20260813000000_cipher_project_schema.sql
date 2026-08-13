-- Products Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price_brl NUMERIC(10, 2) NOT NULL,
    icon TEXT,
    category TEXT DEFAULT 'perk',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User Profiles
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    discord_id TEXT UNIQUE,
    username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    product_id UUID REFERENCES public.products(id),
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',
    pix_code TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Grants
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT SELECT ON public.user_profiles TO authenticated;

GRANT ALL ON public.products TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.user_profiles TO service_role;

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for available products" ON public.products
    FOR SELECT USING (is_available = TRUE);

CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Initial Products Seed
INSERT INTO public.products (name, description, price_brl, icon) VALUES
('VIP ROLE', 'Gain access to the exclusive VIP lounge, custom colors, and priority support.', 15.00, 'Shield'),
('BOOSTER BADGE', 'A unique glowing badge next to your name in all channels.', 10.00, 'Zap'),
('CUSTOM TAG', 'Your own custom role with a name and color of your choice.', 25.00, 'Tag');
