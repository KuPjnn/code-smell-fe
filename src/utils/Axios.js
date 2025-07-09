import axios from 'axios';
import {getKeycloakAuthUrl, isAuthenticated, refreshToken} from '@/auth/auth.js';

// Create an Axios instance
const request = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 5000,
});

// Add an interceptor to include the access token in every request
request.interceptors.request.use(async (config) => {
    if (await isAuthenticated()) {
        const token = localStorage.getItem('access_token');
        // If access token exists, attach it to the request headers
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle token renewal on 401 response
request.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    console.log(error.code)
    if (Array.of(400, 401).includes(error.status)) {
        // Refresh the token if access is unauthorized
        await refreshToken().then((response) => {
            error.config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
        }).catch((error) => {
            console.error('Token refresh failed', error);
            window.location.href = getKeycloakAuthUrl();  // Redirect to login
        });
        return axios.request(error.config);
    }
});

export default request;