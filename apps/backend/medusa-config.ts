import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Module configurate explicit. Providerul manual (pp_system_default, folosit
// pentru ramburs) ramane mereu disponibil. Stripe se adauga DOAR daca exista
// STRIPE_API_KEY, ca backend-ul sa nu crape cand cheia nu e inca setata.
const modules: any[] = []

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
          },
        },
      ],
    },
  })
}

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
