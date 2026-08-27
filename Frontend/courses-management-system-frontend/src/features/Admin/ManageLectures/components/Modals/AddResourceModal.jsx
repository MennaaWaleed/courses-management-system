import React, { useState } from 'react';
import { lectureResourceApi } from '../../../../../api/lectureResourceApi';
import { getApiErrorMessage } from '../../../../../utils/apiUtils'; // Import the error helper

const AddResourceModal = ({ lectureId, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('UPLOAD'); // UPLOAD, DRIVE, EXTERNAL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [type, setType] = useState('VIDEO');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (activeTab === 'UPLOAD') {
        if (!file) throw new Error("Please select a file to upload.");
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('file', file);
        await lectureResourceApi.uploadResource(lectureId, formData);
      } 
      else if (activeTab === 'DRIVE') {
        if (!url.includes('drive.google.com')) throw new Error("Invalid Google Drive URL");
        await lectureResourceApi.addDriveResource(lectureId, { name, type, fileUrl: url });
      } 
      else if (activeTab === 'EXTERNAL') {
        await lectureResourceApi.addExternalResource(lectureId, { name, type, fileUrl: url });
      }

      onSuccess(); // Close modal and refresh in parent
    } catch (err) {
      // Use the helper to extract a clean message
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lms-modal-overlay" onClick={onClose}>
      <div className="lms-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="lms-modal-header">
          <h2 className="lms-modal-title">Add Resource</h2>
          <button type="button" className="lms-close-btn" onClick={onClose} aria-label="Close" disabled={isSubmitting}>×</button>
        </div>

        {/* TABS */}
        <div className="segmented-controls-wrapper">
          <div className="segmented-controls">
            <button type="button" className={activeTab === 'UPLOAD' ? 'active' : ''} onClick={() => setActiveTab('UPLOAD')} disabled={isSubmitting}>Upload File</button>
            <button type="button" className={activeTab === 'DRIVE' ? 'active' : ''} onClick={() => setActiveTab('DRIVE')} disabled={isSubmitting}>Google Drive</button>
            <button type="button" className={activeTab === 'EXTERNAL' ? 'active' : ''} onClick={() => setActiveTab('EXTERNAL')} disabled={isSubmitting}>External Link</button>
          </div>
        </div>

        {/* BODY */}
        <div className="lms-modal-body">
          
          {/* FIXED ERROR ALERT AT THE TOP */}
          {error && (
            <div className="lms-alert lms-alert-error" style={{ width: '100%', boxSizing: 'border-box' }}>
              <svg className="lms-alert-icon" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="lms-form">
            <div className="form-group">
              <label>Resource Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Chapter 1 Notes" disabled={isSubmitting} />
            </div>
            
            <div className="form-group">
              <label>Resource Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} disabled={isSubmitting}>
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
                <option value="DOCUMENT">Document</option>
                <option value="ZIP">ZIP File</option>
                <option value="RAR">RAR Archive</option>
                {activeTab === 'EXTERNAL' && <option value="LINK">External Link</option>}
              </select>
            </div>

            {activeTab === 'UPLOAD' ? (
              <div className="form-group">
                <label>Upload File</label>
                <div className="file-drop-area">
                  <div className="file-drop-icon">📁</div>
                  <p className="file-drop-text">
                    {file ? <strong>{file.name}</strong> : <>Drag & drop your file here or <strong>Browse</strong></>}
                  </p>
                  {file && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
                  <input type="file" required className="file-drop-input" onChange={(e) => setFile(e.target.files[0])} disabled={isSubmitting} />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label>{activeTab === 'DRIVE' ? 'Google Drive Link' : 'External URL'}</label>
                <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." disabled={isSubmitting} />
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="lms-btn lms-btn-outline" onClick={onClose} disabled={isSubmitting}>Cancel</button>
              
              <button type="submit" className="lms-btn lms-btn-primary" disabled={isSubmitting}>
                {isSubmitting && (
                  <svg className="lms-spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmitting ? 'Saving...' : 'Add Resource'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddResourceModal;