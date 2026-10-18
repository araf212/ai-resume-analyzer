export interface ScoreBreakdown {
  technicalSkills: number;
  experienceRelevance: number;
  educationAndCertifications: number;
  presentationAndImpact: number;
}

export interface SkillCategories {
  technical: string[];
  soft: string[];
  domain: string[];
  tools: string[];
}

export interface ImprovementSuggestion {
  priority: 'High' | 'Medium' | 'Low';
  area: string;
  recommendation: string;
}

export interface QuantifiedMetrics {
  totalSkillsExtracted: number;
  skillsMatchedCount: number;
  missingKeywordsCount: number;
  experienceYearsEstimated: string;
}

export interface AnalysisResult {
  candidateName: string;
  candidateTitle: string;
  summary: string;
  matchScore: number;
  matchCategory: 'Strong Match' | 'Moderate Match' | 'Needs Improvement' | 'Low Match';
  scoreBreakdown: ScoreBreakdown;
  skills: SkillCategories;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  improvementSuggestions: ImprovementSuggestion[];
  quantifiedMetrics: QuantifiedMetrics;
}

export interface AnalyzeSuccessResponse {
  success: true;
  data: AnalysisResult;
  providerUsed: string;
  meta: {
    filename: string;
    fileSizeBytes: number;
    parsedTextLength: number;
    analysisTimestamp: string;
  };
}

export interface AnalyzeErrorResponse {
  success: false;
  error: string;
  details?: string;
  code?: string;
}

export type AnalyzeApiResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;
