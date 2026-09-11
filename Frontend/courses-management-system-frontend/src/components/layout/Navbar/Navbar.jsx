import "./Navbar.css";
import logo from "../../../assets/images/logo.webp";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    User,
    Sun,
    Moon,
    Layers,
    MessageSquare,
    ClipboardList,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";

function Navbar({ isLoggedIn, handleLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navigate = useNavigate();

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    const role = sessionStorage.getItem("role");
    const isAdmin = isLoggedIn && role === "ADMIN";

    const normalLinks = [
        { title: "Home", href: "/" },
        { title: "Courses", href: "/courses" },
        { title: "About", href: "/about" }, // Updated to typical route
        { title: "Contact", href: "/contact" }
    ];

    const adminLinks = [
        {
            title: "All Batches",
            href: "/admin/all-batches",
            icon: <Layers size={18} strokeWidth={2.5} />
        },
        {
            title: "View Messages",
            href: "/admin/messages",
            icon: <MessageSquare size={18} strokeWidth={2.5} />
        },
        {
            title: "Course Registrations",
            href: "/admin/course-registrations",
            icon: <ClipboardList size={18} strokeWidth={2.5} />
        },
        {
            title: "Manage Instructors",
            href: "/admin/instructors",
            icon: <Users size={18} strokeWidth={2.5} />
        }
    ];

    const links = isAdmin ? adminLinks : normalLinks;

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) =>
            prevTheme === "light" ? "dark" : "light"
        );
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
        setMenuOpen(false);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);

        if (handleLogout) {
            handleLogout();
        }
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    useEffect(() => {
        // Prevent body scroll when overlay/drawer is open
        document.body.style.overflow =
            menuOpen || showLogoutModal ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [menuOpen, showLogoutModal]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
                setShowLogoutModal(false);
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

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
                    <Link to="/" className="navbar__logo" aria-label="Home">
                        <img src={logo} alt="MTC Logo" />
                    </Link>

                    <ul className="navbar__links">
                        {links.map((link) => (
                            <li key={link.title}>
                                <NavLink
                                    to={link.href}
                                    className={({ isActive }) => 
                                        isActive ? "navbar__link active" : "navbar__link"
                                    }
                                >
                                    {isAdmin && link.icon && (
                                        <span className="navbar__admin-icon">
                                            {link.icon}
                                        </span>
                                    )}
                                    {link.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar__actions">
                        <button
                            className="navbar__icon-btn"
                            onClick={toggleTheme}
                            aria-label="Toggle Theme"
                            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        >
                            {theme === "light" ? (
                                <Moon size={20} strokeWidth={2.5} />
                            ) : (
                                <Sun size={20} strokeWidth={2.5} />
                            )}
                        </button>

                        {isLoggedIn ? (
                            <div className="navbar__user-actions">
                                <button
                                    className="navbar__icon-btn"
                                    onClick={() => navigate("/profile")}
                                    title="View Profile"
                                    aria-label="Profile"
                                >
                                    <User size={20} strokeWidth={2.5} />
                                </button>

                                <button
                                    className="navbar__btn navbar__btn--outline"
                                    onClick={handleLogoutClick}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="navbar__auth-actions">
                                <button
                                    className="navbar__btn navbar__btn--ghost"
                                    onClick={() => navigate("/auth/login")}
                                >
                                    Login
                                </button>
                                <Link
                                    to="/auth/register"
                                    className="navbar__btn navbar__btn--primary"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <button
                        className="navbar__menu-btn"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`navbar__drawer ${menuOpen ? "active" : ""}`} aria-hidden={!menuOpen}>
                
                {/* 1. Header Area (Fixed) */}
                <div className="navbar__drawer-header">
                    <img src={logo} alt="MTC Logo" />
                    <button
                        className="navbar__icon-btn"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                {/* 2. Scrollable Navigation Area */}
                <ul className="navbar__drawer-links">
                    {links.map((link) => (
                        <li key={link.title}>
                            <NavLink
                                to={link.href}
                                className={({ isActive }) => 
                                    isActive ? "drawer__link active" : "drawer__link"
                                }
                                onClick={() => setMenuOpen(false)}
                            >
                                {isAdmin && link.icon && (
                                    <span className="drawer__admin-icon">
                                        {link.icon}
                                    </span>
                                )}
                                <span>{link.title}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* 3. Bottom Actions Area (Fixed) */}
                <div className="navbar__drawer-actions">
                    <button
                        className="drawer__action-btn"
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                    >
                        {theme === "light" ? (
                            <>
                                <Moon size={20} strokeWidth={2.5} className="drawer__action-icon" />
                                <span>Dark Mode</span>
                            </>
                        ) : (
                            <>
                                <Sun size={20} strokeWidth={2.5} className="drawer__action-icon" />
                                <span>Light Mode</span>
                            </>
                        )}
                    </button>

                    {isLoggedIn ? (
                        <>
                            <button
                                className="drawer__action-btn"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/profile");
                                }}
                            >
                                <User size={20} strokeWidth={2.5} className="drawer__action-icon" />
                                <span>My Profile</span>
                            </button>
                            <button
                                className="drawer__btn drawer__btn--logout"
                                onClick={handleLogoutClick}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="drawer__auth-group">
                            <button
                                className="drawer__btn drawer__btn--ghost"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/auth/login");
                                }}
                            >
                                Login
                            </button>
                            <Link
                                to="/auth/register"
                                className="drawer__btn drawer__btn--primary"
                                onClick={() => setMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlays and Modals */}
            {menuOpen && (
                <div
                    className="navbar__overlay"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu overlay"
                />
            )}

            {showLogoutModal && (
                <div
                    className="logout-modal-overlay"
                    onClick={cancelLogout}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="logout-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="logout-modal__icon">
                            <User size={28} strokeWidth={2} />
                        </div>
                        <h2>Confirm Logout</h2>
                        <p>Are you sure you want to end your current session?</p>
                        
                        <div className="logout-modal__actions">
                            <button
                                className="modal__btn modal__btn--cancel"
                                onClick={cancelLogout}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal__btn modal__btn--confirm"
                                onClick={confirmLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;