import emailConfig from '../config/email';
import { ContactEmailData } from '../types/index.js';

/**
 * Email Service
 * Handles sending emails by wrapping the Config layer
 */
class EmailService {
  /**
   * NEW: Send verification link to new user
   */
  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    try {
      await emailConfig.sendVerificationEmail(email, name, token);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Could not send verification email.'); 
    }
  }

  /**
   * Send contact form confirmation to user
   */
  async sendContactConfirmation(data: ContactEmailData): Promise<void> {
    try {
      await emailConfig.sendContactConfirmation(data);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  }

  /**
   * Send admin notification
   */
  async sendAdminNotification(data: ContactEmailData): Promise<void> {
    try {
      await emailConfig.sendAdminNotification(data);
    } catch (error) {
      console.error('Failed to send admin notification:', error);
    }
  }
}

export default new EmailService();