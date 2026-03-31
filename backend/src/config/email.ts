import { google } from 'googleapis';
import { ContactEmailData } from '../types/index.js';
import dotenv from 'dotenv';

dotenv.config();

const OAuth2 = google.auth.OAuth2;

class EmailConfig {
  private createTransporter = async () => {
    const oauth2Client = new OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
  };

  /**
   * Helper to encode email for Gmail API
   */
  private encodeMessage(message: string) {
    return Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const gmail = await this.createTransporter();
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${baseUrl}/auth/verify?token=${token}`;

    const subject = 'Verify your Account - Ūgwati wa Gĩkũyũ';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    
    const messageParts = [
      `From: "Ūgwati wa Gĩkũyũ" <${process.env.SMTP_USER}>`,
      `To: ${email}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>Welcome, ${name}!</h2>
        <p>Click below to verify your email:</p>
        <a href="${url}" style="background: #c9a87c; color: white; padding: 10px 20px; text-decoration: none;">Verify Email</a>
      </div>`
    ];

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: this.encodeMessage(messageParts.join('\n')) },
    });
  }

  async sendContactConfirmation(data: ContactEmailData): Promise<void> {
    const gmail = await this.createTransporter();
    const subject = 'We received your message - Ūgwati wa Gĩkũyũ';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

    const messageParts = [
      `From: "Ūgwati wa Gĩkũyũ" <${process.env.SMTP_USER}>`,
      `To: ${data.email}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      `<div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #c9a87c;">Thank You for Contacting Us!</h2>
        <p>Dear ${data.name},</p>
        <p>We have received your message regarding: <strong>${data.subject}</strong></p>
        <div style="background: #f5f1ed; padding: 20px; border-radius: 8px;">
          <p>${data.message}</p>
        </div>
        <p>Best regards,<br>The Ūgwati wa Gĩkũyũ Team</p>
      </div>`
    ];

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: this.encodeMessage(messageParts.join('\n')) },
    });
  }

  async sendAdminNotification(data: ContactEmailData): Promise<void> {
    const gmail = await this.createTransporter();
    const subject = `New Contact Form Submission - ${data.subject}`;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

    const messageParts = [
      `From: "Ūgwati Contact Form" <${process.env.SMTP_USER}>`,
      `To: ${process.env.SMTP_USER}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      `<h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>`
    ];

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: this.encodeMessage(messageParts.join('\n')) },
    });
  }
}

export default new EmailConfig();