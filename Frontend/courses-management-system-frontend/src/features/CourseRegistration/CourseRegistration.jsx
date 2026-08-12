import "./CourseRegistration.css";
import { useState } from "react";
import {
    X,
    User,
    Phone,
    Mail,
    MessageSquare,
    Send,
    CheckCircle2,
    Loader2
} from "lucide-react";

import { registerForCourse } from "../../api/courseApi";

function CourseRegistration({ course, onClose }) {

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!formData.fullName.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!formData.phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        try {

            setLoading(true);

            await registerForCourse({
                ...formData,
                courseId: course.id
            });

            setSuccess(true);

        } catch (err) {

            console.error("Failed to submit registration:", err);

            setError(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="course-registration">

            <div
                className="course-registration__overlay"
                onClick={onClose}
            ></div>


            <div className="course-registration__modal">

                {/* =========================
                   HEADER
                ========================= */}

                <div className="course-registration__header">

                    <div className="course-registration__header-info">

                        <span className="course-registration__eyebrow">
                            Course Registration
                        </span>

                        <h2>
                            Contact Us to Enroll
                        </h2>

                        {!success && (
                            <p>
                                Leave your information and our team will
                                contact you shortly.
                            </p>
                        )}

                    </div>

                    <button
                        type="button"
                        className="course-registration__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* =========================
                   SUCCESS
                ========================= */}

                {success ? (

                    <div className="course-registration__success">

                        <div className="course-registration__success-icon">
                            <CheckCircle2 size={34} />
                        </div>

                        <h3>
                            Request Sent Successfully
                        </h3>

                        <p>
                            Thank you for your interest in
                            <strong> {course?.courseName}</strong>.
                            Our team will contact you shortly.
                        </p>

                        <button
                            type="button"
                            className="course-registration__done"
                            onClick={onClose}
                        >
                            Done
                        </button>

                    </div>

                ) : (

                    <form
                        className="course-registration__form"
                        onSubmit={handleSubmit}
                    >

                        {/* Course */}

                        <div className="course-registration__course">

                            <span>
                                Interested in
                            </span>

                            <strong>
                                {course?.courseName}
                            </strong>

                        </div>


                        {/* Full Name */}

                        <div className="course-registration__field">

                            <label htmlFor="fullName">
                                Full Name
                            </label>

                            <div className="course-registration__input-wrapper">

                                <User size={18} />

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                            </div>

                        </div>


                        {/* Phone + Email */}

                        <div className="course-registration__row">

                            <div className="course-registration__field">

                                <label htmlFor="phone">
                                    Phone Number
                                </label>

                                <div className="course-registration__input-wrapper">

                                    <Phone size={18} />

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="01xxxxxxxxx"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            <div className="course-registration__field">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="course-registration__input-wrapper">

                                    <Mail size={18} />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Message */}

                        <div className="course-registration__field">

                            <label htmlFor="message">
                                Message
                                <span>Optional</span>
                            </label>

                            <div className="course-registration__textarea-wrapper">

                                <MessageSquare size={18} />

                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell us anything you'd like us to know..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={loading}
                                    rows="4"
                                />

                            </div>

                        </div>


                        {/* Error */}

                        {error && (

                            <div className="course-registration__error">
                                {error}
                            </div>

                        )}


                        {/* Actions */}

                        <div className="course-registration__actions">

                            <button
                                type="button"
                                className="course-registration__cancel"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="course-registration__submit"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <Loader2
                                            size={18}
                                            className="course-registration__spinner"
                                        />
                                        Sending...
                                    </>

                                ) : (

                                    <>
                                        Send Enrollment Request
                                        <Send size={17} />
                                    </>

                                )}

                            </button>

                        </div>


                        <p className="course-registration__privacy">
                            By submitting this form, you agree to be contacted
                            by our training team regarding this course.
                        </p>

                    </form>

                )}

            </div>

        </div>

    );
}

export default CourseRegistration;