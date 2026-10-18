import React, { useState } from 'react';
import { SkillCategories } from '../types';
import { Code2, HeartHandshake, Globe2, Wrench } from 'lucide-react';

interface SkillsSectionProps {
  skills: SkillCategories;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'technical' | 'tools' | 'domain' | 'soft'>('all');

  const categories = [
    { key: 'all', label: 'All Extracted Skills', count: (skills.technical?.length || 0) + (skills.tools?.length || 0) + (skills.domain?.length || 0) + (skills.soft?.length || 0) },
    { key: 'technical', label: 'Technical Stack', count: skills.technical?.length || 0 },
    { key: 'tools', label: 'Tools & Cloud', count: skills.tools?.length || 0 },
    { key: 'domain', label: 'Domain & Architecture', count: skills.domain?.length || 0 },
    { key: 'soft', label: 'Leadership & Soft Skills', count: skills.soft?.length || 0 },
  ];

  const getFilteredSkills = () => {
    switch (activeCategory) {
      case 'technical':
        return skills.technical.map(s => ({ name: s, type: 'technical' }));
      case 'tools':
        return skills.tools.map(s => ({ name: s, type: 'tools' }));
      case 'domain':
        return skills.domain.map(s => ({ name: s, type: 'domain' }));
      case 'soft':
        return skills.soft.map(s => ({ name: s, type: 'soft' }));
      default:
        return [
          ...skills.technical.map(s => ({ name: s, type: 'technical' })),
          ...skills.tools.map(s => ({ name: s, type: 'tools' })),
          ...skills.domain.map(s => ({ name: s, type: 'domain' })),
          ...skills.soft.map(s => ({ name: s, type: 'soft' })),
        ];
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'technical':
        return '#f97316';
      case 'tools':
        return '#38bdf8';
      case 'domain':
        return '#8b5cf6';
      case 'soft':
        return '#10b981';
      default:
        return '#cbd5e1';
    }
  };

  const filtered = getFilteredSkills();

  return (
    <div className="glass-card skills-container" id="skills-section">
      <div className="card-header" style={{ marginBottom: 14 }}>
        <div className="card-title-group">
          <div className="icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)', color: '#a855f7' }}>
            <Code2 size={20} />
          </div>
          <div>
            <h3 className="card-title">Extracted Skills Inventory</h3>
            <p className="card-subtitle">Technologies, frameworks, and competencies extracted from resume</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="skills-tabs">
        {categories.map((c) => (
          <button
            key={c.key}
            className={`skill-tab-btn ${activeCategory === c.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(c.key as any)}
          >
            {c.label} ({c.count})
          </button>
        ))}
      </div>

      {/* Skills Pill Cloud */}
      <div className="skills-cloud">
        {filtered.length > 0 ? (
          filtered.map((skill, idx) => (
            <span key={`${skill.name}-${idx}`} className="skill-chip">
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: getBadgeColor(skill.type),
                  boxShadow: `0 0 6px ${getBadgeColor(skill.type)}`,
                }}
              />
              {skill.name}
            </span>
          ))
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No skills in this category.</p>
        )}
      </div>
    </div>
  );
};
