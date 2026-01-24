import apiService from './apiClient';

/**
 * User Service
 * Handles all user management API calls
 */
const userService = {
    /**
     * Get all users (Admin/Superuser only)
     * @returns {Promise<Object>} Response with list of users
     */
    getAllUsers: async () => {
        return await apiService.get('/users');
    },

    /**
     * Get user by ID (Admin/Superuser only)
     * @param {number} userId - User ID
     * @returns {Promise<Object>} Response with user details
     */
    getUserById: async (userId) => {
        return await apiService.get(`/users/${userId}`);
    },

    /**
     * Get users by role (Admin/Superuser only)
     * @param {string} role - Role (VOLUNTEER, ADMIN, SUPERUSER)
     * @returns {Promise<Object>} Response with list of users
     */
    getUsersByRole: async (role) => {
        return await apiService.get(`/users/role/${role}`);
    },

    /**
     * Assign role to user (Admin/Superuser only)
     * @param {number} userId - User ID
     * @param {string} role - Role to assign (VOLUNTEER, ADMIN, SUPERUSER)
     * @returns {Promise<Object>} Response with updated user
     */
    assignRole: async (userId, role) => {
        return await apiService.post(`/users/${userId}/assign-role`, { userId, role });
    },

    /**
     * Update user profile (Authenticated user only)
     * @param {Object} profileData - { fullName, email, phone, organizationId }
     * @returns {Promise<Object>} Response with updated user
     */
    updateProfile: async (profileData) => {
        return await apiService.put('/users/profile', profileData);
    },

    /**
     * Assign organization to user (Admin/Superuser only)
     * @param {number} userId - User ID
     * @param {number} organizationId - Organization ID
     * @returns {Promise<Object>} Response with updated user
     */
    assignOrganization: async (userId, organizationId) => {
        return await apiService.put(`/users/${userId}/organization`, { organizationId });
    },

    /**
     * Get current user's profile
     * @returns {Promise<Object>} Response with user profile details
     */
    getProfile: async () => {
        return await apiService.get('/users/profile');
    },
};

export default userService;
