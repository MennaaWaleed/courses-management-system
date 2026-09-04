import "../styles/ContactUs.css";
import { useState } from "react";

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
            const response = await fetch("http://localhost:8080/api/contact", {
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

            <div className="contact-card">

                {/* Header */}
                <div className="contact-header">
                    <h1>Contact Us</h1>

                    <p>
                        We'd love to hear from you. Fill out the form below and
                        we'll get back to you as soon as possible.
                    </p>
                </div>

                <form
                    className="contact-form"
                    onSubmit={handleSubmit}
                >

                    {/* Name & Email */}
                    <div className="form-row">

                        <div className="form-group">
                            <label>Name</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />

                            {errors.name && (
                                <p className="field-error">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />

                            {errors.email && (
                                <p className="field-error">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <label>Phone</label>

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                        />

                        {errors.phone && (
                            <p className="field-error">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Message */}
                    <div className="form-group">

                        <label>Message</label>

                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Write your message..."
                        ></textarea>

                        {errors.message && (
                            <p className="field-error">
                                {errors.message}
                            </p>
                        )}

                    </div>

                    {/* Response Message */}
                    {responseMessage && (
                        <div
                            className={
                                isSuccess
                                    ? "success-message"
                                    : "error-message"
                            }
                        >
                            {responseMessage}
                        </div>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        className="send-btn"
                    >
                        Send Message
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ContactUs;

