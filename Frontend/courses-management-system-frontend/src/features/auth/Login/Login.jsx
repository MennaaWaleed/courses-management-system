import { useState } from "react";
import "./Login.css";
import api from "../../../api/axios.js";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { Eye, EyeOff } from "lucide-react";

function Login({ setIsLoggedIn }) {
    console.log("Login rendered");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

            console.log(response.data);

            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("role", response.data.role);

            setSuccessMessage("Login successful!");
            setIsLoggedIn(true);

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            console.error(error);

            if (error.response) {
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

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {/* Wrapped password input to position the toggle button */}
            <div className="password-input-container">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </button>
            </div>

            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}

            {successMessage && (
                <p className="success-message">{successMessage}</p>
            )}

            <button className="login-btn" onClick={handleLogin}>
                Login
            </button>

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