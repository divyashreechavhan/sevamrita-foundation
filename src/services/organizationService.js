import apiService from './apiClient';

/**
 * Organization Service
 * Handles all organization-related API calls
 */
const organizationService = {
    /**
     * Get all organizations (Public)
     * @returns {Promise<Object>} Response with list of organizations
     */
    getAllOrganizations: async () => {
        return await apiService.get('/organizations');
    },

    /**
     * Get organization by ID (Public)
     * @param {number} id - Organization ID
     * @returns {Promise<Object>} Response with organization details
     */
    getOrganizationById: async (id) => {
        return await apiService.get(`/organizations/${id}`);
    },

    /**
     * Create organization (Admin/Superuser only)
     * @param {Object} orgData - Organization data
     * @returns {Promise<Object>} Response with created organization
     */
    createOrganization: async (orgData) => {
        return await apiService.post('/organizations', orgData);
    },

    /**
     * Update organization (Admin/Superuser only)
     * @param {number} id - Organization ID
     * @param {Object} orgData - Updated organization data
     * @returns {Promise<Object>} Response with updated organization
     */
    updateOrganization: async (id, orgData) => {
        return await apiService.put(`/organizations/${id}`, orgData);
    },

    /**
     * Delete organization (Admin/Superuser only)
     * @param {number} id - Organization ID
     * @returns {Promise<Object>} Response confirming deletion
     */
    deleteOrganization: async (id) => {
        return await apiService.delete(`/organizations/${id}`);
    },

    /**
     * Get organizations by type (Public)
     * @param {string} type - Organization type
     * @returns {Promise<Object>} Response with filtered organizations
     */
    getOrganizationsByType: async (type) => {
        return await apiService.get(`/organizations/type/${type}`);
    },

    /**
     * Get events for a specific organization (Public)
     * @param {number} id - Organization ID
     * @returns {Promise<Object>} Response with organization's events
     */
    getOrganizationEvents: async (id) => {
        return await apiService.get(`/organizations/${id}/events`);
    },
};

export default organizationService;
