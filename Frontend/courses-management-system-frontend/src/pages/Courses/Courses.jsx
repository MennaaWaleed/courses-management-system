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
        courses
            .flatMap(course =>
                course.categories?.map(category => category.categoryName) || []
            )
    )
];


    /* =========================
       FILTERED COURSES
    ========================= */
const filteredCourses =
    activeCategory === "All"
        ? courses
        : courses.filter(course =>
            course.categories?.some(
                category =>
                    category.categoryName === activeCategory
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


    return (

        <main className="courses-page">

            {/* =========================
                HERO
            ========================= */}

            <section className="courses-page__hero">

                <div className="courses-page__container">

                    <span className="courses-page__badge">
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
                COURSES
            ========================= */}

            <section className="courses-page__content">

                <div className="courses-page__container">


                    {/* =========================
                        CATEGORY TABS
                    ========================= */}

                    {!loading &&
                        !error &&
                        courses.length > 0 && (

                            <div className="courses-page__categories">

                                <div className="courses-page__categories-list">

                                    {categories.map(
                                        category => (

                                            <button
                                                key={category}
                                                type="button"
                                                className={`
                                                    courses-page__category
                                                    ${
                                                        activeCategory ===
                                                        category
                                                            ? "active"
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

                        <div className="courses-page__grid">

                            {[1, 2, 3, 4, 5, 6].map(
                                item => (

                                    <div
                                        className="course-card-skeleton"
                                        key={item}
                                    >

                                        <div className="course-card-skeleton__content">

                                            <span className="skeleton skeleton--category"></span>

                                            <span className="skeleton skeleton--title"></span>

                                            <span className="skeleton skeleton--title short"></span>

                                            <div className="course-card-skeleton__footer">

                                                <span className="skeleton skeleton--duration"></span>

                                                <span className="skeleton skeleton--button"></span>

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

                            <div className="courses-page__state">

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

                            <div className="courses-page__state">

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

                            <div className="courses-page__grid">

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

                            <div className="courses-page__state">

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