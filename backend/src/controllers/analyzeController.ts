import { Request, Response, NextFunction } from 'express';
import { ParserService } from '../services/parserService';
import { LlmService } from '../services/llmService';
import { config } from '../config/env';

export class AnalyzeController {
  /**
   * Health check and configuration status
   */
  public static async getHealth(req: Request, res: Response) {
    const hasGemini = Boolean(config.geminiApiKey && config.geminiApiKey.trim());
    const hasGroq = Boolean(config.groqApiKey && config.groqApiKey.trim());

    return res.status(200).json({
      status: 'ok',
      service: 'AI Resume Analyzer API',
      timestamp: new Date().toISOString(),
      llmStatus: {
        geminiConfigured: hasGemini,
        geminiModel: config.geminiModel,
        groqConfigured: hasGroq,
        groqModel: config.groqModel,
        activeProvider: config.llmProvider,
      },
      limits: {
        maxFileSizeMb: config.maxFileSizeMb,
        acceptedFormats: ['.pdf', '.docx'],
      },
    });
  }

  /**
   * Provides realistic sample resume & job description data for quick testing
   */
  public static async getSampleData(req: Request, res: Response) {
    const sampleJobDescription = `Job Title: Senior Full-Stack Engineer (React / Node.js)
Company: CloudPulse Technologies
Location: Remote (US / Global)

About the Role:
We are seeking a Senior Full-Stack Engineer with 4+ years of experience building scalable web applications. You will spearhead our client-facing dashboard and microservices architecture.

Responsibilities:
- Architect and develop high-performance web applications using React, TypeScript, and modern CSS.
- Design and build RESTful and GraphQL APIs with Node.js, Express, and PostgreSQL.
- Implement containerized deployments using Docker and Kubernetes on AWS (ECS, EKS, S3).
- Write comprehensive unit and integration tests (Jest, Playwright) and mentor junior engineers.
- Collaborate with Product and UI/UX designers to deliver high-converting user interfaces.

Requirements:
- 4+ years of production experience with TypeScript, React, and Node.js.
- Strong understanding of state management, responsive UI design, and web performance optimization.
- Hands-on experience with SQL/NoSQL databases (PostgreSQL, Redis, MongoDB).
- Working knowledge of cloud infrastructure (AWS or GCP), CI/CD pipelines (GitHub Actions), and Docker.
- Experience with GraphQL, Microservices, and automated testing is highly desirable.`;

    const sampleResumeText = `ALEXANDER RIVERA
San Francisco, CA | alex.rivera@email.com | github.com/alexrivera-dev | linkedin.com/in/alexrivera

PROFESSIONAL SUMMARY
Senior Software Engineer with 5 years of experience architecting and delivering high-throughput web applications and cloud services. Proven track record in TypeScript, React, Node.js, and distributed systems. Passionate about developer tooling, component design systems, and database optimization.

CORE TECHNICAL SKILLS
- Frontend: TypeScript, JavaScript (ES6+), React, Redux Toolkit, Next.js, HTML5, CSS3, TailwindCSS, Webpack, Vite
- Backend: Node.js, Express, REST APIs, PostgreSQL, Redis, Prisma ORM, WebSockets
- Cloud & DevOps: Docker, AWS (S3, EC2, CloudFront), GitHub Actions, Linux
- Testing & Quality: Jest, React Testing Library, ESLint, Git, Agile/Scrum

PROFESSIONAL EXPERIENCE
Senior Full-Stack Developer | Nexus Labs (2022 - Present)
- Spearheaded redesign of core analytics dashboard using React 18, TypeScript, and Vite, cutting initial load times by 42%.
- Designed and maintained 15+ Node.js / Express microservices serving 1.2M monthly active users with 99.95% uptime.
- Optimized slow SQL queries on PostgreSQL database with composite indexes and Redis caching, reducing p95 latency from 850ms to 95ms.
- Built automated CI/CD deployment pipeline with GitHub Actions and Docker, reducing release cycle time by 60%.

Software Engineer | BrightPath Software (2019 - 2022)
- Developed responsive customer portal features using React, TypeScript, and RESTful APIs.
- Integrated payment gateways (Stripe) and webhook handling with Node.js, processing over $4M in ARR.
- Authored comprehensive test suites with Jest and React Testing Library, achieving 88% code coverage.

EDUCATION
B.S. in Computer Science | University of California, Davis (2015 - 2019)`;

    return res.status(200).json({
      success: true,
      data: {
        jobTitle: 'Senior Full-Stack Engineer (React / Node.js)',
        sampleJobDescription,
        sampleResumeText,
      },
    });
  }

  /**
   * Main analysis endpoint: accepts uploaded file or text + job description
   */
  public static async analyze(req: Request, res: Response, next: NextFunction) {
    try {
      const jobDescription = req.body.jobDescription;
      const file = req.file;
      const directResumeText = req.body.resumeText;

      // 1. Validation: Job description must be provided
      if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 30) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid job description with at least 30 characters.',
          code: 'INVALID_JOB_DESCRIPTION',
        });
      }

      // 2. Resume source: File or direct text
      let resumeText = '';
      let filename = 'Direct Input';
      let fileSizeBytes = 0;

      if (file) {
        filename = file.originalname;
        fileSizeBytes = file.size;
        const extension = filename.split('.').pop()?.toLowerCase();

        if (extension === 'pdf') {
          resumeText = await ParserService.parsePdf(file.buffer);
        } else if (extension === 'docx') {
          resumeText = await ParserService.parseDocx(file.buffer);
        } else {
          return res.status(400).json({
            success: false,
            error: 'Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).',
            code: 'UNSUPPORTED_FORMAT',
          });
        }
      } else if (directResumeText && typeof directResumeText === 'string') {
        resumeText = ParserService.cleanText(directResumeText);
        fileSizeBytes = Buffer.byteLength(directResumeText, 'utf8');
      } else {
        return res.status(400).json({
          success: false,
          error: 'No resume provided. Please upload a PDF or DOCX file, or paste your resume text.',
          code: 'MISSING_RESUME',
        });
      }

      // 3. Minimum text validation
      if (resumeText.length < 50) {
        return res.status(400).json({
          success: false,
          error: 'The provided resume has insufficient readable text (minimum 50 characters required).',
          code: 'INSUFFICIENT_TEXT',
        });
      }

      // 4. Safe server-side telemetry (Never log confidential resume content)
      console.log(
        `[Analyze Request] File: "${filename}" (${fileSizeBytes} bytes), Parsed: ${resumeText.length} chars, JD: ${jobDescription.length} chars`
      );

      // 5. Call LLM Service
      const { result, provider } = await LlmService.analyzeResume(resumeText, jobDescription);

      return res.status(200).json({
        success: true,
        data: result,
        providerUsed: provider,
        meta: {
          filename,
          fileSizeBytes,
          parsedTextLength: resumeText.length,
          analysisTimestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error('[Analyze Error]', error.message);
      return next(error);
    }
  }
}
