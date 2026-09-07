import api from "./axios";

export const fetchUserProfile = async () => {
    const response = await api.get("/api/users/me");
    return response.data;
};


export const changeProfilePassword = async (data) => {
    const response = await api.put("/api/users/profile/password", data);
    return response.data;
};