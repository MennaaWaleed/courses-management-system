import "./FeaturedCourses.css";
import CourseCard from "./CourseCard";
import { useEffect, useState } from "react";
import { getFeaturedCourses } from "../../../api/courseApi";

function FeaturedCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getFeaturedCourses();
                setCourses(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <section className="featured-courses">
                <div className="featured-courses__container">
                    <h2>Loading...</h2>
                </div>
            </section>
        );
    }

    return (
        <section className="featured-courses">
            <div className="featured-courses__container">
                <div className="featured-courses__header">
                    <span className="featured-courses__badge">
                        Featured Courses
                    </span>
                    <h2>
                        Start Learning with Our Most Popular Programs
                    </h2>
                    <p>
                        Industry-focused training designed to help you build practical skills and accelerate your engineering career.
                    </p>
                </div>

                <div className="featured-courses__grid">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturedCourses;