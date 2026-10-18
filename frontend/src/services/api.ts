import type {
  AnalyzeSuccessResponse,
  AnalyzeErrorResponse,
  HealthResponse,
  SampleDataResponse,
} from '../types';

export class ApiService {
  /**
   * Check backend health and LLM provider status
   */
  public static async getHealth(): Promise<HealthResponse> {
    const res = await fetch('/api/health');
    if (!res.ok) {
      throw new Error(`Health check failed with status: ${res.status}`);
    }
    return res.json();
  }

  /**
   * Fetch sample resume and job description for quick testing
   */
  public static async getSampleData(): Promise<SampleDataResponse> {
    const res = await fetch('/api/sample');
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

    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
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
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      const err = data as AnalyzeErrorResponse;
      throw new Error(err.error || `Analysis request failed with status: ${res.status}`);
    }

    return data as AnalyzeSuccessResponse;
  }
}
