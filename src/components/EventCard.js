import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import './CSS/Calendar.css';

const EventCard = ({ event, isPast, onViewDetails }) => {
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    // Map backend fields to frontend expectations
    const title = event.name || event.title;
    const date = event.eventDate || event.date || event.createdAt;
    const volunteersCount = event.volunteersCount || event.volunteers?.length || 0;
    const isApproved = event.status === 'APPROVED';

    return (
        <motion.div
            className={`event-card ${isPast ? 'past-event' : 'upcoming-event'}`}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {/* Event Header */}
            <div className="event-header">
                <h3 className="event-title">{title}</h3>
                <div className="event-meta">
                    <span className="event-date">
                        <i className="fas fa-calendar"></i> {formatDate(date)}
                    </span>
                    <span className="event-location">
                        <i className="fas fa-map-marker-alt"></i> {event.location}
                    </span>
                </div>
                {/* Status Badge */}
                {!isApproved && (
                    <span className="event-status-badge pending">
                        <i className="fas fa-clock"></i> Pending Approval
                    </span>
                )}
            </div>

            {/* Event Description */}
            <p className="event-description">
                {event.description.length > 120
                    ? `${event.description.substring(0, 120)}...`
                    : event.description}
            </p>

            {/* Budget Info */}
            {event.budget && (
                <div className="event-budget">
                    <i className="fas fa-wallet"></i>
                    <span>Budget: ₹{parseFloat(event.budget).toLocaleString('en-IN')}</span>
                </div>
            )}

            {/* Lead Volunteer */}
            {event.leadVolunteerName && (
                <div className="lead-volunteer">
                    <i className="fas fa-user-tie"></i>
                    <span>Lead: {event.leadVolunteerName}</span>
                </div>
            )}

            {/* Volunteers Count */}
            {volunteersCount > 0 && (
                <div className="volunteers-count">
                    <i className="fas fa-users"></i> {volunteersCount} Volunteer{volunteersCount !== 1 ? 's' : ''} {isPast ? 'Participated' : 'Joined'}
                </div>
            )}

            {/* Photo Preview for Past Events */}
            {isPast && event.photos && event.photos.length > 0 && (
                <div className="photo-preview">
                    {event.photos.slice(0, 3).map((photo, index) => (
                        <motion.div
                            key={index}
                            className="photo-thumb"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <img src={photo} alt={`${title} ${index + 1}`} />
                        </motion.div>
                    ))}
                    {event.photos.length > 3 && (
                        <div className="photo-count">+{event.photos.length - 3}</div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="event-actions">
                <motion.button
                    className="btn-view-details"
                    onClick={onViewDetails}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isPast ? (
                        <>
                            <i className="fas fa-images"></i> View Gallery & Reports
                        </>
                    ) : (
                        <>
                            <i className="fas fa-info-circle"></i> View Details
                        </>
                    )}
                </motion.button>

                {!isPast && isApproved && (
                    <motion.button
                        className="btn-register"
                        onClick={onViewDetails}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <i className="fas fa-hand-paper"></i> Register as Volunteer
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default EventCard;
