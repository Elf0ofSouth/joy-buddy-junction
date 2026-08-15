import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Download,
  Calendar,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/pedidos")({
  component: AdminOrders,
});

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase
      .from("orders")
      .select(`
        *,
        user_profiles(username, avatar_url, discord_id),
        products(name, price_brl)
      `)
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      toast.error("Erro ao carregar pedidos");
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      toast.success("Status do pedido atualizado");
      fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.user_profiles?.username || "").toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["ID", "Cliente", "Produto", "Valor", "Status", "Data"];
    const rows = filteredOrders.map(o => [
      o.id,
      o.user_profiles?.username || "N/A",
      o.products?.name || "N/A",
      o.total_price.toFixed(2),
      o.status,
      new Date(o.created_at).toLocaleDateString('pt-BR')
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pedidos_cipher_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 italic">
            <span>SISTEMA CENTRAL</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">REGISTRO DE TRANSAÇÕES</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black chrome-text italic tracking-tighter uppercase leading-none">PEDIDOS</h1>
        </div>

        <Button 
          onClick={exportCSV}
          variant="outline" 
          className="border-primary/20 hover:neon-border rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest italic glass"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="BUSCAR POR CLIENTE OU ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-primary/20 rounded-2xl pl-12 h-12 text-[10px] font-bold tracking-widest uppercase focus:border-primary transition-all italic"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'completed', 'cancelled'].map(status => (
            <Button 
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl h-12 px-6 text-[9px] font-black uppercase tracking-widest italic ${
                statusFilter === status ? "bg-primary" : "border-primary/20 glass"
              }`}
            >
              {status === 'all' ? 'Todos' : 
               status === 'pending' ? 'Pendentes' : 
               status === 'completed' ? 'Pagos' : 'Cancelados'}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-3xl border border-primary/10 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-widest italic text-muted-foreground">Recuperando histórico...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">ID</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Cliente</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Produto</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Valor</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Status</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Data</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="border-b border-primary/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-mono text-muted-foreground group-hover:text-primary transition-colors">#{o.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-7 h-7 border border-primary/20">
                          <AvatarImage src={o.user_profiles?.avatar_url} />
                          <AvatarFallback className="text-[8px] font-bold">{o.user_profiles?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] font-black text-white uppercase tracking-wider">{o.user_profiles?.username || "Visitante"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">{o.products?.name || "Item Digital"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-primary italic">R$ {o.total_price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase italic border-none ${
                        o.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                        o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {o.status === 'completed' ? 'Pago' : o.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[9px] text-muted-foreground font-bold tracking-widest italic">
                      {new Date(o.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-primary rounded-full"
                        onClick={() => setSelectedOrder(o)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="p-20 text-center">
                       <p className="text-[10px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-50">Nenhum pedido encontrado</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="glass border-primary/20 bg-black/95 rounded-3xl max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-black tracking-widest px-3 py-1 rounded-full uppercase italic">
                    Pedido #{selectedOrder.id.slice(0, 8)}
                  </Badge>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic">
                    {new Date(selectedOrder.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-black chrome-text italic uppercase tracking-tighter">Detalhes do Pedido</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-8 py-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest italic text-primary">Informações do Cliente</span>
                    <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-primary/5 rounded-2xl">
                      <Avatar className="w-10 h-10 border border-primary/20">
                        <AvatarImage src={selectedOrder.user_profiles?.avatar_url} />
                        <AvatarFallback className="text-[10px] font-bold italic">CI</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-white uppercase italic">{selectedOrder.user_profiles?.username}</span>
                        <span className="text-[8px] font-mono text-muted-foreground">{selectedOrder.user_profiles?.discord_id || "Visitante"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest italic text-primary">Status da Transação</span>
                    <div className="flex flex-wrap gap-2">
                       <Button 
                        variant={selectedOrder.status === 'completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                        className="rounded-xl h-9 text-[8px] font-black uppercase tracking-widest italic"
                       >
                         <CheckCircle className="w-3 h-3 mr-1" /> Marcar Pago
                       </Button>
                       <Button 
                        variant={selectedOrder.status === 'cancelled' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                        className="rounded-xl h-9 text-[8px] font-black uppercase tracking-widest italic hover:bg-red-500/10 hover:text-red-500"
                       >
                         <XCircle className="w-3 h-3 mr-1" /> Cancelar
                       </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest italic text-primary">Resumo da Compra</span>
                    <div className="p-4 bg-white/[0.02] border border-primary/5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase italic">{selectedOrder.products?.name}</span>
                        <span className="text-[10px] font-black text-white italic">R$ {selectedOrder.total_price.toFixed(2)}</span>
                      </div>
                      <div className="h-[1px] bg-primary/10" />
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black text-primary uppercase italic">Total</span>
                        <span className="text-[11px] font-black text-primary italic">R$ {selectedOrder.total_price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest italic text-primary">Timeline</span>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#8B2FE8]" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase italic">Pedido Criado: {new Date(selectedOrder.created_at).toLocaleTimeString('pt-BR')}</span>
                      </div>
                      {selectedOrder.status === 'completed' && (
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22C55E]" />
                          <span className="text-[9px] font-bold text-green-500 uppercase italic">Confirmado em: {new Date(selectedOrder.updated_at || selectedOrder.created_at).toLocaleTimeString('pt-BR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
