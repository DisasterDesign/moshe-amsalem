"use client";

import { forwardRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
// With no site key the widget never renders, so a form must not wait for a token
// it will never receive - otherwise submit stays disabled forever.
export const TURNSTILE_ENABLED = TURNSTILE_SITE_KEY.length > 0;

type Props = {
  onToken: (token: string | null) => void;
  /** `interaction-only` keeps compact forms clean until a challenge is needed. */
  appearance?: "always" | "interaction-only";
};

const TurnstileField = forwardRef<TurnstileInstance | null, Props>(function TurnstileField(
  { onToken, appearance = "always" },
  ref
) {
  if (!TURNSTILE_ENABLED) return null;

  return (
    <div className="flex justify-center" dir="ltr">
      <Turnstile
        ref={ref}
        siteKey={TURNSTILE_SITE_KEY}
        options={{ language: "he", theme: "light", appearance }}
        onSuccess={(token) => onToken(token)}
        onError={() => onToken(null)}
        onExpire={() => onToken(null)}
      />
    </div>
  );
});

export default TurnstileField;
