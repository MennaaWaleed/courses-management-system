import api from "./axios";

// =====================================================
// ADMIN - GET ALL LECTURES
// =====================================================

export const getLecturesByBatch = async (batchId) => {
  try {
    const response = await api.get(`/api/lectures/batch/${batchId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lectures:", error);
    throw new Error("Failed to fetch lectures. Please try again later.");
  }
};


// =====================================================
// STUDENT - GET PUBLISHED LECTURES
// =====================================================

export const getPublishedLecturesByBatch = async (batchId) => {
  try {
    const response = await api.get(
      `/api/lectures/batch/${batchId}/published`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching published lectures:", error);
    throw new Error("Failed to fetch lectures. Please try again later.");
  }
};


// =====================================================
// CREATE LECTURE
// =====================================================

export const createLecture = async (lectureData) => {
  const response = await api.post("/api/lectures", lectureData);
  return response.data;
};


// =====================================================
// REORDER LECTURES
// =====================================================

export const reorderLectures = async (batchId, lectureIds) => {
  const response = await api.patch("/api/lectures/reorder", {
    batchId: batchId,
    lectureIds: lectureIds
  });

  return response.data;
};


// =====================================================
// PUBLISH
// =====================================================

export const publishLecture = async (lectureId) => {
  const response = await api.patch(
    `/api/lectures/${lectureId}/publish`
  );

  return response.data;
};


// =====================================================
// UNPUBLISH
// =====================================================

export const unpublishLecture = async (lectureId) => {
  const response = await api.patch(
    `/api/lectures/${lectureId}/unpublish`
  );

  return response.data;
};


// =====================================================
// DELETE
// =====================================================

export const deleteLecture = async (lectureId) => {
  const response = await api.delete(
    `/api/lectures/${lectureId}`
  );

  return response.data;
};