import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import eventService from '../../../../services/eventService';
import './SharedComponents.css';

/**
 * Pending Approvals Widget
 * Shows pending events and provides quick approve/reject actions
 */
const PendingApprovals = () => {
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchPendingEvents();
    }, []);

    const fetchPendingEvents = async () => {
        setLoading(true);
        try {
            const result = await eventService.getAllEvents();
            if (result.success) {
                const pending = (result.data || []).filter(event => event.status === 'UNAPPROVED');
                setPendingEvents(pending);
            }
        } catch (err) {
            console.error('Error fetching pending events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (eventId) => {
        setActionLoading(eventId);
        try {
            const result = await eventService.approveEvent(eventId);
            if (result.success) {
                fetchPendingEvents(); // Refresh list
            }
        } catch (err) {
            console.error('Error approving event:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (eventId) => {
        if (!window.confirm('Are you sure you want to reject this event?')) return;

        setActionLoading(eventId);
        try {
            const result = await eventService.deleteEvent(eventId);
            if (result.success) {
                fetchPendingEvents(); // Refresh list
            }
        } catch (err) {
            console.error('Error rejecting event:', err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="widget-card">
                <div className="widget-header">
                    <h3><i className="fas fa-clock"></i> Pending Approvals</h3>
                </div>
                <div className="widget-body">
                    <div className="widget-loading">
                        <div className="spinner-border spinner-border-sm"></div>
                        <span>Loading pending items...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="widget-card">
            <div className="widget-header">
                <h3><i className="fas fa-clock"></i> Pending Approvals</h3>
                <span className="widget-badge">{pendingEvents.length}</span>
            </div>
            <div className="widget-body">
                {pendingEvents.length === 0 ? (
                    <div className="widget-empty">
                        <i className="fas fa-check-circle"></i>
                        <p>All caught up! No pending approvals.</p>
                    </div>
                ) : (
                    <div className="approval-list">
                        {pendingEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                className="approval-item"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <div className="approval-info">
                                    <h4>{event.name}</h4>
                                    <p>
                                        <i className="fas fa-map-marker-alt"></i> {event.location}
                                        {event.budget && (
                                            <span className="approval-budget">
                                                <i className="fas fa-rupee-sign"></i> {event.budget.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </p>
                                    <span className="approval-date">
                                        {new Date(event.eventDate).toLocaleDateString('en-IN', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="approval-actions">
                                    <button
                                        className="btn-approve"
                                        onClick={() => handleApprove(event.id)}
                                        disabled={actionLoading === event.id}
                                    >
                                        {actionLoading === event.id ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        ) : (
                                            <i className="fas fa-check"></i>
                                        )}
                                    </button>
                                    <button
                                        className="btn-reject"
                                        onClick={() => handleReject(event.id)}
                                        disabled={actionLoading === event.id}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingApprovals;
