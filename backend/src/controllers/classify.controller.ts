import { Response, NextFunction } from 'express';
import { MulterRequest } from '../types';
import { prisma } from '../config/database';
import aiService from '../services/ai.service';
import { deleteUploadedFile } from '../middleware/upload.middleware';
import { AppError } from '../middleware/error.middleware';

/**
 * Classification Controller
 * Handles image upload and AI classification
 */
class ClassifyController {
  /**
   * POST /api/classify
   * Upload and classify an artefact image
   */
  async classifyImage(
    req: MulterRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check if file was uploaded
      if (!req.file) {
        throw new AppError('Please upload an image file', 400);
      }

      const imagePath = req.file.path;
      const imageUrl = `/uploads/${req.file.filename}`;

      console.log('🔍 Classifying image:', imagePath);

      // Run AI classification
      const classificationResult = await aiService.classifyImage(imagePath);

      // Get detailed artefact information
      const artefactInfo = aiService.getArtefactInfo(
        classificationResult.topPrediction.label
      );

      // Save classification to database for analytics
      await prisma.classification.create({
        data: {
          imagePath: imageUrl,
          topPrediction: classificationResult.topPrediction.label,
          confidence: classificationResult.topPrediction.confidence,
          allPredictions: classificationResult.allPredictions,
          processingTime: classificationResult.metadata.processingTime,
        },
      });

      // Return results
      res.json({
        success: true,
        data: {
          prediction: {
            name: classificationResult.topPrediction.label,
            confidence:
              (classificationResult.topPrediction.confidence * 100).toFixed(2) +
              '%',
            ...artefactInfo,
          },
          alternatives: classificationResult.allPredictions
            .slice(1, 3)
            .map(pred => ({
              name: pred.label,
              confidence: (pred.confidence * 100).toFixed(2) + '%',
            })),
          imageUrl,
          processingTime:
            classificationResult.metadata.processingTime.toFixed(2) + 's',
        },
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        await deleteUploadedFile(req.file.path);
      }
      next(error);
    }
  }

  /**
   * GET /api/classify/history
   * Get classification history (last 50)
   */
  async getHistory(
    req: MulterRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const history = await prisma.classification.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          imagePath: true,
          topPrediction: true,
          confidence: true,
          createdAt: true,
        },
      });

      res.json({
        success: true,
        data: {
          history,
          count: history.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClassifyController();