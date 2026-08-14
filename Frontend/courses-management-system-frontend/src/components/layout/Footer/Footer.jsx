import { useEffect, useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getFeaturedCourses } from "../../../api/courseApi"; 
import logo from "../../../assets/images/logo.png";

function Footer() {
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        getFeaturedCourses()
            .then((res) => {
                // التأكد من استلام البيانات سواء كانت مباشرة أو داخل res.data
                const data = res.data || res;
                setFeaturedCourses(Array.isArray(data) ? data.slice(0, 5) : []);
            })
            .catch((err) => {
                console.error("Failed to fetch featured courses for footer:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <footer className="footer">
            <div className="footer__container">

                {/* =========================
                    MAIN FOOTER
                ========================= */}
                <div className="footer__main">

                    {/* Brand */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <img
                                src={logo}
                                alt="MTC - Multilevel Training Center"
                            />
                        </Link>

                        <p className="footer__description">
                            Professional engineering and Autodesk training
                            designed to build practical skills, develop
                            industry expertise, and prepare you for real-world
                            projects.
                        </p>

                        <span className="footer__authorized">
                            Autodesk Authorized Training Center
                        </span>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__column">
                        <h3>Quick Links</h3>
                        <nav className="footer__links">
                            <Link to="/">Home</Link>
                            <Link to="/courses">Courses</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                        </nav>
                    </div>

                    {/* Popular / Featured Courses (Dynamic) */}
                    <div className="footer__column">
                        <h3>Popular Courses</h3>
                        <nav className="footer__links">
                            {loading ? (
                                <span className="footer__loading">Loading courses...</span>
                            ) : featuredCourses.length > 0 ? (
                                featuredCourses.map((course) => (
                                    <Link key={course.id} to={`/courses/${course.id}`}>
                                        {course.courseName}
                                    </Link>
                                ))
                            ) : (
                                <span className="footer__empty">No courses available</span>
                            )}
                        </nav>
                    </div>

                    {/* Contact & Hours */}
                    <div className="footer__column footer__contact">
                        <h3>Contact Us</h3>

                        <a href="tel:+201012345678">
                            <span className="footer__contact-icon">
                                <Phone size={16} />
                            </span>
                            <span>+20 10 1234 5678</span>
                        </a>

                        <a href="mailto:info@mtc.com">
                            <span className="footer__contact-icon">
                                <Mail size={16} />
                            </span>
                            <span>info@mtc.com</span>
                        </a>

                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=Nasr%20City%2C%20Cairo%2C%20Egypt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer__contact-item"
                        >
                            <span className="footer__contact-icon">
                                <MapPin size={16} />
                            </span>
                            <span>View Location</span>
                        </a>

                        {/* Working Hours */}
                        <div className="footer__hours">
                            <div className="footer__hours-title">
                                <Clock size={16} className="footer__hours-icon" />
                                <span>Working Hours</span>
                            </div>
                            <p>Sat - Thu: 9:00 AM - 9:00 PM</p>
                      
                            <span className="footer__status-badge">Open for Registration</span>
                        </div>
                    </div>

                </div>

                {/* =========================
                    BOTTOM
                ========================= */}
                <div className="footer__bottom">
                    <p>© {currentYear} MTC. All rights reserved.</p>

                    <div className="footer__bottom-right">
                        {/* Social Media */}
                        <div className="footer__socials">
                            <a
                                href="https://wa.me/201012345678"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.88c0 2.09.55 4.13 1.6 5.93L.06 24l6.34-1.66a11.86 11.86 0 0 0 5.65 1.44h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.42-8.42ZM12.06 21.8h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.76.98 1-3.66-.23-.38a9.87 9.87 0 0 1-1.52-5.27C2.14 6.43 6.58 2 12.05 2a9.86 9.86 0 0 1 7.01 2.91 9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.44 9.87-9.9 9.87Zm5.42-7.39c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.67-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.2 3.05c.15.2 2.08 3.18 5.03 4.46.7.3 1.25.48 1.68.61.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35Z" />
                                </svg>
                            </a>

                            <a href="#" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.66.34-1 1-1Z" />
                                </svg>
                            </a>
                        </div>

                        <span className="footer__powered">
                            Learn. Practice. Succeed.
                            <span className="footer__powered-arrow">↗</span>
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;