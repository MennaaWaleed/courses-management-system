import { useState, useEffect } from "react";
import "./Login.css";
import api from "../../../api/axios.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

function Login({ setIsLoggedIn }) {
    console.log("Login rendered");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [needsVerification, setNeedsVerification] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleLogin = async () => {
        setErrorMessage("");
        setSuccessMessage("");
        setNeedsVerification(false);

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("role", response.data.role);

            setSuccessMessage("Login successful!");
            setIsLoggedIn(true);

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            const backendMessage = error.response?.data?.message || error.response?.data;

            if (backendMessage && typeof backendMessage === 'string' && backendMessage.includes("verify your email")) {
                setErrorMessage("Your account is not verified.");
                setNeedsVerification(true);
            } else if (error.response) {
                setErrorMessage("Invalid email or password.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="login">
            <img src={logo} alt="App Logo" className="login-logo" />

            <h1>Login</h1>

            {successMessage && (
                <p className="success-message" style={{ color: "green", marginBottom: "15px", fontWeight: "bold" }}>
                    {successMessage}
                </p>
            )}

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage("");
                }}
            />

            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                }}
            />

            {errorMessage && (
                <div style={{ marginBottom: "15px" }}>
                    <p className="error-message" style={{ color: "red", margin: "0 0 5px 0" }}>
                        {errorMessage}
                    </p>
                    {needsVerification && (
                        <button
                            type="button"
                            onClick={() => navigate("/auth/verify-email", { state: { email: email, isReset: false } })}
                            style={{ background: "none", border: "none", color: "#007bff", textDecoration: "underline", cursor: "pointer", padding: 0 }}
                        >
                            Verify Email Now
                        </button>
                    )}
                </div>
            )}

            <button onClick={handleLogin}>
                Login
            </button>

            {/* NEW: Forgot Password Link */}
            <p className="signup-text" style={{ marginTop: "8px", marginBottom: "0" }}>
                <Link to="/auth/forgot-password" style={{ color: "#6b7280", fontWeight: "normal" }}>
                    Forgot your password?
                </Link>
            </p>

            <p className="signup-text">
                Don't have an account?{" "}
                <Link to="/auth/register" className="signup-link">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}

export default Login;