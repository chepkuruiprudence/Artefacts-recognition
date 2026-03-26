// Backend API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Classification data from backend
export interface ClassificationData {
  prediction: {
    name: string;
    confidence: string; // "94.23%"
    category: string;
    era: string;
    description: string;
    culturalSignificance: string;
    materials: string[];
  };
  alternatives: Array<{
    name: string;
    confidence: string;
  }>;
  imageUrl: string;
  processingTime: string;
}

// For display in frontend
export interface ClassificationResult {
  topPrediction: {
    label: string;
    confidence: number; // 0.9423
  };
  alternatives: Array<{
    label: string;
    confidence: number;
  }>;
}

// Artefact details for display
export interface ArtefactDetails {
  category: string;
  era: string;
  description: string;
  culturalSignificance: string;
  materials: string[];
}