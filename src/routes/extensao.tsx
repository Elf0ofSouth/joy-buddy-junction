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

          {/* SECTION 1: COMPARISON */}
          <section className="mt-32 pt-24 border-t border-primary/10">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-[1px] w-8 bg-primary/30" />
                <span className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase">— A DIFERENÇA —</span>
                <div className="h-[1px] w-8 bg-primary/30" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                O mesmo Lovable. <span className="text-primary italic font-light italic-text-shadow">Sem o freio.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Left Card - Sem a extensão */}
              <div className="p-8 rounded-2xl border border-primary/10 bg-white/5 glass flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                    <X className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider">Sem a extensão</h3>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Como é hoje</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    "Trava no limite de prompts do plano gratuito",
                    "Espera o ciclo renovar para continuar",
                    "Mensalidade em dólar para liberar mais créditos",
                    "Projeto parado no meio do desenvolvimento"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <X className="w-4 h-4 text-red-500/50 mt-0.5" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Card - Com a extensão */}
              <div className="p-8 rounded-2xl border border-primary/40 bg-primary/5 glass shadow-[0_0_40px_rgba(139,47,232,0.1)] flex flex-col gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
                
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/20 text-primary shadow-[0_0_20px_rgba(139,47,232,0.4)]">
                    <InfinityIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider">Com a extensão</h3>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-widest">A partir de hoje</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    "Prompts ilimitados, sem contador para acompanhar",
                    "Continua construindo na hora, sem esperar nada",
                    "Pagamento único em real, via PIX",
                    "Projeto entregue no seu ritmo, do início ao fim"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                      <span className="text-xs font-bold text-white uppercase tracking-wide">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: TUDO CHEGA NA HORA */}
          <section className="mt-32 pt-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter mb-4">
                Tudo chega <span className="text-primary italic font-light italic-text-shadow">na hora</span>
              </h2>
              <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider max-w-2xl mx-auto opacity-80">
                Sem espera e sem conversa no chat. Assim que o pagamento é confirmado, tudo aparece na página do seu pedido.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-6xl mx-auto">
              {/* Large Featured Card (Left) */}
              <div className="md:col-span-5 p-8 rounded-2xl border border-primary/10 bg-white/5 glass relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                  <InfinityIcon className="w-64 h-64 text-primary" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8">
                    <InfinityIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Prompts ilimitados</h3>
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest leading-relaxed">
                    O contador de créditos deixa de existir. Você gera, refaz e itera quantas vezes precisar até o projeto ficar do jeito certo.
                  </p>
                </div>
              </div>

              {/* Right Column Grid */}
              <div className="md:col-span-7 flex flex-col gap-4">
                {/* Top Full Width */}
                <div className="p-6 rounded-2xl border border-primary/10 bg-white/5 glass flex items-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Funciona no seu navegador</h4>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Chrome, Edge, Brave e Opera. O tutorial cobre a instalação em cada um.</p>
                  </div>
                </div>

                {/* Bottom Row Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl border border-primary/10 bg-white/5 glass flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider text-sm flex items-baseline gap-1">
                        &lt;5<span className="text-[10px]">min</span>
                      </h4>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Do PIX ao uso.</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl border border-primary/10 bg-white/5 glass flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider text-sm">Licença só sua</h4>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Chave exclusiva, reservada na compra.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row Side-by-Side (Full Row below) */}
              <div className="md:col-span-6 p-6 rounded-2xl border border-primary/10 bg-white/5 glass flex items-center gap-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm">Download liberado na hora</h4>
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">O arquivo da extensão fica salvo na página do pedido, com acesso permanente.</p>
                </div>
              </div>
              <div className="md:col-span-6 p-6 rounded-2xl border border-primary/10 bg-white/5 glass flex items-center gap-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm">Tutorial passo a passo</h4>
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Do zero até funcionando, sem precisar de conhecimento técnico. Com suporte no Discord se travar.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: PRICING */}
          <PricingSection />

          {/* SECTION 4: TUDO QUE ESTÁ INCLUÍDO + REQUISITOS */}
          <section className="mt-32 pt-24 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Left Card: Incluído */}
              <div className="p-8 rounded-2xl border border-primary/10 bg-white/5 glass flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Tudo que está incluído</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Créditos ilimitados para gerar projetos",
                    "Instalação simples via navegador",
                    "Tutorial de instalação passo a passo incluído",
                    "Licença entregue na hora após o pagamento",
                    "Funciona em Chrome, Edge, Brave e Opera",
                    "Suporte no Discord durante toda a vigência do plano"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Card: Requisitos */}
              <div className="p-8 rounded-2xl border border-primary/10 bg-white/5 glass flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Requisitos</h3>
                </div>

                <div className="space-y-4">
                  {[
                    "Navegador baseado em Chromium (Chrome, Edge, Brave ou Opera)",
                    "Computador com Windows, macOS ou Linux",
                    "Conta ativa na plataforma Lovable"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
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

function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<number>(2); // 0-indexed, 3rd plan (30 DIAS) is default

  const plans = [
    {
      id: 0,
      badge: "TESTE",
      duration: "1 DIA",
      subtitle: "A partir da ativação",
      price: "R$ 5,00",
      highlight: false,
      disabled: false
    },
    {
      id: 1,
      badge: "ESGOTADO",
      duration: "7 DIAS",
      subtitle: "A partir da ativação",
      price: "R$ 10,90",
      originalPrice: "R$ 24,90",
      discount: "56% OFF",
      perDay: "R$ 1,56 / dia",
      highlight: false,
      disabled: true
    },
    {
      id: 2,
      badge: "MAIS VENDIDO",
      duration: "30 DIAS",
      subtitle: "A partir da ativação",
      price: "R$ 22,00",
      originalPrice: "R$ 59,90",
      discount: "63% OFF",
      perDay: "R$ 0,73 / dia",
      highlight: true,
      disabled: false
    },
    {
      id: 3,
      duration: "90 DIAS",
      subtitle: "A partir da ativação",
      price: "R$ 45,00",
      originalPrice: "R$ 149,90",
      discount: "70% OFF",
      perDay: "R$ 0,50 / dia",
      highlight: false,
      disabled: false
    },
    {
      id: 4,
      duration: "1 ANO",
      subtitle: "A partir da ativação",
      price: "R$ 100,00",
      originalPrice: "R$ 259,90",
      discount: "62% OFF",
      perDay: "R$ 0,27 / dia",
      highlight: false,
      disabled: false
    },
    {
      id: 5,
      badge: "MELHOR CUSTO",
      duration: "VITALÍCIO",
      subtitle: "Sem data de expiração",
      price: "R$ 149,00",
      originalPrice: "R$ 349,90",
      discount: "57% OFF",
      highlight: false,
      disabled: false
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[2];

  return (
    <section className="mt-32 pt-24 border-t border-primary/10">
      <div className="text-center mb-16">
        <span className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase mb-4 block">— ESCOLHA A DURAÇÃO —</span>
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter mb-4">
          Pague uma vez. <span className="text-primary italic font-light italic-text-shadow">Use à vontade.</span>
        </h2>
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider max-w-2xl mx-auto opacity-80">
          Quanto maior o período, menor o custo por dia. Comece com 1 dia para testar ou garanta o vitalício e nunca mais pense nisso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto px-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            disabled={plan.disabled}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative p-6 rounded-2xl border text-left transition-all duration-300 group
              ${plan.disabled ? 'opacity-40 grayscale cursor-not-allowed border-primary/5 bg-white/[0.02]' : 
                selectedPlan === plan.id ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(139,47,232,0.15)] ring-1 ring-primary' : 
                'border-primary/10 bg-white/5 hover:border-primary/40 hover:bg-primary/[0.02]'}`}
          >
            {/* Radio indicator */}
            <div className={`absolute top-6 right-6 w-5 h-5 rounded-full border flex items-center justify-center transition-colors
              ${selectedPlan === plan.id ? 'bg-primary border-primary' : 'border-primary/20 bg-black/40'}`}>
              {selectedPlan === plan.id && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>

            {/* Badge */}
            {plan.badge && (
              <div className={`mb-4 inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest
                ${plan.badge === 'ESGOTADO' ? 'bg-muted text-muted-foreground' : 'bg-primary text-white shadow-[0_0_10px_rgba(139,47,232,0.4)]'}`}>
                {plan.badge}
              </div>
            )}

            <div className="space-y-1 mb-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{plan.duration}</h3>
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{plan.subtitle}</p>
            </div>

            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-black text-white">{plan.price}</span>
                {plan.originalPrice && (
                  <span className="text-muted-foreground text-xs line-through">{plan.originalPrice}</span>
                )}
                {plan.discount && (
                  <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                    {plan.discount}
                  </span>
                )}
              </div>
              {plan.perDay && (
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{plan.perDay}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 flex justify-center px-4">
        <Button size="lg" className="bg-primary hover:opacity-90 px-12 py-8 text-xl font-black h-auto w-full max-w-md shadow-[0_0_30px_rgba(139,47,232,0.4)] group">
          COMPRAR AGORA — {currentPlan?.price || "R$ 22,00"}
          <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}

export default ExtensionPage;
