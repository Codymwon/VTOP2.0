import nodemailer from 'nodemailer';
import { config } from '../config.js';

export interface OtpDeliveryOptions {
  channel: 'EMAIL' | 'SMS';
  destination: string;
  otpCode: string;
  userName: string;
  userRole: 'student' | 'faculty' | 'admin';
}

export interface DeliveryResult {
  success: boolean;
  channel: 'EMAIL' | 'SMS';
  destination: string;
  maskedDestination: string;
  message: string;
  previewUrl?: string;
  realDispatched: boolean;
}

// Mask destination for security
export function maskDestination(dest: string, channel: 'EMAIL' | 'SMS'): string {
  if (channel === 'EMAIL') {
    const [local, domain] = dest.split('@');
    if (!domain) return dest;
    const visible = local.length > 2 ? local.slice(0, 3) : local.slice(0, 1);
    return `${visible}***@${domain}`;
  } else {
    // Phone masking: keep country code and last 4 digits
    const cleaned = dest.replace(/\s+/g, '');
    if (cleaned.length <= 4) return '***';
    const last4 = cleaned.slice(-4);
    const prefix = cleaned.slice(0, Math.min(3, cleaned.length - 4));
    return `${prefix}******${last4}`;
  }
}

// Create Nodemailer Transporter
function getEmailTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '');

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback: local dev transport with console logging
  return null;
}

export async function sendOtpEmail(
  toEmail: string,
  otpCode: string,
  userName: string
): Promise<{ success: boolean; previewUrl?: string; realDispatched: boolean }> {
  const transporter = getEmailTransporter();

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">VIT-AP UNIVERSITY</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #93c5fd;">VTOP 2.0 Identity & Access Management</p>
      </div>

      <div style="padding: 32px 24px; color: #1e293b;">
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #0f172a;">Two-Factor Authentication Security OTP</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px;">
          Dear <strong>${userName}</strong>,<br/>
          A sign-in attempt was initiated for your VTOP institutional portal. Please use the following 6-digit security One-Time Password (OTP) to authenticate:
        </p>

        <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e40af; font-family: monospace;">${otpCode}</span>
          <div style="margin-top: 8px; font-size: 12px; color: #64748b;">This OTP expires in 10 minutes (valid for 1 attempt)</div>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 16px;">
          <strong>Security Warning:</strong> Never share this code with anyone. Institutional staff or faculty will never ask for your VTOP OTP.
        </p>
      </div>

      <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        VIT-AP University • Inavolu, Beside AP Secretariat, Amaravati, Andhra Pradesh 522237<br/>
        This is an automated institutional security notification.
      </div>
    </div>
  `;

  if (transporter) {
    try {
      const fromAddr = process.env.SMTP_FROM || `"VTOP 2.0 Security" <${process.env.SMTP_USER}>`;
      await transporter.sendMail({
        from: fromAddr,
        to: toEmail,
        subject: `[VTOP 2.0] Security Authentication OTP: ${otpCode}`,
        html: htmlContent,
      });
      console.log(`[MAILER] 📧 Successfully sent real OTP email to: ${toEmail}`);
      return { success: true, realDispatched: true };
    } catch (err) {
      console.error('[MAILER] ⚠️ Error sending email via SMTP:', err);
      // Fallback to console simulation
    }
  }

  // Dev mode simulation when SMTP not configured or failed
  console.log(`\n======================================================`);
  console.log(`📧 [EMAIL OTP DISPATCH SIMULATION]`);
  console.log(`To: ${toEmail}`);
  console.log(`Recipient: ${userName}`);
  console.log(`OTP Code: >>> ${otpCode} <<<`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`ℹ️  To send to real inboxes, configure SMTP_HOST/USER/PASS in server/.env`);
  console.log(`======================================================\n`);

  return { success: true, realDispatched: false };
}

export async function sendOtpSms(
  toPhone: string,
  otpCode: string,
  userName: string
): Promise<{ success: boolean; realDispatched: boolean }> {
  // 1. Fast2SMS Integration (Instant Indian +91 numbers)
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  const digitsOnly = toPhone.replace(/\D/g, '');
  const tenDigitPhone = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

  if (fast2smsKey && tenDigitPhone.length === 10) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2smsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otpCode,
          numbers: tenDigitPhone,
        }),
      });

      const data: any = await response.json();
      if (data.return === true) {
        console.log(`[SMS] 📱 Real SMS sent via Fast2SMS to: ${tenDigitPhone}`);
        return { success: true, realDispatched: true };
      } else {
        if (data.status_code === 996) {
          console.warn(`[SMS] ⚠️ Fast2SMS Error: ${data.message} (Action: Visit fast2sms.com -> 'OTP Message' tab -> 'Website Verification' to enable OTP sending).`);
        } else {
          console.warn(`[SMS] Fast2SMS returned error (${data.status_code}):`, data.message || data);
        }
      }
    } catch (err) {
      console.error(`[SMS] Error sending SMS via Fast2SMS:`, err);
    }
  }

  // 2. Twilio Integration (Fallback for international numbers)
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioAuth && twilioPhone) {
    try {
      const authHeader = Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
      const body = new URLSearchParams({
        To: toPhone,
        From: twilioPhone,
        Body: `[VTOP 2.0] Your security OTP is ${otpCode}. Valid for 10 minutes. Do not share this code.`,
      });

      const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (resp.ok) {
        console.log(`[SMS] 📱 Real SMS sent via Twilio to: ${toPhone}`);
        return { success: true, realDispatched: true };
      } else {
        const errorText = await resp.text();
        console.warn(`[SMS] Twilio returned error:`, errorText);
      }
    } catch (err) {
      console.error(`[SMS] Failed to send SMS via Twilio:`, err);
    }
  }

  // Console simulation when API key not configured
  console.log(`\n======================================================`);
  console.log(`📱 [SMS OTP DISPATCH]`);
  console.log(`To Mobile: ${toPhone}`);
  console.log(`Recipient: ${userName}`);
  console.log(`SMS Text: [VTOP 2.0] Your security OTP is ${otpCode}. Valid for 10 minutes.`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`ℹ️  Add FAST2SMS_API_KEY in server/.env to send real SMS!`);
  console.log(`======================================================\n`);

  return { success: true, realDispatched: false };
}
