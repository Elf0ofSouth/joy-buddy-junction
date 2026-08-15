import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  ShoppingCart, 
  Search, 
  ChevronRight,
  User,
  Package,
  Clock,
  Trash2,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/carrinhos-abandonados")({
  component: AdminAbandonedCarts,
});

function AdminAbandonedCarts() {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCarts = async () => {
    setLoading(true);
    // Note: We use the abandoned_carts table created in the migration
    const { data, error } = await supabase
      .from("abandoned_carts")
      .select(`
        *,
        user_profiles(username, avatar_url, discord_id),
        products(name, price_brl)
      `)
      .order("created_at", { ascending: false });

    if (error) toast.error("Erro ao carregar carrinhos");
    else setCarts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("abandoned_carts").delete().eq("id", id);
    if (error) toast.error("Erro ao remover registro");
    else {
      toast.success("Registro removido");
      fetchCarts();
    }
  };

  const filteredCarts = carts.filter(c => 
    (c.user_profiles?.username || "Visitante").toLowerCase().includes(search.toLowerCase()) ||
    (c.products?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 italic">
            <span>SISTEMA CENTRAL</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">ANÁLISE DE CONVERSÃO</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black chrome-text italic tracking-tighter uppercase leading-none">CARRINHOS</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="BUSCAR POR CLIENTE OU PRODUTO..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border-primary/20 rounded-2xl pl-12 h-12 text-[10px] font-bold tracking-widest uppercase focus:border-primary transition-all italic"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-3xl border border-primary/10 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-widest italic text-muted-foreground">Rastreando sessões perdidas...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Cliente</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Produto</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Valor</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Data do Abandono</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCarts.map((c) => (
                  <tr key={c.id} className="border-b border-primary/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-7 h-7 border border-primary/20">
                          <AvatarImage src={c.user_profiles?.avatar_url} />
                          <AvatarFallback className="text-[8px] font-bold italic">V</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white uppercase tracking-wider">{c.user_profiles?.username || "Visitante"}</span>
                          {c.user_profiles?.discord_id && (
                            <span className="text-[8px] font-mono text-muted-foreground uppercase">{c.user_profiles.discord_id}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-3 h-3 text-primary/60" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">{c.products?.name || "Desconhecido"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-primary italic">R$ {(c.products?.price_brl || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-[9px] text-white font-bold tracking-widest italic">
                          <Clock className="w-3 h-3 text-primary" />
                          {new Date(c.created_at).toLocaleDateString('pt-BR')}
                        </div>
                        <span className="text-[8px] text-muted-foreground uppercase font-bold ml-5">
                          {new Date(c.created_at).toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-primary rounded-xl"
                          title="Tentar Contato"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-red-500 rounded-xl"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCarts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                       <p className="text-[10px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-50">Nenhum carrinho abandonado recentemente</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
