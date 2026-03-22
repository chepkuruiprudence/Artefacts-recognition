export interface ArtefactResult {
  name: string
  confidence: number
  cultural_use: string
  description: string
  period?: string
  image_url?: string
}

export interface PredictionResponse {
  success: boolean
  prediction: ArtefactResult
  top_predictions?: ArtefactResult[]
}
