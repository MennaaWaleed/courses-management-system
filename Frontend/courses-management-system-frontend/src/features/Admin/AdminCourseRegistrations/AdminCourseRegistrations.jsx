import React, { useEffect, useState } from "react";

import {        getCourseRegistrations,
    getCourseRegistrationById,
    deleteRegistration,
    toggleRegistrationContacted} from "../../../api/courseRegistrationApi";

import {
    Search,
    Eye,
    Mail,
    Phone,
    Calendar,
    X,
    ArrowLeft,
    Trash2,
    BookOpen
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../AdminMessages/AdminMessages.css";


function AdminCourseRegistrations() {

    const navigate = useNavigate();

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedRegistration, setSelectedRegistration] =
        useState(null);

    const [deleteConfirmRegistration, setDeleteConfirmRegistration] =
        useState(null);


    // =====================================================
    // FETCH
    // =====================================================

    useEffect(() => {
        fetchRegistrations();
    }, []);


const fetchRegistrations = async () => {

    try {

        setLoading(true);
        setError("");

        const response =
            await getCourseRegistrations();

        setRegistrations(response);

    } catch (err) {

        console.error(
            "Failed to load registrations:",
            err
        );

        setError(
            "Failed to load registrations. Please try again later."
        );

    } finally {

        setLoading(false);
    }
};



const handleToggleContacted = async (id) => {

    const registration =
        registrations.find(
            (item) => item.id === id
        );

    if (!registration) return;


    // الاسم المتوقع من JSON
    const oldContacted =
        registration.contacted;


    try {

        // Update UI immediately
        setRegistrations((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        contacted: !item.contacted
                    }
                    : item
            )
        );


        // Update backend
        const updatedRegistration =
            await toggleRegistrationContacted(id);


        // Ensure frontend has exact backend value
        setRegistrations((prev) =>
            prev.map((item) =>
                item.id === id
                    ? updatedRegistration
                    : item
            )
        );


    } catch (err) {

        console.error(
            "Failed to update contacted status:",
            err
        );

        // Rollback
        setRegistrations((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        contacted: oldContacted
                    }
                    : item
            )
        );

        alert(
            "Failed to update registration status."
        );
    }
};

    // =====================================================
    // DELETE
    // =====================================================

    const handleDeleteClick = (registration) => {

        setDeleteConfirmRegistration(registration);
    };


    const confirmDelete = async () => {

        if (!deleteConfirmRegistration) return;

        const id =
            deleteConfirmRegistration.id;

        try {

            await deleteRegistration(id);

            setRegistrations((prev) =>
                prev.filter(
                    (registration) =>
                        registration.id !== id
                )
            );

            if (
                selectedRegistration?.id === id
            ) {
                setSelectedRegistration(null);
            }

            setDeleteConfirmRegistration(null);

        } catch (err) {

            console.error(
                "Failed to delete registration",
                err
            );

            setDeleteConfirmRegistration(null);

            setError(
                "Failed to delete registration. Please try again."
            );
        }
    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredRegistrations =
        registrations.filter((registration) => {

            const search =
                searchTerm.toLowerCase();

            return (
                registration.fullName
                    ?.toLowerCase()
                    .includes(search)

                ||

                registration.email
                    ?.toLowerCase()
                    .includes(search)

                ||

                registration.phone
                    ?.toLowerCase()
                    .includes(search)

                ||

                registration.course?.courseName
                    ?.toLowerCase()
                    .includes(search)

                ||

                registration.message
                    ?.toLowerCase()
                    .includes(search)
            );
        });


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="admin-messages-page">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="admin-messages-header">

                <div className="admin-messages-header-left">

                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={20} />
                    </button>


                    <div>

                        <h1>
                            Course Registrations
                        </h1>

                        <p>
                            Review and manage course registration requests.
                        </p>

                    </div>

                </div>


                <div className="search-bar">

                    <Search
                        size={18}
                        className="search-icon"
                    />

                    <input
                        type="text"
                        placeholder="Search by name, email, phone, or course..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                </div>

            </header>


            {/* =====================================================
                TABLE
            ===================================================== */}

            <div className="admin-table-container">

                {loading ? (

                    <div className="loading-state">
                        Loading registrations...
                    </div>

                ) : error ? (

                    <div className="error-state">
                        {error}
                    </div>

                ) : filteredRegistrations.length === 0 ? (

                    <div className="empty-state">
                        No registrations found.
                    </div>

                ) : (

                    <table className="admin-table">

                        <thead>

                        <tr>

                            <th>Status</th>

                            <th>Date</th>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Course</th>

                            <th>Actions</th>

                        </tr>

                        </thead>


                        <tbody>

                        {filteredRegistrations.map(
                            (registration) => (

                                <tr
                                    key={registration.id}
                                >

                                    {/* STATUS */}
<td>

    <label className="registration-status">

        <input
            type="checkbox"
            checked={registration.contacted}
            onChange={() =>
                handleToggleContacted(
                    registration.id
                )
            }
        />

        <span
            className={
                registration.contacted
                    ? "status-badge status-contacted"
                    : "status-badge status-pending"
            }
        >
            {registration.contacted
                ? "Contacted"
                : "Pending"
            }
        </span>

    </label>

</td>


                                    {/* DATE */}

                                    <td>

                                        <div className="flex-cell text-muted">

                                            <Calendar
                                                size={14}
                                            />

                                            {new Date(
                                                registration.createdAt
                                            ).toLocaleDateString()}

                                        </div>

                                    </td>


                                    {/* NAME */}

                                    <td>

                                        <div className="sender-info">

                                            <strong>
                                                {registration.fullName}
                                            </strong>

                                        </div>

                                    </td>


                                    {/* EMAIL */}

                                    <td>

                                        {registration.email ? (

                                            <a
                                                href={`mailto:${registration.email}`}
                                                className="contact-link"
                                            >

                                                <Mail
                                                    size={14}
                                                />

                                                {registration.email}

                                            </a>

                                        ) : (

                                            <span className="text-muted">
                                                Not provided
                                            </span>

                                        )}

                                    </td>


                                    {/* PHONE */}

                                    <td>

                                        {registration.phone ? (

                                            <a
                                                href={`tel:${registration.phone}`}
                                                className="contact-link"
                                            >

                                                <Phone
                                                    size={14}
                                                />

                                                {registration.phone}

                                            </a>

                                        ) : (

                                            <span className="text-muted">
                                                Not provided
                                            </span>

                                        )}

                                    </td>


                                    {/* COURSE */}

                                    <td>

                                        <div className="flex-cell">

                                            <BookOpen
                                                size={14}
                                            />

                                            {registration.course?.courseName ||
                                                "Unknown Course"}

                                        </div>

                                    </td>


                                    {/* ACTIONS */}

                                    <td>

                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "8px"
                                            }}
                                        >

                                            <button
                                                className="btn-view"
                                                onClick={() =>
                                                    setSelectedRegistration(
                                                        registration
                                                    )
                                                }
                                            >

                                                <Eye
                                                    size={16}
                                                />

                                                View

                                            </button>


                                            <button
                                                className="btn-delete-message"
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        registration
                                                    )
                                                }
                                                title="Delete registration"
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )
                        )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* =====================================================
                VIEW MODAL
            ===================================================== */}

            {selectedRegistration && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedRegistration(null)
                    }
                >

                    <div
                        className="message-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h2>
                                Course Registration
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setSelectedRegistration(null)
                                }
                            >

                                <X size={24} />

                            </button>

                        </div>


                        <div className="modal-meta">


                            <div className="meta-item">

                                <span className="meta-label">
                                    Name:
                                </span>

                                <strong>
                                    {selectedRegistration.fullName}
                                </strong>

                            </div>


                            <div className="meta-item">

                                <span className="meta-label">
                                    Course:
                                </span>

                                <strong>
                                    {selectedRegistration.course?.courseName ||
                                        "Unknown Course"}
                                </strong>

                            </div>


                            <div className="meta-item flex-group">

                                {selectedRegistration.email && (

                                    <a
                                        href={`mailto:${selectedRegistration.email}`}
                                        className="contact-link"
                                    >

                                        <Mail size={14} />

                                        {selectedRegistration.email}

                                    </a>

                                )}


                                {selectedRegistration.phone && (

                                    <a
                                        href={`tel:${selectedRegistration.phone}`}
                                        className="contact-link"
                                    >

                                        <Phone size={14} />

                                        {selectedRegistration.phone}

                                    </a>

                                )}

                            </div>


                            <div className="meta-item">

                                <span className="meta-label">
                                    Status:
                                </span>

                                <span
                                    className={`badge ${
                                        selectedRegistration.status === "NEW"
                                            ? "badge-warning"
                                            : "badge-success"
                                    }`}
                                >
                                    {selectedRegistration.status}
                                </span>

                            </div>


                            <div className="meta-item">

                                <span className="meta-label">
                                    Date:
                                </span>

                                <span>

                                    {new Date(
                                        selectedRegistration.createdAt
                                    ).toLocaleString()}

                                </span>

                            </div>

                        </div>


                        <div className="modal-body">

                            <strong>
                                Message
                            </strong>

                            <p>

                                {selectedRegistration.message ||
                                    "No message provided."}

                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                DELETE MODAL
            ===================================================== */}

            {deleteConfirmRegistration && (

                <div
                    className="delete-modal-overlay"
                    onClick={() =>
                        setDeleteConfirmRegistration(null)
                    }
                >

                    <div
                        className="delete-confirm-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <h2>
                            Delete Registration
                        </h2>


                        <p className="delete-confirm-text">

                            Are you sure you want to delete the
                            registration from{" "}

                            <strong>
                                {deleteConfirmRegistration.fullName}
                            </strong>

                            ?

                        </p>


                        <p className="delete-warning">

                            This action cannot be undone.

                        </p>


                        <div className="delete-modal-actions">

                            <button
                                className="delete-cancel-btn"
                                onClick={() =>
                                    setDeleteConfirmRegistration(null)
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="delete-confirm-btn"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}


export default AdminCourseRegistrations;