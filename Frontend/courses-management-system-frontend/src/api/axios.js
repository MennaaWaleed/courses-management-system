import axios from "axios";

export const BASE_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: BASE_URL,
});


/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(
    (config) => {

        const token = sessionStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(
    (response) => response,

    (error) => {

        const status = error.response?.status;
        const requestUrl = error.config?.url;

        if (
            status === 401 &&
            !requestUrl?.includes("/auth/login") && !requestUrl?.includes("/auth/register")
        ) {

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            window.location.href = "/auth/login";
        }

        return Promise.reject(error);
    }
);


export default api;