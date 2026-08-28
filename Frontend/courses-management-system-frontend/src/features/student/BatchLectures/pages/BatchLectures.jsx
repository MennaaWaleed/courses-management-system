// src/features/student/BatchLectures/pages/BatchLectures.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLectures } from '../hooks/useLectures';
import { LectureAccordion } from '../components/LectureAccordion';
import { ResourceViewerModal } from '../components/ResourceViewerModal';
import { LecturesSkeleton, LecturesError, EmptyLectures } from '../components/StateComponents';
import '../styles/BatchLectures.css';

const BatchLectures = () => {
  // Use a hardcoded fallback ONLY if params aren't set during testing
  const { batchId = '33333333-3333-3333-3333-333333333333' } = useParams();
  const { lectures, isLoading, error, refetch } = useLectures(batchId);
  
  const [activeResource, setActiveResource] = useState(null);

  // UI-only derived state for the header summary
  const totalLectures = lectures.length;
  const publishedLectures = lectures.filter(l => l.published).length;
  const progressPercent = totalLectures > 0 ? Math.round((publishedLectures / totalLectures) * 100) : 0;

  return (
    <div className="lms-page-container">
      {/* Header Section */}
      <header className="lms-page-header">
        <div className="lms-header-content">
          <h1 className="lms-title">Course Lectures</h1>
          <p className="lms-subtitle">Continue your learning journey</p>
        </div>
        
        {!isLoading && !error && totalLectures > 0 && (
          <div className="lms-progress-card">
            <div className="lms-progress-stats">
              <div>
                <strong>{totalLectures}</strong> <small>Lectures</small>
              </div>
              <div className="lms-progress-divider"></div>
              <div>
                <strong>{publishedLectures}</strong> <small>Available</small>
              </div>
            </div>
            <div className="lms-progress-bar-bg">
              <div 
                className="lms-progress-bar-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="lms-main-content">
        {isLoading && <LecturesSkeleton />}
        
        {error && <LecturesError message={error} onRetry={refetch} />}
        
        {!isLoading && !error && totalLectures === 0 && <EmptyLectures />}

        {!isLoading && !error && totalLectures > 0 && (
          <div className="lms-lecture-list">
            {lectures.map((lecture) => (
              <LectureAccordion 
                key={lecture.id} 
                lecture={lecture} 
                onOpenResource={setActiveResource} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Dedicated Resource Viewer Modal */}
      {activeResource && (
        <ResourceViewerModal 
          resource={activeResource} 
          onClose={() => setActiveResource(null)} 
        />
      )}
    </div>
  );
};

export default BatchLectures;