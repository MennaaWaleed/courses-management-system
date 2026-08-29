import React, { useState, useEffect } from 'react';
import { 
    getInstructors, createInstructor, updateInstructor, 
    changeInstructorPassword, toggleInstructorStatus, deleteInstructor 
} from '../../../api/adminInstructorApi';
import { Search, Plus, Edit2, KeyRound, Power, Trash2, X } from 'lucide-react';
import './AdminInstructors.css';

export default function AdminInstructors() {
    const [instructors, setInstructors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal States
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null }); // type: 'create', 'edit', 'password'
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async (search = '') => {
        setLoading(true);
        try {
            const response = await getInstructors(search);
            setInstructors(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load instructors.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchInstructors(searchTerm);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const closeModals = () => {
        setModalConfig({ isOpen: false, type: null });
        setSelectedInstructor(null);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
    };

    const openModal = (type, instructor = null) => {
        if (instructor) {
            setSelectedInstructor(instructor);
            setFormData({ 
                firstName: instructor.firstName, 
                lastName: instructor.lastName, 
                email: instructor.email, 
                phone: instructor.phoneNumber || '', 
                password: '' 
            });
        } else {
            setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
        }
        setModalConfig({ isOpen: true, type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (modalConfig.type === 'create') {
                await createInstructor({ ...formData, phoneNumber: formData.phone });
            } else if (modalConfig.type === 'edit') {
                await updateInstructor(selectedInstructor.id, { ...formData, phoneNumber: formData.phone });
            } else if (modalConfig.type === 'password') {
                await changeInstructorPassword(selectedInstructor.id, formData.password);
            }
            fetchInstructors();
            closeModals();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleInstructorStatus(id);
            fetchInstructors();
        } catch (err) {
            alert('Failed to change instructor status.');
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to permanently delete ${name}?`)) {
            try {
                await deleteInstructor(id);
                fetchInstructors();
            } catch (err) {
                alert('Failed to delete instructor.');
            }
        }
    };

    return (
        <div className="admin-instructors">
            <div className="admin-instructors__header">
                <div>
                    <h2>Instructor Management</h2>
                    <p>Add, update, and manage your course instructors.</p>
                </div>
                <button className="admin-instructors__btn-primary" onClick={() => openModal('create')}>
                    <Plus size={18} /> Add Instructor
                </button>
            </div>

            <div className="admin-instructors__toolbar">
                <form onSubmit={handleSearch} className="admin-instructors__search">
                    <Search size={18} color="#64748b" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            {error && <div className="admin-instructors__error">{error}</div>}

            <div className="admin-instructors__table-container">
                {loading ? (
                    <div className="admin-instructors__loading">Loading instructors...</div>
                ) : instructors.length === 0 ? (
                    <div className="admin-instructors__empty">No instructors found.</div>
                ) : (
                    <table className="admin-instructors__table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instructors.map(inst => (
                                <tr key={inst.id}>
                                    <td className="font-medium">{inst.firstName} {inst.lastName}</td>
                                    <td className="text-muted">{inst.email}</td>
                                    <td className="text-muted">{inst.phoneNumber || 'N/A'}</td>
                                    <td>
                                        <span className={`admin-instructors__badge ${inst.enabled ? 'badge-active' : 'badge-disabled'}`}>
                                            {inst.enabled ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-instructors__actions">
                                            <button onClick={() => openModal('edit', inst)} title="Edit Details"><Edit2 size={16} /></button>
                                            <button onClick={() => openModal('password', inst)} title="Change Password"><KeyRound size={16} /></button>
                                            <button onClick={() => handleToggleStatus(inst.id)} title={inst.enabled ? 'Disable Account' : 'Enable Account'} className={inst.enabled ? 'text-warning' : 'text-success'}>
                                                <Power size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(inst.id, inst.firstName)} title="Delete Instructor" className="text-danger">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Reusable Modal */}
            {modalConfig.isOpen && (
                <div className="admin-instructors__modal-overlay" onClick={closeModals}>
                    <div className="admin-instructors__modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-instructors__modal-header">
                            <h3>
                                {modalConfig.type === 'create' ? 'Add New Instructor' : 
                                 modalConfig.type === 'edit' ? 'Edit Instructor Details' : 
                                 'Change Password'}
                            </h3>
                            <button onClick={closeModals}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-instructors__form">
                            
                            {(modalConfig.type === 'create' || modalConfig.type === 'edit') && (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number (Optional)</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                </>
                            )}

                            {(modalConfig.type === 'create' || modalConfig.type === 'password') && (
                                <div className="form-group">
                                    <label>{modalConfig.type === 'create' ? 'Initial Password' : 'New Password'}</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength={6} />
                                </div>
                            )}

                            <div className="admin-instructors__modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModals} disabled={isSubmitting}>Cancel</button>
                                <button type="submit" className="admin-instructors__btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : modalConfig.type === 'password' ? 'Update Password' : 'Save Instructor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}