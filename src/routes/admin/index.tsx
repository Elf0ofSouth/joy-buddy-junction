import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Package, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Calendar,
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { buscarPedidos, type PedidoEnriquecido } from "@/lib/pedidos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

type PedidoResumo = {
  amount: number | null;
  status: string | null;
  created_at: string | null;
  products: { name: string | null } | null;
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

/**
 * `delta` e a variacao real em relacao a ontem. Quando nao existe comparacao
 * que faca sentido (produtos ativos, pedidos pendentes) passamos `undefined` e
 * o rodape do card simplesmente nao aparece -- antes havia numeros fixos
 * escritos no codigo ("+12.5%", "+3") que nao vinham do banco.
 */
function StatCard({ label, value, icon, delta, deltaSufixo = "" }: any) {
  const temDelta = typeof delta === "number" && Number.isFinite(delta);
  const subiu = temDelta && delta >= 0;
  return (
    <motion.div 
      variants={fadeInUp}
      className="glass p-6 rounded-3xl border border-primary/10 relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
    >
      <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity`}>
        {icon}
      </div>
      
      <div className="flex flex-col gap-1 mb-4">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">{label}</span>
        <div className="flex items-baseline gap-2">
           <span className="text-3xl font-black text-white italic tracking-tighter chrome-text">{value}</span>
        </div>
      </div>

      {temDelta && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-[10px] font-black italic px-2 py-0.5 rounded-full ${
            subiu ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          }`}>
            {subiu ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {subiu ? "+" : ""}{deltaSufixo === "%" ? delta.toFixed(1) : delta}{deltaSufixo}
          </div>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">vs ontem</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary/40 transition-all" />
    </motion.div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState({
    totalSales: "R$ 0,00",
    ordersToday: 0,
    pendingOrders: 0,
    activeProducts: 0,
    totalUsers: 0,
    deltaPedidos: undefined as number | undefined,
    deltaVendas: undefined as number | undefined,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rendimento, setRendimento] = useState({
    hoje: 0,
    semana: 0,
    mes: 0,
    ticketMedio: 0,
    serie: [] as { dia: string; total: number }[],
    topProduto: null as { nome: string; quantidade: number } | null,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      
      // Fetch Stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [{ pedidos: todosPedidos, erro }, { count: productsCount }, { count: usersCount }] =
        await Promise.all([
          buscarPedidos(),
          supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("is_available", true),
          supabase.from("user_profiles").select("id", { count: "exact", head: true }),
        ]);

      if (erro) {
        toast.error(`Erro ao carregar o painel: ${erro}`);
        setLoading(false);
        return;
      }

      const allOrders = todosPedidos;
      const recentOrdersData = todosPedidos.slice(0, 5);

      const ontem = new Date(today);
      ontem.setDate(ontem.getDate() - 1);

      const pedidos = allOrders;
      const emitidoEm = (o: PedidoEnriquecido) => new Date(o.created_at ?? 0);
      const concluido = (o: PedidoEnriquecido) => o.status === "completed";
      const somar = (lista: PedidoEnriquecido[]) => lista.reduce((acc, o) => acc + (o.amount ?? 0), 0);

      const totalRevenue = somar(pedidos.filter(concluido));
      const ordersToday = pedidos.filter((o) => emitidoEm(o) >= today).length;
      const ordersOntem = pedidos.filter((o) => emitidoEm(o) >= ontem && emitidoEm(o) < today).length;
      const pendingOrders = pedidos.filter((o) => o.status === "pending").length;

      const vendasHoje = somar(pedidos.filter((o) => concluido(o) && emitidoEm(o) >= today));
      const vendasOntem = somar(
        pedidos.filter((o) => concluido(o) && emitidoEm(o) >= ontem && emitidoEm(o) < today),
      );

      setStats({
        totalSales: `R$ ${totalRevenue.toFixed(2)}`,
        ordersToday,
        pendingOrders,
        activeProducts: productsCount || 0,
        totalUsers: usersCount || 0,
        deltaPedidos: ordersToday - ordersOntem,
        // Sem faturamento ontem nao existe base de comparacao percentual.
        deltaVendas: vendasOntem > 0 ? ((vendasHoje - vendasOntem) / vendasOntem) * 100 : undefined,
      });

      // --- Rendimento -------------------------------------------------------
      // So pedido concluido conta como faturamento; pendente e cancelado nao.
      const vendas = pedidos.filter(concluido);
      const desde = (dias: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() - dias);
        return d;
      };

      const vendas7 = vendas.filter((o) => emitidoEm(o) >= desde(6));
      const vendas30 = vendas.filter((o) => emitidoEm(o) >= desde(29));

      // Sete baldes diarios, do mais antigo para hoje.
      const serie: { dia: string; total: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const inicio = desde(i);
        const fim = new Date(inicio);
        fim.setDate(fim.getDate() + 1);
        serie.push({
          dia: inicio.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3),
          total: somar(vendas.filter((o) => emitidoEm(o) >= inicio && emitidoEm(o) < fim)),
        });
      }

      const porProduto = new Map<string, number>();
      for (const o of vendas30) {
        const nome = o.products?.name ?? "Item digital";
        porProduto.set(nome, (porProduto.get(nome) ?? 0) + 1);
      }
      const top = [...porProduto.entries()].sort((a, b) => b[1] - a[1])[0];

      setRendimento({
        hoje: vendasHoje,
        semana: somar(vendas7),
        mes: somar(vendas30),
        ticketMedio: vendas.length > 0 ? totalRevenue / vendas.length : 0,
        serie,
        topProduto: top ? { nome: top[0], quantidade: top[1] } : null,
      });

      setRecentOrders(recentOrdersData || []);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 italic">
            <span>SISTEMA CENTRAL</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">VISÃO GERAL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black chrome-text italic tracking-tighter uppercase leading-none">DASHBOARD</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-bold italic opacity-70">Monitoramento em tempo real do sistema</p>
        </div>

        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            className="border-primary/20 hover:neon-border rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest italic glass"
          >
            <Link to="/admin/pedidos">
              <Calendar className="w-4 h-4 mr-2" />
              Ver Pedidos
            </Link>
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          label="Total de Vendas"
          value={stats.totalSales}
          icon={<TrendingUp className="w-6 h-6" />}
          delta={stats.deltaVendas}
          deltaSufixo="%"
        />
        <StatCard
          label="Pedidos Hoje"
          value={stats.ordersToday}
          icon={<ShoppingBag className="w-6 h-6" />}
          delta={stats.deltaPedidos}
        />
        <StatCard
          label="Pedidos Pendentes"
          value={stats.pendingOrders}
          icon={<Clock className="w-6 h-6" />}
        />
        <StatCard
          label="Produtos Ativos"
          value={stats.activeProducts}
          icon={<Package className="w-6 h-6" />}
        />
        <StatCard
          label="Usuários"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div 
          variants={fadeInUp}
          className="lg:col-span-2 glass rounded-3xl border border-primary/10 overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_10px_#8B2FE8]" />
               <h2 className="text-sm font-black uppercase tracking-[0.2em] italic text-white">Últimos Pedidos</h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest italic text-primary hover:bg-primary/5">
              <Link to="/admin/pedidos">
                Ver tudo <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="flex-1">
             {loading ? (
               <div className="p-12 flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-[9px] font-black uppercase tracking-widest italic text-muted-foreground animate-pulse">Sincronizando...</span>
               </div>
             ) : recentOrders.length > 0 ? (
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-primary/5">
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Cliente</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Produtos</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Valor</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Status</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-primary/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-7 h-7 border border-primary/20">
                                <AvatarImage src={order.user_profiles?.avatar_url} />
                                <AvatarFallback className="text-[8px] font-bold">{order.user_profiles?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{order.user_profiles?.username || "Visitante"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{order.products?.name || "Item Digital"}</span>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-[10px] font-black text-primary italic">R$ {order.amount.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4">
                             <Badge variant="outline" className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase italic border-none ${
                               order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                               order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                               'bg-red-500/10 text-red-500'
                             }`}>
                               {order.status === 'completed' ? 'Finalizado' : order.status === 'pending' ? 'Pendente' : 'Cancelado'}
                             </Badge>
                          </td>
                          <td className="px-6 py-4 text-[9px] text-muted-foreground font-bold tracking-widest italic">
                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
             ) : (
               <div className="p-20 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-50">Sem registros recentes</p>
               </div>
             )}
          </div>
        </motion.div>

        {/* Rendimento. Substitui o antigo painel "Status do Sistema", que exibia
            "Operacional" fixo no codigo, sem checar servico nenhum. */}
        <motion.div
          variants={fadeInUp}
          className="glass rounded-3xl border border-primary/10 p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_10px_#8B2FE8]" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] italic text-white">Rendimento</h2>
          </div>

          <div className="space-y-3">
            {[
              { label: "Hoje", valor: rendimento.hoje },
              { label: "Últimos 7 dias", valor: rendimento.semana },
              { label: "Últimos 30 dias", valor: rendimento.mes },
              { label: "Ticket médio", valor: rendimento.ticketMedio },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-primary/5 rounded-2xl"
              >
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
                  {item.label}
                </span>
                <span className="text-[12px] font-black text-primary italic tracking-tighter">
                  R$ {item.valor.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div>
            <span className="text-[9px] font-black uppercase tracking-widest italic text-muted-foreground opacity-70">
              Faturamento por dia (7 dias)
            </span>
            <div className="flex items-end gap-1.5 h-24 mt-3">
              {rendimento.serie.map((d) => {
                const teto = Math.max(...rendimento.serie.map((x) => x.total), 1);
                return (
                  <div key={d.dia} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full bg-primary/30 group-hover:bg-primary rounded-t transition-all min-h-[2px]"
                        style={{ height: `${(d.total / teto) * 100}%` }}
                        title={`${d.dia}: R$ ${d.total.toFixed(2)}`}
                      />
                    </div>
                    <span className="text-[7px] font-black uppercase text-muted-foreground opacity-60">
                      {d.dia}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {rendimento.topProduto && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
              <span className="text-[9px] font-black uppercase tracking-widest italic text-muted-foreground block mb-1">
                Mais vendido (30 dias)
              </span>
              <span className="text-[11px] font-black text-white uppercase italic tracking-tight">
                {rendimento.topProduto.nome}
              </span>
              <span className="text-[9px] font-bold text-primary italic ml-2">
                {rendimento.topProduto.quantidade}x
              </span>
            </div>
          )}

          <div className="mt-auto">
            <Button
              asChild
              variant="outline"
              className="w-full border-primary/20 hover:neon-border rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest italic glass"
            >
              <a href="https://discord.gg/kmcX2EyFGz" target="_blank" rel="noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                Suporte no Discord
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
