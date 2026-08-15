import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCoursesByCategory } from "../../../api/courseApi";
import { getCategoryById } from "../../../api/categoryApi";
import {
    publishCourse,
    featureCourse,
    deleteCourse
} from "../../../api/courseApi";
import "./CategoryCourses.css";

function CategoryCourses() {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState(null);
    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const handlePublish = async (course) => {
        try {
            await publishCourse(course.id);

            setCourses((prevCourses) =>
                prevCourses.map((c) =>
                    c.id === course.id
                        ? { ...c, published: !c.published }
                        : c
                )
            );

        } catch (error) {
            console.error("Error publishing course:", error);
        }
    };

    const handleFeature = async (course) => {
        try {
            await featureCourse(course.id);

            setCourses((prevCourses) =>
                prevCourses.map((c) =>
                    c.id === course.id
                        ? { ...c, featured: !c.featured }
                        : c
                )
            );

        } catch (error) {
            console.error("Error featuring course:", error);
        }
    };

    const handleDelete = async (courseId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteCourse(courseId);

            setCourses((prevCourses) =>
                prevCourses.filter((course) => course.id !== courseId)
            );

        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryResponse = await getCategoryById(categoryId);
                setCategory(categoryResponse.data);

                const coursesResponse = await getCoursesByCategory(categoryId);
                console.log("Courses:", coursesResponse.data);
                setCourses(coursesResponse.data);
            } catch (error) {
                console.error("Error loading category courses:", error);
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
                    onClick={() => navigate("/admin/categories")}
                >
                    ← Back to Categories
                </button>

                <div className="category-title">
                    <h1>
                        <span className="category-name">
                            {category?.categoryName || "Loading..."}
                        </span>
                        {" "}
                        <span className="category-label">
                            Category
                        </span>
                    </h1>
                    <p>
                        {courses.length} {courses.length === 1 ? "Course" : "Courses"}
                    </p>
                </div>

                <button
                    className="create-course-button"
                    onClick={() => navigate(`/admin/categories/${categoryId}/courses/create`)}
                >
                    + Create New Course
                </button>

            </div>


            <div className="category-courses-list">

                {courses.length === 0 ? (
                    <div className="no-courses">
                        <p>No courses in this category.</p>
                        <button
                            onClick={() => navigate(`/admin/categories/${categoryId}/courses/create`)}
                        >
                            Create First Course
                        </button>
                    </div>
                ) : (
                    courses.map((course) => (
                        <div className="course-card" key={course.id}>


                            <div className="course-image-container">
                                <img
                                    src={
                                        course.imageUrl
                                            ? `http://localhost:8080${course.imageUrl}`
                                            : "/default-course.png"
                                    }
                                    alt={course.courseName}
                                    className="course-image"
                                />
                            </div>


                            <div className="course-info">

                                <div className="course-name-row">
                                    <div className="course-icon-container">
                                        <img
                                            src={
                                                course.iconUrl
                                                    ? `http://localhost:8080${course.iconUrl}`
                                                    : "/default-course-icon.png"
                                            }
                                            alt=""
                                            className="course-icon"
                                        />
                                    </div>
                                    <h2>{course.courseName}</h2>
                                </div>

                                <p className="course-description">
                                    {course.shortDescription || "No description provided."}
                                </p>

                                <div className="course-details">
                                    <span>⏱ {course.courseHours} Hours</span>
                                    <span>📚 {course.lectureCount} Lectures</span>
                                    <span>💰 {course.price}</span>
                                </div>

                                <div className="course-status-row">
                                    <span
                                        className={
                                            course.published
                                                ? "course-status published"
                                                : "course-status not-published"
                                        }
                                    >
                                        {course.published ? "Published" : "Not Published"}
                                    </span>

                                    {course.featured && (
                                        <span className="featured-badge">
                                            ★ Featured
                                        </span>
                                    )}
                                </div>
                            </div>


                            <div className="course-actions">

                                <button
                                    className="edit-course-button"
                                    onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className={
                                        course.featured
                                            ? "unfeature-course-button"
                                            : "feature-course-button"
                                    }
                                    onClick={() => handleFeature(course)}
                                >
                                    {course.featured ? "Unfeature" : "Feature"}
                                </button>

                                <button
                                    className={
                                        course.published
                                            ? "unpublish-course-button"
                                            : "publish-course-button"
                                    }
                                    onClick={() => handlePublish(course)}
                                >
                                    {course.published ? "Unpublish" : "Publish"}
                                </button>

                                <button
                                    className="delete-course-button"
                                    onClick={() => handleDelete(course.id)}
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