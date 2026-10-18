import React from 'react';
import { Sparkles, Printer, Download, RefreshCw, Zap } from 'lucide-react';
import { HealthResponse } from '../types';

interface TopNavProps {
  health: HealthResponse | null;
  onLoadSample: () => void;
  onReset: () => void;
  hasAnalysis: boolean;
  onExportJson: () => void;
  onPrintReport: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  health,
  onLoadSample,
  onReset,
  hasAnalysis,
  onExportJson,
  onPrintReport,
}) => {
  const activeProvider = health?.llmStatus?.activeProvider || 'gemini';
  const isConfigured =
    (activeProvider === 'gemini' && health?.llmStatus?.geminiConfigured) ||
    (activeProvider === 'groq' && health?.llmStatus?.groqConfigured);

  return (
    <header className="top-bar">
      <div className="top-bar-title">
        <h1>
          AI Resume Analyzer
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-orange)' }}>
            v1.0
          </span>
        </h1>
        <p>Enterprise ATS Intelligence, Skill Extraction & Match Scoring</p>
      </div>

      <div className="top-actions">
        {/* Provider Connection Indicator */}
        <div className={`pill-badge ${isConfigured ? 'active-indicator' : ''}`}>
          <span className="indicator-dot" />
          <span>
            {isConfigured
              ? `LLM Ready: ${activeProvider === 'gemini' ? health?.llmStatus?.geminiModel : health?.llmStatus?.groqModel}`
              : 'Add API Key in .env'}
          </span>
        </div>

        {/* 1-Click Sample Button */}
        <button
          className="btn-sample"
          onClick={onLoadSample}
          title="Load realistic candidate resume & job description sample"
        >
          <Sparkles size={15} />
          Load Sample
        </button>

        {hasAnalysis && (
          <>
            <button
              className="pill-badge"
              style={{ cursor: 'pointer' }}
              onClick={onExportJson}
              title="Download Analysis as JSON"
            >
              <Download size={14} />
              Export JSON
            </button>
            <button
              className="pill-badge"
              style={{ cursor: 'pointer' }}
              onClick={onPrintReport}
              title="Print / Save PDF Report"
            >
              <Printer size={14} />
              Print
            </button>
            <button
              className="pill-badge"
              style={{ cursor: 'pointer' }}
              onClick={onReset}
              title="Start New Analysis"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </>
        )}
      </div>
    </header>
  );
};
