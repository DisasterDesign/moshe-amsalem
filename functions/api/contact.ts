const ALLOWED_ORIGINS = [
  "https://ams-law.com",
  "https://www.ams-law.com",
];

function getCorsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function escapeHtml(input: unknown): string {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin");
  return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function onRequestPost(context) {
  const origin = context.request.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);
  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const body = await context.request.json();

    if (!body.name || !body.phone || !body.email) {
      return new Response(
        JSON.stringify({ error: "שם, טלפון ומייל הם שדות חובה" }),
        { status: 400, headers: jsonHeaders }
      );
    }

    if (!EMAIL_RE.test(String(body.email))) {
      return new Response(
        JSON.stringify({ error: "כתובת מייל לא תקינה" }),
        { status: 400, headers: jsonHeaders }
      );
    }

    // Turnstile is only enforced when a secret is configured. Without it the
    // widget never renders client-side, so demanding a token would reject every
    // legitimate submission and silently lose leads.
    const turnstileSecret = context.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!body.turnstileToken) {
        return new Response(
          JSON.stringify({ error: "אימות אבטחה נדרש" }),
          { status: 403, headers: jsonHeaders }
        );
      }

      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: String(body.turnstileToken),
            remoteip: context.request.headers.get("CF-Connecting-IP") || "",
          }),
        }
      );
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return new Response(
          JSON.stringify({ error: "אימות אבטחה נכשל, נסה שוב" }),
          { status: 403, headers: jsonHeaders }
        );
      }
    }

    const name = escapeHtml(body.name);
    const phone = escapeHtml(body.phone);
    const email = escapeHtml(body.email);
    const subject = escapeHtml(body.subject);
    const message = escapeHtml(body.message).replace(/\n/g, "<br>");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "אתר עו״ד משה אמסלם <noreply@ams-law.com>",
        to: "moshe@ams-law.com",
        reply_to: body.email,
        subject: `פנייה חדשה מהאתר${body.subject ? ` - ${body.subject}` : ""}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
            <div style="background: #0A0A0A; padding: 24px; text-align: center;">
              <h1 style="color: #C9A962; margin: 0; font-size: 24px;">פנייה חדשה מהאתר</h1>
            </div>
            <div style="padding: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333; width: 120px;">שם:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; color: #555;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">טלפון:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; color: #555;"><a href="tel:${phone}" style="color: #C9A962;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">מייל:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; color: #555;"><a href="mailto:${email}" style="color: #C9A962;">${email}</a></td>
                </tr>
                ${body.subject ? `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">נושא:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; color: #555;">${subject}</td>
                </tr>` : ""}
              </table>
              ${body.message ? `
              <div style="margin-top: 20px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #eee;">
                <strong style="color: #333;">הודעה:</strong>
                <p style="color: #555; line-height: 1.6; margin: 8px 0 0;">${message}</p>
              </div>` : ""}
            </div>
            <div style="background: #0A0A0A; padding: 16px; text-align: center;">
              <p style="color: #888; margin: 0; font-size: 12px;">הודעה זו נשלחה מטופס יצירת הקשר באתר עו״ד משה אמסלם</p>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(
        JSON.stringify({ error: "שגיאה בשליחת המייל", detail: err }),
        { status: 500, headers: jsonHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "שגיאה בשרת", detail: String(e) }),
      { status: 500, headers: jsonHeaders }
    );
  }
}
