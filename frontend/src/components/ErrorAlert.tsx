import React from 'react';
import { AlertCircle, X, Key, FileWarning, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss, onRetry }) => {
  const isApiKeyIssue = error.toLowerCase().includes('api key') || error.toLowerCase().includes('rate limit');
  const isFileIssue = error.toLowerCase().includes('file') || error.toLowerCase().includes('pdf') || error.toLowerCase().includes('docx');

  return (
    <div className="error-alert" role="alert">
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {isApiKeyIssue ? (
          <Key size={20} color="#fb7185" />
        ) : isFileIssue ? (
          <FileWarning size={20} color="#fb7185" />
        ) : (
          <AlertCircle size={20} color="#fb7185" />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h4 className="error-title">Analysis Failed</h4>
        <p className="error-body">{error}</p>

        {isApiKeyIssue && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#fed7aa', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: 6 }}>
            <strong>Configuration Tip:</strong> Obtain a free Google Gemini API key at{' '}
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#fed7aa', textDecoration: 'underline' }}
            >
              aistudio.google.com
            </a>{' '}
            and add <code>GEMINI_API_KEY=your_key</code> to your <code>backend/.env</code> file, then restart the server.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fecdd3',
              cursor: 'pointer',
              padding: 4,
            }}
            title="Retry"
          >
            <RefreshCw size={16} />
          </button>
        )}
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fecdd3',
            cursor: 'pointer',
            padding: 4,
          }}
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
