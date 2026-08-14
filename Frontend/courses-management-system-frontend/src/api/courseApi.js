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

export const registerForCourse = (data) => {
    return api.post("/api/course-registrations", data);
export const getFeaturedCourses = () => {
    return api.get("/api/courses/featured");
};

export const getCourses = () => {
    return api.get("/api/courses");
};

export const getCoursesByCategory = (categoryId) => {
    return api.get(`/api/courses/category/${categoryId}`);
};

export const createCourse = (courseData) => {

    const formData = new FormData();

    formData.append(
        "courseName",
        courseData.courseName
    );

    formData.append(
        "description",
        courseData.description
    );

    formData.append(
        "shortDescription",
        courseData.shortDescription
    );

    formData.append(
        "courseHours",
        courseData.courseHours
    );

    formData.append(
        "lectureCount",
        courseData.lectureCount
    );

    formData.append(
        "price",
        courseData.price
    );

    courseData.categoryIds.forEach((categoryId) => {
        formData.append(
            "categoryIds",
            categoryId
        );
    });

    formData.append(
        "contentFile",
        courseData.contentFile
    );

    formData.append(
        "courseImage",
        courseData.courseImage
    );

    if (courseData.iconImage) {
        formData.append(
            "iconImage",
            courseData.iconImage
        );
    }

    const token = sessionStorage.getItem("token");

    console.log("TOKEN:", token);

    return api.post(
        "/api/courses",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};