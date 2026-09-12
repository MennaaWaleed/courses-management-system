import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookOpen,
    Calendar,
    Monitor,
    ArrowRight
} from "lucide-react";

import { getMyCourses } from "../../api/enrollmentApi";
import { BASE_URL } from "../../api/axios";

import "./MyCourses.css";

function MyCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const data = await getMyCourses();

                console.log("My Courses:", data);

                setCourses(data);
            } catch (error) {
                console.error("Error fetching my courses:", error);

                if (error.response?.data?.message) {
                    setError(error.response.data.message);
                } else {
                    setError("Failed to load your courses.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    const handleViewCourse = (batchId) => {
        navigate(`/student/batches/${batchId}/lectures`);
    };

    if (loading) {
        return (
            <div className="my-courses-page">
                <div className="my-courses-loading">
                    Loading your courses...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-courses-page">
                <div className="my-courses-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="my-courses-page">
            <div className="my-courses-header">

                <div>
                    <h1>My Courses</h1>

                    <p>
                        Courses you are currently enrolled in
                    </p>
                </div>

                <div className="my-courses-count">
                    <BookOpen size={20} />

                    <span>
                        {courses.length} Course
                        {courses.length !== 1 ? "s" : ""}
                    </span>
                </div>

            </div>
            {courses.length === 0 ? (

                <div className="no-courses">

                    <BookOpen size={50} />

                    <h2>
                        No Courses Yet
                    </h2>

                    <p>
                        You are not enrolled in any courses yet.
                    </p>

                    <button
                        onClick={() => navigate("/courses")}
                        className="browse-courses-button"
                    >
                        Browse Courses
                    </button>

                </div>

            ) : (
                <div className="my-courses-grid">

                    {courses.map((course) => (

                        <div
                            className="my-course-card"
                            key={course.batchId}
                        >
                            <div className="my-course-image-container">

                                <img
                                    src={`${BASE_URL}${course.courseImageUrl}`}
                                    alt={course.courseName}
                                    className="my-course-image"
                                    onError={(e) => {
                                        console.error(
                                            "Image failed to load:",
                                            e.target.src
                                        );

                                        e.target.style.display = "none";
                                    }}
                                />

                                <span className="course-status">
                                    {course.enrollmentStatus}
                                </span>

                            </div>
                            <div className="my-course-content">

                                <h2>
                                    {course.courseName}
                                </h2>

                                <p className="batch-name">
                                    {course.batchName}
                                </p>

                                <p className="course-description">
                                    {course.courseDescription}
                                </p>
                                <div className="course-info">

                                    <div className="course-info-item">

                                        <Monitor size={17} />

                                        <span>
                                            {course.attendanceType}
                                        </span>

                                    </div>


                                    <div className="course-info-item">

                                        <Calendar size={17} />

                                        <span>
                                            {new Date(
                                                course.startDate
                                            ).toLocaleDateString()}

                                            {" - "}

                                            {new Date(
                                                course.endDate
                                            ).toLocaleDateString()}
                                        </span>

                                    </div>

                                </div>
                                <button
                                    className="view-course-button"
                                    onClick={() =>
                                        handleViewCourse(
                                            course.batchId
                                        )
                                    }
                                >
                                    View Course

                                    <ArrowRight size={18} />

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyCourses;