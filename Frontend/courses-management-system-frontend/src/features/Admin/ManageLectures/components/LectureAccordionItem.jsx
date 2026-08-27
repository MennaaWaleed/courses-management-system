import React, { useState, useRef, useEffect } from 'react';
import ResourceList from './ResourceList';
import AddResourceModal from './Modals/AddResourceModal';
import ConfirmDeleteModal from './Modals/ConfirmDeleteModal';
import { publishLecture, unpublishLecture, deleteLecture } from '../../../../api/lectureApi';

const LectureAccordionItem = ({ 
  lecture, 
  index, 
  onDragStart, 
  onDragEnter, 
  onDragEnd, 
  refreshData,
  onDeleteSuccess 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  
  // New States for Menu and Delete Actions
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const menuRef = useRef(null);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const toggleAccordion = (e) => {
    // If the click originated from any button, drag handle, or menu, do nothing
    if (
      e.target.closest('button') || 
      e.target.closest('.drag-handle') || 
      e.target.closest('.lms-dropdown-menu') ||
      e.target.closest('.lecture-header-right')
    ) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  // --- API HANDLERS ---
  const handlePublishToggle = async (e) => {
    e.stopPropagation(); // Prevent accordion from expanding
    setIsMenuOpen(false); // Close the menu
    try {
      if (lecture.published) {
        await unpublishLecture(lecture.id);
      } else {
        await publishLecture(lecture.id);
      }
      refreshData(); // Refresh the list to show new status
    } catch (err) {
      console.error("Failed to toggle publish status", err);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLecture(lecture.id); // Delete it from the database
      setShowDeleteConfirm(false);
      
      // Tell the parent page to re-sequence the remaining lectures!
      if (onDeleteSuccess) {
        onDeleteSuccess(lecture.id);
      } else {
        refreshData();
      }
      
    } catch (err) {
      console.error("Failed to delete lecture", err);
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className={`lecture-card ${isExpanded ? 'expanded' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="lecture-header" onClick={toggleAccordion}>
        
        {/* LEFT SIDE */}
        <div className="lecture-header-left">
          <span className="drag-handle" title="Drag to reorder">☰</span>
          <span className="lecture-number">{String(lecture.lectureOrder).padStart(2, '0')}</span>
          <h3 className="lecture-title">{lecture.title}</h3>
        </div>
        
        {/* RIGHT SIDE */}
       {/* RIGHT SIDE */}
        <div 
          className="lecture-header-right" 
          onClick={(e) => e.stopPropagation()}
        >
          <span className="resource-count">
            {lecture.resources?.length || 0} Resources
          </span>
          <span className={`status-badge ${lecture.published ? 'published' : 'unpublished'}`}>
            {lecture.published ? 'Published' : 'Draft'}
          </span>
          
          {/* THREE DOT MENU */}
          <div className="lecture-actions" ref={menuRef} style={{ position: 'relative' }}>
            <button 
              className="action-menu-btn" 
              aria-label="Lecture Actions"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              ⋮
            </button>
            
            {/* DROPDOWN UI */}
            {isMenuOpen && (
              <div className="lms-dropdown-menu">
                <button onClick={handlePublishToggle} className="lms-dropdown-item">
                  {lecture.published ? 'Unpublish Lecture' : 'Publish Lecture'}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    setShowDeleteConfirm(true);
                  }} 
                  className="lms-dropdown-item text-danger"
                >
                  Delete Lecture
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RESOURCES SECTION */}
      {isExpanded && (
        <div className="lecture-body">
          <div className="lecture-body-header">
            <h4 className="resources-title">Resources</h4>
            <button 
              className="lms-btn lms-btn-outline lms-btn-sm" 
              onClick={() => setIsResourceModalOpen(true)}
            >
              + Add Resource
            </button>
          </div>
          
          <ResourceList resources={lecture.resources} refreshData={refreshData} />
        </div>
      )}

      {/* MODALS */}
      {isResourceModalOpen && (
        <AddResourceModal 
          lectureId={lecture.id}
          onClose={() => setIsResourceModalOpen(false)}
          onSuccess={refreshData}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          title="Delete Lecture?"
          message={`Are you sure you want to delete "${lecture.title}"? All resources inside this lecture will also be permanently deleted.`}
          isProcessing={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default LectureAccordionItem;