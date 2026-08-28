import React from 'react';
import { BASE_URL } from '../../../../../api/axios';

const ResourceViewerModal = ({ resource, onClose }) => {
  if (!resource) return null;

  // HELPER FUNCTION: Fixes relative URLs for uploaded files
// HELPER FUNCTION: Fixes relative URLs for uploaded files
  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
    // NEW: encodeURI safely translates spaces and special characters like [ ] into URL-safe formats
    return `${BASE_URL}${encodeURI(cleanUrl)}`;
  };

  // NEW HELPER: Detects YouTube URLs and converts them to embed links
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    // Regex matches youtu.be, youtube.com/watch?v=, youtube.com/embed/ etc.
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    // YouTube IDs are exactly 11 characters
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : null;
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

      // 3. NEW LOGIC: YouTube / External Videos
      if (resource.source === 'EXTERNAL') {
        const youtubeUrl = getYouTubeEmbedUrl(resource.fileUrl);
        
        if (youtubeUrl) {
          return (
            <iframe 
              src={youtubeUrl} 
              className="resource-iframe"
              title={resource.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          );
        } else {
          // Edge Case: If they provided an external video link that IS NOT YouTube
          return (
            <div className="viewer-unsupported" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ marginBottom: '1rem' }}>This external video cannot be previewed directly.</p>
              <a 
                href={resource.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="lms-btn lms-btn-primary"
              >
                Open Video Link
              </a>
            </div>
          );
        }
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

    // 3. ARCHIVES / DOCUMENTS LOGIC (DOWNLOAD-ONLY FALLBACK)
    return (
      <div className="viewer-unsupported" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ marginBottom: '1rem' }}>This resource type ({resource.type}) is for download only and cannot be previewed in the browser.</p>
        <a 
          href={getFullUrl(resource.fileUrl)} 
          download 
          target="_blank" 
          rel="noopener noreferrer" 
          className="lms-btn lms-btn-primary"
        >
          Download {resource.type.toLowerCase()}
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