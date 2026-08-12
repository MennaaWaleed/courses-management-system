import api from "./axios";

export const getFeaturedCourses = () =>
    api.get("/api/courses/featured");

export const getCourses = () =>
    api.get("/api/courses");


export const getCourseById = (id) =>
    api.get(`/api/courses/${id}`);

export const getRelatedCourses = (id) => {
    return api.get(`/api/courses/${id}/related`);
};