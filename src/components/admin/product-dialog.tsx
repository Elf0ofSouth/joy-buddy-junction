import { useEffect, useState } from "react";
import { Loader2, Package, Percent, Truck, ImageIcon, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIAS, formatarBRL, precoComDesconto, type TipoEntrega } from "@/lib/produto";

export type ProdutoRow = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  image_url: string | null;
  banner_url: string | null;
  price_brl: number;
  discount_percent: number | null;
  delivery_type: string | null;
  is_available: boolean | null;
};

type FormState = {
  name: string;
  description: string;
  category: string;
  icon: string;
  image_url: string;
  banner_url: string;
  price_brl: string;
  discount_percent: string;
  delivery_type: TipoEntrega;
  is_available: boolean;
  estoqueInicial: string;
};

const VAZIO: FormState = {
  name: "",
  description: "",
  category: "discord",
  icon: "",
  image_url: "",
  banner_url: "",
  price_brl: "",
  discount_percent: "0",
  delivery_type: "manual",
  is_available: true,
  estoqueInicial: "",
};

function paraFormulario(p: ProdutoRow): FormState {
  return {
    name: p.name ?? "",
    description: p.description ?? "",
    category: p.category ?? "perk",
    icon: p.icon ?? "",
    image_url: p.image_url ?? "",
    banner_url: p.banner_url ?? "",
    price_brl: String(p.price_brl ?? ""),
    discount_percent: String(p.discount_percent ?? 0),
    delivery_type: p.delivery_type === "automatic" ? "automatic" : "manual",
    is_available: p.is_available ?? true,
    estoqueInicial: "",
  };
}

const rotulo = "text-[9px] font-black uppercase tracking-widest italic text-primary";
const campo =
  "bg-white/5 border-primary/20 rounded-xl h-11 text-[11px] font-bold tracking-wide focus:border-primary transition-all";

function Secao({
  icone,
  titulo,
  children,
}: {
  icone: React.ReactNode;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-primary/10">
        <span className="text-primary">{icone}</span>
        <h3 className="text-[10px] font-black uppercase tracking-widest italic text-white">{titulo}</h3>
      </div>
      {children}
    </section>
  );
}

