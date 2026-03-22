import axios from 'axios'
import type { PredictionResponse } from '../types/artefact'

export const classifyArtefact = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData()
  formData.append('image', file)

  const { data } = await axios.post<PredictionResponse>('/api/classify/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data
}
