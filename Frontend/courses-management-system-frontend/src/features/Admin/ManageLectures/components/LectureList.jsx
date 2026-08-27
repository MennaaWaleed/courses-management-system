import React, { useState, useRef } from 'react';
import LectureAccordionItem from './LectureAccordionItem';

const LectureList = ({ lectures, setLectures, onReorder, refreshData, onDeleteSuccess }) => {

  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const dragNode = useRef();

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    dragNode.current = e.target;
    // Slight delay to allow the drag image to generate before adding opacity
    setTimeout(() => {
      if (dragNode.current) dragNode.current.classList.add('dragging');
    }, 0);
  };

  const handleDragEnter = (e, index) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    // Create a deep copy of lectures to reorder
    const newLectures = [...lectures];
    const draggedItem = newLectures[draggedItemIndex];
    
    // Remove from old position and insert at new position
    newLectures.splice(draggedItemIndex, 1);
    newLectures.splice(index, 0, draggedItem);
    
    // Reassign sequential orders based on new index
    const updatedLectures = newLectures.map((lecture, i) => ({
      ...lecture,
      lectureOrder: i + 1
    }));

    setDraggedItemIndex(index);
    setLectures(updatedLectures);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    if (dragNode.current) {
      dragNode.current.classList.remove('dragging');
    }
    // Fire the API call passed down from the parent
    if (onReorder) {
      onReorder(lectures);
    }
  };

return (
    <div className="lecture-list-container">
      {lectures.map((lecture, index) => (
        <LectureAccordionItem
          key={lecture.id}
          index={index}
          lecture={lecture}
          refreshData={refreshData}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDeleteSuccess={onDeleteSuccess} // 2. Pass it down here!
        />
      ))}
    </div>
  );
};
export default LectureList;