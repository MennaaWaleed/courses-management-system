import React, { useState, useEffect } from 'react';
import {
    getInstructors,
    createInstructor,
    updateInstructor,
    changeInstructorPassword,
    toggleInstructorStatus,
    deleteInstructor
} from '../../../api/adminInstructorApi';
import {
    Search,
    Plus,
    Edit2,
    KeyRound,
    Power,
    Trash2,
    X
} from 'lucide-react';
import './AdminInstructors.css';

export default function AdminInstructors() {
    const [instructors, setInstructors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal States
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: null
    }); // type: 'create', 'edit', 'password'

    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Success / Error Message Box
    const [message, setMessage] = useState({
        show: false,
        text: '',
        type: 'error'
    });

    // Delete Confirmation Box
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        show: false,
        id: null,
        name: ''
    });

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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // Message Box
    // =========================

    const showMessage = (text, type = 'error') => {
        setMessage({
            show: true,
            text,
            type
        });
    };

    const closeMessage = () => {
        setMessage({
            show: false,
            text: '',
            type: 'error'
        });
    };

    // =========================
    // Modal
    // =========================

    const closeModals = () => {
        setModalConfig({
            isOpen: false,
            type: null
        });

        setSelectedInstructor(null);

        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: ''
        });
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
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: ''
            });
        }

        setModalConfig({
            isOpen: true,
            type
        });
    };

    // =========================
    // Create / Edit / Password
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (modalConfig.type === 'create') {
                await createInstructor({
                    ...formData,
                    phoneNumber: formData.phone
                });

                closeModals();

                await fetchInstructors();

                showMessage(
                    'Instructor created successfully.',
                    'success'
                );

            } else if (modalConfig.type === 'edit') {
                await updateInstructor(
                    selectedInstructor.id,
                    {
                        ...formData,
                        phoneNumber: formData.phone
                    }
                );

                closeModals();

                await fetchInstructors();

                showMessage(
                    'Instructor details updated successfully.',
                    'success'
                );

            } else if (modalConfig.type === 'password') {
                await changeInstructorPassword(
                    selectedInstructor.id,
                    formData.password
                );

                closeModals();

                showMessage(
                    'Instructor password updated successfully.',
                    'success'
                );
            }

        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data ||
                'An error occurred. Please try again.';

            showMessage(errorMessage, 'error');

        } finally {
            setIsSubmitting(false);
        }
    };

    // =========================
    // Enable / Disable
    // =========================

    const handleToggleStatus = async (id) => {
        try {
            await toggleInstructorStatus(id);

            await fetchInstructors();

            showMessage(
                'Instructor status updated successfully.',
                'success'
            );

        } catch (err) {
            showMessage(
                err.response?.data?.message ||
                'Failed to change instructor status.',
                'error'
            );
        }
    };

    // =========================
    // Delete
    // =========================

    const handleDelete = (id, name) => {
        setDeleteConfirmation({
            show: true,
            id: id,
            name: name
        });
    };

    const cancelDelete = () => {
        setDeleteConfirmation({
            show: false,
            id: null,
            name: ''
        });
    };

    const confirmDelete = async () => {
        try {
            await deleteInstructor(deleteConfirmation.id);

            setDeleteConfirmation({
                show: false,
                id: null,
                name: ''
            });

            await fetchInstructors();

            showMessage(
                'Instructor deleted successfully.',
                'success'
            );

        } catch (err) {
            setDeleteConfirmation({
                show: false,
                id: null,
                name: ''
            });

            showMessage(
                err.response?.data?.message ||
                'Failed to delete instructor.',
                'error'
            );
        }
    };

    return (
        <div className="admin-instructors">

            {/* =========================================
                SUCCESS / ERROR MESSAGE BOX
            ========================================= */}
            {message.show && (
                <div className="message-overlay">
                    <div className={`message-box ${message.type}`}>

                        <div className="message-box__content">

                            <h3>
                                {message.type === 'error'
                                    ? 'Error'
                                    : 'Success'}
                            </h3>

                            <p>{message.text}</p>

                        </div>

                        <button
                            className="message-box__ok"
                            onClick={closeMessage}
                        >
                            OK
                        </button>

                    </div>
                </div>
            )}

            {/* =========================================
                DELETE CONFIRMATION BOX
            ========================================= */}
            {deleteConfirmation.show && (
                <div className="message-overlay">
                    <div className="message-box confirmation">

                        <div className="message-box__content">

                            <h3>Confirm Delete</h3>

                            <p>
                                Are you sure you want to permanently delete{' '}
                                <strong>
                                    {deleteConfirmation.name}
                                </strong>
                                ?
                            </p>

                        </div>

                        <div className="message-box__actions">

                            <button
                                className="message-box__cancel"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>

                            <button
                                className="message-box__delete"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* =========================================
                HEADER
            ========================================= */}
            <div className="admin-instructors__header">

                <div>
                    <h2>Instructor Management</h2>

                    <p>
                        Add, update, and manage your course instructors.
                    </p>
                </div>

                <button
                    className="admin-instructors__btn-primary"
                    onClick={() => openModal('create')}
                >
                    <Plus size={18} />
                    Add Instructor
                </button>

            </div>

            {/* =========================================
                SEARCH
            ========================================= */}
            <div className="admin-instructors__toolbar">

                <form
                    onSubmit={handleSearch}
                    className="admin-instructors__search"
                >

                    <Search
                        size={18}
                        color="#64748b"
                    />

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                    <button type="submit">
                        Search
                    </button>

                </form>

            </div>

            {/* =========================================
                ERROR
            ========================================= */}
            {error && (
                <div className="admin-instructors__error">
                    {error}
                </div>
            )}

            {/* =========================================
                TABLE
            ========================================= */}
            <div className="admin-instructors__table-container">

                {loading ? (

                    <div className="admin-instructors__loading">
                        Loading instructors...
                    </div>

                ) : instructors.length === 0 ? (

                    <div className="admin-instructors__empty">
                        No instructors found.
                    </div>

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

                        {instructors.map((inst) => (

                            <tr key={inst.id}>

                                <td className="font-medium">
                                    {inst.firstName}{' '}
                                    {inst.lastName}
                                </td>

                                <td className="text-muted">
                                    {inst.email}
                                </td>

                                <td className="text-muted">
                                    {inst.phoneNumber || 'N/A'}
                                </td>

                                <td>

                                        <span
                                            className={`admin-instructors__badge ${
                                                inst.enabled
                                                    ? 'badge-active'
                                                    : 'badge-disabled'
                                            }`}
                                        >
                                            {inst.enabled
                                                ? 'Active'
                                                : 'Disabled'}
                                        </span>

                                </td>

                                <td>

                                    <div className="admin-instructors__actions">

                                        {/* Edit */}
                                        <button
                                            onClick={() =>
                                                openModal(
                                                    'edit',
                                                    inst
                                                )
                                            }
                                            title="Edit Details"
                                        >
                                            <Edit2 size={16} />
                                        </button>

                                        {/* Change Password */}
                                        <button
                                            onClick={() =>
                                                openModal(
                                                    'password',
                                                    inst
                                                )
                                            }
                                            title="Change Password"
                                        >
                                            <KeyRound size={16} />
                                        </button>

                                        {/* Enable / Disable */}
                                        <button
                                            onClick={() =>
                                                handleToggleStatus(
                                                    inst.id
                                                )
                                            }
                                            title={
                                                inst.enabled
                                                    ? 'Disable Account'
                                                    : 'Enable Account'
                                            }
                                            className={
                                                inst.enabled
                                                    ? 'text-warning'
                                                    : 'text-success'
                                            }
                                        >
                                            <Power size={16} />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    inst.id,
                                                    inst.firstName
                                                )
                                            }
                                            title="Delete Instructor"
                                            className="text-danger"
                                        >
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

            {/* =========================================
                CREATE / EDIT / PASSWORD MODAL
            ========================================= */}
            {modalConfig.isOpen && (

                <div
                    className="admin-instructors__modal-overlay"
                    onClick={closeModals}
                >

                    <div
                        className="admin-instructors__modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* Modal Header */}
                        <div className="admin-instructors__modal-header">

                            <h3>
                                {modalConfig.type === 'create'
                                    ? 'Add New Instructor'
                                    : modalConfig.type === 'edit'
                                        ? 'Edit Instructor Details'
                                        : 'Change Password'}
                            </h3>

                            <button
                                onClick={closeModals}
                                type="button"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* Modal Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="admin-instructors__form"
                        >

                            {/* Create / Edit Fields */}
                            {(modalConfig.type === 'create' ||
                                modalConfig.type === 'edit') && (

                                <>

                                    <div className="form-row">

                                        <div className="form-group">

                                            <label>
                                                First Name
                                            </label>

                                            <input
                                                type="text"
                                                name="firstName"
                                                value={
                                                    formData.firstName
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                required
                                            />

                                        </div>

                                        <div className="form-group">

                                            <label>
                                                Last Name
                                            </label>

                                            <input
                                                type="text"
                                                name="lastName"
                                                value={
                                                    formData.lastName
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                required
                                            />

                                        </div>

                                    </div>

                                    <div className="form-group">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-group">

                                        <label>
                                            Phone Number (Optional)
                                        </label>

                                        <input
                                            type="text"
                                            name="phone"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        />

                                    </div>

                                </>
                            )}

                            {/* Password */}
                            {(modalConfig.type === 'create' ||
                                modalConfig.type === 'password') && (

                                <div className="form-group">

                                    <label>
                                        {modalConfig.type === 'create'
                                            ? 'Initial Password'
                                            : 'New Password'}
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={
                                            formData.password
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                        minLength={6}
                                    />

                                </div>
                            )}

                            {/* Modal Footer */}
                            <div className="admin-instructors__modal-footer">

                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={closeModals}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-instructors__btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? 'Saving...'
                                        : modalConfig.type === 'password'
                                            ? 'Update Password'
                                            : 'Save Instructor'}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}