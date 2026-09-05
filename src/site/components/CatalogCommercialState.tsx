import type { PublicObject, PublicPrice } from "@/modules/catalog/readModel";
import type { PublicAvailability } from "@/modules/catalog/availability";
import type { CatalogRead } from "@/site/catalog/readCatalog";

const availabilityLabel: Record<PublicAvailability, string> = {
  NOT_FOR_SALE: "Not offered for sale",
  IN_STOCK: "Ready-stock availability",
  MADE_TO_ORDER: "Made to order",
  INQUIRY: "By private inquiry",
  SOLD_OUT: "Sold out",
  UNAVAILABLE: "Acquisition currently unavailable",
};

// Decimal rendering stays in bigint arithmetic, including values above JS safe integers.
function formatPrice(price: PublicPrice) {
  const minor = BigInt(price.minorUnits);
  return `${price.currency} ${minor / 100n}.${(minor % 100n).toString().padStart(2, "0")}`;
}

export function CatalogCommercialState({ result }: { result: CatalogRead<PublicObject | null> }) {
  if (result.state === "UNAVAILABLE") return <p className="object-status" role="status">Commercial data temporarily unavailable</p>;
  const product = result.data;
  if (!product) return <p className="object-status">Commercial presentation is not published</p>;
  return (
    <section aria-label="Commercial status" data-product-id={product.productId} data-product-slug={product.productSlug}>
      <p className="object-status">{product.status === "DRAFT"
        ? "Development presentation — not offered for sale"
        : availabilityLabel[product.availability]}</p>
      {product.variants.map(variant => (
        <div key={variant.variantId} data-variant-id={variant.variantId} data-finish-code={variant.finishCode}>
          <p>{variant.finishName}</p>
          {variant.price && <p>{formatPrice(variant.price)}</p>}
          <p>{availabilityLabel[variant.availability]}</p>
          {variant.madeToOrder && <p>Production: {variant.madeToOrder.minDays}–{variant.madeToOrder.maxDays} days</p>}
          {variant.edition && <p>Edition size: {variant.edition.size}</p>}
        </div>
      ))}
    </section>
  );
}
