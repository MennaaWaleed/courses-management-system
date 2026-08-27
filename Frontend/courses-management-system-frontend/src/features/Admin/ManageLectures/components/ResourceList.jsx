import React, { useState } from 'react';
import { lectureResourceApi } from '../../../../api/lectureResourceApi';
import ResourceViewerModal from './Modals/ResourceViewerModal';
import ConfirmDeleteModal from './Modals/ConfirmDeleteModal';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '';
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const getResourceIcon = (type) => {
  switch (type) {
    case 'VIDEO': return '▶';
    case 'PDF': return '📄';
    case 'DOCUMENT': return '📝';
    case 'ZIP': 
    case 'RAR': return '📦';
    case 'LINK': return '🔗';
    default: return '📄';
  }
};

const getSourceLabel = (source) => {
  if (source === 'DRIVE') return 'Google Drive';
  if (source === 'EXTERNAL') return 'External Link';
  return 'Uploaded';
};

const ResourceList = ({ resources, refreshData }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!resources || resources.length === 0) {
    return (
      <div className="lms-empty-state lms-empty-state-sm">
        <p>No resources added yet. Add a video, PDF, document, ZIP file, or external link.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await lectureResourceApi.deleteResource(resourceToDelete.id);
      refreshData();
      setResourceToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="resource-list">
      {resources.map((resource) => (
        <div key={resource.id} className="resource-item">
          
          <div className="resource-item-left">
            <div className="resource-icon">{getResourceIcon(resource.type)}</div>
            <div className="resource-info">
              {/* Name is isolated here, preventing duplicate type text */}
              <span className="resource-name">{resource.name}</span>
              <span className="resource-meta">
                {resource.type} • {getSourceLabel(resource.source)} 
                {resource.size > 0 ? ` • ${formatFileSize(resource.size)}` : ''}
              </span>
            </div>
          </div>
          
          <div className="resource-item-actions">
            {['VIDEO', 'PDF'].includes(resource.type) ? (
              <button 
                className="lms-btn lms-btn-text" 
                onClick={() => setSelectedResource(resource)}
              >
                Preview
              </button>
            ) : (
              <a 
                href={resource.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="lms-btn lms-btn-text"
              >
                {resource.type === 'LINK' ? 'Open' : 'Download'}
              </a>
            )}
            
            <button 
              className="lms-btn lms-btn-text text-danger" 
              onClick={() => setResourceToDelete(resource)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {selectedResource && (
        <ResourceViewerModal 
          resource={selectedResource} 
          onClose={() => setSelectedResource(null)} 
        />
      )}

      {resourceToDelete && (
        <ConfirmDeleteModal
          title="Delete resource?"
          message={`This resource (${resourceToDelete.name}) will be permanently removed from this lecture.`}
          isProcessing={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setResourceToDelete(null)}
        />
      )}
    </div>
  );
};

export default ResourceList;