// // import { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { getBatchesByCourseId, softDeleteBatch } from "../../../../api/batchApi.js";
// // import "./CourseBatches.css";
// // import BatchStudents from "../BatchStudents/BatchStudents.jsx";
// // import EditBatch from "../EditBatch/EditBatch.jsx"
// // import AssignStudent from "../AssignStudent/AssignStudent.jsx";
// // function CourseBatches() {
// //     const { courseId } = useParams();
// //     const navigate = useNavigate();
// //
// //     const [batches, setBatches] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //
// //     const [batchToDelete, setBatchToDelete] = useState(null);
// //     const [selectedBatchForModal, setSelectedBatchForModal] = useState(null);
// //     const [batchToAssignStudent, setBatchToAssignStudent] = useState(null);
// //     const [batchToEdit, setBatchToEdit] = useState(null);
// //     const [batchToViewRequests, setBatchToViewRequests] = useState(null);
// //
// //     const fetchBatches = async () => {
// //         try {
// //             setLoading(true);
// //             const data = await getBatchesByCourseId(courseId);
// //             setBatches(data || []);
// //         } catch (err) {
// //             console.error("Fetch batches error:", err);
// //             if (err.response?.status === 403) {
// //                 setError("Access denied: Admin permissions required.");
// //             } else {
// //                 setError("Failed to fetch batches. Please try again.");
// //             }
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     const confirmDeleteBatch = async () => {
// //         if (!batchToDelete) return;
// //         try {
// //             await softDeleteBatch(batchToDelete.id);
// //             setBatches((prevBatches) => prevBatches.filter((b) => b.id !== batchToDelete.id));
// //             setBatchToDelete(null);
// //         } catch (err) {
// //             console.error(err);
// //             alert("Failed to delete batch.");
// //         }
// //     };
// //
// //     useEffect(() => {
// //         if (courseId) {
// //             fetchBatches();
// //         }
// //     }, [courseId]);
// //
// //     const formatDate = (dateString) => {
// //         if (!dateString) return "N/A";
// //         return new Date(dateString).toLocaleDateString("en-US", {
// //             year: "numeric",
// //             month: "short",
// //             day: "numeric",
// //         });
// //     };
// //
// //     if (loading) {
// //         return <div className="course-batches-loading">Loading Batches...</div>;
// //     }
// //
// //     if (error) {
// //         return (
// //             <div className="course-batches-container">
// //                 <div className="error-message">
// //                     <p>{error}</p>
// //                     <button
// //                         type="button"
// //                         onClick={() => navigate(-1)}
// //                         className="batches-back-btn"
// //                     >
// //                         ← Go Back
// //                     </button>
// //                 </div>
// //             </div>
// //         );
// //     }
// //
// //     const courseTitle = batches.length > 0 ? batches[0].courseName : "Course Batches";
// //
// //     return (
// //         <div className="course-batches-container">
// //             <div className="course-batches-header">
// //                 <div className="course-batches-header-top">
// //                     <button
// //                         type="button"
// //                         className="batches-back-btn"
// //                         onClick={() => navigate(-1)}
// //                     >
// //                         ← Back to Category Courses
// //                     </button>
// //
// //                     <button
// //                         type="button"
// //                         className="batches-create-btn"
// //                         onClick={() => navigate(`/admin/courses/${courseId}/batches/create`)}
// //                     >
// //                         + Create New Batch
// //                     </button>
// //                 </div>
// //
// //                 <div className="course-batches-title">
// //                     <h1>{courseTitle}</h1>
// //                     <p>Showing all scheduled batches, capacities, and assigned instructors</p>
// //                 </div>
// //             </div>
// //
// //             {batches.length === 0 ? (
// //                 <div className="no-batches">
// //                     <p>No batches found for this course.</p>
// //                     <button
// //                         type="button"
// //                         className="batches-create-first-btn"
// //                         onClick={() => navigate(`/admin/courses/${courseId}/batches/create`)}
// //                     >
// //                         Create First Batch
// //                     </button>
// //                 </div>
// //             ) : (
// //                 <div className="batches-table-wrapper">
// //                     <table className="batches-table">
// //                         <thead>
// //                         <tr>
// //                             <th>Batch Name</th>
// //                             <th>Status</th>
// //                             <th>Attendance</th>
// //                             <th>Capacity</th>
// //                             <th>Start Date</th>
// //                             <th>End Date</th>
// //                             <th>Instructor</th>
// //                             <th>Actions</th>
// //                         </tr>
// //                         </thead>
// //                         <tbody>
// //                         {batches.map((batch) => (
// //                             <tr key={batch.id}>
// //                                 <td className="batch-name-cell">{batch.batchName}</td>
// //                                 <td>
// //                                     <span className={`status-badge ${(batch.status || "").toLowerCase()}`}>
// //                                         {batch.status}
// //                                     </span>
// //                                 </td>
// //                                 <td>
// //                                     <span className="attendance-badge">{batch.attendanceType}</span>
// //                                 </td>
// //                                 <td className="batch-capacity-cell">{batch.capacity} Students</td>
// //                                 <td className="batch-date-cell">{formatDate(batch.startDate)}</td>
// //                                 <td className="batch-date-cell">{formatDate(batch.endDate)}</td>
// //                                 <td className="batch-instructor-name">{batch.instructorName}</td>
// //                                 <td>
// //                                     <div className="batch-table-actions">
// //                                         <button
// //                                             className="requests-batch-btn"
// //                                             onClick={() => setBatchToViewRequests(batch)}
// //                                         >
// //                                             Requests
// //                                         </button>
// //
// //                                         <button
// //                                             className="assign-student-btn"
// //                                             onClick={() => setBatchToAssignStudent(batch)}
// //                                         >
// //                                             Assign Student
// //                                         </button>
// //
// //                                         <button
// //                                             className="see-students-btn"
// //                                             onClick={() => setSelectedBatchForModal(batch)}
// //                                         >
// //                                             See Students
// //                                         </button>
// //
// //                                         <button
// //                                             className="edit-batch-btn"
// //                                             onClick={() => setBatchToEdit(batch)}
// //                                         >
// //                                             Edit
// //                                         </button>
// //
// //                                         <button
// //                                             className="delete-batch-btn"
// //                                             onClick={() => setBatchToDelete(batch)}
// //                                         >
// //                                             Delete
// //                                         </button>
// //                                     </div>
// //                                 </td>
// //                             </tr>
// //                         ))}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             )}
// //
// //             {selectedBatchForModal && (
// //                 <BatchStudents
// //                     batch={selectedBatchForModal}
// //                     courseId={courseId}
// //                     onClose={() => setSelectedBatchForModal(null)}
// //                 />
// //             )}
// //
// //             {batchToDelete && (
// //                 <div className="confirm-modal-overlay">
// //                     <div className="confirm-modal-content">
// //                         <h3>Delete Batch</h3>
// //                         <p>
// //                             Are you sure you want to delete the batch <strong>{batchToDelete.batchName}</strong>?
// //                             <br/>This action cannot be undone.
// //                         </p>
// //
// //                         <div className="confirm-modal-actions">
// //                             <button
// //                                 className="confirm-cancel-btn"
// //                                 onClick={() => setBatchToDelete(null)}
// //                             >
// //                                 Cancel
// //                             </button>
// //                             <button
// //                                 className="confirm-delete-btn"
// //                                 onClick={confirmDeleteBatch}
// //                             >
// //                                 Delete
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //
// //             {batchToAssignStudent && (
// //                 <AssignStudent
// //                     batch={batchToAssignStudent}
// //                     onClose={() => setBatchToAssignStudent(null)}
// //                     onAssigned={() => {
// //                         fetchBatches();
// //                     }}
// //                 />
// //             )}
// //
// //             {batchToViewRequests && (
// //                 <div className="confirm-modal-overlay">
// //                     <div className="confirm-modal-content">
// //                         <h3>Requests for: {batchToViewRequests.batchName}</h3>
// //                         <p>Pending enrollment requests will be listed here.</p>
// //                         <div className="confirm-modal-actions">
// //                             <button
// //                                 className="confirm-cancel-btn"
// //                                 onClick={() => setBatchToViewRequests(null)}
// //                             >
// //                                 Close
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //
// //             {batchToEdit && (
// //                 <EditBatch
// //                     batchId={batchToEdit.id}
// //                     courseId={courseId}
// //                     onClose={() => setBatchToEdit(null)}
// //                     onBatchUpdated={(updatedBatch) => {
// //                         setBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b));
// //                         fetchBatches();
// //                     }}
// //                 />
// //             )}
// //
// //         </div>
// //     );
// // }
// //
// // export default CourseBatches;
//
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getBatchesByCourseId, softDeleteBatch } from "../../../../api/batchApi.js";
// import { enrollmentRequestApi } from "../../../../api/enrollmentRequestApi"; // <-- استيراد API الطلبات
// import "./CourseBatches.css";
// import BatchStudents from "../BatchStudents/BatchStudents.jsx";
// import EditBatch from "../EditBatch/EditBatch.jsx"
// import AssignStudent from "../AssignStudent/AssignStudent.jsx";
// import { CheckCircle, XCircle } from "lucide-react"; // <-- أيقونات للقبول والرفض
//
// function CourseBatches() {
//     const { courseId } = useParams();
//     const navigate = useNavigate();
//
//     const [batches, setBatches] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     const [batchToDelete, setBatchToDelete] = useState(null);
//     const [selectedBatchForModal, setSelectedBatchForModal] = useState(null);
//     const [batchToAssignStudent, setBatchToAssignStudent] = useState(null);
//     const [batchToEdit, setBatchToEdit] = useState(null);
//
//     // --- States لطلبات الانضمام الخاصة بالدفعة ---
//     const [batchToViewRequests, setBatchToViewRequests] = useState(null);
//     const [batchRequests, setBatchRequests] = useState([]);
//     const [requestsLoading, setRequestsLoading] = useState(false);
//
//     // --- State لتتبع الطلبات المعلقة لكل دفعة (لإظهار النقطة الحمراء) ---
//     const [pendingBatchesMap, setPendingBatchesMap] = useState({});
//
//     const fetchBatches = async () => {
//         try {
//             setLoading(true);
//             const data = await getBatchesByCourseId(courseId);
//             setBatches(data || []);
//
//             // جلب كل الطلبات لفحص أي دفعة تحتوي على طلبات PENDING وإظهار التنبيه
//             try {
//                 const allRequests = await enrollmentRequestApi.getAllRequests();
//                 const map = {};
//                 allRequests.forEach(req => {
//                     if (req.status === "PENDING") {
//                         map[req.batchId] = true;
//                     }
//                 });
//                 setPendingBatchesMap(map);
//             } catch (err) {
//                 console.error("Failed to check pending notifications", err);
//             }
//
//         } catch (err) {
//             console.error("Fetch batches error:", err);
//             if (err.response?.status === 403) {
//                 setError("Access denied: Admin permissions required.");
//             } else {
//                 setError("Failed to fetch batches. Please try again.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const confirmDeleteBatch = async () => {
//         if (!batchToDelete) return;
//         try {
//             await softDeleteBatch(batchToDelete.id);
//             setBatches((prevBatches) => prevBatches.filter((b) => b.id !== batchToDelete.id));
//             setBatchToDelete(null);
//         } catch (err) {
//             console.error(err);
//             alert("Failed to delete batch.");
//         }
//     };
//
//     // --- جلب طلبات دفعة معينة عند الضغط على زر Requests ---
//     const handleOpenRequestsModal = async (batch) => {
//         setBatchToViewRequests(batch);
//         try {
//             setRequestsLoading(true);
//             const allRequests = await enrollmentRequestApi.getAllRequests();
//             // تصفية الطلبات الخاصة بهذه الدفعة فقط
//             const filtered = allRequests.filter(req => req.batchId === batch.id);
//             setBatchRequests(filtered);
//         } catch (err) {
//             console.error("Failed to fetch requests", err);
//         } finally {
//             setRequestsLoading(false);
//         }
//     };
//
//     // --- قبول الطلب من لوحة الدفعة ---
//     const handleAcceptRequest = async (requestId) => {
//         try {
//             await enrollmentRequestApi.acceptRequest(requestId);
//             // تحديث القائمة محلياً
//             setBatchRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "ACCEPTED" } : r));
//             fetchBatches(); // تحديث الخريطة لإزالة النقطة الحمراء لو خلصت الطلبات
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to accept request.");
//         }
//     };
//
//     // --- رفض الطلب من لوحة الدفعة ---
//     const handleDeclineRequest = async (requestId) => {
//         try {
//             await enrollmentRequestApi.declineRequest(requestId);
//             setBatchRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "DECLINED" } : r));
//             fetchBatches();
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to decline request.");
//         }
//     };
//
//     useEffect(() => {
//         if (courseId) {
//             fetchBatches();
//         }
//     }, [courseId]);
//
//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A";
//         return new Date(dateString).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         });
//     };
//
//     if (loading) {
//         return <div className="course-batches-loading">Loading Batches...</div>;
//     }
//
//     if (error) {
//         return (
//             <div className="course-batches-container">
//                 <div className="error-message">
//                     <p>{error}</p>
//                     <button
//                         type="button"
//                         onClick={() => navigate(-1)}
//                         className="batches-back-btn"
//                     >
//                         ← Go Back
//                     </button>
//                 </div>
//             </div>
//         );
//     }
//
//     const courseTitle = batches.length > 0 ? batches[0].courseName : "Course Batches";
//
//     return (
//         <div className="course-batches-container">
//             <div className="course-batches-header">
//                 <div className="course-batches-header-top">
//                     <button
//                         type="button"
//                         className="batches-back-btn"
//                         onClick={() => navigate(-1)}
//                     >
//                         ← Back to Category Courses
//                     </button>
//
//                     <button
//                         type="button"
//                         className="batches-create-btn"
//                         onClick={() => navigate(`/admin/courses/${courseId}/batches/create`)}
//                     >
//                         + Create New Batch
//                     </button>
//                 </div>
//
//                 <div className="course-batches-title">
//                     <h1>{courseTitle}</h1>
//                     <p>Showing all scheduled batches, capacities, and assigned instructors</p>
//                 </div>
//             </div>
//
//             {batches.length === 0 ? (
//                 <div className="no-batches">
//                     <p>No batches found for this course.</p>
//                     <button
//                         type="button"
//                         className="batches-create-first-btn"
//                         onClick={() => navigate(`/admin/courses/${courseId}/batches/create`)}
//                     >
//                         Create First Batch
//                     </button>
//                 </div>
//             ) : (
//                 <div className="batches-table-wrapper">
//                     <table className="batches-table">
//                         <thead>
//                         <tr>
//                             <th>Batch Name</th>
//                             <th>Status</th>
//                             <th>Attendance</th>
//                             <th>Capacity</th>
//                             <th>Start Date</th>
//                             <th>End Date</th>
//                             <th>Instructor</th>
//                             <th>Actions</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {batches.map((batch) => {
//                             // التحقق مما إذا كانت هذه الدفعة تحتوي على طلبات معلقة
//                             const hasPending = pendingBatchesMap[batch.id];
//
//                             return (
//                                 <tr key={batch.id}>
//                                     <td className="batch-name-cell">{batch.batchName}</td>
//                                     <td>
//                                         <span className={`status-badge ${(batch.status || "").toLowerCase()}`}>
//                                             {batch.status}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         <span className="attendance-badge">{batch.attendanceType}</span>
//                                     </td>
//                                     <td className="batch-capacity-cell">{batch.capacity} Students</td>
//                                     <td className="batch-date-cell">{formatDate(batch.startDate)}</td>
//                                     <td className="batch-date-cell">{formatDate(batch.endDate)}</td>
//                                     <td className="batch-instructor-name">{batch.instructorName}</td>
//                                     <td>
//                                         <div className="batch-table-actions">
//
//                                             {/* زر الطلبات مع النقطة الحمراء التنبيهية */}
//                                             <div style={{ position: "relative", display: "inline-block" }}>
//                                                 <button
//                                                     className="requests-batch-btn"
//                                                     onClick={() => handleOpenRequestsModal(batch)}
//                                                 >
//                                                     Requests
//                                                 </button>
//                                                 {hasPending && (
//                                                     <span style={{
//                                                         position: "absolute",
//                                                         top: "-4px",
//                                                         right: "-4px",
//                                                         width: "10px",
//                                                         height: "10px",
//                                                         backgroundColor: "#ef4444",
//                                                         borderRadius: "50%",
//                                                         border: "2px solid #fff"
//                                                     }} />
//                                                 )}
//                                             </div>
//
//                                             <button
//                                                 className="assign-student-btn"
//                                                 onClick={() => setBatchToAssignStudent(batch)}
//                                             >
//                                                 Assign Student
//                                             </button>
//
//                                             <button
//                                                 className="see-students-btn"
//                                                 onClick={() => setSelectedBatchForModal(batch)}
//                                             >
//                                                 See Students
//                                             </button>
//
//                                             <button
//                                                 className="edit-batch-btn"
//                                                 onClick={() => setBatchToEdit(batch)}
//                                             >
//                                                 Edit
//                                             </button>
//
//                                             <button
//                                                 className="delete-batch-btn"
//                                                 onClick={() => setBatchToDelete(batch)}
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//
//             {selectedBatchForModal && (
//                 <BatchStudents
//                     batch={selectedBatchForModal}
//                     courseId={courseId}
//                     onClose={() => setSelectedBatchForModal(null)}
//                 />
//             )}
//
//             {batchToDelete && (
//                 <div className="confirm-modal-overlay">
//                     <div className="confirm-modal-content">
//                         <h3>Delete Batch</h3>
//                         <p>
//                             Are you sure you want to delete the batch <strong>{batchToDelete.batchName}</strong>?
//                             <br/>This action cannot be undone.
//                         </p>
//
//                         <div className="confirm-modal-actions">
//                             <button
//                                 className="confirm-cancel-btn"
//                                 onClick={() => setBatchToDelete(null)}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 className="confirm-delete-btn"
//                                 onClick={confirmDeleteBatch}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             {batchToAssignStudent && (
//                 <AssignStudent
//                     batch={batchToAssignStudent}
//                     onClose={() => setBatchToAssignStudent(null)}
//                     onAssigned={() => {
//                         fetchBatches();
//                     }}
//                 />
//             )}
//
//             {/* --- نافذة عرض وإدارة طلبات الانضمام للدفعة --- */}
//             {batchToViewRequests && (
//                 <div className="confirm-modal-overlay">
//                     <div className="confirm-modal-content" style={{ maxWidth: "700px", width: "90%" }}>
//                         <h3>Requests for: {batchToViewRequests.batchName}</h3>
//
//                         {requestsLoading ? (
//                             <p style={{ padding: "20px", textAlign: "center" }}>Loading requests...</p>
//                         ) : batchRequests.length === 0 ? (
//                             <p style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>No requests found for this batch.</p>
//                         ) : (
//                             <div style={{ maxHeight: "350px", overflowY: "auto", margin: "15px 0", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
//                                 <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
//                                     <thead>
//                                     <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
//                                         <th style={{ padding: "10px" }}>Student</th>
//                                         <th style={{ padding: "10px" }}>Status</th>
//                                         <th style={{ padding: "10px", textAlign: "center" }}>Actions</th>
//                                     </tr>
//                                     </thead>
//                                     <tbody>
//                                     {batchRequests.map((req) => (
//                                         <tr key={req.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
//                                             <td style={{ padding: "10px" }}>
//                                                 <div style={{ fontWeight: "500" }}>{req.studentName}</div>
//                                                 <div style={{ fontSize: "12px", color: "#64748b" }}>{req.studentEmail}</div>
//                                             </td>
//                                             <td style={{ padding: "10px" }}>
//                                                     <span style={{
//                                                         fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "9999px",
//                                                         backgroundColor: req.status === "PENDING" ? "#fef3c7" : req.status === "ACCEPTED" ? "#d1fae5" : "#fee2e2",
//                                                         color: req.status === "PENDING" ? "#d97706" : req.status === "ACCEPTED" ? "#059669" : "#dc2626"
//                                                     }}>
//                                                         {req.status}
//                                                     </span>
//                                             </td>
//                                             <td style={{ padding: "10px", textAlign: "center" }}>
//                                                 {req.status === "PENDING" ? (
//                                                     <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
//                                                         <button
//                                                             onClick={() => handleAcceptRequest(req.id)}
//                                                             style={{ background: "#059669", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}
//                                                         >
//                                                             <CheckCircle size={12} /> Accept
//                                                         </button>
//                                                         <button
//                                                             onClick={() => handleDeclineRequest(req.id)}
//                                                             style={{ background: "#dc2626", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}
//                                                         >
//                                                             <XCircle size={12} /> Decline
//                                                         </button>
//                                                     </div>
//                                                 ) : (
//                                                     <span style={{ color: "#94a3b8", fontSize: "12px" }}>Processed</span>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//
//                         <div className="confirm-modal-actions">
//                             <button
//                                 className="confirm-cancel-btn"
//                                 onClick={() => setBatchToViewRequests(null)}
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             {batchToEdit && (
//                 <EditBatch
//                     batchId={batchToEdit.id}
//                     courseId={courseId}
//                     onClose={() => setBatchToEdit(null)}
//                     onBatchUpdated={(updatedBatch) => {
//                         setBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b));
//                         fetchBatches();
//                     }}
//                 />
//             )}
//
//         </div>
//     );
// }
//
// export default CourseBatches;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBatchesByCourseId, softDeleteBatch, regenerateBatchCode } from "../../../../api/batchApi.js"; // <-- إضافة دالة التجديد
import { enrollmentRequestApi } from "../../../../api/enrollmentRequestApi";
import "./CourseBatches.css";
import BatchStudents from "../BatchStudents/BatchStudents.jsx";
import EditBatch from "../EditBatch/EditBatch.jsx"
import AssignStudent from "../AssignStudent/AssignStudent.jsx";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"; // <-- أيقونة التجديد

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
    const [batchRequests, setBatchRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [pendingBatchesMap, setPendingBatchesMap] = useState({});

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const data = await getBatchesByCourseId(courseId);
            setBatches(data || []);

            try {
                const allRequests = await enrollmentRequestApi.getAllRequests();
                const map = {};
                allRequests.forEach(req => {
                    if (req.status === "PENDING") {
                        map[req.batchId] = true;
                    }
                });
                setPendingBatchesMap(map);
            } catch (err) {
                console.error("Failed to check pending notifications", err);
            }

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

    // --- دالة تجديد الكود ---
    const handleRegenerateCode = async (batchId) => {
        try {
            await regenerateBatchCode(batchId);
            fetchBatches(); // تحديث القائمة لعرض الكود الجديد
        } catch (err) {
            alert("Failed to regenerate batch code.");
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

    const handleOpenRequestsModal = async (batch) => {
        setBatchToViewRequests(batch);
        try {
            setRequestsLoading(true);
            const allRequests = await enrollmentRequestApi.getAllRequests();
            const filtered = allRequests.filter(req => req.batchId === batch.id);
            setBatchRequests(filtered);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setRequestsLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await enrollmentRequestApi.acceptRequest(requestId);
            setBatchRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "ACCEPTED" } : r));
            fetchBatches();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to accept request.");
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            await enrollmentRequestApi.declineRequest(requestId);
            setBatchRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "DECLINED" } : r));
            fetchBatches();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to decline request.");
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
                    <button type="button" onClick={() => navigate(-1)} className="batches-back-btn">
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
                    <button type="button" className="batches-back-btn" onClick={() => navigate(-1)}>
                        ← Back to Category Courses
                    </button>
                    <button type="button" className="batches-create-btn" onClick={() => navigate(`/admin/courses/${courseId}/batches/create`)}>
                        + Create New Batch
                    </button>
                </div>

                <div className="course-batches-title">
                    <h1>{courseTitle}</h1>
                    <p>Showing all scheduled batches, codes, capacities, and assigned instructors</p>
                </div>
            </div>

            {batches.length === 0 ? (
                <div className="no-batches">
                    <p>No batches found for this course.</p>
                    <button type="button" className="batches-create-first-btn" onClick={() => navigate(`/admin/courses/${courseId}/batches/create`)}>
                        Create First Batch
                    </button>
                </div>
            ) : (
                <div className="batches-table-wrapper">
                    <table className="batches-table">
                        <thead>
                        <tr>
                            <th>Batch Name</th>
                            <th>Batch Code</th> 
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
                        {batches.map((batch) => {
                            const hasPending = pendingBatchesMap[batch.id];

                            return (
                                <tr key={batch.id}>
                                    <td className="batch-name-cell">{batch.batchName}</td>

                                    {/* --- عرض الكود وزر التجديد --- */}
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <code style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px", color: "#0f172a" }}>
                                                {batch.batchCode || "N/A"}
                                            </code>
                                            <button
                                                title="Regenerate Code"
                                                onClick={() => handleRegenerateCode(batch.id)}
                                                style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", padding: "2px", display: "flex", alignItems: "center" }}
                                            >
                                                <RefreshCw size={14} />
                                            </button>
                                        </div>
                                    </td>

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
                                            <div style={{ position: "relative", display: "inline-block" }}>
                                                <button className="requests-batch-btn" onClick={() => handleOpenRequestsModal(batch)}>
                                                    Requests
                                                </button>
                                                {hasPending && (
                                                    <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "10px", height: "10px", backgroundColor: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }} />
                                                )}
                                            </div>

                                            <button className="assign-student-btn" onClick={() => setBatchToAssignStudent(batch)}>
                                                Assign Student
                                            </button>

                                            <button className="see-students-btn" onClick={() => setSelectedBatchForModal(batch)}>
                                                See Students
                                            </button>

                                            <button className="edit-batch-btn" onClick={() => setBatchToEdit(batch)}>
                                                Edit
                                            </button>

                                            <button className="delete-batch-btn" onClick={() => setBatchToDelete(batch)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedBatchForModal && (
                <BatchStudents batch={selectedBatchForModal} courseId={courseId} onClose={() => setSelectedBatchForModal(null)} />
            )}

            {batchToDelete && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-content">
                        <h3>Delete Batch</h3>
                        <p>Are you sure you want to delete the batch <strong>{batchToDelete.batchName}</strong>?<br/>This action cannot be undone.</p>
                        <div className="confirm-modal-actions">
                            <button className="confirm-cancel-btn" onClick={() => setBatchToDelete(null)}>Cancel</button>
                            <button className="confirm-delete-btn" onClick={confirmDeleteBatch}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {batchToAssignStudent && (
                <AssignStudent batch={batchToAssignStudent} onClose={() => setBatchToAssignStudent(null)} onAssigned={() => fetchBatches()} />
            )}

            {batchToViewRequests && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-content" style={{ maxWidth: "700px", width: "90%" }}>
                        <h3>Requests for: {batchToViewRequests.batchName}</h3>
                        {requestsLoading ? (
                            <p style={{ padding: "20px", textAlign: "center" }}>Loading requests...</p>
                        ) : batchRequests.length === 0 ? (
                            <p style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>No requests found for this batch.</p>
                        ) : (
                            <div style={{ maxHeight: "350px", overflowY: "auto", margin: "15px 0", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                                    <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                        <th style={{ padding: "10px" }}>Student</th>
                                        <th style={{ padding: "10px" }}>Status</th>
                                        <th style={{ padding: "10px", textAlign: "center" }}>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {batchRequests.map((req) => (
                                        <tr key={req.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "10px" }}>
                                                <div style={{ fontWeight: "500" }}>{req.studentName}</div>
                                                <div style={{ fontSize: "12px", color: "#64748b" }}>{req.studentEmail}</div>
                                            </td>
                                            <td style={{ padding: "10px" }}>
                                                    <span style={{ fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "9999px", backgroundColor: req.status === "PENDING" ? "#fef3c7" : req.status === "ACCEPTED" ? "#d1fae5" : "#fee2e2", color: req.status === "PENDING" ? "#d97706" : req.status === "ACCEPTED" ? "#059669" : "#dc2626" }}>
                                                        {req.status}
                                                    </span>
                                            </td>
                                            <td style={{ padding: "10px", textAlign: "center" }}>
                                                {req.status === "PENDING" ? (
                                                    <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                                                        <button onClick={() => handleAcceptRequest(req.id)} style={{ background: "#059669", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
                                                            <CheckCircle size={12} /> Accept
                                                        </button>
                                                        <button onClick={() => handleDeclineRequest(req.id)} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
                                                            <XCircle size={12} /> Decline
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: "#94a3b8", fontSize: "12px" }}>Processed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="confirm-modal-actions">
                            <button className="confirm-cancel-btn" onClick={() => setBatchToViewRequests(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {batchToEdit && (
                <EditBatch batchId={batchToEdit.id} courseId={courseId} onClose={() => setBatchToEdit(null)} onBatchUpdated={(updatedBatch) => { setBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b)); fetchBatches(); }} />
            )}
        </div>
    );
}

export default CourseBatches;