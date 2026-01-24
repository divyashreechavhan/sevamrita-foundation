import axios from 'axios';
import authService from './authService';

// API Base URL - can be configured via environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    console.error('Unauthorized access - logging out');
                    authService.logout();
                    window.location.href = '/';
                    break;
                case 403:
                    // Forbidden - insufficient permissions
                    console.error('Access forbidden - insufficient permissions');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 500:
                    // Server error
                    console.error('Server error occurred');
                    break;
                default:
                    console.error('API error:', data.message || 'Unknown error');
            }

            // Return formatted error
            return Promise.reject({
                status,
                message: data.message || 'An error occurred',
                data: data,
            });
        } else if (error.request) {
            // Request made but no response received
            console.error('Network error - no response from server');
            return Promise.reject({
                status: 0,
                message: 'Network error - please check your connection',
            });
        } else {
            // Something else happened
            console.error('Request error:', error.message);
            return Promise.reject({
                status: 0,
                message: error.message || 'Request failed',
            });
        }
    }
);

// Helper methods for common HTTP operations
const apiService = {
    // GET request
    get: async (url, config = {}) => {
        try {
            const response = await apiClient.get(url, config);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Request failed', details: error };
        }
    },

    // POST request
    post: async (url, data = {}, config = {}) => {
        try {
            const response = await apiClient.post(url, data, config);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Request failed', details: error };
        }
    },

    // PUT request
    put: async (url, data = {}, config = {}) => {
        try {
            const response = await apiClient.put(url, data, config);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Request failed', details: error };
        }
    },

    // DELETE request
    delete: async (url, config = {}) => {
        try {
            const response = await apiClient.delete(url, config);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Request failed', details: error };
        }
    },

    // PATCH request
    patch: async (url, data = {}, config = {}) => {
        try {
            const response = await apiClient.patch(url, data, config);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Request failed', details: error };
        }
    },
};

export { apiClient, API_BASE_URL };
export default apiService;
