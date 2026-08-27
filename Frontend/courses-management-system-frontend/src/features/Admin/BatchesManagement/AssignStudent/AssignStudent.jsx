
import { useEffect, useState, useRef } from "react";
import {
    getAssignableStudents,
    assignStudentToBatch
} from "../../../../api/batchApi.js";
import "./AssignStudent.css";

function AssignStudent({ batch, onClose, onAssigned }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);

                const data = await getAssignableStudents();

                setStudents(data || []);
            } catch (err) {
                console.error(
                    "Failed to load assignable students:",
                    err
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();

        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const filteredStudents = students.filter((student) => {
        const name = (
            student.fullName ||
            student.name ||
            ""
        ).toLowerCase();

        const email = (
            student.email ||
            ""
        ).toLowerCase();

        const query = searchQuery.toLowerCase();

        return (
            name.includes(query) ||
            email.includes(query)
        );
    });

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);

        setSearchQuery(
            `${student.fullName || student.name} (${student.email})`
        );

        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const studentId =
            selectedStudent?.studentId ||
            selectedStudent?.id;

        if (!studentId) {
            alert("Please select a student first.");
            return;
        }

        try {
            setSubmitting(true);

            await assignStudentToBatch(
                batch.id,
                studentId
            );

            setSuccessMessage(
                "Student assigned successfully!"
            );

        } catch (err) {
            console.error(
                "Failed to assign student:",
                err
            );

            alert("Failed to assign student.");

            setSubmitting(false);
        }
    };

    const handleSuccessOk = () => {
        if (onAssigned) {
            onAssigned();
        }

        onClose();
    };

    return (
        <div className="confirm-modal-overlay">

            <div className="confirm-modal-content">

                {/* Header */}
                <div className="students-modal-header">

                    <h3>
                        Assign Student to:{" "}
                        <span>{batch.batchName}</span>
                    </h3>

                    {!successMessage && (
                        <button
                            className="students-close-btn"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            &times;
                        </button>
                    )}

                </div>

                {successMessage ? (

                    <div className="assign-success-container">

                        <div className="assign-success-icon">
                            ✓
                        </div>

                        <div className="assign-success-message">
                            {successMessage}
                        </div>

                        <button
                            type="button"
                            className="assign-success-ok-btn"
                            onClick={handleSuccessOk}
                        >
                            OK
                        </button>

                    </div>

                ) : (

                    <>
                        {loading ? (

                            <div className="students-loading">
                                Loading available students...
                            </div>

                        ) : (

                            <form
                                onSubmit={handleSubmit}
                                className="assign-student-form"
                            >

                                {/* Search & Select Student */}
                                <div
                                    className="form-group"
                                    style={{
                                        marginBottom: "20px",
                                        position: "relative"
                                    }}
                                    ref={dropdownRef}
                                >

                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontWeight: "bold",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Search & Select Student by Email or Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Type name or email to search..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(
                                                e.target.value
                                            );

                                            setIsDropdownOpen(true);

                                            setSelectedStudent(null);
                                        }}
                                        onClick={() =>
                                            setIsDropdownOpen(true)
                                        }
                                        disabled={submitting}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "5px",
                                            border: "1px solid #ccc",
                                            fontSize: "14px",
                                            boxSizing: "border-box"
                                        }}
                                        required
                                    />

                                    {isDropdownOpen && (
                                        <ul
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: 0,
                                                right: 0,
                                                maxHeight: "180px",
                                                overflowY: "auto",
                                                backgroundColor: "white",
                                                border: "1px solid #ccc",
                                                borderRadius:
                                                    "0 0 5px 5px",
                                                listStyle: "none",
                                                padding: 0,
                                                margin: 0,
                                                zIndex: 1000,
                                                boxShadow:
                                                    "0px 4px 6px rgba(0,0,0,0.1)"
                                            }}
                                        >

                                            {filteredStudents.length ===
                                            0 ? (

                                                <li
                                                    style={{
                                                        padding: "10px",
                                                        color: "#888",
                                                        textAlign:
                                                            "center"
                                                    }}
                                                >
                                                    No matching students
                                                    found
                                                </li>

                                            ) : (

                                                filteredStudents.map(
                                                    (student) => (
                                                        <li
                                                            key={
                                                                student.studentId ||
                                                                student.id
                                                            }
                                                            onClick={() =>
                                                                handleSelectStudent(
                                                                    student
                                                                )
                                                            }
                                                            style={{
                                                                padding:
                                                                    "10px 12px",
                                                                cursor:
                                                                    "pointer",
                                                                borderBottom:
                                                                    "1px solid #eee",
                                                                fontSize:
                                                                    "14px"
                                                            }}
                                                            onMouseEnter={(
                                                                e
                                                            ) => {
                                                                e.currentTarget.style.backgroundColor =
                                                                    "#f1f1f1";
                                                            }}
                                                            onMouseLeave={(
                                                                e
                                                            ) => {
                                                                e.currentTarget.style.backgroundColor =
                                                                    "white";
                                                            }}
                                                        >
                                                            <strong>
                                                                {
                                                                    student.fullName ||
                                                                    student.name
                                                                }
                                                            </strong>{" "}
                                                            (
                                                            {
                                                                student.email
                                                            }
                                                            )
                                                        </li>
                                                    )
                                                )

                                            )}

                                        </ul>
                                    )}

                                </div>

                                <div className="confirm-modal-actions">

                                    <button
                                        type="button"
                                        className="confirm-cancel-btn"
                                        onClick={onClose}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="confirm-delete-btn"
                                        disabled={
                                            submitting ||
                                            !selectedStudent
                                        }
                                        style={{
                                            backgroundColor:
                                                "#007bff",
                                            color: "white"
                                        }}
                                    >
                                        {submitting
                                            ? "Assigning..."
                                            : "Assign Student"}
                                    </button>

                                </div>

                            </form>

                        )}
                    </>
                )}

            </div>

        </div>
    );
}

export default AssignStudent;