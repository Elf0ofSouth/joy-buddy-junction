// ============================================================
// Cipher Project — helpers de HTTP para as server routes
//
// Sem segredos aqui: pode ser importado no topo de um route file.
// ============================================================

/**
 * A extensão roda dentro de qualquer página (o content script vive no
 * lovable.dev), então o CORS precisa ser aberto.
 *
 * Isso é seguro porque nenhuma rota da API depende de cookie de sessão:
 * quem autentica é a key da licença ou o token de admin, ambos enviados
 * explicitamente. Um site malicioso não ganha nada chamando a API sem
 * possuir uma key válida.
 */
export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-license-key, x-device-id",
  "Access-Control-Max-Age": "86400",
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
  });
}

export function preflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const parsed: unknown = await request.json();
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function requestMeta(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  return {
    ip: (forwarded.split(",")[0] || "").trim() || null,
    country: request.headers.get("x-vercel-ip-country") ?? null,
    userAgent: request.headers.get("user-agent") ?? null,
  };
}

/** Comparação em tempo constante — evita descobrir o token por cronometragem. */
export function safeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

export function isAdmin(request: Request): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const expected = process.env["CIPHER_ADMIN_TOKEN"] ?? "";
  if (!expected) return false;
  return safeEqual(token, expected);
}
