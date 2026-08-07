import { useState } from "react"; // 1. Removed useEffect
import Navbar from "./components/layout/Navbar/Navbar";

import HomePage from "./pages/HomePage";
import ContactUs from "./pages/ContactUs";
import Login from "./features/auth/Login/Login";
import { Routes, Route } from "react-router-dom";
import Register from "./features/auth/Register/Register";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = sessionStorage.getItem("token");
        return !!token;
    });

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactUs />} />

                <Route path="/auth/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route
                    path="/auth/register"
                    element={<Register setIsLoggedIn={setIsLoggedIn} />}
                />
            </Routes>
        </>
    );
}

export default App;