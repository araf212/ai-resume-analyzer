import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const STEPS = [
  'Extracting document text and normalizing structure...',
  'Extracting technical skills, domain expertise & certifications...',
  'Running LLM cross-comparison against Job Description...',
  'Calculating honest ATS match score & identifying missing keywords...',
  'Synthesizing actionable improvement roadmap...',
];

export const LoadingState: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card loading-box" aria-live="polite">
      <div className="spinner-glow" />

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
        Auditing Resume Against Role Requirements
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 500, margin: '0 auto 20px auto' }}>
        Please wait a moment while the LLM conducts an ATS compliance analysis.
      </p>

      <div className="loading-steps">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIdx;
          const isCurrent = idx === currentStepIdx;

          return (
            <div key={idx} className="loading-step-item">
              {isDone ? (
                <CheckCircle2 size={16} color="#34d399" />
              ) : isCurrent ? (
                <Loader2 size={16} color="var(--accent-orange)" className="animate-spin" />
              ) : (
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: '1px solid var(--border-subtle)',
                    display: 'inline-block',
                  }}
                />
              )}
              <span
                style={{
                  color: isCurrent ? '#ffffff' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)',
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
