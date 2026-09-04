import api from "./axios";
export const getAllMessages = async () => {
    return await api.get("/api/contact/admin");
};

export const deleteMessage = async (id) => {
    return await api.delete(`/api/admin/messages/${id}`);
};