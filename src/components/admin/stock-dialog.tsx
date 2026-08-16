import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2, CheckCircle2, Clipboard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ItemEstoque = {
  id: string;
  content: string;
  status: string | null;
  created_at: string | null;
  sold_at: string | null;
};

export function StockDialog({
  aberto,
  produtoId,
  produtoNome,
  onFechar,
  onMudou,
}: {
  aberto: boolean;
  produtoId: string | null;
  produtoNome: string;
  onFechar: () => void;
  /** Chamado quando o estoque muda, para a lista de produtos recontar. */
  onMudou: () => void;
}) {
  const [itens, setItens] = useState<ItemEstoque[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [novos, setNovos] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!produtoId) return;
    setCarregando(true);
    const { data, error } = await supabase
      .from("stock_items")
      .select("id, content, status, created_at, sold_at")
      .eq("product_id", produtoId)
      .order("created_at", { ascending: false });

    if (error) toast.error(`Erro ao carregar estoque: ${error.message}`);
    else setItens(data ?? []);
    setCarregando(false);
  }, [produtoId]);

  useEffect(() => {
    if (aberto && produtoId) {
      setNovos("");
      carregar();
    }
  }, [aberto, produtoId, carregar]);

  const linhas = novos
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  async function adicionar() {
    if (!produtoId || linhas.length === 0) {
      toast.error("Cole ao menos um item");
      return;
    }
    setSalvando(true);
    const { error } = await supabase.from("stock_items").insert(
      linhas.map((content) => ({ product_id: produtoId, content, status: "available" })),
    );
    setSalvando(false);

    if (error) {
      toast.error(`Erro ao adicionar estoque: ${error.message}`);
      return;
    }
    toast.success(`${linhas.length} item(ns) adicionados`);
    setNovos("");
    carregar();
    onMudou();
  }

  async function remover(id: string) {
    const { error } = await supabase.from("stock_items").delete().eq("id", id);
    if (error) {
      toast.error(`Erro ao remover item: ${error.message}`);
      return;
    }
    toast.success("Item removido");
    carregar();
    onMudou();
  }

  const disponiveis = itens.filter((i) => i.status === "available");
  const vendidos = itens.filter((i) => i.status === "sold");

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onFechar()}>
      <DialogContent className="glass border-primary/20 bg-black/95 rounded-3xl max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-black chrome-text italic uppercase tracking-tighter">
            Estoque — {produtoNome}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
            Chaves, licenças ou credenciais entregues automaticamente na compra.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 py-2">
          <Badge className="bg-green-500/10 text-green-500 border-none text-[9px] font-black uppercase italic tracking-widest px-3 py-1 rounded-full">
            {disponiveis.length} disponível(is)
          </Badge>
          <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase italic tracking-widest px-3 py-1 rounded-full">
            {vendidos.length} vendido(s)
          </Badge>
        </div>

        <div className="space-y-3">
          <label className="text-[9px] font-black uppercase tracking-widest italic text-primary">
            Adicionar itens (1 por linha)
          </label>
          <Textarea
            value={novos}
            onChange={(e) => setNovos(e.target.value)}
            placeholder={"CHAVE-AAAA-BBBB\nCHAVE-CCCC-DDDD"}
            className="bg-white/5 border-primary/20 rounded-xl min-h-[110px] text-[11px] font-mono p-4"
          />
          <Button
            onClick={adicionar}
            disabled={salvando || linhas.length === 0}
            className="rounded-2xl bg-primary hover:opacity-90 text-white text-[9px] font-black uppercase italic tracking-widest h-11 px-6"
          >
            {salvando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Adicionar {linhas.length > 0 ? `(${linhas.length})` : ""}
          </Button>
        </div>

        <div className="mt-4 rounded-2xl border border-primary/10 overflow-hidden">
          {carregando ? (
            <div className="p-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : itens.length === 0 ? (
            <p className="p-12 text-center text-[10px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-50">
              Nenhum item em estoque
            </p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
              <table className="w-full text-left">
                <tbody>
                  {itens.map((item) => (
                    <tr key={item.id} className="border-b border-primary/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-mono text-white break-all">{item.content}</span>
                      </td>
                      <td className="px-4 py-3 w-28">
                        <Badge
                          className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase italic border-none ${
                            item.status === "available"
                              ? "bg-green-500/10 text-green-500"
                              : item.status === "sold"
                                ? "bg-primary/10 text-primary"
                                : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {item.status === "available"
                            ? "Disponível"
                            : item.status === "sold"
                              ? "Vendido"
                              : "Revogado"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 w-24 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Copiar"
                            className="text-muted-foreground hover:text-primary rounded-xl h-8 w-8"
                            onClick={() => {
                              navigator.clipboard.writeText(item.content);
                              toast.success("Copiado");
                            }}
                          >
                            <Clipboard className="w-3.5 h-3.5" />
                          </Button>
                          {item.status === "available" ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Remover"
                              className="text-muted-foreground hover:text-red-500 rounded-xl h-8 w-8"
                              onClick={() => remover(item.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          ) : (
                            <span className="w-8 flex justify-center text-primary/40" title="Já vendido">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
