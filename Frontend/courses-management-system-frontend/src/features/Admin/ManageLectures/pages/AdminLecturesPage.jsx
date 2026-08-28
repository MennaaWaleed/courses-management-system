import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLecturesByBatch, reorderLectures } from '../../../../api/lectureApi'; 
import LectureList from '../components/LectureList';
import AddLectureModal from '../components/Modals/AddLectureModal';
import '../styles/AdminLectures.css';

const AdminLecturesPage = () => {
  const { batchId } = useParams();
  
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchLectures();
  }, [batchId]);

  const fetchLectures = async () => {
    setIsLoading(true);
    try {
      const data = await getLecturesByBatch(batchId);
      const sortedLectures = data.sort((a, b) => a.lectureOrder - b.lectureOrder);
      setLectures(sortedLectures);
    } catch (err) {
      setError(err.message || "Unable to load lectures. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 4000); 
  };

  const handleLectureCreated = () => {
    setIsAddModalOpen(false);
    fetchLectures();
    showSuccessToast("✓ Lecture created successfully");
  };

const handleDragEnd = async (reorderedLectures) => {
    // 1. Optimistic UI update so it feels instant
    setLectures(reorderedLectures);
    
    try {
      // 2. Extract ALL lecture IDs currently rendered on the screen
      const allLectureIds = reorderedLectures.map(lecture => lecture.id);

      // 3. Send the batchId and the complete list of IDs
      await reorderLectures(batchId, allLectureIds);
      
      showSuccessToast("✓ Lecture order updated");
    } catch (err) {
      console.error("Failed to reorder", err);
      // Rollback UI by refetching from server if it fails
      fetchLectures(); 
    }
  };

  // THIS IS THE FUNCTION THAT WAS MISSING OR MISPLACED
  const handleLectureDeleted = async (deletedLectureId) => {
    // 1. Filter out the deleted lecture
    const remainingLectures = lectures.filter(l => l.id !== deletedLectureId);

    // 2. Recalculate sequential orders (so if 3 is deleted, 4 becomes 3)
    const resequencedLectures = remainingLectures.map((l, index) => ({
      ...l,
      lectureOrder: index + 1
    }));

    // 3. Update the UI instantly so the user sees the fixed numbers
    setLectures(resequencedLectures);

    // 4. Send the new sequential order to the backend to save it
    try {
      if (resequencedLectures.length > 0) {
        await reorderLectures(batchId, resequencedLectures.map(l => l.id));
      }
      showSuccessToast("✓ Lecture deleted and order updated");
    } catch (err) {
      console.error("Failed to resequence after deletion", err);
      fetchLectures(); // Fallback: refresh from server if the save fails
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Lectures</h1>
          <p className="admin-page-subtitle">Organize lectures and manage their learning resources.</p>
        </div>
        <button 
          className="lms-btn lms-btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Lecture
        </button>
      </div>

      {isLoading ? (
        <div className="lms-loading-skeleton">Loading lectures...</div>
      ) : error ? (
        <div className="lms-error-state">{error}</div>
      ) : lectures.length === 0 ? (
        <div className="lms-empty-state">
          <h3>No lectures yet</h3>
          <p>Start building this batch by adding your first lecture.</p>
        </div>
      ) : (
        <LectureList 
          lectures={lectures} 
          setLectures={setLectures} 
          onReorder={handleDragEnd} 
          refreshData={fetchLectures}
          onDeleteSuccess={handleLectureDeleted} // No more ReferenceError!
        />
      )}

      {isAddModalOpen && (
        <AddLectureModal 
          batchId={batchId}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleLectureCreated} 
        />
      )}

      {toastMessage && (
        <div className="lms-toast-container">
          <div className="lms-toast">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLecturesPage;