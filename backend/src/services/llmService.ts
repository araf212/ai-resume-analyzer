import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { config } from '../config/env';
import { AnalysisResult } from '../types';
import { RESUME_ANALYSIS_SYSTEM_PROMPT, buildAnalysisUserPrompt } from './promptTemplates';

export class LlmService {
  /**
   * Analyzes resume text against a job description using the configured LLM provider
   */
  public static async analyzeResume(
    resumeText: string,
    jobDescription: string
  ): Promise<{ result: AnalysisResult; provider: string }> {
    const userPrompt = buildAnalysisUserPrompt(resumeText, jobDescription);

    // Determine which provider to use
    const hasGemini = Boolean(config.geminiApiKey && config.geminiApiKey.trim());
    const hasGroq = Boolean(config.groqApiKey && config.groqApiKey.trim());

    if (!hasGemini && !hasGroq) {
      throw new Error(
        'No LLM API key configured. Please set GEMINI_API_KEY (free at https://aistudio.google.com/) or GROQ_API_KEY (free at https://console.groq.com/) in backend/.env'
      );
    }

    // Try primary provider first, with intelligent fallback
    if (config.llmProvider === 'groq' && hasGroq) {
      try {
        const result = await this.callGroq(userPrompt);
        return { result, provider: `Groq (${config.groqModel})` };
      } catch (err: any) {
        if (hasGemini) {
          const result = await this.callGemini(userPrompt);
          return { result, provider: `Google Gemini (${config.geminiModel}) [fallback]` };
        }
        throw err;
      }
    } else if (hasGemini) {
      try {
        const result = await this.callGemini(userPrompt);
        return { result, provider: `Google Gemini (${config.geminiModel})` };
      } catch (err: any) {
        if (hasGroq) {
          const result = await this.callGroq(userPrompt);
          return { result, provider: `Groq (${config.groqModel}) [fallback]` };
        }
        throw err;
      }
    } else {
      const result = await this.callGroq(userPrompt);
      return { result, provider: `Groq (${config.groqModel})` };
    }
  }

  /**
   * Calls Google Gemini API
   */
  private static async callGemini(userPrompt: string): Promise<AnalysisResult> {
    try {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: config.geminiModel || 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
        systemInstruction: RESUME_ANALYSIS_SYSTEM_PROMPT,
      });

      const response = await model.generateContent(userPrompt);
      const text = response.response.text();
      return this.parseAndValidateResponse(text);
    } catch (error: any) {
      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        throw new Error(
          'Gemini Free Tier rate limit reached (15 requests/minute). Please wait 30 seconds before retrying.'
        );
      }
      if (error?.message?.includes('API_KEY_INVALID') || error?.status === 400) {
        throw new Error('Invalid Gemini API Key. Please verify your GEMINI_API_KEY in backend/.env.');
      }
      throw new Error(`Google Gemini API error: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Calls Groq API
   */
  private static async callGroq(userPrompt: string): Promise<AnalysisResult> {
    try {
      const groq = new Groq({ apiKey: config.groqApiKey });
      const completion = await groq.chat.completions.create({
        model: config.groqModel || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: RESUME_ANALYSIS_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Received empty response from Groq API');
      }
      return this.parseAndValidateResponse(content);
    } catch (error: any) {
      if (error?.status === 429 || error?.message?.includes('rate limit')) {
        throw new Error('Groq rate limit reached. Please wait a few seconds before retrying.');
      }
      throw new Error(`Groq API error: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Parses JSON string and guarantees all required fields and boundaries
   */
  public static parseAndValidateResponse(rawText: string): AnalysisResult {
    let cleaned = rawText.trim();
    // Remove markdown code fences if present
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err: any) {
      throw new Error(`Failed to parse LLM JSON output: ${err.message}. Raw output snippet: ${cleaned.slice(0, 150)}`);
    }

    // Sanitize and validate fields
    const clamp = (val: any, def: number) => {
      const num = typeof val === 'number' ? val : parseInt(val, 10);
      if (isNaN(num)) return def;
      return Math.max(0, Math.min(100, Math.round(num)));
    };

    const matchScore = clamp(parsed.matchScore, 70);

    let matchCategory: AnalysisResult['matchCategory'] = 'Moderate Match';
    if (matchScore >= 80) matchCategory = 'Strong Match';
    else if (matchScore >= 60) matchCategory = 'Moderate Match';
    else if (matchScore >= 40) matchCategory = 'Needs Improvement';
    else matchCategory = 'Low Match';

    const scoreBreakdown = {
      technicalSkills: clamp(parsed.scoreBreakdown?.technicalSkills, matchScore),
      experienceRelevance: clamp(parsed.scoreBreakdown?.experienceRelevance, matchScore),
      educationAndCertifications: clamp(parsed.scoreBreakdown?.educationAndCertifications, matchScore),
      presentationAndImpact: clamp(parsed.scoreBreakdown?.presentationAndImpact, matchScore),
    };

    const skills = {
      technical: Array.isArray(parsed.skills?.technical) ? parsed.skills.technical : [],
      soft: Array.isArray(parsed.skills?.soft) ? parsed.skills.soft : [],
      domain: Array.isArray(parsed.skills?.domain) ? parsed.skills.domain : [],
      tools: Array.isArray(parsed.skills?.tools) ? parsed.skills.tools : [],
    };

    const strengths = Array.isArray(parsed.strengths) ? parsed.strengths : ['Demonstrates solid background in core areas'];
    const weaknesses = Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ['Some required job qualifications not explicitly mentioned'];
    const missingKeywords = Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [];

    const improvementSuggestions = Array.isArray(parsed.improvementSuggestions)
      ? parsed.improvementSuggestions.map((item: any) => ({
          priority: ['High', 'Medium', 'Low'].includes(item.priority) ? item.priority : 'Medium',
          area: String(item.area || 'General'),
          recommendation: String(item.recommendation || ''),
        }))
      : [];

    const totalExtracted =
      skills.technical.length + skills.soft.length + skills.domain.length + skills.tools.length;

    const quantifiedMetrics = {
      totalSkillsExtracted: parsed.quantifiedMetrics?.totalSkillsExtracted || totalExtracted || 12,
      skillsMatchedCount: parsed.quantifiedMetrics?.skillsMatchedCount || Math.round(totalExtracted * (matchScore / 100)),
      missingKeywordsCount: parsed.quantifiedMetrics?.missingKeywordsCount || missingKeywords.length,
      experienceYearsEstimated: parsed.quantifiedMetrics?.experienceYearsEstimated || 'Estimated 3+ years',
    };

    return {
      candidateName: parsed.candidateName || 'Candidate',
      candidateTitle: parsed.candidateTitle || 'Professional',
      summary: parsed.summary || 'Summary not provided.',
      matchScore,
      matchCategory,
      scoreBreakdown,
      skills,
      strengths,
      weaknesses,
      missingKeywords,
      improvementSuggestions,
      quantifiedMetrics,
    };
  }
}
