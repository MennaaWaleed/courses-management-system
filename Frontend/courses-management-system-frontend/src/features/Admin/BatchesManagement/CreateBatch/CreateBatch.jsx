import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInstructorOptions, createBatch } from "../../../../api/batchApi.js";
import "./CreateBatch.css";

function CreateBatch() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        batchName: "",
        instructorId: "",
        status: "OPEN",
        attendanceType: "ONLINE",
        capacity: 20,
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const data = await getInstructorOptions();
                setInstructors(data);
            } catch (err) {
                console.error("Failed to load instructors:", err);
                setErrorMessage("Failed to load instructors list.");
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            setErrorMessage("End date must be after start date.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                batchName: formData.batchName,
                status: formData.status,
                attendanceType: formData.attendanceType,
                capacity: parseInt(formData.capacity, 10),
                instructorId: formData.instructorId || null,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
            };

            await createBatch(courseId, payload);
            navigate(`/admin/courses/${courseId}/batches`);
        } catch (err) {
            console.error("Error creating batch:", err);
            setErrorMessage(err.response?.data?.message || "Failed to create batch.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="create-batch-loading">Loading options...</div>;
    }

    return (
        <div className="create-batch-container">
            <div className="create-batch-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back to Batches
                </button>
                <h1>Create New Batch</h1>
                <p>Configure batch schedule, capacity, and assign an instructor</p>
            </div>

            {errorMessage && <div className="error-banner">{errorMessage}</div>}

            <form className="create-batch-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* Batch Name */}
                    <div className="form-group full-width">
                        <label>Batch Name *</label>
                        <input
                            type="text"
                            name="batchName"
                            placeholder="e.g. Batch 01 - Morning"
                            value={formData.batchName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Instructor</label>
                        <select
                            name="instructorId"
                            value={formData.instructorId}
                            onChange={handleChange}
                        >
                            <option value="">-- Select Instructor (Optional) --</option>
                            {instructors.map((inst) => (
                                <option key={inst.id} value={inst.id}>
                                    {inst.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Status *</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="OPEN">OPEN</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Attendance Type *</label>
                        <select
                            name="attendanceType"
                            value={formData.attendanceType}
                            onChange={handleChange}
                        >
                            <option value="ONLINE">ONLINE</option>
                            <option value="OFFLINE">OFFLINE</option>
                            <option value="HYBRID">HYBRID</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Capacity (Students) *</label>
                        <input
                            type="number"
                            name="capacity"
                            min="1"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Start Date & Time *</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>End Date & Time *</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-btn" disabled={submitting}>
                        {submitting ? "Creating..." : "Create Batch"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateBatch;