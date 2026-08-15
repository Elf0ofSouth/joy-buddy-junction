// ============================================================
// Cipher Project — serviços que substituem as Edge Functions
// do dono anterior (Supabase do SORAX).
//
// Todos exigem uma key válida no header `x-license-key`.
//
//   POST /api/services/optimize-prompt
//   POST /api/services/upload-image
//   POST /api/services/send-prompt
//   POST /api/services/publish-project
//   POST /api/services/remove-watermark
// ============================================================

import { createFileRoute } from "@tanstack/react-router";

import { json, preflight, readBody, requestMeta } from "@/lib/cipher/http";
import type { CipherDb } from "@/lib/cipher/licenses.server";

/* ------------------------------------------------------------
 * Portão de licença
 * Todo serviço pago passa por aqui antes de gastar o seu dinheiro
 * (API de IA, banda de upload…).
 * ---------------------------------------------------------- */
async function requireLicense(request: Request, sb: CipherDb): Promise<Response | null> {
  const key = request.headers.get("x-license-key") ?? "";
  const device = request.headers.get("x-device-id") ?? "";
  if (!key) return json({ error: "no_license", message: "Key não informada." }, 401);

  const { validateLicense } = await import("@/lib/cipher/licenses.server");
  const result = await validateLicense(sb, key, device, requestMeta(request));
  if (!result.valid) return json({ error: result.reason, message: result.message }, 403);
  return null;
}

/* ------------------------------------------------------------
 * 1) Otimizar prompt com IA
 * ---------------------------------------------------------- */
const OPTIMIZE_SYSTEM = `Você é um especialista em engenharia de prompt para o Lovable, uma plataforma de criação de aplicativos web por IA.

Sua tarefa: reescrever o prompt do usuário para que o Lovable gere um resultado melhor.

Regras:
- Responda SEMPRE em português do Brasil.
- Devolva APENAS o prompt reescrito. Sem preâmbulo, sem explicação, sem aspas ao redor, sem bloco de código.
- Deixe explícito o que deve ser construído: telas, componentes, estados, dados e comportamento esperado.
- Especifique stack e padrões quando fizer sentido (React, Tailwind, shadcn/ui, Supabase), pois é o que o Lovable usa.
- Inclua critérios visuais concretos (layout, responsividade, tema claro/escuro) quando o pedido for de interface.
- Preserve a intenção original. Não invente funcionalidades que o usuário não pediu.
- Se o prompt original já estiver bom, faça apenas ajustes pontuais.`;

async function optimizePrompt(request: Request): Promise<Response> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    return json(
      { error: "not_configured", message: "ANTHROPIC_API_KEY não configurada no servidor." },
      501,
    );
  }

  const payload = await readBody(request) as Record<string, unknown>;
  const prompt = String(payload["prompt"] ?? "").trim();
  if (!prompt) return json({ error: "invalid_request", message: "Envie o campo prompt." }, 400);
  if (prompt.length > 20000) {
    return json({ error: "too_long", message: "Prompt muito longo (máx. 20000 caracteres)." }, 413);
  }

  // Chamada via fetch, de propósito: o SDK oficial (@anthropic-ai/sdk)
  // seria mais confortável, mas adicionar uma dependência nova sem poder
  // regenerar o bun.lock arrisca quebrar o build do site em produção.
  // É um único POST — se um dia quiser trocar, rode `bun add
  // @anthropic-ai/sdk` e substitua este bloco por client.messages.create.
  try {
    const resposta = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env["CIPHER_AI_MODEL"] ?? "claude-opus-5",
        max_tokens: 4096,
        // Effort baixo: a tarefa é reescrita, não raciocínio profundo.
        // Manter thinking ligado em effort baixo sai mais barato e mais
        // confiável do que desligar thinking.
        thinking: { type: "adaptive" },
        output_config: { effort: "low" },
        system: OPTIMIZE_SYSTEM,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error("[optimize-prompt]", resposta.status, detalhe.slice(0, 400));
      return json(
        {
          error: "ai_error",
          message:
            resposta.status === 429
              ? "Limite da IA atingido. Tente em alguns segundos."
              : "Falha ao otimizar o prompt.",
        },
        resposta.status === 429 ? 429 : 502,
      );
    }

    const message = (await resposta.json()) as {
      stop_reason?: string;
      content?: Array<{ type: string; text?: string }>;
      usage?: { input_tokens: number; output_tokens: number };
    };

    // Os classificadores podem recusar: vem HTTP 200 com stop_reason
    // "refusal" e content vazio. Checar antes de ler o conteúdo.
    if (message.stop_reason === "refusal") {
      return json({ error: "refused", message: "A IA recusou este prompt. Reformule e tente de novo." }, 422);
    }

    const optimized = (message.content ?? [])
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("")
      .trim();

    if (!optimized) return json({ error: "empty_response", message: "A IA não retornou texto." }, 502);

    return json({
      optimized_prompt: optimized,
      original_prompt: prompt,
      usage: {
        input_tokens: message.usage?.input_tokens ?? 0,
        output_tokens: message.usage?.output_tokens ?? 0,
      },
    });
  } catch (err) {
    console.error("[optimize-prompt]", (err as Error)?.message);
    return json({ error: "ai_error", message: "Falha ao falar com a IA." }, 502);
  }
}

