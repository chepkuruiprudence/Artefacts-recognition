import nodemailer, { Transporter } from 'nodemailer';
import {ContactEmailData } from '../types/index.js';

/**
 * Email Service Configuration
 */
class EmailConfig {
  private transporter: Transporter;

  constructor() {
    // Create email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    this.verifyConnection();
  }

  /**
   * Test SMTP connection
   */
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service ready');
    } catch (error) {
      console.error('❌ Email service error:', error);
    }
  }

  /**
   * Send confirmation email to user
   */
  async sendContactConfirmation(data: ContactEmailData): Promise<void> {
    const mailOptions = {
      from: `"Ūgwati wa Gĩkũyũ" <${process.env.SMTP_USER}>`,
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
    };

    await this.transporter.sendMail(mailOptions);
    console.log('📧 Confirmation email sent to:', data.email);
  }

  /**
   * Send notification to admin
   */
  async sendAdminNotification(data: ContactEmailData): Promise<void> {
    const mailOptions = {
      from: `"Ūgwati Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
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
    };

    await this.transporter.sendMail(mailOptions);
    console.log('📧 Admin notification sent');
  }
}

export default new EmailConfig();