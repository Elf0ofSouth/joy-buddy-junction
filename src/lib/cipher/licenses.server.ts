// ============================================================
// Cipher Project — núcleo de licenciamento
//
// Geração de keys, validação, expiração e vínculo de dispositivo.
//
// Este arquivo é `.server.ts`: nunca entra no bundle do navegador.
// Ele recebe o cliente Supabase por parâmetro (em vez de importar o
// supabaseAdmin no topo), o que mantém o módulo testável sem banco.
// ============================================================

/* ---------- Tipos mínimos do client Supabase ---------- */
// As tabelas de licença não existem no `Database` gerado em
// integrations/supabase/types.ts (aquele arquivo é regerado pelo Lovable),
// então tipamos aqui só o que realmente usamos. Assim o build não quebra
// quando o types.ts for regerado.

export interface PgError {
  message: string;
  code?: string;
}

export interface PgResult<T> {
  data: T | null;
  error: PgError | null;
  count?: number | null;
}

export interface PgBuilder<T> extends PromiseLike<PgResult<T>> {
  select(cols?: string, opts?: { count?: "exact"; head?: boolean }): PgBuilder<T>;
  insert(values: unknown): PgBuilder<T>;
  update(values: unknown): PgBuilder<T>;
  upsert(values: unknown, opts?: { onConflict?: string }): PgBuilder<T>;
  delete(): PgBuilder<T>;
  eq(column: string, value: unknown): PgBuilder<T>;
  gte(column: string, value: unknown): PgBuilder<T>;
  in(column: string, values: unknown[]): PgBuilder<T>;
  or(filter: string): PgBuilder<T>;
  order(column: string, opts?: { ascending?: boolean }): PgBuilder<T>;
  limit(n: number): PgBuilder<T>;
  range(from: number, to: number): PgBuilder<T>;
  maybeSingle(): PgBuilder<T>;
}

export interface CipherDb {
  from<T = Record<string, unknown>>(table: string): PgBuilder<T>;
  rpc(fn: string, args?: Record<string, unknown>): PromiseLike<PgResult<unknown>>;
}

export interface LicenseRow {
  id: number;
  license_key: string;
  plan: string;
  duration_seconds: number;
  status: string;
  max_devices: number;
  user_name: string | null;
  note: string | null;
  batch: string | null;
  created_at: string;
  activated_at: string | null;
  expires_at: string | null;
  last_seen_at: string | null;
  validate_count: number;
}

export interface PlanDef {
  tag: string;
  seconds: number;
  label: string;
  maxDevices: number;
}

export interface ValidationResult {
  valid: boolean;
  reason: string | null;
  message: string;
  expires_at: string | null;
  activated_at: string | null;
  status: string;
  license_type: string;
  lifetime: boolean;
  session_id: string | null;
  user_name: string | null;
  online_count: number;
  plan: string | null;
  plan_label: string | null;
  seconds_remaining: number;
  server_time: string;
}

export interface RequestMeta {
  ip?: string | null;
  country?: string | null;
  userAgent?: string | null;
}

/* ---------- Nomes das tabelas ---------- */
// Prefixadas com `license_` para não se confundirem com products /
// orders / user_profiles, que são da loja do Discord.
export const T = {
  licenses: "licenses",
  devices: "license_devices",
  trials: "license_trial_claims",
  events: "license_events",
  packages: "license_packages",
} as const;

/* ---------- Planos ---------- */
/**
 * `seconds: 0` significa vitalícia.
 *
 * A contagem SEMPRE começa na primeira validação da key (activated_at),
 * nunca quando a key foi gerada. Assim dá para gerar um lote hoje e
 * vender daqui a três meses sem o cliente perder tempo.
 */
export const PLANS: Record<string, PlanDef> = {
  trial15: { tag: "TRL", seconds: 15 * 60, label: "Teste 15 minutos", maxDevices: 1 },
  daily: { tag: "DAY", seconds: 24 * 3600, label: "Diária", maxDevices: 1 },
  weekly: { tag: "WEK", seconds: 7 * 24 * 3600, label: "Semanal", maxDevices: 1 },
  monthly: { tag: "MTH", seconds: 30 * 24 * 3600, label: "Mensal", maxDevices: 2 },
  yearly: { tag: "YER", seconds: 365 * 24 * 3600, label: "Anual", maxDevices: 2 },
  lifetime: { tag: "LIF", seconds: 0, label: "Vitalícia", maxDevices: 2 },
};

