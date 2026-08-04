import "./CourseCard.css";

function CourseCard({ course }) {

    return (

   <article className="course-card">

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
        src={course.image}
        alt={course.title}
        className="course-card__image"
    />

<div className="course-card__overlay">

    <div className="course-card__content">

        <span className="course-card__category">
            {course.category}
        </span>

        <h3>{course.title}</h3>

        <p>{course.description}</p>

        <div className="course-card__footer">

            <span className="course-card__duration">
                ⏱ {course.duration}
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