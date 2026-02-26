import { jsPDF } from "jspdf";

interface BookingPdfData {
  bookingId: number;
  customerName: string | null;
  customerEmail: string | null;
  tourTitle: string | null;
  date: string | null;
  shiftName: string | null;
  shiftStartTime: string | null;
  shiftEndTime: string | null;
  guestNumber: number | null;
  tourPrice: number | null;
  additionalInfo: string | null;
  selectedSpecialties?: Array<{
    name: string;
    price: number;
    description?: string;
  }> | null;
  paymentBrand: string | null;
  paymentLast4: string | null;
  paymentExpMonth?: number | null;
  paymentExpYear?: number | null;
  paymentCurrency?: string | null;
  receiptUrl?: string | null;
  /** Base-64 data URL of the logo image (e.g. data:image/png;base64,...) */
  logoDataUrl?: string | null;
}

/**
 * Generates a professional booking confirmation PDF and returns it as a Blob.
 * Uses jsPDF for zero-dependency client-side generation.
 */
export function generateBookingPdf(data: BookingPdfData): Blob {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 20;

  // ── Brand colours matching globals.css ──
  const primary: [number, number, number] = [51, 83, 88]; // #335358
  const accent: [number, number, number] = [214, 152, 80]; // #d69850
  const neutralDark: [number, number, number] = [119, 71, 56]; // #774738
  const secondary: [number, number, number] = [105, 131, 106]; // #69836a
  const bgLight: [number, number, number] = [248, 241, 221]; // #f8f1dd

  // ── Top accent bar ──
  doc.setFillColor(...accent);
  doc.rect(0, 0, pageW, 5, "F");

  // ── Header background ──
  const headerH = 38;
  doc.setFillColor(...primary);
  doc.rect(0, 5, pageW, headerH, "F");

  // ── Logo + brand name inside header ──
  // Logo is oval/circular — keep 1:1 (square) dimensions so it never squishes
  const logoSize = 20; // equal width & height preserves the circular badge shape
  const logoY = 5 + (headerH - logoSize) / 2;

  if (data.logoDataUrl) {
    try {
      doc.addImage(data.logoDataUrl, "WEBP", margin, logoY, logoSize, logoSize);
    } catch {
      // ignore; brand text still renders
    }
  }

  // Brand name to the right of the logo
  const textX = data.logoDataUrl ? margin + logoSize + 6 : margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(248, 241, 221); // #f8f1dd cream
  doc.text("Know A Local", textX, logoY + logoSize * 0.6);

  y = 5 + headerH;

  // ── Document title (below header) ──
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...secondary);
  doc.text("BOOKING CONFIRMATION", margin, y);

  // ── Booking ID badge ──
  const idText = `#${data.bookingId}`;
  doc.setFontSize(11);
  const idW = doc.getTextWidth(idText) + 8;
  doc.setFillColor(...bgLight);
  doc.roundedRect(pageW - margin - idW, y - 5.5, idW, 8, 2, 2, "F");
  doc.setTextColor(...primary);
  doc.setFont("helvetica", "bold");
  doc.text(idText, pageW - margin - idW + 4, y);

  // ── Divider ──
  y += 8;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);

  // ── Helper: draw a label-value row ──
  const drawRow = (
    label: string,
    value: string,
    options?: { bold?: boolean; color?: [number, number, number] },
  ) => {
    y += 9;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...secondary);
    doc.text(label, margin, y);

    doc.setFont("helvetica", options?.bold ? "bold" : "normal");
    doc.setFontSize(10);
    doc.setTextColor(...(options?.color ?? neutralDark));

    // Wrap long values
    const maxValW = contentW - 50;
    const lines = doc.splitTextToSize(value, maxValW);
    doc.text(lines, margin + 50, y);
    if (lines.length > 1) {
      y += (lines.length - 1) * 5;
    }
  };

  // ── Booking details section ──
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primary);
  doc.text("Booking Details", margin, y);

  if (data.tourTitle) drawRow("Tour", data.tourTitle, { bold: true });

  if (data.date) {
    const formatted = new Date(data.date + "T00:00:00").toLocaleDateString(
      "en-US",
      { weekday: "long", year: "numeric", month: "long", day: "numeric" },
    );
    drawRow("Date", formatted);
  }

  if (data.shiftName) {
    const shiftVal =
      data.shiftStartTime && data.shiftEndTime
        ? `${data.shiftName} (${data.shiftStartTime} – ${data.shiftEndTime})`
        : data.shiftName;
    drawRow("Shift", shiftVal);
  }

  if (data.guestNumber != null) {
    drawRow(
      "Guests",
      `${data.guestNumber} ${data.guestNumber === 1 ? "person" : "people"}`,
    );
  }

  if (data.additionalInfo) {
    drawRow("Special Requests", data.additionalInfo);
  }

  // ── Add-ons section ──
  if (data.selectedSpecialties && data.selectedSpecialties.length > 0) {
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...primary);
    doc.text("Add-ons Selected", margin, y);

    data.selectedSpecialties.forEach((s) => {
      const guests = data.guestNumber ?? 1;
      const lineTotal = s.price * guests;
      const priceLabel =
        s.price > 0
          ? guests > 1
            ? `$${s.price.toFixed(2)} x ${guests} = $${lineTotal.toFixed(2)}`
            : `+$${s.price.toFixed(2)}`
          : "Free";
      drawRow(s.name, priceLabel, {
        color: accent,
      });
      if (s.description) {
        y += 4;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(160, 160, 160);
        const descLines = doc.splitTextToSize(s.description, contentW - 50);
        doc.text(descLines, margin + 50, y);
        if (descLines.length > 1) y += (descLines.length - 1) * 4;
      }
    });
  } else {
    drawRow("Add-ons", "None selected");
  }
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primary);
  doc.text("Customer Details", margin, y);

  if (data.customerName) drawRow("Name", data.customerName);
  if (data.customerEmail) drawRow("Email", data.customerEmail);

  // ── Payment section ──
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primary);
  doc.text("Payment", margin, y);

  if (data.tourPrice != null) {
    const currency = (data.paymentCurrency ?? "usd").toUpperCase();
    drawRow("Amount Paid", `${currency} $${data.tourPrice.toFixed(2)}`, {
      bold: true,
      color: accent,
    });
  }

  if (data.paymentBrand && data.paymentLast4) {
    const brand =
      data.paymentBrand.charAt(0).toUpperCase() + data.paymentBrand.slice(1);
    let cardLine = `${brand} •••• ${data.paymentLast4}`;
    if (data.paymentExpMonth && data.paymentExpYear) {
      const month = String(data.paymentExpMonth).padStart(2, "0");
      cardLine += `  (Exp ${month}/${data.paymentExpYear})`;
    }
    drawRow("Card", cardLine);
  }

  // ── Status badges (pill-style) ──
  const drawStatusBadge = (label: string, badgeText: string) => {
    y += 9;
    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...secondary);
    doc.text(label, margin, y);

    // Green pill background
    const green: [number, number, number] = [22, 163, 74];
    const lightGreen: [number, number, number] = [220, 252, 231];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const badgeW = doc.getTextWidth(badgeText) + 10;
    const badgeH = 6.5;
    const badgeX = margin + 50;
    const badgeY = y - badgeH + 1.5;

    // Filled pill
    doc.setFillColor(...lightGreen);
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 3, 3, "F");

    // Border
    doc.setDrawColor(...green);
    doc.setLineWidth(0.3);
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 3, 3, "S");

    // Text
    doc.setTextColor(...green);
    doc.text(badgeText, badgeX + 5, y - 0.5);
  };

  drawStatusBadge("Payment Status", "PAID");
  drawStatusBadge("Booking Status", "CONFIRMED");

  if (data.receiptUrl) {
    // Print truncated receipt URL as plain text (no hyperlink in PDF)
    drawRow("Stripe Receipt", data.receiptUrl);
  }

  // ── Footer ──
  y += 18;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Thank you for booking with Know a Local! If you have any questions,",
    margin,
    y,
  );
  y += 5;
  doc.text(
    "please contact us at support@knowalocal.com or via WhatsApp.",
    margin,
    y,
  );

  y += 8;
  doc.setFontSize(7.5);
  doc.setTextColor(180, 180, 180);
  doc.text(
    `Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`,
    margin,
    y,
  );

  // ── Bottom accent bar ──
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...accent);
  doc.rect(0, pageH - 4, pageW, 4, "F");

  return doc.output("blob");
}

/**
 * Fetches the Know a Local logo and returns a base-64 data URL.
 * Returns null in environments where fetch is unavailable (SSR/tests).
 */
export async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/Logo/logo.webp");
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    );
    return `data:image/webp;base64,${base64}`;
  } catch {
    return null;
  }
}

/**
 * Triggers a browser download of the booking PDF.
 * Automatically loads the logo image before generating the PDF.
 */
export async function downloadBookingPdf(data: BookingPdfData) {
  const logoDataUrl = await loadLogoDataUrl();
  const blob = generateBookingPdf({ ...data, logoDataUrl });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `booking-confirmation-${data.bookingId}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
