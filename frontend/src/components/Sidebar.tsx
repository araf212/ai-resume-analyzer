import React from 'react';
import {
  FileText,
  BarChart3,
  Layers,
  Sparkles,
  Settings,
  Bell,
  Cpu,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasAnalysis: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, hasAnalysis }) => {
  return (
    <aside className="sidebar-dock" aria-label="Main Navigation">
      {/* Top Logo */}
      <div
        className="dock-logo"
        title="AI Resume Analyzer"
        onClick={() => setActiveTab('analyze')}
      >
        <Sparkles size={24} />
      </div>

      {/* Center Nav Pills */}
      <nav className="dock-nav">
        <button
          className={`dock-item ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
          title="Analysis Workspace"
          aria-label="Analysis Workspace"
        >
          <Layers size={20} />
        </button>

        <button
          className={`dock-item ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
          title="Resume & Job Inputs"
          aria-label="Resume & Job Inputs"
        >
          <FileText size={20} />
        </button>

        <button
          className={`dock-item ${activeTab === 'metrics' ? 'active' : ''} ${!hasAnalysis ? 'disabled' : ''}`}
          onClick={() => hasAnalysis && setActiveTab('metrics')}
          title={hasAnalysis ? 'ATS Analytics & Score' : 'Run analysis first'}
          aria-label="ATS Analytics"
          disabled={!hasAnalysis}
          style={{ opacity: hasAnalysis ? 1 : 0.4 }}
        >
          <BarChart3 size={20} />
        </button>

        <button
          className={`dock-item ${activeTab === 'model' ? 'active' : ''}`}
          onClick={() => setActiveTab('model')}
          title="LLM Architecture Info"
          aria-label="LLM Architecture Info"
        >
          <Cpu size={20} />
        </button>
      </nav>

      {/* Bottom Nav Items */}
      <div className="dock-bottom">
        <button
          className="dock-item"
          title="System Notifications"
          aria-label="Notifications"
          onClick={() => alert('All systems operational. LLM provider connected.')}
        >
          <Bell size={20} />
        </button>
        <button
          className="dock-item"
          title="Settings & Guide"
          aria-label="Settings"
          onClick={() => setActiveTab('model')}
        >
          <Settings size={20} />
        </button>
      </div>
    </aside>
  );
};
