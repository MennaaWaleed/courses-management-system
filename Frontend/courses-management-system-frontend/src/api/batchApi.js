import api from "./axios";

export const getBatchesByCourseId = async (courseId) => {
    const response = await api.get(`/api/courses/${courseId}/batches`);
    return response.data;
};
export const getInstructorOptions = async () => {
    const response = await api.get("/api/courses/instructors-options");
    return response.data;
};

export const createBatch = async (courseId, batchData) => {
    const response = await api.post(`/api/courses/${courseId}/batches`, batchData);
    return response.data;
};

export const softDeleteCourse = async (courseId) => {
    await api.delete(`/api/courses/${courseId}/soft-delete`);
};

// export const removeStudentFromBatch = async (batchId,studentId) => {
//     await api.put(`/api/courses/students/${studentId}/remove-batch`);
// };

export const changeStudentBatch = async (oldBatchId, studentId, newBatchId) => {
    await api.put(`/api/courses/batches/${oldBatchId}/students/${studentId}/change-batch/${newBatchId}`);
};

export const softDeleteBatch = async (batchId) => {
    await api.delete(`/api/courses/batches/${batchId}/soft-delete`);
};

export const getStudentsByBatchId = async (batchId) => {
    const response = await api.get(`/api/courses/batches/${batchId}/students`);
    return response.data;
};
export const getBatchById = async (batchId) => {
    const response = await api.get(`/api/courses/batches/${batchId}`);
    return response.data;
};

export const updateBatch = async (batchId, batchData) => {
    const response = await api.put(`/api/courses/batches/${batchId}`, batchData);
    return response.data;
};
export const getAssignableStudents = async () => {
    const response = await api.get("/api/courses/batches/assignable-students");
    return response.data;
};

export const assignStudentToBatch = async (batchId, studentId) => {
    await api.post(`/api/courses/batches/${batchId}/students/${studentId}`);
};

export const removeStudentFromBatch = async (studentId, batchId) => {
    await api.put(`/api/courses/students/${studentId}/batches/${batchId}/remove`);
};

