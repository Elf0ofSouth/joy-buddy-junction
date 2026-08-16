import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  Shield, 
  ShieldAlert, 
  History, 
  ChevronRight,
  UserCheck,
  UserMinus
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

export const Route = createFileRoute("/admin/usuarios")({
  component: AdminUsers,
});

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adminToggleUser, setAdminToggleUser] = useState<any | null>(null);
  const [historicoDe, setHistoricoDe] = useState<any | null>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);

  const abrirHistorico = async (usuario: any) => {
    setHistoricoDe(usuario);
    setCarregandoHistorico(true);
    setHistorico([]);

    const { data, error } = await supabase
      .from("orders")
      .select("id, total_price, status, created_at, products(name)")
      .eq("user_id", usuario.id)
      .order("created_at", { ascending: false });

    if (error) toast.error(`Erro ao carregar histórico: ${error.message}`);
    else setHistorico(data ?? []);
    setCarregandoHistorico(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    // Note: In a real scenario, we might need a more complex query to get order counts/spent
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar usuários");
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminStatus = async () => {
    if (!adminToggleUser) return;
    
    const newStatus = !adminToggleUser.is_admin;
    const { error } = await supabase
      .from("user_profiles")
      .update({ is_admin: newStatus })
      .eq("id", adminToggleUser.id);

    if (error) {
      toast.error("Erro ao atualizar status de administrador");
    } else {
      toast.success(`Usuário ${newStatus ? 'promovido a' : 'removido de'} administrador`);
      fetchUsers();
    }
    setAdminToggleUser(null);
  };

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.discord_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 italic">
            <span>SISTEMA CENTRAL</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">CONTROLE DE ACESSO</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black chrome-text italic tracking-tighter uppercase leading-none">USUÁRIOS</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="BUSCAR POR NOME OU DISCORD ID..." 
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
            <span className="text-[9px] font-black uppercase tracking-widest italic text-muted-foreground">Escaneando rede de usuários...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Identidade</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Discord ID</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Total Gasto</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Data de Registro</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Privilégios</th>
                  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-primary/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-primary/20">
                          <AvatarImage src={u.avatar_url} />
                          <AvatarFallback className="text-[8px] font-bold">{u.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] font-black text-white uppercase tracking-wider">{u.username || "Desconhecido"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono text-muted-foreground opacity-60">{u.discord_id || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-primary italic">R$ {(u.total_spent || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-[9px] text-muted-foreground font-bold tracking-widest italic">
                      {new Date(u.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      {u.is_admin ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase italic">
                          <Shield className="w-3 h-3 mr-1" /> Administrador
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-primary/5 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase italic">
                          Membro
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-primary rounded-xl"
                          onClick={() => setAdminToggleUser(u)}
                          title={u.is_admin ? "Remover Admin" : "Tornar Admin"}
                        >
                          {u.is_admin ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary rounded-xl"
                          title="Histórico de Pedidos"
                          onClick={() => abrirHistorico(u)}
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                       <p className="text-[10px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-50">Nenhum usuário encontrado</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={!!adminToggleUser} onOpenChange={() => setAdminToggleUser(null)}>
        <AlertDialogContent className="glass border-primary/20 bg-black/95 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black chrome-text italic uppercase tracking-tighter">
              {adminToggleUser?.is_admin ? "Revogar Acesso Admin" : "Conceder Acesso Admin"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
              {adminToggleUser?.is_admin 
                ? `Você está prestes a remover os privilégios administrativos de ${adminToggleUser?.username}. O usuário perderá o acesso ao painel de controle.`
                : `Você está prestes a conceder privilégios administrativos totais a ${adminToggleUser?.username}. Este usuário terá controle total sobre produtos, usuários e configurações.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-2xl border-primary/20 hover:bg-white/5 text-[9px] font-black uppercase italic tracking-widest h-11">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={toggleAdminStatus}
              className={`rounded-2xl text-white text-[9px] font-black uppercase italic tracking-widest h-11 shadow-lg ${
                adminToggleUser?.is_admin ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-primary hover:opacity-90 shadow-primary/20'
              }`}
            >
              Confirmar Alteração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!historicoDe} onOpenChange={(o) => !o && setHistoricoDe(null)}>
        <DialogContent className="glass border-primary/20 bg-black/95 rounded-3xl max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-black chrome-text italic uppercase tracking-tighter">
              Histórico — {historicoDe?.username || "Usuário"}
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
              Todos os pedidos registrados para esta conta.
            </DialogDescription>
          </DialogHeader>

          {carregandoHistorico ? (
            <div className="p-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : historico.length === 0 ? (
            <p className="p-12 text-center text-[10px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-50">
              Nenhum pedido encontrado
            </p>
          ) : (
            <table className="w-full text-left">
              <tbody>
                {historico.map((o) => (
                  <tr key={o.id} className="border-b border-primary/5">
                    <td className="px-2 py-3 text-[10px] font-bold text-white uppercase tracking-wider">
                      {o.products?.name || "Item digital"}
                    </td>
                    <td className="px-2 py-3 text-[10px] font-black text-primary italic">
                      R$ {(o.total_price ?? 0).toFixed(2)}
                    </td>
                    <td className="px-2 py-3">
                      <Badge
                        className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase italic border-none ${
                          o.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : o.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {o.status === "completed" ? "Finalizado" : o.status === "pending" ? "Pendente" : "Cancelado"}
                      </Badge>
                    </td>
                    <td className="px-2 py-3 text-[9px] text-muted-foreground font-bold tracking-widest italic text-right">
                      {o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
