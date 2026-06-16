// Email de notificare pentru PROPRIETARUL magazinului — „comandă nouă".
// Conține datele de contact ale clientului + sumarul comenzii.

type Item = { title?: string; quantity?: number; unit_price?: number; total?: number }
type Address = {
  first_name?: string
  last_name?: string
  address_1?: string
  city?: string
  postal_code?: string
  province?: string
  country_code?: string
  phone?: string
}

export type OrderPlacedAdminData = {
  display_id?: number | string
  customer_email?: string
  customer_name?: string
  customer_phone?: string
  currency_code?: string
  items?: Item[]
  total?: number
  shipping_address?: Address | null
}

const ACCENT = "#059669"

// Vezi order-placed.ts: BigNumber Medusa poate ajunge ca number / string /
// instance / POJO raw. Extragem robust din toate formele.
function toNumber(amount: unknown): number {
  if (amount == null) return 0
  if (typeof amount === "number") return Number.isFinite(amount) ? amount : 0
  if (typeof amount === "string") {
    const n = parseFloat(amount)
    return Number.isFinite(n) ? n : 0
  }
  if (typeof amount === "object") {
    const o = amount as Record<string, any>
    const candidate =
      o.numeric ??
      o.value ??
      o.raw_?.value ??
      o.raw?.value ??
      (typeof o.valueOf === "function" ? o.valueOf() : undefined)
    const n = parseFloat(String(candidate))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function money(amount: unknown, currency: string | undefined) {
  const safe = toNumber(amount)
  const code = (currency || "RON").toUpperCase()
  try {
    return new Intl.NumberFormat("ro-RO", { style: "currency", currency: code }).format(safe)
  } catch {
    return `${safe.toFixed(2)} ${code}`
  }
}

function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string)
  )
}

export function orderPlacedAdminEmail(data: OrderPlacedAdminData): {
  subject: string
  html: string
} {
  const cur = data.currency_code
  const orderNo = data.display_id ? `#${data.display_id}` : ""
  const addr = data.shipping_address
  const items = data.items || []

  const rows = items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;color:#111;font-size:14px;">
          ${esc(it.title)} ${it.quantity ? `<span style="color:#888;">× ${it.quantity}</span>` : ""}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;color:#111;font-size:14px;text-align:right;white-space:nowrap;">
          ${money(it.total ?? (it.unit_price || 0) * (it.quantity || 1), cur)}
        </td>
      </tr>`
    )
    .join("")

  const addressBlock = addr
    ? `${esc([addr.first_name, addr.last_name].filter(Boolean).join(" "))}<br/>
       ${esc(addr.address_1)}<br/>
       ${esc([addr.postal_code, addr.city, addr.province].filter(Boolean).join(", "))}`
    : "-"

  const subject = `🛒 Comandă nouă ${orderNo} — MENV Divers`.trim()

  const html = `<!doctype html>
<html lang="ro">
<body style="margin:0;padding:0;background:#f4f4f5;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
      <div style="background:${ACCENT};padding:24px 32px;">
        <h1 style="margin:0;color:#fff;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;">Comandă nouă ${orderNo}</h1>
      </div>
      <div style="padding:28px 32px;font-family:Arial,Helvetica,sans-serif;">
        <p style="margin:0 0 18px;color:#555;font-size:15px;">Ai o comandă nouă în magazin. Detalii:</p>

        <table style="width:100%;border-collapse:collapse;margin:0 0 18px;">
          <tr><td style="padding:4px 0;color:#777;font-size:14px;width:120px;">Client</td><td style="padding:4px 0;color:#111;font-size:14px;font-weight:600;">${esc(data.customer_name) || "-"}</td></tr>
          <tr><td style="padding:4px 0;color:#777;font-size:14px;">Email</td><td style="padding:4px 0;color:#111;font-size:14px;">${esc(data.customer_email) || "-"}</td></tr>
          <tr><td style="padding:4px 0;color:#777;font-size:14px;">Telefon</td><td style="padding:4px 0;color:#111;font-size:14px;">${esc(data.customer_phone) || "-"}</td></tr>
          <tr><td style="padding:8px 0 4px;color:#777;font-size:14px;vertical-align:top;">Livrare</td><td style="padding:8px 0 4px;color:#111;font-size:14px;line-height:1.5;">${addressBlock}</td></tr>
        </table>

        <table style="width:100%;border-collapse:collapse;margin:0 0 8px;">${rows}</table>

        <table style="width:100%;border-collapse:collapse;margin:8px 0 0;">
          <tr>
            <td style="padding:10px 0 0;color:#111;font-size:16px;font-weight:700;border-top:2px solid #111;">Total</td>
            <td style="padding:10px 0 0;color:${ACCENT};font-size:16px;font-weight:800;text-align:right;border-top:2px solid #111;">${money(data.total, cur)}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`

  return { subject, html }
}
