import "./Courses.css";
import { useEffect, useState } from "react";
import { getCourses } from "../../../api/courseApi.js";
import { getPublishedCategories } from "../../../api/categoryApi.js";
import CourseCard from "../../../features/home/FeaturedCourses/CourseCard.jsx";
import { useSearchParams } from "react-router-dom";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const activeCategoryId = searchParams.get("category") || "All";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");
                
                const [coursesResponse, categoriesResponse] = await Promise.all([
                    getCourses(),
                    getPublishedCategories()
                ]);
                
                setCourses(coursesResponse.data);
                setCategories(categoriesResponse.data);
                
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError("Failed to load courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredCourses = activeCategoryId === "All"
        ? courses
        : courses.filter(course =>
            course.categoryIds && course.categoryIds.includes(activeCategoryId)
        );

    const handleCategoryChange = (categoryId) => {
        if (categoryId === "All") {
            setSearchParams({});
        } else {
            setSearchParams({ category: categoryId });
        }
    };

    return (
        <main className="course-catalog-page">
            <section className="course-catalog-page__hero">
                <div className="course-catalog-page__container">
                    <span className="course-catalog-page__badge">
                        Our Courses
                    </span>
                    <h1>
                        Explore Our Courses
                    </h1>
                    <p>
                        Build practical skills through industry-focused training programs designed for real-world careers.
                    </p>
                </div>
            </section>

            <section className="course-catalog-page__content">
                <div className="course-catalog-page__container">
                    

                    {!loading && !error && (
                        <div className="course-catalog-page__categories">
                            <div className="course-catalog-page__categories-list">
                                
                                <button
                                    type="button"
                                    className={`course-catalog-page__category ${
                                        activeCategoryId === "All" ? "course-catalog-page__category--active" : ""
                                    }`}
                                    onClick={() => handleCategoryChange("All")}
                                >
                                    All Courses
                                </button>

                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        className={`course-catalog-page__category ${
                                            activeCategoryId === category.id ? "course-catalog-page__category--active" : ""
                                        }`}
                                        onClick={() => handleCategoryChange(category.id)}
                                    >
                                        {category.categoryName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="course-catalog-page__grid">
                            {[1, 2, 3, 4, 5, 6].map(item => (
                                <div className="course-catalog-skeleton-card" key={item}>
                                    <div className="course-catalog-skeleton-card__content">
                                        <span className="course-catalog-skeleton course-catalog-skeleton--category" />
                                        <span className="course-catalog-skeleton course-catalog-skeleton--title" />
                                        <span className="course-catalog-skeleton course-catalog-skeleton--title course-catalog-skeleton--title-short" />
                                        <div className="course-catalog-skeleton-card__footer">
                                            <span className="course-catalog-skeleton course-catalog-skeleton--duration" />
                                            <span className="course-catalog-skeleton course-catalog-skeleton--button" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="course-catalog-page__state">
                            <h3>Something went wrong</h3>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && courses.length === 0 && (
                        <div className="course-catalog-page__state">
                            <h3>No courses available</h3>
                            <p>There are currently no courses available.</p>
                        </div>
                    )}

                    {!loading && !error && filteredCourses.length > 0 && (
                        <div className="course-catalog-page__grid">
                            {filteredCourses.map(course => (
                                <CourseCard
                                    key={course.id}
                                    course={{
                                        ...course,
                                        title: course.courseName,
                                        duration: `${course.courseHours} Hours`,
                                        image: `http://localhost:8080${course.imageUrl}`,
                                        icon: `http://localhost:8080${course.iconUrl}`,
                                    }}
                                    variant="compact"
                                />
                            ))}
                        </div>
                    )}

                    {!loading && !error && courses.length > 0 && filteredCourses.length === 0 && (
                        <div className="course-catalog-page__state">
                            <h3>No courses found</h3>
                            <p>There are no courses available in this category.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Courses;