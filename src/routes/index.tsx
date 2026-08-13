import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingCart, Shield, Zap, Tag, MessageSquare, ChevronDown, ExternalLink, ArrowRight, Trophy, Crown, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import logoAsset from "@/assets/cipher-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "Cipher Project | Vantagens Premium para Discord",
    meta: [
      { name: "description", content: "Vantagens digitais exclusivas para a elite da comunidade Discord. Cargos VIP, emblemas personalizados e muito mais." },
      { property: "og:title", content: "Cipher Project" },
      { property: "og:description", content: "Vantagens digitais exclusivas para a elite da comunidade Discord." },
      { name: "twitter:card", content: "summary_large_image" }
    ],
  }),
});

function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [topCiphers, setTopCiphers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch featured products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .limit(6);
      
      if (products) setFeaturedProducts(products);

      // Fetch leaderboard data (mocking for now if no orders exist, but setup for real query)
      // Real query would be a RPC or a complex join/group by
      // For now, let's use some high-quality mock data that looks real
      setTopCiphers([
        { id: 1, username: 'ZeroDay', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZeroDay', total_spent: 1250.00 },
        { id: 2, username: 'NetRunner', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NetRunner', total_spent: 980.50 },
        { id: 3, username: 'GhostShell', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GhostShell', total_spent: 750.00 },
        { id: 4, username: 'BitPhantom', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BitPhantom', total_spent: 450.00 },
        { id: 5, username: 'CryptoMancer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoMancer', total_spent: 320.00 },
        { id: 6, username: 'LogicBomb', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LogicBomb', total_spent: 280.00 },
        { id: 7, username: 'DataVoid', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DataVoid', total_spent: 150.00 },
      ]);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 circuit-bg pointer-events-none z-0" />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-primary/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <img src={logoAsset.url} alt="Cipher Project" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tighter chrome-text">CIPHER PROJECT</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            <a href="#store" className="hover:text-primary transition-colors">Loja</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Processo</a>
            <a href="#faq" className="hover:text-primary transition-colors">Suporte</a>
          </div>

          <div className="flex items-center gap-4">
             <Button variant="outline" size="sm" className="hidden sm:flex border-primary/40 hover:neon-border transition-all">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrinho (0)
             </Button>
             <Button size="sm" className="bg-primary hover:opacity-90 transition-all font-bold">
               ENTRAR
             </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-32 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
          
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 flex items-center justify-center group">
                 <img src={logoAsset.url} alt="Cipher Project" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(139,47,232,0.5)]" />
              </div>
              <div className="absolute -inset-4 border border-primary/10 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 chrome-text max-w-4xl mx-auto leading-tight">
            A REDE DE ELITE PARA <span className="text-primary">CIPHERS</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed uppercase tracking-wider">
            Vantagens premium no Discord, itens digitais exclusivos e entrega automatizada. Bem-vindo ao sindicato.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:opacity-90 px-8 py-6 text-lg font-bold h-auto min-w-[200px] shadow-[0_0_20px_rgba(139,47,232,0.4)]">
              VER LOJA <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary/40 hover:neon-border px-8 py-6 text-lg font-bold h-auto min-w-[200px] glass">
              ENTRAR NO DISCORD
            </Button>
          </div>
        </section>

        {/* Product Catalog */}
        <section id="store" className="container mx-auto px-4 py-24 border-t border-primary/10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 chrome-text">ARSENAL DIGITAL</h2>
              <p className="text-primary uppercase tracking-[0.2em] text-sm">Vantagens Exclusivas do Servidor</p>
            </div>
            <div className="hidden sm:block text-xs font-mono text-muted-foreground opacity-50">
              [ STATUS: ONLINE ]
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCard 
              name="CARGO VIP" 
              price="R$ 15,00" 
              icon={<Shield className="w-6 h-6" />}
              description="Ganhe acesso ao lounge VIP exclusivo, cores personalizadas e suporte prioritário."
            />
            <ProductCard 
              name="EMBLEMA BOOSTER" 
              price="R$ 10,00" 
              icon={<Zap className="w-6 h-6" />}
              description="Um emblema brilhante exclusivo ao lado do seu nome em todos os canais."
            />
            <ProductCard 
              name="TAG PERSONALIZADA" 
              price="R$ 25,00" 
              icon={<Tag className="w-6 h-6" />}
              description="Seu próprio cargo personalizado com o nome e a cor de sua escolha."
            />
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="container mx-auto px-4 py-24 bg-primary/5 relative">
          <div className="absolute inset-0 circuit-bg pointer-events-none opacity-10" />
          <h2 className="text-center text-3xl font-bold mb-16 chrome-text">ACESSO CONCEDIDO: PROCESSO</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <Step number="01" title="SELECIONE O ITEM" description="Navegue por nossa seleção curada de melhorias de servidor." />
            <Step number="02" title="PAGAMENTO RÁPIDO" description="Pague instantaneamente via PIX. Totalmente automatizado e seguro." />
            <Step number="03" title="ENTREGA INSTANTÂNEA" description="Seus cargos são aplicados automaticamente pelo nosso bot." />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container mx-auto px-4 py-24">
          <h2 className="text-center text-3xl font-bold mb-16 chrome-text">PERGUNTAS FREQUENTES</h2>
          <div className="max-w-3xl mx-auto glass p-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-primary/20">
                <AccordionTrigger className="hover:text-primary transition-colors text-left uppercase tracking-wider">COMO RECEBO MEU ITEM?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground uppercase text-xs leading-relaxed">
                  Após a confirmação do seu pagamento via PIX, nosso bot do Discord atribuirá automaticamente seus cargos e vantagens com base no seu ID do Discord.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-primary/20">
                <AccordionTrigger className="hover:text-primary transition-colors text-left uppercase tracking-wider">AS VANTAGENS EXPIRAM?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground uppercase text-xs leading-relaxed">
                  A maioria dos cargos são assinaturas mensais, enquanto emblemas e algumas tags são permanentes. Verifique os detalhes do produto para durações específicas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-black py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <img src={logoAsset.url} alt="Cipher Project" className="w-6 h-6 object-contain" />
              <span className="font-bold text-lg chrome-text">CIPHER PROJECT</span>
            </div>
            <div className="flex gap-6">
              <Button variant="ghost" size="icon" className="hover:text-primary"><MessageSquare className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="hover:text-primary"><ExternalLink className="w-5 h-5" /></Button>
            </div>
          </div>
          <div className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] opacity-50">
            &copy; 2026 CIPHER PROJECT // APENAS ACESSO CRIPTOGRAFADO
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ name, price, description, icon }: { name: string; price: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="glass border-primary/20 p-6 group hover:neon-border transition-all duration-500 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className="mb-6 w-12 h-12 glass border-primary/40 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 chrome-text">{name}</h3>
      <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed uppercase tracking-wide">
        {description}
      </p>
      <div className="flex items-center justify-between pt-6 border-t border-primary/10">
        <span className="text-2xl font-black text-primary font-mono">{price}</span>
        <Button size="sm" className="bg-primary hover:opacity-90 font-bold">COMPRAR AGORA</Button>
      </div>
    </Card>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center group">
      <div className="w-16 h-16 glass border-primary/40 mx-auto mb-6 flex items-center justify-center text-2xl font-black text-primary group-hover:neon-border transition-all transform rotate-45">
        <span className="transform -rotate-45">{number}</span>
      </div>
      <h3 className="text-lg font-bold mb-2 chrome-text">{title}</h3>
      <p className="text-sm text-muted-foreground uppercase tracking-widest leading-relaxed">
        {description}
      </p>
    </div>
  );
}
