"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { guide } from "@/lib/site";
import { GuidePurchaseButton } from "@/components/guide-purchase-button";

export function StickyGuideBar() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("guide-primary-cta");
    const footer = document.getElementById("footer");
    if (!hero || !footer) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    const footerObserver = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );

    heroObserver.observe(hero);
    footerObserver.observe(footer);

    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  const visible = !heroVisible && !footerVisible;

  return (
    <aside
      aria-hidden={!visible}
      className={`sticky-guide${visible ? " sticky-guide--visible" : ""}`}
      inert={!visible}
    >
      <div className="sticky-guide__inner">
        <Image
          alt=""
          className="sticky-guide__image"
          height={52}
          src={guide.image}
          width={44}
        />
        <div className="sticky-guide__copy">
          <strong>{guide.name}</strong>
          <span>{guide.price}</span>
        </div>
        <GuidePurchaseButton className="sticky-guide__button" compact />
      </div>
    </aside>
  );
}
