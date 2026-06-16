/**
 * Setează livrare GRATUITĂ peste 500 lei, prin API-ul public de admin.
 * Merge de oriunde (nu are nevoie de acces direct la baza de date Railway).
 *
 * Păstrează prețul de bază existent și adaugă regula `item_total >= 500 -> 0`.
 * Idempotent: dacă regula există deja, sare peste.
 *
 * Rulează din folderul apps/backend:
 *
 *   BACKEND_URL=https://dtcbackend-production-5fc1.up.railway.app \
 *   ADMIN_EMAIL=emailul_tau_de_admin \
 *   ADMIN_PASSWORD=parola_ta_de_admin \
 *   node ./src/scripts/free-shipping-http.mjs
 *
 * (pe Windows PowerShell vezi instrucțiunile din chat — se setează altfel)
 */

const THRESHOLD = 500

const BACKEND_URL = (process.env.BACKEND_URL || "").replace(/\/$/, "")
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!BACKEND_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Lipsesc variabile. Setează BACKEND_URL, ADMIN_EMAIL, ADMIN_PASSWORD."
  )
  process.exit(1)
}

async function main() {
  // 1. Autentificare admin -> token
  const authRes = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!authRes.ok) {
    console.error(`Autentificare eșuată (${authRes.status}). Verifică emailul/parola de admin.`)
    process.exit(1)
  }
  const { token } = await authRes.json()
  const auth = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }

  // 2. Listează opțiunile de livrare cu prețuri + reguli
  const listRes = await fetch(
    `${BACKEND_URL}/admin/shipping-options?fields=id,name,price_type,prices.amount,prices.currency_code,prices.price_rules.attribute,prices.price_rules.operator,prices.price_rules.value`,
    { headers: auth }
  )
  if (!listRes.ok) {
    console.error(`Nu am putut citi opțiunile de livrare (${listRes.status}).`)
    process.exit(1)
  }
  const { shipping_options: options = [] } = await listRes.json()

  if (!options.length) {
    console.warn("Nu există opțiuni de livrare. Creează una din admin întâi.")
    return
  }

  for (const option of options) {
    if (option.price_type && option.price_type !== "flat") continue

    const prices = option.prices || []

    // Afișăm starea curentă, ca să vedem ce reguli existau (ex. pragul de 200).
    console.log(`\n--- "${option.name}" (preturi actuale) ---`)
    for (const p of prices) {
      const rules = (p.price_rules || [])
        .map((r) => `${r.attribute} ${r.operator} ${r.value}`)
        .join(", ")
      console.log(`  ${p.amount} ${p.currency_code}${rules ? ` [${rules}]` : " (de baza)"}`)
    }

    // Prețurile de bază = cele FĂRĂ reguli. Orice preț cu regulă item_total
    // (ex. vechiul prag de 200) îl aruncăm și îl înlocuim cu 500.
    const basePrices = prices.filter((p) => !(p.price_rules || []).length)

    if (!basePrices.length) {
      console.warn(`"${option.name}": nu are preț de bază — sar peste.`)
      continue
    }

    const newPrices = [
      ...basePrices.map((p) => ({
        currency_code: p.currency_code,
        amount: Number(p.amount),
      })),
      ...basePrices.map((p) => ({
        currency_code: p.currency_code,
        amount: 0,
        rules: [{ attribute: "item_total", operator: "gte", value: THRESHOLD }],
      })),
    ]

    const updRes = await fetch(`${BACKEND_URL}/admin/shipping-options/${option.id}`, {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ prices: newPrices }),
    })

    if (!updRes.ok) {
      const txt = await updRes.text()
      console.error(`"${option.name}": update eșuat (${updRes.status}): ${txt}`)
      continue
    }
    console.log(`"${option.name}": livrare gratuită peste ${THRESHOLD} lei — setată.`)
  }

  console.log("Gata.")
}

main().catch((e) => {
  console.error("Eroare:", e?.message || e)
  process.exit(1)
})
