import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  ChevronRight,
  Database,
  Trash2,
  AlertTriangle,
  Clipboard,
  CheckCircle2,
  History
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/estoque")({
  component: AdminInventory,
});

function AdminInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  
  // Add Stock Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [targetProductId, setTargetProductId] = useState("");
  const [bulkItems, setBulkItems] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [productsRes, stockRes] = await Promise.all([
      supabase.from("products").select("id, name, category").order("name"),
      supabase.from("stock_items")
        .select(`
          *,
          products(name)
        `)
        .order("created_at", { ascending: false })
    ]);

    if (productsRes.error) toast.error("Erro ao carregar produtos");
    else setProducts(productsRes.data || []);

    if (stockRes.error) toast.error("Erro ao carregar itens de estoque");
    else setStockItems(stockRes.data || []);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBulkAdd = async () => {
    if (!targetProductId || !bulkItems.trim()) {
      toast.error("Selecione um produto e insira os itens");
      return;
    }

    setIsSubmitting(true);
    const items = bulkItems.split('\n').filter(line => line.trim() !== '');
    
    const newItems = items.map(content => ({
      product_id: targetProductId,
      content: content.trim(),
      status: 'available'
    }));

    const { error } = await supabase.from("stock_items").insert(newItems as any);

    if (error) {
      toast.error("Erro ao adicionar itens ao estoque");
    } else {
      toast.success(`${items.length} itens adicionados com sucesso`);
      setIsAddOpen(false);
      setBulkItems("");
      fetchData();
    }
    setIsSubmitting(false);
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase.from("stock_items").delete().eq("id", id);
    if (error) toast.error("Erro ao remover item");
    else {
      toast.success("Item removido");
      fetchData();
    }
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = (item.content || "").toLowerCase().includes(search.toLowerCase());
    const matchesProduct = selectedProduct === "all" || item.product_id === selectedProduct;
    return matchesSearch && matchesProduct;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 italic">
            <span>SISTEMA CENTRAL</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">CONTROLE DE ESTOQUE DIGITAL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black chrome-text italic tracking-tighter uppercase leading-none">ESTOQUE</h1>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:opacity-90 rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest italic text-white shadow-[0_0_20px_rgba(139,47,232,0.3)]">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Itens
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-primary/20 bg-black/95 rounded-3xl max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black chrome-text italic uppercase tracking-tighter">Entrada de Estoque</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
                Adicione chaves, licenças ou credenciais em lote. Insira um item por linha.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest italic text-primary">Produto Alvo</label>
                <Select value={targetProductId} onValueChange={setTargetProductId}>
                  <SelectTrigger className="bg-white/5 border-primary/20 rounded-xl h-11 text-[10px] font-bold uppercase tracking-widest">
                    <SelectValue placeholder="SELECIONE O PRODUTO..." />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/20 bg-black/95">
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id} className="text-[10px] font-bold uppercase tracking-widest italic">{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest italic text-primary">Itens (1 por linha)</label>
                <Textarea 
                  placeholder="COLE AS LICENÇAS AQUI..."
                  className="bg-white/5 border-primary/20 rounded-2xl min-h-[200px] text-[10px] font-mono p-4"
                  value={bulkItems}
                  onChange={(e) => setBulkItems(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="ghost" 
                onClick={() => setIsAddOpen(false)}
                className="rounded-2xl border-primary/20 hover:bg-white/5 text-[9px] font-black uppercase italic tracking-widest h-11"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleBulkAdd}
                disabled={isSubmitting}
                className="rounded-2xl bg-primary hover:opacity-90 text-white text-[9px] font-black uppercase italic tracking-widest h-11 shadow-[0_0_20px_rgba(139,47,232,0.3)]"
              >
                {isSubmitting ? "Processando..." : "Confirmar Carga"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-primary/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic">Itens Disponíveis</span>
            <div className="text-2xl font-black text-white italic">{stockItems.filter(i => i.status === 'available').length}</div>
          </div>
          <Database className="w-8 h-8 text-primary opacity-20" />
        </div>
        <div className="glass p-6 rounded-3xl border border-primary/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic">Itens Vendidos</span>
            <div className="text-2xl font-black text-white italic">{stockItems.filter(i => i.status === 'sold').length}</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-500 opacity-20" />
        </div>
        <div className="glass p-6 rounded-3xl border border-primary/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest italic">Alerta de Estoque</span>
            <div className="text-2xl font-black text-white italic">0</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-500 opacity-20" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="BUSCAR CONTEÚDO DO ITEM..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-primary/20 rounded-2xl pl-12 h-12 text-[10px] font-bold tracking-widest uppercase focus:border-primary transition-all italic"
          />
        </div>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-full md:w-[300px] bg-white/5 border-primary/20 rounded-2xl h-12 text-[10px] font-bold uppercase tracking-widest italic">
            <SelectValue placeholder="FILTRAR POR PRODUTO" />
          </SelectTrigger>
          <SelectContent className="glass border-primary/20 bg-black/95">
            <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest italic">Todos os Produtos</SelectItem>
            {products.map(p => (
              <SelectItem key={p.id} value={p.id} className="text-[10px] font-bold uppercase tracking-widest italic">{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass rounded-3xl border border-primary/10 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-widest italic text-muted-foreground">Lendo registros de estoque...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Item (Mascarado)</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Produto</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Status</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Entrada</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-primary/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clipboard className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-mono text-white tracking-widest">
                          {(item.content || "").slice(0, 4)}••••••••{(item.content || "").slice(-4)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.products?.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase italic border-none ${
                        item.status === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {item.status === 'available' ? 'Disponível' : 'Vendido'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[9px] text-muted-foreground font-bold tracking-widest italic">
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-primary rounded-xl"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-red-500 rounded-xl"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                       <p className="text-[10px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-50">Nenhum item em estoque</p>
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
