import axios from 'axios';
import type { ApiResponse, ClassificationData } from '../types/artefact';

// Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Classify an artefact image
 * @param file - Image file to classify
 * @returns Classification result with full artefact info
 */
export const classifyArtefact = async (file: File): Promise<ClassificationData> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const { data } = await api.post<ApiResponse<ClassificationData>>(
      '/classify',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    if (!data.success || !data.data) {
      throw new Error('Classification failed');
    }

    return data.data;
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
};

/**
 * Get classification history
 */
export const getClassificationHistory = async () => {
  const { data } = await api.get<ApiResponse<any>>('/classify/history');
  return data.data;
};

/**
 * Get all artefacts
 */
export const getArtefacts = async (filters?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const { data } = await api.get<ApiResponse<any>>(`/artefacts?${params}`);
  return data.data;
};

/**
 * Submit contact form
 */
export const submitContact = async (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const { data } = await api.post<ApiResponse<any>>('/contact', formData);
  return data;
};