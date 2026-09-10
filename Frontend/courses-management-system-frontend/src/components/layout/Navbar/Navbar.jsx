import "./Navbar.css";
import logo from "../../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
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
        { title: "About", href: "/" },
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

                    <Link to="/" className="navbar__logo">
                        <img src={logo} alt="MTC Logo" />
                    </Link>

                    <ul className="navbar__links">
                        {links.map((link) => (
                            <li key={link.title}>
                                <Link
                                    to={link.href}
                                    onClick={() =>
                                        console.log(
                                            "Clicked:",
                                            link.title
                                        )
                                    }
                                >
                                    {isAdmin && link.icon && (
                                        <span className="navbar__admin-icon">
                                            {link.icon}
                                        </span>
                                    )}

                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar__actions">

                        <button
                            className="navbar__theme-btn"
                            onClick={toggleTheme}
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === "light" ? (
                                <Moon size={22} />
                            ) : (
                                <Sun size={22} />
                            )}
                        </button>

                        {isLoggedIn ? (
                            <div className="navbar__user-actions">

                                <button
                                    className="navbar__profile-btn"
                                    onClick={() =>
                                        navigate("/profile")
                                    }
                                    title="View Profile"
                                    aria-label="Profile"
                                >
                                    <User size={22} />
                                </button>

                                <button
                                    className="navbar__logout"
                                    onClick={handleLogoutClick}
                                >
                                    Logout
                                </button>

                            </div>
                        ) : (
                            <>
                                <button
                                    className="navbar__login"
                                    onClick={() =>
                                        navigate("/auth/login")
                                    }
                                >
                                    Login
                                </button>

                                <Link
                                    to="/auth/register"
                                    className="navbar__register"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        className="navbar__menu-btn"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </nav>

            <div
                className={`navbar__drawer ${
                    menuOpen ? "active" : ""
                }`}
            >
                <div className="navbar__drawer-header">
                    <img src={logo} alt="MTC" />

                    <button
                        className="navbar__drawer-close"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={28} />
                    </button>
                </div>

                <ul className="navbar__drawer-links">
                    {links.map((link) => (
                        <li key={link.title}>
                            <Link
                                to={link.href}
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                            >
                                {isAdmin && link.icon && (
                                    <span className="navbar__admin-icon">
                                        {link.icon}
                                    </span>
                                )}

                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="navbar__drawer-actions">

                    <button
                        className="navbar__theme-btn drawer-theme-btn"
                        onClick={toggleTheme}
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === "light" ? (
                            <>
                                <Moon size={20} />
                                <span>Dark Mode</span>
                            </>
                        ) : (
                            <>
                                <Sun size={20} />
                                <span>Light Mode</span>
                            </>
                        )}
                    </button>

                    {isLoggedIn ? (
                        <div className="navbar__drawer-user">

                            <button
                                className="navbar__drawer-profile"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/profile");
                                }}
                            >
                                <User size={20} />
                                <span>My Profile</span>
                            </button>

                            <button
                                className="navbar__logout"
                                onClick={handleLogoutClick}
                            >
                                Logout
                            </button>

                        </div>
                    ) : (
                        <>
                            <button
                                className="navbar__login"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/auth/login");
                                }}
                            >
                                Login
                            </button>

                            <Link
                                to="/auth/register"
                                className="navbar__register"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {menuOpen && (
                <div
                    className="navbar__overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {showLogoutModal && (
                <div
                    className="logout-modal-overlay"
                    onClick={cancelLogout}
                >
                    <div
                        className="logout-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="logout-modal__icon">
                            <User size={25} />
                        </div>

                        <h2>Logout</h2>

                        <p>
                            Are you sure you want to logout?
                        </p>

                        <div className="logout-modal__actions">

                            <button
                                className="logout-modal__no"
                                onClick={cancelLogout}
                            >
                                No
                            </button>

                            <button
                                className="logout-modal__yes"
                                onClick={confirmLogout}
                            >
                                Yes
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;