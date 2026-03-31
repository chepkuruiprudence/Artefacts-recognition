import { Resend } from 'resend';
import { ContactEmailData } from '../types/index.js';

class EmailConfig {
  private resend: Resend;
  private fromAddress: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    // Use this default until you verify a domain on Resend
    this.fromAddress = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    console.log('✅ Email service (Resend) initialized');
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${baseUrl}/auth/verify?token=${token}`;

    const { error } = await this.resend.emails.send({
      from: `Ūgwati wa Gĩkũyũ <${this.fromAddress}>`,
      to: email,
      subject: 'Verify your Account - Ūgwati wa Gĩkũyũ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0d9d1; padding: 20px; border-radius: 10px;">
          <h2 style="color: #5a4a3a; text-align: center;">Welcome to the Archive, ${name}!</h2>
          <p>Thank you for joining Ūgwati wa Gĩkũyũ. To start contributing and preserving our heritage, please verify your email address.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #c9a87c; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify My Email</a>
          </div>
          
          <p style="font-size: 0.8rem; color: #666;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 0.8rem; color: #c9a87c; word-break: break-all;">${url}</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #8b6f47; font-size: 0.9rem; text-align: center;">Helping preserve the history of the Gĩkũyũ people.</p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend error (verification):', error);
      throw new Error(`Could not send verification email. ${error.message}`);
    }

    console.log('📧 Verification email sent to:', email);
  }

  async sendContactConfirmation(data: ContactEmailData): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: `Ūgwati wa Gĩkũyũ <${this.fromAddress}>`,
      to: data.email,
      subject: 'We received your message - Ūgwati wa Gĩkũyũ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c9a87c;">Thank You for Contacting Us!</h2>
          <p>Dear ${data.name},</p>
          <p>We have received your message regarding: <strong>${data.subject}</strong></p>
          <p>Our team will review your inquiry and respond within 24-48 hours.</p>
          
          <div style="background: #f5f1ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Message:</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <p>If you have any urgent concerns, please call us at +254 700 000 000</p>
          <p style="color: #5a4a3a;">Best regards,<br>The Ūgwati wa Gĩkũyũ Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend error (contact confirmation):', error);
      throw new Error(`Could not send confirmation email. ${error.message}`);
    }

    console.log('📧 Confirmation email sent to:', data.email);
  }

  async sendAdminNotification(data: ContactEmailData): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: `Ūgwati Contact Form <${this.fromAddress}>`,
      to: process.env.ADMIN_EMAIL || this.fromAddress,
      subject: `New Contact Form Submission - ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${data.message}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    if (error) {
      console.error('❌ Resend error (admin notification):', error);
      throw new Error(`Could not send admin notification. ${error.message}`);
    }

    console.log('📧 Admin notification sent');
  }
}

export default new EmailConfig();