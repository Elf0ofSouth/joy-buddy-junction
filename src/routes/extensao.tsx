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

function FeatureCard({ icon, title, description, offset = 0, isWide = false }: { icon: React.ReactNode, title: string, description: string, offset?: number, isWide?: boolean }) {
  return (
    <motion.div 
      variants={staggerItem}
      style={{ y: offset }}
      whileHover={{ y: offset - 5, transition: { duration: 0.3 } }}
      className={`p-6 rounded-2xl border border-primary/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group hover:border-primary/30 transition-all duration-300 ${isWide ? 'flex items-center gap-6' : 'flex flex-col'}`}
    >
      <div className={`relative w-10 h-10 rounded-full bg-black/40 border border-primary/20 flex items-center justify-center text-primary mb-4 shrink-0 shadow-[0_0_15px_rgba(139,47,232,0.1)] group-hover:shadow-[0_0_20px_rgba(139,47,232,0.3)] transition-all duration-500`}>
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
        {icon}
      </div>
      <div>
        <h4 className="font-black text-white uppercase tracking-tighter text-sm mb-2 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{description}</p>
      </div>
    </motion.div>
  );
}

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
          <motion.div {...fadeInUp} className="flex flex-col lg:flex-row gap-16 lg:items-center py-20">
            
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
          </motion.div>

          {/* SECTION 1: COMPARISON */}
          <motion.section {...fadeInUp} className="mt-32 pt-24 border-t border-primary/10 relative">
            {/* Ambient Background Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            
            <div className="text-center mb-24">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase">— O ANTES E DEPOIS —</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                O MESMO LOVABLE. <span className="text-primary italic font-light italic-text-shadow block sm:inline">SEM LIMITES.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 max-w-6xl mx-auto px-4">
              {/* Left Column - Sem a extensão */}
              <div className="flex flex-col gap-10">
                <div className="flex items-start gap-6">
                  <div className="text-red-500/60 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                    <X className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white/90 uppercase tracking-tighter">Sem a extensão</h3>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] opacity-60">Do jeito que você já conhece</p>
                  </div>
                </div>

                <div className="space-y-0">
                  {[
                    "Prompts limitados travam seu fluxo de criação",
                    "Depende da renovação mensal para continuar",
                    "Custo em dólar aumenta conforme o uso",
                    "Ideias interrompidas por falta de créditos"
                  ].map((item, i, arr) => (
                    <div key={i}>
                      <div className="flex items-center gap-4 py-6 group">
                        <X className="w-4 h-4 text-red-500/40 shrink-0" />
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider group-hover:text-muted-foreground/80 transition-colors">{item}</span>
                      </div>
                      {i < arr.length - 1 && <div className="h-[1px] w-full bg-primary/5" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Com a extensão */}
              <div className="flex flex-col gap-10">
                <div className="flex items-start gap-6">
                  <div className="text-primary drop-shadow-[0_0_15px_rgba(139,47,232,0.5)]">
                    <InfinityIcon className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Com a extensão Cipher</h3>
                    <p className="text-primary text-xs font-bold uppercase tracking-[0.2em]">A partir de agora</p>
                  </div>
                </div>

                <div className="space-y-0">
                  {[
                    "Prompts sem limite, sem contador, sem pressa",
                    "Ative uma vez e use quando quiser",
                    "Pagamento único via PIX, sem mensalidade",
                    "Do início ao fim, sem interrupções no meio do caminho"
                  ].map((item, i, arr) => (
                    <div key={i}>
                      <div className="flex items-center gap-4 py-6 group">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm font-black text-white uppercase tracking-wider group-hover:text-primary transition-colors drop-shadow-[0_0_8px_rgba(139,47,232,0.2)]">{item}</span>
                      </div>
                      {i < arr.length - 1 && <div className="h-[1px] w-full bg-primary/10" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* SECTION 2: ENTREGA INSTANTÂNEA */}
          <motion.section {...fadeInUp} className="mt-32 pt-24 relative overflow-hidden">
            {/* Ambient animated background */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-primary/3 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            </div>

            <div className="text-center mb-16 px-4">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter mb-4">
                ENTREGA <span className="text-primary italic font-light italic-text-shadow">INSTANTÂNEA</span>
              </h2>
              <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider max-w-2xl mx-auto opacity-80">
                Sem fila, sem espera no chat. Assim que o pagamento é aprovado, sua licença já está disponível na sua conta.
              </p>
            </div>

            <motion.div 
              variants={staggerContainer} 
              initial="initial" 
              whileInView="whileInView" 
              viewport={{ once: true, amount: 0.2 }} 
              className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4"
            >
              {/* Large Featured Card (Prompts Sem Limite) */}
              <motion.div 
                variants={staggerItem} 
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="md:col-span-6 lg:col-span-5 p-10 rounded-3xl border border-primary/10 bg-white/[0.03] backdrop-blur-xl relative overflow-hidden group hover:border-primary/40 transition-colors duration-500"
              >
                {/* Infinity pulse background */}
                <div className="absolute -bottom-12 -right-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  >
                    <InfinityIcon className="w-80 h-80 text-primary" />
                  </motion.div>
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="relative w-16 h-16 mb-8 group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                      <div className="relative w-full h-full rounded-full bg-black/40 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(139,47,232,0.2)]">
                        <InfinityIcon className="w-8 h-8" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 group-hover:text-primary transition-colors">PROMPTS SEM LIMITE</h3>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      Esqueça o contador de créditos. Gere, ajuste e refaça quantas vezes for preciso até o projeto ficar exatamente como você imaginou.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Smaller Cards Grid */}
              <div className="md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Card 1: Navegador */}
                <FeatureCard 
                  icon={<Globe className="w-5 h-5" />}
                  title="COMPATÍVEL COM SEU NAVEGADOR"
                  description="Funciona em Chrome, Edge, Brave e Opera, com tutorial de instalação para cada um."
                  offset={0}
                />
                
                {/* Card 2: Ativação */}
                <FeatureCard 
                  icon={<Zap className="w-5 h-5" />}
                  title="ATIVAÇÃO EM MINUTOS"
                  description="Do pagamento à liberação, tudo em poucos minutos."
                  offset={20}
                />

                {/* Card 3: Licença */}
                <FeatureCard 
                  icon={<ShieldCheck className="w-5 h-5" />}
                  title="LICENÇA EXCLUSIVA"
                  description="Chave única, gerada só para você no momento da compra."
                  offset={0}
                />

                {/* Card 4: Permanente */}
                <FeatureCard 
                  icon={<Download className="w-5 h-5" />}
                  title="ACESSO PERMANENTE"
                  description="O arquivo fica disponível na página do seu pedido para sempre, sem prazo de expiração."
                  offset={20}
                />

                {/* Card 5: Guia (Full width in its row if grid is sm:grid-cols-2) */}
                <div className="sm:col-span-2">
                  <FeatureCard 
                    icon={<FileCode className="w-5 h-5" />}
                    title="GUIA COMPLETO DE INSTALAÇÃO"
                    description="Passo a passo simples, sem necessidade de conhecimento técnico, com suporte no Discord se precisar."
                    isWide
                  />
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* SECTION 3: PRICING */}
          <PricingSection />

          {/* SECTION 4: TUDO QUE ESTÁ INCLUÍDO + REQUISITOS */}
          <motion.section {...fadeInUp} className="mt-32 pt-24 mb-12 relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            
            <motion.div 
              variants={staggerContainer} 
              initial="initial" 
              whileInView="whileInView" 
              viewport={{ once: true, amount: 0.2 }} 
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4"
            >
              {/* Left Card: Incluído */}
              <motion.div 
                variants={staggerItem}
                whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.3 } }}
                className="p-8 rounded-3xl border border-primary/10 bg-white/[0.03] backdrop-blur-xl flex flex-col gap-10 hover:border-primary/30 transition-all duration-500 group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
                    <Sparkles className="w-6 h-6 drop-shadow-[0_0_8px_rgba(139,47,232,0.4)]" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">Tudo que está incluído</h3>
                </div>

                <motion.div variants={staggerContainer} className="flex flex-col gap-6">
                  {[
                    "Créditos ilimitados para gerar projetos",
                    "Instalação simples via navegador",
                    "Tutorial de instalação passo a passo incluído",
                    "Licença entregue na hora após o pagamento",
                    "Funciona em Chrome, Edge, Brave e Opera",
                    "Suporte no Discord durante toda a vigência do plano"
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      variants={staggerItem}
                      className="flex items-start gap-4 group/item"
                    >
                      <div className="relative mt-0.5 shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(139,47,232,0.3)] group-hover/item:scale-110 transition-transform" />
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed group-hover/item:text-white transition-colors">{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Card: Requisitos */}
              <motion.div 
                variants={staggerItem}
                whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.3 } }}
                className="p-8 rounded-3xl border border-primary/10 bg-white/[0.03] backdrop-blur-xl flex flex-col gap-10 hover:border-primary/30 transition-all duration-500 group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }} />
                    <Shield className="w-6 h-6 drop-shadow-[0_0_8px_rgba(139,47,232,0.4)]" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">Requisitos</h3>
                </div>

                <motion.div variants={staggerContainer} className="flex flex-col gap-6">
                  {[
                    "Navegador baseado em Chromium (Chrome, Edge, Brave ou Opera)",
                    "Computador com Windows, macOS ou Linux",
                    "Conta ativa na plataforma Lovable"
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      variants={staggerItem}
                      className="flex items-start gap-4 group/item"
                    >
                      <div className="relative mt-0.5 shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(139,47,232,0.3)] group-hover/item:scale-110 transition-transform" />
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed group-hover/item:text-white transition-colors">{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.section>
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
  const [selectedPlan, setSelectedPlan] = useState<number>(2); // Default to 30 DIAS (id: 2)
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const plans = [
    {
      id: 1,
      duration: "7 DIAS",
      subtitle: "A partir da ativação",
      price: "R$ 12,90",
      originalPrice: "R$ 24,90",
      discount: "48% OFF",
      perDay: "R$ 1,84 / dia",
      highlight: false,
      disabled: false
    },
    {
      id: 2,
      badge: "MAIS VENDIDO",
      duration: "30 DIAS",
      subtitle: "A partir da ativação",
      price: "R$ 29,90",
      originalPrice: "R$ 69,90",
      discount: "57% OFF",
      perDay: "R$ 1,00 / dia",
      highlight: true,
      disabled: false
    },
    {
      id: 3,
      duration: "90 DIAS",
      subtitle: "A partir da ativação",
      price: "R$ 59,90",
      originalPrice: "R$ 159,90",
      discount: "62% OFF",
      perDay: "R$ 0,67 / dia",
      highlight: false,
      disabled: false
    },
    {
      id: 4,
      badge: "MELHOR CUSTO",
      duration: "1 ANO",
      subtitle: "A partir da ativação",
      price: "R$ 129,90",
      originalPrice: "R$ 349,90",
      discount: "63% OFF",
      perDay: "R$ 0,36 / dia",
      highlight: false,
      disabled: false
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];

  return (
    <section className="mt-32 pt-24 border-t border-primary/10">
      <div className="text-center mb-16">
        <span className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase mb-4 block">— ESCOLHA A DURAÇÃO —</span>
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter mb-4">
          Pague uma vez. <span className="text-primary italic font-light italic-text-shadow">Use à vontade.</span>
        </h2>
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider max-w-2xl mx-auto opacity-80">
          Quanto maior o período, menor o custo por dia. Escolha o plano que melhor atende suas necessidades.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-4">
        {plans.map((plan) => (
          <motion.button
            key={plan.id}
            disabled={plan.disabled}
            onClick={() => setSelectedPlan(plan.id)}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
            animate={{
              scale: hoveredPlan === plan.id ? 1.05 : 1,
              y: hoveredPlan === plan.id ? -10 : 0,
              opacity: hoveredPlan !== null && hoveredPlan !== plan.id ? 0.4 : 1,
              filter: hoveredPlan !== null && hoveredPlan !== plan.id ? "blur(2px)" : "blur(0px)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative p-6 rounded-2xl border text-left transition-all duration-300 group z-10
              ${plan.disabled ? 'opacity-40 grayscale cursor-not-allowed border-primary/5 bg-white/[0.02]' : 
                selectedPlan === plan.id ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(139,47,232,0.15)] ring-1 ring-primary' : 
                'border-primary/10 bg-white/5 hover:border-primary/40 hover:bg-primary/[0.02]'}
              ${hoveredPlan === plan.id ? 'shadow-[0_0_40px_rgba(139,47,232,0.25)] border-primary/60' : ''}`}
          >
            {/* Radio indicator */}
            <div className={`absolute top-6 right-6 w-5 h-5 rounded-full border flex items-center justify-center transition-colors
              ${selectedPlan === plan.id ? 'bg-primary border-primary' : 'border-primary/20 bg-black/40'}`}>
              {selectedPlan === plan.id && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>

            {/* Badge */}
            {plan.badge && (
              <div className={`mb-4 inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest
                bg-primary text-white shadow-[0_0_10px_rgba(139,47,232,0.4)]`}>
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
          </motion.button>
        ))}
      </div>

      <div className="mt-12 flex justify-center px-4">
        <Button size="lg" className="bg-primary hover:opacity-90 px-12 py-8 text-xl font-black h-auto w-full max-w-md shadow-[0_0_30px_rgba(139,47,232,0.4)] group">
          COMPRAR AGORA — {currentPlan?.price || "R$ 29,90"}
          <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}

export default ExtensionPage;
