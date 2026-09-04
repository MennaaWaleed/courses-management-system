import React, { useEffect, useState } from "react";
import { getAllMessages } from "../../../api/messageApi";
import { Search, Eye, Mail, Phone, Calendar, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AdminMessages.css";

function AdminMessages() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // State for viewing full message
    const [selectedMessage, setSelectedMessage] = useState(null);

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

    // Filter messages based on search term (Name, Email, or Title)
    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper function to format badge colors based on message type
    const getTypeBadgeClass = (type) => {
        switch (type) {
            case 'COMPLAINT': return 'badge-danger';
            case 'TECHNICAL': return 'badge-warning';
            case 'QUESTION': return 'badge-info';
            case 'SUGGESTION': return 'badge-success';
            default: return 'badge-secondary'; // GENERAL
        }
    };

    return (
        <div className="admin-messages-page">
            <header className="admin-messages-header">
                <div className="admin-messages-header-left">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Contact Messages</h1>
                        <p>Review and manage inquiries from users.</p>
                    </div>
                </div>

                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="admin-table-container">
                {loading ? (
                    <div className="loading-state">Loading messages...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : filteredMessages.length === 0 ? (
                    <div className="empty-state">No messages found.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Sender</th>
                            <th>Type</th>
                            <th>Subject</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredMessages.map((msg) => (
                            <tr key={msg.id}>
                                <td>
                                    <div className="flex-cell text-muted">
                                        <Calendar size={14} />
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td>
                                    <div className="sender-info">
                                        <strong>{msg.name}</strong>
                                        <span className="text-muted text-sm">{msg.email}</span>
                                    </div>
                                </td>
                                <td>
                                        <span className={`badge ${getTypeBadgeClass(msg.type)}`}>
                                            {msg.type}
                                        </span>
                                </td>
                                <td>
                                    <div className="truncate-text" title={msg.title}>
                                        {msg.title}
                                    </div>
                                </td>
                                <td>
                                    <button
                                        className="btn-view"
                                        onClick={() => setSelectedMessage(msg)}
                                    >
                                        <Eye size={16} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- Read Message Modal --- */}
            {selectedMessage && (
                <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
                    <div className="message-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedMessage.title}</h2>
                            <button className="close-btn" onClick={() => setSelectedMessage(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-meta">
                            <div className="meta-item">
                                <span className="meta-label">From:</span>
                                <strong>{selectedMessage.name}</strong>
                            </div>
                            <div className="meta-item flex-group">
                                <a href={`mailto:${selectedMessage.email}`} className="contact-link"><Mail size={14} /> {selectedMessage.email}</a>
                                {selectedMessage.phone && (
                                    <a href={`tel:${selectedMessage.phone}`} className="contact-link"><Phone size={14} /> {selectedMessage.phone}</a>
                                )}
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Type:</span>
                                <span className={`badge ${getTypeBadgeClass(selectedMessage.type)}`}>{selectedMessage.type}</span>
                            </div>
                            <div className="meta-item text-muted">
                                <Calendar size={14} /> {new Date(selectedMessage.createdAt).toLocaleString()}
                            </div>
                        </div>

                        <div className="modal-body">
                            <p>{selectedMessage.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminMessages;