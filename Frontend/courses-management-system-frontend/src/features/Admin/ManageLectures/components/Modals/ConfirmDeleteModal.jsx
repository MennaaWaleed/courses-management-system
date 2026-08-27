import React from 'react';

const ConfirmDeleteModal = ({ title, message, isProcessing, onConfirm, onCancel }) => {
  return (
    <div className="lms-modal-overlay z-50">
      <div className="lms-modal-container modal-sm">
        <div className="lms-modal-header">
          <h2 className="lms-modal-title text-danger">{title}</h2>
          <button className="lms-close-btn" onClick={onCancel} disabled={isProcessing}>×</button>
        </div>
        
        <div className="lms-modal-body">
          <p className="confirmation-message">{message}</p>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="lms-btn lms-btn-outline" 
              onClick={onCancel} 
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="lms-btn lms-btn-danger" 
              onClick={onConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;