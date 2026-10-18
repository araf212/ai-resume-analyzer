import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ParserService } from '../services/parserService';
import { LlmService } from '../services/llmService';

async function runTests() {
  console.log('\n--- Running AI Resume Analyzer Backend Tests ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: cleanText normalizes whitespace and line breaks
  try {
    const raw = '  John   Doe  \r\n\r\n\r\nSenior   Engineer \t\t with React  ';
    const cleaned = ParserService.cleanText(raw);
    assert(
      cleaned === 'John Doe\n\nSenior Engineer with React',
      'ParserService.cleanText normalizes multiple spaces, tabs, and duplicate newlines'
    );
  } catch (e: any) {
    assert(false, `cleanText test failed: ${e.message}`);
  }

  // Test 2: LLM JSON parser handles valid JSON string
  try {
    const mockJson = JSON.stringify({
      candidateName: 'Alice Johnson',
      candidateTitle: 'Lead Software Architect',
      summary: 'Experienced architect specializing in distributed cloud systems.',
      matchScore: 92,
      scoreBreakdown: {
        technicalSkills: 95,
        experienceRelevance: 90,
        educationAndCertifications: 88,
        presentationAndImpact: 94,
      },
      skills: {
        technical: ['TypeScript', 'Node.js', 'Go', 'Kubernetes'],
        soft: ['Leadership', 'Mentoring'],
        domain: ['Fintech', 'Microservices'],
        tools: ['Docker', 'AWS'],
      },
      strengths: ['10+ years architecting microservices', 'Deep Kubernetes expertise'],
      weaknesses: ['Limited direct experience in target cloud GCP'],
      missingKeywords: ['BigQuery', 'Spanner'],
      improvementSuggestions: [
        {
          priority: 'High',
          area: 'Cloud Certification',
          recommendation: 'Obtain Google Professional Cloud Architect certification.',
        },
      ],
      quantifiedMetrics: {
        totalSkillsExtracted: 8,
        skillsMatchedCount: 7,
        missingKeywordsCount: 2,
        experienceYearsEstimated: '10+ years',
      },
    });

    const parsed = LlmService.parseAndValidateResponse(mockJson);
    assert(parsed.candidateName === 'Alice Johnson', 'parseAndValidateResponse extracted candidateName correctly');
    assert(parsed.matchScore === 92, 'parseAndValidateResponse validated matchScore correctly');
    assert(parsed.matchCategory === 'Strong Match', 'parseAndValidateResponse classified category as Strong Match (>= 80)');
    assert(parsed.skills.technical.length === 4, 'parseAndValidateResponse correctly parsed technical skills array');
    assert(parsed.missingKeywords.includes('BigQuery'), 'parseAndValidateResponse preserved missingKeywords');
  } catch (e: any) {
    assert(false, `LLM JSON parser test failed: ${e.message}`);
  }

  // Test 3: LLM parser handles markdown code blocks and clamped values
  try {
    const markdownWrapped = `\`\`\`json
{
  "candidateName": "Bob Smith",
  "matchScore": 140,
  "scoreBreakdown": { "technicalSkills": -10 },
  "skills": { "technical": ["React"] },
  "strengths": ["Quick learner"],
  "weaknesses": ["Entry level"],
  "missingKeywords": ["AWS"]
}
\`\`\``;

    const parsed = LlmService.parseAndValidateResponse(markdownWrapped);
    assert(parsed.candidateName === 'Bob Smith', 'Parsed markdown wrapped JSON successfully');
    assert(parsed.matchScore === 100, 'Clamped out-of-bounds score (140 -> 100)');
    assert(parsed.scoreBreakdown.technicalSkills === 0, 'Clamped negative score (-10 -> 0)');
    assert(parsed.matchCategory === 'Strong Match', 'Assigned category based on clamped score');
  } catch (e: any) {
    assert(false, `Markdown unwrapping & clamping test failed: ${e.message}`);
  }

  // Test 4: PDF extraction on standard PDF buffer
  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.addPage([500, 300]);
    page.drawText('Elena Rostova - Principal Frontend Engineer with React, TypeScript and Next.js', {
      x: 40,
      y: 200,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    const bytes = await pdfDoc.save();
    const extracted = await ParserService.parsePdf(Buffer.from(bytes));
    assert(extracted.includes('Elena Rostova'), 'ParserService.parsePdf extracts text accurately from PDF');
  } catch (e: any) {
    assert(false, `PDF text extraction test failed: ${e.message}`);
  }

  // Test 5: PDF Parser rejects empty or corrupt buffer with helpful error
  try {
    let errorCaught = false;
    try {
      await ParserService.parsePdf(Buffer.from('not a valid pdf content'));
    } catch (err: any) {
      errorCaught = true;
    }
    assert(errorCaught, 'ParserService.parsePdf safely rejects invalid or corrupt buffers');
  } catch (e: any) {
    assert(false, `PDF invalid buffer test failed: ${e.message}`);
  }

  console.log(`\nTests completed: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
