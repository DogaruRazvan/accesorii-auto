# CLAUDE.md — Magazin online accesorii auto (multi-categorie)

## Context proiect
Magazin online construit cu **Medusa v2** (backend headless + admin) și **Next.js 15** (storefront).
Lansare inițială: accesorii auto. Arhitectură multi-categorie: clientul (proprietarul magazinului)
adaugă oricâte categorii și produse din panoul de admin, fără modificări de cod.

Piață: România. Monedă: RON. Plăți: card (Stripe) + ramburs (plată manuală la livrare).

## Stack
- Backend / commerce: Medusa v2 (Node.js + TypeScript)
- Bază de date: PostgreSQL
- Storefront: Next.js 15 (App Router) + Tailwind CSS
- Plăți: Stripe (card) + metodă manuală (ramburs)
- Imagini: Cloudinary (sau S3)
- Hosting: Railway (backend + DB), Vercel sau Railway (storefront)

## Structură monorepo
- `/` sau `/backend` — aplicația Medusa (server + admin)
- `/storefront` (sau folderul Next.js starter) — magazinul vizibil clienților

## Comenzi
- Backend (din folderul Medusa): `npm run dev` → http://localhost:9000 (admin la /app)
- Storefront (din folderul Next.js): `npm run dev` → http://localhost:8000
- Seed date demo: `npm run seed` (dacă există) sau scriptul din `src/scripts`

## Reguli de lucru pentru tine (Claude Code)
1. Folosește **MCP server-ul Medusa** pentru a verifica în documentația oficială înainte
   de a scrie cod. Nu inventa API-uri sau metode — confirmă-le în docs.
2. Înainte de orice modificare de model de date (atribute, variante, categorii), explică-mi
   întâi unde intervii și de ce, apoi scrie codul.
3. Atributele specifice de categorie (ex. compatibilitate auto) se pun pe câmpul `metadata`
   al produsului, NU prin migrații noi de schemă, ca să păstrăm caracterul multi-categorie.
4. Lucrăm pe pași mici. După fiecare schimbare funcțională sugerează un commit clar.
5. Nu atinge cheile/secretele. Variabilele sensibile stau în `.env` / `.env.local`.

## De făcut (status)
- [x] Schelet local (backend + admin + storefront)
- [ ] Categorii auto + produse de test (prin admin)
- [ ] Configurare Stripe (card)
- [ ] Metodă de plată ramburs (manuală)
- [ ] Personalizare branding + pagini info
- [ ] Deploy (Railway + Vercel) + CORS
- [ ] Cont admin pentru clientă + predare
