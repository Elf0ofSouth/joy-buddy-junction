import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Search, 
  Shield, 
  Tv, 
  Puzzle, 
  Wrench, 
  Tag, 
  Filter, 
  ArrowRight,
  LayoutGrid,
  ChevronRight,
  Loader2,
  Menu,
  X,
  ShoppingCart,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logoUrl } from "@/lib/assets";
import { formatarBRL, precoComDesconto, rotuloCategoria } from "@/lib/produto";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeOut" as const }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
};

const categories = [
  { id: "all", label: "Todos os produtos", icon: <LayoutGrid className="w-4 h-4" /> },
  { id: "discord", label: "Cargos Discord", icon: <Shield className="w-4 h-4" /> },
  { id: "streaming", label: "Streaming", icon: <Tv className="w-4 h-4" /> },
  { id: "extensions", label: "Extensões", icon: <Puzzle className="w-4 h-4" /> },
  { id: "tools", label: "Ferramentas", icon: <Wrench className="w-4 h-4" /> },
  { id: "others", label: "Outros", icon: <Tag className="w-4 h-4" /> },
];

export const Route = createFileRoute("/loja")({
  component: Store,
  head: () => ({
    title: "Loja | Cipher Project",
    meta: [
      { name: "description", content: "Explore nosso catálogo completo de vantagens digitais e produtos premium." },
      { property: "og:title", content: "Loja | Cipher Project" },
      { property: "og:description", content: "Explore nosso catálogo completo de vantagens digitais e produtos premium." },
    ],
  }),
});

