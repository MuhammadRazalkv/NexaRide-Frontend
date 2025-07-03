import axios, { AxiosError } from "axios";
import { logout, sLogin } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { userLogout } from "../auth/user";

const isTokenError = (error: AxiosError): boolean => {
  const status = error.response?.status;
  const errorMessage =
    (error.response?.data as { message?: string })?.message || "";

  return (
    status === 401 &&
    (errorMessage.includes("token") || errorMessage.includes("expired"))
  );
};

const axiosUserInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/user`,
  withCredentials: true,
});

// Request Interceptor
axiosUserInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosUserInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("Error Details:", error);

    const originalRequest = error.config;

    if (isTokenError(error) && !originalRequest._retry) {
      console.log("Token expiry detected. Attempting token refresh...");

      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/refreshToken`,
          {},
          { withCredentials: true }
        );

        const newToken = response.data.accessToken;
        const user = store.getState().auth.user;

        if (!user) throw new Error("No user data found");

        const dispatch = store.dispatch;
        dispatch(sLogin({ user, token: newToken }));

        return axiosUserInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        const dispatch = store.dispatch;
        dispatch(logout());

        alert("Session expired. Logging out...");
        window.location.href = "/user/login";
      }
    }


    if (error.response?.status === 403) {
      const dispatch = store.dispatch;
      await userLogout()
      dispatch(logout());
      alert("Your account has been blocked. Please contact support.");
      window.location.href = "/user/login";
    }
 

    // Pass non-token-related errors to the original request
    return Promise.reject(error);
  }
);

export default axiosUserInstance;
