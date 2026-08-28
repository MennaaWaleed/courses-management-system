import axiosInstance from './axios'; // عدل المسار حسب مشروعك

export const enrollmentRequestApi = {
    // ---------------- STUDENT ----------------

    // إنشاء طلب انضمام جديد باستخدام كود الدفعة
    createRequest: async (courseId, batchCode) => {
        const response = await axiosInstance.post('/api/enrollment-requests', {
            courseId: courseId || null, // <-- السماح بـ null
            batchCode
        });
        return response.data;
    },

    // جلب طلبات الطالب الحالي
    getMyRequests: async () => {
        const response = await axiosInstance.get('/api/enrollment-requests/my');
        return response.data;
    },

    // ---------------- ADMIN ----------------

    // جلب كل الطلبات للأدمن
    getAllRequests: async () => {
        const response = await axiosInstance.get('/api/admin/enrollment-requests');
        return response.data;
    },

    // الموافقة على الطلب
    acceptRequest: async (id) => {
        const response = await axiosInstance.put(`/api/admin/enrollment-requests/${id}/accept`);
        return response.data;
    },

    // رفض الطلب
    declineRequest: async (id) => {
        const response = await axiosInstance.put(`/api/admin/enrollment-requests/${id}/decline`);
        return response.data;
    }
};