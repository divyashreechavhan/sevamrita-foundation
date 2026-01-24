import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import donationService from '../../../services/donationService';
import StatCard from './components/StatCard';
import { exportTableToCSV, formatCurrencyForExport, formatDateForExport } from '../../../utils/ExportUtils';
import '../../CSS/DonationManagement.css';

const DonationManagement = () => {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchDonations();
    }, []);

    useEffect(() => {
        filterDonations();
    }, [donations, searchTerm, dateFrom, dateTo, minAmount, maxAmount]);

    const fetchDonations = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await donationService.getAllDonations();

            if (result.success) {
                setDonations(result.data || []);
            } else {
                setError(result.error || 'Failed to load donations');
            }
        } catch (err) {
            setError('An error occurred while loading donations');
            console.error('Error fetching donations:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterDonations = () => {
        let filtered = [...donations];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(donation =>
                donation.donorName?.toLowerCase().includes(term) ||
                donation.email?.toLowerCase().includes(term) ||
                donation.phone?.toLowerCase().includes(term)
            );
        }

        // Date range filter
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            filtered = filtered.filter(donation => {
                const donationDate = new Date(donation.createdAt || donation.donationDate);
                return donationDate >= fromDate;
            });
        }

        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999); // End of day
            filtered = filtered.filter(donation => {
                const donationDate = new Date(donation.createdAt || donation.donationDate);
                return donationDate <= toDate;
            });
        }

        // Amount range filter
        if (minAmount) {
            filtered = filtered.filter(donation => donation.amount >= parseFloat(minAmount));
        }

        if (maxAmount) {
            filtered = filtered.filter(donation => donation.amount <= parseFloat(maxAmount));
        }

        setFilteredDonations(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDateFrom('');
        setDateTo('');
        setMinAmount('');
        setMaxAmount('');
    };

    const handleExport = () => {
        const columns = [
            { key: 'donorName', label: 'Donor Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            {
                key: 'amount',
                label: 'Amount',
                format: (value) => formatCurrencyForExport(value)
            },
            { key: 'paymentMethod', label: 'Payment Method' },
            {
                key: 'createdAt',
                label: 'Date',
                format: (value) => formatDateForExport(value)
            }
        ];

        const filename = `donations_${new Date().toISOString().split('T')[0]}`;
        exportTableToCSV(filteredDonations, columns, filename);
    };

    const getStats = () => {
        const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
        const count = donations.length;
        const average = count > 0 ? total / count : 0;

        // This month's donations
        const now = new Date();
        const thisMonth = donations.filter(d => {
            const donationDate = new Date(d.createdAt || d.donationDate);
            return donationDate.getMonth() === now.getMonth() &&
                donationDate.getFullYear() === now.getFullYear();
        });
        const thisMonthTotal = thisMonth.reduce((sum, d) => sum + (d.amount || 0), 0);

        // Top donor
        const donorTotals = {};
        donations.forEach(d => {
            const name = d.donorName || 'Anonymous';
            donorTotals[name] = (donorTotals[name] || 0) + (d.amount || 0);
        });
        const topDonor = Object.entries(donorTotals).sort((a, b) => b[1] - a[1])[0];

        return {
            total,
            count,
            average,
            thisMonthTotal,
            topDonor: topDonor ? { name: topDonor[0], amount: topDonor[1] } : null
        };
    };

    const stats = getStats();

    // Pagination
    const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDonations = filteredDonations.slice(startIndex, endIndex);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="donation-management-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-content">
                    <motion.h1
                        className="page-title"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <i className="fas fa-hand-holding-usd"></i> Donation <span className="highlight">Management</span>
                    </motion.h1>
                    <motion.p
                        className="page-subtitle"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Track and manage all donations
                    </motion.p>
                </div>
            </section>

            <div className="container-custom">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <StatCard
                        icon="fa-rupee-sign"
                        title="Total Donations"
                        value={formatCurrency(stats.total)}
                        variant="success"
                    />
                    <StatCard
                        icon="fa-calendar-alt"
                        title="This Month"
                        value={formatCurrency(stats.thisMonthTotal)}
                        variant="primary"
                    />
                    <StatCard
                        icon="fa-chart-line"
                        title="Average Donation"
                        value={formatCurrency(stats.average)}
                        variant="info"
                    />
                    <StatCard
                        icon="fa-trophy"
                        title="Top Donor"
                        value={stats.topDonor ? stats.topDonor.name : 'N/A'}
                        variant="warning"
                    />
                </div>

                {/* Alerts */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="alert alert-danger"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <i className="fas fa-exclamation-circle"></i> {error}
                            <button className="alert-close" onClick={() => setError('')}>×</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters Section */}
                <motion.div
                    className="filters-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="filter-row">
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search by donor name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-row">
                        <div className="filter-group">
                            <label>From Date</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>To Date</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>Min Amount</label>
                            <input
                                type="number"
                                placeholder="₹0"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                                min="0"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Max Amount</label>
                            <input
                                type="number"
                                placeholder="₹100000"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button className="btn-clear" onClick={clearFilters}>
                            <i className="fas fa-times"></i> Clear Filters
                        </button>
                        <button className="btn-refresh" onClick={fetchDonations}>
                            <i className="fas fa-sync-alt"></i> Refresh
                        </button>
                        <button className="btn-export" onClick={handleExport} disabled={filteredDonations.length === 0}>
                            <i className="fas fa-download"></i> Export to CSV
                        </button>
                    </div>
                </motion.div>

                {/* Donations Table */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading donations...</span>
                        </div>
                        <p>Loading donations...</p>
                    </div>
                ) : filteredDonations.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-inbox"></i>
                        <h3>No Donations Found</h3>
                        <p>No donations match your current filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="table-container">
                            <table className="donations-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Donor Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Amount</th>
                                        <th>Payment Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedDonations.map((donation, index) => (
                                        <motion.tr
                                            key={donation.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2, delay: index * 0.02 }}
                                        >
                                            <td>{formatDate(donation.createdAt || donation.donationDate)}</td>
                                            <td className="donor-name">
                                                <strong>{donation.donorName || 'Anonymous'}</strong>
                                            </td>
                                            <td>{donation.email || 'N/A'}</td>
                                            <td>{donation.phone || 'N/A'}</td>
                                            <td className="amount-cell">
                                                <strong>{formatCurrency(donation.amount)}</strong>
                                            </td>
                                            <td>
                                                <span className="payment-badge">
                                                    {donation.paymentMethod || 'N/A'}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>

                                <span className="pagination-info">
                                    Page {currentPage} of {totalPages} ({filteredDonations.length} donations)
                                </span>

                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DonationManagement;
