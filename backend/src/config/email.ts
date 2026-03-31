// import { Resend } from 'resend';
// import { ContactEmailData } from '../types/index.js';
// import dotenv from 'dotenv';

// dotenv.config();

// class EmailConfig {
//   private resend: Resend;
//   private fromEmail: string;

//   constructor() {
//     // Initialize Resend with your API Key
//     this.resend = new Resend(process.env.RESEND_API_KEY);
    
//     // On Resend Free Tier, you MUST use this 'from' address unless you verify a domain
//     this.fromEmail = 'onboarding@resend.dev'; 
    
//     console.log('🚀 Resend Email Service Initialized');
//   }

//   async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
//     const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
//     const url = `${baseUrl}/auth/verify?token=${token}`;

//     const { data, error } = await this.resend.emails.send({
//       from: `Ūgwati wa Gĩkũyũ <${this.fromEmail}>`,
//       to: email,
//       subject: 'Verify your Account - Ūgwati wa Gĩkũyũ',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0d9d1; padding: 20px; border-radius: 10px;">
//           <h2 style="color: #5a4a3a; text-align: center;">Welcome to the Archive, ${name}!</h2>
//           <p>Thank you for joining Ūgwati wa Gĩkũyũ. To start contributing and preserving our heritage, please verify your email address.</p>
//           <div style="text-align: center; margin: 30px 0;">
//             <a href="${url}" style="background-color: #c9a87c; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify My Email</a>
//           </div>
//           <p style="font-size: 0.8rem; color: #666;">If the button above doesn't work, copy and paste this link into your browser:</p>
//           <p style="font-size: 0.8rem; color: #c9a87c; word-break: break-all;">${url}</p>
//           <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
//           <p style="color: #8b6f47; font-size: 0.9rem; text-align: center;">Helping preserve the history of the Gĩkũyũ people.</p>
//         </div>
//       `,
//     });

//     if (error) {
//       console.error('❌ Resend verification error:', error);
//       throw new Error('Failed to send verification email');
//     }
//     console.log('📧 Verification email sent via Resend:', data?.id);
//   }

//   async sendContactConfirmation(data: ContactEmailData): Promise<void> {
//     const { error } = await this.resend.emails.send({
//       from: `Ūgwati wa Gĩkũyũ <${this.fromEmail}>`,
//       to: data.email,
//       subject: 'We received your message - Ūgwati wa Gĩkũyũ',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #c9a87c;">Thank You for Contacting Us!</h2>
//           <p>Dear ${data.name},</p>
//           <p>We have received your message regarding: <strong>${data.subject}</strong></p>
//           <p>Our team will review your inquiry and respond within 24-48 hours.</p>
//           <div style="background: #f5f1ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3 style="margin-top: 0;">Your Message:</h3>
//             <p style="white-space: pre-wrap;">${data.message}</p>
//           </div>
//           <p style="color: #5a4a3a;">Best regards,<br>The Ūgwati wa Gĩkũyũ Team</p>
//         </div>
//       `,
//     });

//     if (error) console.error('❌ Resend contact error:', error);
//   }

//   async sendAdminNotification(data: ContactEmailData): Promise<void> {
//     // Note: On free tier, 'to' must be your verified signup email
//     const { error } = await this.resend.emails.send({
//       from: `Ūgwati Contact Form <${this.fromEmail}>`,
//       to: process.env.SMTP_USER || 'your-signup-email@gmail.com', 
//       subject: `New Contact Form Submission - ${data.subject}`,
//       html: `
//         <h2>New Contact Form Submission</h2>
//         <p><strong>Name:</strong> ${data.name}</p>
//         <p><strong>Email:</strong> ${data.email}</p>
//         <p><strong>Subject:</strong> ${data.subject}</p>
//         <p><strong>Message:</strong></p>
//         <p style="white-space: pre-wrap;">${data.message}</p>
//         <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
//       `,
//     });

//     if (error) console.error('❌ Resend admin notification error:', error);
//   }
// }

// export default new EmailConfig();

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

    // This gets a fresh access token every time
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) reject("Failed to create access token :(");
        resolve(token);
      });
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
  };

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const gmail = await this.createTransporter();
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${baseUrl}/auth/verify?token=${token}`;

    const utf8Subject = `=?utf-8?B?${Buffer.from('Verify your Account - Ūgwati wa Gĩkũyũ').toString('base64')}?=`;
    const messageParts = [
      `From: "Ūgwati wa Gĩkũyũ" <${process.env.SMTP_USER}>`,
      `To: ${email}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">`,
      `<h2>Welcome, ${name}!</h2>`,
      `<p>Click below to verify your email:</p>`,
      `<a href="${url}" style="background: #c9a87c; color: white; padding: 10px 20px; text-decoration: none;">Verify Email</a>`,
      `</div>`
    ];
    const message = messageParts.join('\n');

    // Gmail API requires base64url encoding
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });

    console.log('📧 Verification email sent via Gmail API to:', email);
  }

  // You would implement sendContactConfirmation similarly using the same logic
}

export default new EmailConfig();