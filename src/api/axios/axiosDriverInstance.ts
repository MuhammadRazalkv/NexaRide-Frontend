import axios, { AxiosError } from 'axios';
import { loginSuccessDriver , logoutDriver } from '@/Redux/slices/driverAuthSlice';
import  {store} from '@/Redux/store';

const isTokenError = (error: AxiosError): boolean => {
    const status = error.response?.status;
    const errorMessage = (error.response?.data as { message?: string })?.message || '';

    return (
        status === 401 && 
        (errorMessage.includes('token') || errorMessage.includes('expired'))
    );
};


const axiosDriverInstance = axios.create({
    baseURL: 'http://localhost:3000/driver',
    withCredentials: true 
});

// Request Interceptor
axiosDriverInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().driverAuth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosDriverInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('error ',error);
        
        const originalRequest = error.config;

        // Handle Token Expiry
        if (isTokenError(error) && !originalRequest._retry) {
            console.log('Token expire error ');
            
            originalRequest._retry = true;

            try {
                console.log('before sending the response ');
                
                const response = await axios.post('http://localhost:3000/driver/refreshToken', {}, { withCredentials: true });
                console.log('Response ',response);
                
                const newToken = response.data.accessToken;
                const driver = store.getState().driverAuth.driver;

                if (!driver) throw new Error('No user data found');

                const dispatch = store.dispatch;
                dispatch(loginSuccessDriver({  token: newToken ,driverInfo:driver}));

                return axiosDriverInstance(originalRequest);
            } catch (error) {
                console.log('Session expired login out..',error);
                
                const dispatch = store.dispatch;
                dispatch(logoutDriver());
                window.location.href = '/driver/login';  
            }
        }

        // Handle Blocked or Revoked Users
        if (error.response?.status === 403) {
            const dispatch = store.dispatch;
            dispatch(logoutDriver());
            alert('Your account has been blocked. Please contact support.');
            window.location.href = '/driver/login';
        }

        return Promise.reject(error);
    }
);



export default axiosDriverInstance;
