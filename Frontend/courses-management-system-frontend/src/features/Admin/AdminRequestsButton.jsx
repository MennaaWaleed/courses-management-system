import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enrollmentRequestApi } from "../../api/enrollmentRequestApi";

export default function AdminRequestsButton() {
    const navigate = useNavigate();
    const [hasPending, setHasPending] = useState(false);

    useEffect(() => {
        const checkPendingRequests = async () => {
            try {
                const data = await enrollmentRequestApi.getAllRequests();
                // التحقق مما إذا كان هناك أي طلب معلق (PENDING)
                const pendingExists = data.some(req => req.status === "PENDING");
                setHasPending(pendingExists);
            } catch (err) {
                console.error("Failed to check requests", err);
            }
        };

        checkPendingRequests();
        // يمكنك تفعيل Interval إذا أردت تحديث التنبيه كل فترة قصيرة
    }, []);

    return (
        <button
            onClick={() => navigate("/admin/enrollment-requests")}
            style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#ecfdf5",
                color: "#047857",
                border: "1px solid #a7f3d0",
                padding: "6px 14px",
                borderRadius: "6px",
                fontWeight: "500",
                cursor: "pointer",
                fontSize: "14px"
            }}
        >
            Requests
            {/* النقطة الحمراء التنبيهية */}
            {hasPending && (
                <span style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#ef4444",
                    borderRadius: "50%",
                    border: "2px solid #fff"
                }} />
            )}
        </button>
    );
}