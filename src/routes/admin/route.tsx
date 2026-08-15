import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Package, 
  Database, 
  Image as ImageIcon, 
  ShoppingBag, 
  ShoppingCart, 
  Users,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthModal } from "@/hooks/use-auth-modal";
import logoAsset from "@/assets/cipher-logo.png.asset.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single();

    if (!profile?.is_admin) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: AdminLayout,
});

const menuItems = [
  { id: "overview", label: "Visão Geral", icon: <LayoutDashboard className="w-4 h-4" />, path: "/admin" },
  { id: "products", label: "Produtos", icon: <Package className="w-4 h-4" />, path: "/admin/produtos" },
  { id: "inventory", label: "Estoque", icon: <Database className="w-4 h-4" />, path: "/admin/estoque" },
  { id: "banners", label: "Banners", icon: <ImageIcon className="w-4 h-4" />, path: "/admin/banners" },
  { id: "orders", label: "Pedidos", icon: <ShoppingBag className="w-4 h-4" />, path: "/admin/pedidos" },
  { id: "carts", label: "Carrinhos Abandonados", icon: <ShoppingCart className="w-4 h-4" />, path: "/admin/carrinhos-abandonados" },
  { id: "users", label: "Usuários", icon: <Users className="w-4 h-4" />, path: "/admin/usuarios" },
];

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  const activePath = router.state.location.pathname;

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary selection:text-primary-foreground font-mono flex">
      {/* Circuit Background */}
      <div className="fixed inset-0 circuit-bg pointer-events-none opacity-20 z-0" />

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } glass border-r border-primary/20 sticky top-0 h-screen z-50 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && "hidden"}`}>
            <img src={logoAsset.url} alt="Logo" className="w-8 h-8" />
            <span className="font-black text-lg tracking-tighter chrome-text italic uppercase">CIPHER ADMIN</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-primary hover:bg-primary/10"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden no-scrollbar">
          {menuItems.map((item) => {
            const isActive = activePath === item.path || (item.path !== "/admin" && activePath.startsWith(item.path));
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full group rounded-2xl transition-all duration-300 px-4 py-6 relative flex items-center ${
                  isSidebarOpen ? "justify-start gap-4" : "justify-center"
                } ${
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(139,47,232,0.1)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                }`}
                onClick={() => window.location.href = item.path}
              >
                <span className={`${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"} transition-colors`}>
                  {item.icon}
                </span>
                {isSidebarOpen && (
                  <span className="text-[11px] font-black uppercase tracking-widest italic">{item.label}</span>
                )}
                {isActive && isSidebarOpen && (
                  <div className="absolute left-0 w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_#8B2FE8]" />
                )}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary/10 bg-black/40">
          <Button
            variant="ghost"
            className={`w-full group rounded-2xl text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-6 flex items-center ${
              isSidebarOpen ? "justify-start gap-4" : "justify-center"
            }`}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            {isSidebarOpen && (
              <span className="text-[11px] font-black uppercase tracking-widest italic">Encerrar Sessão</span>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 z-10">
        {/* Topbar */}
        <header className="h-20 glass border-b border-primary/20 sticky top-0 z-40 px-8 flex items-center justify-between backdrop-blur-2xl">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
             <div className="relative w-full hidden md:block group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="COMANDO DE BUSCA GLOBAL..." 
                  className="w-full h-11 bg-white/5 border border-primary/20 rounded-2xl pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:border-primary transition-all italic"
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-primary gap-2 hidden lg:flex rounded-full text-[10px] font-black uppercase tracking-widest italic"
              onClick={() => window.location.href = "/"}
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao site
            </Button>
            
            <div className="w-[1px] h-6 bg-primary/20 mx-2 hidden lg:block" />

            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-black animate-pulse" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-2 rounded-2xl hover:bg-primary/5 transition-all outline-none">
                  <Avatar className="w-9 h-9 border border-primary/40 p-0.5">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-black italic">ADM</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-[10px] font-black text-white leading-none uppercase tracking-tighter italic">
                      {user?.user_metadata?.full_name || user?.user_metadata?.user_name || "Cipher Admin"}
                    </span>
                    <span className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1 opacity-80 italic">Root Access</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass border-primary/20 bg-black/90 p-1" align="end">
                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest p-3 text-muted-foreground">Administração</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem className="focus:bg-primary/10 cursor-pointer p-3 gap-3">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Perfil Admin</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="focus:bg-red-500/10 cursor-pointer p-3 gap-3 text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 p-8 overflow-y-auto overflow-x-hidden no-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
