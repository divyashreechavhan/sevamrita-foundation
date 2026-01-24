import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import './SharedComponents.css';

/**
 * Reusable Data Table Component with sorting, pagination, and search
 * @param {Array} columns - Column definitions [{ key, label, sortable, render }]
 * @param {Array} data - Data array
 * @param {function} onRowClick - Optional row click handler
 * @param {boolean} loading - Loading state
 * @param {string} emptyMessage - Message when no data
 * @param {number} pageSize - Rows per page (default: 10)
 * @param {boolean} showPagination - Show pagination controls
 * @param {string} className - Additional CSS classes
 */
const DataTable = ({
    columns = [],
    data = [],
    onRowClick,
    loading = false,
    emptyMessage = 'No data available',
    pageSize = 10,
    showPagination = true,
    className = ''
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    // Sorting logic
    const sortedData = useMemo(() => {
        let sortableData = [...data];

        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                if (typeof aValue === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            });
        }

        return sortableData;
    }, [data, sortConfig]);

    // Search logic
    const filteredData = useMemo(() => {
        if (!searchTerm) return sortedData;

        return sortedData.filter(row =>
            columns.some(col => {
                const value = row[col.key];
                return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [sortedData, searchTerm, columns]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = showPagination ? filteredData.slice(startIndex, endIndex) : filteredData;

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return 'fa-sort';
        }
        return sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    };

    if (loading) {
        return (
            <div className="data-table-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading data...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="data-table-empty">
                <i className="fas fa-inbox"></i>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={`data-table-container ${className}`}>
            {/* Search Bar */}
            <div className="data-table-header">
                <div className="data-table-search">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="data-table-info">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                </div>
            </div>

            {/* Table */}
            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                    className={column.sortable !== false ? 'sortable' : ''}
                                >
                                    {column.label}
                                    {column.sortable !== false && (
                                        <i className={`fas ${getSortIcon(column.key)} sort-icon`}></i>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <motion.tr
                                key={row.id || index}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={onRowClick ? 'clickable' : ''}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2, delay: index * 0.02 }}
                            >
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : row[column.key]}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
                <div className="data-table-pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <div className="pagination-pages">
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            // Show first, last, current, and adjacent pages
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={page} className="pagination-ellipsis">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataTable;
