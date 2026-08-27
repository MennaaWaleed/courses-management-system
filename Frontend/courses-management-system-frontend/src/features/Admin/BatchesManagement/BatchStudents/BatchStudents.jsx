import { useEffect, useState } from "react";
import {
    getStudentsByBatchId,
    removeStudentFromBatch,
    changeStudentBatch,
    getBatchesByCourseId
} from "../../../../api/batchApi.js";
import "./BatchStudents.css";

function BatchStudents({ batch, courseId, onClose }) {
    const [students, setStudents] = useState([]);
    const [availableBatches, setAvailableBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [changeModeId, setChangeModeId] = useState(null);

    const [messageBox, setMessageBox] = useState({
        visible: false,
        type: "",
        message: "",
        studentId: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const studentsData = await getStudentsByBatchId(batch.id);
                setStudents(studentsData || []);

                const allBatches = await getBatchesByCourseId(courseId);
                setAvailableBatches(
                    allBatches.filter(b => b.id !== batch.id)
                );
            } catch (err) {
                console.error("Error fetching modal data:", err);

                setMessageBox({
                    visible: true,
                    type: "error",
                    message: "Failed to load students.",
                    studentId: null
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [batch.id, courseId]);

    const handleRemove = (studentId) => {
        setMessageBox({
            visible: true,
            type: "confirm",
            message: "Are you sure you want to remove this student from the batch?",
            studentId: studentId
        });
    };

    const confirmRemoveStudent = async () => {
        const studentId = messageBox.studentId;

        if (!studentId) return;

        try {
            await removeStudentFromBatch(studentId, batch.id);

            setStudents(prev =>
                prev.filter(s => s.studentId !== studentId)
            );

            setMessageBox({
                visible: true,
                type: "success",
                message: "Student removed from the batch successfully.",
                studentId: null
            });

        } catch (err) {
            console.error(err);

            setMessageBox({
                visible: true,
                type: "error",
                message: "Failed to remove student from the batch.",
                studentId: null
            });
        }
    };

    const handleConfirmChangeBatch = async (studentId, newBatchId) => {
        if (!newBatchId) return;

        try {
            await changeStudentBatch(
                batch.id,
                studentId,
                newBatchId
            );

            setStudents(prev =>
                prev.filter(s => s.studentId !== studentId)
            );

            setChangeModeId(null);

            setMessageBox({
                visible: true,
                type: "success",
                message: "Student batch changed successfully.",
                studentId: null
            });

        } catch (err) {
            console.error(err);

            setMessageBox({
                visible: true,
                type: "error",
                message: "Failed to change batch.",
                studentId: null
            });
        }
    };

    const filteredStudents = students.filter(student =>
        student.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
        student.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <div className="students-modal-overlay">
            <div className="students-modal-content">

                <div className="students-modal-header">
                    <h2>
                        Students in: <span>{batch.batchName}</span>
                    </h2>

                    <button
                        className="students-close-btn"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                <div className="students-modal-controls">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="students-search-input"
                    />

                    <span className="students-count-badge">
                        Total: {filteredStudents.length}
                    </span>
                </div>

                <div className="students-table-container">
                    {loading ? (
                        <div className="students-loading">
                            Loading students...
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="no-students">
                            No students found.
                        </div>
                    ) : (
                        <table className="inner-students-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.studentId}>
                                    <td className="student-name-cell">
                                        {student.fullName}
                                    </td>

                                    <td>
                                        {student.email}
                                    </td>

                                    <td>
                                        {student.phoneNumber || "N/A"}
                                    </td>

                                    <td>
                                        {changeModeId === student.studentId ? (
                                            <div className="change-batch-controls">

                                                <select
                                                    onChange={(e) =>
                                                        handleConfirmChangeBatch(
                                                            student.studentId,
                                                            e.target.value
                                                        )
                                                    }
                                                    defaultValue=""
                                                >
                                                    <option
                                                        value=""
                                                        disabled
                                                    >
                                                        Select target batch...
                                                    </option>

                                                    {availableBatches.map(b => (
                                                        <option
                                                            key={b.id}
                                                            value={b.id}
                                                        >
                                                            {b.batchName}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    className="cancel-change-btn"
                                                    onClick={() =>
                                                        setChangeModeId(null)
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                            </div>
                                        ) : (
                                            <div className="student-action-buttons">

                                                <button
                                                    className="change-batch-btn"
                                                    onClick={() =>
                                                        setChangeModeId(
                                                            student.studentId
                                                        )
                                                    }
                                                    disabled={
                                                        availableBatches.length === 0
                                                    }
                                                    title={
                                                        availableBatches.length === 0
                                                            ? "No other batches available"
                                                            : ""
                                                    }
                                                >
                                                    Change Batch
                                                </button>

                                                <button
                                                    className="remove-student-btn"
                                                    onClick={() =>
                                                        handleRemove(
                                                            student.studentId
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {messageBox.visible && (
                    <div className="student-message-overlay">
                        <div className="student-message-box">

                            <div
                                className={`student-message-icon ${messageBox.type}`}
                            >
                                {messageBox.type === "success" && "✓"}
                                {messageBox.type === "error" && "✕"}
                                {messageBox.type === "confirm" && "?"}
                            </div>

                            <h3>
                                {messageBox.type === "success" && "Success"}
                                {messageBox.type === "error" && "Error"}
                                {messageBox.type === "confirm" && "Confirm Action"}
                            </h3>

                            <p>
                                {messageBox.message}
                            </p>

                            {messageBox.type === "confirm" ? (
                                <div className="student-message-buttons">

                                    <button
                                        className="message-cancel-btn"
                                        onClick={() =>
                                            setMessageBox({
                                                visible: false,
                                                type: "",
                                                message: "",
                                                studentId: null
                                            })
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="message-ok-btn confirm-btn"
                                        onClick={confirmRemoveStudent}
                                    >
                                        Yes, Remove
                                    </button>

                                </div>
                            ) : (
                                <button
                                    className="message-ok-btn message-single-ok"
                                    onClick={() =>
                                        setMessageBox({
                                            visible: false,
                                            type: "",
                                            message: "",
                                            studentId: null
                                        })
                                    }
                                >
                                    OK
                                </button>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default BatchStudents;