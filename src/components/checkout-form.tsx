"use client";

import { useActionState } from "react";
import type { ActionState } from "@/actions/auth";
import { Alert, Button, Input, Label, Select } from "@/components/ui";

export function CheckoutForm({
  action,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="space-y-4 border border-[var(--line)] bg-white p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required />
        </div>
        <div>
          <Label htmlFor="postalCode">Postal code</Label>
          <Input id="postalCode" name="postalCode" required />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="addressLine1">Address line 1</Label>
          <Input id="addressLine1" name="addressLine1" required />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
          <Input id="addressLine2" name="addressLine2" />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" required />
        </div>
        <div>
          <Label htmlFor="paymentMethod">Payment method</Label>
          <Select id="paymentMethod" name="paymentMethod" defaultValue="COD">
            <option value="COD">Cash on delivery</option>
            <option value="BANK_TRANSFER">Bank transfer</option>
          </Select>
        </div>
      </div>

      {state.error ? <Alert>{state.error}</Alert> : null}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Placing order..." : "Place order"}
      </Button>
    </form>
  );
}
