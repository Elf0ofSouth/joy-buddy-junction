import { useAuthStore } from "@/hooks/use-auth-store";
import { supabase } from "@/integrations/supabase/client";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, ShoppingBag, LogOut, ChevronDown, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function UserNav() {
  const { user, setUser } = useAuthStore();
  const { open } = useAuthModal();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const checkAdmin = async () => {
        const { data } = await supabase
          .from("user_profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        setIsAdmin(!!data?.is_admin);
      };
      checkAdmin();
    }
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success("Logout realizado com sucesso.");
    } catch (error) {
      toast.error("Erro ao sair.");
      console.error(error);
    }
  };

  if (!user) {
    return (
      <Button 
        size="sm" 
        onClick={open}
        className="bg-primary hover:opacity-90 transition-all font-bold tracking-widest"
      >
        ENTRAR
      </Button>
    );
  }

  const displayName = user.user_metadata?.full_name || user.user_metadata?.custom_claims?.global_name || user.user_metadata?.user_name || "Cipher User";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer group outline-none">
          <div className="relative">
            <Avatar className="h-8 w-8 border border-primary/40 group-hover:neon-border transition-all duration-300">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-black text-[10px] font-bold text-primary">
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -inset-1 border border-primary/20 rounded-full animate-pulse -z-10" />
          </div>
          <div className="hidden sm:flex flex-col items-start leading-none">
            <span className="font-black text-[10px] tracking-widest uppercase chrome-text italic">
              {displayName}
            </span>
            {isAdmin && (
              <span className="text-[7px] font-black text-primary uppercase tracking-widest mt-0.5 animate-pulse">ADMIN ACCESS</span>
            )}
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass border-primary/20 bg-black/95 backdrop-blur-xl p-1" align="end" sideOffset={8}>
        {isAdmin && (
          <>
            <DropdownMenuItem asChild className="focus:bg-primary/10 cursor-pointer p-3">
              <Link to="/admin" className="flex items-center gap-3 w-full">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Painel Admin</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary/10" />
          </>
        )}
        <DropdownMenuItem asChild className="focus:bg-primary/10 cursor-pointer p-3">
          <Link to="/loja" className="flex items-center gap-3 w-full">
            <User className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Minha Conta</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="focus:bg-primary/10 cursor-pointer p-3">
          <Link to="/loja" className="flex items-center gap-3 w-full">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Meus Pedidos</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-primary/10" />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="focus:bg-red-500/10 cursor-pointer p-3 text-red-500/80 hover:text-red-500 transition-colors"
        >
          <div className="flex items-center gap-3 w-full">
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Sair</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}