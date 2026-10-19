import { ParserService } from '../services/parserService';
import { LlmService } from '../services/llmService';

// Self-contained valid PDF buffer with text "Elena Rostova - Principal Frontend Engineer with React, TypeScript and Next.js"
// Eliminates external runtime PDF generator dependencies
const SAMPLE_VALID_PDF_BASE64 =
  'JVBERi0xLjcKJYGBgYEKCjYgMCBvYmoKPDwKL0ZpbHRlciAvRmxhdGVEZWNvZGUKL0xlbmd0aCAxNjgKPj4Kc3RyZWFtCnicJYxLCkIxDEXnWUXHgpim+bQggj77cOBE6AZEVBQdKOL6TZ8UUnJy73nBpgGG/t5XWOzOj+/5czsd54Ylc0bLJUQO7QLkcw9xisbAGAgxtCcsWXRQ0aqRUEhHS8Y+te+0dYZGWvyetBhq1IGQ1dmo1ZO9yU76b1NOVIwIzTe/58kq3nMveVfYukckOaHudN69f4/3LTupura0Cu0ObQa1wQF+BeYy1wplbmRzdHJlYW0KZW5kb2JqCgo3IDAgb2JqCjw8Ci9GaWx0ZXIgL0ZsYXRlRGVjb2RlCi9UeXBlIC9PYmpTdG0KL04gNQovRmlyc3QgMjYKL0xlbmd0aCAzNjMKPj4Kc3RyZWFtCnic1VJNS8NAEL3vr5ijHmQnH82HlELbJApSlFZQFA/bZCmRsivJRuq/dyZJKz2IZwmP3Zl5MzszeR4g+BCGEECcQAiTwIcJRF4I06mQj18fGuSD2ulWyLu6auGVoghreBNyaTvjwBOzmfjhLpVTe7sTQxJ4TD4yHhpbdaVuYFrkRYEYI2IUEiJEP6NzSUgJPtkU8xO6E+JwBPniADGYU6wYEMVDDsd77mTMz+kkbsScbOCGyWCf3uW38qGG/1c/6UzIla0y5TRcZNc++pGHXoqJF2H4cknraLRy9v8O1/dfW/PrhGf/ubDGCbnptq432ekJuVCt5gjIW73/1K4ulZC5KW1Vmx3Ip9rMTVsfHecVWTAsm0azqnrdyLVubdeUJCTm9ZX5cip+FWOa0ORxkpJ2R6nJ5/vtuy57Kpv5wd1sHE81ONi30lWtFvZAekb6aK9A+2RVz42xjnXeK9w46oataFQ9JX8DjCbF3wplbmRzdHJlYW0KZW5kb2JqCgo4IDAgb2JqCjw8Ci9TaXplIDkKL1Jvb3QgMiAwIFIKL0luZm8gMyAwIFIKL0ZpbHRlciAvRmxhdGVEZWNvZGUKL1R5cGUgL1hSZWYKL0xlbmd0aCA0MAovVyBbIDEgMiAyIF0KL0luZGV4IFsgMCA5IF0KPj4Kc3RyZWFtCnicFcSxEQAwCAOxt8Nd2uw/FgsRrELAjLmQlJxOKvFA0uaGD1wpAx8KZW5kc3RyZWFtCmVuZG9iagoKc3RhcnR4cmVmCjcyMgolJUVPRg==';

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
    const pdfBuffer = Buffer.from(SAMPLE_VALID_PDF_BASE64, 'base64');
    const extracted = await ParserService.parsePdf(pdfBuffer);
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
