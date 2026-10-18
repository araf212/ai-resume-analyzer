import React from 'react';
import { Briefcase, Trash2, ListFilter } from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/sampleData';

interface JobDescInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelectPreset: (presetId: string) => void;
  onClear: () => void;
}

export const JobDescInput: React.FC<JobDescInputProps> = ({
  value,
  onChange,
  onSelectPreset,
  onClear,
}) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="glass-card input-card" id="job-description-section">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-box" style={{ background: 'rgba(56, 189, 248, 0.12)', borderColor: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <h3 className="card-title">2. Target Job Description</h3>
            <p className="card-subtitle">Paste role responsibilities & requirements</p>
          </div>
        </div>

        {/* Quick Sample Preset selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            className="preset-dropdown"
            onChange={(e) => {
              if (e.target.value) {
                onSelectPreset(e.target.value);
              }
            }}
            defaultValue=""
            aria-label="Select sample role preset"
          >
            <option value="" disabled>
              Select Sample Role Preset...
            </option>
            {SAMPLE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.roleTitle}
              </option>
            ))}
          </select>

          {value && (
            <button
              type="button"
              className="btn-remove-file"
              onClick={onClear}
              title="Clear job description"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="textarea-wrapper">
        <textarea
          className="jd-textarea"
          placeholder="Paste the full job posting here (Role title, responsibilities, required technical skills, qualifications, certifications)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          id="job-description-textarea"
        />
        <div className="textarea-footer">
          <span style={{ color: charCount < 30 && charCount > 0 ? '#fb7185' : undefined }}>
            {charCount < 30 ? 'Minimum 30 characters required' : 'Ready for comparison'}
          </span>
          <span>
            {wordCount} words • {charCount} characters
          </span>
        </div>
      </div>
    </div>
  );
};
