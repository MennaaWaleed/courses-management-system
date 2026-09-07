import React from "react";
import AdminCategories from "../../features/Admin/AdminCategories/AdminCategories.jsx";
import "./AdminHome.css";
import { Users, MessageSquare, ClipboardList } from "lucide-react"; // <-- Added MessageSquare
import { useNavigate } from "react-router-dom";

function AdminHome() {
    const navigate = useNavigate();

    return (
        <div className="admin-home-container">

            <header className="admin-dashboard-header">
                <div className="admin-dashboard-header__text">
                    <h1 className="admin-dashboard-header__title">Admin Dashboard</h1>
                    <p className="admin-dashboard-header__subtitle">System overview and management controls</p>
                </div>

                <div className="admin-dashboard-header__actions" style={{ display: 'flex', gap: '12px' }}>

                    <button
                        className="admin-dashboard-header__btn"
                        onClick={() => navigate('/admin/messages')} // Adjust this route if needed
                    >
                        <MessageSquare size={18} strokeWidth={2.5} />
                        View Messages
                    </button>

                    <button 
                        className="admin-dashboard-header__btn" 
                        onClick={() => navigate("/admin/course-registrations")}
                    >
                        <ClipboardList size={18} strokeWidth={2.5} />
                        Course Registrations
                    </button>
                    <button
                        className="admin-dashboard-header__btn"
                        onClick={() => navigate('/admin/instructors')}
                    >
                        <Users size={18} strokeWidth={2.5} />
                        Manage Instructors
                    </button>
                </div>
            </header>

            <AdminCategories />

        </div>
    );
}

export default AdminHome;
