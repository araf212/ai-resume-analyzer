import type {
  AnalyzeSuccessResponse,
  AnalyzeErrorResponse,
  HealthResponse,
  SampleDataResponse,
} from '../types';

/**
 * Resolves the full URL for a given API endpoint.
 * Supports:
 * - VITE_API_BASE_URL (standard) or VITE_API_URL
 * - Handles base URLs with or without trailing slash
 * - Handles base URLs that already include /api
 * - Falls back to relative paths (/api/...) for local development via Vite proxy
 */
export function getApiUrl(endpoint: string): string {
  const envUrl = (
    (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL)) ||
    ''
  ).trim();

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!envUrl) {
    return cleanEndpoint;
  }

  const baseUrl = envUrl.replace(/\/+$/, '');

  // Avoid duplicate /api/api if user provided baseUrl ending in /api
  if (baseUrl.endsWith('/api') && cleanEndpoint.startsWith('/api')) {
    return `${baseUrl}${cleanEndpoint.slice(4)}`;
  }

  return `${baseUrl}${cleanEndpoint}`;
}

export class ApiService {
  /**
   * Check backend health and LLM provider status
   */
  public static async getHealth(): Promise<HealthResponse> {
    const url = getApiUrl('/api/health');
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Health check failed with status: ${res.status}`);
    }
    return res.json();
  }

  /**
   * Fetch sample resume and job description for quick testing
   */
  public static async getSampleData(): Promise<SampleDataResponse> {
    const url = getApiUrl('/api/sample');
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load sample data: ${res.status}`);
    }
    return res.json();
  }

  /**
   * Analyze resume file (PDF or DOCX) against job description
   */
  public static async analyzeWithFile(
    file: File,
    jobDescription: string
  ): Promise<AnalyzeSuccessResponse> {
    const formData = new FormData();
    formData.append('resumeFile', file);
    formData.append('jobDescription', jobDescription);

    const url = getApiUrl('/api/analyze');
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    let data: any;
    try {
      data = await res.json();
    } catch {
      throw new Error(
        `Server returned status ${res.status} (${res.statusText || 'Non-JSON response'}). If using a free tier host like Render, the backend container may still be spinning up.`
      );
    }

    if (!res.ok || !data.success) {
      const err = data as AnalyzeErrorResponse;
      throw new Error(err.error || `Analysis request failed with status: ${res.status}`);
    }

    return data as AnalyzeSuccessResponse;
  }

  /**
   * Analyze raw resume text against job description
   */
  public static async analyzeWithText(
    resumeText: string,
    jobDescription: string
  ): Promise<AnalyzeSuccessResponse> {
    const url = getApiUrl('/api/analyze');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    let data: any;
    try {
      data = await res.json();
    } catch {
      throw new Error(
        `Server returned status ${res.status} (${res.statusText || 'Non-JSON response'}). If using a free tier host like Render, the backend container may still be spinning up.`
      );
    }

    if (!res.ok || !data.success) {
      const err = data as AnalyzeErrorResponse;
      throw new Error(err.error || `Analysis request failed with status: ${res.status}`);
    }

    return data as AnalyzeSuccessResponse;
  }
}