/* ------------------------------------------------------------
 * 2) Upload de imagem (Supabase Storage)
 *
 * Rota de RESERVA: o caminho principal de anexo da extensão já envia
 * direto para o storage do próprio Lovable. Este endpoint só entra
 * quando aquele fluxo falha.
 * ---------------------------------------------------------- */
const BUCKET = "prompt-images";
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 10 * 1024 * 1024;

interface StorageLike {
  storage: {
    from(bucket: string): {
      upload(path: string, body: Uint8Array, opts: { contentType: string; upsert: boolean }):
        Promise<{ error: { message: string } | null }>;
      getPublicUrl(path: string): { data: { publicUrl: string } };
    };
  };
}

async function uploadImage(request: Request, sb: CipherDb): Promise<Response> {
  const payload = await readBody(request) as Record<string, unknown>;
  const contentType = String(payload["content_type"] ?? "image/png").toLowerCase();
  if (!TIPOS_PERMITIDOS.includes(contentType)) {
    return json({ error: "invalid_type", message: `Tipo não permitido: ${contentType}` }, 415);
  }

  const b64 = String(payload["data_base64"] ?? payload["base64"] ?? "");
  if (!b64) return json({ error: "invalid_request", message: "Envie data_base64." }, 400);

  let bytes: Uint8Array;
  try {
    bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  } catch {
    return json({ error: "invalid_base64", message: "Base64 inválido." }, 400);
  }
  if (!bytes.length) return json({ error: "invalid_base64", message: "Base64 vazio." }, 400);
  if (bytes.length > MAX_BYTES) return json({ error: "too_large", message: "Imagem acima de 10 MB." }, 413);

  const ext = (contentType.split("/")[1] ?? "png").replace("jpeg", "jpg");
  const objectKey = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

  const storage = (sb as unknown as StorageLike).storage.from(BUCKET);
  const { error } = await storage.upload(objectKey, bytes, { contentType, upsert: false });

  if (error) {
    console.error("[upload-image]", error.message);
    return json(
      {
        error: "upload_failed",
        message: `Falha no upload. Confira se o bucket "${BUCKET}" existe e é público.`,
      },
      502,
    );
  }

  const { data } = storage.getPublicUrl(objectKey);
  return json({ url: data.publicUrl, key: objectKey, size: bytes.length });
}

/* ------------------------------------------------------------
 * 3) Proxies do Lovable
 *
 * Repassam a chamada para a API do Lovable usando o token do PRÓPRIO
 * cliente. Os caminhos eram código privado do dono anterior; foram
 * descobertos sondando a API e comparando o código de resposta com um
 * token inválido:
 *
 *   401 Invalid token  -> o caminho existe e aceita esse método
 *   405                -> o caminho existe, mas não com esse método
 *   404 page not found -> o caminho não existe
 *
 * Resultado da sondagem:
 *   /projects/{id}/chat         401  <- envio de prompt (confirmado)
 *   /projects/{id}/deployments  401  <- publicar (confirmado)
 *   /projects/{id}/messages     405  <- era o chute antigo; existe mas não aceita POST
 *   /projects/{id}/publish      404
 * ---------------------------------------------------------- */
