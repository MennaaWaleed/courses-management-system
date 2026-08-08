import axiosInstance from "./axiosInstance";

export const getFeaturedCourses = () =>
    axiosInstance.get("/courses/featured");

export const getCourses = () =>
    axiosInstance.get("/courses");