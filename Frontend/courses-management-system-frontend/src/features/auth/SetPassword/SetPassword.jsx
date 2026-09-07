import "../Register/Register.css";
import logo from "../../../assets/images/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Eye, EyeOff } from "lucide-react";

function SetPassword({ setIsLoggedIn }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || sessionStorage.getItem("pendingEmail") || "";

    useEffect(() => {
        if (!email) {
            navigate("/auth/register");
        } else {
            sessionStorage.setItem("pendingEmail", email);
        }
    }, [email, navigate]);

    const handleSetPassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setFieldErrors({});

        if (!password || !confirmPassword) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            setIsLoading(true);

            await api.post("/auth/set-password", { email, password });

            const loginResponse = await api.post("/auth/login", { email, password });

            sessionStorage.setItem("token", loginResponse.data.token);
            sessionStorage.setItem("role", loginResponse.data.role);
            sessionStorage.removeItem("pendingEmail");

            setIsLoggedIn(true);

            setSuccessMessage("Account created successfully! Logging you in...");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            const backendMessage = error.response?.data?.message || "";

            if (backendMessage.toLowerCase().includes("already been set")) {
                navigate("/auth/login", { state: { message: "Your password is already set. Please log in." } });
            } else if (error.response?.status === 400 && error.response?.data && !backendMessage) {
                setFieldErrors(error.response.data);
            } else {
                setErrorMessage(backendMessage || "Failed to set password. Try again.");
            }
            setIsLoading(false);
        }
    };

    return (
        <section className="register">
            <div className="register__card">
                <img src={logo} alt="MTC Logo" className="register__logo" />
                <h1 className="register__title">Set Password</h1>
                <p className="register__subtitle">Create a secure password for your account.</p>

                {errorMessage && <div className="register__error" style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{errorMessage}</div>}

                {successMessage && (
                    <div className="register__success" style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>
                        {successMessage}
                    </div>
                )}

                <form className="register__form" onSubmit={handleSetPassword}>
                    <div className="register__field">
                        <div className="register__password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setFieldErrors({}); }}
                            />
                            <button
                                type="button"
                                className="register__password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                            </button>
                        </div>
                        {fieldErrors.password && <span className="register__field-error">{fieldErrors.password}</span>}
                    </div>

                    <div className="register__password-wrapper" style={{ marginTop: '15px' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={isLoading} style={{ marginTop: '20px' }}>
                        {isLoading ? "Saving..." : "Complete Registration"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default SetPassword;