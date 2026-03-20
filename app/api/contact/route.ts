import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    const safeName    = escapeHtml(name.trim());
    const safeEmail   = escapeHtml(email.trim());
    const safeSubject = escapeHtml(subject.trim());
    const safeMessage = escapeHtml(message.trim());

    const service = createServiceClient();

    // Save to Supabase
    const { error: dbError } = await service.from("contact_messages").insert({
      name: safeName,
      email: safeEmail,
      subject: safeSubject,
      message: safeMessage,
      status: "unread",
    });

    if (dbError) throw dbError;

    // Send email notification via Resend
    const toEmail = process.env.CONTACT_EMAIL!;
    await resend.emails.send({
      from: "EMEREN Contact Form <onboarding@resend.dev>",
      to: toEmail,
      subject: `New Message: ${safeSubject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f7f4; border-radius: 12px;">
          <div style="background: #d97706; padding: 16px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #fff; margin: 0; font-size: 18px;">New Contact Message — EMEREN</h2>
          </div>
          <div style="background: #fff; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280; width: 80px; font-weight: 600;">Name</td>
                <td style="padding: 8px 0; font-size: 14px; color: #1a1a2e;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280; font-weight: 600;">Email</td>
                <td style="padding: 8px 0; font-size: 14px; color: #1a1a2e;"><a href="mailto:${safeEmail}" style="color: #d97706;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280; font-weight: 600;">Subject</td>
                <td style="padding: 8px 0; font-size: 14px; color: #1a1a2e;">${safeSubject}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="font-size: 13px; color: #6b7280; font-weight: 600; margin: 0 0 8px;">Message</p>
            <p style="font-size: 14px; color: #374151; line-height: 1.7; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
          </div>
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 16px;">Sent from emeren.com.ph contact form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
