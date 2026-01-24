import React from 'react';
import { motion } from 'framer-motion';
import './SharedComponents.css';

/**
 * Reusable Statistics Card Component
 * @param {string} icon - FontAwesome icon class (e.g., 'fa-users')
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {string} trend - Trend direction ('up', 'down', 'neutral')
 * @param {string|number} trendValue - Trend value (e.g., '+12%')
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Optional click handler
 */
const StatCard = ({
    icon,
    title,
    value,
    trend,
    trendValue,
    className = '',
    onClick,
    variant = 'primary' // primary, success, warning, danger, info
}) => {
    const variantClass = `stat-card-${variant}`;

    const getTrendIcon = () => {
        if (trend === 'up') return 'fa-arrow-up';
        if (trend === 'down') return 'fa-arrow-down';
        return 'fa-minus';
    };

    const getTrendClass = () => {
        if (trend === 'up') return 'trend-up';
        if (trend === 'down') return 'trend-down';
        return 'trend-neutral';
    };

    return (
        <motion.div
            className={`stat-card ${variantClass} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
            whileHover={onClick ? { scale: 1.02 } : {}}
        >
            <div className="stat-card-content">
                <div className="stat-icon">
                    <i className={`fas ${icon}`}></i>
                </div>
                <div className="stat-details">
                    <h3 className="stat-title">{title}</h3>
                    <p className="stat-value">{value}</p>
                    {trendValue && (
                        <div className={`stat-trend ${getTrendClass()}`}>
                            <i className={`fas ${getTrendIcon()}`}></i>
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
