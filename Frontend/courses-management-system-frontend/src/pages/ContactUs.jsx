import "../styles/ContactUs.css";

function ContactUs() {
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

                {/* Form */}

                <form className="contact-form">

                    {/* Row 1 */}

                    <div className="form-row">

                        <div className="form-group">
                            <label>Name</label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>

                    </div>

                    {/* Row 2 */}

                    <div className="form-row">

                        <div className="form-group">
                            <label>Phone</label>

                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label>Title</label>

                            <input
                                type="text"
                                placeholder="Message title"
                            />
                        </div>

                    </div>

                    {/* Type */}

                    <div className="form-group">

                        <label>Type</label>

                        <select defaultValue="">
                            <option value="" disabled>
                                Select a type
                            </option>

                            <option value="GENERAL">
                                General Inquiry
                            </option>

                            <option value="QUESTION">
                                Question
                            </option>

                            <option value="TECHNICAL">
                                Technical Issue
                            </option>

                            <option value="SUGGESTION">
                                Suggestion
                            </option>

                            <option value="COMPLAINT">
                                Complaint
                            </option>
                        </select>

                    </div>

                    {/* Message */}

                    <div className="form-group">

                        <label>Message</label>

                        <textarea
                            rows="6"
                            placeholder="Write your message..."
                        ></textarea>

                    </div>

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