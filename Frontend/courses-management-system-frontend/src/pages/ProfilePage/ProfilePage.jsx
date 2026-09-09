import React, { useEffect, useState } from "react";
import { fetchUserProfile, changeProfilePassword } from "../../api/profileApi";
import { enrollmentRequestApi } from "../../api/enrollmentRequestApi";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import {
    Mail,
    Phone,
    BookOpen,
    Heart,
    Award,
    X,
    Check,
    Download,
    Layers,
    Clock,
    Send,
    KeyRound
} from "lucide-react";

export default function ProfilePage() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [pdfTitle, setPdfTitle] = useState("");
    const [pdfLoading, setPdfLoading] = useState(false);

    const [batchCode, setBatchCode] = useState("");
    const [joinLoading, setJoinLoading] = useState(false);
    const [joinError, setJoinError] = useState("");
    const [joinSuccess, setJoinSuccess] = useState("");

    const [pwdModalOpen, setPwdModalOpen] = useState(false);
    const [pwdData, setPwdData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [pwdStatus, setPwdStatus] = useState({ loading: false, error: "", success: "" });

    // Live Password Validation Rules
    const pwdRules = [
        { id: 'length', label: "At least 8 characters", met: pwdData.newPassword.length >= 8 },
        { id: 'uppercase', label: "At least one uppercase letter (A-Z)", met: /[A-Z]/.test(pwdData.newPassword) },
        { id: 'lowercase', label: "At least one lowercase letter (a-z)", met: /[a-z]/.test(pwdData.newPassword) },
        { id: 'number', label: "At least one number (0-9)", met: /\d/.test(pwdData.newPassword) },
        { id: 'special', label: "At least one special character", met: /[^a-zA-Z0-9]/.test(pwdData.newPassword) }
    ];

    const isNewPasswordValid = pwdRules.every(r => r.met);
    const isFormReadyToSubmit = pwdData.currentPassword && isNewPasswordValid && pwdData.confirmPassword;

    useEffect(() => {
        const loadProfileAndRequests = async () => {
            try {
                setLoading(true);

                const data = await fetchUserProfile();
                setProfile(data);

                const userRole = data?.role?.toUpperCase();

                if (userRole !== "ADMIN" && userRole !== "INSTRUCTOR") {
                    try {
                        const reqs = await enrollmentRequestApi.getMyRequests();
                        setMyRequests(reqs);
                    } catch (reqErr) {
                        console.error(
                            "Failed to load enrollment requests",
                            reqErr
                        );
                    }
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load profile details."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfileAndRequests();
    }, []);

    const handleJoinBatch = async (e) => {
        e.preventDefault();

        if (!batchCode.trim()) {
            setJoinError("Please enter a valid batch code.");
            setJoinSuccess("");
            return;
        }

        try {
            setJoinLoading(true);
            setJoinError("");
            setJoinSuccess("");

            await enrollmentRequestApi.createRequest(
                null,
                batchCode.trim()
            );

            setJoinSuccess(
                "Request sent successfully! It is now pending approval."
            );

            setBatchCode("");

            const updatedReqs =
                await enrollmentRequestApi.getMyRequests();

            setMyRequests(updatedReqs);
        } catch (err) {
            setJoinError(
                err.response?.data?.message ||
                err.response?.data ||
                "Invalid or expired batch code."
            );
        } finally {
            setJoinLoading(false);
        }
    };

    const handleOpenCertificate = async (url, courseName) => {
        try {
            setPdfLoading(true);
            setPdfTitle(courseName);
            setModalOpen(true);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Could not load certificate PDF");
            }

            const blob = await response.blob();

            const localUrl =
                window.URL.createObjectURL(blob);

            setPdfBlobUrl(localUrl);
        } catch (err) {
            console.error(err);
            alert("Error loading PDF preview.");
            setModalOpen(false);
        } finally {
            setPdfLoading(false);
        }
    };

    const handleCloseModal = () => {
        if (pdfBlobUrl) {
            window.URL.revokeObjectURL(pdfBlobUrl);
            setPdfBlobUrl(null);
        }

        setModalOpen(false);
    };

    const handleDownload = () => {
        if (!pdfBlobUrl) return;

        const link = document.createElement("a");

        link.href = pdfBlobUrl;

        link.download =
            `${pdfTitle.replace(/\s+/g, "_")}_Certificate.pdf`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };


    const handleViewWishlistCourse = (item) => {
        const courseId = item?.courseId;

        if (!courseId) {
            console.error(
                "Wishlist item does not contain courseId:",
                item
            );

            alert(
                "Cannot open course details. The course ID is missing."
            );

            return;
        }

        navigate(`/courses/${courseId}`);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (pwdData.newPassword !== pwdData.confirmPassword) {
            setPwdStatus({ loading: false, success: "", error: "New passwords do not match." });
            return;
        }

        try {
            setPwdStatus({ loading: true, error: "", success: "" });
            await changeProfilePassword({
                currentPassword: pwdData.currentPassword,
                newPassword: pwdData.newPassword
            });
            setPwdStatus({ loading: false, error: "", success: "Password changed successfully!" });

            setTimeout(() => {
                setPwdModalOpen(false);
                setPwdData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setPwdStatus({ loading: false, error: "", success: "" });
            }, 2000);
        } catch (err) {
            setPwdStatus({
                loading: false,
                success: "",
                error: err.response?.data?.message || err.response?.data || "Failed to change password."
            });
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "var(--profile-text-muted, #64748b)"
                }}
            >
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "var(--profile-error-text, #ef4444)"
                }}
            >
                {error}
            </div>
        );
    }

    const role = profile?.role?.toUpperCase();

    return (
        <div
            className="profile-page"
            style={{
                maxWidth: "800px",
                margin: "40px auto",
                padding: "0 20px",
                display: "flex",
                flexDirection: "column",
                gap: "24px"
            }}
        >

            {/* Profile Header */}
            <div
                style={{
                    background: "var(--profile-card-bg, #fff)",
                    padding: "24px",
                    borderRadius: "12px",
                    border: "1px solid var(--profile-border, #e2e8f0)",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                    transition: "background-color 0.3s ease, border-color 0.3s ease"
                }}
            >
                <div
                    style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background:
                            role === "ADMIN"
                                ? "var(--profile-admin-avatar, #7c3aed)"
                                : role === "INSTRUCTOR"
                                    ? "var(--brand-secondary, #0891b2)"
                                    : "var(--brand-primary, #2563eb)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        fontWeight: "bold",
                        transition: "background-color 0.3s ease"
                    }}
                >
                    {profile?.firstName?.[0]}
                    {profile?.lastName?.[0]}
                </div>

                <div style={{ flex: 1, minWidth: "200px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <h1
                            style={{
                                fontSize: "22px",
                                fontWeight: "bold",
                                color: "var(--profile-text-main, #1e293b)",
                                margin: 0,
                                transition: "color 0.3s ease"
                            }}
                        >
                            {profile?.firstName} {profile?.lastName}
                        </h1>

                        <span
                            style={{
                                fontSize: "12px",
                                fontWeight: "600",
                                padding: "3px 8px",
                                borderRadius: "9999px",
                                background: "var(--profile-tag-bg, #f1f5f9)",
                                color: "var(--profile-tag-text, #475569)",
                                transition: "background-color 0.3s ease, color 0.3s ease"
                            }}
                        >
                            {role}
                        </span>
                    </div>

                    <p
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--profile-text-muted, #64748b)",
                            margin: "6px 0 0",
                            fontSize: "14px",
                            transition: "color 0.3s ease"
                        }}
                    >
                        <Mail size={16} />
                        {profile?.email}
                    </p>

                    <p
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--profile-text-muted, #64748b)",
                            margin: "4px 0 0",
                            fontSize: "14px",
                            transition: "color 0.3s ease"
                        }}
                    >
                        <Phone size={16} />
                        {profile?.phone || "N/A"}
                    </p>
                </div>

                {/* Change Password Button */}
                <button
                    onClick={() => setPwdModalOpen(true)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "var(--profile-item-bg, #f8fafc)",
                        color: "var(--profile-text-main, #0f172a)",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: "1px solid var(--profile-input-border, #cbd5e1)",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                >
                    <KeyRound size={16} />
                    Change Password
                </button>
            </div>


            {/* Instructor Specific Section */}
            {role === "INSTRUCTOR" && (
                <div
                    style={{
                        background: "var(--profile-card-bg, #fff)",
                        padding: "24px",
                        borderRadius: "12px",
                        border: "1px solid var(--profile-border, #e2e8f0)",
                        transition: "background-color 0.3s ease, border-color 0.3s ease"
                    }}
                >
                    <h2
                        style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "var(--profile-text-main, #1e293b)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "16px",
                            transition: "color 0.3s ease"
                        }}
                    >
                        <Layers size={20} color="var(--brand-secondary, #0891b2)" />
                        Assigned Batches
                    </h2>

                    {!profile?.assignedBatches ||
                    profile.assignedBatches.length === 0 ? (
                        <p
                            style={{
                                color: "var(--profile-text-muted, #94a3b8)",
                                fontSize: "14px",
                                transition: "color 0.3s ease"
                            }}
                        >
                            No course batches currently assigned.
                        </p>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px"
                            }}
                        >
                            {profile.assignedBatches.map(
                                (batch, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: "14px",
                                            background: "var(--profile-item-bg, #f8fafc)",
                                            borderRadius: "8px",
                                            border: "1px solid var(--profile-item-border, #f1f5f9)",
                                            transition: "background-color 0.3s ease, border-color 0.3s ease"
                                        }}
                                    >
                                        <h3
                                            style={{
                                                margin: 0,
                                                fontSize: "15px",
                                                fontWeight: "600",
                                                color: "var(--profile-text-main, #1e293b)",
                                                transition: "color 0.3s ease"
                                            }}
                                        >
                                            {batch.courseName}
                                        </h3>

                                        <p
                                            style={{
                                                margin: "4px 0 0",
                                                fontSize: "13px",
                                                color: "var(--profile-text-muted, #64748b)",
                                                transition: "color 0.3s ease"
                                            }}
                                        >
                                            Batch: {batch.batchName}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}


            {/* Student Specific Sections */}
            {role !== "ADMIN" && role !== "INSTRUCTOR" && (
                <>
                    {/* Enrollment Requests Section */}
                    <div
                        style={{
                            background: "var(--profile-card-bg, #fff)",
                            padding: "24px",
                            borderRadius: "12px",
                            border: "1px solid var(--profile-border, #e2e8f0)",
                            transition: "background-color 0.3s ease, border-color 0.3s ease"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "16px"
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "var(--profile-text-main, #1e293b)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    margin: 0,
                                    transition: "color 0.3s ease"
                                }}
                            >
                                <Clock
                                    size={20}
                                    color="var(--profile-warning-icon, #f59e0b)"
                                />
                                Enrollment Requests
                            </h2>
                        </div>

                        <form
                            onSubmit={handleJoinBatch}
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginBottom: "16px",
                                flexWrap: "wrap"
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Enter Batch Code (e.g., SPR-8F42K)"
                                value={batchCode}
                                onChange={(e) =>
                                    setBatchCode(e.target.value)
                                }
                                disabled={joinLoading}
                                style={{
                                    flex: 1,
                                    minWidth: "200px",
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--profile-input-border, #cbd5e1)",
                                    outline: "none",
                                    fontSize: "14px",
                                    textTransform: "uppercase",
                                    background: "var(--profile-input-bg, #f8fafc)",
                                    color: "var(--profile-text-main, #1e293b)",
                                    transition: "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease"
                                }}
                            />

                            <button
                                type="submit"
                                disabled={
                                    joinLoading ||
                                    !batchCode.trim()
                                }
                                style={{
                                    background: "var(--profile-join-btn-bg, #0f172a)",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    cursor:
                                        joinLoading ||
                                        !batchCode.trim()
                                            ? "not-allowed"
                                            : "pointer",
                                    opacity:
                                        joinLoading ||
                                        !batchCode.trim()
                                            ? 0.7
                                            : 1,
                                    transition: "background-color 0.3s ease"
                                }}
                            >
                                <Send size={16} />

                                {joinLoading
                                    ? "Checking..."
                                    : "Join Batch"}
                            </button>
                        </form>

                        {joinError && (
                            <div
                                style={{
                                    color: "var(--profile-error-text, #ef4444)",
                                    fontSize: "13.5px",
                                    marginBottom: "20px",
                                    background: "var(--profile-error-bg, #fef2f2)",
                                    padding: "10px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--profile-error-border, #fecaca)",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <strong>Error:</strong>{" "}
                                {joinError}
                            </div>
                        )}

                        {joinSuccess && (
                            <div
                                style={{
                                    color: "var(--profile-success-text, #059669)",
                                    fontSize: "13.5px",
                                    marginBottom: "20px",
                                    background: "var(--profile-success-bg, #d1fae5)",
                                    padding: "10px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--profile-success-border, #a7f3d0)",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {joinSuccess}
                            </div>
                        )}

                        {!myRequests ||
                        myRequests.length === 0 ? (
                            <p
                                style={{
                                    color: "var(--profile-text-muted, #94a3b8)",
                                    fontSize: "14px",
                                    borderTop: "1px solid var(--profile-border, #e2e8f0)",
                                    paddingTop: "16px",
                                    transition: "color 0.3s ease, border-color 0.3s ease"
                                }}
                            >
                                No pending or recent
                                enrollment requests.
                            </p>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                    borderTop: "1px solid var(--profile-border, #e2e8f0)",
                                    paddingTop: "16px",
                                    transition: "border-color 0.3s ease"
                                }}
                            >
                                {myRequests.map(
                                    (req, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "14px",
                                                background: "var(--profile-item-bg, #f8fafc)",
                                                borderRadius: "8px",
                                                border: "1px solid var(--profile-item-border, #f1f5f9)",
                                                transition: "background-color 0.3s ease, border-color 0.3s ease"
                                            }}
                                        >
                                            <div>
                                                <h3
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        color: "var(--profile-text-main, #1e293b)",
                                                        transition: "color 0.3s ease"
                                                    }}
                                                >
                                                    {req.courseName}
                                                </h3>

                                                <p
                                                    style={{
                                                        margin: "4px 0 0",
                                                        fontSize: "13px",
                                                        color: "var(--profile-text-muted, #64748b)",
                                                        transition: "color 0.3s ease"
                                                    }}
                                                >
                                                    Batch: {req.batchName}
                                                </p>
                                            </div>

                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px",
                                                    transition: "background-color 0.3s ease, color 0.3s ease",
                                                    backgroundColor: req.status === "PENDING"
                                                        ? "var(--profile-pending-bg, #fef3c7)"
                                                        : req.status === "ACCEPTED"
                                                            ? "var(--profile-success-bg, #d1fae5)"
                                                            : "var(--profile-error-bg, #fee2e2)",
                                                    color: req.status === "PENDING"
                                                        ? "var(--profile-pending-text, #d97706)"
                                                        : req.status === "ACCEPTED"
                                                            ? "var(--profile-success-text, #059669)"
                                                            : "var(--profile-error-text, #dc2626)"
                                                }}
                                            >
                                                {req.status}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Enrolled Courses Section */}
                    <div
                        style={{
                            background: "var(--profile-card-bg, #fff)",
                            padding: "24px",
                            borderRadius: "12px",
                            border: "1px solid var(--profile-border, #e2e8f0)",
                            transition: "background-color 0.3s ease, border-color 0.3s ease"
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "var(--profile-text-main, #1e293b)",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "16px",
                                transition: "color 0.3s ease"
                            }}
                        >
                            <BookOpen
                                size={20}
                                color="var(--brand-primary, #2563eb)"
                            />
                            Enrolled Courses
                        </h2>

                        {!profile?.enrolledCourses ||
                        profile.enrolledCourses.length === 0 ? (
                            <p
                                style={{
                                    color: "var(--profile-text-muted, #94a3b8)",
                                    fontSize: "14px",
                                    transition: "color 0.3s ease"
                                }}
                            >
                                No enrolled courses yet.
                            </p>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px"
                                }}
                            >
                                {profile.enrolledCourses.map(
                                    (course, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "14px",
                                                background: "var(--profile-item-bg, #f8fafc)",
                                                borderRadius: "8px",
                                                border: "1px solid var(--profile-item-border, #f1f5f9)",
                                                flexWrap: "wrap",
                                                gap: "10px",
                                                transition: "background-color 0.3s ease, border-color 0.3s ease"
                                            }}
                                        >
                                            <div>
                                                <h3
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        color: "var(--profile-text-main, #1e293b)",
                                                        transition: "color 0.3s ease"
                                                    }}
                                                >
                                                    {course.courseName}
                                                </h3>

                                                <p
                                                    style={{
                                                        margin: "4px 0 0",
                                                        fontSize: "13px",
                                                        color: "var(--profile-text-muted, #64748b)",
                                                        transition: "color 0.3s ease"
                                                    }}
                                                >
                                                    {course.batchName}
                                                </p>
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    flexWrap: "wrap"
                                                }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        const targetBatchId =
                                                            course.batchId ||
                                                            course.courseBatchId ||
                                                            course.id;

                                                        if (targetBatchId) {
                                                            navigate(
                                                                `/student/batches/${targetBatchId}/lectures`
                                                            );
                                                        } else {
                                                            alert(
                                                                "Cannot open course. The backend did not send a batch ID."
                                                            );
                                                        }
                                                    }}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        background: "var(--profile-tag-bg, #f1f5f9)",
                                                        color: "var(--profile-text-main, #1e293b)",
                                                        padding: "8px 16px",
                                                        borderRadius: "8px",
                                                        border: "1px solid var(--profile-input-border, #cbd5e1)",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                >
                                                    <BookOpen size={16} />
                                                    View Course
                                                </button>

                                                {course.certificateUrl && (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenCertificate(
                                                                course.certificateUrl,
                                                                course.courseName
                                                            )
                                                        }
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "6px",
                                                            background: "var(--brand-primary, #2563eb)",
                                                            color: "#fff",
                                                            padding: "8px 16px",
                                                            borderRadius: "8px",
                                                            border: "none",
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            cursor: "pointer",
                                                            transition: "all 0.2s ease"
                                                        }}
                                                    >
                                                        <Award size={16} />
                                                        Certificate
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Wishlist Section */}
                    <div
                        style={{
                            background: "var(--profile-card-bg, #fff)",
                            padding: "24px",
                            borderRadius: "12px",
                            border: "1px solid var(--profile-border, #e2e8f0)",
                            transition: "background-color 0.3s ease, border-color 0.3s ease"
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "var(--profile-text-main, #1e293b)",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "16px",
                                transition: "color 0.3s ease"
                            }}
                        >
                            <Heart
                                size={20}
                                color="var(--profile-error-text, #ef4444)"
                            />
                            Wishlist
                        </h2>

                        {!profile?.wishlist ||
                        profile.wishlist.length === 0 ? (
                            <p
                                style={{
                                    color: "var(--profile-text-muted, #94a3b8)",
                                    fontSize: "14px",
                                    transition: "color 0.3s ease"
                                }}
                            >
                                Your wishlist is empty.
                            </p>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px"
                                }}
                            >
                                {profile.wishlist.map(
                                    (item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "14px",
                                                background: "var(--profile-item-bg, #f8fafc)",
                                                borderRadius: "8px",
                                                border: "1px solid var(--profile-item-border, #f1f5f9)",
                                                flexWrap: "wrap",
                                                gap: "10px",
                                                transition: "background-color 0.3s ease, border-color 0.3s ease"
                                            }}
                                        >
                                            <div>
                                                <span
                                                    style={{
                                                        fontSize: "15px",
                                                        fontWeight: "500",
                                                        color: "var(--profile-text-main, #1e293b)",
                                                        transition: "color 0.3s ease"
                                                    }}
                                                >
                                                    {item.courseName}
                                                </span>

                                                <p
                                                    style={{
                                                        margin: "4px 0 0",
                                                        fontSize: "15px",
                                                        fontWeight: "bold",
                                                        color: "var(--profile-success-text, #059669)",
                                                        transition: "color 0.3s ease"
                                                    }}
                                                >
                                                    {item.price?.toLocaleString()} EGP
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleViewWishlistCourse(item)
                                                }
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    background: "var(--profile-tag-bg, #f1f5f9)",
                                                    color: "var(--profile-text-main, #1e293b)",
                                                    padding: "8px 16px",
                                                    borderRadius: "8px",
                                                    border: "1px solid var(--profile-input-border, #cbd5e1)",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <BookOpen size={16} />
                                                View Course
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Certificate View Modal */}
            {modalOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: "16px"
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        style={{
                            background: "var(--profile-card-bg, #fff)",
                            width: "100%",
                            maxWidth: "900px",
                            height: "90vh",
                            borderRadius: "14px",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                            transition: "background-color 0.3s ease"
                        }}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "16px 20px",
                                borderBottom: "1px solid var(--profile-border, #e2e8f0)",
                                background: "var(--profile-item-bg, #f8fafc)",
                                transition: "background-color 0.3s ease, border-color 0.3s ease"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <Award
                                    size={20}
                                    color="var(--brand-primary, #2563eb)"
                                />

                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "var(--profile-text-main, #1e293b)",
                                        transition: "color 0.3s ease"
                                    }}
                                >
                                    {pdfTitle} Certificate
                                </h3>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                }}
                            >
                                {pdfBlobUrl && (
                                    <button
                                        onClick={handleDownload}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            background: "var(--profile-success-text, #059669)",
                                            color: "#fff",
                                            padding: "7px 14px",
                                            borderRadius: "6px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            fontWeight: "500",
                                            transition: "background-color 0.3s ease"
                                        }}
                                    >
                                        <Download size={15} />
                                        Download PDF
                                    </button>
                                )}

                                <button
                                    onClick={
                                        handleCloseModal
                                    }
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "var(--profile-text-muted, #64748b)",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "4px",
                                        transition: "color 0.3s ease"
                                    }}
                                >
                                    <X size={22} />
                                </button>
                            </div>
                        </div>

                        <div
                            style={{
                                flex: 1,
                                width: "100%",
                                height: "100%",
                                background: "var(--profile-pdf-bg, #525659)",
                                transition: "background-color 0.3s ease"
                            }}
                        >
                            {pdfLoading ? (
                                <div
                                    style={{
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%"
                                    }}
                                >
                                    Rendering Certificate...
                                </div>
                            ) : pdfBlobUrl ? (
                                <iframe
                                    src={pdfBlobUrl}
                                    title="Certificate PDF"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        border: "none"
                                    }}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {pwdModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: "16px"
                    }}
                >
                    <div
                        style={{
                            background: "var(--profile-card-bg, #fff)",
                            width: "100%",
                            maxWidth: "450px",
                            borderRadius: "14px",
                            padding: "24px",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                            transition: "background-color 0.3s ease"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h3 style={{ margin: 0, fontSize: "18px", color: "var(--profile-text-main, #1e293b)", display: "flex", alignItems: "center", gap: "8px", transition: "color 0.3s ease" }}>
                                <KeyRound size={20} color="var(--brand-primary, #2563eb)" /> Change Password
                            </h3>
                            <button
                                onClick={() => {
                                    setPwdModalOpen(false);
                                    setPwdStatus({ loading: false, error: "", success: "" });
                                    setPwdData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                }}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--profile-text-muted, #64748b)", transition: "color 0.3s ease" }}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {pwdStatus.error && (
                            <div style={{ color: "var(--profile-error-text, #ef4444)", background: "var(--profile-error-bg, #fef2f2)", border: "1px solid var(--profile-error-border, #fecaca)", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px", transition: "all 0.3s ease" }}>
                                {pwdStatus.error}
                            </div>
                        )}
                        {pwdStatus.success && (
                            <div style={{ color: "var(--profile-success-text, #059669)", background: "var(--profile-success-bg, #d1fae5)", border: "1px solid var(--profile-success-border, #a7f3d0)", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px", transition: "all 0.3s ease" }}>
                                {pwdStatus.success}
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "14px", fontWeight: "500", color: "var(--profile-tag-text, #475569)", transition: "color 0.3s ease" }}>Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={pwdData.currentPassword}
                                    onChange={(e) => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--profile-input-border, #cbd5e1)", outline: "none", background: "var(--profile-input-bg, #ffffff)", color: "var(--profile-text-main, #1e293b)", transition: "all 0.3s ease" }}
                                />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "14px", fontWeight: "500", color: "var(--profile-tag-text, #475569)", transition: "color 0.3s ease" }}>New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={pwdData.newPassword}
                                    onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--profile-input-border, #cbd5e1)", outline: "none", background: "var(--profile-input-bg, #ffffff)", color: "var(--profile-text-main, #1e293b)", transition: "all 0.3s ease" }}
                                />

                                {/* Live Validation Checklist */}
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                    background: "var(--profile-item-bg, #f8fafc)",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--profile-border, #e2e8f0)",
                                    marginTop: "4px",
                                    transition: "background-color 0.3s ease, border-color 0.3s ease"
                                }}>
                                    {pwdRules.map(rule => (
                                        <div key={rule.id} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            color: rule.met ? "var(--profile-success-text, #059669)" : "var(--profile-error-text, #ef4444)",
                                            fontSize: "13px",
                                            fontWeight: "500",
                                            transition: "color 0.2s ease"
                                        }}>
                                            {rule.met ? <Check size={16} /> : <X size={16} />}
                                            <span>{rule.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "14px", fontWeight: "500", color: "var(--profile-tag-text, #475569)", transition: "color 0.3s ease" }}>Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={pwdData.confirmPassword}
                                    onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--profile-input-border, #cbd5e1)", outline: "none", background: "var(--profile-input-bg, #ffffff)", color: "var(--profile-text-main, #1e293b)", transition: "all 0.3s ease" }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={pwdStatus.loading || !isFormReadyToSubmit}
                                style={{
                                    background: "var(--brand-primary, #2563eb)",
                                    color: "#fff",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontWeight: "500",
                                    cursor: (pwdStatus.loading || !isFormReadyToSubmit) ? "not-allowed" : "pointer",
                                    marginTop: "10px",
                                    opacity: (pwdStatus.loading || !isFormReadyToSubmit) ? 0.7 : 1,
                                    transition: "all 0.2s ease"
                                }}
                            >
                                {pwdStatus.loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}