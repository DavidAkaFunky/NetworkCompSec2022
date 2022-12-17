import axios, { AxiosError } from "axios";

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers!['Authorization'] = "Bearer " + token;
        }

        config.headers!['Content-Type'] = 'application/json';
        config.headers!['Accept'] = 'application/json';

        return config;
    },
    error => {
        Promise.reject(error);
    }
)

// response interceptor to renew access token on receiving token expired error
axios.interceptors.response.use(undefined, async (error: AxiosError) => {

    // Access token expired
    if(error.response?.status === 403 && error.config) {

        console.log(2);

        const originalRequestConfig = error.config;
        delete originalRequestConfig?.headers!['Authorization'];
        
        const response = await axios.get('/api/auth/refresh', {
            withCredentials: true,
        });

        if(response.status === 200) {
            sessionStorage.setItem("accessToken", response.data.accessToken);
            return axios.request(originalRequestConfig);
        }
    }
});

export default axios;