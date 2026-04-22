/**
 * Export Utilities
 * Helper functions for exporting data to various formats
 */

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Optional array of column definitions [{key, label}]
 */
export const exportToCSV = (data, filename, columns = null) => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // If columns not provided, use all keys from first object
    const headers = columns
        ? columns.map(col => col.label || col.key)
        : Object.keys(data[0]);

    const keys = columns
        ? columns.map(col => col.key)
        : Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        // Header row
        headers.join(','),
        // Data rows
        ...data.map(row =>
            keys.map(key => {
                const value = row[key];
                // Handle values that might contain commas or quotes
                if (value === null || value === undefined) return '';
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            }).join(',')
        )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Format data for export by selecting specific columns
 * @param {Array} data - Array of objects
 * @param {Array} columns - Array of column definitions [{key, label, format}]
 * @returns {Array} Formatted data array
 */
export const formatDataForExport = (data, columns) => {
    return data.map(row => {
        const formattedRow = {};
        columns.forEach(col => {
            const value = row[col.key];
            formattedRow[col.key] = col.format ? col.format(value, row) : value;
        });
        return formattedRow;
    });
};

/**
 * Export table data to CSV with custom formatting
 * @param {Array} data - Array of objects
 * @param {Array} columns - Column definitions
 * @param {string} filename - File name
 */
export const exportTableToCSV = (data, columns, filename) => {
    const formattedData = formatDataForExport(data, columns);
    exportToCSV(formattedData, filename, columns);
};

/**
 * Format currency for export
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrencyForExport = (amount) => {
    return amount ? `₹${amount.toLocaleString('en-IN')}` : '₹0';
};

/**
 * Format date for export
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForExport = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Format datetime for export
 * @param {string|Date} datetime - Datetime to format
 * @returns {string} Formatted datetime string
 */
export const formatDateTimeForExport = (datetime) => {
    if (!datetime) return '';
    const d = new Date(datetime);
    return d.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const ExportUtils = {
    exportToCSV,
    formatDataForExport,
    exportTableToCSV,
    formatCurrencyForExport,
    formatDateForExport,
    formatDateTimeForExport
};

export default ExportUtils;
