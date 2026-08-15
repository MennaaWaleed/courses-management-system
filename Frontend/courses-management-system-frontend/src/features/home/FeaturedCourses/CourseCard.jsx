import "./CourseCard.css";
import { useNavigate } from "react-router-dom";

function CourseCard({ course, variant = "default" }) {

    const navigate = useNavigate();

    const BASE_URL = "http://localhost:8080";

    const handleOpenCourse = () => {
        navigate(`/courses/${course.id}`);
    };

    return (

        <article
            className={`mcc-course-card mcc-course-card--${variant}`}
            onClick={handleOpenCourse}
        >

            <div className="mcc-course-card__stack">
                <span className="mcc-course-card__layer"></span>
                <span className="mcc-course-card__layer"></span>
            </div>

            <svg
                className="mcc-course-card__border"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <rect
                    x="1"
                    y="1"
                    width="98"
                    height="98"
                    rx="7"
                    ry="7"
                />
            </svg>

            <img
                src={`${BASE_URL}${course.imageUrl}`}
                alt={course.courseName}
                className="mcc-course-card__image"
            />

            <div className="mcc-course-card__overlay">

                <div className="mcc-course-card__content">

                    <span className="mcc-course-card__category">
                        {course.categories
                            ?.map(category => category.categoryName)
                            .join(" • ")}
                    </span>

                    <div className="mcc-course-card__title">

                        <img
                            src={`${BASE_URL}${course.iconUrl}`}
                            alt={course.courseName}
                            className="mcc-course-card__icon"
                        />

                        <h3>{course.courseName}</h3>

                    </div>

                    <div className="mcc-course-card__footer">

                        <span className="mcc-course-card__duration">
                            ⏱ {course.courseHours} Hours
                        </span>

                        <button
                            className="mcc-course-card__button"
                            type="button"
                        >
                            <svg
                                className="mcc-course-card__circle"
                                viewBox="0 0 40 40"
                            >
                                <circle
                                    cx="20"
                                    cy="20"
                                    r="16"
                                />

                                <path d="M17 20H24" />

                                <path d="M21 17L24 20L21 23" />
                            </svg>
                        </button>

                    </div>

                </div>

            </div>

        </article>
    );
}

export default CourseCard;