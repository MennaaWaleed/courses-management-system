import api from "./axios";

export const getMyCourses = async () => {
    const response = await api.get("/api/enrollments/my-courses");
    return response.data;
};