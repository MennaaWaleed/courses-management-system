import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Users,
    Mail,
    Phone,
    BookOpen,
    Eye,
    RefreshCw,
    UserX,
    UserCheck,
    X,
    AlertTriangle
} from "lucide-react";

import {
    getAllStudents,
    updateStudentStatus
} from "../../api/adminStudentApi";

import "./AdminStudents.css";

function AdminStudents() {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedStudent, setSelectedStudent] = useState(null);

    const [statusLoading, setStatusLoading] = useState(false);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllStudents();

            setStudents(data);
        } catch (err) {
            console.error("Error fetching students:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load students."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = students.filter((student) => {
        const search = searchTerm.toLowerCase();

        return (
            student.fullName?.toLowerCase().includes(search) ||
            student.email?.toLowerCase().includes(search) ||
            student.phoneNumber?.toLowerCase().includes(search)
        );
    });


    const openStatusModal = (student) => {
        setSelectedStudent(student);
    };


    const closeStatusModal = () => {
        if (statusLoading) return;

        setSelectedStudent(null);
    };


    const handleUpdateStatus = async () => {
        if (!selectedStudent) return;

        const newStatus = !selectedStudent.enabled;

        try {
            setStatusLoading(true);
            setError("");

            await updateStudentStatus(
                selectedStudent.id,
                newStatus
            );

            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === selectedStudent.id
                        ? {
                            ...student,
                            enabled: newStatus
                        }
                        : student
                )
            );

            setSelectedStudent(null);

        } catch (err) {
            console.error(
                "Error updating student status:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update student status."
            );

        } finally {
            setStatusLoading(false);
        }
    };

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape" && !statusLoading) {
                setSelectedStudent(null);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [statusLoading]);

    return (
        <div className="admin-students-page">


            <div className="admin-students-header">

                <div>
                    <div className="admin-students-title-row">

                        <Users size={30} />

                        <div>
                            <h1>Students</h1>

                            <p>
                                View and manage all registered students
                            </p>
                        </div>

                    </div>
                </div>

                <button
                    className="admin-students-refresh-btn"
                    onClick={fetchStudents}
                    disabled={loading}
                >
                    <RefreshCw
                        size={18}
                        className={loading ? "spinning" : ""}
                    />

                    Refresh
                </button>

            </div>


            <div className="admin-students-toolbar">

                <div className="admin-students-search">

                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                </div>

                <div className="admin-students-count">
                    {filteredStudents.length} student
                    {filteredStudents.length !== 1 ? "s" : ""}
                </div>

            </div>


            {error && (
                <div className="admin-students-error">
                    {error}
                </div>
            )}



            {loading ? (

                <div className="admin-students-loading">

                    <div className="admin-students-spinner"></div>

                    <p>Loading students...</p>

                </div>

            ) : filteredStudents.length === 0 ? (


                <div className="admin-students-empty">

                    <Users size={45} />

                    <h2>No students found</h2>

                    <p>
                        {searchTerm
                            ? "Try changing your search."
                            : "There are no registered students yet."
                        }
                    </p>

                </div>

            ) : (


                <div className="admin-students-table-container">

                    <table className="admin-students-table">

                        <thead>

                        <tr>
                            <th>Student</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Courses</th>
                            <th>Action</th>
                        </tr>

                        </thead>

                        <tbody>

                        {filteredStudents.map((student) => (

                            <tr key={student.id}>


                                <td>

                                    <div className="student-name-cell">

                                        <div className="student-avatar">

                                            {student.firstName
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>

                                        <div>

                                            <strong>
                                                {student.fullName}
                                            </strong>

                                        </div>

                                    </div>

                                </td>



                                <td>

                                    <div className="student-contact">

                                        <Mail size={16} />

                                        <span>
                                            {student.email}
                                        </span>

                                    </div>

                                </td>

                                <td>

                                    <div className="student-contact">

                                        <Phone size={16} />

                                        <span>
                                            {student.phoneNumber || "—"}
                                        </span>

                                    </div>

                                </td>


                                <td>

                                    <span
                                        className={
                                            student.enabled
                                                ? "student-status active"
                                                : "student-status inactive"
                                        }
                                    >
                                        {student.enabled
                                            ? "Enabled"
                                            : "Disabled"}
                                    </span>

                                </td>

                                <td>

                                    <div className="student-courses-count">

                                        <BookOpen size={16} />

                                        {student.enrolledCourses}

                                    </div>

                                </td>


                                <td>

                                    <div className="student-actions">

                                        {/* VIEW */}

                                        <button
                                            className="student-view-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/students/${student.id}`
                                                )
                                            }
                                        >
                                            <Eye size={17} />

                                            View
                                        </button>



                                        <button
                                            className={
                                                student.enabled
                                                    ? "student-status-btn disable"
                                                    : "student-status-btn enable"
                                            }
                                            onClick={() =>
                                                openStatusModal(student)
                                            }
                                        >

                                            {student.enabled ? (
                                                <UserX size={17} />
                                            ) : (
                                                <UserCheck size={17} />
                                            )}

                                            {student.enabled
                                                ? "Disable"
                                                : "Enable"}

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            )}

            {selectedStudent && (

                <div
                    className="student-status-modal-overlay"
                    onClick={closeStatusModal}
                >

                    <div
                        className="student-status-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <button
                            className="student-status-modal-close"
                            onClick={closeStatusModal}
                            disabled={statusLoading}
                        >
                            <X size={20} />
                        </button>



                        <div
                            className={
                                selectedStudent.enabled
                                    ? "student-status-modal-icon disable"
                                    : "student-status-modal-icon enable"
                            }
                        >

                            {selectedStudent.enabled ? (
                                <UserX
                                    size={28}
                                    strokeWidth={2}
                                />
                            ) : (
                                <UserCheck
                                    size={28}
                                    strokeWidth={2}
                                />
                            )}

                        </div>



                        <h2>
                            {selectedStudent.enabled
                                ? "Disable Student"
                                : "Enable Student"}
                        </h2>



                        <p>

                            Are you sure you want to{" "}

                            <strong>
                                {selectedStudent.enabled
                                    ? "disable"
                                    : "enable"}
                            </strong>{" "}

                            <strong>
                                {selectedStudent.fullName}
                            </strong>
                            ?

                        </p>



                        {selectedStudent.enabled && (

                            <div className="student-status-warning">

                                <AlertTriangle size={18} />

                                <span>
                                    This student will not be able
                                    to log in while the account is
                                    disabled.
                                </span>

                            </div>

                        )}



                        <div className="student-status-modal-actions">

                            <button
                                className="student-status-cancel-btn"
                                onClick={closeStatusModal}
                                disabled={statusLoading}
                            >
                                Cancel
                            </button>

                            <button
                                className={
                                    selectedStudent.enabled
                                        ? "student-status-confirm-btn disable"
                                        : "student-status-confirm-btn enable"
                                }
                                onClick={handleUpdateStatus}
                                disabled={statusLoading}
                            >

                                {statusLoading ? (

                                    <>
                                        <RefreshCw
                                            size={17}
                                            className="spinning"
                                        />

                                        Processing...
                                    </>

                                ) : (

                                    <>
                                        {selectedStudent.enabled ? (
                                            <UserX size={17} />
                                        ) : (
                                            <UserCheck size={17} />
                                        )}

                                        {selectedStudent.enabled
                                            ? "Disable Student"
                                            : "Enable Student"}
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminStudents;
