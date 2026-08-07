import "./Navbar.css";
import logo from "../../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom"; // Imported useNavigate
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

function Navbar({ isLoggedIn, handleLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate(); // Initialized navigate

    const links = [
        { title: "Home", href: "/" },
        { title: "Categories", href: "/" },
        { title: "About", href: "/" },
        { title: "Contact", href: "/contact" }
    ];

    // Lock body scroll when the mobile drawer is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [menuOpen]);

    // Close drawer on Escape key press
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    // Close drawer automatically if window is resized above mobile breakpoint
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992) {
                setMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <nav className="navbar">
                <div className="navbar__container">
                    <a href="/" className="navbar__logo">
                        <img src={logo} alt="MTC Logo" />
                    </a>

                    <ul className="navbar__links">
                        {links.map((link) => (
                            <li key={link.title}>
                                <Link
                                    to={link.href}
                                    onClick={() => console.log("Clicked:", link.title)}
                                >
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Actions */}
                    <div className="navbar__actions">
                        {isLoggedIn ? (
                            <button className="navbar__logout" onClick={handleLogout}>
                                Logout
                            </button>
                        ) : (
                            <>
                                <button
                                    className="navbar__login"
                                    onClick={() => navigate("/auth/login")} // Added navigation
                                >
                                    Login
                                </button>
                                <Link to="/auth/register" className="navbar__register">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        className="navbar__menu-btn"
                        onClick={() => setMenuOpen(true)}
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`navbar__drawer ${menuOpen ? "active" : ""}`}>
                <div className="navbar__drawer-header">
                    <img src={logo} alt="MTC" />
                    <button
                        className="navbar__drawer-close"
                        onClick={() => setMenuOpen(false)}
                    >
                        <X size={28} />
                    </button>
                </div>

                <ul className="navbar__drawer-links">
                    {links.map((link) => (
                        <li key={link.title}>
                            <a
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.title}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Mobile Drawer Actions */}
                <div className="navbar__drawer-actions">
                    {isLoggedIn ? (
                        <button
                            className="navbar__logout"
                            onClick={() => {
                                setMenuOpen(false);
                                if (handleLogout) handleLogout();
                            }}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <button
                                className="navbar__login"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/auth/login"); // Added navigation & closes menu
                                }}
                            >
                                Login
                            </button>
                            <Link
                                to="/auth/register"
                                className="navbar__register"
                                onClick={() => setMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Overlay */}
            {menuOpen && (
                <div
                    className="navbar__overlay"
                    onClick={() => {
                        console.log("overlay clicked");
                        setMenuOpen(false);
                    }}
                />
            )}
        </>
    );
}

export default Navbar;