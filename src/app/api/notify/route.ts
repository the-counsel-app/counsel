import { NextRequest } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { caseId, qualifyingSignal, incidentSummary, injuriesClaimed, caseUrl } =
    await req.json();

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ATTORNEY_EMAIL;

  if (!apiKey || !to) {
    return Response.json({ ok: true, mock: true });
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? "Counsel Intake <onboarding@resend.dev>";

  const injuryList = Array.isArray(injuriesClaimed)
    ? injuriesClaimed.map((i: string) => `<li>${i}</li>`).join("")
    : "";

  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
  <div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0">
    <span style="color:#c9a84c;font-weight:700;letter-spacing:0.1em;font-size:14px">COUNSEL</span>
    <span style="color:#475569;font-size:12px;float:right;line-height:2">Confidential · Attorney Review</span>
  </div>
  <div style="border:1px solid #e2e8f0;border-top:none;padding:28px 24px;border-radius:0 0 8px 8px">
    <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a">New PI Intake</h2>
    <p style="margin:0 0 20px;color:#64748b;font-size:14px">Case Ref: ${caseId?.slice(0, 8).toUpperCase() ?? "—"}</p>

    <h3 style="margin:0 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b">Incident Summary</h3>
    <p style="margin:0 0 20px;font-size:15px;color:#1e293b">${incidentSummary}</p>

    <h3 style="margin:0 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b">Injuries Claimed</h3>
    <ul style="margin:0 0 24px;padding-left:20px;font-size:15px;color:#1e293b">${injuryList}</ul>

    <a href="${caseUrl}" style="display:inline-block;background:#c9a84c;color:#0f172a;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none">
      View Full Case Packet →
    </a>

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8">
      This communication is confidential and intended for attorney use only.
    </p>
  </div>
</div>`;

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `New PI intake — ${qualifyingSignal}`,
    html,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
