import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import eventService from '../../../../services/eventService';
import userService from '../../../../services/userService';
import donationService from '../../../../services/donationService';
import './SharedComponents.css';

/**
 * Recent Activity Feed Widget
 * Shows recent system activities (events, donations, user registrations)
 */
const RecentActivity = ({ limit = 10 }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const [eventsRes, usersRes, donationsRes] = await Promise.all([
                eventService.getAllEvents(),
                userService.getAllUsers(),
                donationService.getAllDonations()
            ]);

            const allActivities = [];

            // Add events
            if (eventsRes.success && eventsRes.data) {
                eventsRes.data.forEach(event => {
                    allActivities.push({
                        id: `event-${event.id}`,
                        type: 'event',
                        icon: 'fa-calendar-alt',
                        color: '#3b82f6',
                        title: event.status === 'APPROVED' ? 'Event Approved' : 'Event Created',
                        description: event.name,
                        timestamp: event.createdAt || event.eventDate,
                        status: event.status
                    });
                });
            }

            // Add users
            if (usersRes.success && usersRes.data) {
                usersRes.data.slice(0, 5).forEach(user => {
                    allActivities.push({
                        id: `user-${user.id}`,
                        type: 'user',
                        icon: 'fa-user-plus',
                        color: '#10b981',
                        title: 'New User Registered',
                        description: user.username,
                        timestamp: user.createdAt,
                        role: user.role
                    });
                });
            }

            // Add donations
            if (donationsRes.success && donationsRes.data) {
                donationsRes.data.forEach(donation => {
                    allActivities.push({
                        id: `donation-${donation.id}`,
                        type: 'donation',
                        icon: 'fa-hand-holding-usd',
                        color: '#f59e0b',
                        title: 'Donation Received',
                        description: `₹${donation.amount?.toLocaleString('en-IN')} from ${donation.donorName || 'Anonymous'}`,
                        timestamp: donation.createdAt || donation.donationDate
                    });
                });
            }

            // Sort by timestamp (most recent first)
            allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Limit results
            setActivities(allActivities.slice(0, limit));
        } catch (err) {
            console.error('Error fetching activities:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="widget-card">
                <div className="widget-header">
                    <h3><i className="fas fa-history"></i> Recent Activity</h3>
                </div>
                <div className="widget-body">
                    <div className="widget-loading">
                        <div className="spinner-border spinner-border-sm"></div>
                        <span>Loading activities...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="widget-card">
            <div className="widget-header">
                <h3><i className="fas fa-history"></i> Recent Activity</h3>
                <button className="widget-refresh" onClick={fetchActivities}>
                    <i className="fas fa-sync-alt"></i>
                </button>
            </div>
            <div className="widget-body">
                {activities.length === 0 ? (
                    <div className="widget-empty">
                        <i className="fas fa-inbox"></i>
                        <p>No recent activity</p>
                    </div>
                ) : (
                    <div className="activity-list">
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                className="activity-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <div className="activity-icon" style={{ background: `${activity.color}20`, color: activity.color }}>
                                    <i className={`fas ${activity.icon}`}></i>
                                </div>
                                <div className="activity-content">
                                    <h4>{activity.title}</h4>
                                    <p>{activity.description}</p>
                                    <span className="activity-time">{formatTimestamp(activity.timestamp)}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
