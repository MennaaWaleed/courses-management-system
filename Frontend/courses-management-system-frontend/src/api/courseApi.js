import api from "./axios";

export const getFeaturedCourses = () => {
    return api.get("/courses/featured");
};

export const getCourses = () => {
    return api.get("/courses");
};

export const getCoursesByCategory = (categoryId) => {
    return api.get(`/courses/category/${categoryId}`);
};

export const createCourse = (courseData) => {
    const formData = new FormData();

    formData.append("courseName", courseData.courseName);
    formData.append("description", courseData.description);
    formData.append("shortDescription", courseData.shortDescription);
    formData.append("courseHours", courseData.courseHours);
    formData.append("lectureCount", courseData.lectureCount);
    formData.append("price", courseData.price);

    courseData.categoryIds.forEach((categoryId) => {
        formData.append("categoryIds", categoryId);
    });

    formData.append("contentFile", courseData.contentFile);
    formData.append("courseImage", courseData.courseImage);

    if (courseData.iconImage) {
        formData.append("iconImage", courseData.iconImage);
    }

    return api.post("/courses", formData);
};