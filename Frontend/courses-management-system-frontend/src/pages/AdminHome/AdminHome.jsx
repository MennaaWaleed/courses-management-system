import AdminCategories from "../../features/Admin/AdminCategories";
import "./AdminHome.css";

function AdminHome() {
    return (
        <>
            <h1 className="main-dashboard-title">Admin Dashboard</h1>

            <AdminCategories />
        </>
    );
}

export default AdminHome;