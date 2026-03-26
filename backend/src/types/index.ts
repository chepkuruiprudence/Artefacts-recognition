import {Request} from 'express';

// Extend Express Request type to include file uploads
export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | {[fieldname: string]: Express.Multer.File[]};
}

// Classification result types
export interface ClassificationResult {
  success: boolean;
  topPrediction: {
    label: string;
    confidence: number;
  };
  allPredictions: Array<{
    label: string;
    confidence: number;
  }>;
  metadata: {
    modelVersion: string;
    processingTime: number;
  };
}

// Artefact info types
export interface ArtefactInfo {
  category: string;
  era: string;
  description: string;
  culturalSignificance: string;
  materials: string[];
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

// Email data types
export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}