export const MESSAGES: Record<string, string> = {
  ok: "Key válida. Bem-vindo ao Cipher Project.",
  not_found: "Key inválida. Confira o código e tente novamente.",
  revoked: "Esta key foi revogada. Fale com o suporte.",
  expired: "Esta key expirou. Renove para continuar usando.",
  device_conflict: "Esta key já está em uso em outro dispositivo.",
  trial_used: "Este dispositivo já usou o teste gratuito. Escolha um plano para continuar.",
  empty: "Digite uma key para continuar.",
  error: "Erro ao falar com o servidor de licenças.",
};

/* ---------- Geração de key ---------- */
// Alfabeto sem caracteres ambíguos (0/O, 1/I/L) — reduz erro de
// digitação quando o cliente copia a key à mão para o suporte.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function randomBlock(len: number): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < len; i++) {
    const char = ALPHABET[bytes[i] % ALPHABET.length];
    out += char ?? "";
  }
  return out;
}

/** Ex.: CPHR-MTH-K7F2Q-9XA3B-8DNW1 */
export function generateKey(plan: string): string {
  const def = PLANS[plan] ?? PLANS["monthly"];
  const tag = def?.tag ?? "CPHR";
  return `CPHR-${tag}-${randomBlock(5)}-${randomBlock(5)}-${randomBlock(5)}`;
}

