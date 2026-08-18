/**
 * POST /api/lead-magnet
 *
 * Gates the "מה לבדוק לפני חתימה על עסקת דירה" checklist behind a short form.
 * Notifies the office of the new lead and emails the requester the checklist.
 *
 * The PDF itself is supplied by the client. Until it exists, set
 * LEAD_MAGNET_URL to nothing: the lead is still captured and the requester is
 * told the checklist is on its way, rather than being handed a dead link.
 */

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
const CHECKLIST_NAME = "מה לבדוק לפני חתימה על עסקת דירה";

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

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

    if (body.company) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: jsonHeaders });
    }

    if (!body.name || !body.phone || !body.email) {
      return new Response(
        JSON.stringify({ error: "שם, טלפון ודוא״ל הם שדות חובה" }),
        { status: 400, headers: jsonHeaders }
      );
    }

    if (!EMAIL_RE.test(String(body.email))) {
      return new Response(
        JSON.stringify({ error: "כתובת מייל לא תקינה" }),
        { status: 400, headers: jsonHeaders }
      );
    }

    if (body.consent !== true) {
      return new Response(
        JSON.stringify({ error: "נדרש אישור מדיניות הפרטיות" }),
        { status: 400, headers: jsonHeaders }
      );
    }

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

    const apiKey = context.env.RESEND_API_KEY;
    const name = escapeHtml(body.name);
    const phone = escapeHtml(body.phone);
    const email = escapeHtml(body.email);
    const submittedAt = new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });

    // Absolute URL - email clients cannot resolve a site-relative path.
    const downloadUrl = context.env.LEAD_MAGNET_URL || "";

    // 1. Notify the office.
    const notify = await sendEmail(apiKey, {
      from: "אתר עו״ד משה אמסלם <noreply@ams-law.com>",
      to: "moshe@ams-law.com",
      reply_to: body.email,
      subject: `הורדת צ׳קליסט - ליד חדש: ${body.name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FBFAF7; border-radius: 12px; overflow: hidden;">
          <div style="background: #153243; padding: 24px; text-align: center;">
            <h1 style="color: #C9985E; margin: 0; font-size: 22px;">ליד חדש - הורדת הצ׳קליסט</h1>
          </div>
          <div style="padding: 24px; color: #3D5560;">
            <p style="margin: 0 0 12px;"><strong style="color:#153243;">שם:</strong> ${name}</p>
            <p style="margin: 0 0 12px;"><strong style="color:#153243;">טלפון:</strong> <a href="tel:${phone}" style="color:#27717F;">${phone}</a></p>
            <p style="margin: 0 0 12px;"><strong style="color:#153243;">דוא״ל:</strong> <a href="mailto:${email}" style="color:#27717F;">${email}</a></p>
            <p style="margin: 0 0 12px;"><strong style="color:#153243;">התקבל:</strong> ${escapeHtml(submittedAt)}</p>
            <p style="margin: 16px 0 0; font-size: 12px; color: #6C828B;">
              ${downloadUrl
                ? "הצ׳קליסט נשלח אליו אוטומטית."
                : "שים לב: קובץ הצ׳קליסט טרם הוגדר, לכן נשלח אליו מייל שמודיע שהמסמך יישלח בקרוב. יש לשלוח ידנית."}
            </p>
          </div>
        </div>
      `,
    });

    if (!notify.ok) {
      const err = await notify.text();
      return new Response(
        JSON.stringify({ error: "שגיאה בשליחת המייל", detail: err }),
        { status: 500, headers: jsonHeaders }
      );
    }

    // 2. Deliver to the requester. A failure here must not fail the request -
    //    the lead is already captured and the office was notified.
    context.waitUntil(
      sendEmail(apiKey, {
        from: "עו״ד משה אמסלם <noreply@ams-law.com>",
        to: body.email,
        subject: `${CHECKLIST_NAME}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FBFAF7; border-radius: 12px; overflow: hidden;">
            <div style="background: #153243; padding: 24px; text-align: center;">
              <h1 style="color: #C9985E; margin: 0; font-size: 22px;">${CHECKLIST_NAME}</h1>
            </div>
            <div style="padding: 24px; color: #3D5560; line-height: 1.7;">
              <p style="margin: 0 0 16px;">שלום ${name},</p>
              ${downloadUrl
                ? `<p style="margin: 0 0 20px;">תודה על הפנייה. הצ׳קליסט מחכה לכם כאן:</p>
                   <p style="margin: 0 0 20px;">
                     <a href="${escapeHtml(downloadUrl)}" style="display:inline-block;background:#27717F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">הורדת הצ׳קליסט</a>
                   </p>`
                : `<p style="margin: 0 0 20px;">תודה על הפנייה. הצ׳קליסט יישלח אליכם בהקדם.</p>`}
              <p style="margin: 0 0 16px;">לכל שאלה אפשר להשיב למייל הזה או להתקשר: <a href="tel:052-4337633" style="color:#27717F;">052-4337633</a>.</p>
              <p style="margin: 24px 0 0; font-size: 12px; color: #6C828B;">
                הצ׳קליסט הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי או תחליף לו.
              </p>
            </div>
          </div>
        `,
      })
    );

    return new Response(
      JSON.stringify({ success: true, downloadUrl }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "שגיאה בשרת", detail: String(e) }),
      { status: 500, headers: jsonHeaders }
    );
  }
}
