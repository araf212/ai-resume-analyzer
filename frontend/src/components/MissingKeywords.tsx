import React, { useState } from 'react';
import { Copy, Check, AlertTriangle, KeyRound } from 'lucide-react';

interface MissingKeywordsProps {
  keywords: string[];
}

export const MissingKeywords: React.FC<MissingKeywordsProps> = ({ keywords }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (keywords.length === 0) return;
    navigator.clipboard.writeText(keywords.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="glass-card missing-keywords-card" id="missing-keywords-section">
      <div className="keywords-header">
        <div className="card-title-group">
          <div
            className="icon-box"
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              borderColor: 'rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
            }}
          >
            <KeyRound size={18} />
          </div>
          <div>
            <h3 className="card-title">Missing Job-Related Keywords ({keywords.length})</h3>
            <p className="card-subtitle">
              Explicit terms & tools found in the job description that are absent in your resume
            </p>
          </div>
        </div>

        {keywords.length > 0 && (
          <button className="btn-copy-keywords" onClick={handleCopy}>
            {copied ? (
              <>
                <Check size={14} color="#34d399" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy All Keywords
              </>
            )}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
        {keywords.length > 0 ? (
          keywords.map((kw, idx) => (
            <span key={`kw-${idx}`} className="missing-tag">
              <AlertTriangle size={13} color="#fbbf24" />
              {kw}
            </span>
          ))
        ) : (
          <p style={{ color: '#34d399', fontSize: 14 }}>
            Fantastic! No major required keywords from the job description appear to be missing.
          </p>
        )}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
        Tip: Integrate these keywords naturally in bullet points that demonstrate actual hands-on accomplishment, rather than simply listing them in a keyword dump.
      </div>
    </div>
  );
};
