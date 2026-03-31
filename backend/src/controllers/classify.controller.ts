import { Response, NextFunction } from 'express';
import { MulterRequest } from '../types';
import { prisma } from '../config/database';
import aiService from '../services/ai.service';
import { deleteUploadedFile } from '../middleware/upload.middleware';
import { AppError } from '../middleware/error.middleware';

/**
 * Classification Controller
 * Handles image upload, ONNX classification, and Gemini enhancement
 */
class ClassifyController {
  /**
   * POST /api/classify
   * Upload, classify, and generate an AI-enhanced description
   */
  async classifyImage(
    req: MulterRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('Please upload an image file', 400);
      }

      const imagePath = req.file.path;
      const imageUrl = `/uploads/${req.file.filename}`;

      // 1. Run local ONNX classification
      const classificationResult = await aiService.classifyImage(imagePath);
      const topLabel = classificationResult.topPrediction.label;

      // 2. Fetch static information from the local database
      const artefactInfo = aiService.getArtefactInfo(topLabel);

      // 3. ✨ Gemini AI Enhancement Logic
      // We only enhance if it's a recognized artefact (not 'non artefacts')
      if (topLabel !== 'non artefacts') {
        console.log(`✨ Enhancing description for: ${topLabel}`);
        const enhancedDescription = await aiService.enhanceDescription(
          topLabel,
          artefactInfo
        );
        // Overwrite the static description with the AI-beautified one
        artefactInfo.description = enhancedDescription;
      }

      // 4. Save to database for history/analytics
      await prisma.classification.create({
        data: {
          imagePath: imageUrl,
          topPrediction: topLabel,
          confidence: classificationResult.topPrediction.confidence,
          allPredictions: classificationResult.allPredictions as any,
          processingTime: classificationResult.metadata.processingTime,
        },
      });

      // 5. Return JSON results
      res.json({
        success: true,
        data: {
          prediction: {
            name: topLabel,
            confidence: (classificationResult.topPrediction.confidence * 100).toFixed(2) + '%',
            ...artefactInfo, 
          },
          alternatives: classificationResult.allPredictions
            .slice(1, 3)
            .map(pred => ({
              name: pred.label,
              confidence: (pred.confidence * 100).toFixed(2) + '%',
            })),
          imageUrl,
          processingTime: classificationResult.metadata.processingTime.toFixed(2) + 's',
        },
      });
    } catch (error) {
      if (req.file) {
        await deleteUploadedFile(req.file.path);
      }
      next(error);
    }
  }

  async getHistory(
    req: MulterRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const history = await prisma.classification.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: { history, count: history.length },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClassifyController();