import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLectures } from '../hooks/useLectures';
import { LectureAccordion } from '../components/LectureAccordion';
import { ResourceViewerModal } from '../components/ResourceViewerModal';
import { LecturesSkeleton, LecturesError, EmptyLectures } from '../components/StateComponents';
import '../styles/BatchLectures.css';

const BatchLectures = () => {
  // 1. STRICT DYNAMIC ROUTING: No hardcoded fallback IDs
  const { batchId } = useParams();
  const { lectures, isLoading, error, refetch } = useLectures(batchId);
  
  const [activeResource, setActiveResource] = useState(null);

  // 2. STRICT FILTERING & SORTING: Only show published, and order ASC
  const publishedLectures = (lectures || [])
    .filter(l => l.published === true)
    .sort((a, b) => a.lectureOrder - b.lectureOrder);

  // UI-only derived state for the header summary
  const totalLectures = lectures ? lectures.length : 0;
  const availableLecturesCount = publishedLectures.length;
  const progressPercent = totalLectures > 0 ? Math.round((availableLecturesCount / totalLectures) * 100) : 0;

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
                <strong>{totalLectures}</strong> <small>Total Lectures</small>
              </div>
              <div className="lms-progress-divider"></div>
              <div>
                <strong>{availableLecturesCount}</strong> <small>Available</small>
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
        
        {/* Show empty state if there are NO published lectures */}
        {!isLoading && !error && availableLecturesCount === 0 && <EmptyLectures />}

        {!isLoading && !error && availableLecturesCount > 0 && (
          <div className="lms-lecture-list">
            {publishedLectures.map((lecture) => (
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