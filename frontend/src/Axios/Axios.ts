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

// response interceptor for status 403
axios.interceptors.response.use(undefined, async (error: AxiosError) => {

    if(error.response?.status === 403 && error.config) {

        const originalRequestConfig = error.config;
        delete originalRequestConfig?.headers!['Authorization'];
        
        const response = await axios.get('/auth/refresh', {
            withCredentials: true,
        });

        if(response.status === 200) {
            localStorage.setItem('accessToken', response.data.accessToken);
            return axios.request(originalRequestConfig);
        }
    }

    return Promise.reject(error);
});

export default axios;