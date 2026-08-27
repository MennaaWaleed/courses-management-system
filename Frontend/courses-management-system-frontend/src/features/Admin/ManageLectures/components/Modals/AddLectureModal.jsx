import React, { useState } from 'react';
import { createLecture } from '../../../../../api/lectureApi';
import { getApiErrorMessage } from '../../../../../utils/apiUtils'; // Import the new helper

const AddLectureModal = ({ batchId, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [lectureOrder, setLectureOrder] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // 1. STRICT FRONTEND VALIDATION
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Lecture title is required and cannot be empty.');
      return;
    }
    
    const orderNum = parseInt(lectureOrder, 10);
    if (isNaN(orderNum) || orderNum < 1) {
      setError('Lecture order must be a valid positive integer.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. API CALL
      await createLecture({
        batchId,
        title: trimmedTitle,
        lectureOrder: orderNum
      });
      
      // 3. SUCCESS STATE
      onSuccess(); // Close modal and refresh list
      // Note: We do NOT call onClose() here because onSuccess() handles the flow in the parent.
      
    } catch (err) {
      // 4. ERROR STATE (Keeps modal open, extracts real backend message)
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lms-modal-overlay" onClick={onClose}>
      <div className="lms-modal-container" onClick={(e) => e.stopPropagation()}>
        
        <div className="lms-modal-header">
          <h2 className="lms-modal-title">Add New Lecture</h2>
          <button type="button" className="lms-close-btn" onClick={onClose} disabled={isSubmitting}>×</button>
        </div>
        
        <div className="lms-modal-body">
          
          {/* THE ERROR ALERT MUST BE HERE (Above the form) */}
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
              <label htmlFor="lectureOrder">Lecture Order / Number</label>
              <input 
                type="number" 
                id="lectureOrder"
                min="1"
                required 
                value={lectureOrder} 
                onChange={(e) => setLectureOrder(e.target.value)}
                disabled={isSubmitting} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Lecture Title</label>
              <input 
                type="text" 
                id="title"
                required 
                placeholder="e.g., Introduction to Java"
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting} 
              />
            </div>

            <div className="form-actions">
              <button type="button" className="lms-btn lms-btn-outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="lms-btn lms-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Lecture'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddLectureModal;