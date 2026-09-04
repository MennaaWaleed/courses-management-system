import api from "./axios";

export const addToWishlist = async (courseId) => {
    const response = await api.post(`/api/wishlist/${courseId}`);
    return response.data;
};

export const removeFromWishlist = async (courseId) => {
    const response = await api.delete(`/api/wishlist/${courseId}`);
    return response.data;
};

export const checkWishlist = async (courseId) => {
    const response = await api.get(`/api/wishlist/${courseId}`);
    return response.data;
};