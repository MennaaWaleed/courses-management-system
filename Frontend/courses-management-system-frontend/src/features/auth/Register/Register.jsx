import "./Register.css";
import logo from "../../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../api/axios";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setFieldErrors({});

        if (!firstName || !lastName || !email || !phone) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            setErrorMessage("Please enter a valid phone number.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.post("/auth/register", {
                firstName,
                lastName,
                email,
                phone
            });


            navigate("/auth/verify-email", { state: { email: email } });

        } catch (error) {
            const backendMessage = error.response?.data?.message || "";

            if (backendMessage.includes("This email is not verified")) {
                navigate("/auth/verify-email", { state: { email: email } });
            }
            else if (backendMessage.includes("password is not set")) {
                navigate("/auth/set-password", { state: { email: email } });
            }
            else if (error.response?.status === 400 && error.response?.data && !backendMessage) {
                setFieldErrors(error.response.data);
            }
            else if (backendMessage) {
                setErrorMessage(backendMessage);
            }
            else {
                setErrorMessage("Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="register">
            <div className="register__card">
                <img src={logo} alt="MTC Logo" className="register__logo" />
                <h1 className="register__title">Create Account</h1>
                <p className="register__subtitle">Join us and start learning today.</p>

                {errorMessage && <div className="register__error">{errorMessage}</div>}

                <form className="register__form" onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); setFieldErrors({}); }}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value); setFieldErrors({}); }}
                    />
                    <div className="register__field">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setFieldErrors({}); }}
                        />
                        {fieldErrors.email && <span className="register__field-error">{fieldErrors.email}</span>}
                    </div>
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Continue"}
                    </button>
                </form>

                <p className="register__login-text">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="register__login-link">Login</Link>
                </p>
            </div>
        </section>
    );
}

export default Register;