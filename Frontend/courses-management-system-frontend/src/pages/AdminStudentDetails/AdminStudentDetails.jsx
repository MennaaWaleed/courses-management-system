import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    BookOpen,
    Calendar,
    UserRound,
    RefreshCw,
    Pencil,
    Trash2,
    X,
    Check,
    AlertTriangle
} from "lucide-react";

import {
    getStudentDetails,
    getAvailableBatches,
    changeStudentBatch,
    removeStudentFromBatch
} from "../../api/adminStudentApi";

import "./AdminStudentDetails.css";

function AdminStudentDetails() {

    const { studentId } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [availableBatches, setAvailableBatches] = useState([]);

    const [loadingBatches, setLoadingBatches] = useState(false);

    const [showChangeModal, setShowChangeModal] = useState(false);

    const [selectedNewBatch, setSelectedNewBatch] = useState("");

    const [changingBatch, setChangingBatch] = useState(false);

    const [removeTarget, setRemoveTarget] = useState(null);

    const [removing, setRemoving] = useState(false);


    const fetchStudent = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getStudentDetails(studentId);

            setStudent(data);

        } catch (err) {

            console.error(
                "Error fetching student:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load student."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchStudent();
    }, [studentId]);



    const openChangeBatch = async (course) => {

        try {

            setSelectedCourse(course);
            setShowChangeModal(true);
            setSelectedNewBatch("");
            setLoadingBatches(true);

            const batches =
                await getAvailableBatches(
                    studentId,
                    course.courseId
                );

            setAvailableBatches(batches);

        } catch (err) {

            console.error(
                "Error fetching batches:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to load available batches."
            );

            setShowChangeModal(false);

        } finally {

            setLoadingBatches(false);

        }
    };



    const handleChangeBatch = async () => {

        if (!selectedNewBatch) {
            return;
        }

        try {

            setChangingBatch(true);

            await changeStudentBatch(
                studentId,
                selectedCourse.batchId,
                selectedNewBatch
            );

            setShowChangeModal(false);

            await fetchStudent();

        } catch (err) {

            console.error(
                "Error changing batch:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to change batch."
            );

        } finally {

            setChangingBatch(false);

        }
    };


    const handleRemove = async () => {

        if (!removeTarget) {
            return;
        }

        try {

            setRemoving(true);

            await removeStudentFromBatch(
                studentId,
                removeTarget.batchId
            );

            setRemoveTarget(null);

            await fetchStudent();

        } catch (err) {

            console.error(
                "Error removing student:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to remove student from batch."
            );

        } finally {

            setRemoving(false);

        }
    };


    if (loading) {

        return (
            <div className="student-details-loading">

                <div className="student-details-spinner"></div>

                <p>
                    Loading student information...
                </p>

            </div>
        );
    }


    if (error || !student) {

        return (
            <div className="student-details-error-page">

                <AlertTriangle size={45} />

                <h2>
                    Unable to load student
                </h2>

                <p>
                    {error || "Student not found."}
                </p>

                <button
                    onClick={() =>
                        navigate("/admin/students")
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Students
                </button>

            </div>
        );
    }


    return (
        <div className="admin-student-details-page">


            <button
                className="student-details-back-btn"
                onClick={() =>
                    navigate("/admin/students")
                }
            >
                <ArrowLeft size={18} />
                Back to Students
            </button>



            <div className="student-details-header">

                <div className="student-details-avatar">
                    {student.firstName
                        ?.charAt(0)
                        .toUpperCase()}
                </div>

                <div className="student-details-header-info">

                    <h1>
                        {student.fullName}
                    </h1>

                    <p>
                        Student account information
                    </p>

                </div>

                <span
                    className={
                        student.enabled
                            ? "student-details-status active"
                            : "student-details-status inactive"
                    }
                >
                    {student.enabled
                        ? "Enabled"
                        : "Disabled"}
                </span>

            </div>


            <div className="student-info-grid">

                <div className="student-info-card">

                    <Mail size={20} />

                    <div>
                        <span>Email</span>
                        <strong>
                            {student.email}
                        </strong>
                    </div>

                </div>


                <div className="student-info-card">

                    <Phone size={20} />

                    <div>
                        <span>Phone</span>
                        <strong>
                            {student.phoneNumber || "Not provided"}
                        </strong>
                    </div>

                </div>


                <div className="student-info-card">

                    <BookOpen size={20} />

                    <div>
                        <span>Enrolled Courses</span>
                        <strong>
                            {student.courses.length}
                        </strong>
                    </div>

                </div>

            </div>


            <div className="student-courses-section">

                <div className="student-courses-header">

                    <div>
                        <h2>
                            Enrolled Courses
                        </h2>

                        <p>
                            Manage the student's courses and batches.
                        </p>
                    </div>

                    <button
                        className="student-refresh-btn"
                        onClick={fetchStudent}
                        disabled={loading}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>

                </div>


                {student.courses.length === 0 ? (

                    <div className="student-no-courses">

                        <BookOpen size={45} />

                        <h3>
                            No enrolled courses
                        </h3>

                        <p>
                            This student is not currently enrolled in any course.
                        </p>

                    </div>

                ) : (

                    <div className="student-courses-list">

                        {student.courses.map((course) => (

                            <div
                                className="student-course-card"
                                key={`${course.courseId}-${course.batchId}`}
                            >


                                <div className="student-course-main">

                                    <div className="student-course-icon">
                                        <BookOpen size={23} />
                                    </div>

                                    <div>

                                        <h3>
                                            {course.courseName}
                                        </h3>

                                        <p>
                                            Enrolled on{" "}
                                            {course.enrolledAt
                                                ? new Date(
                                                    course.enrolledAt
                                                ).toLocaleDateString()
                                                : "—"}
                                        </p>

                                    </div>

                                </div>



                                <div className="student-course-details">

                                    <div className="course-detail">

                                        <span>
                                            Batch
                                        </span>

                                        <strong>
                                            {course.batchName}
                                        </strong>

                                    </div>


                                    <div className="course-detail">

                                        <span>
                                            Instructor
                                        </span>

                                        <strong>
                                            <UserRound size={15} />

                                            {course.instructorName}
                                        </strong>

                                    </div>


                                    <div className="course-detail">

                                        <span>
                                            Start Date
                                        </span>

                                        <strong>
                                            <Calendar size={15} />

                                            {course.startDate
                                                ? new Date(
                                                    course.startDate
                                                ).toLocaleDateString()
                                                : "—"}
                                        </strong>

                                    </div>


                                    <div className="course-detail">

                                        <span>
                                            Payment
                                        </span>

                                        <strong>
                                            {course.paymentStatus}
                                        </strong>

                                    </div>

                                </div>



                                <div className="student-course-actions">

                                    <button
                                        className="change-batch-btn"
                                        onClick={() =>
                                            openChangeBatch(course)
                                        }
                                    >
                                        <Pencil size={17} />
                                        Change Batch
                                    </button>

                                    <button
                                        className="remove-student-btn"
                                        onClick={() =>
                                            setRemoveTarget(course)
                                        }
                                    >
                                        <Trash2 size={17} />
                                        Remove
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {showChangeModal && selectedCourse && (

                <div
                    className="student-modal-overlay"
                    onClick={() =>
                        !changingBatch &&
                        setShowChangeModal(false)
                    }
                >

                    <div
                        className="student-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="student-modal-header">

                            <div>

                                <h2>
                                    Change Batch
                                </h2>

                                <p>
                                    {selectedCourse.courseName}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowChangeModal(false)
                                }
                                disabled={changingBatch}
                            >
                                <X size={21} />
                            </button>

                        </div>


                        {loadingBatches ? (

                            <div className="modal-loading">

                                <div className="student-details-spinner"></div>

                                <p>
                                    Loading batches...
                                </p>

                            </div>

                        ) : availableBatches.length === 0 ? (

                            <div className="modal-empty">

                                <BookOpen size={35} />

                                <p>
                                    No available batches for this course.
                                </p>

                            </div>

                        ) : (

                            <>

                                <label className="batch-select-label">
                                    Select new batch
                                </label>

                                <div className="batch-options">

                                    {availableBatches
                                        .filter(
                                            (batch) =>
                                                batch.id !==
                                                selectedCourse.batchId
                                        )
                                        .map((batch) => (

                                            <label
                                                key={batch.id}
                                                className={
                                                    selectedNewBatch === batch.id
                                                        ? "batch-option selected"
                                                        : "batch-option"
                                                }
                                            >

                                                <input
                                                    type="radio"
                                                    name="newBatch"
                                                    value={batch.id}
                                                    checked={
                                                        selectedNewBatch ===
                                                        batch.id
                                                    }
                                                    onChange={(e) =>
                                                        setSelectedNewBatch(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <div className="batch-option-info">

                                                    <strong>
                                                        {batch.batchName}
                                                    </strong>

                                                    <span>
                                                        Instructor:{" "}
                                                        {batch.instructorName}
                                                    </span>

                                                    <span>
                                                        {batch.enrolledStudents}
                                                        {" / "}
                                                        {batch.capacity}
                                                        {" students"}
                                                    </span>

                                                </div>

                                            </label>

                                        ))}

                                </div>


                                <div className="student-modal-actions">

                                    <button
                                        className="modal-cancel-btn"
                                        onClick={() =>
                                            setShowChangeModal(false)
                                        }
                                        disabled={changingBatch}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="modal-confirm-btn"
                                        onClick={handleChangeBatch}
                                        disabled={
                                            !selectedNewBatch ||
                                            changingBatch
                                        }
                                    >

                                        {changingBatch ? (
                                            <>
                                                <RefreshCw
                                                    size={17}
                                                    className="spinning"
                                                />

                                                Changing...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={17} />

                                                Change Batch
                                            </>
                                        )}

                                    </button>

                                </div>

                            </>

                        )}

                    </div>

                </div>

            )}


            {removeTarget && (

                <div
                    className="student-modal-overlay"
                    onClick={() =>
                        !removing &&
                        setRemoveTarget(null)
                    }
                >

                    <div
                        className="student-modal remove-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="remove-modal-icon">
                            <Trash2 size={27} />
                        </div>

                        <h2>
                            Remove Student?
                        </h2>

                        <p>
                            Are you sure you want to remove{" "}
                            <strong>
                                {student.fullName}
                            </strong>{" "}
                            from{" "}
                            <strong>
                                {removeTarget.courseName}
                            </strong>
                            {" "}—{" "}
                            <strong>
                                {removeTarget.batchName}
                            </strong>
                            ?
                        </p>

                        <div className="student-modal-actions">

                            <button
                                className="modal-cancel-btn"
                                onClick={() =>
                                    setRemoveTarget(null)
                                }
                                disabled={removing}
                            >
                                Cancel
                            </button>

                            <button
                                className="modal-remove-btn"
                                onClick={handleRemove}
                                disabled={removing}
                            >

                                {removing ? (
                                    <>
                                        <RefreshCw
                                            size={17}
                                            className="spinning"
                                        />

                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={17} />

                                        Remove
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

export default AdminStudentDetails;