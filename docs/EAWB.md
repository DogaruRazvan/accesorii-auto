# Integrare eAWB / Europarcel

Implementare pentru Medusa 2.15.5 și Next.js 15. Configurația implicită este
dezactivată; nu se emit AWB-uri și nu se modifică opțiunile existente la instalare.

## Ce include

- Tarife live pentru livrare la adresă în România, RON, separat card/ramburs.
- Preț final `price.total` din API, cu TVA inclus. Nu se adaugă încă o dată TVA
  sau un indice de combustibil calculat local.
- Gratuitate implicit de la 500 RON `item_total` (după reduceri, cu taxe),
  configurabilă sau dezactivabilă. Costul curierului rămâne suportat de magazin.
- Pentru ramburs, suma cerută curierului include produsele și transportul plătit
  de client. Calculul converge la ban; dacă nu converge, opțiunea este refuzată.
- Validare în backend a coșului, adresei și metodei de plată înainte de comandă.
- Generare AWB prin acțiunea nativă Medusa Admin **Fulfill items**, anulare prin
  **Cancel fulfillment**, etichetă și urmărire în widget-ul „Livrare eAWB”.
- Registru persistent cu unicitate per comandă pentru evitarea cumpărărilor
  duplicate, inclusiv după timeout, reîncercare sau restart.
- Script de diagnostic fără emitere de AWB și script de reconciliere manuală.

## Date necesare de la magazin

1. Cheia API eAWB a contului magazinului, furnizată în siguranță pentru configurarea
   backend-ului, nu în cod, Git sau variabile `NEXT_PUBLIC_*`.
2. Adresa de facturare și adresa de ridicare salvate în contul eAWB. ID-urile se pot
   afla prin `GET /addresses/billing?all=true` și `/addresses/shipping?all=true`.
3. Curierii acceptați, starea tarifelor negociate și confirmarea livrării la adresă.
4. Politica de gratuitate și confirmarea transferării către client a prețului final,
   inclusiv comisionul de ramburs. Nu există adaos comercial în implementare.
5. IBAN-ul și titularul în care se virează rambursul.
6. Greutățile și dimensiunile EXTERIOARE ale produselor ambalate și regula reală
   de ambalare a comenzilor cu mai multe bucăți.
7. Confirmarea momentului emiterii AWB și alimentarea wallet-ului pentru expediere.
8. De la eAWB: disponibilitatea unui mediu/cont de test, condițiile de tarifare
   pentru cont și confirmarea că API-ul reflectă suplimentele aplicabile contului.

## Limitele primei versiuni

- Service ID 1 (ușă-la-ușă), România, RON. Lockerele și retururile automate nu sunt
  activate. Nu creați opțiuni locker folosind acest provider.
- **Ambalare: un colet separat pentru fiecare bucată fizică**, maximum 100 colete.
  Greutatea variantei (sau a produsului) este în GRAME; dimensiunile variantei sunt
  în CENTIMETRI. Valorile trebuie să includă ambalajul. Nu sunt estimate automat.
  Dacă magazinul grupează produsele în cutii, adaptați `buildShipment` după regula
  confirmată de Maria înainte de activare. Nu folosiți o greutate fictivă de 1 kg.
- Expediere integrală a comenzii; fără expedieri parțiale, mai multe metode de
  transport, credite/carduri cadou sau promoții suplimentare pe transport.
- Plata cu cardul folosește Stripe; rambursul folosește `pp_system_default`.
  Clientul alege combinația curier/plată la Livrare, iar pasul Plată afișează doar
  metoda compatibilă. Backend-ul verifică independent această corespondență.
- Tariful este reconfirmat la selectarea opțiunii. Datele sunt amprentate și
  selecția expiră după 15 minute. Butonul „Actualizează și reconfirmă livrarea”
  reface selecția. Un eșec API nu se transformă în transport gratuit.
- Cache-ul de tarif este privat, în memorie, maximum 30 secunde și 200 intrări.
- Un AWB per comandă. După anulare, reemiterea pentru aceeași comandă necesită
  o procedură operațională separată; nu se cumpără automat alt AWB.
- Modificările de adresă, produse sau plată după comandă trebuie verificate înainte
  de expediere. Prețul final al curierului la emitere poate diferi de oferta inițială;
  totalul încasat de la client nu este modificat automat după plasarea comenzii.

## Configurare și activare

1. Din rădăcina repository-ului, `npm ci`. Pentru dezvoltare locală: PostgreSQL,
   `apps/backend/.env` pornind de la `.env.template`, și
   `apps/storefront/.env.local` pornind de la noul `.env.template`.
   Folosiți o bază de dezvoltare, nu baza live pentru testele inițiale.
2. Completați în backend cheia, `EAWB_BILLING_ADDRESS_ID`,
   `EAWB_SENDER_ADDRESS_ID`, `EAWB_BANK_IBAN`, `EAWB_BANK_HOLDER`.
   Configurați `EAWB_CARRIER_IDS` (ID-uri separate prin virgulă) și
   `EAWB_PAYMENT_MODES=card,cod` sau doar metoda disponibilă în magazin.
3. Configurați `EAWB_FREE_SHIPPING_THRESHOLD=500` sau `off`.
   Storefront-ul citește politica de la `/store/eawb/config`; nu mai are pragul
   independent de 200 lei. Dacă API-ul nu răspunde, bara de gratuitate este ascunsă.
