import React from 'react';
import { QuantifiedMetrics } from '../types';
import { Award, Target, AlertTriangle, Clock } from 'lucide-react';

interface MetricsGridProps {
  metrics: QuantifiedMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const matchRatio = metrics.totalSkillsExtracted > 0
    ? Math.round((metrics.skillsMatchedCount / metrics.totalSkillsExtracted) * 100)
    : 75;

  return (
    <div className="kpi-grid" aria-label="Key Performance Indicators">
      {/* 1. Total Skills Detected */}
      <div className="glass-card kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">Skills Extracted</span>
          <div className="kpi-icon-pill" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Award size={18} />
          </div>
        </div>
        <div className="kpi-number">{metrics.totalSkillsExtracted}</div>
        <div className="kpi-badge" style={{ color: '#38bdf8' }}>
          <span>ATS Parsed</span>
        </div>
        {/* Decorative SVG Sparkline Wave (Directly inspired by reference image) */}
        <svg className="kpi-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path
            d="M0 22 Q 15 5, 30 18 T 60 12 T 90 20 T 100 8"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2. Skills Matched */}
      <div className="glass-card kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">Skills Matched</span>
          <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Target size={18} />
          </div>
        </div>
        <div className="kpi-number">{metrics.skillsMatchedCount}</div>
        <div className="kpi-badge" style={{ color: '#34d399' }}>
          <span>{matchRatio}% JD Coverage</span>
        </div>
        <svg className="kpi-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path
            d="M0 25 Q 20 8, 40 20 T 70 6 T 100 12"
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 3. Missing Keyword Gaps */}
      <div className="glass-card kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">Missing Critical Terms</span>
          <div className="kpi-icon-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <AlertTriangle size={18} />
          </div>
        </div>
        <div className="kpi-number">{metrics.missingKeywordsCount}</div>
        <div className="kpi-badge" style={{ color: '#fbbf24' }}>
          <span>Optimization Target</span>
        </div>
        <svg className="kpi-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path
            d="M0 15 Q 25 28, 50 14 T 75 24 T 100 16"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 4. Experience Years Alignment */}
      <div className="glass-card kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">Experience Scope</span>
          <div className="kpi-icon-pill" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
            <Clock size={18} />
          </div>
        </div>
        <div className="kpi-number" style={{ fontSize: '24px', paddingTop: '4px' }}>
          {metrics.experienceYearsEstimated}
        </div>
        <div className="kpi-badge" style={{ color: '#f97316' }}>
          <span>Seniority Evaluated</span>
        </div>
        <svg className="kpi-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path
            d="M0 20 Q 30 5, 55 18 T 85 8 T 100 14"
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
