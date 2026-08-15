// ============================================================
// Cipher Project — API do painel de revenda
//
// Tudo aqui exige:  Authorization: Bearer <CIPHER_ADMIN_TOKEN>
//
//   POST   /api/admin/keys/generate
//   GET    /api/admin/keys?status=&plan=&q=&limit=&offset=
//   GET    /api/admin/keys/:id
//   DELETE /api/admin/keys/:id
//   POST   /api/admin/keys/:id/revoke
//   POST   /api/admin/keys/:id/unrevoke
//   POST   /api/admin/keys/:id/reset-devices
//   POST   /api/admin/keys/:id/extend        { days } ou { seconds }
//   GET    /api/admin/stats
//   GET    /api/admin/events
//   GET|POST /api/admin/packages
// ============================================================

import { createFileRoute } from "@tanstack/react-router";

import { isAdmin, json, preflight, readBody } from "@/lib/cipher/http";
import type { CipherDb, LicenseRow } from "@/lib/cipher/licenses.server";

async function loadDeps() {
  // Import dinâmico: client.server.ts carrega a SERVICE ROLE KEY.
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const lic = await import("@/lib/cipher/licenses.server");
  return { sb: supabaseAdmin as unknown as CipherDb, lic };
}

async function handle(request: Request, splat: string): Promise<Response> {
  if (!isAdmin(request)) {
    return json({ error: "unauthorized", message: "Token de admin inválido ou ausente." }, 401);
  }

  const route = (splat ?? "").replace(/^\/+|\/+$/g, "");
  const method = request.method;
  const url = new URL(request.url);
  const { sb, lic } = await loadDeps();
  const { PLANS, T, generateKey, logEvent } = lic;

  // ---------------- Gerar keys em lote ----------------
  if (route === "keys/generate" && method === "POST") {
    const b = await readBody(request) as Record<string, unknown>;
    const plan = String(b["plan"] ?? "");
    if (!PLANS[plan]) {
      return json(
        { error: "invalid_plan", message: `Plano desconhecido: ${plan}`, plans: Object.keys(PLANS) },
        400,
      );
    }

    const quantity = Math.min(Math.max(parseInt(String(b["quantity"] ?? "1"), 10) || 1, 1), 500);
    const def = PLANS[plan];
    const maxDevices = Math.min(
      Math.max(parseInt(String(b["max_devices"] ?? ""), 10) || (def?.maxDevices ?? 1), 1),
      10,
    );
    const batch = String(b["batch"] || `lote-${new Date().toISOString().slice(0, 10)}`).slice(0, 64);
    const note = b["note"] ? String(b["note"]).slice(0, 256) : null;
    const userName = b["user_name"] ? String(b["user_name"]).slice(0, 120) : null;

    const rows = Array.from({ length: quantity }, () => ({
      license_key: generateKey(plan),
      plan,
      duration_seconds: def.seconds,
      status: "unused",
      max_devices: maxDevices,
      user_name: userName,
      note,
      batch,
    }));

    const { data, error } = await sb
      .from<{ license_key: string }>(T.licenses)
      .insert(rows)
      .select("license_key");
    if (error) throw new Error(error.message);

    const criadas = (data ?? []) as unknown as Array<{ license_key: string }>;
    await logEvent(sb, "generate", null, null, `${criadas.length}x ${plan} (lote ${batch})`, null);

    return json({
      ok: true,
      plan,
      plan_label: def.label,
      quantity: criadas.length,
      batch,
      keys: criadas.map((r) => r.license_key),
    });
  }

  // ---------------- Listar keys ----------------
  if (route === "keys" && method === "GET") {
    const status = url.searchParams.get("status");
    const plan = url.searchParams.get("plan");
    const q = url.searchParams.get("q");
    const batch = url.searchParams.get("batch");
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "", 10) || 100, 500);
    const offset = parseInt(url.searchParams.get("offset") ?? "", 10) || 0;

    let query = sb.from<LicenseRow[]>(T.licenses).select("*", { count: "exact" });
    if (status) query = query.eq("status", status);
    if (plan) query = query.eq("plan", plan);
    if (batch) query = query.eq("batch", batch);
    if (q) {
      const like = `%${q}%`;
      query = query.or(`license_key.ilike.${like},user_name.ilike.${like},note.ilike.${like}`);
    }

    const { data, count, error } = await query
      .order("id", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw new Error(error.message);

    const keys = (data ?? []) as unknown as LicenseRow[];

    // Conta os dispositivos de todas as keys numa consulta só.
    const contagem: Record<number, number> = {};
    if (keys.length) {
      const { data: devs } = await sb
        .from<Array<{ license_id: number }>>(T.devices)
        .select("license_id")
        .in("license_id", keys.map((r) => r.id));
      for (const d of (devs ?? []) as unknown as Array<{ license_id: number }>) {
        contagem[d.license_id] = (contagem[d.license_id] ?? 0) + 1;
      }
    }

    return json({
      ok: true,
      total: count ?? 0,
      limit,
      offset,
      keys: keys.map((r) => ({ ...r, device_count: contagem[r.id] ?? 0 })),
    });
  }

  // ---------------- Ações sobre uma key ----------------
  const keyMatch = route.match(/^keys\/(\d+)(?:\/([a-z-]+))?$/);
  if (keyMatch) {
    const id = Number(keyMatch[1]);
    const action = keyMatch[2] ?? "";

    const { data: row } = await sb.from<LicenseRow>(T.licenses).select("*").eq("id", id).maybeSingle();
    if (!row) return json({ error: "not_found", message: "Key não encontrada." }, 404);

    if (!action && method === "GET") {
      const { data: devices } = await sb
        .from(T.devices)
        .select("*")
        .eq("license_id", id)
        .order("last_seen_at", { ascending: false });
      const { data: events } = await sb
        .from(T.events)
        .select("*")
        .eq("license_id", id)
        .order("id", { ascending: false })
        .limit(50);
      return json({ ok: true, key: row, devices: devices ?? [], events: events ?? [] });
    }

    if (!action && method === "DELETE") {
      // license_devices tem ON DELETE CASCADE, some junto.
      const { error } = await sb.from(T.licenses).delete().eq("id", id);
      if (error) throw new Error(error.message);
      return json({ ok: true, deleted: id });
    }

    if (action === "revoke" && method === "POST") {
      await sb.from(T.licenses).update({ status: "revoked" }).eq("id", id);
      await logEvent(sb, "revoke", id, null, "revogada pelo painel", null);
      // O heartbeat da extensão derruba a sessão em até ~60s.
      return json({ ok: true, id, status: "revoked" });
    }

    if (action === "unrevoke" && method === "POST") {
      const back = row.activated_at ? "active" : "unused";
      await sb.from(T.licenses).update({ status: back }).eq("id", id);
      return json({ ok: true, id, status: back });
    }

    // Libera a key para um dispositivo novo (cliente trocou de PC).
    if (action === "reset-devices" && method === "POST") {
      await sb.from(T.devices).delete().eq("license_id", id);
      await logEvent(sb, "reset_device", id, null, "dispositivos liberados pelo painel", null);
      return json({ ok: true, id, devices_cleared: true });
    }

    // Estende a validade. Aceita { days } ou { seconds }.
    if (action === "extend" && method === "POST") {
      const b = await readBody(request) as Record<string, unknown>;
      const seconds =
        parseInt(String(b["seconds"] ?? ""), 10) || (parseFloat(String(b["days"] ?? "")) || 0) * 86400;
      if (!seconds) {
        return json({ error: "invalid_request", message: "Informe days ou seconds." }, 400);
      }
      const base =
        row.expires_at && new Date(row.expires_at) > new Date() ? new Date(row.expires_at) : new Date();
      const next = new Date(base.getTime() + seconds * 1000).toISOString();
      await sb.from(T.licenses).update({ expires_at: next, status: "active" }).eq("id", id);
      return json({ ok: true, id, expires_at: next });
    }
  }

  // ---------------- Estatísticas ----------------
  if (route === "stats" && method === "GET") {
    const { data, error } = await sb.from(T.licenses).select("status, plan");
    // Checar o erro aqui não é detalhe: é a primeira chamada que o painel
    // faz ao entrar. Se engolir o erro, o painel abre mostrando "0 keys" e
    // o problema real (tabela faltando, por exemplo) só aparece depois, na
    // hora de gerar uma key — com uma mensagem genérica.
    if (error) throw new Error(error.message);
    const all = (data ?? []) as unknown as Array<{ status: string; plan: string }>;

    const byStatus: Record<string, number> = {};
    const byPlan: Record<string, number> = {};
    for (const r of all) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
      byPlan[r.plan] = (byPlan[r.plan] ?? 0) + 1;
    }

    const fiveMin = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentes } = await sb
      .from(T.devices)
      .select("license_id")
      .gte("last_seen_at", fiveMin);
    const online = new Set(
      ((recentes ?? []) as unknown as Array<{ license_id: number }>).map((d) => d.license_id),
    ).size;

    return json({
      ok: true,
      total: all.length,
      online_now: online,
      by_status: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
      by_plan: Object.entries(byPlan).map(([plan, count]) => ({ plan, count })),
      plans: Object.entries(PLANS).map(([id, p]) => ({ id, ...p })),
    });
  }

  // ---------------- Eventos recentes ----------------
  if (route === "events" && method === "GET") {
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "", 10) || 100, 500);
    const { data } = await sb.from(T.events).select("*").order("id", { ascending: false }).limit(limit);
    const events = (data ?? []) as unknown as Array<Record<string, unknown> & { license_id: number | null }>;

    const ids = [...new Set(events.map((e) => e.license_id).filter((v): v is number => v != null))];
    const chaves: Record<number, string> = {};
    if (ids.length) {
      const { data: lics } = await sb.from(T.licenses).select("id, license_key").in("id", ids);
      for (const l of (lics ?? []) as unknown as Array<{ id: number; license_key: string }>) {
        chaves[l.id] = l.license_key;
      }
    }

    return json({
      ok: true,
      events: events.map((e) => ({
        ...e,
        license_key: e.license_id != null ? (chaves[e.license_id] ?? null) : null,
      })),
    });
  }

  // ---------------- Planos exibidos na extensão ----------------
  if (route === "packages") {
    if (method === "GET") {
      const { data } = await sb.from(T.packages).select("*").order("sort_order", { ascending: true });
      return json({ ok: true, packages: data ?? [] });
    }
    if (method === "POST") {
      const b = await readBody(request) as Record<string, unknown>;
      if (!b["id"] || !b["name"] || !b["plan"]) {
        return json({ error: "invalid_request", message: "id, name e plan são obrigatórios." }, 400);
      }
      const { error } = await sb.from(T.packages).upsert(
        {
          id: String(b["id"]),
          name: String(b["name"]),
          description: b["description"] ? String(b["description"]) : null,
          price: Number(b["price"]) || 0,
          currency: String(b["currency"] ?? "BRL"),
          plan: String(b["plan"]),
          checkout_url: b["checkout_url"] ? String(b["checkout_url"]) : null,
          is_active: b["is_active"] !== false,
          sort_order: parseInt(String(b["sort_order"] ?? "0"), 10) || 0,
        },
        { onConflict: "id" },
      );
      if (error) throw new Error(error.message);
      return json({ ok: true, id: b["id"] });
    }
  }

  return json({ error: "not_found", message: `Rota admin desconhecida: ${method} /${route}` }, 404);
}

async function safeHandle(request: Request, splat: string): Promise<Response> {
  try {
    return await handle(request, splat);
  } catch (err) {
    const detalhe = (err as Error)?.message ?? String(err);
    console.error("[cipher/admin]", err);

    // Esta rota já exige o token de admin, então mostrar a causa real aqui
    // não vaza nada para terceiros — e evita ficar caçando log na Vercel.
    let message = `Erro interno no painel: ${detalhe}`;

    // A causa mais provável na primeira vez que se usa o painel.
    if (/Could not find the table|does not exist|schema cache/i.test(detalhe)) {
      message =
        "As tabelas de licença ainda não existem no Supabase. " +
        "Rode a migration supabase/migrations/20260815000000_cipher_licensing.sql " +
        "no SQL Editor do Supabase e tente de novo.";
    }

    return json({ error: "server_error", message }, 500);
  }
}

export const Route = createFileRoute("/api/admin/$")({
  server: {
    handlers: {
      OPTIONS: () => preflight(),
      GET: ({ request, params }) => safeHandle(request, params._splat ?? ""),
      POST: ({ request, params }) => safeHandle(request, params._splat ?? ""),
      DELETE: ({ request, params }) => safeHandle(request, params._splat ?? ""),
    },
  },
});