4. În mediul de test, setați `EAWB_ENABLED=true` și păstrați
   `EAWB_CREATE_AWB_ENABLED=false`. Din `apps/backend`, rulați
   `npx medusa db:migrate`. Migrarea adaugă doar tabelul `eawb_booking`.
5. Rulați din rădăcină `npm run eawb:check --workspace=@dtc/backend`.
   Verifică accesul API, proprietatea adreselor, serviciile și datele variantelor.
   Nu generează AWB și nu debitează wallet-ul.
6. În Admin → Settings → Locations & Shipping, la locația corespunzătoare adresei
   de ridicare, activați providerul `eawb_eawb`. În zona de livrare România creați
   opțiuni de tip **Calculated**, cu provider eAWB și același Shipping Profile ca
   produsele. Alegeți combinația curier/card sau curier/ramburs din lista providerului.
   Nu folosiți **Flat** și nu rulați scriptul vechi de gratuitate pe aceste opțiuni.
7. Verificați Stripe/manual în regiunea România. Păstrați/dezactivați opțiunile
   manuale vechi intenționat, pentru a nu afișa două politici diferite de transport.
8. Testați checkout-ul conform listei de mai jos. Abia apoi setați
   `EAWB_CREATE_AWB_ENABLED=true`, cu wallet alimentat și acceptul magazinului.
   Pentru plata cu cardul, încasarea integrală trebuie confirmată înainte de AWB.
9. Într-o comandă test confirmată, selectați toate produsele în **Fulfill items**.
   Aceasta cumpără AWB-ul. Verificați eticheta, suma ramburs și starea din widget.
   Widget-ul poate reobține un link de etichetă dacă primul download a eșuat.

La deploy aplicați variabilele în serviciul backend și migrarea înainte de trafic;
deploaiați și storefront-ul. Păstrați `eawb_booking` la rollback. Nu ștergeți
registrul pentru a rezolva o eroare, deoarece protecția împotriva duplicatelor ar dispărea.

## Recuperare după o emitere cu rezultat necunoscut

`pending`/`uncertain` înseamnă că AWB-ul poate exista deja în eAWB. Nu reîncercați
prin altă comandă înainte de verificare. Căutați în contul eAWB referința internă
egală cu ID-ul comenzii Medusa; dacă este nevoie, cereți confirmarea suportului.

Scriptul `npm run eawb:reconcile --workspace=@dtc/backend` necesită:

- `EAWB_RECONCILE_ORDER_ID=order_...`
- `EAWB_RECONCILE_CONFIRM=order_...` (același ID, confirmare manuală a verificării)
- Dacă AWB-ul există: `EAWB_RECONCILE_ACTION=attach` și
  `EAWB_RECONCILE_EXTERNAL_ID=<ID comanda eAWB>`. Verificați manual că AWB-ul
  aparține exact acestei comenzi, inclusiv adresă, curier, colete și ramburs.
- Dacă eAWB confirmă că nu există niciun AWB: `EAWB_RECONCILE_ACTION=confirm-no-awb`.
  Numai această confirmare permite o nouă emitere. Acțiunea este interzisă cât
  timp o cerere inițială poate fi încă procesată.

Scriptul nu cumpără AWB-uri. După reconciliere eliminați variabilele de recuperare.
Pentru `attach`, reîncercarea aceleiași expedieri folosește rezultatul existent;
modificarea parametrilor comenzii blochează refolosirea etichetei.

## Verificări

Comenzi locale din rădăcină:

```text
npm run test:eawb --workspace=@dtc/backend
npx tsc --noEmit -p apps/backend/tsconfig.json
npx tsc --noEmit --incremental false -p apps/storefront/tsconfig.json
```

Testele automate folosesc răspunsuri simulate, fără chei reale și fără debitarea
wallet-ului. Verifică TVA inclus, conversia gram/kg, adrese incomplete, tarife invalide,
pragul de 500, convergența rambursului, date trimise fraudulos de client, expirarea
selecției, plata incompatibilă, reîncercările/concurența și timeout-ul după emitere.

În mediul conectat, validați suplimentar: tarif egal cu contul eAWB pentru aceleași
date; 499,99/500/500,01 lei; card/ramburs; modificare adresă/cantitate/cupon;
mai multe bucăți; localități cu suplimente; tarif indisponibil; emitere, download,
anulare și recuperarea unei erori. Migrarea, încărcarea modulelor, fluxul complet
Medusa/Stripe și contractul live eAWB necesită testare cu baza și conturile configurate.

## Surse și fișiere principale

- API oficial: https://api.europarcel.com/api/documentation
- OpenAPI: https://api.europarcel.com/api/docs?api-docs-public.json
- Client oficial verificat: https://github.com/europarcel/mcp-npm
- Provider Medusa: https://docs.medusajs.com/resources/integrations/guides/shipstation
- `src/modules/eawb/`: API, configurare, validare, tarifare și provider fulfillment.
- `src/modules/eawb-booking/`: registru persistent, migrare și controlul duplicatelor.
- `src/workflows/hooks/eawb-checkout.ts`: validare înainte de finalizarea coșului.
- `src/admin/widgets/eawb-order.tsx`: etichetă și status în pagina comenzii.

Commit sugerat după verificare: `feat: integrate eAWB shipping rates and guarded AWB fulfillment`.
