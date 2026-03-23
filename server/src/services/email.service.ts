import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
});

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

const emailBase = (content: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#1a1a18;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a18;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#242420;border-radius:8px;overflow:hidden;max-width:600px;">
        <tr>
          <td style="background:#2C4233;padding:32px 40px;text-align:center;">
            <p style="margin:0;color:#b8c9b0;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Columbia Gorge</p>
            <h1 style="margin:8px 0 0;color:#F4F4F3;font-size:24px;font-weight:400;letter-spacing:2px;">GETAWAYS</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;color:#c8c4be;line-height:1.7;font-size:15px;">
            ${content}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #333;text-align:center;">
            <p style="margin:0;color:#666;font-size:12px;">Columbia Gorge Getaways · Stevenson, WA 98648</p>
            <p style="margin:4px 0 0;color:#666;font-size:12px;">(509) 427-CAMP · hello@columbiagorgegetaways.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

interface BookingData {
  id: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  roomSubtotal: number;
  enhancementsSubtotal: number;
  totalAmountCents: number;
  specialRequests?: string | null;
  accommodation: { name: string; type: string };
  enhancements: Array<{ service: { name: string }; priceSnapshot: number }>;
}

export async function sendBookingConfirmation(booking: BookingData): Promise<void> {
  const enhancementsHtml = booking.enhancements.length > 0
    ? booking.enhancements.map(e =>
        `<tr><td style="padding:8px 0;color:#b8c9b0;">${e.service.name}</td><td style="padding:8px 0;text-align:right;">${formatCurrency(e.priceSnapshot)}</td></tr>`
      ).join('')
    : '';

  const html = emailBase(`
    <h2 style="color:#F4F4F3;font-size:20px;font-weight:400;margin:0 0 24px;">Your Reservation is Confirmed</h2>
    <p>Dear ${booking.guestFirstName},</p>
    <p>We're delighted to confirm your reservation at Columbia Gorge Getaways. We look forward to welcoming you.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #333;border-radius:4px;">
      <tr style="background:#2a2a26;">
        <td colspan="2" style="padding:12px 16px;color:#b8c9b0;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Booking Summary</td>
      </tr>
      <tr><td style="padding:10px 16px;border-top:1px solid #333;">Booking ID</td><td style="padding:10px 16px;border-top:1px solid #333;text-align:right;color:#F4F4F3;">${booking.id}</td></tr>
      <tr><td style="padding:10px 16px;border-top:1px solid #333;">Accommodation</td><td style="padding:10px 16px;border-top:1px solid #333;text-align:right;color:#F4F4F3;">${booking.accommodation.name}</td></tr>
      <tr><td style="padding:10px 16px;border-top:1px solid #333;">Check-in</td><td style="padding:10px 16px;border-top:1px solid #333;text-align:right;color:#F4F4F3;">${formatDate(booking.checkIn)}</td></tr>
      <tr><td style="padding:10px 16px;border-top:1px solid #333;">Check-out</td><td style="padding:10px 16px;border-top:1px solid #333;text-align:right;color:#F4F4F3;">${formatDate(booking.checkOut)}</td></tr>
      <tr><td style="padding:10px 16px;border-top:1px solid #333;">Nights</td><td style="padding:10px 16px;border-top:1px solid #333;text-align:right;color:#F4F4F3;">${booking.nights}</td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr><td style="padding:8px 0;color:#b8c9b0;">${booking.accommodation.name} (${booking.nights} nights)</td><td style="padding:8px 0;text-align:right;">${formatCurrency(booking.roomSubtotal)}</td></tr>
      ${enhancementsHtml}
      <tr style="border-top:1px solid #444;">
        <td style="padding:12px 0 0;color:#F4F4F3;font-size:17px;">Total Charged</td>
        <td style="padding:12px 0 0;text-align:right;color:#F4F4F3;font-size:17px;">${formatCurrency(booking.totalAmountCents / 100)}</td>
      </tr>
    </table>

    ${booking.specialRequests ? `<p><strong style="color:#F4F4F3;">Special Requests:</strong> ${booking.specialRequests}</p>` : ''}

    <p style="margin-top:32px;">Check-in is at 3:00 PM. If you have any questions before your stay, don't hesitate to reach out.</p>
    <p>With warmth,<br><span style="color:#b8c9b0;">The Columbia Gorge Getaways Team</span></p>
  `);

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: booking.guestEmail,
      subject: `Booking Confirmed — ${booking.accommodation.name} · ${formatDate(booking.checkIn)}`,
      html,
    });
  } catch (err) {
    console.error('[Email] Failed to send booking confirmation:', err);
  }
}