export function normalizeKey(raw: unknown): string {
  return String(raw ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

export function nowIso(): string {
  return new Date().toISOString();
}

function addSeconds(iso: string, seconds: number): string {
  return new Date(new Date(iso).getTime() + seconds * 1000).toISOString();
}

/** session_id estável e opaco, derivado da key + dispositivo. */
async function makeSessionId(key: string, deviceId: string): Promise<string> {
  const data = new TextEncoder().encode(`${key}::${deviceId || "nodevice"}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `cph_${hex.slice(0, 24)}`;
}

function invalid(reason: string, message?: string): ValidationResult {
  const msg = message ?? MESSAGES[reason] ?? MESSAGES["not_found"];
  return {
    valid: false,
    reason,
    message: msg ?? "",
    expires_at: null,
    activated_at: null,
    status: reason,
    license_type: "paid",
    lifetime: false,
    session_id: null,
    user_name: null,
    online_count: 0,
    plan: null,
    plan_label: null,
    seconds_remaining: 0,
    server_time: nowIso(),
  };
}

export async function logEvent(
  sb: CipherDb,
  kind: string,
  licenseId?: number | null,
  deviceId?: string | null,
  detail?: string | null,
  ip?: string | null,
): Promise<void> {
  try {
    await sb.from(T.events).insert({
      kind,
      license_id: licenseId ?? null,
      device_id: deviceId ?? null,
      detail: detail ?? null,
      ip: ip ?? null,
    });
  } catch {
    // O log nunca pode derrubar a validação.
  }
}

/**
 * Valida uma key e, se for a primeira vez, ativa (inicia a contagem)
 * e vincula ao dispositivo.
 */
export async function validateLicense(
  sb: CipherDb,
  rawKey: unknown,
  deviceId: unknown,
  meta: RequestMeta = {},
): Promise<ValidationResult> {
  const key = normalizeKey(rawKey);
  if (!key) return invalid("not_found", MESSAGES["empty"]);

  const device = String(deviceId ?? "").trim().slice(0, 128) || "unknown";
  const now = nowIso();

  const { data: row, error } = await sb
    .from<LicenseRow>(T.licenses)
    .select("*")
    .eq("license_key", key)
    .maybeSingle();

  if (error) throw new Error(`Falha ao consultar licença: ${error.message}`);

  if (!row) {
    await logEvent(sb, "reject", null, device, `key inexistente: ${key.slice(0, 16)}`, meta.ip);
    return invalid("not_found");
  }
  if (row.status === "revoked") {
    await logEvent(sb, "reject", row.id, device, "revogada", meta.ip);
    return invalid("revoked");
  }

  const planDef: PlanDef = PLANS[row.plan] ?? {
    tag: "???",
    seconds: row.duration_seconds,
    label: row.plan,
    maxDevices: row.max_devices,
  };
  const isLifetime = Number(row.duration_seconds) === 0;

  let activatedAt = row.activated_at;
  let expiresAt = row.expires_at;
  let status = row.status;

  // ----- Primeira ativação: o relógio começa a contar agora -----
  if (status === "unused") {
    // Trial é uma vez por dispositivo, para sempre.
    if (row.plan === "trial15") {
      const { data: claimed } = await sb
        .from<{ device_id: string }>(T.trials)
        .select("device_id")
        .eq("device_id", device)
        .maybeSingle();

      if (claimed) {
        await logEvent(sb, "reject", row.id, device, "trial já usado neste dispositivo", meta.ip);
        return invalid("trial_used");
      }

      await sb
        .from(T.trials)
        .upsert({ device_id: device, license_id: row.id, claimed_at: now }, { onConflict: "device_id" });
    }

    activatedAt = now;
    expiresAt = isLifetime ? null : addSeconds(now, Number(row.duration_seconds));
    status = "active";

    await sb
      .from(T.licenses)
      .update({ status, activated_at: activatedAt, expires_at: expiresAt })
      .eq("id", row.id);

    await logEvent(sb, "activate", row.id, device, `plano ${row.plan}`, meta.ip);
  }

  // ----- Expiração -----
  if (!isLifetime && expiresAt && new Date(expiresAt).getTime() <= Date.now()) {
    if (status !== "expired") {
      await sb.from(T.licenses).update({ status: "expired" }).eq("id", row.id);
      await logEvent(sb, "expire", row.id, device, null, meta.ip);
    }
    return invalid("expired");
  }

  // ----- Vínculo de dispositivo -----
  const limit = Number(row.max_devices || planDef.maxDevices || 1);

  const { data: known } = await sb
    .from<{ id: number }>(T.devices)
    .select("id")
    .eq("license_id", row.id)
    .eq("device_id", device)
    .maybeSingle();

  if (known) {
    await sb
      .from(T.devices)
      .update({ last_seen_at: now, ip: meta.ip ?? null, country: meta.country ?? null })
      .eq("id", known.id);
  } else {
    // Insere primeiro e só depois confere quem ficou dentro do limite.
    // Na ordem inversa (contar, depois inserir) dois PCs validando ao
    // mesmo tempo passariam os dois pela contagem. Aqui os dispositivos
    // MAIS ANTIGOS ficam com a vaga, de forma determinística.
    const { error: insertError } = await sb.from(T.devices).insert({
      license_id: row.id,
      device_id: device,
      first_seen_at: now,
      last_seen_at: now,
      ip: meta.ip ?? null,
      country: meta.country ?? null,
      user_agent: (meta.userAgent ?? "").slice(0, 256),
    });

    // 23505 = unique_violation, ou seja, corrida com outra aba. Tudo bem.
    if (insertError && insertError.code !== "23505") {
      throw new Error(`Falha ao registrar dispositivo: ${insertError.message}`);
    }

    const { data: slots } = await sb
      .from<{ device_id: string }>(T.devices)
      .select("device_id")
      .eq("license_id", row.id)
      .order("first_seen_at", { ascending: true })
      .order("id", { ascending: true })
      .limit(limit);

    const temVaga = Array.isArray(slots) && slots.some((d: { device_id: string }) => d.device_id === device);

    if (!temVaga) {
      await sb.from(T.devices).delete().eq("license_id", row.id).eq("device_id", device);
      await logEvent(sb, "reject", row.id, device, `limite de ${limit} dispositivo(s)`, meta.ip);

      const resetUrl = typeof process !== "undefined" ? (process.env["CIPHER_RESET_PAGE_URL"] ?? "") : "";
      const conflictMsg = MESSAGES["device_conflict"] ?? "Conflito de dispositivo";
      return invalid(
        "device_conflict",
        resetUrl ? `${conflictMsg} Libere em: ${resetUrl}` : conflictMsg,
      );
    }
  }

  await sb
    .from(T.licenses)
    .update({ last_seen_at: now, validate_count: Number(row.validate_count || 0) + 1 })
    .eq("id", row.id);

  // Dispositivos ativos nos últimos 5 minutos.
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count: onlineCount } = await sb
    .from(T.devices)
    .select("id", { count: "exact", head: true })
    .eq("license_id", row.id)
    .gte("last_seen_at", fiveMinAgo);

  const secondsRemaining = isLifetime
    ? Number.MAX_SAFE_INTEGER
    : Math.max(0, Math.floor((new Date(expiresAt as string).getTime() - Date.now()) / 1000));

  return {
    valid: true,
    reason: null,
    message: MESSAGES["ok"] ?? "",
    expires_at: expiresAt,
    activated_at: activatedAt,
    status: "active",
    license_type: row.plan === "trial15" ? "trial" : "paid",
    lifetime: isLifetime,
    session_id: await makeSessionId(key, device),
    user_name: row.user_name ?? null,
    online_count: Number(onlineCount ?? 1),
    plan: row.plan,
    plan_label: planDef.label ?? row.plan,
    seconds_remaining: secondsRemaining,
    server_time: now,
  };
}
