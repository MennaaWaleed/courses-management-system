import "./Register.css";
import logo from "../../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../api/axios";
import { Eye, EyeOff } from "lucide-react";

function Register({setIsLoggedIn}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            setErrorMessage("Please enter a valid phone number.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await api.post("/auth/register", {
                firstName,
                lastName,
                email,
                phone,
                password
            });

            if (response.data && response.data.token) {
                sessionStorage.setItem("token", response.data.token);
            }

            setErrorMessage("");
            setSuccessMessage("Registration successful! ");
            setIsLoggedIn(true);

            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            setSuccessMessage("");
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Registration failed. Please try again.");
            }

            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }
    };

    return (
        <section className="register">
            <div className="register__card">
                <img
                    src={logo}
                    alt="MTC Logo"
                    className="register__logo"
                />

                <h1 className="register__title">
                    Create Account
                </h1>

                <p className="register__subtitle">
                    Join us and start learning today.
                </p>

                {errorMessage && (
                    <div style={{ color: "red", marginTop: "15px", fontWeight: "bold" }}>
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div style={{ color: "green", marginTop: "15px", fontWeight: "bold" }}>
                        {successMessage}
                    </div>
                )}

                <form className="register__form" onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <div className="register__password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="register__password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                        </button>
                    </div>

                    <div className="register__password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit">
                        Register
                    </button>
                </form>

                <p className="register__login-text">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="register__login-link">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
}

export default Register;