const LOVABLE_API = "https://api.lovable.dev";

type RouteBuilder = ((projectId: string) => string) | null;

const LOVABLE_ROUTES: Record<string, RouteBuilder> = {
  "send-prompt": (projectId) => `${LOVABLE_API}/projects/${projectId}/chat`,
  "publish-project": (projectId) => `${LOVABLE_API}/projects/${projectId}/deployments`,

  // Marca d'água: continua desligado de propósito.
  //
  // A sondagem descartou /settings, /badge, /watermark, /remove-badge e
  // /branding (todos 404). O caminho provável é PUT /projects/{id}, que
  // respondeu 401 — mas esse endpoint ALTERA o projeto, e eu não sei o
  // nome do campo. Mandar um corpo errado ali pode bagunçar o projeto do
  // seu cliente, então prefiro devolver 501 com mensagem clara.
  //
  // Para ligar: no lovable.dev, F12 -> Network, desative a marca d'água
  // pela interface nativa, copie o corpo exato da requisição e escreva
  // um proxy específico para ela (o genérico abaixo só faz POST).
  "remove-watermark": null,
};

async function lovableProxy(request: Request, routeName: string): Promise<Response> {
  const route = LOVABLE_ROUTES[routeName];
  if (!route) {
    return json(
      {
        success: false,
        error: "not_configured",
        error_display:
          "Este recurso ainda não foi ligado ao seu backend. Veja LOVABLE_ROUTES em src/routes/api/services/$action.ts.",
      },
      501,
    );
  }

  const payload = await readBody(request) as Record<string, unknown>;
  const token = String(payload["token"] ?? payload["token_lovable"] ?? "").replace(/^Bearer\s+/i, "");
  const projectId = String(payload["projectId"] ?? payload["project_id"] ?? "");
  if (!token || !projectId) {
    return json(
      { success: false, error: "invalid_request", error_display: "Projeto não sincronizado." },
      400,
    );
  }

  // Nunca repassamos a key nem o token adiante no corpo.
  const { license_key: _k, token: _t, token_lovable: _tl, ...resto } = payload;

  try {
    const upstream = await fetch(route(projectId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(resto),
    });

    const text = await upstream.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      data = { raw: text };
    }

    if (upstream.status === 401 || upstream.status === 403) {
      return json(
        {
          success: false,
          error: "lovable_auth",
          error_display: "Sessão do Lovable expirou. Recarregue a página.",
        },
        upstream.status,
      );
    }
    if (!upstream.ok) {
      return json(
        {
          success: false,
          error: "lovable_error",
          status: upstream.status,
          error_display: (data["message"] as string) ?? `Lovable retornou ${upstream.status}`,
          data,
        },
        502,
      );
    }

    return json({ success: true, ...data });
  } catch (err) {
    console.error(`[lovable:${routeName}]`, (err as Error)?.message);
    return json(
      { success: false, error: "network", error_display: "Falha de rede ao falar com o Lovable." },
      502,
    );
  }
}

/* ------------------------------------------------------------
 * Roteador
 * ---------------------------------------------------------- */
export const Route = createFileRoute("/api/services/$action")({
  server: {
    handlers: {
      OPTIONS: () => preflight(),

      POST: async ({ request, params }) => {
        const action = params.action;

        try {
          // Import dinâmico: client.server.ts carrega a SERVICE ROLE KEY.
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const sb = supabaseAdmin as unknown as CipherDb;

          const negado = await requireLicense(request, sb);
          if (negado) return negado;

          if (action === "optimize-prompt") return await optimizePrompt(request);
          if (action === "upload-image") return await uploadImage(request, sb);
          if (action in LOVABLE_ROUTES) return await lovableProxy(request, action);

          return json({ error: "not_found", message: `Serviço desconhecido: ${action}` }, 404);
        } catch (err) {
          console.error("[cipher/services]", err);
          return json({ error: "server_error", message: "Erro interno no servidor." }, 500);
        }
      },
    },
  },
});
