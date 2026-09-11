import { useState, useEffect } from "react";
import "./Login.css";
import api from "../../../api/axios.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/images/logo.webp";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [needsVerification, setNeedsVerification] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setErrorMessage("");
        setSuccessMessage("");
        setNeedsVerification(false);
        setIsLoading(true);

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
            const backendMessage =
                error.response?.data?.message || error.response?.data;

            if (
                backendMessage &&
                typeof backendMessage === "string" &&
                backendMessage.includes("verify your email")
            ) {
                setErrorMessage("Your account is not verified.");
                setNeedsVerification(true);
            } else if (error.response) {
                setErrorMessage("Invalid email or password.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <form className="login-form" onSubmit={handleLogin}>

                <img
                    src={logo}
                    alt="App Logo"
                    className="login-logo"
                />

                <h1>Login</h1>

                {successMessage && (
                    <p className="success-message">
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
                    autoComplete="email"
                />

                <div className="password-input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMessage("");
                        }}
                        autoComplete="current-password"
                    />

                    <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        title={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            // Eye with slash
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d="M3 3l18 18"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a16.8 16.8 0 0 1-3.1 3.8M6.1 6.1C3.7 7.7 3 12 3 12s3.5 7 9 7c1.2 0 2.3-.2 3.3-.7"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            // Normal eye
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {errorMessage && (
                    <div className="login-error-container">
                        <p className="error-message">
                            {errorMessage}
                        </p>

                        {needsVerification && (
                            <button
                                type="button"
                                className="verify-email-btn"
                                onClick={() =>
                                    navigate(
                                        "/auth/verify-email",
                                        {
                                            state: {
                                                email: email,
                                                isReset: false
                                            }
                                        }
                                    )
                                }
                            >
                                Verify Email Now
                            </button>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    className="login-btn"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                <p className="signup-text forgot-password">
                    <Link to="/auth/forgot-password">
                        Forgot your password?
                    </Link>
                </p>

                <p className="signup-text">
                    Don't have an account?{" "}
                    <Link
                        to="/auth/register"
                        className="signup-link"
                    >
                        Sign Up
                    </Link>
                </p>

            </form>
        </div>
    );
}

export default Login;