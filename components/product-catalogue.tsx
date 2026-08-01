"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

import {
  productCategories,
  products,
  type ProductCategory,
} from "@/lib/products";

export function ProductCatalogue() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("All");

  const visibleProducts = useMemo(
    () =>
      activeCategory === "All"
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="catalogue-shell">
      <div aria-label="Filter products by type" className="category-tabs" role="group">
        {productCategories.map((category) => (
          <button
            aria-pressed={activeCategory === category}
            className="category-tab"
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="catalogue-count">
        {visibleProducts.length} {visibleProducts.length === 1 ? "favourite" : "favourites"}
      </p>

      <div className="product-grid">
        {visibleProducts.map((product, index) => (
          <article
            className="product-card"
            key={product.id}
            style={{ "--product-index": Math.min(index, 7) } as React.CSSProperties}
          >
            <a
              aria-label={`Shop ${product.brand} ${product.name} on Amazon`}
              className="product-image-wrap"
              href={product.affiliateUrl}
              rel="nofollow sponsored noopener noreferrer"
              target="_blank"
            >
              <Image
                alt={`${product.brand} ${product.name}`}
                className="product-image"
                height="600"
                src={product.image}
                width="600"
              />
            </a>

            <div className="product-copy">
              <span className="product-category">{product.category}</span>
              <h3>
                <span>{product.brand}</span>
                {product.name}
              </h3>
              <a
                className="product-link"
                href={product.affiliateUrl}
                rel="nofollow sponsored noopener noreferrer"
                target="_blank"
              >
                Shop on Amazon
                <ExternalLink aria-hidden="true" size={15} strokeWidth={1.8} />
              </a>
              {product.alternateAffiliateUrl ? (
                <a
                  className="product-alternate-link"
                  href={product.alternateAffiliateUrl}
                  rel="nofollow sponsored noopener noreferrer"
                  target="_blank"
                >
                  Alternate listing
                  <ExternalLink aria-hidden="true" size={13} strokeWidth={1.8} />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
