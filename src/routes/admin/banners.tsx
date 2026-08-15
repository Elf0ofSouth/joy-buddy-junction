import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  ImageIcon, 
  Plus, 
  Trash2, 
  Edit, 
  ChevronRight,
  ExternalLink,
  Layers,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/admin/banners")({
  component: AdminBanners,
});

function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    link_url: "",
    sort_order: 0,
    is_active: true
  });

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) toast.error("Erro ao carregar banners");
    else setBanners(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddBanner = async () => {
    if (!formData.image_url || !formData.title) {
      toast.error("Preencha o título e a URL da imagem");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("banners").insert([formData as any]);

    if (error) {
      toast.error("Erro ao criar banner");
    } else {
      toast.success("Banner criado com sucesso");
      setIsAddOpen(false);
      setFormData({
        title: "",
        subtitle: "",
        image_url: "",
        link_url: "",
        sort_order: banners.length,
        is_active: true
      });
      fetchBanners();
    }
    setIsSubmitting(false);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("banners")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) toast.error("Erro ao atualizar status");
    else fetchBanners();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir banner");
    else {
      toast.success("Banner removido");
      fetchBanners();
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 italic">
            <span>SISTEMA CENTRAL</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">INTERFACE VISUAL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black chrome-text italic tracking-tighter uppercase leading-none">BANNERS</h1>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:opacity-90 rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest italic text-white shadow-[0_0_20px_rgba(139,47,232,0.3)]">
              <Plus className="w-4 h-4 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-primary/20 bg-black/95 rounded-3xl max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black chrome-text italic uppercase tracking-tighter">Configurar Banner</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
                Adicione um novo banner promocional para a página inicial.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest italic text-primary">Título</label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="TÍTULO DO BANNER"
                    className="bg-white/5 border-primary/20 rounded-xl h-11 text-[10px] font-bold uppercase tracking-widest italic"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest italic text-primary">Subtítulo</label>
                  <Input 
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    placeholder="DESCRIÇÃO CURTA"
                    className="bg-white/5 border-primary/20 rounded-xl h-11 text-[10px] font-bold uppercase tracking-widest italic"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest italic text-primary">URL da Imagem</label>
                <Input 
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="HTTPS://..."
                  className="bg-white/5 border-primary/20 rounded-xl h-11 text-[10px] font-mono italic"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest italic text-primary">URL de Destino</label>
                  <Input 
                    value={formData.link_url}
                    onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                    placeholder="/LOJA OU HTTPS://..."
                    className="bg-white/5 border-primary/20 rounded-xl h-11 text-[10px] font-mono italic"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest italic text-primary">Ordem</label>
                  <Input 
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                    className="bg-white/5 border-primary/20 rounded-xl h-11 text-[10px] font-bold uppercase tracking-widest italic"
                  />
                </div>
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
                onClick={handleAddBanner}
                disabled={isSubmitting}
                className="rounded-2xl bg-primary hover:opacity-90 text-white text-[9px] font-black uppercase italic tracking-widest h-11 shadow-[0_0_20px_rgba(139,47,232,0.3)]"
              >
                {isSubmitting ? "Gravando..." : "Salvar Banner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-widest italic text-muted-foreground">Sincronizando assets...</span>
          </div>
        ) : banners.map((banner) => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={banner.id}
            className="glass rounded-3xl border border-primary/10 overflow-hidden group hover:border-primary/30 transition-all duration-500"
          >
            <div className="relative aspect-video bg-black/40 overflow-hidden">
               {banner.image_url ? (
                 <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-primary/20">
                    <ImageIcon className="w-12 h-12" />
                 </div>
               )}
               <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 rounded-full glass border-primary/20 text-white hover:text-primary"
                    onClick={() => handleToggleActive(banner.id, banner.is_active)}
                  >
                    {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 rounded-full glass border-red-500/20 text-red-500 hover:bg-red-500/10"
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
               </div>
               <div className="absolute top-4 left-4">
                  <Badge className="bg-black/60 backdrop-blur-md text-[8px] font-black tracking-widest uppercase italic border border-primary/20">
                    POS: {banner.sort_order}
                  </Badge>
               </div>
               {!banner.is_active && (
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="outline" className="border-red-500/50 text-red-500 text-[10px] font-black uppercase tracking-widest italic bg-black/80">INATIVO</Badge>
                 </div>
               )}
            </div>
            
            <div className="p-5 space-y-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-wider italic">{banner.title}</span>
                <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mt-1 line-clamp-1 italic">
                  {banner.subtitle || "Sem subtítulo"}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 text-[8px] font-mono text-primary/60 italic overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                   <ExternalLink className="w-3 h-3" /> {banner.link_url || "/"}
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest italic text-primary hover:bg-primary/5">
                  <Edit className="w-3 h-3 mr-2" /> Editar
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
        {banners.length === 0 && !loading && (
           <div className="col-span-full p-20 text-center glass border-dashed border-primary/10 rounded-3xl">
             <Layers className="w-12 h-12 text-primary/20 mx-auto mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-50">Nenhum banner configurado</p>
           </div>
        )}
      </div>
    </div>
  );
}
