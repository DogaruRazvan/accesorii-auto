import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Module configurate explicit. Providerul manual (pp_system_default, folosit
// pentru ramburs) ramane mereu disponibil. Stripe se adauga DOAR daca exista
// STRIPE_API_KEY, ca backend-ul sa nu crape cand cheia nu e inca setata.
const modules: any[] = []

// Recenzii produse (modul custom, mereu activ).
modules.push({ resolve: "./src/modules/product-review" })

if (process.env.STRIPE_API_KEY) {
  modules.push({
    resolve: "@medusajs/medusa/payment",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/payment-stripe",
          id: "stripe",
          options: {
            apiKey: process.env.STRIPE_API_KEY,
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            // NU capta automat la confirmarea cardului. Cu capture:true,
            // PaymentIntent-ul trece direct in "succeeded" si nu mai poate fi
            // anulat -> Medusa crapa cu "Could not delete all payment sessions"
            // cand reincarca pagina de checkout. Lasam fluxul standard:
            // autorizare la checkout (banii sunt rezervati pe card), iar
            // captarea efectiva se face la plasarea/expedierea comenzii.
            capture: false,
          },
        },
      ],
    },
  })
}

// Storage imagini pe S3-compatibil (Cloudflare R2). Se activeaza DOAR cand sunt
// setate cheile S3; altfel ramane providerul local implicit. Pe Railway discul
// e efemer, deci pentru productie acest provider e obligatoriu (imaginile
// persista in R2, nu se pierd la redeploy).
if (process.env.S3_ACCESS_KEY_ID) {
  modules.push({
    resolve: "@medusajs/medusa/file",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/file-s3",
          id: "s3",
          options: {
            file_url: process.env.S3_FILE_URL,
            access_key_id: process.env.S3_ACCESS_KEY_ID,
            secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
            region: process.env.S3_REGION || "auto",
            bucket: process.env.S3_BUCKET,
            endpoint: process.env.S3_ENDPOINT,
          },
        },
      ],
    },
  })
}

// Notificari: provider local pentru feed-ul din admin (mereu) + Resend pentru
// emailuri catre clienti. Resend se activeaza DOAR cand exista RESEND_API_KEY,
// ca backend-ul sa nu crape cand cheia nu e inca setata.
const notificationProviders: any[] = [
  {
    resolve: "@medusajs/medusa/notification-local",
    id: "local",
    options: {
      name: "Local Notification Provider",
      channels: ["feed"],
    },
  },
]

if (process.env.RESEND_API_KEY) {
  notificationProviders.push({
    resolve: "./src/modules/resend",
    id: "resend",
    options: {
      channels: ["email"],
      api_key: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM,
    },
  })
}

modules.push({
  resolve: "@medusajs/medusa/notification",
  options: { providers: notificationProviders },
})

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules,
})
