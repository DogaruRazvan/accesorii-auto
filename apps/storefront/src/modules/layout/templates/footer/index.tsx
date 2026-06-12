import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { clx } from "@modules/common/components/ui";
import Image from "next/image";

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { getT } from "@lib/i18n/server";

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  });
  const productCategories = await listCategories();
  const t = await getT();

  return (
    <footer className="w-full bg-card border-t border-line text-subtle">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-10 xsmall:flex-row items-start justify-between py-20 small:py-28">
          <div className="flex flex-col gap-y-4 max-w-xs">
            <LocalizedClientLink href="/" className="inline-flex">
              <Image
                src="/logo.png"
                alt="MENV Divers"
                width={180}
                height={178}
                className="h-20 w-auto object-contain"
              />
            </LocalizedClientLink>
            <p className="text-sm text-subtle">
              {t("footer.tagline")}
            </p>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="text-sm font-semibold text-content mb-1">
                  {t("footer.categories")}
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return;
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null;

                    return (
                      <li
                        className="flex flex-col gap-2 text-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-content",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-content"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="text-sm font-semibold text-content mb-1">
                  {t("footer.collections")}
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-subtle txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-content"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="text-sm font-semibold text-content mb-1">{t("footer.info")}</span>
              <ul className="grid grid-cols-1 gap-y-2 text-subtle txt-small">
                <li>
                  <LocalizedClientLink
                    href="/content/termeni-si-conditii"
                    className="hover:text-content"
                  >
                    {t("footer.terms")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/content/politica-de-confidentialitate"
                    className="hover:text-content"
                  >
                    {t("footer.privacy")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/content/politica-de-retur"
                    className="hover:text-content"
                  >
                    {t("footer.returns")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/content/politica-cookies"
                    className="hover:text-content"
                  >
                    {t("footer.cookies")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/content/anpc"
                    className="hover:text-content"
                  >
                    {t("footer.anpc")}
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full py-8 border-t border-line justify-between text-subtle">
          <p className="text-xs">
            © {new Date().getFullYear()} MENV Divers. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
