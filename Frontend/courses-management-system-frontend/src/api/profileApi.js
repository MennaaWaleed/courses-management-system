import api from "./axios";

export const fetchUserProfile = async () => {
    const response = await api.get("/api/users/me");
    return response.data;
};