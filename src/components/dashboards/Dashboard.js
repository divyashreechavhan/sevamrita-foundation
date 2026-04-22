import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import eventService from '../../services/eventService';
import userService from '../../services/userService';
import donationService from '../../services/donationService';
import expenseService from '../../services/expenseService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import ExpenseBudgetManagement from './admin/ExpenseBudgetManagement';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
    const { user } = useAuth();
    const userRole = authService.getUserRole();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Stats State
    const [stats, setStats] = useState({
        eventsJoined: 0,
        volunteerHours: 0,
        expensesSubmitted: 0,
        expensesPending: 0,
        expensesApproved: 0,
        totalEvents: 0,
        totalVolunteers: 0,
        totalDonations: 0,
        pendingApprovals: 0
    });

    // Data State
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [myBudgetRequests, setMyBudgetRequests] = useState([]);
    const [donations, setDonations] = useState([]);
    const [users, setUsers] = useState([]);

    // Form States
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [expenseForm, setExpenseForm] = useState({ eventId: '', amount: '', description: '' });
    const [showBudgetForm, setShowBudgetForm] = useState(false);
    const [budgetForm, setBudgetForm] = useState({ eventId: '', requestedAmount: '', reason: '' });
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    const fetchDashboardData = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            // Fetch events for everyone
            const eventsRes = await eventService.getAllEvents();
            const allEvents = eventsRes.success ? (eventsRes.data || []) : [];
            setEvents(allEvents);

            if (userRole === 'VOLUNTEER') {
                // Filter joined events or events where user is lead
                const joined = allEvents.filter(evt =>
                    (evt.volunteers && evt.volunteers.some(v => v.volunteerName === user.username)) ||
                    (evt.leadVolunteerName === user.username)
                );
                setMyEvents(joined);

                // Calculate hours
                const hours = joined.reduce((sum, evt) => {
                    const vol = evt.volunteers.find(v => v.volunteerName === user.username);
                    return sum + (vol?.hoursContributed || 0);
                }, 0);

                // Fetch user expenses
                if (user.id) {
                    const [expRes, budRes] = await Promise.all([
                        expenseService.getExpensesByUser(user.id),
                        eventService.getMyBudgetRequests()
                    ]);

                    const userExpenses = expRes.success ? (expRes.data || []) : [];
                    const userBudgets = budRes.success ? (budRes.data || []) : [];

                    setExpenses(userExpenses);
                    setMyBudgetRequests(userBudgets);

                    const pending = userExpenses.filter(e => e.status === 'PENDING').length;
                    const approved = userExpenses.filter(e => e.status === 'APPROVED').length;

                    setStats(prev => ({
                        ...prev,
                        eventsJoined: joined.length,
                        volunteerHours: hours,
                        expensesSubmitted: userExpenses.length,
                        expensesPending: pending,
                        expensesApproved: approved
                    }));
                }
            } else if (userRole === 'ADMIN' || userRole === 'SUPERUSER') {
                // Fetch all data for admin
                const [usersRes, donationsRes] = await Promise.all([
                    userService.getAllUsers(),
                    donationService.getAllDonations()
                ]);

                const allUsers = usersRes.success ? (usersRes.data || []) : [];
                const allDonations = donationsRes.success ? (donationsRes.data || []) : [];

                setUsers(allUsers);
                setDonations(allDonations);

                const volunteerCount = allUsers.filter(u => u.role === 'VOLUNTEER').length;
                const donationTotal = allDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
                const pendingEvents = allEvents.filter(e => e.status === 'PENDING').length;

                setStats(prev => ({
                    ...prev,
                    totalEvents: allEvents.length,
                    totalVolunteers: volunteerCount,
                    totalDonations: donationTotal,
                    pendingApprovals: pendingEvents
                }));
            }
        } catch (err) {
            console.error("Dashboard fetch error", err);
        } finally {
            setLoading(false);
        }
    }, [user, userRole]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);



    // Expense Submission
    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });

        try {
            const result = await expenseService.raiseExpense({
                eventId: parseInt(expenseForm.eventId),
                amount: parseFloat(expenseForm.amount),
                description: expenseForm.description
            });

            if (result.success) {
                setFormMessage({ type: 'success', text: 'Expense submitted successfully!' });
                setExpenseForm({ eventId: '', amount: '', description: '' });
                setShowExpenseForm(false);
                fetchDashboardData();
            } else {
                setFormMessage({ type: 'error', text: result.error || 'Failed to submit expense' });
            }
        } catch (err) {
            setFormMessage({ type: 'error', text: 'Error submitting expense' });
        }
    };

    // Budget Request (for Lead Volunteers)
    const handleBudgetRequest = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });

        try {
            const result = await eventService.requestBudgetIncrease({
                eventId: parseInt(budgetForm.eventId),
                requestedAmount: parseFloat(budgetForm.requestedAmount),
                reason: budgetForm.reason
            });

            if (result.success) {
                setFormMessage({ type: 'success', text: 'Budget request submitted!' });
                setBudgetForm({ eventId: '', requestedAmount: '', reason: '' });
                setShowBudgetForm(false);
            } else {
                setFormMessage({ type: 'error', text: result.error || 'Failed to submit request' });
            }
        } catch (err) {
            setFormMessage({ type: 'error', text: 'Error submitting budget request' });
        }
    };

    // Admin: Approve/Reject Expense
    // eslint-disable-next-line no-unused-vars
    const handleExpenseAction = async (expenseId, action) => {
        try {
            let result;
            if (action === 'approve') {
                result = await expenseService.approveExpense(expenseId);
            } else {
                result = await expenseService.rejectExpense(expenseId, 'Rejected by admin');
            }

            if (result.success) {
                fetchDashboardData();
            }
        } catch (err) {
            console.error('Expense action error', err);
        }
    };

    // Chart Data Preparation
    const getMonthlyDonationData = () => {
        const monthlyData = {};
        donations.forEach(d => {
            const date = new Date(d.createdAt || d.donationDate);
            const month = date.toLocaleString('default', { month: 'short' });
            monthlyData[month] = (monthlyData[month] || 0) + (d.amount || 0);
        });
        return Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }));
    };

    const getEventStatusData = () => {
        const statusCount = { APPROVED: 0, PENDING: 0, REJECTED: 0 };
        events.forEach(e => {
            if (statusCount.hasOwnProperty(e.status)) {
                statusCount[e.status]++;
            }
        });
        return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
    };

    const getVolunteerHoursData = () => {
        return myEvents.map(evt => {
            const vol = evt.volunteers.find(v => v.volunteerName === user.username);
            return {
                event: evt.name?.substring(0, 15) || 'Event',
                hours: vol?.hoursContributed || 0
            };
        });
    };

    // Render Tabs
    const renderTabs = () => {
        const volunteerTabs = [
            { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
            { id: 'events', label: 'My Events', icon: 'fa-calendar-check' },
            { id: 'expenses', label: 'Expenses', icon: 'fa-receipt' },
            { id: 'hours', label: 'Hours Tracking', icon: 'fa-clock' }
        ];

        const adminTabs = [
            { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
            { id: 'events', label: 'All Events', icon: 'fa-calendar' },
            { id: 'volunteers', label: 'Volunteers', icon: 'fa-users' },
            { id: 'donations', label: 'Donations', icon: 'fa-hand-holding-usd' },
            { id: 'finance', label: 'Expenses & Budget', icon: 'fa-file-invoice-dollar' },
            { id: 'reports', label: 'Reports', icon: 'fa-chart-bar' }
        ];

        const tabs = (userRole === 'ADMIN' || userRole === 'SUPERUSER') ? adminTabs : volunteerTabs;

        return (
            <div className="dashboard-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <i className={`fas ${tab.icon}`}></i>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        );
    };

    // Render Overview Section
    const renderOverview = () => {
        if (userRole === 'VOLUNTEER') {
            return (
                <div className="overview-section">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="dashboard-card gradient-primary">
                                <div className="card-icon"><i className="fas fa-calendar-check"></i></div>
                                <h3>Events Joined</h3>
                                <p className="card-value">{stats.eventsJoined}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="dashboard-card gradient-success">
                                <div className="card-icon"><i className="fas fa-clock"></i></div>
                                <h3>Volunteer Hours</h3>
                                <p className="card-value">{stats.volunteerHours}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="dashboard-card gradient-warning">
                                <div className="card-icon"><i className="fas fa-receipt"></i></div>
                                <h3>Expenses</h3>
                                <p className="card-value">{stats.expensesSubmitted}</p>
                                <p className="card-sublabel">{stats.expensesPending} pending</p>
                            </div>
                        </div>
                    </div>

                    {/* Hours Chart */}
                    {myEvents.length > 0 && (
                        <div className="chart-container mt-4">
                            <h4><i className="fas fa-chart-bar"></i> Hours by Event</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={getVolunteerHoursData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="event" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="hours" fill="#0088FE" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            );
        } else {
            // Admin Overview
            return (
                <div className="overview-section">
                    <div className="row g-4">
                        <div className="col-md-3">
                            <div className="dashboard-card gradient-primary">
                                <div className="card-icon"><i className="fas fa-calendar"></i></div>
                                <h3>Total Events</h3>
                                <p className="card-value">{stats.totalEvents}</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="dashboard-card gradient-success">
                                <div className="card-icon"><i className="fas fa-users"></i></div>
                                <h3>Volunteers</h3>
                                <p className="card-value">{stats.totalVolunteers}</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="dashboard-card gradient-warning">
                                <div className="card-icon"><i className="fas fa-rupee-sign"></i></div>
                                <h3>Donations</h3>
                                <p className="card-value">₹{stats.totalDonations.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="dashboard-card gradient-danger">
                                <div className="card-icon"><i className="fas fa-hourglass-half"></i></div>
                                <h3>Pending</h3>
                                <p className="card-value">{stats.pendingApprovals}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mt-4">
                        {/* Donation Trend Chart */}
                        <div className="col-md-8">
                            <div className="chart-container">
                                <h4><i className="fas fa-chart-line"></i> Donation Trend</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={getMonthlyDonationData()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                        <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Event Status Pie Chart */}
                        <div className="col-md-4">
                            <div className="chart-container">
                                <h4><i className="fas fa-chart-pie"></i> Event Status</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={getEventStatusData()}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {getEventStatusData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    // Render Events Section
    const renderEvents = () => {
        const displayEvents = (userRole === 'VOLUNTEER') ? myEvents : events;

        return (
            <div className="events-section">
                <div className="section-header">
                    <h3><i className="fas fa-calendar"></i> {userRole === 'VOLUNTEER' ? 'My Events' : 'All Events'}</h3>
                </div>

                {displayEvents.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-calendar-times"></i>
                        <p>No events found</p>
                        {userRole === 'VOLUNTEER' && <p className="text-muted">Join events from the Events Calendar to see them here.</p>}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Volunteers</th>
                                    {userRole === 'VOLUNTEER' && <th>My Hours</th>}
                                    {(userRole === 'ADMIN' || userRole === 'SUPERUSER') && <th>Budget</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {displayEvents.map(event => {
                                    const myVol = event.volunteers?.find(v => v.volunteerName === user.username);
                                    return (
                                        <tr key={event.id}>
                                            <td><strong>{event.name}</strong></td>
                                            <td>{event.location || 'N/A'}</td>
                                            <td>
                                                <span className={`status-badge status-${event.status?.toLowerCase()}`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td>{event.volunteers?.length || 0}</td>
                                            {userRole === 'VOLUNTEER' && <td>{myVol?.hoursContributed || 0} hrs</td>}
                                            {(userRole === 'ADMIN' || userRole === 'SUPERUSER') && <td>₹{event.budget?.toLocaleString() || 0}</td>}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    // Render Expenses Section (Volunteer)
    const renderExpenses = () => {
        return (
            <div className="expenses-section">
                <div className="section-header">
                    <h3><i className="fas fa-receipt"></i> Expense Management</h3>
                    <button className="btn-action" onClick={() => setShowExpenseForm(!showExpenseForm)}>
                        <i className="fas fa-plus"></i> Submit Expense
                    </button>
                </div>

                {/* Expense Form */}
                {showExpenseForm && (
                    <div className="form-card">
                        <h4>Submit New Expense</h4>
                        <form onSubmit={handleExpenseSubmit}>
                            <div className="form-group">
                                <label>Select Event</label>
                                <select
                                    value={expenseForm.eventId}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, eventId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Event --</option>
                                    {myEvents.map(e => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Amount (₹)</label>
                                <input
                                    type="number"
                                    value={expenseForm.amount}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={expenseForm.description}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                    placeholder="Describe the expense..."
                                    required
                                />
                            </div>
                            {formMessage.text && (
                                <div className={`alert alert-${formMessage.type === 'success' ? 'success' : 'danger'}`}>
                                    {formMessage.text}
                                </div>
                            )}
                            <button type="submit" className="btn-submit">Submit Expense</button>
                        </form>
                    </div>
                )}

                {/* Budget Request Button */}
                <div className="mt-3 mb-3">
                    <button className="btn-secondary" onClick={() => setShowBudgetForm(!showBudgetForm)}>
                        <i className="fas fa-money-bill-wave"></i> Request Budget Increase
                    </button>
                </div>

                {showBudgetForm && (
                    <div className="form-card">
                        <h4>Request Budget Increase (Lead Volunteers Only)</h4>
                        <form onSubmit={handleBudgetRequest}>
                            <div className="form-group">
                                <label>Select Event</label>
                                <select
                                    value={budgetForm.eventId}
                                    onChange={(e) => setBudgetForm({ ...budgetForm, eventId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Event --</option>
                                    {myEvents.map(e => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Requested Amount (₹)</label>
                                <input
                                    type="number"
                                    value={budgetForm.requestedAmount}
                                    onChange={(e) => setBudgetForm({ ...budgetForm, requestedAmount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Reason</label>
                                <textarea
                                    value={budgetForm.reason}
                                    onChange={(e) => setBudgetForm({ ...budgetForm, reason: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-submit">Submit Request</button>
                        </form>
                    </div>
                )}

                {/* Expense History */}
                <h4 className="mt-4">Expense History</h4>
                {expenses.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-file-invoice-dollar"></i>
                        <p>No expenses submitted yet</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Event</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map(exp => (
                                    <tr key={exp.id}>
                                        <td>{new Date(exp.createdAt).toLocaleDateString()}</td>
                                        <td>{exp.eventName || 'N/A'}</td>
                                        <td>₹{exp.amount?.toLocaleString()}</td>
                                        <td>{exp.description?.substring(0, 50)}...</td>
                                        <td>
                                            <span className={`status-badge status-${exp.status?.toLowerCase()}`}>
                                                {exp.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Budget Request History */}
                <h4 className="mt-5">Budget Request History</h4>
                {myBudgetRequests.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-wallet"></i>
                        <p>No budget requests submitted yet</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Event</th>
                                    <th>Requested</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myBudgetRequests.map(bud => (
                                    <tr key={bud.id}>
                                        <td>{new Date(bud.createdAt).toLocaleDateString()}</td>
                                        <td>{bud.eventName || 'N/A'}</td>
                                        <td>₹{bud.requestedAmount?.toLocaleString()}</td>
                                        <td>{bud.reason?.substring(0, 50)}...</td>
                                        <td>
                                            <span className={`status-badge status-${bud.status?.toLowerCase()}`}>
                                                {bud.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    // Render Hours Tracking (Volunteer)
    const renderHoursTracking = () => {
        const totalHours = stats.volunteerHours;
        const certificateEligible = totalHours >= 50;

        return (
            <div className="hours-section">
                <div className="section-header">
                    <h3><i className="fas fa-clock"></i> Volunteer Hours Tracking</h3>
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="hours-summary-card">
                            <div className="hours-circle">
                                <span className="hours-number">{totalHours}</span>
                                <span className="hours-label">Total Hours</span>
                            </div>
                            <p className={`certificate-status ${certificateEligible ? 'eligible' : ''}`}>
                                {certificateEligible
                                    ? '🎉 Eligible for Certificate!'
                                    : `${50 - totalHours} more hours needed for certificate`
                                }
                            </p>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="chart-container">
                            <h4>Hours by Event</h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={getVolunteerHoursData()} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="event" type="category" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="hours" fill="#00C49F" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Hours Log Table */}
                <h4 className="mt-4">Hours Log</h4>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Date</th>
                                <th>Hours</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myEvents.map(evt => {
                                const vol = evt.volunteers.find(v => v.volunteerName === user.username);
                                return (
                                    <tr key={evt.id}>
                                        <td>{evt.name}</td>
                                        <td>{evt.eventDate ? new Date(evt.eventDate).toLocaleDateString() : 'N/A'}</td>
                                        <td>{vol?.hoursContributed || 0} hrs</td>
                                        <td>
                                            <span className={`status-badge status-${vol?.status?.toLowerCase() || 'approved'}`}>
                                                {vol?.status || 'Confirmed'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Volunteers Section (Admin)
    const renderVolunteers = () => {
        const volunteers = users.filter(u => u.role === 'VOLUNTEER');

        return (
            <div className="volunteers-section">
                <div className="section-header">
                    <h3><i className="fas fa-users"></i> Volunteer Management</h3>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers.map(vol => (
                                <tr key={vol.id}>
                                    <td>{vol.id}</td>
                                    <td><strong>{vol.username}</strong></td>
                                    <td>{vol.role}</td>
                                    <td>
                                        <span className="status-badge status-approved">Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Donations Section (Admin)
    const renderDonations = () => {
        return (
            <div className="donations-section">
                <div className="section-header">
                    <h3><i className="fas fa-hand-holding-usd"></i> Donation History</h3>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="dashboard-card gradient-success">
                            <h4>Total Received</h4>
                            <p className="card-value">₹{stats.totalDonations.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="dashboard-card gradient-primary">
                            <h4>Total Donors</h4>
                            <p className="card-value">{donations.length}</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="dashboard-card gradient-warning">
                            <h4>Average Donation</h4>
                            <p className="card-value">
                                ₹{donations.length ? Math.round(stats.totalDonations / donations.length).toLocaleString() : 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Donation Chart */}
                <div className="chart-container mb-4">
                    <h4><i className="fas fa-chart-area"></i> Monthly Donation Trend</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={getMonthlyDonationData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#00C49F" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Donation Table */}
                <h4>Recent Donations</h4>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Donor Name</th>
                                <th>Email</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.slice(0, 10).map(don => (
                                <tr key={don.id}>
                                    <td>{new Date(don.createdAt || don.donationDate).toLocaleDateString()}</td>
                                    <td><strong>{don.donorName}</strong></td>
                                    <td>{don.email || 'N/A'}</td>
                                    <td className="amount-cell">₹{don.amount?.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Reports Section (Admin)
    const renderReports = () => {
        return (
            <div className="reports-section">
                <div className="section-header">
                    <h3><i className="fas fa-chart-bar"></i> Reports & Analytics</h3>
                </div>

                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="chart-container">
                            <h4>Event Status Distribution</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={getEventStatusData()}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {getEventStatusData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="chart-container">
                            <h4>Donation Trend</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={getMonthlyDonationData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                    <Area type="monotone" dataKey="amount" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="summary-grid mt-4">
                    <div className="summary-item">
                        <i className="fas fa-calendar-check"></i>
                        <div>
                            <p className="summary-value">{events.filter(e => e.status === 'APPROVED').length}</p>
                            <p className="summary-label">Approved Events</p>
                        </div>
                    </div>
                    <div className="summary-item">
                        <i className="fas fa-users"></i>
                        <div>
                            <p className="summary-value">{stats.totalVolunteers}</p>
                            <p className="summary-label">Active Volunteers</p>
                        </div>
                    </div>
                    <div className="summary-item">
                        <i className="fas fa-rupee-sign"></i>
                        <div>
                            <p className="summary-value">₹{stats.totalDonations.toLocaleString()}</p>
                            <p className="summary-label">Total Donations</p>
                        </div>
                    </div>
                    <div className="summary-item">
                        <i className="fas fa-clock"></i>
                        <div>
                            <p className="summary-value">
                                {events.reduce((sum, e) => sum + (e.volunteers?.reduce((h, v) => h + (v.hoursContributed || 0), 0) || 0), 0)}
                            </p>
                            <p className="summary-label">Total Volunteer Hours</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render Active Tab Content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'events': return renderEvents();
            case 'expenses': return renderExpenses();
            case 'hours': return renderHoursTracking();
            case 'volunteers': return renderVolunteers();
            case 'donations': return renderDonations();
            case 'finance': return <ExpenseBudgetManagement />;
            case 'reports': return renderReports();
            default: return renderOverview();
        }
    };

    return (
        <div className="dashboard-page">
            <div className="container" style={{ marginTop: '100px', minHeight: '70vh' }}>
                <div className="dashboard-header">
                    <h1>
                        <i className="fas fa-tachometer-alt"></i> Dashboard
                    </h1>
                    <p className="text-muted">
                        Welcome back, <strong>{user?.username}</strong>!
                        <span className="role-badge">{userRole}</span>
                    </p>
                </div>

                {renderTabs()}

                <div className="dashboard-content">
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Loading dashboard...</p>
                        </div>
                    ) : (
                        renderTabContent()
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
