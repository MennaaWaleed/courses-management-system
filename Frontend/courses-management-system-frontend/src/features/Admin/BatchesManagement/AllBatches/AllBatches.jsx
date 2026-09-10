import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { softDeleteBatch, regenerateBatchCode } from "../../../../api/batchApi.js";
import { enrollmentRequestApi } from "../../../../api/enrollmentRequestApi";
import { BASE_URL } from "../../../../api/axios.js";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

import BatchStudents from "../BatchStudents/BatchStudents.jsx";
import EditBatch from "../EditBatch/EditBatch.jsx"
import AssignStudent from "../AssignStudent/AssignStudent.jsx";

import './AllBatches.css';
import '../CourseBatches/CourseBatches.css';

export default function AllBatches() {
    const navigate = useNavigate();

    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [attendanceFilter, setAttendanceFilter] = useState('ALL');

    const [batchToDelete, setBatchToDelete] = useState(null);
    const [selectedBatchForModal, setSelectedBatchForModal] = useState(null);
    const [batchToAssignStudent, setBatchToAssignStudent] = useState(null);
    const [batchToEdit, setBatchToEdit] = useState(null);

    const [batchToViewRequests, setBatchToViewRequests] = useState(null);
    const [batchRequests, setBatchRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [pendingBatchesMap, setPendingBatchesMap] = useState({});

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/api/courses/batches/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch batches: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            setBatches(data);

            try {
                const allRequests = await enrollmentRequestApi.getAllRequests();
                const map = {};
                allRequests.forEach(req => {
                    if (req.status === "PENDING") {
                        map[req.batchId] = true;
                    }
                });
                setPendingBatchesMap(map);
            } catch (err) {
                console.error("Failed to check pending notifications", err);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const handleRegenerateCode = async (batchId) => {
        try {
            await regenerateBatchCode(batchId);
            fetchBatches();
        } catch (err) {
            alert("Failed to regenerate batch code.");
        }
    };

    const confirmDeleteBatch = async () => {
        if (!batchToDelete) return;
        try {
            await softDeleteBatch(batchToDelete.id);
            setBatches((prevBatches) => prevBatches.filter((b) => b.id !== batchToDelete.id));
            setBatchToDelete(null);
        } catch (err) {
            console.error(err);
            alert("Failed to delete batch.");
        }
    };

    const handleOpenRequestsModal = async (batch) => {
        setBatchToViewRequests(batch);
        try {
            setRequestsLoading(true);
            const allRequests = await enrollmentRequestApi.getAllRequests();
            const filtered = allRequests.filter(req => req.batchId === batch.id);
            setBatchRequests(filtered);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setRequestsLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await enrollmentRequestApi.acceptRequest(requestId);
            setBatchRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "ACCEPTED" } : r));
            fetchBatches();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to accept request.");
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            await enrollmentRequestApi.declineRequest(requestId);
            setBatchRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "DECLINED" } : r));
            fetchBatches();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to decline request.");
        }
    };

    const filteredBatches = batches.filter((batch) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            (batch.batchName && batch.batchName.toLowerCase().includes(query)) ||
            (batch.courseName && batch.courseName.toLowerCase().includes(query)) ||
            (batch.instructorName && batch.instructorName.toLowerCase().includes(query)) ||
            (batch.batchCode && batch.batchCode.toLowerCase().includes(query));

        const matchesStatus = statusFilter === 'ALL' || batch.status === statusFilter;
        const matchesAttendance = attendanceFilter === 'ALL' || batch.attendanceType === attendanceFilter;

        return matchesSearch && matchesStatus && matchesAttendance;
    });

    const getStatusClass = (status) => {
        const classes = {
            OPEN: 'badge-open',
            ACTIVE: 'badge-active',
            CANCELLED: 'badge-cancelled',
        };
        return classes[status] || 'badge-default';
    };

    if (loading) return <div className="ab-message">Loading batches...</div>;
    if (error) return <div className="ab-message ab-error">Error: {error}</div>;

    return (
        <div className="ab-container">
            <div className="ab-header">
                <div>
                    <h1 className="ab-title">All Batches Management</h1>
                    <p className="ab-subtitle">Manage, search, and filter all course batches across categories.</p>
                </div>
            </div>

            <div className="ab-filters">
                <div className="ab-filter-group">
                    <label>SEARCH</label>
                    <input
                        type="text"
                        placeholder="Search batch, course, instructor, code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="ab-input"
                    />
                </div>

                <div className="ab-filter-group">
                    <label>STATUS</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="ab-select"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="ACTIVE">Active</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                <div className="ab-filter-group">
                    <label>ATTENDANCE TYPE</label>
                    <select
                        value={attendanceFilter}
                        onChange={(e) => setAttendanceFilter(e.target.value)}
                        className="ab-select"
                    >
                        <option value="ALL">All Attendance Types</option>
                        <option value="ONLINE">Online</option>
                        <option value="OFFLINE">Offline</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>
                </div>
            </div>

            <div className="ab-table-wrapper">
                <div className="ab-table-scroll">
                    <table className="ab-table">
                        <thead>
                        <tr>
                            <th>Batch Name / Code</th>
                            <th>Course Name</th>
                            <th>Instructor</th>
                            <th>Status</th>
                            <th>Capacity</th>
                            <th>Dates</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredBatches.length > 0 ? (
                            filteredBatches.map((batch) => {
                                const hasPending = pendingBatchesMap[batch.id];

                                return (
                                    <tr key={batch.id}>
                                        <td className="ab-font-medium">
                                            {batch.batchName}
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                                                <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", color: "#64748b" }}>
                                                    {batch.batchCode ? `Code: ${batch.batchCode}` : 'No Code'}
                                                </code>
                                                <button
                                                    title="Regenerate Code"
                                                    onClick={() => handleRegenerateCode(batch.id)}
                                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", padding: "0", display: "flex" }}
                                                >
                                                    <RefreshCw size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td>{batch.courseName}</td>
                                        <td>{batch.instructorName}</td>
                                        <td>
                                            <div style={{display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start'}}>
                                                    <span className={`ab-badge ${getStatusClass(batch.status)}`}>
                                                        {batch.status}
                                                    </span>
                                                <span className="ab-type-badge">
                                                        {batch.attendanceType}
                                                    </span>
                                            </div>
                                        </td>
                                        <td>{batch.capacity} seats</td>
                                        <td className="ab-dates">
                                            <div>Start: {new Date(batch.startDate).toLocaleDateString()}</div>
                                            <div>End: {new Date(batch.endDate).toLocaleDateString()}</div>
                                        </td>

                                        {/* ACTIONS COLUMN */}
                                        <td>
                                            <div className="batch-table-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                <div style={{ position: "relative", display: "inline-block" }}>
                                                    <button className="requests-batch-btn" onClick={() => handleOpenRequestsModal(batch)}>
                                                        Requests
                                                    </button>
                                                    {hasPending && (
                                                        <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "10px", height: "10px", backgroundColor: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }} />
                                                    )}
                                                </div>

                                                <button className="assign-student-btn" onClick={() => setBatchToAssignStudent(batch)}>
                                                    Assign Student
                                                </button>

                                                <button className="see-students-btn" onClick={() => setSelectedBatchForModal(batch)}>
                                                    See Students
                                                </button>

                                                <button
                                                    className="manage-lectures-btn"
                                                    onClick={() => navigate(`/admin/batches/${batch.id}/lectures`)}
                                                >
                                                    Lectures
                                                </button>

                                                <button className="edit-batch-btn" onClick={() => setBatchToEdit(batch)}>
                                                    Edit
                                                </button>

                                                <button className="delete-batch-btn" onClick={() => setBatchToDelete(batch)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="ab-empty-state">
                                    No batches found matching your search criteria.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>


            {selectedBatchForModal && (
                <BatchStudents
                    batch={selectedBatchForModal}
                    courseId={selectedBatchForModal.courseId}
                    onClose={() => setSelectedBatchForModal(null)}
                />
            )}

            {batchToDelete && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-content">
                        <h3>Delete Batch</h3>
                        <p>Are you sure you want to delete the batch <strong>{batchToDelete.batchName}</strong>?<br/>This action cannot be undone.</p>
                        <div className="confirm-modal-actions">
                            <button className="confirm-cancel-btn" onClick={() => setBatchToDelete(null)}>Cancel</button>
                            <button className="confirm-delete-btn" onClick={confirmDeleteBatch}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {batchToAssignStudent && (
                <AssignStudent
                    batch={batchToAssignStudent}
                    onClose={() => setBatchToAssignStudent(null)}
                    onAssigned={() => fetchBatches()}
                />
            )}

            {batchToViewRequests && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-content" style={{ maxWidth: "700px", width: "90%" }}>
                        <h3>Requests for: {batchToViewRequests.batchName}</h3>
                        {requestsLoading ? (
                            <p style={{ padding: "20px", textAlign: "center" }}>Loading requests...</p>
                        ) : batchRequests.length === 0 ? (
                            <p style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>No requests found for this batch.</p>
                        ) : (
                            <div style={{ maxHeight: "350px", overflowY: "auto", margin: "15px 0", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                                    <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                        <th style={{ padding: "10px" }}>Student</th>
                                        <th style={{ padding: "10px" }}>Status</th>
                                        <th style={{ padding: "10px", textAlign: "center" }}>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {batchRequests.map((req) => (
                                        <tr key={req.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "10px" }}>
                                                <div style={{ fontWeight: "500" }}>{req.studentName}</div>
                                                <div style={{ fontSize: "12px", color: "#64748b" }}>{req.studentEmail}</div>
                                            </td>
                                            <td style={{ padding: "10px" }}>
                                                    <span style={{ fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "9999px", backgroundColor: req.status === "PENDING" ? "#fef3c7" : req.status === "ACCEPTED" ? "#d1fae5" : "#fee2e2", color: req.status === "PENDING" ? "#d97706" : req.status === "ACCEPTED" ? "#059669" : "#dc2626" }}>
                                                        {req.status}
                                                    </span>
                                            </td>
                                            <td style={{ padding: "10px", textAlign: "center" }}>
                                                {req.status === "PENDING" ? (
                                                    <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                                                        <button onClick={() => handleAcceptRequest(req.id)} style={{ background: "#059669", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
                                                            <CheckCircle size={12} /> Accept
                                                        </button>
                                                        <button onClick={() => handleDeclineRequest(req.id)} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
                                                            <XCircle size={12} /> Decline
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: "#94a3b8", fontSize: "12px" }}>Processed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="confirm-modal-actions">
                            <button className="confirm-cancel-btn" onClick={() => setBatchToViewRequests(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {batchToEdit && (
                <EditBatch
                    batchId={batchToEdit.id}
                    courseId={batchToEdit.courseId}
                    onClose={() => setBatchToEdit(null)}
                    onBatchUpdated={(updatedBatch) => {
                        setBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b));
                        fetchBatches();
                    }}
                />
            )}
        </div>
    );
}