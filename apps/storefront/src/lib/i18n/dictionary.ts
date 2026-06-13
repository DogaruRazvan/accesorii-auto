// Dictionar de traduceri RO/EN. Sistem pe cookie (fara schimbare de URL).
// Cheile sunt plate (namespace.cheie). Adauga aici string-uri noi pe masura
// ce traduci alte pagini. Fisier de date pur -> sigur in server SI client.

export type Locale = "ro" | "en"
export const defaultLocale: Locale = "ro"
export const locales: Locale[] = ["ro", "en"]

type Messages = Record<string, string>

const ro: Messages = {
  // Nav
  "nav.store": "Magazin",
  "nav.account": "Contul meu",
  "nav.cart": "Coș",
  "nav.searchPlaceholder": "Caută produse...",
  "nav.searchAll": "Vezi toate pentru",
  "nav.searching": "Se caută...",
  "nav.noResults": "Niciun produs găsit.",

  // Meniu mobil
  "menu.home": "Acasă",
  "menu.store": "Magazin",
  "menu.categories": "Categorii",
  "menu.account": "Contul meu",
  "menu.cart": "Coș",

  // Hero
  "hero.title1": "Tot ce ai nevoie,",
  "hero.title2": "într-un singur loc",
  "hero.subtitle": "Mii de produse din toate categoriile, livrate rapid oriunde în țară.",
  "hero.ctaPrimary": "Vezi produsele",
  "hero.ctaSecondary": "Toate produsele",
  "hero.scrollHint": "Derulează",
  "hero.revealText": "Mii de produse te așteaptă",

  // Trust bar
  "trust.shippingTitle": "Livrare rapidă",
  "trust.shippingSub": "În toată țara, 1-3 zile",
  "trust.returnTitle": "Retur în 14 zile",
  "trust.returnSub": "Simplu, fără bătăi de cap",
  "trust.payTitle": "Plată securizată",
  "trust.paySub": "Card sau ramburs la livrare",

  // Footer
  "footer.tagline": "Tot ce ai nevoie, într-un singur loc.",
  "footer.categories": "Categorii",
  "footer.collections": "Colecții",
  "footer.info": "Informații",
  "footer.terms": "Termeni și condiții",
  "footer.privacy": "Confidențialitate (GDPR)",
  "footer.returns": "Politică de retur",
  "footer.cookies": "Politică cookies",
  "footer.anpc": "ANPC",
  "footer.rights": "Toate drepturile rezervate.",

  // Cos (dropdown)
  "cart.title": "Coșul tău",
  "cart.itemOne": "produs",
  "cart.itemMany": "produse",
  "cart.freeShipPrefix": "Mai adaugă",
  "cart.freeShipSuffix": "pentru livrare gratuită",
  "cart.freeShipDone": "Felicitări! Ai livrare gratuită",
  "cart.quantity": "Cantitate",
  "cart.remove": "Elimină",
  "cart.subtotal": "Subtotal",
  "cart.noVat": "(fără TVA)",
  "cart.view": "Vezi coșul",
  "cart.empty": "Coșul tău e gol.",
  "cart.discover": "Descoperă produsele",

  // Comun
  "common.backToStore": "Înapoi la magazin",
  "common.allProducts": "Toate produsele",
  "common.resultsFor": "Rezultate pentru",
  "common.seeAll": "Vezi tot",

  // Autentificare
  "auth.welcomeBack": "Bine ai revenit",
  "auth.signInSubtitle": "Autentifică-te pentru o experiență de cumpărare îmbunătățită.",
  "auth.email": "Email",
  "auth.password": "Parolă",
  "auth.emailTitle": "Introdu o adresă de email validă.",
  "auth.signIn": "Autentificare",
  "auth.notMember": "Nu ai cont?",
  "auth.joinUs": "Creează cont",
  "auth.createTitle": "Creează cont MENV Divers",
  "auth.createSubtitle": "Creează-ți profilul și beneficiază de o experiență de cumpărare îmbunătățită.",
  "auth.firstName": "Prenume",
  "auth.lastName": "Nume",
  "auth.phone": "Telefon",
  "auth.agreePrefix": "Prin crearea contului, ești de acord cu",
  "auth.privacyPolicy": "Politica de confidențialitate",
  "auth.and": "și",
  "auth.termsOfUse": "Termenii de utilizare",
  "auth.join": "Creează cont",
  "auth.alreadyMember": "Ai deja cont?",

  // Cont
  "account.dashboard": "Panou",
  "account.profile": "Profil",
  "account.addresses": "Adrese",
  "account.orders": "Comenzi",
  "account.logout": "Deconectare",
  "account.hello": "Salut",
  "account.signedInAs": "Autentificat ca:",
  "account.menu": "Cont",

  // Pagina coș
  "cartpage.title": "Coșul tău",
  "cartpage.headItem": "Produs",
  "cartpage.headQty": "Cantitate",
  "cartpage.headPrice": "Preț",
  "cartpage.headTotal": "Total",
  "signin.title": "Ai deja cont?",
  "signin.sub": "Autentifică-te pentru o experiență mai bună.",
  "signin.cta": "Autentificare",
  "summary.title": "Sumar comandă",
  "summary.checkout": "Finalizează comanda",
  "totals.subtotal": "Subtotal",
  "totals.shipping": "Livrare",
  "totals.discount": "Reducere",
  "totals.taxes": "TVA",
  "totals.total": "Total",
  "empty.title": "Coșul tău e gol",
  "empty.sub": "Nu ai niciun produs în coș. Răsfoiește magazinul și adaugă ce-ți place.",
  "empty.cta": "Vezi produsele",

  // Landing magazin
  "landing.explore": "Explorează",
  "landing.inStore": "În magazin acum",
  "landing.emptyCategories": "Adaugă categorii din panoul de admin.",

  // Cod promoțional
  "discount.addCode": "Ai un cod promoțional?",
  "discount.codePlaceholder": "Cod",
  "discount.apply": "Aplică",
  "discount.applied": "Coduri aplicate:",
  "discount.remove": "Elimină codul",
}

