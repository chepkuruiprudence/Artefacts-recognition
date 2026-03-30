import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { ContactSubject, ContactStatus } from '@prisma/client';
import emailService from '../services/email.service';
import { AppError } from '../middleware/error.middleware';

/**
 * Contact Controller
 * Handles contact form submissions
 */
class ContactController {
  /**
   * POST /api/contact
   * Submit contact form
   */
  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, subject, message } = req.body;

     const forwarded = req.headers['x-forwarded-for'];
     const ipAddress = typeof forwarded === 'string' 
    ? forwarded.split(',')[0] 
    : req.socket.remoteAddress || '127.0.0.1';

      // Save to database
      const contact = await prisma.contact.create({
        data: {
          name,
          email,
          subject: subject as ContactSubject,
          message,
          ipAddress,
        },
      });

      // Send emails (don't wait for them)
      emailService.sendContactConfirmation({ name, email, subject, message });
      emailService.sendAdminNotification({ name, email, subject, message });

      res.status(201).json({
        success: true,
        message:
          'Thank you for contacting us! We will respond within 24-48 hours.',
        data: {
          id: contact.id,
          submittedAt: contact.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/contact
   * Get all contacts (admin only)
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        status,
        limit = '50',
        page = '1',
      } = req.query as Record<string, string>;

      const where: any = {};
      if (status) {
        where.status = status as ContactStatus;
      }

      const take = parseInt(limit);
      const skip = (parseInt(page) - 1) * take;

      const [contacts, total] = await Promise.all([
        prisma.contact.findMany({
          where,
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.contact.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          contacts,
          pagination: {
            total,
            page: parseInt(page),
            limit: take,
            pages: Math.ceil(total / take),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/contact/:id
   * Update contact status (admin only)
   */
  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { status, response } = req.body;

      const updateData: any = { status };
      if (response) {
        updateData.response = response;
        updateData.respondedAt = new Date();
      }

      const contact = await prisma.contact.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Contact updated successfully',
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ContactController();