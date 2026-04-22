import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import userService from '../services/userService';
import authService from '../services/authService';
import './CSS/ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    // Modal states
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const currentUserRole = authService.getUserRole();
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        fetchUsers();
    }, []);

    const filterUsers = useCallback(() => {
        let filtered = [...users];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(user =>
                user.username?.toLowerCase().includes(term) ||
                user.email?.toLowerCase().includes(term) ||
                user.id?.toString().includes(term)
            );
        }

        // Role filter
        if (roleFilter !== 'ALL') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, roleFilter]);

    useEffect(() => {
        filterUsers();
    }, [filterUsers]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await userService.getAllUsers();

            if (result.success) {
                setUsers(result.data || []);
            } else {
                setError(result.error || 'Failed to load users');
            }
        } catch (err) {
            setError('An error occurred while loading users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowRoleModal(true);
        setSuccess('');
        setError('');
    };

    const closeRoleModal = () => {
        setShowRoleModal(false);
        setSelectedUser(null);
        setNewRole('');
    };

    const handleRoleChange = async () => {
        if (!selectedUser || !newRole) return;

        // Prevent changing own role
        if (selectedUser.id === currentUser?.id) {
            setError('You cannot change your own role');
            return;
        }

        // Only SUPERUSER can assign SUPERUSER role
        if (newRole === 'SUPERUSER' && currentUserRole !== 'SUPERUSER') {
            setError('Only a Superuser can assign Superuser role');
            return;
        }

        setActionLoading(true);
        setError('');

        try {
            const result = await userService.assignRole(selectedUser.id, newRole);

            if (result.success) {
                setSuccess(`Successfully updated ${selectedUser.username}'s role to ${newRole}`);
                closeRoleModal();
                fetchUsers(); // Refresh the list
            } else {
                setError(result.error || 'Failed to update role');
            }
        } catch (err) {
            setError('An error occurred while updating role');
            console.error('Error updating role:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'SUPERUSER': return 'role-superuser';
            case 'ADMIN': return 'role-admin';
            case 'VOLUNTEER': return 'role-volunteer';
            default: return '';
        }
    };

    const getStats = () => {
        const total = users.length;
        const volunteers = users.filter(u => u.role === 'VOLUNTEER').length;
        const admins = users.filter(u => u.role === 'ADMIN').length;
        const superusers = users.filter(u => u.role === 'SUPERUSER').length;
        return { total, volunteers, admins, superusers };
    };

    const stats = getStats();

    return (
        <div className="manage-users-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-content">
                    <motion.h1
                        className="page-title"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <i className="fas fa-users-cog"></i> User <span className="highlight">Management</span>
                    </motion.h1>
                    <motion.p
                        className="page-subtitle"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Manage user accounts and assign roles
                    </motion.p>
                </div>
            </section>

            <div className="container-custom">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="stat-icon bg-primary">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.total}</h3>
                            <p>Total Users</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="stat-icon bg-success">
                            <i className="fas fa-hand-holding-heart"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.volunteers}</h3>
                            <p>Volunteers</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="stat-icon bg-warning">
                            <i className="fas fa-user-shield"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.admins}</h3>
                            <p>Admins</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="stat-icon bg-danger">
                            <i className="fas fa-crown"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.superusers}</h3>
                            <p>Superusers</p>
                        </div>
                    </motion.div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle"></i> {error}
                        <button className="alert-close" onClick={() => setError('')}>×</button>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <i className="fas fa-check-circle"></i> {success}
                        <button className="alert-close" onClick={() => setSuccess('')}>×</button>
                    </div>
                )}

                {/* Filters */}
                <motion.div
                    className="filters-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search by username, email, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-buttons">
                        {['ALL', 'VOLUNTEER', 'ADMIN', 'SUPERUSER'].map(role => (
                            <button
                                key={role}
                                className={`filter-btn ${roleFilter === role ? 'active' : ''}`}
                                onClick={() => setRoleFilter(role)}
                            >
                                {role === 'ALL' ? 'All Roles' : role}
                            </button>
                        ))}
                    </div>

                    <button className="btn-refresh" onClick={fetchUsers}>
                        <i className="fas fa-sync-alt"></i> Refresh
                    </button>
                </motion.div>

                {/* Users Table */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading users...</span>
                        </div>
                        <p>Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-user-slash"></i>
                        <h3>No Users Found</h3>
                        <p>No users match your current filters.</p>
                    </div>
                ) : (
                    <motion.div
                        className="table-container"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <td className="user-id">#{user.id}</td>
                                        <td className="user-name">
                                            <div className="user-avatar">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{user.username}</span>
                                            {user.id === currentUser?.id && (
                                                <span className="you-badge">You</span>
                                            )}
                                        </td>
                                        <td className="user-email">{user.email || 'N/A'}</td>
                                        <td>
                                            <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                                                {user.role === 'SUPERUSER' && <i className="fas fa-crown"></i>}
                                                {user.role === 'ADMIN' && <i className="fas fa-user-shield"></i>}
                                                {user.role === 'VOLUNTEER' && <i className="fas fa-hand-holding-heart"></i>}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="status-badge status-active">
                                                <i className="fas fa-circle"></i> Active
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => openRoleModal(user)}
                                                disabled={user.id === currentUser?.id}
                                                title={user.id === currentUser?.id ? "Cannot change own role" : "Change Role"}
                                            >
                                                <i className="fas fa-user-edit"></i>
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}

                {/* Pagination Info */}
                <div className="table-footer">
                    <p className="showing-text">
                        Showing {filteredUsers.length} of {users.length} users
                    </p>
                </div>
            </div>

            {/* Role Change Modal */}
            {showRoleModal && selectedUser && (
                <div className="modal-overlay" onClick={closeRoleModal}>
                    <motion.div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="modal-header">
                            <h3><i className="fas fa-user-edit"></i> Change User Role</h3>
                            <button className="modal-close" onClick={closeRoleModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="user-info-card">
                                <div className="user-avatar large">
                                    {selectedUser.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-details">
                                    <h4>{selectedUser.username}</h4>
                                    <p>Current Role: <span className={`role-badge ${getRoleBadgeClass(selectedUser.role)}`}>{selectedUser.role}</span></p>
                                </div>
                            </div>

                            <div className="role-selection">
                                <label>Select New Role:</label>
                                <div className="role-options">
                                    <label className={`role-option ${newRole === 'VOLUNTEER' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="VOLUNTEER"
                                            checked={newRole === 'VOLUNTEER'}
                                            onChange={(e) => setNewRole(e.target.value)}
                                        />
                                        <div className="role-option-content">
                                            <i className="fas fa-hand-holding-heart"></i>
                                            <span>Volunteer</span>
                                            <small>Can join events and submit expenses</small>
                                        </div>
                                    </label>

                                    <label className={`role-option ${newRole === 'ADMIN' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="ADMIN"
                                            checked={newRole === 'ADMIN'}
                                            onChange={(e) => setNewRole(e.target.value)}
                                        />
                                        <div className="role-option-content">
                                            <i className="fas fa-user-shield"></i>
                                            <span>Admin</span>
                                            <small>Can manage events and approve expenses</small>
                                        </div>
                                    </label>

                                    {currentUserRole === 'SUPERUSER' && (
                                        <label className={`role-option ${newRole === 'SUPERUSER' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="SUPERUSER"
                                                checked={newRole === 'SUPERUSER'}
                                                onChange={(e) => setNewRole(e.target.value)}
                                            />
                                            <div className="role-option-content">
                                                <i className="fas fa-crown"></i>
                                                <span>Superuser</span>
                                                <small>Full access to all features</small>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <div className="modal-alert alert-danger">
                                    <i className="fas fa-exclamation-circle"></i> {error}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeRoleModal}>
                                Cancel
                            </button>
                            <button
                                className="btn-confirm"
                                onClick={handleRoleChange}
                                disabled={actionLoading || newRole === selectedUser.role}
                            >
                                {actionLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm"></span>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check"></i> Confirm Change
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
