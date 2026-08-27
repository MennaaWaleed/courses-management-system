import { useEffect, useState } from "react";
import { getBatchById, updateBatch, getInstructorOptions } from "../../../../api/batchApi";
import "./EditBatch.css";

function EditBatchModal({ batchId, courseId, onClose, onBatchUpdated }) {
    const [formData, setFormData] = useState({
        batchName: "",
        status: "OPEN",
        attendanceType: "ONLINE",
        capacity: 30,
        startDate: "",
        endDate: "",
        instructorId: ""
    });
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const batchData = await getBatchById(batchId);

                const formatDateForInput = (dateString) => {
                    if (!dateString) return "";
                    return new Date(dateString).toISOString().slice(0, 16);
                };

                setFormData({
                    batchName: batchData.batchName || "",
                    status: batchData.status || "OPEN",
                    attendanceType: batchData.attendanceType || "ONLINE",
                    capacity: batchData.capacity || 30,
                    startDate: formatDateForInput(batchData.startDate),
                    endDate: formatDateForInput(batchData.endDate),
                    instructorId: batchData.instructor?.id || ""
                });

                try {
                    const instructorsData = await getInstructorOptions();
                    setInstructors(instructorsData || []);
                } catch (e) {
                    console.error("Could not fetch instructor options", e);
                }

            } catch (err) {
                console.error("Failed to load batch data:", err);
                alert("Failed to load batch details.");
                onClose();
            } finally {
                setLoading(false);
            }
        };

        if (batchId) {
            fetchData();
        }
    }, [batchId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            const payload = {
                batchName: formData.batchName,
                status: formData.status,
                attendanceType: formData.attendanceType,
                capacity: parseInt(formData.capacity, 10),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                instructorId: formData.instructorId || null
            };

            const updated = await updateBatch(batchId, payload);
            if (onBatchUpdated) {
                onBatchUpdated(updated);
            }
            onClose();
        } catch (err) {
            console.error("Failed to update batch:", err);
            alert("Failed to update batch.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal-content">
                <div className="edit-modal-header">
                    <h2>Edit Batch</h2>
                    <button className="edit-close-btn" onClick={onClose}>&times;</button>
                </div>

                {loading ? (
                    <div className="edit-loading">Loading batch data...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="edit-batch-form">
                        <div className="form-group">
                            <label>Batch Name</label>
                            <input
                                type="text"
                                name="batchName"
                                value={formData.batchName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="OPEN">Open</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Attendance Type</label>
                                <select name="attendanceType" value={formData.attendanceType} onChange={handleChange}>
                                    <option value="ONLINE">Online</option>
                                    <option value="OFFLINE">Offline</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Capacity</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Instructor</label>
                                <select name="instructorId" value={formData.instructorId} onChange={handleChange} required>
                                    <option value="" disabled>Select Instructor</option>
                                    {instructors.map(inst => (
                                        <option key={inst.id || inst.value} value={inst.id || inst.value}>
                                            {inst.name || inst.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="edit-modal-actions">
                            <button type="button" className="edit-cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="edit-save-btn" disabled={submitting}>
                                {submitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default EditBatchModal;