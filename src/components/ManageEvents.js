import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import eventService from '../services/eventService';
import userService from '../services/userService';
import organizationService from '../services/organizationService';
import './CSS/ManageEvents.css';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    // Form state
    const [eventForm, setEventForm] = useState({
        name: '',
        location: '',
        description: '',
        budget: '',
        leadVolunteerId: '',
        eventDate: '',
        organizationId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const filterEvents = useCallback(() => {
        let filtered = [...events];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(event =>
                event.name?.toLowerCase().includes(term) ||
                event.location?.toLowerCase().includes(term) ||
                event.description?.toLowerCase().includes(term)
            );
        }

        // Status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(event => event.status === statusFilter);
        }

        setFilteredEvents(filtered);
    }, [events, searchTerm, statusFilter]);

    useEffect(() => {
        filterEvents();
    }, [filterEvents]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown && !event.target.closest('.event-actions-dropdown')) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    const fetchData = async () => {
        setLoading(true);
        setError('');

        try {
            const [eventsRes, usersRes, orgsRes] = await Promise.all([
                eventService.getAllEvents(),
                userService.getUsersByRole('VOLUNTEER'),
                organizationService.getAllOrganizations()
            ]);

            if (eventsRes.success) {
                setEvents(eventsRes.data || []);
            } else {
                setError(eventsRes.error || 'Failed to load events');
            }

            if (usersRes.success) {
                setVolunteers(usersRes.data || []);
            }

            if (orgsRes.success) {
                setOrganizations(orgsRes.data || []);
            }
        } catch (err) {
            setError('An error occurred while loading data');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };



    const resetForm = () => {
        setEventForm({
            name: '',
            location: '',
            description: '',
            budget: '',
            leadVolunteerId: '',
            eventDate: '',
            organizationId: ''
        });
    };

    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
        setError('');
        setSuccess('');
    };

    const openEditModal = (event) => {
        setSelectedEvent(event);
        setEventForm({
            name: event.name || '',
            location: event.location || '',
            description: event.description || '',
            budget: event.budget || '',
            leadVolunteerId: event.leadVolunteerId || '',
            eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
            organizationId: event.organizationId || ''
        });
        setShowEditModal(true);
        setError('');
    };

    const openDetailsModal = (event) => {
        setSelectedEvent(event);
        setShowDetailsModal(true);
    };

    const closeAllModals = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDetailsModal(false);
        setSelectedEvent(null);
        resetForm();
    };

    const toggleDropdown = (eventId, e) => {
        e.stopPropagation();
        setOpenDropdown(openDropdown === eventId ? null : eventId);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError('');

        try {
            const eventData = {
                name: eventForm.name,
                location: eventForm.location,
                description: eventForm.description,
                budget: parseFloat(eventForm.budget) || 0,
                leadVolunteerId: eventForm.leadVolunteerId ? parseInt(eventForm.leadVolunteerId) : null,
                eventDate: eventForm.eventDate || null
            };

            const result = await eventService.createEvent(eventData);

            if (result.success) {
                setSuccess('Event created successfully!');
                closeAllModals();
                fetchData();
            } else {
                setError(result.error || 'Failed to create event');
            }
        } catch (err) {
            setError('An error occurred while creating the event');
            console.error('Error creating event:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        if (!selectedEvent) return;

        setActionLoading(true);
        setError('');

        try {
            const eventData = {
                name: eventForm.name,
                location: eventForm.location,
                description: eventForm.description,
                budget: parseFloat(eventForm.budget) || 0,
                leadVolunteerId: eventForm.leadVolunteerId ? parseInt(eventForm.leadVolunteerId) : null,
                eventDate: eventForm.eventDate || null
            };

            const result = await eventService.updateEvent(selectedEvent.id, eventData);

            if (result.success) {
                setSuccess('Event updated successfully!');
                closeAllModals();
                fetchData();
            } else {
                setError(result.error || 'Failed to update event');
            }
        } catch (err) {
            setError('An error occurred while updating the event');
            console.error('Error updating event:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveEvent = async (eventId) => {
        setActionLoading(true);
        setError('');

        try {
            const result = await eventService.approveEvent(eventId);

            if (result.success) {
                setSuccess('Event approved successfully!');
                fetchData();
            } else {
                setError(result.error || 'Failed to approve event');
            }
        } catch (err) {
            setError('An error occurred while approving the event');
            console.error('Error approving event:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        setActionLoading(true);
        setError('');

        try {
            const result = await eventService.deleteEvent(eventId);

            if (result.success) {
                setSuccess('Event deleted successfully!');
                fetchData();
            } else {
                setError(result.error || 'Failed to delete event');
            }
        } catch (err) {
            setError('An error occurred while deleting the event');
            console.error('Error deleting event:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'APPROVED': return 'status-approved';
            case 'UNAPPROVED': return 'status-pending';
            case 'REJECTED': return 'status-rejected';
            case 'COMPLETED': return 'status-completed';
            default: return '';
        }
    };

    const getStats = () => {
        const total = events.length;
        const approved = events.filter(e => e.status === 'APPROVED').length;
        const pending = events.filter(e => e.status === 'UNAPPROVED').length;
        const totalBudget = events.reduce((sum, e) => sum + (e.budget || 0), 0);
        return { total, approved, pending, totalBudget };
    };

    const stats = getStats();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <div className="manage-events-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-content">
                    <motion.h1
                        className="page-title"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <i className="fas fa-calendar-alt"></i> Event <span className="highlight">Management</span>
                    </motion.h1>
                    <motion.p
                        className="page-subtitle"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Create, manage, and approve events
                    </motion.p>
                </div>
            </section>

            <div className="container-custom">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="stat-icon bg-primary">
                            <i className="fas fa-calendar"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.total}</h3>
                            <p>Total Events</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="stat-icon bg-success">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.approved}</h3>
                            <p>Approved</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="stat-icon bg-warning">
                            <i className="fas fa-hourglass-half"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.pending}</h3>
                            <p>Pending</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="stat-icon bg-info">
                            <i className="fas fa-rupee-sign"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{formatCurrency(stats.totalBudget)}</h3>
                            <p>Total Budget</p>
                        </div>
                    </motion.div>
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

                    {success && (
                        <motion.div
                            className="alert alert-success"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <i className="fas fa-check-circle"></i> {success}
                            <button className="alert-close" onClick={() => setSuccess('')}>×</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters & Actions */}
                <motion.div
                    className="filters-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-buttons">
                        {['ALL', 'APPROVED', 'UNAPPROVED'].map(status => (
                            <button
                                key={status}
                                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status === 'ALL' ? 'All' : status === 'UNAPPROVED' ? 'Pending' : status}
                            </button>
                        ))}
                    </div>

                    <div className="action-buttons">
                        <button className="btn-refresh" onClick={fetchData} title="Refresh Data">
                            <i className="fas fa-sync-alt"></i>
                        </button>
                        <button className="btn-create-header" onClick={openCreateModal}>
                            <i className="fas fa-plus"></i> Create Event
                        </button>
                    </div>
                </motion.div>

                {/* Events Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading events...</span>
                        </div>
                        <p>Loading events...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-calendar-times"></i>
                        <h3>No Events Found</h3>
                        <p>No events match your current filters.</p>
                        <button className="btn-create" onClick={openCreateModal}>
                            <i className="fas fa-plus"></i> Create First Event
                        </button>
                    </div>
                ) : (
                    <div className="events-grid">
                        {filteredEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                className="event-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <div className="event-card-header">
                                    <span className={`status-badge ${getStatusBadgeClass(event.status)}`}>
                                        {event.status}
                                    </span>
                                    <div className={`event-actions-dropdown ${openDropdown === event.id ? 'active' : ''}`}>
                                        <button
                                            type="button"
                                            className="dropdown-trigger"
                                            data-testid="dropdown-trigger"
                                            onClick={(e) => toggleDropdown(event.id, e)}
                                            aria-expanded={openDropdown === event.id}
                                        >
                                            <i className="fas fa-ellipsis-v"></i>
                                        </button>
                                        <div className="dropdown-menu">
                                            <button onClick={() => openDetailsModal(event)}>
                                                <i className="fas fa-eye"></i> View Details
                                            </button>
                                            <button onClick={() => openEditModal(event)}>
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                            {event.status === 'UNAPPROVED' && (
                                                <button onClick={() => handleApproveEvent(event.id)} className="approve-btn">
                                                    <i className="fas fa-check"></i> Approve
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteEvent(event.id)} className="delete-btn">
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="event-card-body" onClick={() => openDetailsModal(event)}>
                                    <h3 className="event-title">{event.name}</h3>
                                    <p className="event-description">
                                        {event.description?.substring(0, 100)}
                                        {event.description?.length > 100 ? '...' : ''}
                                    </p>

                                    <div className="event-meta">
                                        <div className="meta-item">
                                            <i className="fas fa-map-marker-alt"></i>
                                            <span>{event.location || 'No location'}</span>
                                        </div>
                                        <div className="meta-item">
                                            <i className="fas fa-calendar"></i>
                                            <span>{formatDate(event.eventDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="event-card-footer">
                                    <div className="footer-stat">
                                        <i className="fas fa-users"></i>
                                        <span>{event.volunteers?.length || 0} volunteers</span>
                                    </div>
                                    <div className="footer-stat budget">
                                        <i className="fas fa-rupee-sign"></i>
                                        <span>{formatCurrency(event.budget)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="modal-overlay" onClick={closeAllModals}>
                        <motion.div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="modal-header">
                                <h3><i className="fas fa-calendar-plus"></i> Create New Event</h3>
                                <button className="modal-close" onClick={closeAllModals}>×</button>
                            </div>

                            <form onSubmit={handleCreateEvent}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Event Name *</label>
                                        <input
                                            type="text"
                                            value={eventForm.name}
                                            onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                                            placeholder="Enter event name"
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Location</label>
                                            <input
                                                type="text"
                                                value={eventForm.location}
                                                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                                placeholder="Event location"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Event Date</label>
                                            <input
                                                type="date"
                                                value={eventForm.eventDate}
                                                onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            value={eventForm.description}
                                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                            placeholder="Describe the event..."
                                            rows="4"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Budget (₹)</label>
                                            <input
                                                type="number"
                                                value={eventForm.budget}
                                                onChange={(e) => setEventForm({ ...eventForm, budget: e.target.value })}
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Lead Volunteer</label>
                                            <select
                                                value={eventForm.leadVolunteerId}
                                                onChange={(e) => setEventForm({ ...eventForm, leadVolunteerId: e.target.value })}
                                            >
                                                <option value="">-- Select Lead --</option>
                                                {volunteers.map(vol => (
                                                    <option key={vol.id} value={vol.id}>{vol.username}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Organization</label>
                                        <select
                                            value={eventForm.organizationId}
                                            onChange={(e) => setEventForm({ ...eventForm, organizationId: e.target.value })}
                                        >
                                            <option value="">-- Select Organization (Optional) --</option>
                                            {organizations.map(org => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {error && (
                                        <div className="modal-alert alert-danger">
                                            <i className="fas fa-exclamation-circle"></i> {error}
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-cancel" onClick={closeAllModals}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-confirm" disabled={actionLoading}>
                                        {actionLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-plus"></i> Create Event
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Event Modal */}
            <AnimatePresence>
                {showEditModal && selectedEvent && (
                    <div className="modal-overlay" onClick={closeAllModals}>
                        <motion.div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="modal-header">
                                <h3><i className="fas fa-edit"></i> Edit Event</h3>
                                <button className="modal-close" onClick={closeAllModals}>×</button>
                            </div>

                            <form onSubmit={handleUpdateEvent}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Event Name *</label>
                                        <input
                                            type="text"
                                            value={eventForm.name}
                                            onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Location</label>
                                            <input
                                                type="text"
                                                value={eventForm.location}
                                                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Event Date</label>
                                            <input
                                                type="date"
                                                value={eventForm.eventDate}
                                                onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                                            />
                                        </div>
                                    </div>


                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            value={eventForm.description}
                                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                            rows="4"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Budget (\u20b9)</label>
                                            <input
                                                type="number"
                                                value={eventForm.budget}
                                                onChange={(e) => setEventForm({ ...eventForm, budget: e.target.value })}
                                                min="0"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Lead Volunteer</label>
                                            <select
                                                value={eventForm.leadVolunteerId}
                                                onChange={(e) => setEventForm({ ...eventForm, leadVolunteerId: e.target.value })}
                                            >
                                                <option value="">-- Select Lead --</option>
                                                {volunteers.map(vol => (
                                                    <option key={vol.id} value={vol.id}>{vol.username}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Organization</label>
                                        <select
                                            value={eventForm.organizationId}
                                            onChange={(e) => setEventForm({ ...eventForm, organizationId: e.target.value })}
                                        >
                                            <option value="">-- Select Organization (Optional) --</option>
                                            {organizations.map(org => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {error && (
                                        <div className="modal-alert alert-danger">
                                            <i className="fas fa-exclamation-circle"></i> {error}
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-cancel" onClick={closeAllModals}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-confirm" disabled={actionLoading}>
                                        {actionLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save"></i> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Event Details Modal */}
            <AnimatePresence>
                {showDetailsModal && selectedEvent && (
                    <div className="modal-overlay" onClick={closeAllModals}>
                        <motion.div
                            className="modal-content modal-large"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="modal-header">
                                <h3><i className="fas fa-info-circle"></i> Event Details</h3>
                                <button className="modal-close" onClick={closeAllModals}>×</button>
                            </div>

                            <div className="modal-body">
                                <div className="event-details-header">
                                    <h2>{selectedEvent.name}</h2>
                                    <span className={`status-badge large ${getStatusBadgeClass(selectedEvent.status)}`}>
                                        {selectedEvent.status}
                                    </span>
                                </div>

                                <div className="details-grid">
                                    <div className="detail-item">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <div>
                                            <label>Location</label>
                                            <p>{selectedEvent.location || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-calendar"></i>
                                        <div>
                                            <label>Event Date</label>
                                            <p>{formatDate(selectedEvent.eventDate)}</p>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-rupee-sign"></i>
                                        <div>
                                            <label>Budget</label>
                                            <p>{formatCurrency(selectedEvent.budget)}</p>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-user-tie"></i>
                                        <div>
                                            <label>Lead Volunteer</label>
                                            <p>{selectedEvent.leadVolunteerName || 'Not assigned'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4>Description</h4>
                                    <p>{selectedEvent.description || 'No description provided.'}</p>
                                </div>

                                {selectedEvent.volunteers && selectedEvent.volunteers.length > 0 && (
                                    <div className="detail-section">
                                        <h4>Volunteers ({selectedEvent.volunteers.length})</h4>
                                        <div className="volunteers-list">
                                            {selectedEvent.volunteers.map((vol, idx) => (
                                                <div key={idx} className="volunteer-chip">
                                                    <span className="volunteer-avatar">
                                                        {vol.volunteerName?.charAt(0).toUpperCase()}
                                                    </span>
                                                    <span>{vol.volunteerName}</span>
                                                    {vol.hoursContributed > 0 && (
                                                        <span className="hours-badge">{vol.hoursContributed}h</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={closeAllModals}>
                                    Close
                                </button>
                                <button className="btn-secondary" onClick={() => {
                                    closeAllModals();
                                    openEditModal(selectedEvent);
                                }}>
                                    <i className="fas fa-edit"></i> Edit Event
                                </button>
                                {selectedEvent.status === 'PENDING' && (
                                    <button
                                        className="btn-confirm"
                                        onClick={() => {
                                            handleApproveEvent(selectedEvent.id);
                                            closeAllModals();
                                        }}
                                    >
                                        <i className="fas fa-check"></i> Approve
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default ManageEvents;
