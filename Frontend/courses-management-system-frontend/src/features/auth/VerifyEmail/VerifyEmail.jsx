import "../Register/Register.css";
import logo from "../../../assets/images/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api/axios";

function VerifyEmail() {
    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    const navigate = useNavigate();
    const location = useLocation();
    
    const email = location.state?.email || "";
    // Check if this component is being used for Password Reset
    const isReset = location.state?.isReset || false;

    useEffect(() => {
        if (!email) {
            navigate("/auth/register");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!code) {
            setErrorMessage("Please enter the verification code.");
            return;
        }

        try {
            setIsLoading(true);
            
            // Branch logic based on context
            if (isReset) {
                await api.post("/auth/verify-reset-code", { email, code });
                setSuccessMessage("Code verified successfully!");
                setTimeout(() => {
                    // Pass the code to SetPassword so the backend can verify it again!
                    navigate("/auth/set-password", { state: { email, isReset: true, code } });
                }, 1000);
            } else {
                await api.post("/auth/verify-email", { email, code });
                setSuccessMessage("Email verified successfully!");
                setTimeout(() => {
                    navigate("/auth/set-password", { state: { email, isReset: false } });
                }, 1000);
            }

        } catch (error) {
            console.error("Verify Error:", error);
            const backendMessage = error.response?.data?.message || error.response?.data || "";

            if (!isReset && typeof backendMessage === 'string' && backendMessage.toLowerCase().includes("already verified")) {
                setSuccessMessage("Email is verified. Redirecting...");
                setTimeout(() => {
                    navigate("/auth/set-password", { state: { email, isReset: false } });
                }, 1000);
            } else {
                setErrorMessage(typeof backendMessage === 'string' ? backendMessage : "Verification failed. Invalid or expired code.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setErrorMessage("");
        setSuccessMessage("");
        try {
            setResendLoading(true);
            
            if (isReset) {
                // If it's a reset, the forgot-password endpoint generates the new code
                await api.post("/auth/forgot-password", { email });
            } else {
                // Standard registration resend
                await api.post("/auth/resend-code", { email });
            }
            
            setSuccessMessage("A new verification code has been sent to your email!");
            setTimeLeft(30);
        } catch (error) {
            const backendMessage = error.response?.data?.message || "";

            if (!isReset && backendMessage.toLowerCase().includes("already verified")) {
                navigate("/auth/set-password", { state: { email } });
            } else {
                setErrorMessage(backendMessage || "Failed to resend code.");
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <section className="register">
            <div className="register__card">
                <img src={logo} alt="MTC Logo" className="register__logo" />
                <h1 className="register__title">{isReset ? "Reset Verification" : "Verify Email"}</h1>
                <p className="register__subtitle">We sent a 6-digit code to <strong>{email}</strong></p>

                {errorMessage && <div className="register__error" style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{errorMessage}</div>}

                {successMessage && (
                    <div className="register__success" style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>
                        {successMessage}
                    </div>
                )}

                <form className="register__form" onSubmit={handleVerify}>
                    <input
                        type="text"
                        placeholder="6-Digit Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify"}
                    </button>
                </form>

                <p className="register__login-text">
                    Didn't receive the code?{" "}
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendLoading || timeLeft > 0}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: (resendLoading || timeLeft > 0) ? '#9ca3af' : '#007bff',
                            cursor: (resendLoading || timeLeft > 0) ? 'not-allowed' : 'pointer',
                            textDecoration: (resendLoading || timeLeft > 0) ? 'none' : 'underline',
                            padding: 0
                        }}
                    >
                        {resendLoading ? "Sending..." : (timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend")}
                    </button>
                </p>
            </div>
        </section>
    );
}

export default VerifyEmail;