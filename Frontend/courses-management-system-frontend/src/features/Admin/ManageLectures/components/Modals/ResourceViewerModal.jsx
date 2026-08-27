import React from 'react';
import { BASE_URL } from '../../../../../api/axios';

const ResourceViewerModal = ({ resource, onClose }) => {
  if (!resource) return null;

  // HELPER FUNCTION: Fixes relative URLs for uploaded files using your existing BASE_URL
  const getFullUrl = (url) => {
    if (!url) return '';
    
    // If it's already a full Google Drive or external URL, leave it alone
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Use the BASE_URL imported from your axios config!
    // We remove any double slashes just in case your URL starts with one
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
    return `${BASE_URL}${cleanUrl}`;
  };

  const renderContent = () => {
    // 1. VIDEO RENDERING LOGIC
    if (resource.type === 'VIDEO') {
      if (resource.source === 'DRIVE') {
        return (
          <iframe 
            src={resource.previewUrl} 
            className="resource-iframe"
            title={resource.name}
            allow="autoplay"
            allowFullScreen
          />
        );
      }
      if (resource.source === 'UPLOAD') {
        return (
          <video controls className="resource-video-player" autoPlay>
            <source src={getFullUrl(resource.fileUrl)} />
            Your browser does not support the video tag.
          </video>
        );
      }
    }

    // 2. PDF RENDERING LOGIC
    if (resource.type === 'PDF') {
      const pdfUrl = resource.source === 'DRIVE' ? resource.previewUrl : getFullUrl(resource.fileUrl);
      
      return (
        <iframe 
          src={pdfUrl} 
          className="resource-iframe pdf-viewer"
          title={resource.name}
        />
      );
    }

    // Fallback/Error state for unsupported embedded previews
    return (
      <div className="viewer-unsupported">
        <p>This resource type cannot be previewed in the browser.</p>
        <a 
          href={getFullUrl(resource.fileUrl)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="lms-btn lms-btn-primary"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <div className="lms-modal-overlay">
      <div className="lms-modal-container viewer-modal">
        <div className="lms-modal-header">
          <h2 className="lms-modal-title">{resource.name}</h2>
          <button className="lms-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="lms-modal-body viewer-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ResourceViewerModal;