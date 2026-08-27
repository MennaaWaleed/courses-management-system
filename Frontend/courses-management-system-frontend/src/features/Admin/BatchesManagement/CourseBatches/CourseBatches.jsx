import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBatchesByCourseId, softDeleteBatch } from "../../../../api/batchApi.js";
import "./CourseBatches.css";
import BatchStudents from "../BatchStudents/BatchStudents.jsx";
import EditBatch from "../EditBatch/EditBatch.jsx"
import AssignStudent from "../AssignStudent/AssignStudent.jsx";
function CourseBatches() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [batchToDelete, setBatchToDelete] = useState(null);
    const [selectedBatchForModal, setSelectedBatchForModal] = useState(null);
    const [batchToAssignStudent, setBatchToAssignStudent] = useState(null);
    const [batchToEdit, setBatchToEdit] = useState(null);
    const [batchToViewRequests, setBatchToViewRequests] = useState(null);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const data = await getBatchesByCourseId(courseId);
            setBatches(data || []);
        } catch (err) {
            console.error("Fetch batches error:", err);
            if (err.response?.status === 403) {
                setError("Access denied: Admin permissions required.");
            } else {
                setError("Failed to fetch batches. Please try again.");
            }
        } finally {
            setLoading(false);
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

    useEffect(() => {
        if (courseId) {
            fetchBatches();
        }
    }, [courseId]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return <div className="course-batches-loading">Loading Batches...</div>;
    }

    if (error) {
        return (
            <div className="course-batches-container">
                <div className="error-message">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="batches-back-btn"
                    >
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    const courseTitle = batches.length > 0 ? batches[0].courseName : "Course Batches";

    return (
        <div className="course-batches-container">
            <div className="course-batches-header">
                <div className="course-batches-header-top">
                    <button
                        type="button"
                        className="batches-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← Back to Category Courses
                    </button>

                    <button
                        type="button"
                        className="batches-create-btn"
                        onClick={() => navigate(`/admin/courses/${courseId}/batches/create`)}
                    >
                        + Create New Batch
                    </button>
                </div>

                <div className="course-batches-title">
                    <h1>{courseTitle}</h1>
                    <p>Showing all scheduled batches, capacities, and assigned instructors</p>
                </div>
            </div>

            {batches.length === 0 ? (
                <div className="no-batches">
                    <p>No batches found for this course.</p>
                    <button
                        type="button"
                        className="batches-create-first-btn"
                        onClick={() => navigate(`/admin/courses/${courseId}/batches/create`)}
                    >
                        Create First Batch
                    </button>
                </div>
            ) : (
                <div className="batches-table-wrapper">
                    <table className="batches-table">
                        <thead>
                        <tr>
                            <th>Batch Name</th>
                            <th>Status</th>
                            <th>Attendance</th>
                            <th>Capacity</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Instructor</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {batches.map((batch) => (
                            <tr key={batch.id}>
                                <td className="batch-name-cell">{batch.batchName}</td>
                                <td>
                                    <span className={`status-badge ${(batch.status || "").toLowerCase()}`}>
                                        {batch.status}
                                    </span>
                                </td>
                                <td>
                                    <span className="attendance-badge">{batch.attendanceType}</span>
                                </td>
                                <td className="batch-capacity-cell">{batch.capacity} Students</td>
                                <td className="batch-date-cell">{formatDate(batch.startDate)}</td>
                                <td className="batch-date-cell">{formatDate(batch.endDate)}</td>
                                <td className="batch-instructor-name">{batch.instructorName}</td>
                                <td>
                                    <div className="batch-table-actions">
                                        <button
                                            className="requests-batch-btn"
                                            onClick={() => setBatchToViewRequests(batch)}
                                        >
                                            Requests
                                        </button>

                                        <button
                                            className="assign-student-btn"
                                            onClick={() => setBatchToAssignStudent(batch)}
                                        >
                                            Assign Student
                                        </button>

                                        <button
                                            className="see-students-btn"
                                            onClick={() => setSelectedBatchForModal(batch)}
                                        >
                                            See Students
                                        </button>

                                        <button
                                            className="edit-batch-btn"
                                            onClick={() => setBatchToEdit(batch)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-batch-btn"
                                            onClick={() => setBatchToDelete(batch)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedBatchForModal && (
                <BatchStudents
                    batch={selectedBatchForModal}
                    courseId={courseId}
                    onClose={() => setSelectedBatchForModal(null)}
                />
            )}

            {batchToDelete && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-content">
                        <h3>Delete Batch</h3>
                        <p>
                            Are you sure you want to delete the batch <strong>{batchToDelete.batchName}</strong>?
                            <br/>This action cannot be undone.
                        </p>

                        <div className="confirm-modal-actions">
                            <button
                                className="confirm-cancel-btn"
                                onClick={() => setBatchToDelete(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-delete-btn"
                                onClick={confirmDeleteBatch}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {batchToAssignStudent && (
                <AssignStudent
                    batch={batchToAssignStudent}
                    onClose={() => setBatchToAssignStudent(null)}
                    onAssigned={() => {
                        fetchBatches();
                    }}
                />
            )}

            {batchToViewRequests && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-content">
                        <h3>Requests for: {batchToViewRequests.batchName}</h3>
                        <p>Pending enrollment requests will be listed here.</p>
                        <div className="confirm-modal-actions">
                            <button
                                className="confirm-cancel-btn"
                                onClick={() => setBatchToViewRequests(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {batchToEdit && (
                <EditBatch
                    batchId={batchToEdit.id}
                    courseId={courseId}
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

export default CourseBatches;