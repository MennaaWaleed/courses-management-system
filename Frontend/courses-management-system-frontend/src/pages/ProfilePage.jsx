import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/profileApi";
import { Mail, Phone, BookOpen, Heart, Award, X, Download, Layers, ShieldCheck, UserCheck } from "lucide-react";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [pdfTitle, setPdfTitle] = useState("");
    const [pdfLoading, setPdfLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const data = await fetchUserProfile();
                setProfile(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load profile details.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleOpenCertificate = async (url, courseName) => {
        try {
            setPdfLoading(true);
            setPdfTitle(courseName);
            setModalOpen(true);

            const response = await fetch(url);
            if (!response.ok) throw new Error("Could not load certificate PDF");

            const blob = await response.blob();
            const localUrl = window.URL.createObjectURL(blob);
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
        link.download = `${pdfTitle.replace(/\s+/g, "_")}_Certificate.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#64748b" }}>
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#ef4444" }}>
                {error}
            </div>
        );
    }

    const role = profile?.role?.toUpperCase();

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* 1. Common Info Header (Admin, Instructor, Student) */}
            <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: role === "ADMIN" ? "#7c3aed" : role === "INSTRUCTOR" ? "#0891b2" : "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold" }}>
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                </div>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>
                            {profile?.firstName} {profile?.lastName}
                        </h1>
                        <span style={{ fontSize: "12px", fontWeight: "600", padding: "3px 8px", borderRadius: "9999px", background: "#f1f5f9", color: "#475569" }}>
              {role}
            </span>
                    </div>
                    <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", margin: "6px 0 0", fontSize: "14px" }}>
                        <Mail size={16} /> {profile?.email}
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", margin: "4px 0 0", fontSize: "14px" }}>
                        <Phone size={16} /> {profile?.phone}
                    </p>
                </div>
            </div>

            {/* 2. Instructor: Assigned Course Batches */}
            {role === "INSTRUCTOR" && (
                <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <Layers size={20} color="#0891b2" /> Assigned Batches
                    </h2>
                    {!profile?.assignedBatches || profile.assignedBatches.length === 0 ? (
                        <p style={{ color: "#94a3b8", fontSize: "14px" }}>No course batches currently assigned.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {profile.assignedBatches.map((batch, idx) => (
                                <div key={idx} style={{ padding: "14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>{batch.courseName}</h3>
                                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>Batch: {batch.batchName}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 3. Student: Enrolled Courses & Wishlist */}
            {role !== "ADMIN" && role !== "INSTRUCTOR" && (
                <>
                    {/* Enrolled Courses */}
                    <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                        <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                            <BookOpen size={20} color="#2563eb" /> Enrolled Courses
                        </h2>
                        {!profile?.enrolledCourses || profile.enrolledCourses.length === 0 ? (
                            <p style={{ color: "#94a3b8", fontSize: "14px" }}>No enrolled courses yet.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {profile.enrolledCourses.map((course, idx) => (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>{course.courseName}</h3>
                                            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>{course.batchName}</p>
                                        </div>
                                        {course.certificateUrl && (
                                            <button
                                                onClick={() => handleOpenCertificate(course.certificateUrl, course.courseName)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    background: "#2563eb",
                                                    color: "#fff",
                                                    padding: "8px 16px",
                                                    borderRadius: "8px",
                                                    border: "none",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <Award size={16} /> Certificate
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Wishlist */}
                    <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                        <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                            <Heart size={20} color="#ef4444" /> Wishlist
                        </h2>
                        {!profile?.wishlist || profile.wishlist.length === 0 ? (
                            <p style={{ color: "#94a3b8", fontSize: "14px" }}>Your wishlist is empty.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {profile.wishlist.map((item, idx) => (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                                        <span style={{ fontSize: "15px", fontWeight: "500", color: "#1e293b" }}>{item.courseName}</span>
                                        <span style={{ fontSize: "15px", fontWeight: "bold", color: "#059669" }}>{item.price?.toLocaleString()} EGP</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* PDF Modal Viewer */}
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
                        padding: "16px",
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        style={{
                            background: "#fff",
                            width: "100%",
                            maxWidth: "900px",
                            height: "90vh",
                            borderRadius: "14px",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Award size={20} color="#2563eb" />
                                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                                    {pdfTitle} Certificate
                                </h3>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {pdfBlobUrl && (
                                    <button
                                        onClick={handleDownload}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            background: "#059669",
                                            color: "#fff",
                                            padding: "7px 14px",
                                            borderRadius: "6px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        <Download size={15} /> Download PDF
                                    </button>
                                )}
                                <button
                                    onClick={handleCloseModal}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#64748b",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "4px",
                                    }}
                                >
                                    <X size={22} />
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, width: "100%", height: "100%", background: "#525659" }}>
                            {pdfLoading ? (
                                <div style={{ color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                    Rendering Certificate...
                                </div>
                            ) : pdfBlobUrl ? (
                                <iframe
                                    src={pdfBlobUrl}
                                    title="Certificate PDF"
                                    style={{ width: "100%", height: "100%", border: "none" }}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}