import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingCart, Shield, Zap, Tag, MessageSquare, ChevronDown, ExternalLink, ArrowRight, Trophy, Crown, Medal, Gift, Lock, Star, Dices, Headset, Puzzle, Infinity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import logoAsset from "@/assets/cipher-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import characterAsset from "@/assets/cipher-character-new.png.asset.json";
import extensionIconAsset from "@/assets/extension-icon.png.asset.json";
import { UserNav } from "@/components/auth/user-nav";


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, amount: 0.2 }
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const }
};


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

      // Fetch leaderboard data (mock data used as fallback if db is empty)
      const mockCiphers = [
        { id: 1, username: 'ZeroDay', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZeroDay', total_spent: 1250.00 },
        { id: 2, username: 'NetRunner', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NetRunner', total_spent: 980.50 },
        { id: 3, username: 'GhostShell', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GhostShell', total_spent: 750.00 },
        { id: 4, username: 'BitPhantom', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BitPhantom', total_spent: 450.00 },
        { id: 5, username: 'CryptoMancer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoMancer', total_spent: 320.00 },
        { id: 6, username: 'LogicBomb', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LogicBomb', total_spent: 280.00 },
        { id: 7, username: 'DataVoid', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DataVoid', total_spent: 150.00 },
      ];

      try {
        // Attempt to fetch real orders if they exist
        const { data: realOrders } = await supabase
          .from('orders')
          .select(`
            total_price,
            user_id,
            user_profiles (
              username,
              avatar_url
            )
          `);
        
        if (realOrders && realOrders.length > 0) {
          // Aggregate spent amount per user
          const aggregated = realOrders.reduce((acc: any, order: any) => {
            const userId = order.user_id;
            if (!userId || !order.user_profiles) return acc;
            
            if (!acc[userId]) {
              acc[userId] = {
                id: userId,
                username: order.user_profiles.username,
                avatar_url: order.user_profiles.avatar_url,
                total_spent: 0
              };
            }
            acc[userId].total_spent += order.total_price;
            return acc;
          }, {});

          const sorted = Object.values(aggregated).sort((a: any, b: any) => b.total_spent - a.total_spent);
          setTopCiphers(sorted.length > 0 ? sorted : mockCiphers);
        } else {
          setTopCiphers(mockCiphers);
        }
      } catch (e) {
        console.error("Error fetching leaderboard:", e);
        setTopCiphers(mockCiphers);
      }
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
            <Link to="/loja" className="hover:text-primary transition-colors cursor-pointer">Loja</Link>
            <a href="#leaderboard" className="hover:text-primary transition-colors">Elite</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Processo</a>
          </div>

          <div className="flex items-center gap-4">
             <Button variant="outline" size="sm" className="hidden sm:flex border-primary/40 hover:neon-border transition-all">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrinho (0)
             </Button>
             <UserNav />
          </div>

        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <motion.section {...fadeInUp} className="container mx-auto px-4 pt-20 pb-32 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
          
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 flex items-center justify-center group">
                 <img src={logoAsset.url} alt="Cipher Project" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(139,47,232,0.5)]" />
              </div>
              <div className="absolute -inset-4 border border-primary/10 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 chrome-text max-w-4xl mx-auto leading-tight uppercase">
            TECNOLOGIA E EXCLUSIVIDADE <br /> EM <span className="text-primary">UM SÓ LUGAR</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed uppercase tracking-wider">
            De vantagens no Discord a produtos digitais premium, com entrega automática e segurança em cada compra.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:opacity-90 px-8 py-6 text-lg font-bold h-auto min-w-[200px] shadow-[0_0_20px_rgba(139,47,232,0.4)]" onClick={() => window.location.href = '/loja'}>
              VER LOJA <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary/40 hover:neon-border px-8 py-6 text-lg font-bold h-auto min-w-[200px] glass" onClick={() => window.open('https://discord.gg/kmcX2EyFGz', '_blank')}>
              ENTRAR NO DISCORD
            </Button>
          </div>
        </motion.section>


        {/* Leaderboard Section */}
        <motion.section {...fadeInUp} id="leaderboard" className="container mx-auto px-4 py-32 border-t border-primary/10 relative">
          <div className="absolute inset-0 circuit-bg pointer-events-none opacity-5" />
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black chrome-text mb-2 italic">TOP CIPHERS</h2>
            <p className="text-primary uppercase tracking-[0.3em] text-xs">Os Maiores Contribuintes do Sindicato</p>
          </div>

          {/* Podium (Top 3) */}
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto mb-16">
            {/* Rank 2 */}
            {topCiphers[1] && (
              <motion.div variants={staggerItem} className="order-2 md:order-1 flex flex-col items-center">
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
              </motion.div>
            )}

            {/* Rank 1 */}
            {topCiphers[0] && (
              <motion.div variants={staggerItem} className="order-1 md:order-2 flex flex-col items-center">
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
              </motion.div>
            )}

            {/* Rank 3 */}
            {topCiphers[2] && (
              <motion.div variants={staggerItem} className="order-3 md:order-3 flex flex-col items-center">
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
              </motion.div>
            )}
          </motion.div>

          {/* List (Rank 4-10) */}
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="max-w-3xl mx-auto glass border-primary/10 overflow-hidden rounded-xl">
            {topCiphers.slice(3, 10).map((user) => (
              <motion.div 
                variants={staggerItem}
                key={user.id} 
                className="flex items-center justify-between p-4 border-b border-primary/5 hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 font-mono text-muted-foreground group-hover:text-primary transition-colors">
                    #{topCiphers.indexOf(user) + 1}
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
              </motion.div>
            ))}
          </motion.div>
        </motion.section>


        {/* Product Catalog */}



        {/* Why Choose Cipher Section */}
        <motion.section {...fadeInUp} className="container mx-auto px-4 py-32 relative overflow-hidden">
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

              <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="space-y-4">
                <BenefitItem 
                  icon={<Trophy className="w-5 h-5" />} 
                  title="PROGRAMA DE RECOMPENSAS" 
                  description="Suba de rank conforme compra e desbloqueie benefícios exclusivos." 
                />
                <BenefitItem 
                  icon={<Gift className="w-5 h-5" />} 
                  title="ROLETA CIPHER" 
                  description="Gire e ganhe brindes, descontos e itens exclusivos." 
                />
                <BenefitItem 
                  icon={<Shield className="w-5 h-5" />} 
                  title="PAGAMENTO AUTOMATIZADO E CRIPTOGRAFADO" 
                  description="Transações protegidas de ponta a ponta, sem intermediários." 
                />
                <BenefitItem 
                  icon={<Dices className="w-5 h-5" />} 
                  title="SORTEIOS EXCLUSIVOS MENSALMENTE" 
                  description="Participe automaticamente e concorra a prêmios todo mês." 
                />
                <BenefitItem 
                  icon={<Headset className="w-5 h-5" />} 
                  title="SUPORTE DEDICADO 24/7" 
                  description="Atendimento humano disponível a qualquer hora do dia." 
                />
              </motion.div>
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
        </motion.section>

        {/* Featured Embed Section */}
        <motion.section {...fadeInUp} className="container mx-auto px-4 py-32 border-t border-primary/10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">
              EXTENSÃO <span className="text-primary italic">EXCLUSIVA</span> CIPHER
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-muted-foreground/20" />
              <span className="text-[10px] font-mono tracking-[0.4em] text-muted-foreground uppercase">PARA LOVABLE</span>
              <div className="h-[1px] w-8 bg-muted-foreground/20" />
            </div>
          </div>

          <div className="relative group max-w-5xl mx-auto">
            {/* Main Card */}
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-black via-[#0a0514] to-black p-6 lg:p-8 shadow-[0_0_50px_-12px_rgba(139,47,232,0.15)]">
              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #8B2FE8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                
                {/* Left Column (Character Image) */}
                <div className="w-full lg:w-[35%] flex justify-center relative">
                  <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
                    {/* Subtle Purple Radial Glow */}
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] opacity-40 mix-blend-screen" />
                    
                    <img 
                      src={extensionIconAsset.url} 
                      alt="Extension Character" 
                      className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(139,47,232,0.4)] transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="w-full lg:w-[65%] flex flex-col">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <Puzzle className="w-3 h-3 text-primary" />
                      <span className="text-[9px] font-bold tracking-widest text-primary uppercase">EXTENSÃO</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <Zap className="w-3 h-3 text-green-500" />
                      <span className="text-[9px] font-bold tracking-widest text-green-500 uppercase">Entrega automática</span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter leading-tight uppercase italic">
                    HORA DE QUEBRAR AS LIMITAÇÕES
                  </h3>
                  
                  <p className="text-muted-foreground text-[11px] lg:text-xs uppercase tracking-widest leading-relaxed mb-6 max-w-xl">
                    Extensão de navegador exclusiva do Cipher Project, crie projetos no Lovable de forma ilimitada, não deixe seus projetos para depois. Escolha um de nossos planos e comece hoje mesmo!
                  </p>

                  {/* Features List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-8">
                    <div className="flex items-center gap-2.5 text-muted-foreground group/item">
                      <Infinity className="w-3.5 h-3.5 text-primary group-hover/item:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Prompts ilimitados</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground group/item">
                      <Zap className="w-3.5 h-3.5 text-primary group-hover/item:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Planos exclusivos</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground group/item">
                      <Star className="w-3.5 h-3.5 text-primary group-hover/item:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Funcionalidades exclusivas</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground group/item">
                      <RefreshCw className="w-3.5 h-3.5 text-primary group-hover/item:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Atualizações constantes</span>
                    </div>
                  </div>


                  {/* CTA */}
                  <a 
                    href="/extensao" 
                    className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-sm group/link hover:brightness-125 transition-all"
                  >
                    Ver planos e preços 
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>

              </div>
            </div>
          </div>
        </motion.section>

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
    <motion.div variants={staggerItem} className="flex gap-4 group">
      <div className="flex-shrink-0 w-10 h-10 glass border-primary/30 flex items-center justify-center text-primary group-hover:neon-border transition-all duration-300">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-foreground mb-0.5 tracking-wider uppercase text-sm">{title}</h4>
        <p className="text-muted-foreground uppercase text-[9px] tracking-widest leading-tight max-w-xs">{description}</p>
      </div>
    </motion.div>
  );
}
