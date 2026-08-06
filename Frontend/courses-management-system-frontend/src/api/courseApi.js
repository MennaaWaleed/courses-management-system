import axiosInstance from "./axiosInstance";

export const getFeaturedCourses = () =>
    axiosInstance.get("/courses/featured");