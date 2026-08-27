import api from './axios'; // Or whatever your axios instance is named

export const lectureResourceApi = {
  // 1. Upload a physical file (Already working because it uses FormData)
  uploadResource: async (lectureId, formData) => {
    const response = await api.post(
      `/api/lecture-resources/lecture/${lectureId}/upload`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  // 2. Add a Google Drive link (FIXED: Send as params)
  addDriveResource: async (lectureId, payload) => {
    const response = await api.post(
      `/api/lecture-resources/lecture/${lectureId}/drive`, 
      null, // <--- No JSON body
      { params: payload } // <--- Sends as ?name=...&type=...&fileUrl=...
    );
    return response.data;
  },

  // 3. Add an external link (FIXED: Send as params)
  addExternalResource: async (lectureId, payload) => {
    const response = await api.post(
      `/api/lecture-resources/lecture/${lectureId}/external`, 
      null, // <--- No JSON body
      { params: payload } // <--- Sends as ?name=...&type=...&fileUrl=...
    );
    return response.data;
  },

  // 4. Delete a resource
  deleteResource: async (resourceId) => {
    const response = await api.delete(`/api/lecture-resources/${resourceId}`);
    return response.data;
  }
};