function Store() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      // A policy publica de SELECT nao filtra por is_available, entao o filtro
      // precisa vir na consulta -- sem isso, produto inativo apareceria na loja.
      let query = supabase.from("products").select("*").eq("is_available", true);

      if (activeCategory !== "all") {
        // `ilike` sem curinga = igualdade sem diferenciar maiuscula/minuscula.
        // Antes era `.eq(categoria.toUpperCase())`, que nunca casava com o
        // valor gravado pelo admin e deixava toda aba de categoria vazia.
        query = query.ilike("category", activeCategory);
      }

      const { data, error } = await query;

      if (error) {
        // Antes o erro era engolido e a loja mostrava "nenhum produto",
        // escondendo falha de conexao ou de permissao.
        console.error("[loja] falha ao carregar produtos", error);
        toast.error("Não foi possível carregar os produtos. Tente novamente.");
        setProducts([]);
        setLoading(false);
        return;
      }

      if (data) {
        const filtered = data.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        if (sortBy === "price_asc") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_desc") {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === "recent") {
          filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        }

        setProducts(filtered);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-black text-foreground relative flex flex-col md:flex-row font-mono selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 circuit-bg pointer-events-none z-0" />
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-primary/20 sticky top-0 h-screen z-20 p-6 overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 mb-10 group cursor-pointer">
          <img src={logoUrl} alt="Logo" className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-lg tracking-tighter chrome-text">CIPHER STORE</span>
        </Link>

        <div className="mb-4">
          <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] mb-4 block">CATEGORIAS</span>
          <nav className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all group ${
                  activeCategory === cat.id 
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(139,47,232,0.2)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <span className={`transition-colors ${activeCategory === cat.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}>
                  {cat.icon}
                </span>
                <span className="uppercase tracking-widest text-[11px] font-bold">{cat.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] mb-4 block">FILTROS RÁPIDOS</span>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 px-4 text-[10px] font-bold uppercase tracking-widest rounded-full">
              <Filter className="w-3 h-3 mr-3" />
              Mais vendidos
            </Button>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-primary/10">
           <div className="flex flex-col gap-2">
             <Button variant="outline" className="w-full border-primary/20 hover:neon-border text-[10px] font-bold uppercase tracking-widest rounded-full h-10">
               <User className="w-3 h-3 mr-2" /> Minha Conta
             </Button>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 glass border-b border-primary/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoUrl} alt="Logo" className="w-6 h-6" />
            <span className="font-bold text-sm tracking-tighter chrome-text uppercase">CIPHER STORE</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative p-2 rounded-full border border-primary/10">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[8px] flex items-center justify-center rounded-full text-white font-bold">0</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat.id 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "bg-white/5 text-muted-foreground border border-transparent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 p-6 md:p-10 w-full overflow-x-hidden">
        {/* Top Bar Desktop */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] mb-2">
              <Link to="/" className="hover:text-primary cursor-pointer transition-colors">Início</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground">Loja</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black chrome-text italic mb-2 tracking-tighter uppercase leading-none">LOJA</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium opacity-80">Explore nosso catálogo completo</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
             <div className="hidden sm:flex items-center gap-4 mr-4">
                <Button variant="outline" className="border-primary/20 hover:neon-border text-[10px] font-bold uppercase tracking-widest rounded-full relative px-6 h-12">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrinho
                  <span className="ml-2 w-5 h-5 bg-primary/20 text-primary flex items-center justify-center rounded-full text-[10px]">0</span>
                </Button>
             </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos..." 
                className="pl-12 bg-white/5 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary w-full sm:w-72 lg:w-80 h-12 rounded-full transition-all uppercase text-[10px] tracking-widest font-bold placeholder:text-muted-foreground/50"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-56 bg-white/5 border-primary/20 rounded-full h-12 text-[10px] font-bold uppercase tracking-widest">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-black border-primary/20">
                <SelectItem value="recent" className="text-[10px] font-bold uppercase tracking-widest">Mais recentes</SelectItem>
                <SelectItem value="price_asc" className="text-[10px] font-bold uppercase tracking-widest">Menor preço</SelectItem>
                <SelectItem value="price_desc" className="text-[10px] font-bold uppercase tracking-widest">Maior preço</SelectItem>
                <SelectItem value="popular" className="text-[10px] font-bold uppercase tracking-widest">Mais vendidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 px-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] border-l-2 border-primary pl-3">
            {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.3em] animate-pulse">Acessando banco de dados...</p>
          </div>
        ) : products.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  {...fadeInUp}
                  className="group"
                >
                  <div className="glass rounded-3xl overflow-hidden border-primary/10 group-hover:border-primary/40 group-hover:shadow-[0_0_40px_rgba(139,47,232,0.2)] transition-all duration-500 transform group-hover:-translate-y-3 h-full flex flex-col relative">
                    {/* Visual Decor */}
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                       <div className="w-8 h-[1px] bg-primary group-hover:w-12 transition-all" />
                    </div>

                    <div className="aspect-[4/3] relative bg-primary/5 flex items-center justify-center p-8 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      
                      {/* Category Badge */}
                      <Badge className="absolute top-4 left-4 z-20 bg-primary text-black border-none text-[8px] font-black tracking-widest px-3 py-1 rounded-full uppercase italic">
                        {rotuloCategoria(product.category)}
                      </Badge>

                      {(product.discount_percent ?? 0) > 0 && (
                        <Badge className="absolute top-4 right-4 z-20 bg-red-500 text-white border-none text-[8px] font-black tracking-widest px-3 py-1 rounded-full uppercase italic">
                          -{product.discount_percent}%
                        </Badge>
                      )}

                      {/* Imagem do produto; sem imagem, cai no icone da marca.
                          O campo `icon` guarda um NOME de icone ("Shield"), nao
                          SVG -- injeta-lo como HTML imprimia a palavra na tela
                          e ainda era uma porta de XSS. */}
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="relative z-10 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                          <Shield className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(139,47,232,0.6)]" />
                        </div>
                      )}
                      
                      {/* Ambient Glow */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 rounded-full blur-[50px] group-hover:bg-primary/30 transition-all duration-500" />
                      
                      {/* Grid Lines Pattern */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#8B2FE8 1px, transparent 1px), linear-gradient(90deg, #8B2FE8 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    </div>

                    <div className="p-6 flex-1 flex flex-col relative">
                      <div className="mb-4">
                         <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter group-hover:text-primary transition-colors italic leading-none">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 uppercase tracking-widest leading-relaxed font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                          {product.description || "Otimize sua experiência com tecnologia Cipher."}
                        </p>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-primary/10">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em] italic mb-1">Preço // CIPHER</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-white italic tracking-tighter group-hover:chrome-text transition-all">
                              {formatarBRL(precoComDesconto(product.price, product.discount_percent ?? 0))}
                            </span>
                            {(product.discount_percent ?? 0) > 0 && (
                              <span className="text-[10px] font-bold text-muted-foreground line-through italic">
                                {formatarBRL(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button className="bg-primary hover:opacity-90 shadow-[0_0_20px_rgba(139,47,232,0.4)] rounded-2xl px-5 h-12 group-hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest italic border-none text-white">
                          DETALHES <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-40 gap-8 text-center"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center border border-primary/20 relative z-10">
                <Search className="w-10 h-10 text-primary/40" />
              </div>
              <div className="absolute inset-0 bg-primary/10 blur-3xl animate-pulse rounded-full" />
            </div>
            <div>
              <h3 className="text-2xl font-black chrome-text mb-4 uppercase italic tracking-tighter">SISTEMA: SEM RESULTADOS</h3>
              <p className="text-muted-foreground max-w-sm uppercase text-[10px] tracking-[0.3em] font-bold leading-relaxed">Nenhum produto atende aos critérios atuais. Expanda sua busca ou verifique novas atualizações em breve.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {setActiveCategory("all"); setSearchQuery("");}}
              className="border-primary/40 hover:neon-border rounded-full uppercase text-[10px] tracking-[0.3em] font-black px-10 h-14 italic transition-all glass"
            >
              REINICIAR FILTROS
            </Button>
          </motion.div>
        )}
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-[320px] glass z-[70] p-8 md:hidden flex flex-col border-r border-primary/30 shadow-[10px_0_50px_rgba(139,47,232,0.2)]"
            >
               <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <img src={logoUrl} alt="Logo" className="w-10 h-10" />
                  <span className="font-bold text-xl tracking-tighter chrome-text uppercase italic">CIPHER STORE</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} className="rounded-full border border-primary/10">
                  <X className="w-6 h-6 text-primary" />
                </Button>
              </div>
              
              <div className="mb-8">
                <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mb-6 block italic">CATEGORIAS</span>
                <nav className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {setActiveCategory(cat.id); setMobileMenuOpen(false);}}
                      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all italic ${
                        activeCategory === cat.id 
                          ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_rgba(139,47,232,0.15)]" 
                          : "text-muted-foreground border border-white/5 bg-white/5"
                      }`}
                    >
                      <span className={`transition-colors ${activeCategory === cat.id ? "text-primary" : "text-muted-foreground"}`}>
                        {cat.icon}
                      </span>
                      {cat.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-auto space-y-4">
                 <Button variant="outline" className="w-full border-primary/20 hover:neon-border text-[10px] font-black uppercase tracking-widest rounded-2xl h-14 italic glass">
                   <User className="w-4 h-4 mr-3" /> Minha Conta
                 </Button>
                 <p className="text-[8px] text-center text-muted-foreground uppercase tracking-[0.4em] font-bold py-4">© 2026 CIPHER PROJECT SYSTEMS</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