export function ProductDialog({
  aberto,
  produto,
  onFechar,
  onSalvo,
}: {
  aberto: boolean;
  /** null = criar um produto novo */
  produto: ProdutoRow | null;
  onFechar: () => void;
  onSalvo: () => void;
}) {
  const [form, setForm] = useState<FormState>(VAZIO);
  const [salvando, setSalvando] = useState(false);
  const editando = produto !== null;

  useEffect(() => {
    if (aberto) setForm(produto ? paraFormulario(produto) : VAZIO);
  }, [aberto, produto]);

  const set = <K extends keyof FormState>(chave: K, valor: FormState[K]) =>
    setForm((f) => ({ ...f, [chave]: valor }));

  const preco = Number(form.price_brl) || 0;
  const desconto = Number(form.discount_percent) || 0;
  const precoFinal = precoComDesconto(preco, desconto);

  const chavesIniciais = form.estoqueInicial
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  async function salvar() {
    if (!form.name.trim()) {
      toast.error("Informe o nome do produto");
      return;
    }
    if (!form.price_brl.trim() || Number.isNaN(preco) || preco < 0) {
      toast.error("Informe um preço válido");
      return;
    }
    if (desconto < 0 || desconto > 100) {
      toast.error("O desconto deve ficar entre 0 e 100");
      return;
    }

    setSalvando(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      category: form.category.trim() || "others",
      icon: form.icon.trim() || null,
      image_url: form.image_url.trim() || null,
      banner_url: form.banner_url.trim() || null,
      price_brl: preco,
      discount_percent: Math.round(desconto),
      delivery_type: form.delivery_type,
      is_available: form.is_available,
    };

    if (editando) {
      const { error } = await supabase.from("products").update(payload).eq("id", produto.id);
      setSalvando(false);
      if (error) {
        toast.error(`Erro ao salvar produto: ${error.message}`);
        return;
      }
      toast.success("Produto atualizado");
      onSalvo();
      onFechar();
      return;
    }

    const { data, error } = await supabase.from("products").insert(payload).select("id").single();

    if (error || !data) {
      setSalvando(false);
      toast.error(`Erro ao criar produto: ${error?.message ?? "resposta vazia"}`);
      return;
    }

    // Estoque inicial so faz sentido para entrega automatica, e so pode ser
    // inserido depois do produto existir (precisa do product_id).
    if (form.delivery_type === "automatic" && chavesIniciais.length > 0) {
      const { error: erroEstoque } = await supabase.from("stock_items").insert(
        chavesIniciais.map((content) => ({
          product_id: data.id,
          content,
          status: "available",
        })),
      );

      setSalvando(false);
      if (erroEstoque) {
        toast.error(
          `Produto criado, mas o estoque falhou: ${erroEstoque.message}. Adicione pelo botão de estoque.`,
        );
      } else {
        toast.success(`Produto criado com ${chavesIniciais.length} item(ns) em estoque`);
      }
      onSalvo();
      onFechar();
      return;
    }

    setSalvando(false);
    toast.success("Produto criado");
    onSalvo();
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onFechar()}>
      <DialogContent className="glass border-primary/20 bg-black/95 rounded-3xl max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-black chrome-text italic uppercase tracking-tighter">
            {editando ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
            Preço, desconto, banner, entrega e estoque em um só lugar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          <Secao icone={<Package className="w-4 h-4" />} titulo="Identificação">
            <div className="space-y-2">
              <label className={rotulo}>Nome *</label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="CARGO VIP"
                className={campo}
              />
            </div>
            <div className="space-y-2">
              <label className={rotulo}>Descrição</label>
              <Textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="O que o cliente recebe ao comprar..."
                className="bg-white/5 border-primary/20 rounded-xl min-h-[90px] text-[11px] p-4"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={rotulo}>Categoria</label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger className={campo}>
                    <SelectValue placeholder="SELECIONE..." />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/20 bg-black/95">
                    {CATEGORIAS.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        className="text-[10px] font-bold uppercase tracking-widest italic"
                      >
                        {c.label}
                      </SelectItem>
                    ))}
                    {/* Produtos antigos podem ter uma categoria fora da lista
                        (o schema criava tudo como "perk"). Mantemos a opcao
                        visivel para nao apagar o valor sem querer ao salvar. */}
                    {form.category !== "" &&
                      !CATEGORIAS.some((c) => c.id === form.category) && (
                        <SelectItem
                          value={form.category}
                          className="text-[10px] font-bold uppercase tracking-widest italic opacity-60"
                        >
                          {form.category} (atual)
                        </SelectItem>
                      )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className={rotulo}>Ícone</label>
                <Input
                  value={form.icon}
                  onChange={(e) => set("icon", e.target.value)}
                  placeholder="Shield"
                  className={campo}
                />
              </div>
            </div>
          </Secao>

          <Secao icone={<Percent className="w-4 h-4" />} titulo="Preço e desconto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={rotulo}>Preço cheio (R$) *</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price_brl}
                  onChange={(e) => set("price_brl", e.target.value)}
                  placeholder="15.00"
                  className={campo}
                />
              </div>
              <div className="space-y-2">
                <label className={rotulo}>Desconto (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={form.discount_percent}
                  onChange={(e) => set("discount_percent", e.target.value)}
                  className={campo}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-2xl">
              <span className="text-[9px] font-black uppercase tracking-widest italic text-muted-foreground">
                Cliente paga
              </span>
              <div className="flex items-baseline gap-3">
                {desconto > 0 && (
                  <span className="text-[11px] font-bold text-muted-foreground line-through italic">
                    {formatarBRL(preco)}
                  </span>
                )}
                <span className="text-xl font-black text-primary italic tracking-tighter">
                  {formatarBRL(precoFinal)}
                </span>
                {desconto > 0 && (
                  <span className="text-[9px] font-black uppercase italic bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    -{Math.round(desconto)}%
                  </span>
                )}
              </div>
            </div>
          </Secao>

          <Secao icone={<ImageIcon className="w-4 h-4" />} titulo="Imagens">
            <div className="space-y-2">
              <label className={rotulo}>Imagem do card (loja)</label>
              <Input
                value={form.image_url}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder="https://... ou /minha-imagem.png"
                className={campo}
              />
            </div>
            <div className="space-y-2">
              <label className={rotulo}>Banner largo</label>
              <Input
                value={form.banner_url}
                onChange={(e) => set("banner_url", e.target.value)}
                placeholder="https://... ou /meu-banner.png"
                className={campo}
              />
              {form.banner_url.trim() !== "" && (
                <div className="mt-2 rounded-2xl overflow-hidden border border-primary/20 bg-black/40">
                  <img
                    src={form.banner_url}
                    alt="Prévia do banner"
                    className="w-full max-h-40 object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </Secao>

          <Secao icone={<Truck className="w-4 h-4" />} titulo="Entrega">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={rotulo}>Tipo de entrega</label>
                <Select
                  value={form.delivery_type}
                  onValueChange={(v) => set("delivery_type", v as TipoEntrega)}
                >
                  <SelectTrigger className={campo}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/20 bg-black/95">
                    <SelectItem value="automatic" className="text-[10px] font-bold uppercase tracking-widest italic">
                      Automática (chave do estoque)
                    </SelectItem>
                    <SelectItem value="manual" className="text-[10px] font-bold uppercase tracking-widest italic">
                      Manual (você entrega)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className={rotulo}>Visível na loja</label>
                <div className="flex items-center gap-3 h-11 px-4 bg-white/5 border border-primary/20 rounded-xl">
                  <Switch
                    checked={form.is_available}
                    onCheckedChange={(v) => set("is_available", v)}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest italic text-muted-foreground">
                    {form.is_available ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </div>

            {form.delivery_type === "automatic" && !editando && (
              <div className="space-y-2">
                <label className={rotulo}>
                  <KeyRound className="w-3 h-3 inline mr-1" />
                  Estoque inicial (1 item por linha)
                </label>
                <Textarea
                  value={form.estoqueInicial}
                  onChange={(e) => set("estoqueInicial", e.target.value)}
                  placeholder={"CHAVE-AAAA-BBBB\nCHAVE-CCCC-DDDD"}
                  className="bg-white/5 border-primary/20 rounded-xl min-h-[120px] text-[11px] font-mono p-4"
                />
                <p className="text-[9px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-70">
                  {chavesIniciais.length} item(ns) serão adicionados
                </p>
              </div>
            )}

            {form.delivery_type === "automatic" && editando && (
              <p className="text-[9px] font-bold uppercase tracking-widest italic text-muted-foreground opacity-70">
                Use o botão de estoque na lista de produtos para gerenciar as chaves.
              </p>
            )}
          </Secao>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onFechar}
            disabled={salvando}
            className="rounded-2xl border-primary/20 hover:bg-white/5 text-[9px] font-black uppercase italic tracking-widest h-11"
          >
            Cancelar
          </Button>
          <Button
            onClick={salvar}
            disabled={salvando}
            className="rounded-2xl bg-primary hover:opacity-90 text-white text-[9px] font-black uppercase italic tracking-widest h-11 px-8 shadow-[0_0_20px_rgba(139,47,232,0.3)]"
          >
            {salvando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editando ? "Salvar Alterações" : "Criar Produto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
