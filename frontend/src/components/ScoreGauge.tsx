import React from 'react';
import { AnalysisResult } from '../types';
import { Award, CheckCircle, ShieldCheck, UserCheck } from 'lucide-react';

interface ScoreGaugeProps {
  analysis: AnalysisResult;
  providerUsed?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ analysis, providerUsed }) => {
  const { matchScore, matchCategory, scoreBreakdown, candidateName, candidateTitle, summary } =
    analysis;

  // SVG circular gauge geometry
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Mint / Emerald
    if (score >= 65) return '#f59e0b'; // Amber
    if (score >= 45) return '#f97316'; // Orange
    return '#f43f5e'; // Rose
  };

  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'Strong Match':
        return 'strong';
      case 'Moderate Match':
        return 'moderate';
      case 'Needs Improvement':
        return 'needs-improvement';
      default:
        return 'low';
    }
  };

  const scoreColor = getScoreColor(matchScore);

  return (
    <div className="score-hero-grid" id="score-summary-section">
      {/* Left Column: Radial Circular Match Gauge */}
      <div className="glass-card gauge-card">
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Overall ATS Match
        </span>

        <div className="svg-gauge-container">
          <svg className="svg-gauge" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              className="gauge-circle-bg"
              cx="80"
              cy="80"
              r={radius}
            />
            {/* Animated Progress Circle */}
            <circle
              className="gauge-circle-progress"
              cx="80"
              cy="80"
              r={radius}
              stroke={scoreColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              filter="drop-shadow(0px 0px 8px rgba(249, 115, 22, 0.4))"
            />
          </svg>

          <div className="gauge-center-text">
            <span className="gauge-score-number" style={{ color: scoreColor }}>
              {matchScore}
            </span>
            <span className="gauge-score-percent">/ 100</span>
          </div>
        </div>

        <div className={`match-category-pill ${getCategoryClass(matchCategory)}`}>
          <ShieldCheck size={14} />
          {matchCategory}
        </div>

        {providerUsed && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
            Audited via {providerUsed}
          </span>
        )}
      </div>

      {/* Right Column: Candidate Profile & Sub-metric Breakdown */}
      <div className="glass-card summary-card">
        <div>
          <div className="candidate-header">
            <div>
              <h2 className="candidate-name">{candidateName || 'Candidate Profile'}</h2>
              <span className="candidate-title">{candidateTitle || 'Professional Candidate'}</span>
            </div>
            <div className="pill-badge">
              <UserCheck size={14} color="#34d399" />
              <span>ATS Parsed & Verified</span>
            </div>
          </div>

          <p className="summary-text">{summary}</p>
        </div>

        {/* 4 Sub-metrics Breakdown Progress Bars */}
        <div className="submetrics-list">
          <div className="submetric-item">
            <div className="submetric-header">
              <span>Technical Skills Match</span>
              <span className="submetric-value">{scoreBreakdown.technicalSkills}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${scoreBreakdown.technicalSkills}%`,
                  background: 'linear-gradient(90deg, #f97316, #fb923c)',
                }}
              />
            </div>
          </div>

          <div className="submetric-item">
            <div className="submetric-header">
              <span>Experience Relevance</span>
              <span className="submetric-value">{scoreBreakdown.experienceRelevance}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${scoreBreakdown.experienceRelevance}%`,
                  background: 'linear-gradient(90deg, #10b981, #34d399)',
                }}
              />
            </div>
          </div>

          <div className="submetric-item">
            <div className="submetric-header">
              <span>Education & Certifications</span>
              <span className="submetric-value">{scoreBreakdown.educationAndCertifications}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${scoreBreakdown.educationAndCertifications}%`,
                  background: 'linear-gradient(90deg, #38bdf8, #06b6d4)',
                }}
              />
            </div>
          </div>

          <div className="submetric-item">
            <div className="submetric-header">
              <span>Presentation & Impact</span>
              <span className="submetric-value">{scoreBreakdown.presentationAndImpact}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${scoreBreakdown.presentationAndImpact}%`,
                  background: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
