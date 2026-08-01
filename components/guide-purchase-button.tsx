"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

type GuidePurchaseButtonProps = {
  className?: string;
  compact?: boolean;
  id?: string;
};

export function GuidePurchaseButton({
  className = "",
  compact = false,
  id,
}: GuidePurchaseButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function beginCheckout() {
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/checkout", { method: "POST" });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Checkout could not be started.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Checkout could not be started. Please try again.",
      );
    }
  }

  return (
    <div className={`${className} purchase-control`}>
      <button
        className={`purchase-button${compact ? " purchase-button--compact" : ""}`}
        disabled={status === "loading"}
        id={id}
        onClick={beginCheckout}
        type="button"
      >
        {status === "loading" ? (
          <>
            <LoaderCircle aria-hidden="true" className="purchase-spinner" size={18} />
            Opening secure checkout
          </>
        ) : (
          <>
            {compact ? "Get the guide" : "Get instant access"}
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
          </>
        )}
      </button>
      <p aria-live="polite" className="purchase-message" role="status">
        {message}
      </p>
    </div>
  );
}
