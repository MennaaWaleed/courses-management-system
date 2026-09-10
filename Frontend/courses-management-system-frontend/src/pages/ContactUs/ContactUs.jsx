import "../../styles/ContactUs.css";
import { useState } from "react";
import "./ContactUs.css";
import { BASE_URL } from "../../api/axios.js";
function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        setResponseMessage("");

        try {
            const response = await fetch(`${BASE_URL}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage(data.message);
                setIsSuccess(true);

                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    message: ""
                });

                setErrors({});
            } else {
                setIsSuccess(false);
                setErrors(data);
                setResponseMessage("");
            }
        } catch (error) {
            console.error(error);
            setIsSuccess(false);
            setResponseMessage("Something went wrong.");
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-wrapper">

                <div className="contact-info-section">
                    <div className="contact-info-header">
                        <h2>Get in Touch</h2>
                        <p>
                            Have a question about our engineering courses,
                            Autodesk certifications, or enterprise training?
                            Our team is ready to help you build something great.
                        </p>
                    </div>

                    <div className="contact-methods">

                        <div className="contact-method-item">
                            <div className="method-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                    />
                                </svg>
                            </div>

                            <div className="method-details">
                                <h3>Email Us</h3>
                                <p>info@mtccenters.com</p>
                            </div>
                        </div>

                        <div className="contact-method-item">
                            <div className="method-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.25-3.95-6.847-6.847l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                    />
                                </svg>
                            </div>

                            <div className="method-details">
                                <h3>Call Us</h3>
                                <p>+20 10 65115607</p>
                                <p>+20 2 24056479</p>
                            </div>
                        </div>

                        <div className="contact-method-item">
                            <div className="method-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                    />
                                </svg>
                            </div>

                            <div className="method-details">
                                <h3>Visit Our Training Center</h3>
                                <p>
                                    20 El Tayran Street, 2nd Floor
                                    <br />
                                    Nasr City, Cairo, Egypt, 11731
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="contact-form-section">
                    <form className="contact-form" onSubmit={handleSubmit}>

                        <div className="form-row">

                            <div className="form-group">
                                <label>Full Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={errors.name ? "input-error" : ""}
                                />

                                {errors.name && (
                                    <span className="field-error">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={errors.email ? "input-error" : ""}
                                />

                                {errors.email && (
                                    <span className="field-error">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={errors.phone ? "input-error" : ""}
                            />

                            {errors.phone && (
                                <span className="field-error">
                                    {errors.phone}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>How can we help you?</label>

                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                className={errors.message ? "input-error" : ""}
                            ></textarea>

                            {errors.message && (
                                <span className="field-error">
                                    {errors.message}
                                </span>
                            )}
                        </div>

                        {responseMessage && (
                            <div
                                className={`status-message ${
                                    isSuccess
                                        ? "status-success"
                                        : "status-error"
                                }`}
                            >
                                {isSuccess ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}

                                <span>{responseMessage}</span>
                            </div>
                        )}

                        <button type="submit" className="send-btn">
                            Send Message
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default ContactUs;