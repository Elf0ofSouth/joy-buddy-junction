-- Update products seed with Portuguese text
TRUNCATE public.products CASCADE;

INSERT INTO public.products (name, description, price_brl, icon) VALUES
('CARGO VIP', 'Ganhe acesso ao lounge VIP exclusivo, cores personalizadas e suporte prioritário.', 15.00, 'Shield'),
('EMBLEMA BOOSTER', 'Um emblema brilhante exclusivo ao lado do seu nome em todos os canais.', 10.00, 'Zap'),
('TAG PERSONALIZADA', 'Seu próprio cargo personalizado com o nome e a cor de sua escolha.', 25.00, 'Tag');