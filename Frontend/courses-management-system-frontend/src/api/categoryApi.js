import api from "./axios";

export const getCategories = () => {
    return api.get("/api/categories");
};

export const getCategoryById = (id) => {
    return api.get(`/api/categories/${id}`);
};

export const getPublishedCategories = () => {
    return api.get("/api/categories/published");
};

export const createCategory = (categoryData) => {
    return api.post("/api/categories", categoryData);
};

export const updateCategory = (id, categoryData) => {
    const formData = new FormData();

    formData.append("categoryName", categoryData.categoryName);
    formData.append("categoryDescription", categoryData.categoryDescription);
    formData.append("shortDescription", categoryData.shortDescription);

    if (categoryData.image) {
        formData.append("image", categoryData.image);
    }

    return api.put(`/api/categories/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const toggleCategoryPublished = (id) => {
    return api.put(`/api/categories/${id}/publish`);
};

export const deleteCategory = (id) => {
    return api.delete(`/api/categories/${id}`);
};