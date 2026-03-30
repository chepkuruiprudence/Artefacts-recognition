import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { ArtefactCategory, VerificationStatus } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { any } from '@tensorflow/tfjs-node';

/**
 * Artefact Controller
 * Handles CRUD operations for artefacts
 */
class ArtefactController {
  /**
   * GET /api/artefacts
   * Get all artefacts with filtering and pagination
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        category,
        search,
        limit = '50',
        page = '1',
      } = req.query as Record<string, string>;

      // Build where clause
      const where: any = {
        verificationStatus: VerificationStatus.VERIFIED,
      };

      // Filter by category
      if (category && category !== 'All') {
        where.category = category as ArtefactCategory;
      }

      // Search functionality
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ];
      }

      // Pagination
      const take = parseInt(limit);
      const skip = (parseInt(page) - 1) * take;

      // Execute query
      const [artefacts, total] = await Promise.all([
        prisma.artefact.findMany({
          where,
          take,
          skip,
          orderBy: { createdAt: 'desc' },
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        }),
        prisma.artefact.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          artefacts,
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
   * GET /api/artefacts/:id
   * Get single artefact by ID
   */
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const artefact = await prisma.artefact.findUnique({
        where: { id },
        include: {
          images: true,
          contributor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!artefact) {
        throw new AppError('Artefact not found', 404);
      }

      // Increment view count
      await prisma.artefact.update({
        where: { id },
        data: { views: { increment: 1 } },
      });

      res.json({
        success: true,
        data: artefact,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/artefacts
   * Create new artefact (contribution)
   */
  /**
   * POST /api/artefacts
   * Create new artefact (contribution)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { 
        name, category, era, description, 
        culturalSignificance, materials, contributorId 
      } = req.body;

      // 1. Handle Materials (Frontend sends them as a JSON string via FormData)
      const materialsArray = typeof materials === 'string' ? JSON.parse(materials) : materials;

      // 2. Prepare Image Data (Assuming you're using Multer)
      const files = req.files as Express.Multer.File[];
      const imageData = files?.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        isPrimary: index === 0,
        caption: name
      })) || [];

      // 3. Create artefact with nested images
      const artefact = await prisma.artefact.create({
        data: {
          name,
          category: category as ArtefactCategory,
          era,
          description,
          culturalSignificance,
          materials: materialsArray,
          verificationStatus: VerificationStatus.PENDING,
          // Connect contributor if ID is provided
          ...(contributorId && { contributor: { connect: { id: contributorId } } }),
          // Create the image records automatically
          images: {
            create: imageData
          }
        },
        include: {
          images: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'Artefact submitted for verification',
        data: artefact,
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * GET /api/artefacts/stats
   * Get artefact statistics
   */
  async getStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Count by category
      const byCategory = await prisma.artefact.groupBy({
        by: ['category'],
        where: { verificationStatus: VerificationStatus.VERIFIED },
        _count: true,
      });

      // Total artefacts
      const total = await prisma.artefact.count({
        where: { verificationStatus: VerificationStatus.VERIFIED },
      });

      // Total views
      const viewsResult = await prisma.artefact.aggregate({
        where: { verificationStatus: VerificationStatus.VERIFIED },
        _sum: { views: true },
      });

      res.json({
        success: true,
        data: {
          total,
          byCategory: byCategory.map((item: any) => ({
            category: item.category,
            count: item._count,
          })),
          totalViews: viewsResult._sum.views || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ArtefactController();