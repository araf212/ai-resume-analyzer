export interface SamplePreset {
  id: string;
  roleTitle: string;
  category: string;
  jobDescription: string;
  resumeText: string;
  filename: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'fullstack',
    roleTitle: 'Senior Full-Stack Engineer (React / Node.js)',
    category: 'Engineering',
    filename: 'Alex_Rivera_Senior_Engineer_Resume.pdf',
    jobDescription: `Job Title: Senior Full-Stack Engineer (React / Node.js)
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
- Experience with GraphQL, Microservices, and automated testing is highly desirable.`,
    resumeText: `ALEXANDER RIVERA
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
B.S. in Computer Science | University of California, Davis (2015 - 2019)`,
  },
  {
    id: 'frontend-lead',
    roleTitle: 'Staff Frontend Architect',
    category: 'Design Systems & UI',
    filename: 'Elena_V_Frontend_Architect.docx',
    jobDescription: `Job Title: Staff Frontend Architect
Company: Stellar Digital
Location: New York, NY / Hybrid

Responsibilities:
- Establish enterprise frontend standards across Next.js, Web Components, and Design Systems.
- Drive web performance (Core Web Vitals, SSR caching, edge rendering with Cloudflare Workers).
- Mentor a distributed team of 20+ frontend engineers across 4 product verticals.
- Implement end-to-end design token workflows with Figma tokens and automated style dictionaries.

Required Qualifications:
- 7+ years in frontend engineering with deep mastery of TypeScript, React internals, and performance profiling.
- Experience with micro-frontends (Module Federation) or large-scale monorepos (Turborepo, Nx).
- Deep expertise in accessibility (WCAG 2.1 AAA compliance) and cross-browser visual regression testing.`,
    resumeText: `ELENA VORONOVA
New York, NY | elena.voronova@example.com | portfolio.elena-dev.io

EXECUTIVE PROFILE
Staff Frontend Architect with 8+ years leading frontend engineering, web accessibility, and design system foundations for enterprise SaaS. Specialist in React, TypeScript, Next.js, and browser performance optimization.

CORE COMPETENCIES
- Architecture: React 19, TypeScript, Next.js App Router, Module Federation, Turborepo, GraphQL
- Design Systems: Storybook, Figma Token sync, TailwindCSS, CSS Variables, Radix UI, Framer Motion
- Quality & Compliance: WCAG 2.1 AAA Accessibility, Playwright, Vitest, Lighthouse CI
- Leadership: Technical roadmapping, hiring, engineering mentorship, cross-functional alignment

EXPERIENCE
Staff Frontend Engineer | FinVantage Systems (2021 - Present)
- Architected unified multi-brand design system in React/TypeScript adopted across 12 SaaS products, reducing UI defect rates by 55%.
- Improved Lighthouse performance scores from 58 to 96 across core portals, slashing LCP by 1.8s.
- Led migration of legacy Angular app to Next.js with zero downtime and 40% improved conversion.

Senior Frontend Developer | Omnichannel Labs (2017 - 2021)
- Built interactive financial charts with D3 and Canvas handling 100k datapoints at 60fps.
- Standardized WCAG accessibility compliance across company web properties.

EDUCATION
M.S. Software Engineering | Columbia University (2015 - 2017)`,
  },
];