const en: Messages = {
  // Nav
  "nav.store": "Shop",
  "nav.account": "My account",
  "nav.cart": "Cart",
  "nav.searchPlaceholder": "Search products...",
  "nav.searchAll": "See all for",
  "nav.searching": "Searching...",
  "nav.noResults": "No products found.",

  // Mobile menu
  "menu.home": "Home",
  "menu.store": "Shop",
  "menu.categories": "Categories",
  "menu.account": "My account",
  "menu.cart": "Cart",

  // Hero
  "hero.title1": "Everything you need,",
  "hero.title2": "in one place",
  "hero.subtitle": "Thousands of products across every category, delivered fast anywhere in the country.",
  "hero.ctaPrimary": "Browse products",
  "hero.ctaSecondary": "All products",
  "hero.scrollHint": "Scroll",
  "hero.revealText": "Thousands of products await",

  // Trust bar
  "trust.shippingTitle": "Fast delivery",
  "trust.shippingSub": "Nationwide, 1-3 days",
  "trust.returnTitle": "14-day returns",
  "trust.returnSub": "Simple, no hassle",
  "trust.payTitle": "Secure payment",
  "trust.paySub": "Card or cash on delivery",

  // Footer
  "footer.tagline": "Everything you need, in one place.",
  "footer.categories": "Categories",
  "footer.collections": "Collections",
  "footer.info": "Information",
  "footer.terms": "Terms & conditions",
  "footer.privacy": "Privacy (GDPR)",
  "footer.returns": "Return policy",
  "footer.cookies": "Cookie policy",
  "footer.anpc": "ANPC",
  "footer.rights": "All rights reserved.",

  // Cart (dropdown)
  "cart.title": "Your cart",
  "cart.itemOne": "item",
  "cart.itemMany": "items",
  "cart.freeShipPrefix": "Add",
  "cart.freeShipSuffix": "more for free shipping",
  "cart.freeShipDone": "Congrats! You've got free shipping",
  "cart.quantity": "Quantity",
  "cart.remove": "Remove",
  "cart.subtotal": "Subtotal",
  "cart.noVat": "(excl. VAT)",
  "cart.view": "View cart",
  "cart.empty": "Your cart is empty.",
  "cart.discover": "Discover products",

  // Common
  "common.backToStore": "Back to shop",
  "common.allProducts": "All products",
  "common.resultsFor": "Results for",
  "common.seeAll": "See all",

  // Auth
  "auth.welcomeBack": "Welcome back",
  "auth.signInSubtitle": "Sign in to access an enhanced shopping experience.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.emailTitle": "Enter a valid email address.",
  "auth.signIn": "Sign in",
  "auth.notMember": "Not a member?",
  "auth.joinUs": "Join us",
  "auth.createTitle": "Create your MENV Divers account",
  "auth.createSubtitle": "Create your profile and enjoy an enhanced shopping experience.",
  "auth.firstName": "First name",
  "auth.lastName": "Last name",
  "auth.phone": "Phone",
  "auth.agreePrefix": "By creating an account, you agree to our",
  "auth.privacyPolicy": "Privacy Policy",
  "auth.and": "and",
  "auth.termsOfUse": "Terms of Use",
  "auth.join": "Create account",
  "auth.alreadyMember": "Already a member?",

  // Account
  "account.dashboard": "Dashboard",
  "account.profile": "Profile",
  "account.addresses": "Addresses",
  "account.orders": "Orders",
  "account.logout": "Log out",
  "account.hello": "Hello",
  "account.signedInAs": "Signed in as:",
  "account.menu": "Account",

  // Cart page
  "cartpage.title": "Your cart",
  "cartpage.headItem": "Item",
  "cartpage.headQty": "Quantity",
  "cartpage.headPrice": "Price",
  "cartpage.headTotal": "Total",
  "signin.title": "Already have an account?",
  "signin.sub": "Sign in for a better experience.",
  "signin.cta": "Sign in",
  "summary.title": "Order summary",
  "summary.checkout": "Checkout",
  "totals.subtotal": "Subtotal",
  "totals.shipping": "Shipping",
  "totals.discount": "Discount",
  "totals.taxes": "Taxes",
  "totals.total": "Total",
  "empty.title": "Your cart is empty",
  "empty.sub": "You have no products in your cart. Browse the shop and add what you like.",
  "empty.cta": "Browse products",

  // Store landing
  "landing.explore": "Explore",
  "landing.inStore": "In store now",
  "landing.emptyCategories": "Add categories from the admin panel.",

  // Discount code
  "discount.addCode": "Have a promo code?",
  "discount.codePlaceholder": "Code",
  "discount.apply": "Apply",
  "discount.applied": "Applied promotions:",
  "discount.remove": "Remove code",
}

export const dict: Record<Locale, Messages> = { ro, en }
