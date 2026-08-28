import React, { useEffect } from 'react';
import { resolveResourceUrl } from '../../../../utils/resourceUtils';
import '../styles/BatchLectures.css';

// NEW HELPER: Detects YouTube URLs and converts them to embed links
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}` 
    : null;
};

const VideoViewer = ({ resource }) => {
  const isDrive = resource.source === 'DRIVE';
  const isExternal = resource.source === 'EXTERNAL';
  
  // FIXED: encodeURI safely translates spaces and special characters like [ ] into URL-safe formats
  const rawUrl = isDrive ? resource.previewUrl : resolveResourceUrl(resource.fileUrl);
  const resolvedUrl = encodeURI(rawUrl);

  // 1. Google Drive Video
  if (isDrive) {
    return (
      <iframe
        src={resolvedUrl}
        className="lms-viewer-iframe"
        allow="autoplay; fullscreen"
        title={resource.name}
      />
    );
  }

  // 2. YouTube / External Video
  if (isExternal) {
    const youtubeUrl = getYouTubeEmbedUrl(resource.fileUrl);
    
    if (youtubeUrl) {
      return (
        <iframe
          src={youtubeUrl}
          className="lms-viewer-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={resource.name}
        />
      );
    } else {
      // Fallback for non-YouTube external videos
      return (
        <div className="lms-viewer-unsupported">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <h3>External Video</h3>
          <p>This video cannot be previewed directly in the browser.</p>
          <a href={encodeURI(resource.fileUrl)} target="_blank" rel="noreferrer" className="lms-btn-primary">
            Open Video Link
          </a>
        </div>
      );
    }
  }

  // 3. Uploaded Local Video
  return (
    <video 
      controls 
      controlsList="nodownload"
      className="lms-viewer-video" 
      src={resolvedUrl}
      autoPlay
    >
      Your browser does not support the video tag.
    </video>
  );
};

const PdfViewer = ({ resource }) => {
  // FIXED: Added encodeURI to handle special characters like [ ] in PDF filenames
  const resolvedUrl = encodeURI(resolveResourceUrl(resource.fileUrl));
  return (
    <iframe
      src={`${resolvedUrl}#toolbar=0`}
      className="lms-viewer-iframe"
      title={resource.name}
    />
  );
};

export const ResourceViewerModal = ({ resource, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!resource) return null;

  const renderContent = () => {
    switch (resource.type) {
      case 'VIDEO':
        return <VideoViewer resource={resource} />;
      case 'PDF':
        return <PdfViewer resource={resource} />;
      default:
        return (
          <div className="lms-viewer-unsupported">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
            <h3>Preview not available</h3>
            <p>This resource type ({resource.type}) cannot be viewed in the browser.</p>
            {/* FIXED: Added encodeURI for downloads as well */}
            <a href={encodeURI(resolveResourceUrl(resource.fileUrl))} download target="_blank" rel="noreferrer" className="lms-btn-primary">
              Download File
            </a>
          </div>
        );
    }
  };

  return (
    <div className="lms-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lms-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="lms-modal-header">
          <div className="lms-modal-title">
            <span className="lms-badge">{resource.type}</span>
            <h2>{resource.name}</h2>
          </div>
          <button className="lms-close-btn" onClick={onClose} aria-label="Close viewer">
            ✕
          </button>
        </div>
        <div className="lms-modal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};