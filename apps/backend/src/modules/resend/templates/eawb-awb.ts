// Emailuri catre magazin (EAWB_NOTIFY_EMAIL, implicit menvdivers@yahoo.com)
// la emiterea automata a AWB-ului. Eticheta PDF vine ca atasament.

export type EawbAwbData = {
  display_id?: number | string
  awb?: string
  carrier?: string
  payment_mode?: "card" | "cod"
  cod_amount?: number
  carrier_price?: number
  customer_name?: string
  customer_phone?: string
  address?: string
  tracking_url?: string
  label_url?: string
  has_attachment?: boolean
  error?: string
}

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!))

const lei = (v?: number) => (typeof v === "number" && Number.isFinite(v) ? `${v.toFixed(2)} lei` : "—")

const row = (label: string, value: string) =>
  `<tr><td style="padding:6px 12px 6px 0;color:#6b7280">${label}</td><td style="padding:6px 0;font-weight:600">${value}</td></tr>`

const wrap = (title: string, accent: string, body: string) => `<!doctype html><html><body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827">
<div style="max-width:560px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden">
<div style="background:${accent};color:#fff;padding:16px 20px;font-size:18px;font-weight:700">${title}</div>
<div style="padding:20px">${body}</div></div></body></html>`

export function eawbAwbCreatedEmail(d: EawbAwbData) {
  const links = [
    d.tracking_url ? `<a href="${esc(d.tracking_url)}">Urmărire colet</a>` : "",
    d.label_url ? `<a href="${esc(d.label_url)}">Descarcă eticheta</a>` : "",
  ].filter(Boolean).join(" · ")
  return {
    subject: `AWB ${d.awb} — comanda #${d.display_id}`,
    html: wrap(`AWB generat pentru comanda #${esc(d.display_id)}`, "#059669", `
<table style="border-collapse:collapse;font-size:14px">
${row("AWB", esc(d.awb))}
${row("Curier", esc(d.carrier || "—"))}
${row("Cost curier", lei(d.carrier_price))}
${row("Plată", d.payment_mode === "cod" ? `Ramburs — încasează ${lei(d.cod_amount)}` : "Card (încasat)")}
${row("Client", esc(d.customer_name))}
${row("Telefon", esc(d.customer_phone))}
${row("Adresă", esc(d.address))}
</table>
<p style="font-size:14px">${d.has_attachment ? "Eticheta este atașată (PDF). Printeaz-o și lipește-o pe colet." : "Eticheta nu a putut fi atașată — folosește linkul de mai jos sau widget-ul „Livrare eAWB” din admin."}</p>
${links ? `<p style="font-size:14px">${links}</p>` : ""}`),
  }
}

export function eawbAwbFailedEmail(d: EawbAwbData) {
  return {
    subject: `⚠ AWB negenerat — comanda #${d.display_id}`,
    html: wrap(`AWB-ul nu a putut fi generat automat`, "#dc2626", `
<p style="font-size:14px">Comanda <b>#${esc(d.display_id)}</b> nu are AWB. Motiv:</p>
<p style="font-size:14px;background:#fef2f2;padding:12px;border-radius:6px">${esc(d.error)}</p>
<p style="font-size:14px">Verifică comanda în admin. Dacă starea eAWB este „pending/uncertain”, caută întâi comanda în contul eAWB înainte de a reîncerca (vezi docs/EAWB.md). Altfel poți genera AWB-ul din <b>Fulfill items</b>.</p>`),
  }
}
