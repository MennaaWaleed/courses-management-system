import "./CourseDetails.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getCourseById,
    getRelatedCourses
} from "../../../api/courseApi";

import {
    Clock,
    BookOpen,
    Tag,
    ShieldCheck,
    ArrowLeft,
    ExternalLink,
    Sparkles,
    CheckCircle2,
    HelpCircle
} from "lucide-react";

import CourseCard from "../../../features/Home/FeaturedCourses/CourseCard";
import CourseRegistration from "../../../features/CourseRegistration/CourseRegistration";

function CourseDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [relatedCourses, setRelatedCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(true);

    const [showRegistration, setShowRegistration] = useState(false);

    const [error, setError] = useState("");

    const BASE_URL = "http://localhost:8080";

    useEffect(() => {

        const fetchCourseData = async () => {

            try {

                setLoading(true);
                setRelatedLoading(true);
                setError("");

                const courseResponse = await getCourseById(id);

                setCourse(courseResponse.data);

                try {

                    const relatedResponse = await getRelatedCourses(id);

                    setRelatedCourses(relatedResponse.data);

                } catch (error) {

                    console.error(
                        "Failed to fetch related courses:",
                        error
                    );

                    setRelatedCourses([]);

                } finally {

                    setRelatedLoading(false);

                }

            } catch (error) {

                console.error(
                    "Failed to fetch course:",
                    error
                );

                if (error.response?.status === 404) {

                    setError("Course not found.");

                } else {

                    setError("Failed to load course.");

                }

            } finally {

                setLoading(false);

            }

        };

        fetchCourseData();

    }, [id]);


    /* =========================
       LOADING STATE
    ========================= */

    if (loading) {

        return (

            <main className="course-details-page">

                <section className="course-details-page__hero">

                    <div className="course-details-page__container">

                        <div className="course-details-page__loading">

                            <span className="course-details-page__skeleton-item course-details-page__skeleton-small"></span>

                            <span className="course-details-page__skeleton-item course-details-page__skeleton-large"></span>

                            <span className="course-details-page__skeleton-item course-details-page__skeleton-text"></span>

                            <span className="course-details-page__skeleton-item course-details-page__skeleton-text course-details-page__skeleton-text--short"></span>

                        </div>

                    </div>

                </section>

            </main>

        );

    }


    /* =========================
       ERROR STATE
    ========================= */

    if (error || !course) {

        return (

            <main className="course-details-page">

                <section className="course-details-page__state">

                    <div className="course-details-page__state-card">

                        <div className="course-details-page__state-icon">

                            <HelpCircle size={40} />

                        </div>

                        <h1>
                            {error || "Course not found"}
                        </h1>

                        <p>
                            We couldn't find the course you're looking for
                            or it may have been removed.
                        </p>

                        <button
                            type="button"
                            className="course-details-page__state-button"
                            onClick={() => navigate("/courses")}
                        >

                            <ArrowLeft size={18} />

                            Back to Courses

                        </button>

                    </div>

                </section>

            </main>

        );

    }


    const imageUrl =
        `${BASE_URL}${course.imageUrl}`;

    const iconUrl =
        `${BASE_URL}${course.iconUrl}`;

    const categories =
        course.categories || [];


    return (

        <main className="course-details-page">

            {/* =========================
               HERO SECTION
            ========================= */}

            <section className="course-details-page__hero">

                <div className="course-details-page__hero-glow"></div>

                <div className="course-details-page__container">

                    <div className="course-details-page__hero-content">

                        <div className="course-details-page__info">

                            {/* Categories */}

                            <div className="course-details-page__categories">

                                {categories.map(category => (

                                    <span
                                        key={category.id}
                                        className="course-details-page__category"
                                    >

                                        <Tag size={13} />

                                        {category.categoryName}

                                    </span>

                                ))}

                            </div>


                            {/* Title */}

                            <div className="course-details-page__title">

                                {course.iconUrl && (

                                    <img
                                        src={iconUrl}
                                        alt=""
                                        className="course-details-page__icon"
                                    />

                                )}

                                <h1>
                                    {course.courseName}
                                </h1>

                            </div>


                            {/* Short Description */}

                            <p className="course-details-page__short-description">

                                {course.shortDescription}

                            </p>


                            {/* Meta */}

                            <div className="course-details-page__meta">

                                <div className="course-details-page__meta-item">

                                    <div className="course-details-page__meta-icon">

                                        <Clock size={18} />

                                    </div>

                                    <div>

                                        <span className="course-details-page__meta-value">

                                            {course.courseHours}

                                        </span>

                                        <span className="course-details-page__meta-label">

                                            Hours

                                        </span>

                                    </div>

                                </div>


                                <div className="course-details-page__meta-divider"></div>


                                <div className="course-details-page__meta-item">

                                    <div className="course-details-page__meta-icon">

                                        <BookOpen size={18} />

                                    </div>

                                    <div>

                                        <span className="course-details-page__meta-value">

                                            {course.lectureCount}

                                        </span>

                                        <span className="course-details-page__meta-label">

                                            Lectures

                                        </span>

                                    </div>

                                </div>


                                <div className="course-details-page__meta-divider"></div>


                                <div className="course-details-page__meta-item">

                                    <div className="course-details-page__meta-icon">

                                        <ShieldCheck size={18} />

                                    </div>

                                    <div>

                                        <span className="course-details-page__meta-value">

                                            Certified

                                        </span>

                                        <span className="course-details-page__meta-label">

                                            Program

                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Hero Image */}

                        <div className="course-details-page__image-wrapper">

                            <div className="course-details-page__image-frame">

                                <img
                                    src={imageUrl}
                                    alt={course.courseName}
                                    className="course-details-page__image"
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
               CONTENT SECTION
            ========================= */}

            <section className="course-details-page__content">

                <div className="course-details-page__container">

                    <div className="course-details-page__content-grid">


                        {/* Description */}

                        <div className="course-details-page__description">

                            <span className="course-details-page__section-badge">

                                <Sparkles size={14} />

                                About This Course

                            </span>


                            <h2>
                                Build Practical Skills for Your Career
                            </h2>


                            <div className="course-details-page__body-text">

                                <p>
                                    {course.description}
                                </p>

                            </div>


                            <div className="course-details-page__highlights">

                                <div className="course-details-page__highlight-item">

                                    <CheckCircle2
                                        size={20}
                                        className="course-details-page__highlight-icon"
                                    />

                                    <span>
                                        Industry-standard practical training modules
                                    </span>

                                </div>


                                <div className="course-details-page__highlight-item">

                                    <CheckCircle2
                                        size={20}
                                        className="course-details-page__highlight-icon"
                                    />

                                    <span>
                                        Direct mentorship and expert guidance
                                    </span>

                                </div>


                                <div className="course-details-page__highlight-item">

                                    <CheckCircle2
                                        size={20}
                                        className="course-details-page__highlight-icon"
                                    />

                                    <span>
                                        Hands-on real world project execution
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* Sidebar */}

                        <aside className="course-details-page__sidebar">

                            <div className="course-details-page__card">

                                <div className="course-details-page__card-tag">
                                    Enrollment Package
                                </div>

                                <span className="course-details-page__card-label">
                                    Course Investment
                                </span>


                                <div className="course-details-page__price">

                                    <strong>
                                        {course.price.toLocaleString()}
                                    </strong>

                                    <span>
                                        EGP
                                    </span>

                                </div>


                                <p className="course-details-page__discount-note">

                                    Contact us for special discounts and
                                    group enrollment offers.

                                </p>


                                <div className="course-details-page__actions">

                                    {course.contentUrl && (

                                        <a
                                            href={`${BASE_URL}${course.contentUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="course-details-page__content-button"
                                        >

                                            <ExternalLink size={16} />

                                            View Course Content

                                        </a>

                                    )}


                                    <button
                                        type="button"
                                        className="course-details-page__register-button"
                                        onClick={() => setShowRegistration(true)}
                                    >

                                        Contact Us to Enroll

                                    </button>


                                    <button
                                        type="button"
                                        className="course-details-page__back-button"
                                        onClick={() => navigate("/courses")}
                                    >

                                        <ArrowLeft size={16} />

                                        Back to Courses

                                    </button>

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </section>


            {/* =========================
               RELATED COURSES
            ========================= */}

            {!relatedLoading &&
                relatedCourses.length > 0 && (

                    <section className="course-details-page__related">

                        <div className="course-details-page__container">

                            <div className="course-details-page__related-header">

                                <span className="course-details-page__section-badge">
                                    You May Also Like
                                </span>

                                <h2>
                                    Related Courses
                                </h2>

                                <p>
                                    Explore other courses related to this
                                    specialization and elevate your
                                    professional profile.
                                </p>

                            </div>


                            <div className="course-details-page__related-grid">

                                {relatedCourses
                                    .slice(0, 3)
                                    .map(relatedCourse => (

                                        <div
                                            key={relatedCourse.id}
                                            className="course-details-page__related-card"
                                            onClick={() =>
                                                navigate(
                                                    `/courses/${relatedCourse.id}`
                                                )
                                            }
                                        >

                                            <CourseCard
                                                course={relatedCourse}
                                                variant="compact"
                                            />

                                        </div>

                                    ))}

                            </div>

                        </div>

                    </section>

                )}


            {/* Registration */}

            {showRegistration && (

                <CourseRegistration
                    course={course}
                    onClose={() =>
                        setShowRegistration(false)
                    }
                />

            )}

        </main>

    );

}

export default CourseDetails;