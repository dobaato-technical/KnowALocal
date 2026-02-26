/**
 * POST /api/payments/send-confirmation-email
 *
 * Accepts a base64-encoded PDF and full booking metadata, then sends a
 * production-quality confirmation email with the PDF attached via Nodemailer.
 *
 * Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 * Optional env var:  SMTP_SECURE (defaults to "false")
 */

import { sendMail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      to,
      customerName,
      bookingId,
      tourTitle,
      date,
      shiftName,
      shiftTime,
      guestNumber,
      tourPrice,
      paymentBrand,
      paymentLast4,
      paymentExpMonth,
      paymentExpYear,
      paymentCurrency,
      receiptUrl,
      pdfBase64,
      selectedSpecialties,
    }: {
      to: string;
      customerName: string;
      bookingId: number;
      tourTitle: string;
      date?: string;
      shiftName?: string;
      shiftTime?: string;
      guestNumber?: number;
      tourPrice?: number;
      paymentBrand?: string;
      paymentLast4?: string;
      paymentExpMonth?: number;
      paymentExpYear?: number;
      paymentCurrency?: string;
      receiptUrl?: string;
      pdfBase64: string;
      selectedSpecialties?: Array<{
        name: string;
        price: number;
        description?: string;
      }>;
    } = body;

    if (!to || !pdfBase64 || !bookingId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // ── Logo public URL (avoids base64 embedding that causes Gmail clipping) ──
    // Logo intentionally omitted from email to keep size under Gmail's 102 KB clip limit.

    const subject = `Booking Confirmed #${bookingId} — ${tourTitle || "Know a Local"}`;

    // ── Format helpers ────────────────────────────────────────────────────────
    const formattedDate = date
      ? new Date(date + "T00:00:00").toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

    const brandFormatted = paymentBrand
      ? paymentBrand.charAt(0).toUpperCase() + paymentBrand.slice(1)
      : null;

    const cardLine =
      brandFormatted && paymentLast4
        ? `${brandFormatted} •••• ${paymentLast4}${paymentExpMonth && paymentExpYear ? `  (Exp ${String(paymentExpMonth).padStart(2, "0")}/${paymentExpYear})` : ""}`
        : null;

    const currency = (paymentCurrency ?? "USD").toUpperCase();
    const amountFormatted =
      tourPrice != null ? `${currency} $${tourPrice.toFixed(2)}` : null;

    // ── Row builder helper ────────────────────────────────────────────────────
    const row = (label: string, value: string, valueStyle = "") => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ede8db;color:#69836a;font-size:13px;width:130px;vertical-align:top;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #ede8db;font-size:14px;font-weight:600;color:#335358;${valueStyle}">${value}</td>
      </tr>`;

    // ── HTML email template ───────────────────────────────────────────────────
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed – Know a Local</title>
</head>
<body style="margin:0;padding:0;background:#f0ede4;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Top accent bar -->
          <tr>
            <td style="background:#d69850;height:5px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header – brand name only (no logo image to keep email under Gmail 102 KB clip limit) -->
          <tr>
            <td style="background:#335358;padding:28px 36px;">
              <span style="font-size:26px;font-weight:800;color:#f8f1dd;letter-spacing:-0.5px;line-height:1;">Know A Local</span>
              <p style="margin:10px 0 0;color:#d69850;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Booking Confirmation</p>
            </td>
          </tr>

          <!-- Hero message -->
          <tr>
            <td style="padding:32px 36px 8px;text-align:center;">
              <div style="display:inline-block;background:#edf7ee;border-radius:50%;padding:14px;margin-bottom:12px;">
                <span style="font-size:32px;">✓</span>
              </div>
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#335358;">Booking Confirmed!</h1>
              <p style="margin:0;font-size:15px;color:#69836a;">
                Hi <strong style="color:#335358;">${customerName || "there"}</strong>, your booking is confirmed and ready to go.
              </p>
            </td>
          </tr>

          <!-- Booking ID badge -->
          <tr>
            <td style="padding:20px 36px 0;text-align:center;">
              <div style="display:inline-block;background:#f8f1dd;border:1.5px solid #d69850;border-radius:8px;padding:10px 24px;">
                <span style="font-size:12px;color:#69836a;letter-spacing:1.5px;text-transform:uppercase;">Booking ID</span><br/>
                <span style="font-size:22px;font-weight:800;color:#335358;">#${bookingId}</span>
              </div>
            </td>
          </tr>

          <!-- Booking details section -->
          <tr>
            <td style="padding:28px 36px 0;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#d69850;">Tour Details</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${tourTitle ? row("Tour", tourTitle) : ""}
                ${formattedDate ? row("Date", formattedDate) : ""}
                ${shiftName ? row("Session", `${shiftName}${shiftTime ? `<br/><span style="font-weight:400;font-size:13px;color:#69836a;">${shiftTime}</span>` : ""}`) : ""}
                ${guestNumber != null ? row("Guests", `${guestNumber} ${guestNumber === 1 ? "person" : "people"}`) : ""}
              </table>
            </td>
          </tr>

          <!-- Add-ons section -->
          <tr>
            <td style="padding:24px 36px 0;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#d69850;">Add-ons Selected</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${
                  selectedSpecialties && selectedSpecialties.length > 0
                    ? selectedSpecialties
                        .map((s) => {
                          const guests = guestNumber ?? 1;
                          const lineTotal = s.price * guests;
                          const priceLabel =
                            s.price > 0
                              ? guests > 1
                                ? `$${s.price.toFixed(2)} &times; ${guests} = <strong style="color:#16a34a;">$${lineTotal.toFixed(2)}</strong>`
                                : `+$${s.price.toFixed(2)}`
                              : "Free";
                          return row(
                            s.name,
                            priceLabel,
                            s.price > 0 ? "color:#16a34a;" : "",
                          );
                        })
                        .join("")
                    : row("Add-ons", "None selected")
                }
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px 0;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#d69850;">Payment Summary</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${amountFormatted ? row("Amount Paid", amountFormatted, "color:#16a34a;") : ""}
                ${cardLine ? row("Card", cardLine) : ""}
                ${row("Payment Status", '<span style="display:inline-block;background:#edf7ee;color:#16a34a;padding:2px 10px;border-radius:20px;font-size:12px;">Paid ✓</span>')}
                ${row("Booking Status", '<span style="display:inline-block;background:#edf7ee;color:#16a34a;padding:2px 10px;border-radius:20px;font-size:12px;">Confirmed ✓</span>')}
              </table>
              ${
                receiptUrl
                  ? `
              <div style="margin-top:14px;">
                <a href="${receiptUrl}" target="_blank" rel="noreferrer"
                  style="display:inline-block;background:#335358;color:#f8f1dd;text-decoration:none;font-size:13px;font-weight:700;padding:10px 22px;border-radius:8px;letter-spacing:0.3px;">
                  View Stripe Receipt &rarr;
                </a>
              </div>`
                  : ""
              }
            </td>
          </tr>

          <!-- PDF note -->
          <tr>
            <td style="padding:24px 36px 0;">
              <div style="background:#f8f1dd;border-left:3px solid #d69850;border-radius:0 8px 8px 0;padding:14px 16px;">
                <p style="margin:0;font-size:13px;color:#774738;font-weight:600;">📎 Your booking confirmation is attached as a PDF.</p>
                <p style="margin:4px 0 0;font-size:12px;color:#69836a;">Please download it and keep it for your records.</p>
              </div>
            </td>
          </tr>

          <!-- Contact / help -->
          <tr>
            <td style="padding:24px 36px;">
              <p style="margin:0 0 8px;font-size:13px;color:#69836a;">Need help? We're always here for you:</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:16px;">
                    <a href="mailto:support@knowalocal.com" style="font-size:13px;color:#335358;text-decoration:none;font-weight:600;">✉ support@knowalocal.com</a>
                  </td>
                  <td>
                    <a href="https://wa.me/message/YOURWHATSAPP" style="font-size:13px;color:#335358;text-decoration:none;font-weight:600;">💬 WhatsApp</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#335358;padding:20px 36px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#d69850;font-weight:700;">Know a Local</p>
              <p style="margin:0;font-size:11px;color:#a8bfb1;">Authentic local experiences, worldwide.</p>
              <p style="margin:10px 0 0;font-size:10px;color:#7a9b8a;">
                You're receiving this because you made a booking with us.
                © ${new Date().getFullYear()} Know a Local. All rights reserved.
              </p>
            </td>
          </tr>

          <!-- Bottom accent bar -->
          <tr>
            <td style="background:#d69850;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = [
      `Booking Confirmed! ✓`,
      ``,
      `Hi ${customerName || "there"}, your booking is confirmed.`,
      ``,
      `Booking ID: #${bookingId}`,
      tourTitle ? `Tour: ${tourTitle}` : "",
      formattedDate ? `Date: ${formattedDate}` : "",
      shiftName
        ? `Session: ${shiftName}${shiftTime ? ` (${shiftTime})` : ""}`
        : "",
      guestNumber != null ? `Guests: ${guestNumber}` : "",
      ``,
      `── Add-ons ──`,
      ...(selectedSpecialties && selectedSpecialties.length > 0
        ? selectedSpecialties.map((s) => {
            const guests = guestNumber ?? 1;
            const lineTotal = s.price * guests;
            const priceText =
              s.price > 0
                ? guests > 1
                  ? `$${s.price.toFixed(2)} x ${guests} = $${lineTotal.toFixed(2)}`
                  : `+$${s.price.toFixed(2)}`
                : "Free";
            return `${s.name}: ${priceText}`;
          })
        : ["None selected"]),
      ``,
      `── Payment ──`,
      amountFormatted ? `Amount Paid: ${amountFormatted}` : "",
      cardLine ? `Card: ${cardLine}` : "",
      `Payment Status: Paid ✓`,
      `Booking Status: Confirmed ✓`,
      receiptUrl ? `View Stripe Receipt: ${receiptUrl}` : "",
      ``,
      `Your booking confirmation PDF is attached to this email.`,
      ``,
      `Questions? Email us at support@knowalocal.com or reach out on WhatsApp.`,
      ``,
      `— Know a Local Team`,
    ]
      .filter((l) => l !== undefined && l !== null)
      .join("\n");

    const attachments: Parameters<typeof sendMail>[0]["attachments"] = [
      {
        filename: `booking-confirmation-${bookingId}.pdf`,
        content: Buffer.from(pdfBase64, "base64"),
      },
    ];

    await sendMail({
      to,
      subject,
      text,
      html,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
