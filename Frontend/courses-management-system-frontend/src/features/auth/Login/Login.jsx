import { useState } from "react";
import "./Login.css";
import api from "../../../api/axios.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

function Login({setIsLoggedIn}) {
    console.log("Login rendered");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}
            {successMessage && (
                <p className="success-message">{successMessage}</p>
            )}
                <button onClick={handleLogin}>
                    Login
                </button>
            <p className="signup-text">
                Don't have an account?
                <Link to="/auth/register" className="signup-link">
                    Sign Up
                </Link>
            </p>
            </div>

    );
}

export default Login;