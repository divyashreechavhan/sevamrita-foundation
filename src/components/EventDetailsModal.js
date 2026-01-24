import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { format } from 'date-fns';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    LinkedinIcon
} from 'react-share';
import eventService from '../services/eventService';
import authService from '../services/authService';
import './CSS/Calendar.css';

const EventDetailsModal = ({ show, onHide, event, onEventUpdate }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isJoining, setIsJoining] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Check for pending event join when modal opens
    useEffect(() => {
        const isAuthenticated = authService.isAuthenticated();
        if (show && isAuthenticated && event) {
            const pendingEventId = sessionStorage.getItem('pendingEventJoin');
            // If there's a pending join for this specific event, automatically trigger it
            if (pendingEventId && pendingEventId === String(event?.id)) {
                // Small delay to ensure modal is fully rendered
                const joinEvent = async () => {
                    if (!event) return;

                    const result = await eventService.joinEvent(event.id);
                    if (result.success) {
                        setMessage({ type: 'success', text: 'Successfully joined the event!' });
                        sessionStorage.removeItem('pendingEventJoin');
                        if (onEventUpdate) onEventUpdate();
                        setTimeout(() => {
                            onHide();
                        }, 2000);
                    } else {
                        setMessage({ type: 'error', text: result.error || 'Failed to join event' });
                    }
                };

                setTimeout(() => {
                    joinEvent();
                }, 500);
            }
        }
    }, [show, event, onEventUpdate, onHide]);

    if (!event) return null;

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    // Map backend fields
    const title = event?.name || event?.title;
    const date = event?.eventDate || event?.date || event?.createdAt;
    const isApproved = event?.status === 'APPROVED';
    const isPast = event?.status === 'completed';
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    const shareUrl = `${window.location.origin}/events/${event?.id}`;
    const shareTitle = `Join us: ${title}`;

    const handleJoinEvent = async () => {
        if (!event) return;

        if (!isAuthenticated) {
            // Store event ID for joining after login
            sessionStorage.setItem('pendingEventJoin', event.id);
            setMessage({ type: 'info', text: 'Please login or register to join this event. You will be able to join after authentication.' });

            // Trigger login modal through a custom event
            window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { view: 'login' } }));
            return;
        }

        setIsJoining(true);
        setMessage({ type: '', text: '' });

        try {
            const result = await eventService.joinEvent(event.id);
            if (result.success) {
                setMessage({ type: 'success', text: 'Successfully joined the event!' });
                // Clear any pending join
                sessionStorage.removeItem('pendingEventJoin');
                if (onEventUpdate) onEventUpdate();
                setTimeout(() => {
                    onHide();
                }, 2000);
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to join event' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while joining the event' });
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg" centered className="event-details-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Message Alert */}
                    {message.text && (
                        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> {message.text}
                        </div>
                    )}

                    {/* Event Info */}
                    <div className="event-info-section">
                        <div className="event-meta-detail">
                            <div className="meta-item">
                                <i className="fas fa-calendar"></i>
                                <span>{formatDate(date)}</span>
                            </div>
                            <div className="meta-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{event.location}</span>
                            </div>
                            {event.budget && (
                                <div className="meta-item">
                                    <i className="fas fa-wallet"></i>
                                    <span>Budget: ₹{parseFloat(event.budget).toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="meta-item">
                                <i className="fas fa-tag"></i>
                                <span className={`status-badge ${event.status?.toLowerCase()}`}>
                                    {event.status || 'PENDING'}
                                </span>
                            </div>
                        </div>

                        <p className="event-full-description">{event.description}</p>

                        {/* Lead Volunteer & Creator Info */}
                        {(event.leadVolunteerName || event.creatorName) && (
                            <div className="event-team-info">
                                {event.leadVolunteerName && (
                                    <div className="team-member">
                                        <i className="fas fa-user-tie"></i>
                                        <span><strong>Lead Volunteer:</strong> {event.leadVolunteerName}</span>
                                    </div>
                                )}
                                {event.creatorName && (
                                    <div className="team-member">
                                        <i className="fas fa-user"></i>
                                        <span><strong>Created by:</strong> {event.creatorName}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Volunteers List */}
                        {event.volunteers && event.volunteers.length > 0 && (
                            <div className="volunteers-section">
                                <h4><i className="fas fa-users"></i> Volunteers ({event.volunteers.length})</h4>
                                <div className="volunteers-list">
                                    {event.volunteers.map((volunteer, index) => (
                                        <div key={index} className="volunteer-item">
                                            <i className="fas fa-user-circle"></i>
                                            <span>{volunteer.volunteerName || volunteer.username}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isPast && event.volunteersCount && (
                            <div className="impact-stats">
                                <div className="stat-item">
                                    <i className="fas fa-users"></i>
                                    <span className="stat-number">{event.volunteersCount}</span>
                                    <span className="stat-label">Volunteers</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Photo Gallery for Past Events */}
                    {isPast && event.photos && event.photos.length > 0 && (
                        <div className="photo-gallery-section">
                            <h4><i className="fas fa-images"></i> Event Gallery</h4>
                            <div className="photo-gallery-grid">
                                {event.photos.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="gallery-photo"
                                        onClick={() => setSelectedPhoto(photo)}
                                    >
                                        <img src={photo} alt={`${title} ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Social Share Buttons */}
                    <div className="social-share-section">
                        <h4><i className="fas fa-share-alt"></i> Share This Event</h4>
                        <div className="share-buttons">
                            <FacebookShareButton url={shareUrl} quote={shareTitle}>
                                <FacebookIcon size={40} round />
                            </FacebookShareButton>
                            <TwitterShareButton url={shareUrl} title={shareTitle}>
                                <TwitterIcon size={40} round />
                            </TwitterShareButton>
                            <WhatsappShareButton url={shareUrl} title={shareTitle}>
                                <WhatsappIcon size={40} round />
                            </WhatsappShareButton>
                            <LinkedinShareButton url={shareUrl} title={shareTitle}>
                                <LinkedinIcon size={40} round />
                            </LinkedinShareButton>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="event-modal-actions">
                        {/* Join Event Button (for approved upcoming events, all users except admins) */}
                        {!isPast && isApproved && !isAdmin && (
                            <button
                                className="btn-join-event"
                                onClick={handleJoinEvent}
                                disabled={isJoining}
                            >
                                {isJoining ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm mr-2"></span>
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-hand-paper"></i> {isAuthenticated ? 'Join as Volunteer' : 'Login to Join Event'}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </Modal.Body>
            </Modal>

            {/* Photo Lightbox */}
            {selectedPhoto && (
                <Modal
                    show={!!selectedPhoto}
                    onHide={() => setSelectedPhoto(null)}
                    size="xl"
                    centered
                    className="photo-lightbox"
                >
                    <Modal.Body className="p-0">
                        <button className="close-lightbox" onClick={() => setSelectedPhoto(null)}>
                            <i className="fas fa-times"></i>
                        </button>
                        <img src={selectedPhoto} alt="Event" className="lightbox-image" />
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default EventDetailsModal;
