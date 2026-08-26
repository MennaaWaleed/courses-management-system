
import api from "./axios";

export const getLecturesByBatch = async (batchId) => {
  try {
  
    const response = await api.get(`/api/lectures/batch/${batchId}`);
    
    return response.data;
    
  } catch (error) {
    console.error("Error fetching lectures:", error);
    throw new Error('Failed to fetch lectures. Please try again later.');
  }
};