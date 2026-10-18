import React from 'react';
import { ImprovementSuggestion } from '../types';
import { Lightbulb, ArrowUpRight } from 'lucide-react';

interface ImprovementSuggestionsProps {
  suggestions: ImprovementSuggestion[];
}

export const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({ suggestions }) => {
  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'high';
      case 'low':
        return 'low';
      default:
        return 'medium';
    }
  };

  return (
    <div className="glass-card suggestions-card" id="suggestions-section">
      <div className="card-header">
        <div className="card-title-group">
          <div
            className="icon-box"
            style={{
              background: 'rgba(249, 115, 22, 0.15)',
              borderColor: 'rgba(249, 115, 22, 0.3)',
              color: 'var(--accent-orange)',
            }}
          >
            <Lightbulb size={20} />
          </div>
          <div>
            <h3 className="card-title">Actionable Improvement Roadmap</h3>
            <p className="card-subtitle">
              Prioritized modifications to boost your ATS match score for this role
            </p>
          </div>
        </div>
      </div>

      <div className="suggestions-list">
        {suggestions.map((item, idx) => (
          <div key={`sug-${idx}`} className="suggestion-item">
            <span className={`priority-pill ${getPriorityClass(item.priority)}`}>
              {item.priority} Priority
            </span>

            <div style={{ flex: 1 }}>
              <h4 className="suggestion-area">{item.area}</h4>
              <p className="suggestion-text">{item.recommendation}</p>
            </div>

            <ArrowUpRight size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
};
