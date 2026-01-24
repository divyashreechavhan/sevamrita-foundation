import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SharedComponents.css';

/**
 * Reusable Confirmation Dialog Component
 * @param {boolean} show - Whether to show the dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {function} onConfirm - Confirm button handler
 * @param {function} onCancel - Cancel button handler
 * @param {string} variant - Dialog variant (danger, warning, info)
 * @param {string} confirmText - Confirm button text
 * @param {string} cancelText - Cancel button text
 * @param {boolean} loading - Loading state
 */
const ConfirmDialog = ({
    show,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    onConfirm,
    onCancel,
    variant = 'danger',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false
}) => {
    if (!show) return null;

    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return 'fa-exclamation-triangle';
            case 'warning':
                return 'fa-exclamation-circle';
            case 'info':
                return 'fa-info-circle';
            default:
                return 'fa-question-circle';
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="confirm-dialog-overlay" onClick={onCancel}>
                    <motion.div
                        className={`confirm-dialog confirm-dialog-${variant}`}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="confirm-dialog-header">
                            <div className={`confirm-dialog-icon confirm-icon-${variant}`}>
                                <i className={`fas ${getIcon()}`}></i>
                            </div>
                            <h3>{title}</h3>
                        </div>

                        <div className="confirm-dialog-body">
                            <p>{message}</p>
                        </div>

                        <div className="confirm-dialog-footer">
                            <button
                                className="btn-cancel"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                {cancelText}
                            </button>
                            <button
                                className={`btn-confirm btn-confirm-${variant}`}
                                onClick={onConfirm}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm"></span>
                                        Processing...
                                    </>
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
