import axios from 'axios';

const axiosAdminInstance = axios.create({
    baseURL: 'http://localhost:3000/admin',
    withCredentials: true 
});


axiosAdminInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log('response ',error.response);
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post('http://localhost:3000/admin/refresh-token', {}, { withCredentials: true });

                return axiosAdminInstance(originalRequest);  // Retry the original request
            } catch (error) {
                alert('Session expired Logging out..')                
                console.error('Session expired. Logging out...',error);
                window.location.href = '/admin/login';  
            }
        }

        return Promise.reject(error);
    }
);

export default axiosAdminInstance;
