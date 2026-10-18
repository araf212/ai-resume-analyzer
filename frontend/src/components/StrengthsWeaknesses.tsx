import React from 'react';
import { CheckCircle2, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface StrengthsWeaknessesProps {
  strengths: string[];
  weaknesses: string[];
}

export const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({
  strengths,
  weaknesses,
}) => {
  return (
    <div className="comparison-grid" id="strengths-weaknesses-section">
      {/* Strengths Card */}
      <div className="glass-card evaluation-card" style={{ borderTop: '3px solid #10b981' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div
              className="icon-box"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                color: '#34d399',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="card-title">Key Strengths & Differentiators</h3>
              <p className="card-subtitle">Where the resume strongly aligns with the JD</p>
            </div>
          </div>
        </div>

        <ul className="evaluation-list">
          {strengths.map((str, idx) => (
            <li key={`str-${idx}`} className="evaluation-item">
              <CheckCircle2 size={18} color="#34d399" className="eval-icon" />
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses & Gaps Card */}
      <div className="glass-card evaluation-card" style={{ borderTop: '3px solid #f59e0b' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div
              className="icon-box"
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
              }}
            >
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="card-title">Critical Gaps & Deficiencies</h3>
              <p className="card-subtitle">Missing prerequisites or under-emphasized areas</p>
            </div>
          </div>
        </div>

        <ul className="evaluation-list">
          {weaknesses.map((weak, idx) => (
            <li key={`weak-${idx}`} className="evaluation-item">
              <AlertCircle size={18} color="#fbbf24" className="eval-icon" />
              <span>{weak}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
