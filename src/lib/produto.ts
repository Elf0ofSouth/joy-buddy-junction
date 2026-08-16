export type TipoEntrega = "automatic" | "manual";

/**
 * Fonte unica das categorias. A loja montava esse rotulo a partir de uma lista
 * fixa e consultava o banco com `.toUpperCase()`, enquanto o admin gravava
 * texto livre -- nenhuma aba de categoria batia com o que estava gravado.
 */
export const CATEGORIAS = [
  { id: "discord", label: "Cargos Discord" },
  { id: "streaming", label: "Streaming" },
  { id: "extensions", label: "Extensões" },
  { id: "tools", label: "Ferramentas" },
  { id: "others", label: "Outros" },
] as const;

export function rotuloCategoria(id: string | null | undefined): string {
  if (!id) return "Geral";
  const achada = CATEGORIAS.find((c) => c.id.toLowerCase() === id.toLowerCase());
  return achada ? achada.label : id;
}

/** Preco final apos aplicar o desconto percentual, arredondado para centavos. */
export function precoComDesconto(precoBrl: number, descontoPercent: number): number {
  const preco = Number(precoBrl) || 0;
  const desconto = Math.min(Math.max(Number(descontoPercent) || 0, 0), 100);
  return Math.round(preco * (1 - desconto / 100) * 100) / 100;
}

export function formatarBRL(valor: number): string {
  return (Number(valor) || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function rotuloEntrega(tipo: string | null | undefined): string {
  return tipo === "automatic" ? "Automática" : "Manual";
}
