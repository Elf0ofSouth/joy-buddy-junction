import { supabase } from "@/integrations/supabase/client";

/**
 * Pedido com produto e cliente ja resolvidos.
 *
 * O formato imita o de um join embutido do PostgREST (`products(name)`) para
 * que as telas nao precisem mudar. A diferenca e que o cruzamento acontece
 * aqui, no cliente: o join do PostgREST exige uma foreign key declarada entre
 * as tabelas, e este banco nao tem as FKs que as migrations do repositorio
 * supunham. Buscando em separado, funciona com ou sem elas.
 */
export type PedidoEnriquecido = {
  id: string;
  amount: number;
  status: string | null;
  created_at: string | null;
  user_id: string | null;
  product_id: string | null;
  user_profiles: {
    username: string | null;
    avatar_url: string | null;
    discord_id: string | null;
  } | null;
  products: { name: string | null; price: number | null } | null;
};

export async function buscarPedidos(opcoes?: {
  status?: string;
  userId?: string;
  limite?: number;
}): Promise<{ pedidos: PedidoEnriquecido[]; erro: string | null }> {
  let consulta = supabase
    .from("orders")
    .select("id, amount, status, created_at, user_id, product_id")
    .order("created_at", { ascending: false });

  if (opcoes?.status && opcoes.status !== "all") consulta = consulta.eq("status", opcoes.status);
  if (opcoes?.userId) consulta = consulta.eq("user_id", opcoes.userId);
  if (opcoes?.limite) consulta = consulta.limit(opcoes.limite);

  const [pedidosRes, produtosRes, perfisRes] = await Promise.all([
    consulta,
    supabase.from("products").select("id, name, price"),
    supabase.from("user_profiles").select("id, username, avatar_url, discord_id"),
  ]);

  if (pedidosRes.error) {
    return { pedidos: [], erro: pedidosRes.error.message };
  }

  const produtos = new Map((produtosRes.data ?? []).map((p) => [p.id, p]));
  const perfis = new Map((perfisRes.data ?? []).map((u) => [u.id, u]));

  const pedidos = (pedidosRes.data ?? []).map((o) => {
    const produto = o.product_id ? produtos.get(o.product_id) : undefined;
    const perfil = o.user_id ? perfis.get(o.user_id) : undefined;
    return {
      ...o,
      products: produto ? { name: produto.name, price: produto.price } : null,
      user_profiles: perfil
        ? {
            username: perfil.username,
            avatar_url: perfil.avatar_url,
            discord_id: perfil.discord_id,
          }
        : null,
    };
  });

  return { pedidos, erro: null };
}
