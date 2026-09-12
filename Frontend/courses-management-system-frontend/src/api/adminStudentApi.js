import api from "./axios";

/* =========================
   GET ALL STUDENTS
========================= */

export const getAllStudents = async () => {
    const response = await api.get("/api/admin/students");
    return response.data;
};


/* =========================
   GET STUDENT DETAILS
========================= */

export const getStudentDetails = async (studentId) => {
    const response = await api.get(
        `/api/admin/students/${studentId}`
    );

    return response.data;
};


/* =========================
   GET AVAILABLE BATCHES
========================= */

export const getAvailableBatches = async (
    studentId,
    courseId
) => {
    const response = await api.get(
        `/api/admin/students/${studentId}/courses/${courseId}/batches`
    );

    return response.data;
};


/* =========================
   CHANGE STUDENT BATCH
========================= */

export const changeStudentBatch = async (
    studentId,
    currentBatchId,
    newBatchId
) => {
    const response = await api.put(
        `/api/admin/students/${studentId}/enrollments/${currentBatchId}/batch/${newBatchId}`
    );

    return response.data;
};


/* =========================
   REMOVE STUDENT FROM BATCH
========================= */

export const removeStudentFromBatch = async (
    studentId,
    batchId
) => {
    const response = await api.delete(
        `/api/admin/students/${studentId}/enrollments/${batchId}`
    );

    return response.data;
};

export const updateStudentStatus = (studentId, enabled) =>
    api.put(`/api/admin/students/${studentId}/status`, null, {
        params: { enabled }
    });