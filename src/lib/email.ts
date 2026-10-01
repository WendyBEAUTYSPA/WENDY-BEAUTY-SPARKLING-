export async function sendEmail(params: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Wendy Beauty & Spa <onboarding@resend.dev>";
  if (!apiKey) {
    console.log("--- RESEND_API_KEY not set — logging email instead of sending ---");
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    console.log(params.html);
    return { logged: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: params.to, subject: params.subject, html: params.html })
  });
  if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.message || "Failed to send email"); }
  return res.json();
}