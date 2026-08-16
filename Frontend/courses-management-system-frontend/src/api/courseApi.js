import api from "./axios";

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

export const registerForCourse = (data) => {
    return api.post("/api/course-registrations", data);
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

export const publishCourse = (courseId) => {
    return api.put(`/api/courses/${courseId}/publish`);
};

export const featureCourse = (courseId) => {
    return api.put(`/api/courses/${courseId}/feature`);
};

export const deleteCourse = (courseId) => {
    return api.delete(`/api/courses/${courseId}`);
};

export const updateCourse = (courseId, courseData) => {

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

    formData.append(
        "published",
        courseData.published
    );

    formData.append(
        "featured",
        courseData.featured
    );

    // Multiple category IDs
    courseData.categoryIds.forEach((categoryId) => {
        formData.append(
            "categoryIds",
            categoryId
        );
    });

    // Send new files ONLY if the admin selected them
    if (courseData.courseImage) {
        formData.append(
            "courseImage",
            courseData.courseImage
        );
    }

    if (courseData.iconImage) {
        formData.append(
            "iconImage",
            courseData.iconImage
        );
    }

    if (courseData.contentFile) {
        formData.append(
            "contentFile",
            courseData.contentFile
        );
    }

    const token = sessionStorage.getItem("token");

    return api.put(
        `/api/courses/${courseId}`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};