// src/features/student/BatchLectures/components/LectureAccordion.jsx
import React, { useState } from 'react';
import { formatBytes, resolveResourceUrl } from '../../../../utils/resourceUtils';

// SVG Icons defined cleanly
const Icons = {
  VIDEO: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
  PDF: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  DOCUMENT: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
  ZIP: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  LINK: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
  LOCK: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  CHEVRON: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  DOWNLOAD: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
};

export const LectureAccordion = ({ lecture, onOpenResource }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLocked = !lecture.published;

  const toggleExpand = () => {
    if (isLocked) return;
    setIsExpanded(!isExpanded);
  };

  const padOrder = (num) => String(num).padStart(2, '0');

  return (
    <div className={`lms-accordion-card ${isLocked ? 'is-locked' : ''} ${isExpanded ? 'is-expanded' : ''}`}>
      <button 
        className="lms-accordion-header" 
        onClick={toggleExpand}
        aria-expanded={isExpanded}
        disabled={isLocked}
      >
        <div className="lms-lecture-meta">
          <span className="lms-lecture-number">{padOrder(lecture.lectureOrder)}</span>
          <div className="lms-lecture-titles">
            <h3>{lecture.title}</h3>
            {!isLocked && (
              <span className="lms-resource-count">
                {lecture.resources?.length || 0} resources
              </span>
            )}
          </div>
        </div>

        <div className="lms-accordion-actions">
          {isLocked ? (
            <span className="lms-locked-badge">
              {Icons.LOCK} Coming Soon
            </span>
          ) : (
            <span className={`lms-chevron ${isExpanded ? 'rotated' : ''}`}>
              {Icons.CHEVRON}
            </span>
          )}
        </div>
      </button>

      {/* Accordion Body */}
      <div 
        className="lms-accordion-body" 
        style={{ maxHeight: isExpanded ? '1000px' : '0px', opacity: isExpanded ? 1 : 0 }}
      >
        <div className="lms-resources-list">
          {lecture.resources?.map((resource) => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              onOpenResource={onOpenResource} 
            />
          ))}
          {(!lecture.resources || lecture.resources.length === 0) && (
            <p className="lms-empty-resources">No resources attached to this lecture yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ resource, onOpenResource }) => {
  const isVideo = resource.type === 'VIDEO';
  const isLink = resource.type === 'LINK';

  const handleMainClick = () => {
    if (isVideo) {
      onOpenResource(resource);
    } else if (isLink) {
      window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      // For PDF, DOCUMENT, ZIP: Clicking the card can open the viewer (if PDF/Doc) or trigger download
      if (resource.type === 'PDF' || resource.type === 'DOCUMENT') {
        onOpenResource(resource);
      } else {
        handleDownload();
      }
    }
  };

  const handleDownload = (e) => {
    if (e) e.stopPropagation(); // Prevent card click event from firing simultaneously
    const resolvedUrl = resolveResourceUrl(resource.fileUrl);
    
    // Create an invisible anchor to enforce a browser download action
    const anchor = document.createElement('a');
    anchor.href = resolvedUrl;
    anchor.download = resource.name || 'download';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="lms-resource-card" onClick={handleMainClick}>
      <div className="lms-resource-icon">
        {Icons[resource.type] || Icons.DOCUMENT}
      </div>
      <div className="lms-resource-info">
        <h4>{resource.name}</h4>
        <div className="lms-resource-details">
          <span>{resource.type}</span>
          {resource.size > 0 && (
            <>
              <span className="lms-dot-separator">•</span>
              <span>{formatBytes(resource.size)}</span>
            </>
          )}
        </div>
      </div>

      <div className="lms-resource-actions-group">
        {isVideo ? (
          <span className="lms-action-badge view-badge">Watch Video</span>
        ) : isLink ? (
          <span className="lms-action-badge open-badge">Open Link</span>
        ) : (
          <div className="lms-dual-actions">
            {(resource.type === 'PDF' || resource.type === 'DOCUMENT') && (
              <button className="lms-action-text-btn" onClick={(e) => { e.stopPropagation(); onOpenResource(resource); }}>
                View
              </button>
            )}
            <button 
              className="lms-download-btn" 
              onClick={handleDownload}
              title={`Download ${resource.name}`}
              aria-label={`Download ${resource.name}`}
            >
              {Icons.DOWNLOAD}
              <span>Download</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};