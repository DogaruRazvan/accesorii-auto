import { model } from "@medusajs/framework/utils"

// Recenzie produs. Modul izolat — nu atinge schema produsului si nu foloseste
// metadata, ca sa pastram caracterul multi-categorie. Legatura cu produsul se
// face prin module link (vezi src/links/product-review-product.ts).
const ProductReview = model.define("product_review", {
  id: model.id().primaryKey(),
  // ID-ul produsului recenzat (folosit si pentru filtrare directa).
  product_id: model.text(),
  // ID-ul clientului, daca recenzia a fost lasata de un cont autentificat.
  customer_id: model.text().nullable(),
  // Numele afisat al autorului.
  author_name: model.text(),
  // Nota de la 1 la 5.
  rating: model.number(),
  // Titlu optional al recenziei.
  title: model.text().nullable(),
  // Textul recenziei.
  content: model.text(),
})

export default ProductReview
