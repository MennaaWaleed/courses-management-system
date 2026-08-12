import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const getCategories = () => API.get("/categories");

export const getPublishedCategories = () =>
    API.get("/categories/published");
