import React, { useEffect, useState } from "react";
import {
    getAllMessages,
    deleteMessage,
    toggleContacted
} from "../../../api/messageApi";

import {
    Search,
    Eye,
    Mail,
    Phone,
    Calendar,
    X,
    ArrowLeft,
    Trash2
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import "./AdminMessages.css";

function AdminMessages() {
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [deleteConfirmMessage, setDeleteConfirmMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);

            const response = await getAllMessages();

            setMessages(response.data);
        } catch (err) {
            console.error("Failed to load messages:", err);
            setError("Failed to load messages. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (message) => {
        setDeleteConfirmMessage(message);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmMessage) return;

        const id = deleteConfirmMessage.id;

        try {
            await deleteMessage(id);

            setMessages((prev) =>
                prev.filter((msg) => msg.id !== id)
            );

            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }

            setDeleteConfirmMessage(null);

        } catch (err) {
            console.error("Failed to delete message", err);

            setDeleteConfirmMessage(null);

            setError("Failed to delete message. Please try again.");
        }
    };

    const handleToggleContacted = async (id) => {
        try {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === id
                        ? {
                            ...msg,
                            contacted: !msg.contacted
                        }
                        : msg
                )
            );

            await toggleContacted(id);

        } catch (err) {
            console.error("Failed to update status", err);

            alert("Failed to update status.");

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === id
                        ? {
                            ...msg,
                            contacted: !msg.contacted
                        }
                        : msg
                )
            );
        }
    };

    const filteredMessages = messages.filter((msg) =>
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-messages-page">

            <header className="admin-messages-header">

                <div className="admin-messages-header-left">

                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>
                        <h1>Contact Messages</h1>

                        <p>
                            Review and manage inquiries from users.
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
                        placeholder="Search by name, email, phone, or message..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                </div>

            </header>


            <div className="admin-table-container">

                {loading ? (

                    <div className="loading-state">
                        Loading messages...
                    </div>

                ) : error ? (

                    <div className="error-state">
                        {error}
                    </div>

                ) : filteredMessages.length === 0 ? (

                    <div className="empty-state">
                        No messages found.
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
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {filteredMessages.map((msg) => (

                            <tr
                                key={msg.id}
                                style={{
                                    opacity: msg.contacted ? 0.7 : 1
                                }}
                            >

                                <td>

                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            color: "#64748b"
                                        }}
                                    >

                                        <input
                                            type="checkbox"
                                            checked={msg.contacted}
                                            onChange={() =>
                                                handleToggleContacted(msg.id)
                                            }
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                cursor: "pointer"
                                            }}
                                        />

                                        {msg.contacted
                                            ? "Contacted"
                                            : "Pending"
                                        }

                                    </label>

                                </td>


                                <td>

                                    <div className="flex-cell text-muted">

                                        <Calendar size={14} />

                                        {new Date(
                                            msg.createdAt
                                        ).toLocaleDateString()}

                                    </div>

                                </td>


                                <td>

                                    <div className="sender-info">

                                        <strong>
                                            {msg.name}
                                        </strong>

                                    </div>

                                </td>


                                <td>

                                    <a
                                        href={`mailto:${msg.email}`}
                                        className="contact-link"
                                    >
                                        <Mail size={14} />
                                        {msg.email}
                                    </a>

                                </td>


                                <td>

                                    {msg.phone ? (

                                        <a
                                            href={`tel:${msg.phone}`}
                                            className="contact-link"
                                        >
                                            <Phone size={14} />
                                            {msg.phone}
                                        </a>

                                    ) : (

                                        <span className="text-muted">
                                            Not provided
                                        </span>

                                    )}

                                </td>


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
                                                setSelectedMessage(msg)
                                            }
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>


                                        <button
                                            className="btn-delete-message"
                                            onClick={() =>
                                                handleDeleteClick(msg)
                                            }
                                            title="Delete message"
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


            {selectedMessage && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedMessage(null)
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
                                Contact Message
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                            >
                                <X size={24} />
                            </button>

                        </div>


                        <div className="modal-meta">

                            <div className="meta-item">

                                <span className="meta-label">
                                    From:
                                </span>

                                <strong>
                                    {selectedMessage.name}
                                </strong>

                            </div>


                            <div className="meta-item flex-group">

                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="contact-link"
                                >
                                    <Mail size={14} />
                                    {selectedMessage.email}
                                </a>

                                {selectedMessage.phone && (

                                    <a
                                        href={`tel:${selectedMessage.phone}`}
                                        className="contact-link"
                                    >
                                        <Phone size={14} />
                                        {selectedMessage.phone}
                                    </a>

                                )}

                            </div>


                            <div className="meta-item">

                                <span className="meta-label">
                                    Date:
                                </span>

                                <span>
                                    {new Date(
                                        selectedMessage.createdAt
                                    ).toLocaleString()}
                                </span>

                            </div>

                        </div>


                        <div className="modal-body">

                            <p>
                                {selectedMessage.message}
                            </p>

                        </div>

                    </div>

                </div>

            )}


            {deleteConfirmMessage && (

                <div
                    className="delete-modal-overlay"
                    onClick={() =>
                        setDeleteConfirmMessage(null)
                    }
                >

                    <div
                        className="delete-confirm-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <h2>
                            Delete Message
                        </h2>


                        <p className="delete-confirm-text">

                            Are you sure you want to delete the message
                            from{" "}

                            <strong>
                                {deleteConfirmMessage.name}
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
                                    setDeleteConfirmMessage(null)
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

export default AdminMessages;