export async function sendBookingNotification(booking: BookingData): Promise<void> {
  const html = emailBase(`
    <h2 style="color:#F4F4F3;font-size:20px;font-weight:400;margin:0 0 24px;">New Booking Received</h2>
    <p><strong style="color:#F4F4F3;">Guest:</strong> ${booking.guestFirstName} ${booking.guestLastName} (${booking.guestEmail})</p>
    <p><strong style="color:#F4F4F3;">Accommodation:</strong> ${booking.accommodation.name}</p>
    <p><strong style="color:#F4F4F3;">Dates:</strong> ${formatDate(booking.checkIn)} → ${formatDate(booking.checkOut)} (${booking.nights} nights)</p>
    <p><strong style="color:#F4F4F3;">Total:</strong> ${formatCurrency(booking.totalAmountCents / 100)}</p>
    <p><strong style="color:#F4F4F3;">Booking ID:</strong> ${booking.id}</p>
    ${booking.specialRequests ? `<p><strong style="color:#F4F4F3;">Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
  `);

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: env.EMAIL_ADMIN,
      subject: `New Booking: ${booking.guestFirstName} ${booking.guestLastName} — ${booking.accommodation.name}`,
      html,
    });
  } catch (err) {
    console.error('[Email] Failed to send booking notification:', err);
  }
}

export async function sendContactAutoReply(name: string, toEmail: string): Promise<void> {
  const html = emailBase(`
    <h2 style="color:#F4F4F3;font-size:20px;font-weight:400;margin:0 0 24px;">Thank You for Reaching Out</h2>
    <p>Dear ${name},</p>
    <p>Thank you for contacting Columbia Gorge Getaways. We've received your message and a member of our team will be in touch within 24 hours.</p>
    <p>In the meantime, you're welcome to explore our <a href="http://localhost:5173/stay-with-us" style="color:#b8c9b0;">available accommodations</a> or read answers to <a href="http://localhost:5173/faqs" style="color:#b8c9b0;">frequently asked questions</a>.</p>
    <p>With warmth,<br><span style="color:#b8c9b0;">The Columbia Gorge Getaways Team</span></p>
  `);

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: toEmail,
      subject: 'We received your message — Columbia Gorge Getaways',
      html,
    });
  } catch (err) {
    console.error('[Email] Failed to send contact auto-reply:', err);
  }
}

export async function sendContactNotification(
  name: string,
  email: string,
  message: string
): Promise<void> {
  const html = emailBase(`
    <h2 style="color:#F4F4F3;font-size:20px;font-weight:400;margin:0 0 24px;">New Contact Submission</h2>
    <p><strong style="color:#F4F4F3;">From:</strong> ${name} (${email})</p>
    <div style="margin:16px 0;padding:16px;background:#2a2a26;border-radius:4px;border-left:3px solid #2C4233;">
      <p style="margin:0;white-space:pre-wrap;">${message}</p>
    </div>
  `);

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: env.EMAIL_ADMIN,
      subject: `Contact Form: ${name}`,
      html,
    });
  } catch (err) {
    console.error('[Email] Failed to send contact notification:', err);
  }
}
