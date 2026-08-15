import { useNavigate } from "react-router-dom";
import "./HomeIntro.css";

import introImage from "../../../assets/images/intro_img.png";

import {
    GraduationCap,
    CalendarClock,
    Award
} from "lucide-react";

import Counter from "./Counter";

function HomeIntro() {

    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - 2010;

    const navigate = useNavigate();

    return (
        <section className="home-intro-section">

            <div className="home-intro-section__container">

                {/* =========================
                    CONTENT
                ========================= */}

                <div className="home-intro-section__content">

                    <div className="home-intro-section__badge home-intro-reveal home-intro-reveal--1">
                        Autodesk Authorized Training Center
                    </div>


                    <h1 className="home-intro-section__title home-intro-reveal home-intro-reveal--2">
                        Build Your Engineering Career with Industry Experts
                    </h1>


                    <p className="home-intro-section__description home-intro-reveal home-intro-reveal--3">
                        Master Autodesk software, BIM workflows, and engineering
                        skills through hands-on training led by certified
                        instructors. Build real-world projects and become
                        job-ready with industry-focused courses.
                    </p>


                    {/* Actions */}

                    <div className="home-intro-section__actions home-intro-reveal home-intro-reveal--4">

                        <button
                            className="home-intro-section__button home-intro-section__button--primary"
                            onClick={() => navigate("/courses")}
                        >
                            Explore Courses
                        </button>


                        <button
                            className="home-intro-section__button home-intro-section__button--secondary"
                            onClick={() => navigate("/contact")}
                        >
                            Contact Us
                        </button>

                    </div>


                    {/* Stats */}

                    <div className="home-intro-section__stats home-intro-reveal home-intro-reveal--5">

                        <div className="home-intro-section__stat">

                            <Counter
                                end={30}
                                suffix="K+"
                                start={true}
                            />

                            <p>
                                Students Trained
                            </p>

                        </div>


                        <div className="home-intro-section__stat">

                            <Counter
                                end={yearsOfExperience}
                                suffix="+"
                                start={true}
                            />

                            <p>
                                Years Experience
                            </p>

                        </div>


                        <div className="home-intro-section__stat">

                            <Counter
                                end={20}
                                suffix="+"
                                start={true}
                            />

                            <p>
                                Professional Courses
                            </p>

                        </div>

                    </div>

                </div>


                {/* =========================
                    IMAGE
                ========================= */}

                <div className="home-intro-section__visual home-intro-reveal home-intro-reveal--6">

                    <div className="home-intro-section__blob"></div>


                    <img
                        src={introImage}
                        alt="Engineering Training"
                        className="home-intro-section__hero-image"
                    />


                    {/* Since 2010 */}

                    <div className="home-intro-section__floating-card home-intro-section__floating-card--students">

                        <CalendarClock className="home-intro-section__floating-icon" />

                        <div>
                            <p>
                                Since 2010
                            </p>
                        </div>

                    </div>


                    {/* Certified Instructors */}

                    <div className="home-intro-section__floating-card home-intro-section__floating-card--courses">

                        <GraduationCap className="home-intro-section__floating-icon" />

                        <div>
                            <p>
                                Certified Instructors
                            </p>
                        </div>

                    </div>


                    {/* Autodesk */}

                    <div className="home-intro-section__floating-card home-intro-section__floating-card--autodesk">

                        <Award className="home-intro-section__floating-icon" />

                        <p>
                            Autodesk Authorized
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default HomeIntro;