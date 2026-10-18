import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend folder or root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export interface AppConfig {
  port: number;
  nodeEnv: string;
  maxFileSizeMb: number;
  llmProvider: 'gemini' | 'groq';
  geminiApiKey: string;
  geminiModel: string;
  groqApiKey: string;
  groqModel: string;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),
  llmProvider: (process.env.LLM_PROVIDER as 'gemini' | 'groq') || 'gemini',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
};
