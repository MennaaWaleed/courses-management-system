import api from "./axios";

export const getLecturesByBatch = async (batchId) => {
  try {
    const response = await api.get(`/api/lectures/batch/${batchId}`);
    // Note: This returns the data array directly
    return response.data; 
  } catch (error) {
    console.error("Error fetching lectures:", error);
    throw new Error('Failed to fetch lectures. Please try again later.');
  }
};

// ADD THIS: Required for AddLectureModal.jsx
export const createLecture = async (lectureData) => {
  const response = await api.post('/api/lectures', lectureData);
  return response.data;
};

// ADD THIS (Optional): Required if you want the Drag-and-Drop reorder to save to the database
export const reorderLectures = async (batchId, lectureIds) => {
  // FIXED: Changed to api.patch and updated the URL to match your backend controller
  const response = await api.patch('/api/lectures/reorder', {
    batchId: batchId,
    lectureIds: lectureIds // Ensure this matches your LectureReorderRequest DTO
  });
  return response.data;
};

// Add these to your existing src/api/lectureApi.js file

export const publishLecture = async (lectureId) => {
  const response = await api.patch(`/api/lectures/${lectureId}/publish`);
  return response.data;
};

export const unpublishLecture = async (lectureId) => {
  const response = await api.patch(`/api/lectures/${lectureId}/unpublish`);
  return response.data;
};

// Also add the delete endpoint since we will put it in the same menu!
export const deleteLecture = async (lectureId) => {
  const response = await api.delete(`/api/lectures/${lectureId}`);
  return response.data;
};