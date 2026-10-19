# AI Resume Analyzer

An enterprise-grade, full-stack AI Resume Analyzer and ATS (Applicant Tracking System) intelligence platform. Built with a modern dark glassmorphism design language directly inspired by high-end analytics dashboards, featuring real-time document parsing, LLM semantic evaluation, honest match scoring, categorized skill extraction, and prioritized improvement roadmaps.

![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20TypeScript%20%7C%20Node.js%20%7C%20Express-orange)
![LLM Support](https://img.shields.io/badge/LLM-Google%20Gemini%20%7C%20Groq-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

1. **Multi-Format Document Parsing**:
   - Supports both **PDF (`.pdf`)** and **Word (`.docx`)** resumes.
   - High-fidelity in-memory text extraction using `unpdf` and `mammoth`.
   - File format and size validation (enforces 5MB limit).
   - Also supports direct text paste mode for rapid testing.

2. **Target Job Description Comparison**:
   - Full paste area with word and character counters.
   - 1-Click Role Presets (*Senior Full-Stack Engineer*, *Staff Frontend Architect*) for quick testing without hunting for documents.

3. **Secure LLM Backend Integration**:
   - Primary: **Google Gemini API** (`gemini-1.5-flash` / `gemini-2.0-flash` / `gemini-2.5-flash`).
     - Free tier: 15 RPM, 1,000,000 TPM, 1,500 RPD on [Google AI Studio](https://aistudio.google.com/).
   - Secondary / Alternative: **Groq API** (`llama-3.3-70b-versatile`) from [awesome-free-llm-apis](https://github.com/mnfst/awesome-free-llm-apis).
   - Guarantees strict JSON schema structure.
   - **No fake hardcoding**: Honest scores (0–100) grounded strictly in candidate credentials vs. role requirements.

4. **Rich ATS Analytics Dashboard (Inspired by Reference UI)**:
   - **Radial Circular Match Gauge**: Animated SVG circular score meter with dynamic color coding and ATS alignment grade pill.
   - **Sub-Metric Progress Breakdown**: Technical Skills, Experience Relevance, Education & Certifications, and Presentation & Impact.
   - **4 KPI Metric Cards with Glowing Sparklines**: Total Skills Extracted, Skills Matched Ratio, Missing Critical Terms, and Estimated Experience Alignment.
   - **Extracted Skills Inventory**: Categorized by Technical, Tools & Cloud, Domain & Architecture, and Leadership & Soft Skills.
   - **Strengths vs. Weaknesses Comparison**: 2-column glass cards highlighting key differentiators and critical deficiencies.
   - **Missing Keywords Matrix**: Highlights critical terms found in the JD but missing from the resume, featuring a 1-click **"Copy All Keywords"** button.
   - **Prioritized Improvement Roadmap**: Step-by-step actionable recommendations tagged with High, Medium, or Low priority.

5. **State Management & UX**:
   - Loading state with animated multi-step progression.
   - Validation & error alerts with contextual recovery advice.
   - Report export options: Download full analysis as structured `.json` or print formatted PDF report.

6. **Privacy & Security First**:
   - In-memory buffer processing only (no resume files are ever persisted to disk).
   - Confidentiality guarantee: Resume contents are **never logged** to terminal or logs.
   - Server-side environment isolation: API keys are never exposed to the client.

---

## 🏗️ Project Architecture

```
ai-resume-analyzer/
├── .env.example                  # Root environment template
├── .gitignore                    # Ensures .env & build artifacts are ignored
├── package.json                  # Root runner script (concurrently dev runner)
├── README.md
├── backend/
│   ├── .env.example              # Backend environment template
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── config/
│       │   └── env.ts            # Validated environment configuration
│       ├── middleware/
│       │   ├── upload.ts         # Multer in-memory upload & size validation
│       │   └── errorHandler.ts   # Safe error handling middleware
│       ├── services/
│       │   ├── parserService.ts  # PDF (unpdf) & DOCX (mammoth) extraction
│       │   ├── promptTemplates.ts# Structured ATS analysis prompts & schema
│       │   └── llmService.ts     # Multi-provider LLM client (Gemini & Groq)
│       ├── controllers/
│       │   └── analyzeController.ts # File parsing, validation, and LLM call
│       ├── routes/
│       │   └── analyzeRoutes.ts  # /api/analyze, /api/health, /api/sample
│       ├── tests/
│       │   ├── parser.test.ts    # 12 automated unit and integration tests
│       │   └── test_upload.ts    # Multipart PDF upload verification
│       ├── types/
│       │   └── index.ts          # Strongly typed API contracts
│       └── server.ts             # Express bootstrap on port 5000
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts            # Vite config with /api proxy to port 5000
    ├── index.html                # Modern fonts (Outfit & Inter) and SEO tags
    └── src/
        ├── types/                # Frontend data models
        ├── services/             # API client (ApiService)
        ├── data/                 # Sample presets (Alex Rivera, Elena Voronova)
        ├── components/
        │   ├── Sidebar.tsx       # Dark glass dock navigation
        │   ├── TopNav.tsx        # Breadcrumb, status pill, sample quick-loader
        │   ├── HeroBanner.tsx    # Glass hero banner with floating stats
        │   ├── ResumeUpload.tsx  # Drag & drop upload & validation
        │   ├── JobDescInput.tsx  # Job description textarea with role presets
        │   ├── ScoreGauge.tsx    # Circular SVG match meter & breakdown bars
        │   ├── MetricsGrid.tsx   # KPI cards with custom SVG sparklines
        │   ├── SkillsSection.tsx # Extracted skills categorized with filters
        │   ├── StrengthsWeaknesses.tsx # 2-column comparison cards
        │   ├── MissingKeywords.tsx     # Missing keyword tags & copy helper
        │   ├── ImprovementSuggestions.tsx # Prioritized action plan
        │   ├── LoadingState.tsx  # Multi-stage animated loading state
        │   ├── ErrorAlert.tsx    # Actionable error banners
        │   └── ArchitectureInfo.tsx # LLM architecture & privacy guide
        ├── index.css             # Glassmorphism tokens, gradients, animations
        ├── App.tsx               # Main application orchestrator
        └── main.tsx
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or newer (tested on Node v24.18.1)
- **npm**: v9.0.0 or newer

### 2. Installation
From the root directory, install all dependencies for root, backend, and frontend:
```bash
npm run install:all
```
*(Or install individually: `npm install`, `cd backend && npm install`, `cd ../frontend && npm install`)*

### 3. Configure Environment Variables
Copy the `.env.example` template to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and add your free Google Gemini API key:
```ini
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE_MB=5

# Set provider to "gemini" (recommended) or "groq"
LLM_PROVIDER=gemini

# Google Gemini API Key (Free at https://aistudio.google.com/)
GEMINI_API_KEY=AIzaSy...your_gemini_api_key...
GEMINI_MODEL=gemini-1.5-flash

# Optional Groq alternative (Free at https://console.groq.com/)
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
```

> **Where to get a free Google Gemini key?**
> Visit [Google AI Studio](https://aistudio.google.com/) and click **"Get API key"**. Google's free tier provides 15 Requests Per Minute and 1,500 Requests Per Day at no cost with no credit card required.

### 4. Running the Application
Run both backend and frontend concurrently with a single command from the root folder:
```bash
npm run dev
```

The application will be accessible at:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🌐 Deploying Backend on Render

To deploy the **AI Resume Analyzer Backend API** as a Web Service on [Render](https://render.com/):

### Option A: Recommended (Root Directory = `backend`)
- **Environment**: `Node`
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start` (or `node dist/server.js`)
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `10000` (or leave default, Render sets `PORT` automatically)
  - `LLM_PROVIDER`: `gemini`
  - `GEMINI_API_KEY`: `your_gemini_api_key`
  - `GEMINI_MODEL`: `gemini-1.5-flash` (or `gemini-2.0-flash`)

### Option B: From Repository Root
- **Environment**: `Node`
- **Root Directory**: *(leave blank or `.`)*
- **Build Command**: `npm install && npm run build:backend`
- **Start Command**: `npm run start:backend` (or `node backend/dist/server.js`)

---

## 🧪 Running Automated Tests

Run the backend test suite:
```bash
npm test
```
This runs 12 automated unit and integration tests verifying:
- Text sanitization and whitespace normalization
- Real PDF generation and text extraction (`unpdf`)
- Corrupted/scanned buffer detection and error handling
- JSON parsing and markdown fence stripping
- Match score clamping (0–100) and category classification
- Missing keyword preservation and structure compliance

---

## 🔒 Security & Privacy Practices

- **Zero Disk Persistence**: Uploaded resumes exist solely in RAM buffers during the HTTP request lifecycle.
- **Zero Content Logging**: No resume text or PII is printed to server logs or terminal.
- **Server-Side API Key Storage**: Frontend never receives or stores LLM API credentials.
- **MIME & Size Enforcement**: Strict validation guarantees only valid `.pdf` and `.docx` files under 5MB are processed.
