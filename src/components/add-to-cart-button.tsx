"use client";

import { useState, useTransition } from "react";
import { addToCartAction } from "@/actions/cart";
import { Alert, Button } from "@/components/ui";

export function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  return (
    <div className="space-y-3">
      <Button
        type="button"
        disabled={disabled || pending}
        className="w-full sm:w-auto"
        onClick={() => {
          setMessage(null);
          startTransition(async () => {
            const result = await addToCartAction(productId, 1);
            if (result?.error) {
              setMessage({ type: "error", text: result.error });
            } else if (result?.success) {
              setMessage({ type: "success", text: result.success });
            }
          });
        }}
      >
        {pending ? "Adding..." : disabled ? "Out of stock" : "Add to cart"}
      </Button>
      {message ? (
        <Alert variant={message.type === "error" ? "error" : "success"}>
          {message.text}
        </Alert>
      ) : null}
    </div>
  );
}
