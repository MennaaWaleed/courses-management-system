import "./Navbar.css";
import logo from "../../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useEffect, useState } from "react";

function Navbar({ isLoggedIn, handleLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const links = [
        { title: "Home", href: "/" },
        { title: "Courses", href: "/courses" },
        { title: "About", href: "/" },
        { title: "Contact", href: "/contact" }
    ];

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [menuOpen]);

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

                    <div className="navbar__actions">
                        {isLoggedIn ? (
                            <div className="navbar__user-actions">
                                <button
                                    className="navbar__profile-btn"
                                    onClick={() => navigate("/profile")}
                                    title="View Profile"
                                    aria-label="Profile"
                                >
                                    <User size={22} />
                                </button>
                                <button className="navbar__logout" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="navbar__login"
                                    onClick={() => navigate("/auth/login")}
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

                <div className="navbar__drawer-actions">
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
                                onClick={() => {
                                    setMenuOpen(false);
                                    if (handleLogout) handleLogout();
                                }}
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
                                onClick={() => setMenuOpen(false)}
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
                    onClick={() => {
                        setMenuOpen(false);
                    }}
                />
            )}
        </>
    );
}

export default Navbar;