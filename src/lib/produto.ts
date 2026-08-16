export type TipoEntrega = "automatic" | "manual";

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
