import "../Register/Register.css";
import logo from "../../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../api/axios";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email) {
            setErrorMessage("Please enter your email address.");
            return;
        }

        try {
            setIsLoading(true);
            await api.post("/auth/forgot-password", { email });

            // Will only navigate if the backend returns 200 OK
            navigate("/auth/verify-email", { state: { email: email, isReset: true } });

        } catch (error) {
            // NEW: Extract the actual backend message to show "This email is not registered."
            const backendMessage = error.response?.data?.message || "Something went wrong. Please try again later.";
            setErrorMessage(backendMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="register">
            <div className="register__card">
                <img src={logo} alt="MTC Logo" className="register__logo" />
                <h1 className="register__title">Reset Password</h1>
                <p className="register__subtitle">Enter your email and we'll send you a reset code.</p>

                {errorMessage && <div className="register__error" style={{ color: 'red', marginBottom: '15px' }}>{errorMessage}</div>}

                <form className="register__form" onSubmit={handleForgotPassword}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button type="submit" disabled={isLoading} style={{ marginTop: '10px' }}>
                        {isLoading ? "Sending..." : "Send Reset Code"}
                    </button>
                </form>

                <p className="register__login-text">
                    Remember your password?{" "}
                    <Link to="/auth/login" className="register__login-link">Login here</Link>
                </p>
            </div>
        </section>
    );
}

export default ForgotPassword;