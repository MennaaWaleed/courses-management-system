import Navbar from "./components/layout/Navbar/Navbar";

import HomePage from "./pages/HomePage";
import ContactUs from "./pages/ContactUs";
import Login from "./features/auth/Login/Login";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/auth/login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;