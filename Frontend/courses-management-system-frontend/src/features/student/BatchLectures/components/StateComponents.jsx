// src/features/student/BatchLectures/components/StateComponents.jsx
import React from 'react';

export const LecturesSkeleton = () => (
  <div className="lms-skeleton-wrapper">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="lms-skeleton-card">
        <div className="lms-skeleton-circle"></div>
        <div className="lms-skeleton-lines">
          <div className="lms-skeleton-line short"></div>
          <div className="lms-skeleton-line long"></div>
        </div>
      </div>
    ))}
  </div>
);

export const LecturesError = ({ message, onRetry }) => (
  <div className="lms-state-container error">
    <div className="lms-state-icon">⚠️</div>
    <h3>Unable to load lectures</h3>
    <p>{message}</p>
    <button className="lms-btn-primary" onClick={onRetry}>Try Again</button>
  </div>
);

export const EmptyLectures = () => (
  <div className="lms-state-container empty">
    <div className="lms-state-icon">📚</div>
    <h3>No lectures available yet</h3>
    <p>Your instructor hasn't published any lectures for this batch.</p>
  </div>
);