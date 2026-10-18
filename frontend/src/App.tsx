import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { HeroBanner } from './components/HeroBanner';
import { ResumeUpload } from './components/ResumeUpload';
import { JobDescInput } from './components/JobDescInput';
import { ScoreGauge } from './components/ScoreGauge';
import { MetricsGrid } from './components/MetricsGrid';
import { SkillsSection } from './components/SkillsSection';
import { StrengthsWeaknesses } from './components/StrengthsWeaknesses';
import { MissingKeywords } from './components/MissingKeywords';
import { ImprovementSuggestions } from './components/ImprovementSuggestions';
import { LoadingState } from './components/LoadingState';
import { ErrorAlert } from './components/ErrorAlert';
import { ArchitectureInfo } from './components/ArchitectureInfo';
import { ApiService } from './services/api';
import type { AnalysisResult, HealthResponse } from './types';
import { SAMPLE_PRESETS } from './data/sampleData';
import { Sparkles, ArrowRight } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'resume' | 'metrics' | 'model'>('analyze');

  // Input states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawResumeText, setRawResumeText] = useState<string>('');
  const [resumeMode, setResumeMode] = useState<'file' | 'text'>('file');
  const [jobDescription, setJobDescription] = useState<string>('');

  // Execution states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [providerUsed, setProviderUsed] = useState<string | undefined>(undefined);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  // Load backend health on mount
  useEffect(() => {
    ApiService.getHealth()
      .then((data) => setHealth(data))
      .catch((err) => {
        console.warn('Backend health check warning:', err.message);
      });
  }, []);

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setJobDescription(preset.jobDescription);
    setRawResumeText(preset.resumeText);
    setResumeMode('text');
    setSelectedFile(null);
    setError(null);
  };

  // 1-Click Load Sample Candidate & JD
  const handleLoadSample = () => {
    const defaultSample = SAMPLE_PRESETS[0];
    setJobDescription(defaultSample.jobDescription);
    setRawResumeText(defaultSample.resumeText);
    setResumeMode('text');
    setSelectedFile(null);
    setError(null);
    setActiveTab('analyze');
  };

  // Reset Everything
  const handleReset = () => {
    setSelectedFile(null);
    setRawResumeText('');
    setJobDescription('');
    setAnalysis(null);
    setError(null);
    setProviderUsed(undefined);
  };

  // Export JSON Report
  const handleExportJson = () => {
    if (!analysis) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ATS_Analysis_${analysis.candidateName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Print Formatted Report
  const handlePrintReport = () => {
    window.print();
  };

  // Execute Analysis
  const handleAnalyze = async () => {
    setError(null);

    // Validation checks
    const hasResume =
      (resumeMode === 'file' && selectedFile !== null) ||
      (resumeMode === 'text' && rawResumeText.trim().length >= 50);

    if (!hasResume) {
      setError('Please upload a resume (.pdf or .docx) or paste at least 50 characters of resume text.');
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 30) {
      setError('Please provide a target job description with at least 30 characters.');
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      let res;
      if (resumeMode === 'file' && selectedFile) {
        res = await ApiService.analyzeWithFile(selectedFile, jobDescription);
      } else {
        res = await ApiService.analyzeWithText(rawResumeText, jobDescription);
      }

      setAnalysis(res.data);
      setProviderUsed(res.providerUsed);

      // Trigger celebratory confetti if score is strong (>= 80)
      if (res.data.matchScore >= 80) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f97316', '#10b981', '#38bdf8', '#fbbf24'],
          });
        } catch {
          // Ignore confetti if not supported
        }
      }

      // Smooth scroll to analysis results
      setTimeout(() => {
        document.getElementById('score-summary-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during resume analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Dock (Direct reference to resume analytics.jpg left rail) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab: any) => setActiveTab(tab)}
        hasAnalysis={Boolean(analysis)}
      />

      {/* Main Content Area */}
      <main className="main-wrapper">
        {/* Top Header */}
        <TopNav
          health={health}
          onLoadSample={handleLoadSample}
          onReset={handleReset}
          hasAnalysis={Boolean(analysis)}
          onExportJson={handleExportJson}
          onPrintReport={handlePrintReport}
        />

        {/* Hero Banner (Matching the featured banner in reference image) */}
        <HeroBanner
          onStartClick={() => {
            if (!analysis) {
              document.getElementById('resume-input-section')?.scrollIntoView({ behavior: 'smooth' });
            } else {
              handleReset();
            }
          }}
          analysis={analysis}
          isLoading={isLoading}
        />

        {/* Architecture & Info Tab view if toggled */}
        {activeTab === 'model' && <ArchitectureInfo health={health} />}

        {/* Workspace Inputs Grid: 1. Resume Upload + 2. Job Description */}
        <div className="workspace-grid">
          <ResumeUpload
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            rawText={rawResumeText}
            onRawTextChange={setRawResumeText}
            mode={resumeMode}
            onModeChange={setResumeMode}
          />

          <JobDescInput
            value={jobDescription}
            onChange={setJobDescription}
            onSelectPreset={handleSelectPreset}
            onClear={() => setJobDescription('')}
          />
        </div>

        {/* Action Controls Bar */}
        <div className="action-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(249, 115, 22, 0.15)',
                color: 'var(--accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>
                Ready to Evaluate Alignment
              </h4>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Runs LLM semantic matching, keyword extraction & ATS scoring
              </p>
            </div>
          </div>

          <button
            className="btn-primary-analyze"
            onClick={handleAnalyze}
            disabled={isLoading}
            id="analyze-submit-button"
          >
            {isLoading ? 'Processing Document...' : 'Run Full ATS Analysis'}
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Error Alert Display */}
        {error && (
          <ErrorAlert
            error={error}
            onDismiss={() => setError(null)}
            onRetry={handleAnalyze}
          />
        )}

        {/* Multi-step Loading Animation */}
        {isLoading && <LoadingState />}

        {/* Analysis Results Section */}
        {analysis && !isLoading && (
          <section id="analysis-results" aria-label="Analysis Results">
            {/* Overall Score Gauge & Executive Summary */}
            <ScoreGauge analysis={analysis} providerUsed={providerUsed} />

            {/* 4 KPI Metrics with Custom Sparklines */}
            <MetricsGrid metrics={analysis.quantifiedMetrics} />

            {/* Extracted Skills Inventory by Domain */}
            <SkillsSection skills={analysis.skills} />

            {/* Strengths & Weaknesses 2-Column Comparison */}
            <StrengthsWeaknesses
              strengths={analysis.strengths}
              weaknesses={analysis.weaknesses}
            />

            {/* Missing Keywords Box with One-Click Copy */}
            <MissingKeywords keywords={analysis.missingKeywords} />

            {/* Actionable Improvement Roadmap */}
            <ImprovementSuggestions suggestions={analysis.improvementSuggestions} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
