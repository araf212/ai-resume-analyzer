import { extractText, getDocumentProxy } from 'unpdf';
import mammoth from 'mammoth';

export class ParserService {
  /**
   * Extracts clean plain text from PDF buffer using modern unpdf
   */
  public static async parsePdf(buffer: Buffer): Promise<string> {
    try {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const { text } = await extractText(pdf, { mergePages: true });
      const cleaned = this.cleanText(text);
      if (!cleaned || cleaned.length < 40) {
        throw new Error(
          'The uploaded PDF contains little or no extractable text. If it is an image scan, please use an OCR or text-based PDF.'
        );
      }
      return cleaned;
    } catch (error: any) {
      if (error.message?.includes('extractable text')) {
        throw error;
      }
      throw new Error(`Failed to parse PDF document: ${error.message || 'Corrupt or unreadable format'}`);
    }
  }

  /**
   * Extracts clean plain text from DOCX buffer
   */
  public static async parseDocx(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = this.cleanText(result.value);
      if (!text || text.length < 40) {
        throw new Error(
          'The uploaded DOCX contains little or no extractable text. Please ensure it contains readable text.'
        );
      }
      return text;
    } catch (error: any) {
      if (error.message?.includes('extractable text')) {
        throw error;
      }
      throw new Error(`Failed to parse DOCX document: ${error.message || 'Corrupt or unreadable format'}`);
    }
  }

  /**
   * Cleans and normalizes text while preserving paragraph structure
   */
  public static cleanText(rawText: string): string {
    if (!rawText) return '';
    return rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
