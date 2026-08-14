import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCoursesByCategory } from "../../../api/courseApi";
import { getCategoryById } from "../../../api/categoryApi";

import "./CategoryCourses.css";

function CategoryCourses() {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryResponse = await getCategoryById(categoryId);

                setCategory(categoryResponse.data);

                const coursesResponse =
                    await getCoursesByCategory(categoryId);

                console.log("Courses:", coursesResponse.data);

                setCourses(coursesResponse.data);

            } catch (error) {
                console.error(
                    "Error loading category courses:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId]);

    if (loading) {
        return (
            <div className="category-courses-loading">
                Loading...
            </div>
        );
    }

    return (
        <div className="category-courses">

            <div className="category-courses-header">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/admin/categories")
                    }
                >
                    ← Back to Categories
                </button>


                <h1>
                    {category?.categoryName || "Category"}
                </h1>


                <button
                    className="create-course-button"
                    onClick={() =>
                        navigate(
                            `/admin/categories/${categoryId}/courses/create`
                        )
                    }
                >
                    + Create New Course
                </button>

            </div>


            <div className="category-courses-list">

                {courses.length === 0 ? (

                    <div className="no-courses">
                        <p>No courses in this category.</p>
                    </div>

                ) : (

                    courses.map((course) => (

                        <div
                            className="course-card"
                            key={course.id}
                        >


                            <div className="course-icon-container">

                                <img
                                    src={
                                        course.iconUrl
                                            ? `http://localhost:8080${course.iconUrl}`
                                            : "/default-course.png"
                                    }
                                    alt={course.courseName}
                                    className="course-icon"
                                />

                            </div>



                            <div className="course-info">

                                <h2>
                                    {course.courseName}
                                </h2>

                                <p>
                                    {course.shortDescription}
                                </p>

                                <span
                                    className={
                                        course.published
                                            ? "course-status published"
                                            : "course-status not-published"
                                    }
                                >
                                    {course.published
                                        ? "Published"
                                        : "Not Published"}
                                </span>

                            </div>



                            <div className="course-actions">

                                <button
                                    className="edit-course-button"
                                    onClick={() =>
                                        navigate(
                                            `/admin/courses/${course.id}/edit`
                                        )
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    className="publish-course-button"
                                >
                                    {course.published
                                        ? "Unpublish"
                                        : "Publish"}
                                </button>


                                <button
                                    className="delete-course-button"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default CategoryCourses;