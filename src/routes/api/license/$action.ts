// ============================================================
// Cipher Project — rotas públicas de licença
//
//   POST /api/license/validate    ativa / valida uma key
//   POST /api/license/heartbeat   revalidação a cada 60s
//   GET  /api/license/packages    planos à venda
//   GET  /api/license/plans       catálogo de durações
//   GET  /api/license/health      teste rápido de que a API subiu
// ============================================================

import { createFileRoute } from "@tanstack/react-router";

import { json, preflight, readBody, requestMeta } from "@/lib/cipher/http";

// Roda a limpeza de expiradas de vez em quando, sem precisar de cron.
let ultimaLimpeza = 0;
const INTERVALO_LIMPEZA = 30 * 60 * 1000; // 30 min

export const Route = createFileRoute("/api/license/$action")({
  server: {
    handlers: {
      OPTIONS: () => preflight(),

      GET: async ({ params }) => {
        const action = params.action;

        if (action === "health") {
          return json({ ok: true, service: "Cipher Project", time: new Date().toISOString() });
        }

        // Import dinâmico: client.server.ts carrega a SERVICE ROLE KEY.
        // Um import no topo faria este módulo entrar no bundle do cliente.
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { PLANS } = await import("@/lib/cipher/licenses.server");
        const sb = supabaseAdmin as unknown as import("@/lib/cipher/licenses.server").CipherDb;

        try {
          if (action === "packages") {
            const { data, error } = await sb
              .from("license_packages")
              .select("id, name, description, price, currency, plan, checkout_url, sort_order")
              .eq("is_active", true)
              .order("sort_order", { ascending: true });
            if (error) throw new Error(error.message);
            return json(data ?? []);
          }

          if (action === "plans") {
            return json(
              Object.entries(PLANS).map(([id, p]) => {
                const plan = p as any;
                return {
                  id,
                  label: plan?.label ?? "Desconhecido",
                  seconds: plan?.seconds ?? 0,
                  max_devices: plan?.maxDevices ?? 1,
                };
              }),
            );
          }

          return json({ error: "not_found", message: `Rota desconhecida: GET /api/license/${action}` }, 404);
        } catch (err) {
          console.error("[cipher/license]", err);
          return json({ error: "server_error", message: "Erro interno no servidor de licenças." }, 500);
        }
      },

      POST: async ({ request, params }) => {
        const action = params.action;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { validateLicense } = await import("@/lib/cipher/licenses.server");
        const sb = supabaseAdmin as unknown as import("@/lib/cipher/licenses.server").CipherDb;

        try {
          if (action !== "validate" && action !== "heartbeat") {
            return json({ error: "not_found", message: `Rota desconhecida: POST /api/license/${action}` }, 404);
          }

          const body = await readBody(request) as Record<string, unknown>;
          const result = await validateLicense(
            sb,
            body["license_key"] ?? body["key"],
            body["device_id"] ?? body["deviceId"],
            requestMeta(request),
          );

          if (action === "validate") {
            // Limpeza oportunista de keys vencidas, sem bloquear a resposta.
            //
            // O try/catch aqui não é decorativo: `sb` é um Proxy, e o acesso
            // a `.rpc` estoura de forma SÍNCRONA quando falta variável de
            // ambiente — antes do Promise.resolve, então um `.catch()`
            // sozinho não pega. Sem isso, uma tarefa de manutenção derruba
            // uma validação que deveria ter dado certo.
            if (Date.now() - ultimaLimpeza > INTERVALO_LIMPEZA) {
              ultimaLimpeza = Date.now();
              try {
                void Promise.resolve(sb.rpc("cipher_expire_old_licenses")).catch(() => {});
              } catch {
                // manutenção é best-effort; nunca afeta o cliente
              }
            }
            // Sempre 200: a extensão lê o campo `valid`, não o status HTTP.
            return json(result);
          }

          // Heartbeat devolve só o necessário para a UI e o contador.
          return json({
            valid: result.valid,
            reason: result.reason,
            message: result.message,
            status: result.status,
            expires_at: result.expires_at,
            activated_at: result.activated_at,
            lifetime: result.lifetime,
            license_type: result.license_type,
            seconds_remaining: result.seconds_remaining,
            online_count: result.online_count,
            plan: result.plan,
            plan_label: result.plan_label,
            server_time: result.server_time,
          });
        } catch (err) {
          console.error("[cipher/license]", err);
          return json({ error: "server_error", message: "Erro interno no servidor de licenças." }, 500);
        }
      },
    },
  },
});
