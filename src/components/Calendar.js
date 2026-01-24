import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import EventDetailsModal from './EventDetailsModal';
import eventService from '../services/eventService';
import authService from '../services/authService';
import './CSS/Calendar.css';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await eventService.getAllEvents();

            if (result.success) {
                setEvents(result.data || []);
            } else {
                setError(result.error || 'Failed to load events');
            }
        } catch (err) {
            setError('An error occurred while loading events');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    const handleEventUpdate = () => {
        // Refresh events after an update (join, approve, etc.)
        fetchEvents();
    };

    // Separate events into upcoming and past
    const getUpcomingEvents = () => {
        const now = new Date();
        return events.filter(event => {
            const eventDate = event.eventDate ? new Date(event.eventDate) : new Date(event.createdAt);
            // If it's in the future, it's upcoming (status filtering is handled by backend)
            return eventDate >= now;
        });
    };

    const getPastEvents = () => {
        const now = new Date();
        return events.filter(event => {
            const eventDate = event.eventDate ? new Date(event.eventDate) : new Date(event.createdAt);
            // Only truly past events here
            return eventDate < now;
        });
    };

    const upcomingEvents = getUpcomingEvents();
    const pastEvents = getPastEvents();
    const isAdmin = authService.isAdmin();

    return (
        <div className="calendar-page">
            {/* Header Section */}
            <section className="page-hero">
                <div className="page-hero-content">
                    <motion.h1
                        className="page-title"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Our <span className="highlight">Events</span>
                    </motion.h1>
                    <motion.p
                        className="page-subtitle"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Join us in making a difference. Explore our past achievements and upcoming opportunities to volunteer.
                    </motion.p>
                </div>
            </section>

            {/* Error Message */}
            {error && (
                <div className="container-custom">
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle"></i> {error}
                        <button onClick={fetchEvents} className="btn-retry">
                            <i className="fas fa-redo"></i> Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="container-custom">
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading events...</span>
                        </div>
                        <p>Loading events...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Upcoming Events Section */}
                    <section className="events-section upcoming-section">
                        <div className="container-custom">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="section-title">
                                    <i className="fas fa-calendar-alt"></i> Upcoming Events
                                </h2>
                                <p className="section-description">
                                    Register now to be part of our upcoming initiatives
                                </p>
                            </motion.div>

                            <div className="events-grid">
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <EventCard
                                                event={event}
                                                isPast={false}
                                                onViewDetails={() => handleEventClick(event)}
                                                onEventUpdate={handleEventUpdate}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="no-events">No upcoming events at the moment. Check back soon!</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Past Events Section */}
                    {(pastEvents.length > 0 || isAdmin) && (
                        <section className="events-section past-section">
                            <div className="container-custom">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h2 className="section-title">
                                        <i className="fas fa-history"></i> {isAdmin ? 'All Events' : 'Past Events'}
                                    </h2>
                                    <p className="section-description">
                                        {isAdmin ? 'Manage all events including unapproved ones' : 'Celebrating our impact and achievements'}
                                    </p>
                                </motion.div>

                                <div className="events-grid">
                                    {pastEvents.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <EventCard
                                                event={event}
                                                isPast={true}
                                                onViewDetails={() => handleEventClick(event)}
                                                onEventUpdate={handleEventUpdate}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* Event Details Modal */}
            {selectedEvent && (
                <EventDetailsModal
                    show={showModal}
                    onHide={handleCloseModal}
                    event={selectedEvent}
                    onEventUpdate={handleEventUpdate}
                />
            )}
        </div>
    );
};

export default Calendar;
