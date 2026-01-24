import apiService from './apiClient';

/**
 * Event Service
 * Handles all event-related API calls including budget requests
 */
const eventService = {
    /**
     * Get all events (visibility based on user role)
     * - Volunteers see only APPROVED events
     * - Admins/Superusers see all events
     * @returns {Promise<Object>} Response with list of events
     */
    getAllEvents: async () => {
        return await apiService.get('/events');
    },

    /**
     * Get event by ID
     * @param {number} eventId - Event ID
     * @returns {Promise<Object>} Response with event details
     */
    getEventById: async (eventId) => {
        return await apiService.get(`/events/${eventId}`);
    },

    /**
     * Create new event (Admin/Superuser only)
     * @param {Object} eventData - { name, location, description, budget, leadVolunteerId }
     * @returns {Promise<Object>} Response with created event
     */
    createEvent: async (eventData) => {
        return await apiService.post('/events', eventData);
    },

    /**
     * Approve event (Admin/Superuser only)
     * @param {number} eventId - Event ID
     * @returns {Promise<Object>} Response with approved event
     */
    approveEvent: async (eventId) => {
        return await apiService.put(`/events/${eventId}/approve`);
    },

    /**
     * Update event (Admin/Superuser only)
     * @param {number} eventId - Event ID
     * @param {Object} eventData - Updated event data
     * @returns {Promise<Object>} Response with updated event
     */
    updateEvent: async (eventId, eventData) => {
        return await apiService.put(`/events/${eventId}`, eventData);
    },

    /**
     * Delete event (Admin/Superuser only)
     * @param {number} eventId - Event ID
     * @returns {Promise<Object>} Response with deletion status
     */
    deleteEvent: async (eventId) => {
        return await apiService.delete(`/events/${eventId}`);
    },

    /**
     * Join event as volunteer (Volunteer only, approved events)
     * @param {number} eventId - Event ID
     * @returns {Promise<Object>} Response with updated event
     */
    joinEvent: async (eventId) => {
        return await apiService.post(`/events/${eventId}/join`);
    },

    /**
     * Request budget increase (Lead volunteer only)
     * @param {Object} budgetRequest - { eventId, requestedAmount, reason }
     * @returns {Promise<Object>} Response with budget request details
     */
    requestBudgetIncrease: async (budgetRequest) => {
        return await apiService.post('/events/budget-request', budgetRequest);
    },

    /**
     * Approve budget request (Admin/Superuser only)
     * @param {number} requestId - Budget request ID
     * @returns {Promise<Object>} Response with approved budget request
     */
    approveBudgetRequest: async (requestId) => {
        return await apiService.put(`/events/budget-request/${requestId}/approve`);
    },

    /**
     * Reject budget request (Admin/Superuser only)
     * @param {number} requestId - Budget request ID
     * @param {string} reason - Rejection reason
     * @returns {Promise<Object>} Response with rejected budget request
     */
    rejectBudgetRequest: async (requestId, reason) => {
        return await apiService.put(`/events/budget-request/${requestId}/reject`, null, {
            params: { reason }
        });
    },

    /**
     * Get all budget requests (Admin/Superuser only)
     * @returns {Promise<Object>} Response with list of budget requests
     */
    getAllBudgetRequests: async () => {
        return await apiService.get('/events/budget-requests');
    },

    /**
     * Get volunteer's own budget requests
     * @returns {Promise<Object>} Response with list of budget requests
     */
    getMyBudgetRequests: async () => {
        return await apiService.get('/events/budget-requests/my');
    },
};

export default eventService;
