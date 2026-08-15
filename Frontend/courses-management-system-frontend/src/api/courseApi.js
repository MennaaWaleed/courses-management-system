import api from "./axios";

// =========================
// Public Courses
// =========================

export const getFeaturedCourses = () => {
    return api.get("/api/courses/featured");
};

export const getCourses = () => {
    return api.get("/api/courses");
};

export const getCourseById = (id) => {
    return api.get(`/api/courses/${id}`);
};

export const getCoursesByCategory = (categoryId) => {
    return api.get(`/api/courses/category/${categoryId}`);
};

export const getRelatedCourses = (id) => {
    return api.get(`/api/courses/${id}/related`);
};

// =========================
// Course Registration
// =========================

export const registerForCourse = (data) => {
    return api.post("/api/course-registrations", data);
};

// =========================
// Admin - Create Course
// =========================

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

    // Multiple category IDs
    courseData.categoryIds.forEach((categoryId) => {
        formData.append(
            "categoryIds",
            categoryId
        );
    });

    // Course content file
    formData.append(
        "contentFile",
        courseData.contentFile
    );

    // Course image
    formData.append(
        "courseImage",
        courseData.courseImage
    );

    // Optional icon
    if (courseData.iconImage) {
        formData.append(
            "iconImage",
            courseData.iconImage
        );
    }

    const token = sessionStorage.getItem("token");

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