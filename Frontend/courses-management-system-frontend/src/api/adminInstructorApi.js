import api from './axios'; // Assuming you have an axios instance configured with interceptors

export const getInstructors = (search = '') => {
    return api.get(`/api/admin/instructors?search=${encodeURIComponent(search)}`);
};

export const createInstructor = (data) => {
    return api.post('/api/admin/instructors', data);
};

export const updateInstructor = (id, data) => {
    return api.put(`/api/admin/instructors/${id}`, data);
};

export const changeInstructorPassword = (id, newPassword) => {
    return api.put(`/api/admin/instructors/${id}/password`, { newPassword });
};

export const toggleInstructorStatus = (id) => {
    return api.put(`/api/admin/instructors/${id}/toggle-status`);
};

export const deleteInstructor = (id) => {
    return api.delete(`/api/admin/instructors/${id}`);
};