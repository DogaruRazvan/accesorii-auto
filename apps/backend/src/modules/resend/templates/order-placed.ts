// Email HTML pentru confirmarea comenzii. Fara JSX/React la runtime — doar un
// string HTML cu stiluri inline (merge in toate clientii de email).

type Item = {
  title?: string
  quantity?: number
  unit_price?: number
  total?: number
}

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

export type OrderPlacedData = {
  display_id?: number | string
  customer_name?: string
  currency_code?: string
  items?: Item[]
  subtotal?: number
  shipping_total?: number
  total?: number
  shipping_address?: Address | null
}

const BRAND = "MENV Divers"
const ACCENT = "#059669"

function money(amount: unknown, currency: string | undefined) {
  // Totalurile Medusa pot veni ca BigNumberValue (number sau string) -> coercem.
  const value = Number(amount)
  const safe = Number.isFinite(value) ? value : 0
  const code = (currency || "RON").toUpperCase()
  try {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: code,
    }).format(safe)
  } catch {
    return `${safe.toFixed(2)} ${code}`
  }
}

function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string)
  )
}

export function orderPlacedEmail(data: OrderPlacedData): {
  subject: string
  html: string
} {
  const cur = data.currency_code
  const orderNo = data.display_id ? `#${data.display_id}` : ""
  const name = data.customer_name?.trim() || "client"
  const items = data.items || []
  const addr = data.shipping_address

  const rows = items
    .map(
      (it) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee;color:#111;font-size:14px;">
          ${esc(it.title)} ${it.quantity ? `<span style="color:#888;">× ${it.quantity}</span>` : ""}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;color:#111;font-size:14px;text-align:right;white-space:nowrap;">
          ${money(it.total ?? (it.unit_price || 0) * (it.quantity || 1), cur)}
        </td>
      </tr>`
    )
    .join("")

  const addressBlock = addr
    ? `
      <p style="margin:0 0 4px;color:#111;font-size:14px;font-weight:600;">Adresă de livrare</p>
      <p style="margin:0;color:#555;font-size:14px;line-height:1.6;">
        ${esc([addr.first_name, addr.last_name].filter(Boolean).join(" "))}<br/>
        ${esc(addr.address_1)}<br/>
        ${esc([addr.postal_code, addr.city, addr.province].filter(Boolean).join(", "))}<br/>
        ${addr.phone ? esc(addr.phone) : ""}
      </p>`
    : ""

  const subject = `Confirmare comandă ${orderNo} — ${BRAND}`.trim()

  const html = `<!doctype html>
<html lang="ro">
<body style="margin:0;padding:0;background:#f4f4f5;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
      <div style="background:${ACCENT};padding:28px 32px;">
        <h1 style="margin:0;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;letter-spacing:-0.3px;">${BRAND}</h1>
      </div>
      <div style="padding:32px;font-family:Arial,Helvetica,sans-serif;">
        <h2 style="margin:0 0 8px;color:#111;font-size:22px;">Mulțumim pentru comandă! 🎉</h2>
        <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
          Salut ${esc(name)}, am primit comanda ta ${orderNo ? `<strong>${orderNo}</strong>` : ""} și o pregătim de livrare. Îți trimitem un mesaj când pleacă spre tine.
        </p>

        <table style="width:100%;border-collapse:collapse;margin:0 0 8px;">
          ${rows}
        </table>

        <table style="width:100%;border-collapse:collapse;margin:8px 0 24px;">
          <tr>
            <td style="padding:4px 0;color:#777;font-size:14px;">Subtotal</td>
            <td style="padding:4px 0;color:#777;font-size:14px;text-align:right;">${money(data.subtotal, cur)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#777;font-size:14px;">Livrare</td>
            <td style="padding:4px 0;color:#777;font-size:14px;text-align:right;">${money(data.shipping_total, cur)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;color:#111;font-size:16px;font-weight:700;border-top:2px solid #111;">Total</td>
            <td style="padding:10px 0 0;color:${ACCENT};font-size:16px;font-weight:800;text-align:right;border-top:2px solid #111;">${money(data.total, cur)}</td>
          </tr>
        </table>

        ${addressBlock}
      </div>
    </div>
    <p style="text-align:center;color:#aaa;font-size:12px;font-family:Arial,Helvetica,sans-serif;margin:16px 0 0;">
      ${BRAND} — accesorii pentru mașina ta
    </p>
  </div>
</body>
</html>`

  return { subject, html }
}
