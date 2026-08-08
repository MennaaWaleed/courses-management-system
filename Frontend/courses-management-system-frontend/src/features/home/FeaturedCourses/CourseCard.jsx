import "./CourseCard.css";

function CourseCard({ course, variant = "default" }) {
const BASE_URL = "http://localhost:8080";
    return (

   <article className={`course-card course-card--${variant}`}>

    <div className="course-card__stack">
        <span className="course-card__layer"></span>
        <span className="course-card__layer"></span>
    </div>

  
    <svg
        className="course-card__border"
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
    className="course-card__image"
/>

<div className="course-card__overlay">

    <div className="course-card__content">

        <span className="course-card__category">
            {course.category.categoryName}
        </span>

        <div className="course-card__title">

<img
    src={`${BASE_URL}${course.iconUrl}`}
    alt={course.courseName}
    className="course-card__icon"
/>

    <h3>{course.courseName}</h3>

</div>

        {/* <p>{course.description}</p> */}

        <div className="course-card__footer">

            <span className="course-card__duration">
                ⏱ {course.courseHours} Hours
            </span>

                <button
                    className="course-card__button"
                    type="button"
                >
                    <svg
                        className="course-card__circle"
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