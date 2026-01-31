import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5016/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Add response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // Don't redirect if we're already on a public page
        const publicPages = ['/login', '/register'];
        const isPublicPage = publicPages.some(page => window.location.pathname.includes(page));

        // Only try to refresh on 401 and not for auth endpoints or public pages
        if (
            error.response?.status === 401 &&
            !isPublicPage &&
            !originalRequest.url?.includes("/auth/refresh") &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/register") &&
            !originalRequest.url?.includes("/auth/me")
        ) {
            originalRequest._retry = true;

            try {
                await api.post("/auth/refresh");
                // Retry the original request
                return api.request(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;