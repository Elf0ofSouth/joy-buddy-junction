import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import logoAsset from "@/assets/cipher-logo.png.asset.json";
import { useAuthStore } from "@/hooks/use-auth-store";

export function AuthModal() {
  const { isOpen, close } = useAuthModal();
  const { isLoading, setIsLoading } = useAuthStore();

  const handleDiscordLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error("Não foi possível conectar. Tente novamente.");
      console.error("Auth error:", error);
    } finally {
      // Note: Redirect will happen, but we reset loading just in case
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[400px] glass border-primary/20 bg-black/80 backdrop-blur-xl p-8 overflow-hidden">
        {/* Background Pulse Glow */}
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-[60px] -z-10 animate-pulse" />
        
        <DialogHeader className="flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <img src={logoAsset.url} alt="Cipher Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(139,47,232,0.5)]" />
          </motion.div>
          
          <DialogTitle className="text-2xl font-black chrome-text uppercase tracking-tighter">
            ACESSO CIPHER
          </DialogTitle>
          <DialogDescription className="text-muted-foreground uppercase text-[10px] tracking-[0.2em] leading-relaxed">
            Entre com sua conta Discord para acessar a loja, seus pedidos e vantagens exclusivas.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8 space-y-4">
          <Button
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold h-12 rounded-full shadow-[0_0_15px_rgba(88,101,242,0.3)] hover:shadow-[0_0_20px_rgba(88,101,242,0.5)] transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                CONECTANDO...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                ENTRAR COM DISCORD
              </>
            )}
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]" />
          </Button>

          <p className="text-[9px] text-muted-foreground text-center uppercase tracking-widest leading-relaxed">
            Ao continuar, você concorda com nossos <br /> <span className="text-primary hover:underline cursor-pointer">Termos de Uso</span>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
