import api from "./axios";

export const getAllMessages = async () => {
    return await api.get("/api/contact/admin");
};

export const deleteMessage = async (id) => {
    return await api.delete(`/api/contact/admin/${id}`);
};

export const toggleContacted = async (id) => {
    return await api.patch(`/api/contact/admin/${id}/contacted`);
};