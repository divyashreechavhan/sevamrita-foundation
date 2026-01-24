import { apiClient } from './apiClient';

// API Base URL - Update this if your backend URL changes
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Auth Service
const authService = {
    // Register new volunteer
    register: async (registrationData) => {
        try {
            const response = await apiClient.post('/auth/register', registrationData);

            if (response.status !== 201 && response.status !== 200) {
                const error = response.data;
                throw new Error(error.message || 'Registration failed');
            }

            const data = response.data;
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Registration failed'
            };
        }
    },

    // Login user
    login: async (username, password) => {
        try {
            const response = await apiClient.post('/auth/login', { username, password });

            if (response.status !== 200) {
                const error = response.data;
                throw new Error(error.message || 'Login failed');
            }

            const data = response.data;

            // Store JWT token and user info in localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);

                // Store user info including role
                const userInfo = {
                    id: data.userId || data.id,
                    username: data.username || username,
                    role: data.role || 'VOLUNTEER',
                };
                localStorage.setItem('user', JSON.stringify(userInfo));
            }

            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Login failed'
            };
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Get JWT token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get authorization header
    getAuthHeader: () => {
        const token = authService.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // Get user role
    getUserRole: () => {
        const user = authService.getCurrentUser();
        return user?.role || null;
    },

    // Check if user has specific role
    hasRole: (role) => {
        const userRole = authService.getUserRole();
        return userRole === role;
    },

    // Check if user has any of the specified roles
    hasAnyRole: (roles) => {
        const userRole = authService.getUserRole();
        return roles.includes(userRole);
    },

    // Check if user is admin or superuser
    isAdmin: () => {
        return authService.hasAnyRole(['ADMIN', 'SUPERUSER']);
    },

    // Check if user is superuser
    isSuperuser: () => {
        return authService.hasRole('SUPERUSER');
    },

    // Check if user is volunteer
    isVolunteer: () => {
        return authService.hasRole('VOLUNTEER');
    },
};

export default authService;

