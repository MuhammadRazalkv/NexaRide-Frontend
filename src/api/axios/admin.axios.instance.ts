import { adminLogin, adminLogout } from "@/redux/slices/adminAuthSlice";
import { store } from "@/redux/store";
import axios, { AxiosError } from "axios";

const isTokenError = (error: AxiosError): boolean => {
  const status = error.response?.status;
  const errorMessage =
    (error.response?.data as { message?: string })?.message || "";

  return (
    status === 401 &&
    (errorMessage.includes("token") || errorMessage.includes("expired"))
  );
};

const axiosAdminInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/admin`,
  withCredentials: true,
});
axiosAdminInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().adminAuth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosAdminInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("response ", error.response);

    if (isTokenError(error) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/refreshToken`,
          {},
          { withCredentials: true }
        );
        const newToken = response.data.accessToken;

        const dispatch = store.dispatch;
        dispatch(adminLogin({ token: newToken }));
        return axiosAdminInstance(originalRequest);
      } catch (error) {
        alert("Session expired Logging out..");
        console.error("Session expired. Logging out...", error);
        const dispatch = store.dispatch;
        dispatch(adminLogout());
        // window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosAdminInstance;
