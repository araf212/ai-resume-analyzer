import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Edit3 } from 'lucide-react';

interface ResumeUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  rawText: string;
  onRawTextChange: (text: string) => void;
  mode: 'file' | 'text';
  onModeChange: (mode: 'file' | 'text') => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  selectedFile,
  onFileSelect,
  rawText,
  onRawTextChange,
  mode,
  onModeChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf' && extension !== 'docx') {
      setErrorMsg('Invalid format. Please upload a PDF (.pdf) or Word (.docx) file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(`File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="glass-card input-card" id="resume-input-section">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-box">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="card-title">1. Candidate Resume</h3>
            <p className="card-subtitle">Upload PDF, DOCX or paste resume text</p>
          </div>
        </div>

        {/* Tab switch between File Upload and Text Paste */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className={`pill-badge ${mode === 'file' ? 'active-indicator' : ''}`}
            onClick={() => onModeChange('file')}
            style={{ cursor: 'pointer' }}
          >
            Upload File
          </button>
          <button
            type="button"
            className={`pill-badge ${mode === 'text' ? 'active-indicator' : ''}`}
            onClick={() => onModeChange('text')}
            style={{ cursor: 'pointer' }}
          >
            <Edit3 size={12} />
            Paste Text
          </button>
        </div>
      </div>

      {mode === 'file' ? (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
            id="resume-file-input"
          />

          {!selectedFile ? (
            <div
              className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <div className="upload-icon-circle">
                <UploadCloud size={28} />
              </div>
              <div>
                <p className="upload-title">Click to upload or drag & drop</p>
                <p className="upload-hint">PDF or DOCX documents (Maximum 5MB)</p>
              </div>
            </div>
          ) : (
            <div className="file-preview-box">
              <div className="file-info">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'rgba(249, 115, 22, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-orange)',
                  }}
                >
                  <FileText size={20} />
                </div>
                <div>
                  <p className="file-name" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                  <p className="file-meta">
                    {formatFileSize(selectedFile.size)} • {selectedFile.name.split('.').pop()?.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-remove-file"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                title="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="textarea-wrapper">
          <textarea
            className="jd-textarea"
            placeholder="Paste raw resume text here (Summary, Experience, Skills, Education)..."
            value={rawText}
            onChange={(e) => onRawTextChange(e.target.value)}
            rows={8}
            id="resume-raw-textarea"
          />
          <div className="textarea-footer">
            <span>Minimum 50 characters required</span>
            <span>{rawText.length} characters</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#fb7185', fontSize: '13px' }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
