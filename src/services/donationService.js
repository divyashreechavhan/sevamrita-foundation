import apiService from './apiClient';

/**
 * Donation Service
 * Handles all donation-related API calls
 */
const donationService = {
    /**
     * Submit a donation (Public endpoint - no authentication required)
     * @param {Object} donationData - { donorName, phone, email, amount, description }
     * @returns {Promise<Object>} Response with success status and data
     */
    submitDonation: async (donationData) => {
        return await apiService.post('/donations', donationData);
    },

    /**
     * Get all donations (Admin/Superuser only)
     * @returns {Promise<Object>} Response with list of donations
     */
    getAllDonations: async () => {
        return await apiService.get('/donations');
    },

    /**
     * Get donations by specific donor (Admin/Superuser only)
     * @param {number} donorId - Donor ID
     * @returns {Promise<Object>} Response with donor's donations
     */
    getDonationsByDonor: async (donorId) => {
        return await apiService.get(`/donations/donor/${donorId}`);
    },
};

export default donationService;
