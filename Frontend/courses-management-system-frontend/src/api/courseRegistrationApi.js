import api from "./axios";


// Create registration - Public
export const createCourseRegistration = async (data) => {

    const response = await api.post(
        "/api/course-registrations",
        data
    );

    return response.data;
};


// Get all registrations - ADMIN ONLY
export const getCourseRegistrations = async () => {

    const response = await api.get(
        "/api/course-registrations"
    );

    return response.data;
};


// Get one registration - ADMIN ONLY
export const getCourseRegistrationById = async (id) => {

    const response = await api.get(
        `/api/course-registrations/${id}`
    );

    return response.data;
};


// Toggle Contacted Status - ADMIN ONLY
export const toggleRegistrationContacted = async (id) => {

    const response = await api.patch(
        `/api/course-registrations/${id}/contacted`
    );

    return response.data;
};


// Delete Registration - ADMIN ONLY
export const deleteRegistration = async (id) => {

    await api.delete(
        `/api/course-registrations/${id}`
    );
};