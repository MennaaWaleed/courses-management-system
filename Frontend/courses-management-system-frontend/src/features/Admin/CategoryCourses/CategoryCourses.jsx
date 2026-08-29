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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);


    const handlePublish = async (course) => {
        try {
            await publishCourse(course.id);

            setCourses((prevCourses) =>
                prevCourses.map((c) =>
                    c.id === course.id
                        ? {
                            ...c,
                            published: !c.published
                        }
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
                        ? {
                            ...c,
                            featured: !c.featured
                        }
                        : c
                )
            );
        } catch (error) {
            console.error("Error featuring course:", error);
        }
    };


    const handleDelete = (course) => {
        setCourseToDelete(course);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!courseToDelete) {
            return;
        }

        setDeleting(true);

        try {
            await deleteCourse(courseToDelete.id);

            setCourses((prevCourses) =>
                prevCourses.filter(
                    (course) => course.id !== courseToDelete.id
                )
            );

            setShowDeleteModal(false);
            setCourseToDelete(null);
        } catch (error) {
            console.error("Error deleting course:", error);
        } finally {
            setDeleting(false);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryResponse = await getCategoryById(categoryId);
                setCategory(categoryResponse.data);

                const coursesResponse = await getCoursesByCategory(categoryId);
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
                    onClick={() => navigate("/")}
                >
                    ← Back to Categories
                </button>

                <div className="category-title">
                    <h1>
                        <span className="category-name">
                            {category?.categoryName || "Loading..."}
                        </span>{" "}
                        <span className="category-label">Category</span>
                    </h1>
                    <p>
                        {courses.length} {courses.length === 1 ? "Course" : "Courses"}
                    </p>
                </div>

                <button
                    className="create-course-button"
                    onClick={() =>
                        navigate(`/admin/categories/${categoryId}/courses/create`)
                    }
                >
                    + Create New Course
                </button>
            </div>

            <div className="category-courses-list">
                {courses.length === 0 ? (
                    <div className="no-courses">
                        <p>No courses in this category.</p>
                        <button
                            onClick={() =>
                                navigate(`/admin/categories/${categoryId}/courses/create`)
                            }
                        >
                            Create First Course
                        </button>
                    </div>
                ) : (
                    courses.map((course) => (
                        <div className="course-card" key={course.id}>

                            <div
                                className="course-image-container"
                                onClick={() => navigate(`/admin/courses/${course.id}/batches`)}
                                title="View Batches"
                            >
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
                                    <button
                                        type="button"
                                        className="course-icon-container"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/admin/courses/${course.id}/batches`);
                                        }}
                                        title="View Batches"
                                    >
                                        <img
                                            src={
                                                course.iconUrl
                                                    ? `http://localhost:8080${course.iconUrl}`
                                                    : "/default-course-icon.png"
                                            }
                                            alt={course.courseName}
                                            className="course-icon"
                                        />
                                    </button>

                                    <h2
                                        onClick={() => navigate(`/admin/courses/${course.id}/batches`)}
                                        style={{ cursor: "pointer" }}
                                        title="View Batches"
                                    >
                                        {course.courseName}
                                    </h2>
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
                                    onClick={() =>
                                        navigate(`/admin/courses/edit/${course.id}`)
                                    }
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
                                    onClick={() => handleDelete(course)}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>

            {showDeleteModal && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <div className="delete-icon">!</div>

                        <h2>Delete Course?</h2>

                        <p>
                            Are you sure you want to delete
                            <strong> {courseToDelete?.courseName}</strong>?
                        </p>

                        <p className="delete-warning">
                            This action cannot be undone.
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                className="cancel-delete-button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setCourseToDelete(null);
                                }}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-delete-button"
                                onClick={confirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryCourses;