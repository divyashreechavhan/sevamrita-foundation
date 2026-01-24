import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import expenseService from '../../../services/expenseService';
import eventService from '../../../services/eventService';
import StatCard from './components/StatCard';
import ConfirmDialog from './components/ConfirmDialog';
import Badge from './components/Badge';
import '../../CSS/ExpenseBudgetManagement.css';

const ExpenseBudgetManagement = () => {
    const [expenses, setExpenses] = useState([]);
    const [budgetRequests, setBudgetRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('expenses');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Action states
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [expRes, budRes] = await Promise.all([
                expenseService.getAllExpenses(),
                eventService.getAllBudgetRequests()
            ]);

            if (expRes.success) setExpenses(expRes.data || []);
            if (budRes.success) setBudgetRequests(budRes.data || []);

            if (!expRes.success || !budRes.success) {
                setError('Some data failed to load. Please try refreshing.');
            }
        } catch (err) {
            setError('An error occurred while loading data.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        if (!selectedItem) return;
        setActionLoading(true);
        setError('');

        try {
            let result;
            if (activeTab === 'expenses') {
                if (actionType === 'approve') {
                    result = await expenseService.approveExpense(selectedItem.id);
                } else {
                    result = await expenseService.rejectExpense(selectedItem.id, rejectionReason);
                }
            } else {
                if (actionType === 'approve') {
                    result = await eventService.approveBudgetRequest(selectedItem.id);
                } else {
                    result = await eventService.rejectBudgetRequest(selectedItem.id, rejectionReason);
                }
            }

            if (result.success) {
                setSuccess(`${activeTab === 'expenses' ? 'Expense' : 'Budget request'} ${actionType}d successfully!`);
                setShowConfirmDialog(false);
                setSelectedItem(null);
                setRejectionReason('');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.error || `Failed to ${actionType} the ${activeTab === 'expenses' ? 'expense' : 'budget request'}`);
            }
        } catch (err) {
            setError(`An error occurred during the ${actionType} process.`);
            console.error('Action error:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const openActionDialog = (item, type) => {
        setSelectedItem(item);
        setActionType(type);
        setRejectionReason('');
        setShowConfirmDialog(true);
    };

    const getFilteredData = () => {
        const data = activeTab === 'expenses' ? expenses : budgetRequests;
        let filtered = [...data];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.description?.toLowerCase().includes(term) ||
                item.reason?.toLowerCase().includes(term) ||
                item.raisedByName?.toLowerCase().includes(term) ||
                item.requestedByName?.toLowerCase().includes(term) ||
                item.eventName?.toLowerCase().includes(term)
            );
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        return filtered;
    };

    const getStats = () => {
        const pendingExpenses = expenses.filter(e => e.status === 'PENDING').length;
        const pendingBudgets = budgetRequests.filter(b => b.status === 'PENDING').length;
        const totalAmount = expenses.filter(e => e.status === 'APPROVED').reduce((sum, e) => sum + e.amount, 0);

        return {
            pendingExpenses,
            pendingBudgets,
            totalAmount
        };
    };

    const stats = getStats();
    const filteredData = getFilteredData();

    return (
        <div className="management-container">
            <section className="page-hero">
                <div className="page-hero-content">
                    <motion.h1
                        className="page-title"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <i className="fas fa-file-invoice-dollar"></i> Expense & Budget <span className="highlight">Management</span>
                    </motion.h1>
                    <motion.p
                        className="page-subtitle"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Review and manage financial requests from volunteers
                    </motion.p>
                </div>
            </section>

            <div className="container-custom">
                <div className="stats-grid">
                    <StatCard
                        icon="fa-clock"
                        title="Pending Expenses"
                        value={stats.pendingExpenses}
                        variant="warning"
                    />
                    <StatCard
                        icon="fa-money-bill-wave"
                        title="Pending Budgets"
                        value={stats.pendingBudgets}
                        variant="info"
                    />
                    <StatCard
                        icon="fa-check-circle"
                        title="Total Approved"
                        value={`₹${stats.totalAmount.toLocaleString()}`}
                        variant="success"
                    />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div className="alert alert-danger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div className="alert alert-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <i className="fas fa-check-circle"></i> {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="management-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('expenses'); setStatusFilter('ALL'); }}
                    >
                        <i className="fas fa-receipt"></i> Expenses
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'budgets' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('budgets'); setStatusFilter('ALL'); }}
                    >
                        <i className="fas fa-wallet"></i> Budget Requests
                    </button>
                </div>

                <div className="filters-section">
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-buttons">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
                            <button
                                key={status}
                                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <button className="btn-refresh" onClick={fetchData} title="Refresh Data">
                        <i className="fas fa-sync-alt"></i>
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p>Loading {activeTab}...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="empty-state">
                        <i className={`fas ${activeTab === 'expenses' ? 'fa-file-invoice' : 'fa-wallet'}`}></i>
                        <h3>No {activeTab} Found</h3>
                        <p>No items match your current search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="management-grid">
                        {filteredData.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="management-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <div className="card-header">
                                    <div className="card-type">
                                        <i className={`fas ${activeTab === 'expenses' ? 'fa-receipt' : 'fa-wallet'}`}></i>
                                        <span>{activeTab === 'expenses' ? 'Expense' : 'Budget Request'}</span>
                                    </div>
                                    <Badge
                                        text={item.status}
                                        variant={item.status === 'PENDING' ? 'warning' : item.status === 'APPROVED' ? 'success' : 'danger'}
                                    />
                                </div>
                                <div className="card-body">
                                    <h3 className="amount">₹{(item.amount || item.requestedAmount).toLocaleString()}</h3>
                                    <p className="description">{item.description || item.reason}</p>

                                    <div className="item-meta">
                                        <div className="meta-row">
                                            <i className="fas fa-user"></i>
                                            <span>Raised by: <strong>{item.raisedByName || item.requestedByName}</strong></span>
                                        </div>
                                        <div className="meta-row">
                                            <i className="fas fa-calendar-alt"></i>
                                            <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                {item.status === 'PENDING' && (
                                    <div className="card-footer">
                                        <button
                                            className="btn-approve"
                                            onClick={() => openActionDialog(item, 'approve')}
                                        >
                                            <i className="fas fa-check"></i> Approve
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => openActionDialog(item, 'reject')}
                                        >
                                            <i className="fas fa-times"></i> Reject
                                        </button>
                                    </div>
                                )}
                                {(item.status === 'REJECTED' && item.rejectionReason) && (
                                    <div className="rejection-note">
                                        <strong>Reason:</strong> {item.rejectionReason}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                show={showConfirmDialog}
                title={`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} ${activeTab === 'expenses' ? 'Expense' : 'Budget Request'}`}
                message={`Are you sure you want to ${actionType} this ${activeTab === 'expenses' ? 'expense' : 'budget request'} for ₹${(selectedItem?.amount || selectedItem?.requestedAmount)?.toLocaleString()}?`}
                onConfirm={handleAction}
                onCancel={() => setShowConfirmDialog(false)}
                variant={actionType === 'approve' ? 'success' : 'danger'}
                confirmText={actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                loading={actionLoading}
            >
                {actionType === 'reject' && (
                    <div className="form-group mt-3">
                        <label>Reason for rejection *</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a reason..."
                            required
                        />
                    </div>
                )}
            </ConfirmDialog>
        </div>
    );
};

export default ExpenseBudgetManagement;
