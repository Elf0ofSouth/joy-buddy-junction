import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Puzzle, 
  Zap, 
  Lock, 
  Globe, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Send,
  Loader2,
  Infinity as InfinityIcon,
  ChevronLeft,
  X,
  Clock,
  ShieldCheck,
  Download,
  FileCode,
  Sparkles,
  Shield,
  Dices,
  Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logoAsset from "@/assets/cipher-logo.png.asset.json";

export const Route = createFileRoute("/extensao")({
  component: ExtensionPage,
  head: () => ({
    title: "Extensão Exclusiva | Cipher Project",
    meta: [
      { name: "description", content: "Prompts ilimitados no Lovable com a Extensão Exclusiva Cipher. Sem limites, apenas criação." },
    ],
  }),
});

type AnimationState = "limited" | "activating" | "unlocked";

function ExtensionPage() {
  const [animState, setAnimState] = useState<AnimationState>("limited");

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setAnimState("limited");
        await new Promise(r => setTimeout(r, 2500));
        
        setAnimState("activating");
        await new Promise(r => setTimeout(r, 2500));
        
        setAnimState("unlocked");
        await new Promise(r => setTimeout(r, 3500));
      }
    };
    sequence();
  }, []);

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden font-sans">
      {/* Decorative Background */}
      <div className="fixed inset-0 circuit-bg pointer-events-none z-0 opacity-20" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-primary/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <ChevronLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
            <img src={logoAsset.url} alt="Cipher Project" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tighter chrome-text hidden sm:block">CIPHER PROJECT</span>
          </Link>
          
          <div className="flex items-center gap-4">
             <Button size="sm" className="bg-primary hover:opacity-90 transition-all font-bold">
               ENTRAR
             </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-12 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
            
            {/* Left Column */}
            <div className="flex-1 space-y-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest text-primary uppercase">EXTENSÃO DE NAVEGADOR</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                  <span className="text-[10px] font-bold tracking-widest text-green-500 uppercase">ATÉ 70% OFF</span>
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                  PROMPTS <br />
                  <span className="text-primary italic font-light italic-text-shadow">ilimitados</span> <br />
                  NO LOVABLE
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl font-medium tracking-wide uppercase opacity-80 pt-4">
                  Prompts ilimitados no Lovable, sem travar no limite do plano.
                </p>
              </div>

              {/* CTA Section */}
              <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Button size="lg" className="bg-primary hover:opacity-90 px-10 py-8 text-xl font-black h-auto w-full sm:w-auto shadow-[0_0_30px_rgba(139,47,232,0.4)] group">
                    COMEÇAR POR R$ 5,00 
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4 text-primary" />
                      ⚡ Entrega automática em segundos
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                      <Lock className="w-4 h-4 text-primary" />
                      🔒 PIX ou saldo da carteira
                    </div>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-primary/10" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
                    <Globe className="w-4 h-4 text-primary/60" />
                    Chrome · Edge · Brave · Opera
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
                    <CheckCircle2 className="w-4 h-4 text-primary/60" />
                    Licença exclusiva por compra
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
                    <FileText className="w-4 h-4 text-primary/60" />
                    Tutorial de instalação incluído
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Window */}
            <div className="flex-1 relative flex justify-center items-center">
              {/* Ambient Glow */}
              <motion.div 
                animate={{ 
                  scale: animState === "unlocked" ? 1.2 : 1,
                  opacity: animState === "unlocked" ? 0.6 : 0.3
                }}
                className="absolute w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"
              />
              
              <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl border border-primary/20 bg-[#0a0514] overflow-hidden shadow-2xl flex flex-col">
                {/* Browser Top Bar */}
                <div className="h-10 bg-black/40 border-b border-primary/10 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-black/40 border border-primary/10 rounded-md px-4 py-0.5 text-[9px] font-mono text-muted-foreground tracking-widest">
                      lovable.dev
                    </div>
                  </div>
                  <div className="w-12" />
                </div>

                {/* Window Content */}
                <div className="flex-1 p-6 flex flex-col gap-6 relative">
                  {/* Cipher Badge */}
                  <AnimatePresence>
                    {(animState === "activating" || animState === "unlocked") && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="absolute top-4 right-4 z-20"
                      >
                        <div className="bg-primary text-white font-black text-[10px] px-2 py-0.5 rounded shadow-[0_0_15px_rgba(139,47,232,0.8)] flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-white" />
                          CP
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">CRÉDITOS</span>
                    <motion.div className="font-mono text-sm font-bold flex items-center gap-1">
                      {animState === "limited" && <span className="text-[#ff5f56]">0 / 5</span>}
                      {animState === "activating" && <span className="text-primary">0 / 5</span>}
                      {animState === "unlocked" && (
                        <motion.span 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="text-primary flex items-center gap-1"
                        >
                          <InfinityIcon className="w-4 h-4" /> ilimitado
                        </motion.span>
                      )}
                    </motion.div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="h-3 w-full bg-black/40 rounded-full border border-primary/10 overflow-hidden relative">
                    <motion.div 
                      initial={{ width: "5%" }}
                      animate={{ 
                        width: animState === "limited" ? "5%" : "100%",
                        backgroundColor: animState === "limited" ? "#ff5f56" : "#8B2FE8",
                      }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="h-full relative"
                    >
                      {animState === "activating" && (
                        <motion.div 
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />
                      )}
                      {animState === "unlocked" && (
                        <div className="absolute inset-0 shadow-[0_0_20px_rgba(139,47,232,0.8)]" />
                      )}
                    </motion.div>
                  </div>

                  {/* Status Message */}
                  <div className="h-8 flex items-center">
                    <AnimatePresence mode="wait">
                      {animState === "limited" && (
                        <motion.p 
                          key="limited"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[#ff5f56] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                          ⚠ Limite diário atingido. Volte amanhã.
                        </motion.p>
                      )}
                      {animState === "activating" && (
                        <motion.p 
                          key="activating"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                          <Loader2 className="w-3 h-3 animate-spin" />
                          ✨ Ativando licença Cipher...
                        </motion.p>
                      )}
                      {animState === "unlocked" && (
                        <motion.p 
                          key="unlocked"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                          ✓ Créditos infinitos liberados nesta conta.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Mock Input */}
                  <div className="space-y-4">
                    <div className="bg-black/40 border border-primary/10 rounded-xl p-3 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-4 bg-primary animate-pulse" />
                        <TypingPlaceholder isActive={animState === "unlocked"} />
                      </div>
                      <Send className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Chips */}
                    <motion.div 
                      animate={{ opacity: animState === "unlocked" ? 1 : 0.3 }}
                      className="flex gap-2"
                    >
                      {[1, 2, 3].map((i) => (
                        <motion.div 
                          key={i}
                          animate={animState === "unlocked" ? {
                            boxShadow: ["0 0 0px rgba(139,47,232,0)", "0 0 10px rgba(139,47,232,0.2)", "0 0 0px rgba(139,47,232,0)"]
                          } : {}}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                          className="flex-1 h-6 bg-black/20 border border-primary/5 rounded-md" 
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <section className="mt-32 pt-24 border-t border-primary/10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black chrome-text mb-4 uppercase italic tracking-tighter">PLANOS E PREÇOS</h2>
              <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase">ESCOLHA SEU NÍVEL DE ACESSO</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PricingCard 
                title="BASIC" 
                price="R$ 5,00" 
                period="/mês" 
                features={["7 dias de acesso", "Créditos ilimitados", "Suporte padrão"]} 
              />
              <PricingCard 
                title="PREMIUM" 
                price="R$ 15,00" 
                period="/mês" 
                popular
                features={["30 dias de acesso", "Créditos ilimitados", "Suporte prioritário", "Badge no Discord"]} 
              />
              <PricingCard 
                title="LIFETIME" 
                price="R$ 49,90" 
                period="" 
                features={["Acesso vitalício", "Créditos ilimitados", "Suporte VIP", "Badge personalizada"]} 
              />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-black py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <img src={logoAsset.url} alt="Cipher Project" className="w-5 h-5 object-contain" />
            <span className="font-bold text-sm chrome-text uppercase tracking-widest">CIPHER PROJECT</span>
          </div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-[0.4em] opacity-40">
            &copy; 2026 CIPHER PROJECT // AMBIENTE PROTEGIDO
          </div>
        </div>
      </footer>

      <style>{`
        .italic-text-shadow {
          text-shadow: 0 0 20px rgba(139, 47, 232, 0.4);
        }
        .circuit-bg {
          background-image: radial-gradient(circle, #8B2FE8 0.5px, transparent 0.5px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}

function TypingPlaceholder({ isActive }: { isActive: boolean }) {
  const [text, setText] = useState("");
  const fullText = "crie um dashboard de vendas com gráficos";
  
  useEffect(() => {
    if (!isActive) {
      setText("");
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <span className="text-xs font-medium text-muted-foreground">
      {isActive ? (
        text || "Peça qualquer coisa..."
      ) : (
        "Peça qualquer coisa..."
      )}
      {isActive && text.length < fullText.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}

function PricingCard({ title, price, period, features, popular = false }: { 
  title: string; 
  price: string; 
  period: string; 
  features: string[];
  popular?: boolean;
}) {
  return (
    <div className={`relative p-8 rounded-2xl border ${popular ? 'border-primary shadow-[0_0_30px_rgba(139,47,232,0.2)]' : 'border-primary/20'} bg-black/40 glass group hover:neon-border transition-all duration-500 flex flex-col`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
          MAIS POPULAR
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2 chrome-text tracking-widest uppercase">{title}</h3>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-black text-white">{price}</span>
        <span className="text-muted-foreground text-xs uppercase font-bold">{period}</span>
      </div>

      <div className="space-y-4 mb-10 flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            {f}
          </div>
        ))}
      </div>

      <Button className={`w-full py-6 font-black uppercase tracking-widest ${popular ? 'bg-primary hover:opacity-90' : 'bg-transparent border border-primary/40 hover:bg-primary/10'}`}>
        SELECIONAR
      </Button>
    </div>
  );
}

export default ExtensionPage;
