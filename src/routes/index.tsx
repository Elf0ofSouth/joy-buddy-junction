import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingCart, Shield, Zap, Tag, MessageSquare, ChevronDown, ExternalLink, ArrowRight, Trophy, Crown, Medal, Gift, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import logoAsset from "@/assets/cipher-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import characterAsset from "@/assets/cipher-character-new.png.asset.json";

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

        {/* Featured Products Carousel */}
        <section id="featured" className="container mx-auto px-4 py-24 border-t border-primary/10">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold chrome-text">EM DESTAQUE</h2>
              <p className="text-primary uppercase tracking-[0.2em] text-sm">Arsenal de Elite</p>
            </div>
            <a href="#store" className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
              VER TODOS <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-primary/20 hover:neon-border transition-all duration-500 scale-100 hover:scale-[1.02]">
                    {/* Background Image/Placeholder */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ 
                        backgroundImage: `url(${product.image_url || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop'})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    
                    {/* Purchase Count Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/60 backdrop-blur-md border-primary/40 text-primary font-mono">
                        {product.purchase_count || 128} COMPRAS
                      </Badge>
                    </div>

                    {/* Product Name */}
                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-2xl font-black chrome-text drop-shadow-lg uppercase italic">{product.name}</h3>
                    </div>

                    {/* Buy Now Floating Button */}
                    <div className="absolute bottom-6 right-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button size="sm" className="bg-primary hover:opacity-90 font-bold rounded-full px-6 shadow-[0_0_15px_rgba(139,47,232,0.6)]">
                        COMPRAR AGORA
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-8 md:hidden">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
            <CarouselPrevious className="hidden md:flex -left-12 border-primary/20" />
            <CarouselNext className="hidden md:flex -right-12 border-primary/20" />
          </Carousel>
        </section>

        {/* Leaderboard Section */}
        <section id="leaderboard" className="container mx-auto px-4 py-24 border-t border-primary/10 relative">
          <div className="absolute inset-0 circuit-bg pointer-events-none opacity-5" />
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black chrome-text mb-2 italic">TOP CIPHERS</h2>
            <p className="text-primary uppercase tracking-[0.3em] text-xs">Os Maiores Contribuintes do Sindicato</p>
          </div>

          {/* Podium (Top 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto mb-16">
            {/* Rank 2 */}
            {topCiphers[1] && (
              <div className="order-2 md:order-1 flex flex-col items-center">
                <div className="relative mb-6 group">
                  <div className="absolute -inset-1 bg-gradient-to-b from-slate-400 to-transparent rounded-full blur group-hover:blur-md transition-all" />
                  <Avatar className="w-24 h-24 border-2 border-slate-400/50 relative z-10">
                    <AvatarImage src={topCiphers[1].avatar_url} />
                    <AvatarFallback className="bg-black text-slate-400">#2</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center border-2 border-black z-20">
                    <Medal className="w-4 h-4 text-black" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg chrome-text">{topCiphers[1].username}</h3>
                  <p className="text-primary font-mono text-sm">R$ {topCiphers[1].total_spent.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Rank 1 */}
            {topCiphers[0] && (
              <div className="order-1 md:order-2 flex flex-col items-center">
                <div className="relative mb-8 group">
                  <div className="absolute -inset-2 bg-gradient-to-b from-yellow-500 to-transparent rounded-full blur-md group-hover:blur-lg transition-all" />
                  <Avatar className="w-32 h-32 border-4 border-yellow-500/50 relative z-10 scale-110">
                    <AvatarImage src={topCiphers[0].avatar_url} />
                    <AvatarFallback className="bg-black text-yellow-500">#1</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <Crown className="w-10 h-10 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-black z-20">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="font-black text-2xl chrome-text uppercase tracking-tighter">{topCiphers[0].username}</h2>
                  <p className="text-primary font-mono text-lg font-bold">R$ {topCiphers[0].total_spent.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {topCiphers[2] && (
              <div className="order-3 md:order-3 flex flex-col items-center">
                <div className="relative mb-6 group">
                  <div className="absolute -inset-1 bg-gradient-to-b from-amber-700 to-transparent rounded-full blur group-hover:blur-md transition-all" />
                  <Avatar className="w-24 h-24 border-2 border-amber-700/50 relative z-10">
                    <AvatarImage src={topCiphers[2].avatar_url} />
                    <AvatarFallback className="bg-black text-amber-700">#3</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center border-2 border-black z-20">
                    <Medal className="w-4 h-4 text-black" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg chrome-text">{topCiphers[2].username}</h3>
                  <p className="text-primary font-mono text-sm">R$ {topCiphers[2].total_spent.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>

          {/* List (Rank 4-10) */}
          <div className="max-w-3xl mx-auto glass border-primary/10 overflow-hidden rounded-xl">
            {topCiphers.slice(3, 10).map((user, index) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-4 border-b border-primary/5 hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 font-mono text-muted-foreground group-hover:text-primary transition-colors">
                    #{index + 4}
                  </div>
                  <Avatar className="w-10 h-10 border border-primary/20">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-black text-xs">U</AvatarFallback>
                  </Avatar>
                  <span className="font-bold chrome-text uppercase text-sm tracking-widest">{user.username}</span>
                </div>
                <div className="font-mono text-primary font-bold">
                  R$ {user.total_spent.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product Catalog */}



        {/* Why Choose Cipher Section */}
        <section className="container mx-auto px-4 py-24 relative overflow-hidden">
          <div className="absolute inset-0 circuit-bg pointer-events-none opacity-5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
          
          <div className="flex flex-col lg:flex-row items-center gap-12 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
            
            {/* Left Side Content */}
            <div className="w-full lg:w-[55%] relative z-10">
              <span className="text-primary font-mono text-xs mb-4 block tracking-[0.3em] uppercase">[ VANTAGENS CIPHER ]</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 chrome-text leading-tight">
                POR QUE ESCOLHER A <br /> CIPHER STORE
              </h2>
              <p className="text-muted-foreground mb-10 max-w-lg uppercase text-sm tracking-widest leading-relaxed">
                Elevamos sua experiência no Discord com tecnologia de ponta e benefícios que você não encontra em nenhum outro lugar.
              </p>

              <div className="space-y-8">
                <BenefitItem 
                  icon={<Trophy className="w-6 h-6" />} 
                  title="PROGRAMA DE RECOMPENSAS" 
                  description="Suba de rank conforme compra e desbloqueie benefícios exclusivos." 
                />
                <BenefitItem 
                  icon={<Gift className="w-6 h-6" />} 
                  title="ROLETA CIPHER" 
                  description="Gire e ganhe brindes, descontos e itens exclusivos." 
                />
                <BenefitItem 
                  icon={<Shield className="w-6 h-6" />} 
                  title="SEGURANÇA GARANTIDA" 
                  description="Pagamentos protegidos e entrega 100% automatizada." 
                />
                <BenefitItem 
                  icon={<Zap className="w-6 h-6" />} 
                  title="ENTREGA INSTANTÂNEA" 
                  description="Seus itens aplicados em segundos após o pagamento." 
                />
                <BenefitItem 
                  icon={<Star className="w-6 h-6" />} 
                  title="SUPORTE PRIORITÁRIO" 
                  description="Atendimento exclusivo para membros VIP." 
                />
              </div>

              <div className="mt-12">
                <Button size="lg" className="bg-primary hover:opacity-90 px-10 py-6 text-lg font-bold h-auto shadow-[0_0_20px_rgba(139,47,232,0.4)]">
                  VER LOJA <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Right Side Character Illustration */}
            <div className="w-full lg:w-[45%] flex justify-center relative">
              <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
                {/* Subtle Purple Radial Glow */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] opacity-40 mix-blend-screen" />
                
                {/* Character Illustration */}
                <img 
                  src={characterAsset.url} 
                  alt="Cipher Character" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(139,47,232,0.3)]"
                />
              </div>
            </div>
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

function BenefitItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="flex-shrink-0 w-12 h-12 glass border-primary/30 flex items-center justify-center text-primary group-hover:neon-border transition-all duration-300">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-foreground mb-1 tracking-wider uppercase">{title}</h4>
        <p className="text-sm text-muted-foreground uppercase text-[10px] tracking-widest">{description}</p>
      </div>
    </div>
  );
}
