import React from 'react';
import './SharedComponents.css';

/**
 * Reusable Badge Component
 * @param {string} text - Badge text
 * @param {string} variant - Badge variant (primary, success, warning, danger, info, secondary)
 * @param {string} icon - Optional FontAwesome icon class
 * @param {string} size - Badge size (sm, md, lg)
 */
const Badge = ({
    text,
    variant = 'primary',
    icon,
    size = 'md',
    className = ''
}) => {
    const badgeClass = `badge badge-${variant} badge-${size} ${className}`;

    return (
        <span className={badgeClass}>
            {icon && <i className={`fas ${icon}`}></i>}
            <span>{text}</span>
        </span>
    );
};

export default Badge;
