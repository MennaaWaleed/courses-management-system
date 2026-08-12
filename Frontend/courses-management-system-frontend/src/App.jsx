import { useState } from "react"; // 1. Removed useEffect
import Navbar from "./components/layout/Navbar/Navbar";

import HomePage from "./pages/HomePage";
import ContactUs from "./pages/ContactUs";
import Courses from "./pages/Courses/Courses";
import Login from "./features/auth/Login/Login";
import { Routes, Route } from "react-router-dom";
import Register from "./features/auth/Register/Register";
import AdminRoute from "./components/auth/AdminRoute";
import AdminCategories from "./features/Admin/AdminCategories";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = sessionStorage.getItem("token");
        return !!token;
    });

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");

        setIsLoggedIn(false);
    };

    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/contact" element={<ContactUs />} />

                    <Route
                        path="/auth/login"
                        element={<Login setIsLoggedIn={setIsLoggedIn} />}
                    />

                    <Route
                        path="/auth/register"a
                        element={<Register setIsLoggedIn={setIsLoggedIn} />}
                    />

                    <Route path="/courses" element={<Courses />} />

                    <Route
                        path="/admin/categories"
                        element={
                            <AdminRoute>
                                <AdminCategories />
                            </AdminRoute>
                        }
                    />

                </Routes>
            </main>
        </>
    );
}

export default App;