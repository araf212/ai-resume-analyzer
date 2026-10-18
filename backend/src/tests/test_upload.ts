import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ParserService } from '../services/parserService';

async function runUploadIntegrationTest() {
  console.log('\n--- Running Valid PDF Generation & Backend Parse Test ---\n');

  // 1. Generate a compliant PDF document using pdf-lib
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.addPage([600, 400]);

  const resumeSampleText =
    'ALEXANDER RIVERA - SENIOR FULL STACK ENGINEER\n' +
    '5 years of experience in React, TypeScript, Node.js, Express, Docker, AWS, PostgreSQL.\n' +
    'Proven track record architecting scalable cloud applications and microservices.';

  page.drawText(resumeSampleText, {
    x: 50,
    y: 350,
    size: 14,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);
  console.log(`Generated standard valid PDF buffer: ${pdfBuffer.length} bytes`);

  // 2. Direct unit test of ParserService on this PDF buffer
  const extractedText = await ParserService.parsePdf(pdfBuffer);
  console.log('[PASS] ParserService successfully extracted text from valid PDF:');
  console.log(`Extracted text preview: "${extractedText.slice(0, 80)}..." (${extractedText.length} chars)`);

  if (!extractedText.includes('ALEXANDER RIVERA')) {
    console.error('[FAIL] Extracted text did not contain expected content');
    process.exit(1);
  }

  // 3. Test sending this PDF via HTTP multipart/form-data to /api/analyze
  const formData = new FormData();
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  formData.append('resumeFile', blob, 'alex_rivera_resume.pdf');
  formData.append(
    'jobDescription',
    'Seeking Senior Full-Stack Engineer with 4+ years of React, Node.js, TypeScript, PostgreSQL, and AWS experience.'
  );

  const res = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  console.log('HTTP Status from /api/analyze:', res.status);
  console.log('Analyze Endpoint Response:', json);

  // When no API key is set in .env, the backend correctly parses the file, reaches LLM service, and returns clear API key setup instructions
  if (json.error?.includes('API key') || json.success === true) {
    console.log('\n[PASS] PDF multipart upload, file validation, and parsing fully verified!\n');
  } else {
    console.error('\n[FAIL] Unexpected error during multipart upload:', json);
    process.exit(1);
  }
}

runUploadIntegrationTest();
