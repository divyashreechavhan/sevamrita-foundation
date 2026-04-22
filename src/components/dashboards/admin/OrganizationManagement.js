import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import organizationService from '../../../services/organizationService';
import StatCard from './components/StatCard';
import ConfirmDialog from './components/ConfirmDialog';
import Badge from './components/Badge';
import '../../CSS/OrganizationManagement.css';

const OrganizationManagement = () => {
    const [organizations, setOrganizations] = useState([]);
    const [filteredOrgs, setFilteredOrgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Form state
    const [orgForm, setOrgForm] = useState({
        name: '',
        type: 'NGO',
        description: '',
        contactEmail: '',
        contactPhone: '',
        address: ''
    });

    const orgTypes = ['NGO', 'CORPORATE', 'GOVERNMENT', 'COLLEGE', 'OTHER'];

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const filterOrganizations = useCallback(() => {
        let filtered = [...organizations];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(org =>
                org.name?.toLowerCase().includes(term) ||
                org.description?.toLowerCase().includes(term) ||
                org.contactEmail?.toLowerCase().includes(term)
            );
        }

        // Type filter
        if (typeFilter !== 'ALL') {
            filtered = filtered.filter(org => org.type === typeFilter);
        }

        setFilteredOrgs(filtered);
    }, [organizations, searchTerm, typeFilter]);

    useEffect(() => {
        filterOrganizations();
    }, [filterOrganizations]);

    const fetchOrganizations = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await organizationService.getAllOrganizations();

            if (result.success) {
                setOrganizations(result.data || []);
            } else {
                setError(result.error || 'Failed to load organizations');
            }
        } catch (err) {
            setError('An error occurred while loading organizations');
            console.error('Error fetching organizations:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setOrgForm({
            name: '',
            type: 'NGO',
            description: '',
            contactEmail: '',
            contactPhone: '',
            address: ''
        });
    };

    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
        setError('');
        setSuccess('');
    };

    const openEditModal = (org) => {
        setSelectedOrg(org);
        setOrgForm({
            name: org.name || '',
            type: org.type || 'NGO',
            description: org.description || '',
            contactEmail: org.contactEmail || '',
            contactPhone: org.contactPhone || '',
            address: org.address || ''
        });
        setShowEditModal(true);
        setError('');
    };

    const openDeleteDialog = (org) => {
        setSelectedOrg(org);
        setShowDeleteDialog(true);
    };

    const closeAllModals = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteDialog(false);
        setSelectedOrg(null);
        resetForm();
    };

    const handleCreateOrganization = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError('');

        try {
            const result = await organizationService.createOrganization(orgForm);

            if (result.success) {
                setSuccess('Organization created successfully!');
                closeAllModals();
                fetchOrganizations();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.error || 'Failed to create organization');
            }
        } catch (err) {
            setError('An error occurred while creating the organization');
            console.error('Error creating organization:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateOrganization = async (e) => {
        e.preventDefault();
        if (!selectedOrg) return;

        setActionLoading(true);
        setError('');

        try {
            const result = await organizationService.updateOrganization(selectedOrg.id, orgForm);

            if (result.success) {
                setSuccess('Organization updated successfully!');
                closeAllModals();
                fetchOrganizations();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.error || 'Failed to update organization');
            }
        } catch (err) {
            setError('An error occurred while updating the organization');
            console.error('Error updating organization:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteOrganization = async () => {
        if (!selectedOrg) return;

        setActionLoading(true);

        try {
            const result = await organizationService.deleteOrganization(selectedOrg.id);

            if (result.success) {
                setSuccess('Organization deleted successfully!');
                closeAllModals();
                fetchOrganizations();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.error || 'Failed to delete organization');
            }
        } catch (err) {
            setError('An error occurred while deleting the organization');
            console.error('Error deleting organization:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const getStats = () => {
        const total = organizations.length;
        const ngo = organizations.filter(o => o.type === 'NGO').length;
        const corporate = organizations.filter(o => o.type === 'CORPORATE').length;
        const government = organizations.filter(o => o.type === 'GOVERNMENT').length;
        const college = organizations.filter(o => o.type === 'COLLEGE').length;
        return { total, ngo, corporate, government, college };
    };

    const stats = getStats();

    const getTypeIcon = (type) => {
        switch (type) {
            case 'NGO': return 'fa-hands-helping';
            case 'CORPORATE': return 'fa-building';
            case 'GOVERNMENT': return 'fa-landmark';
            case 'COLLEGE': return 'fa-university';
            default: return 'fa-sitemap';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'NGO': return 'success';
            case 'CORPORATE': return 'primary';
            case 'GOVERNMENT': return 'warning';
            case 'COLLEGE': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <div className="organization-management-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-content">
                    <motion.h1
                        className="page-title"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <i className="fas fa-sitemap"></i> Organization <span className="highlight">Management</span>
                    </motion.h1>
                    <motion.p
                        className="page-subtitle"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Manage partner organizations and collaborators
                    </motion.p>
                </div>
            </section>

            <div className="container-custom">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <StatCard
                        icon="fa-sitemap"
                        title="Total Organizations"
                        value={stats.total}
                        variant="primary"
                    />
                    <StatCard
                        icon="fa-hands-helping"
                        title="NGOs"
                        value={stats.ngo}
                        variant="success"
                    />
                    <StatCard
                        icon="fa-building"
                        title="Corporate"
                        value={stats.corporate}
                        variant="info"
                    />
                    <StatCard
                        icon="fa-landmark"
                        title="Government"
                        value={stats.government}
                        variant="warning"
                    />
                    <StatCard
                        icon="fa-university"
                        title="Colleges"
                        value={stats.college}
                        variant="info"
                    />
                </div>

                {/* Alerts */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="alert alert-danger"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <i className="fas fa-exclamation-circle"></i> {error}
                            <button className="alert-close" onClick={() => setError('')}>×</button>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            className="alert alert-success"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <i className="fas fa-check-circle"></i> {success}
                            <button className="alert-close" onClick={() => setSuccess('')}>×</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters & Actions */}
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
                            placeholder="Search organizations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-buttons">
                        {['ALL', ...orgTypes].map(type => (
                            <button
                                key={type}
                                className={`filter-btn ${typeFilter === type ? 'active' : ''}`}
                                onClick={() => setTypeFilter(type)}
                            >
                                {type === 'ALL' ? 'All Types' : type}
                            </button>
                        ))}
                    </div>

                    <div className="action-buttons">
                        <button className="btn-refresh" onClick={fetchOrganizations}>
                            <i className="fas fa-sync-alt"></i>
                        </button>
                        <button className="btn-create" onClick={openCreateModal}>
                            <i className="fas fa-plus"></i> Create Organization
                        </button>
                    </div>
                </motion.div>

                {/* Organizations Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading organizations...</span>
                        </div>
                        <p>Loading organizations...</p>
                    </div>
                ) : filteredOrgs.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-building-slash"></i>
                        <h3>No Organizations Found</h3>
                        <p>No organizations match your current filters.</p>
                        <button className="btn-create" onClick={openCreateModal}>
                            <i className="fas fa-plus"></i> Create First Organization
                        </button>
                    </div>
                ) : (
                    <div className="organizations-grid">
                        {filteredOrgs.map((org, index) => (
                            <motion.div
                                key={org.id}
                                className="organization-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <div className="org-card-header">
                                    <div className={`org-icon org-icon-${getTypeColor(org.type)}`}>
                                        <i className={`fas ${getTypeIcon(org.type)}`}></i>
                                    </div>
                                    <Badge
                                        text={org.type}
                                        variant={getTypeColor(org.type)}
                                        size="sm"
                                    />
                                </div>

                                <div className="org-card-body">
                                    <h3 className="org-name">{org.name}</h3>
                                    <p className="org-description">
                                        {org.description?.substring(0, 100)}
                                        {org.description?.length > 100 ? '...' : ''}
                                    </p>

                                    <div className="org-meta">
                                        {org.contactEmail && (
                                            <div className="meta-item">
                                                <i className="fas fa-envelope"></i>
                                                <span>{org.contactEmail}</span>
                                            </div>
                                        )}
                                        {org.contactPhone && (
                                            <div className="meta-item">
                                                <i className="fas fa-phone"></i>
                                                <span>{org.contactPhone}</span>
                                            </div>
                                        )}
                                        {org.address && (
                                            <div className="meta-item">
                                                <i className="fas fa-map-marker-alt"></i>
                                                <span>{org.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="org-card-footer">
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => openEditModal(org)}
                                    >
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => openDeleteDialog(org)}
                                    >
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Organization Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="modal-overlay" onClick={closeAllModals}>
                        <motion.div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="modal-header">
                                <h3><i className="fas fa-plus-circle"></i> Create New Organization</h3>
                                <button className="modal-close" onClick={closeAllModals}>×</button>
                            </div>

                            <form onSubmit={handleCreateOrganization}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Organization Name *</label>
                                        <input
                                            type="text"
                                            value={orgForm.name}
                                            onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                                            placeholder="Enter organization name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Type *</label>
                                        <select
                                            value={orgForm.type}
                                            onChange={(e) => setOrgForm({ ...orgForm, type: e.target.value })}
                                            required
                                        >
                                            {orgTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            value={orgForm.description}
                                            onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                                            placeholder="Describe the organization..."
                                            rows="4"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Contact Email</label>
                                            <input
                                                type="email"
                                                value={orgForm.contactEmail}
                                                onChange={(e) => setOrgForm({ ...orgForm, contactEmail: e.target.value })}
                                                placeholder="contact@example.com"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Contact Phone</label>
                                            <input
                                                type="tel"
                                                value={orgForm.contactPhone}
                                                onChange={(e) => setOrgForm({ ...orgForm, contactPhone: e.target.value })}
                                                placeholder="+91 1234567890"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            value={orgForm.address}
                                            onChange={(e) => setOrgForm({ ...orgForm, address: e.target.value })}
                                            placeholder="Organization address"
                                        />
                                    </div>

                                    {error && (
                                        <div className="modal-alert alert-danger">
                                            <i className="fas fa-exclamation-circle"></i> {error}
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-cancel" onClick={closeAllModals}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-confirm" disabled={actionLoading}>
                                        {actionLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-plus"></i> Create Organization
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Organization Modal */}
            <AnimatePresence>
                {showEditModal && selectedOrg && (
                    <div className="modal-overlay" onClick={closeAllModals}>
                        <motion.div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="modal-header">
                                <h3><i className="fas fa-edit"></i> Edit Organization</h3>
                                <button className="modal-close" onClick={closeAllModals}>×</button>
                            </div>

                            <form onSubmit={handleUpdateOrganization}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Organization Name *</label>
                                        <input
                                            type="text"
                                            value={orgForm.name}
                                            onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Type *</label>
                                        <select
                                            value={orgForm.type}
                                            onChange={(e) => setOrgForm({ ...orgForm, type: e.target.value })}
                                            required
                                        >
                                            {orgTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            value={orgForm.description}
                                            onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                                            rows="4"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Contact Email</label>
                                            <input
                                                type="email"
                                                value={orgForm.contactEmail}
                                                onChange={(e) => setOrgForm({ ...orgForm, contactEmail: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Contact Phone</label>
                                            <input
                                                type="tel"
                                                value={orgForm.contactPhone}
                                                onChange={(e) => setOrgForm({ ...orgForm, contactPhone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            value={orgForm.address}
                                            onChange={(e) => setOrgForm({ ...orgForm, address: e.target.value })}
                                        />
                                    </div>

                                    {error && (
                                        <div className="modal-alert alert-danger">
                                            <i className="fas fa-exclamation-circle"></i> {error}
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-cancel" onClick={closeAllModals}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-confirm" disabled={actionLoading}>
                                        {actionLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save"></i> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                show={showDeleteDialog}
                title="Delete Organization"
                message={`Are you sure you want to delete "${selectedOrg?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteOrganization}
                onCancel={closeAllModals}
                variant="danger"
                confirmText="Delete"
                loading={actionLoading}
            />
        </div>
    );
};

export default OrganizationManagement;
