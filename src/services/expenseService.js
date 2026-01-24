import apiService from './apiClient';

/**
 * Expense Service
 * Handles all expense-related API calls
 */
const expenseService = {
    /**
     * Raise an expense (Volunteer who joined the event)
     * @param {Object} expenseData - { eventId, amount, description }
     * @returns {Promise<Object>} Response with created expense
     */
    raiseExpense: async (expenseData) => {
        return await apiService.post('/expenses', expenseData);
    },

    /**
     * Approve expense (Lead volunteer/Admin/Superuser)
     * @param {number} expenseId - Expense ID
     * @returns {Promise<Object>} Response with approved expense
     */
    approveExpense: async (expenseId) => {
        return await apiService.put(`/expenses/${expenseId}/approve`);
    },

    /**
     * Reject expense (Lead volunteer/Admin/Superuser)
     * @param {number} expenseId - Expense ID
     * @param {string} reason - Rejection reason
     * @returns {Promise<Object>} Response with rejected expense
     */
    rejectExpense: async (expenseId, reason) => {
        return await apiService.put(`/expenses/${expenseId}/reject`, null, {
            params: { reason }
        });
    },

    /**
     * Get expenses by event
     * @param {number} eventId - Event ID
     * @returns {Promise<Object>} Response with list of expenses
     */
    getExpensesByEvent: async (eventId) => {
        return await apiService.get(`/expenses/event/${eventId}`);
    },

    /**
     * Get expenses by user
     * @param {number} userId - User ID
     * @returns {Promise<Object>} Response with list of expenses
     */
    getExpensesByUser: async (userId) => {
        return await apiService.get(`/expenses/user/${userId}`);
    },

    /**
     * Get all expenses (Admin/Superuser only)
     * @returns {Promise<Object>} Response with list of expenses
     */
    getAllExpenses: async () => {
        return await apiService.get('/expenses');
    }
};

export default expenseService;
