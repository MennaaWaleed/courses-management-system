import Navbar from "./components/layout/Navbar/Navbar";

import HomePage from "./pages/HomePage";
import ContactUs from "./pages/ContactUs";

import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactUs />} />
            </Routes>
        </>
    );
}

export default App;