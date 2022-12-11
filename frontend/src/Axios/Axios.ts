import axios from "axios";

// Add a request interceptor
axios.interceptors.request.use(
    config => {
        // access local storage
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


export default axios;