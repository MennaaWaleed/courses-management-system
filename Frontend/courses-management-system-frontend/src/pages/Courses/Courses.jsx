import "./Courses.css";
import { useEffect, useState } from "react";
import { getCourses } from "../../api/courseApi";
import CourseCard from "../../features/Home/FeaturedCourses/CourseCard";
import { useSearchParams } from "react-router-dom";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    /* =========================
       ACTIVE CATEGORY
    ========================= */

    const activeCategory =
        searchParams.get("category") || "All";


    /* =========================
       FETCH COURSES
    ========================= */

    useEffect(() => {

        const fetchCourses = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getCourses();

                setCourses(response.data);

            } catch (error) {

                console.error(
                    "Failed to fetch courses:",
                    error
                );

                setError("Failed to load courses.");

            } finally {

                setLoading(false);

            }

        };

        fetchCourses();

    }, []);


    /* =========================
       CATEGORIES
    ========================= */

    const categories = [
        "All",
        ...new Set(
            courses.flatMap(
                course =>
                    course.categories?.map(
                        category =>
                            category.categoryName
                    ) || []
            )
        )
    ];


    /* =========================
       FILTERED COURSES
    ========================= */

    const filteredCourses =
        activeCategory === "All"
            ? courses
            : courses.filter(
                course =>
                    course.categories?.some(
                        category =>
                            category.categoryName ===
                            activeCategory
                    )
            );


    /* =========================
       CATEGORY CHANGE
    ========================= */

    const handleCategoryChange = (category) => {

        if (category === "All") {

            setSearchParams({});

        } else {

            setSearchParams({
                category: category
            });

        }

    };


    /* =========================
       RENDER
    ========================= */

    return (

        <main className="course-catalog-page">


            {/* =========================
                HERO
            ========================= */}

            <section className="course-catalog-page__hero">

                <div className="course-catalog-page__container">

                    <span className="course-catalog-page__badge">
                        Our Courses
                    </span>

                    <h1>
                        Explore Our Courses
                    </h1>

                    <p>
                        Build practical skills through
                        industry-focused training programs
                        designed for real-world careers.
                    </p>

                </div>

            </section>


            {/* =========================
                COURSES CONTENT
            ========================= */}

            <section className="course-catalog-page__content">

                <div className="course-catalog-page__container">


                    {/* =========================
                        CATEGORY TABS
                    ========================= */}

                    {!loading &&
                        !error &&
                        courses.length > 0 && (

                            <div className="course-catalog-page__categories">

                                <div className="course-catalog-page__categories-list">

                                    {categories.map(
                                        category => (

                                            <button
                                                key={category}
                                                type="button"

                                                className={`
                                                    course-catalog-page__category
                                                    ${
                                                        activeCategory === category
                                                            ? "course-catalog-page__category--active"
                                                            : ""
                                                    }
                                                `}

                                                onClick={() =>
                                                    handleCategoryChange(
                                                        category
                                                    )
                                                }
                                            >

                                                {category === "All"
                                                    ? "All Courses"
                                                    : category}

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                    {/* =========================
                        LOADING
                    ========================= */}

                    {loading && (

                        <div className="course-catalog-page__grid">

                            {[1, 2, 3, 4, 5, 6].map(
                                item => (

                                    <div
                                        className="course-catalog-skeleton-card"
                                        key={item}
                                    >

                                        <div className="course-catalog-skeleton-card__content">

                                            <span
                                                className="
                                                    course-catalog-skeleton
                                                    course-catalog-skeleton--category
                                                "
                                            />

                                            <span
                                                className="
                                                    course-catalog-skeleton
                                                    course-catalog-skeleton--title
                                                "
                                            />

                                            <span
                                                className="
                                                    course-catalog-skeleton
                                                    course-catalog-skeleton--title
                                                    course-catalog-skeleton--title-short
                                                "
                                            />


                                            <div className="course-catalog-skeleton-card__footer">

                                                <span
                                                    className="
                                                        course-catalog-skeleton
                                                        course-catalog-skeleton--duration
                                                    "
                                                />

                                                <span
                                                    className="
                                                        course-catalog-skeleton
                                                        course-catalog-skeleton--button
                                                    "
                                                />

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* =========================
                        ERROR
                    ========================= */}

                    {!loading &&
                        error && (

                            <div className="course-catalog-page__state">

                                <h3>
                                    Something went wrong
                                </h3>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                    {/* =========================
                        EMPTY
                    ========================= */}

                    {!loading &&
                        !error &&
                        courses.length === 0 && (

                            <div className="course-catalog-page__state">

                                <h3>
                                    No courses available
                                </h3>

                                <p>
                                    There are currently no
                                    courses available.
                                </p>

                            </div>

                        )}


                    {/* =========================
                        COURSES GRID
                    ========================= */}

                    {!loading &&
                        !error &&
                        filteredCourses.length > 0 && (

                            <div className="course-catalog-page__grid">

                                {filteredCourses.map(
                                    course => (

                                        <CourseCard
                                            key={course.id}

                                            course={{
                                                ...course,

                                                title:
                                                    course.courseName,

                                                duration:
                                                    `${course.courseHours} Hours`,

                                                image:
                                                    `http://localhost:8080${course.imageUrl}`,

                                                icon:
                                                    `http://localhost:8080${course.iconUrl}`,
                                            }}

                                            variant="compact"
                                        />

                                    )
                                )}

                            </div>

                        )}


                    {/* =========================
                        NO RESULTS
                    ========================= */}

                    {!loading &&
                        !error &&
                        courses.length > 0 &&
                        filteredCourses.length === 0 && (

                            <div className="course-catalog-page__state">

                                <h3>
                                    No courses found
                                </h3>

                                <p>
                                    There are no courses
                                    available in this category.
                                </p>

                            </div>

                        )}

                </div>

            </section>

        </main>

    );
}

export default Courses;