import { useNavigate } from "react-router-dom";
import "./HomeIntro.css";

import introImage from "../../../assets/images/intro_img.png";
import autodeskIcon from "../../../assets/images/autodesk-icon.svg";

import {
    GraduationCap,
    CalendarClock,
    Award,
    ArrowRight,
    Users,
    BookOpen,
    CheckCircle2
} from "lucide-react";

import Counter from "./Counter";

function HomeIntro() {
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - 2010;

    const navigate = useNavigate();

    return (
        <section className="home-intro-section">
            <div className="home-intro-section__grid-bg"></div>

            <div className="home-intro-section__container">

                {/* =========================
                    LEFT COLUMN (CONTENT)
                ========================= */}
                <div className="home-intro-section__content">

                    <div className="home-intro-section__credential home-intro-reveal home-intro-reveal--1">
                        <div className="credential__icon-wrapper">
                            <img src={autodeskIcon} alt="Autodesk" className="credential__custom-icon" />
                        </div>
                        <div className="credential__text">
                            <span className="credential__label">Official Partner</span>
                            <strong className="credential__title">Autodesk Authorized Training Center</strong>
                        </div>
                    </div>

                    <h1 className="home-intro-section__title home-intro-reveal home-intro-reveal--2">
                        Build Your <span className="text-highlight">Engineering Career</span> With Industry-Recognized Skills
                    </h1>

                    <p className="home-intro-section__description home-intro-reveal home-intro-reveal--3">
                        Master Autodesk software, BIM workflows, and advanced engineering 
                        practices through hands-on training. Learn directly from certified 
                        industry experts and build real-world project portfolios.
                    </p>

                    <div className="home-intro-section__benefit home-intro-reveal home-intro-reveal--4">
                        <div className="benefit__icon">
                            <Award size={24} strokeWidth={2} />
                        </div>
                        <div className="benefit__content">
                            <strong>Official Certification Value</strong>
                            <p>Earn an internationally recognized Autodesk certificate upon successfully completing your training requirements.</p>
                        </div>
                    </div>

                    <div className="home-intro-section__actions home-intro-reveal home-intro-reveal--5">
                        <button
                            className="home-intro-section__btn home-intro-section__btn--primary"
                            onClick={() => navigate("/courses")}
                        >
                            Explore Courses
                            <ArrowRight size={18} className="btn-icon-right" />
                        </button>

                        <button
                            className="home-intro-section__btn home-intro-section__btn--secondary"
                            onClick={() => navigate("/contact")}
                        >
                            Contact Us
                        </button>
                    </div>
                </div>


                {/* =========================
                    RIGHT COLUMN (VISUAL + STATS)
                ========================= */}
                <div className="home-intro-section__right-column">
                    
                    {/* 1. The Image & Floating Cards */}
                    <div className="home-intro-section__visual home-intro-reveal home-intro-reveal--6">
                        <div className="visual__backdrop-shape"></div>
                        <div className="visual__glow"></div>

                        <div className="visual__image-wrapper">
                            <img
                                src={introImage}
                                alt="Professional Engineering Training"
                                className="visual__hero-image"
                            />
                            
                            <div className="visual__floating-card visual__floating-card--top">
                                <div className="floating-card__icon-box">
                                    <GraduationCap size={20} />
                                </div>
                                <div className="floating-card__text">
                                    <strong>Certified Instructors</strong>
                                    <span>Industry leading experts</span>
                                </div>
                            </div>

                            <div className="visual__floating-card visual__floating-card--bottom">
                                <div className="floating-card__icon-box">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div className="floating-card__text">
                                    <strong>Practical Workflows</strong>
                                    <span>100% project-based</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. The Stats (Counters) directly under the image */}
                    <div className="home-intro-section__stats home-intro-reveal home-intro-reveal--7">
                        <div className="stat-item">
                            <div className="stat-item__icon"><Users size={18} /></div>
                            <div className="stat-item__data">
                                <h3><Counter end={30} suffix="K+" start={true} /></h3>
                                <p>Engineers Trained</p>
                            </div>
                        </div>
                        
                        <div className="stat-divider"></div>

                        <div className="stat-item">
                            <div className="stat-item__icon"><CalendarClock size={18} /></div>
                            <div className="stat-item__data">
                                <h3><Counter end={yearsOfExperience} suffix="+" start={true} /></h3>
                                <p>Years Experience</p>
                            </div>
                        </div>

                        <div className="stat-divider"></div>

                        <div className="stat-item">
                            <div className="stat-item__icon"><BookOpen size={18} /></div>
                            <div className="stat-item__data">
                                <h3><Counter end={20} suffix="+" start={true} /></h3>
                                <p>Professional Courses</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default HomeIntro;