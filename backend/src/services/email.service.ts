import emailConfig from '../config/email';
import { ContactEmailData } from '../types/index.js';

/**
 * Email Service
 * Handles sending emails
 */
class EmailService {
  /**
   * Send contact form confirmation to user
   */
  async sendContactConfirmation(data: ContactEmailData): Promise<void> {
    try {
      await emailConfig.sendContactConfirmation(data);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't throw error - email failure shouldn't stop the request
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
      // Don't throw error
    }
  }
}

export default new EmailService();