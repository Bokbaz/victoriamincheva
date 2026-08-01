"use client";

import { useState } from "react";
import { X } from "lucide-react";

type CheckoutNoticeProps = {
  initiallyVisible?: boolean;
};

export function CheckoutNotice({ initiallyVisible = false }: CheckoutNoticeProps) {
  const [visible, setVisible] = useState(initiallyVisible);

  if (!visible) return null;

  return (
    <div aria-live="polite" className="checkout-notice" role="status">
      <p>Nothing was charged. Your guide is still here whenever you are ready.</p>
      <button aria-label="Dismiss message" onClick={() => setVisible(false)} type="button">
        <X aria-hidden="true" size={18} />
      </button>
    </div>
  );
}
