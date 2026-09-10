import React from "react";
import AdminCategories from "../../features/Admin/AdminCategories/AdminCategories.jsx";
import "./AdminHome.css";
import { Users, MessageSquare, ClipboardList, Layers } from "lucide-react";
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


            </header>

            <AdminCategories />

        </div>
    );
}

export default AdminHome;