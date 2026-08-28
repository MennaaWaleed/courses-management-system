import React, { useEffect, useState } from "react";
import { enrollmentRequestApi } from "../../api/enrollmentRequestApi";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

export default function AdminEnrollmentRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await enrollmentRequestApi.getAllRequests();
            setRequests(data);
        } catch (err) {
            setError("Failed to load enrollment requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAccept = async (id) => {
        try {
            await enrollmentRequestApi.acceptRequest(id);
            setActionMessage("Request accepted successfully and student enrolled.");
            fetchRequests();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to accept request.");
        }
    };

    const handleDecline = async (id) => {
        try {
            await enrollmentRequestApi.declineRequest(id);
            setActionMessage("Request declined.");
            fetchRequests();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to decline request.");
        }
    };

    if (loading) return <div style={{ padding: "20px" }}>Loading requests...</div>;
    if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

    return (
        <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px", color: "#1e293b" }}>
                Course Batch Enrollment Requests
            </h2>

            {actionMessage && (
                <div style={{ marginBottom: "16px", padding: "10px", background: "#d1fae5", color: "#065f46", borderRadius: "6px" }}>
                    {actionMessage}
                </div>
            )}

            {requests.length === 0 ? (
                <p style={{ color: "#64748b" }}>No enrollment requests found.</p>
            ) : (
                <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: "13px", color: "#475569" }}>
                            <th style={{ padding: "12px 16px" }}>Student</th>
                            <th style={{ padding: "12px 16px" }}>Course</th>
                            <th style={{ padding: "12px 16px" }}>Batch</th>
                            <th style={{ padding: "12px 16px" }}>Status</th>
                            <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody style={{ fontSize: "14px", color: "#1e293b" }}>
                        {requests.map((req) => (
                            <tr key={req.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ fontWeight: "500" }}>{req.studentName}</div>
                                    <div style={{ fontSize: "12px", color: "#64748b" }}>{req.studentEmail}</div>
                                </td>
                                <td style={{ padding: "14px 16px" }}>{req.courseName}</td>
                                <td style={{ padding: "14px 16px" }}>{req.batchName}</td>
                                <td style={{ padding: "14px 16px" }}>
                                        <span style={{
                                            fontSize: "12px", fontWeight: "bold", padding: "4px 10px", borderRadius: "9999px",
                                            backgroundColor: req.status === "PENDING" ? "#fef3c7" : req.status === "ACCEPTED" ? "#d1fae5" : "#fee2e2",
                                            color: req.status === "PENDING" ? "#d97706" : req.status === "ACCEPTED" ? "#059669" : "#dc2626"
                                        }}>
                                            {req.status}
                                        </span>
                                </td>
                                <td style={{ padding: "14px 16px", textAlign: "center" }}>
                                    {req.status === "PENDING" ? (
                                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                            <button
                                                onClick={() => handleAccept(req.id)}
                                                style={{ display: "flex", alignItems: "center", gap: "4px", background: "#059669", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
                                            >
                                                <CheckCircle size={14} /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleDecline(req.id)}
                                                style={{ display: "flex", alignItems: "center", gap: "4px", background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
                                            >
                                                <XCircle size={14} /> Decline
                                            </button>
                                        </div>
                                    ) : (
                                        <span style={{ color: "#94a3b8", fontSize: "13px" }}>Processed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}