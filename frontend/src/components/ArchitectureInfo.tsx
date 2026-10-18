import React from 'react';
import { Cpu, ShieldCheck, Zap, Lock, Terminal, ExternalLink } from 'lucide-react';
import { HealthResponse } from '../types';

interface ArchitectureInfoProps {
  health: HealthResponse | null;
}

export const ArchitectureInfo: React.FC<ArchitectureInfoProps> = ({ health }) => {
  return (
    <div className="glass-card" style={{ padding: '32px', marginBottom: '28px' }}>
      <div className="card-header" style={{ marginBottom: 20 }}>
        <div className="card-title-group">
          <div className="icon-box" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--accent-orange)' }}>
            <Cpu size={22} />
          </div>
          <div>
            <h3 className="card-title">LLM Architecture & Privacy Overview</h3>
            <p className="card-subtitle">
              Secure, server-side document parsing and LLM inference pipeline
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Card 1: LLM Engine */}
        <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: 'var(--accent-orange)' }}>
            <Zap size={18} />
            <h4 style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Model Selection</h4>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Selected from <a href="https://github.com/mnfst/awesome-free-llm-apis" target="_blank" rel="noreferrer" style={{ color: '#fed7aa', textDecoration: 'underline' }}>awesome-free-llm-apis</a>. Supports <strong>Google Gemini (gemini-1.5-flash / gemini-2.0-flash)</strong> via Google AI Studio free tier (15 RPM, 1M TPM, 1,500 RPD) and <strong>Groq (llama-3.3-70b-versatile)</strong> with sub-second inference.
          </p>
        </div>

        {/* Card 2: Privacy Guarantees */}
        <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: '#34d399' }}>
            <Lock size={18} />
            <h4 style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Privacy & Security</h4>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Resumes are parsed strictly in memory (RAM) via Multer buffer streams. No files are persisted to disk, and resume contents are never logged to console or telemetry. API keys remain strictly server-side.
          </p>
        </div>

        {/* Card 3: Extraction Engines */}
        <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: '#38bdf8' }}>
            <ShieldCheck size={18} />
            <h4 style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Multi-Format Parsing</h4>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Native binary parsing for <code>.pdf</code> via <code>pdf-parse</code> and <code>.docx</code> via <code>mammoth</code>. Cleans extraneous whitespace, normalizes Unicode, and rejects scanned or unreadable text.
          </p>
        </div>
      </div>

      {/* Local Setup Instructions Box */}
      <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(12, 14, 21, 0.8)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#fed7aa' }}>
          <Terminal size={18} />
          <h4 style={{ fontSize: 14, fontWeight: 600 }}>How to Run Locally</h4>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'monospace', lineHeight: 1.8 }}>
          <div>1. <code>cp .env.example backend/.env</code></div>
          <div>2. Add your free <code>GEMINI_API_KEY</code> from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: '#fed7aa' }}>aistudio.google.com</a></div>
          <div>3. Run <code>npm run dev</code> from project root to launch both backend (:5000) and frontend (:5173).</div>
        </div>
      </div>
    </div>
  );
};
