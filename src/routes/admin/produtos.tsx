import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProducts,
});

function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (categoryFilter !== "all") {
      query = query.eq("category", categoryFilter);
    }

    const { data, error } = await query;
    if (error) {
      toast.error("Erro ao carregar produtos");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast.error("Erro ao excluir produto");
    } else {
      toast.success("Produto removido com sucesso");
      fetchProducts();
    }
    setDeleteId(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 italic">
            <span>SISTEMA CENTRAL</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">GERENCIAMENTO DE PRODUTOS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black chrome-text italic tracking-tighter uppercase leading-none">PRODUTOS</h1>
        </div>

        <Button className="bg-primary hover:opacity-90 rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest italic text-white shadow-[0_0_20px_rgba(139,47,232,0.3)]">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Produto
        </Button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="BUSCAR PRODUTO..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-primary/20 rounded-2xl pl-12 h-12 text-[10px] font-bold tracking-widest uppercase focus:border-primary transition-all italic"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          <Button 
            variant={categoryFilter === "all" ? "default" : "outline"}
            onClick={() => setCategoryFilter("all")}
            className={`rounded-2xl h-12 px-6 text-[9px] font-black uppercase tracking-widest italic ${
              categoryFilter === "all" ? "bg-primary" : "border-primary/20 glass"
            }`}
          >
            Todos
          </Button>
          {categories.map(cat => (
            <Button 
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-2xl h-12 px-6 text-[9px] font-black uppercase tracking-widest italic whitespace-nowrap ${
                categoryFilter === cat ? "bg-primary" : "border-primary/20 glass"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-3xl border border-primary/10 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-widest italic text-muted-foreground">Carregando catálogo...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Info</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Categoria</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Preço (BRL)</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Estoque</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Status</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b border-primary/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl border border-primary/20 overflow-hidden flex-shrink-0 bg-black/40">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/40">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white uppercase tracking-wider">{p.name}</span>
                          <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mt-1 line-clamp-1 italic max-w-[200px]">
                            {p.description || "Sem descrição"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase italic border-primary/20 text-muted-foreground">
                        {p.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-primary italic">R$ {(p.price_brl || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase italic">
                        {p.stock_quantity === null ? 'Ilimitado' : p.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase italic border-none ${
                        p.is_available ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {p.is_available ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass border-primary/20 bg-black/90" align="end">
                          <DropdownMenuItem className="focus:bg-primary/10 cursor-pointer text-[9px] font-black uppercase tracking-widest italic p-3 gap-3">
                            <Edit className="w-4 h-4 text-primary" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-primary/10 cursor-pointer text-[9px] font-black uppercase tracking-widest italic p-3 gap-3">
                            <ExternalLink className="w-4 h-4 text-primary" />
                            Ver na Loja
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-red-500/10 text-red-500 cursor-pointer text-[9px] font-black uppercase tracking-widest italic p-3 gap-3"
                            onClick={() => setDeleteId(p.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                       <p className="text-[10px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-50">Nenhum produto encontrado</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass border-primary/20 bg-black/95 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black chrome-text italic uppercase tracking-tighter">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
              Esta ação não pode ser desfeita. O produto será removido permanentemente do banco de dados e da loja.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-2xl border-primary/20 hover:bg-white/5 text-[9px] font-black uppercase italic tracking-widest h-11">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-2xl bg-red-500 hover:bg-red-600 text-white text-[9px] font-black uppercase italic tracking-widest h-11 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              Excluir Permanente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
