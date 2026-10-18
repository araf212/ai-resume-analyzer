import React from 'react';
import { TrendingUp, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { AnalysisResult } from '../types';

interface HeroBannerProps {
  onStartClick: () => void;
  analysis: AnalysisResult | null;
  isLoading: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartClick,
  analysis,
  isLoading,
}) => {
  const matchScore = analysis?.matchScore ?? 84;
  const totalSkills = analysis?.quantifiedMetrics?.totalSkillsExtracted ?? 24;
  const missingCount = analysis?.quantifiedMetrics?.missingKeywordsCount ?? 3;
  const expYears = analysis?.quantifiedMetrics?.experienceYearsEstimated ?? '4+ Years';

  return (
    <section className="hero-banner-card" aria-label="Hero Overview">
      <div className="hero-content">
        <div className="hero-tag">
          <Zap size={14} />
          <span>Next-Gen Talent Intelligence</span>
        </div>

        <h2 className="hero-title">
          Optimize Your <br /> Match Score
        </h2>

        <p className="hero-description">
          Evaluate your resume against real-world Job Descriptions. Get instant ATS compatibility metrics, extracted skill graphs, gap analysis, and tailored recommendations.
        </p>

        {/* Floating frosted glass stats overlay (Direct reference to resume analytics.jpg) */}
        <div className="hero-stats-overlay">
          <div className="hero-stat-item">
            <span className="hero-stat-value">{analysis ? `${matchScore}%` : '88%'}</span>
            <span className="hero-stat-label">
              <span className="hero-stat-dot" style={{ backgroundColor: '#10b981' }} />
              ATS Match
            </span>
          </div>

          <div className="hero-stat-divider" />

          <div className="hero-stat-item">
            <span className="hero-stat-value">{analysis ? totalSkills : '26+'}</span>
            <span className="hero-stat-label">
              <span className="hero-stat-dot" style={{ backgroundColor: '#38bdf8' }} />
              Skills Found
            </span>
          </div>

          <div className="hero-stat-divider" />

          <div className="hero-stat-item">
            <span className="hero-stat-value">{analysis ? missingCount : '4'}</span>
            <span className="hero-stat-label">
              <span className="hero-stat-dot" style={{ backgroundColor: '#f59e0b' }} />
              Gaps Detected
            </span>
          </div>

          <div className="hero-stat-divider" />

          <div className="hero-stat-item">
            <span className="hero-stat-value">{analysis ? expYears : '5+ Yrs'}</span>
            <span className="hero-stat-label">
              <span className="hero-stat-dot" style={{ backgroundColor: '#f97316' }} />
              Exp. Alignment
            </span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <button
          className="btn-primary-analyze"
          onClick={onStartClick}
          disabled={isLoading}
          style={{ padding: '16px 36px', fontSize: '16px' }}
        >
          {isLoading ? 'Analyzing...' : analysis ? 'Analyze Another Role' : 'Start Analysis Now'}
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};
