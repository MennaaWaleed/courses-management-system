import "../Register/Register.css";
import logo from "../../../assets/images/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Eye, EyeOff, Check, X } from "lucide-react";

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

    const email =
        location.state?.email ||
        sessionStorage.getItem("pendingEmail") ||
        "";

    useEffect(() => {
        if (!email) {
            navigate("/auth/register");
        } else {
            sessionStorage.setItem("pendingEmail", email);
        }
    }, [email, navigate]);

    const passwordRules = {
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=~`';]/.test(password)
    };

    const isPasswordValid =
        passwordRules.minLength &&
        passwordRules.uppercase &&
        passwordRules.lowercase &&
        passwordRules.number &&
        passwordRules.special;

    const handleSetPassword = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setErrorMessage("");
        setSuccessMessage("");
        setFieldErrors({});

        if (!password || !confirmPassword) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (!isPasswordValid) {
            setErrorMessage("Please meet all password requirements.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            setIsLoading(true);

            const response = await api.post("/auth/set-password", {
                email,
                password
            });

            sessionStorage.setItem(
                "token",
                response.data.token
            );

            sessionStorage.setItem(
                "role",
                response.data.role
            );

            setSuccessMessage(
                "Password set successfully! Logging you in..."
            );

            if (typeof setIsLoggedIn === "function") {
                setIsLoggedIn(true);
            }

            setTimeout(() => {
                sessionStorage.removeItem("pendingEmail");

                navigate("/", {
                    replace: true
                });
            }, 1000);

        } catch (error) {
            const backendMessage =
                error.response?.data?.message ||
                error.response?.data ||
                "";

            if (
                typeof backendMessage === "string" &&
                backendMessage.includes("already been set")
            ) {
                if (typeof setIsLoggedIn === "function") {
                    setIsLoggedIn(true);
                }

                navigate("/", {
                    replace: true
                });

            } else if (
                error.response?.status === 400 &&
                error.response?.data &&
                typeof error.response.data === "object"
            ) {
                setFieldErrors(error.response.data);

            } else {
                setErrorMessage(
                    typeof backendMessage === "string" &&
                    backendMessage
                        ? backendMessage
                        : "Failed to set password. Please try again."
                );
            }

        } finally {
            setIsLoading(false);
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
                    Set Password
                </h1>

                <p className="register__subtitle">
                    Create a secure password for your account.
                </p>

                {errorMessage && (
                    <div
                        className="register__error"
                        style={{
                            color: "red",
                            marginBottom: "15px",
                            fontWeight: "bold"
                        }}
                    >
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div
                        className="register__success"
                        style={{
                            color: "green",
                            marginBottom: "15px",
                            fontWeight: "bold"
                        }}
                    >
                        {successMessage}
                    </div>
                )}

                <form
                    className="register__form"
                    onSubmit={handleSetPassword}
                >
                    <div className="register__field">

                        <div className="register__password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrorMessage("");
                                    setFieldErrors({});
                                }}
                            />

                            <button
                                type="button"
                                className="register__password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword ? (
                                    <EyeOff
                                        size={20}
                                        color="#6b7280"
                                    />
                                ) : (
                                    <Eye
                                        size={20}
                                        color="#6b7280"
                                    />
                                )}
                            </button>

                        </div>

                        <div
                            className="password-rules"
                            style={{
                                marginTop: "10px",
                                fontSize: "14px"
                            }}
                        >
                            <div
                                style={{
                                    color: passwordRules.minLength
                                        ? "green"
                                        : "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                {passwordRules.minLength ? (
                                    <Check size={16} />
                                ) : (
                                    <X size={16} />
                                )}
                                At least 8 characters
                            </div>

                            <div
                                style={{
                                    color: passwordRules.uppercase
                                        ? "green"
                                        : "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                {passwordRules.uppercase ? (
                                    <Check size={16} />
                                ) : (
                                    <X size={16} />
                                )}
                                At least one uppercase letter
                            </div>

                            <div
                                style={{
                                    color: passwordRules.lowercase
                                        ? "green"
                                        : "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                {passwordRules.lowercase ? (
                                    <Check size={16} />
                                ) : (
                                    <X size={16} />
                                )}
                                At least one lowercase letter
                            </div>

                            <div
                                style={{
                                    color: passwordRules.number
                                        ? "green"
                                        : "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                {passwordRules.number ? (
                                    <Check size={16} />
                                ) : (
                                    <X size={16} />
                                )}
                                At least one number
                            </div>

                            <div
                                style={{
                                    color: passwordRules.special
                                        ? "green"
                                        : "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                {passwordRules.special ? (
                                    <Check size={16} />
                                ) : (
                                    <X size={16} />
                                )}
                                At least one special character
                            </div>
                        </div>

                        {fieldErrors.password && (
                            <span className="register__field-error">
                                {fieldErrors.password}
                            </span>
                        )}

                    </div>

                    <div
                        className="register__password-wrapper"
                        style={{ marginTop: "15px" }}
                    >
                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(
                                    e.target.value
                                );
                                setErrorMessage("");
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !isPasswordValid}
                        style={{ marginTop: "20px" }}
                    >
                        {isLoading
                            ? "Saving..."
                            : "Complete Registration"}
                    </button>

                </form>
            </div>
        </section>
    );
}

export default SetPassword;