const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    if (!body.name || !body.phone || !body.email) {
      return new Response(
        JSON.stringify({ error: "שם, טלפון ומייל הם שדות חובה" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
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
                  <td style="padding: 12px; border-bottom: 1px solid #eee; color: #555;">${body.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">טלפון:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; color: #555;"><a href="tel:${body.phone}" style="color: #C9A962;">${body.phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">מייל:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; color: #555;"><a href="mailto:${body.email}" style="color: #C9A962;">${body.email}</a></td>
                </tr>
                ${body.subject ? `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">נושא:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; color: #555;">${body.subject}</td>
                </tr>` : ""}
              </table>
              ${body.message ? `
              <div style="margin-top: 20px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #eee;">
                <strong style="color: #333;">הודעה:</strong>
                <p style="color: #555; line-height: 1.6; margin: 8px 0 0;">${body.message.replace(/\n/g, "<br>")}</p>
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
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "שגיאה בשרת", detail: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
