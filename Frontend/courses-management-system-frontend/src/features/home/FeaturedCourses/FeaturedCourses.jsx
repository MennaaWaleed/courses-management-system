import "./FeaturedCourses.css";
import CourseCard from "./CourseCard";

function FeaturedCourses() {

    const courses = [
        {
            id: 1,
            title: "Revit Architecture",
            category: "BIM",
            duration: "60 Hours",
            description: "Professional BIM Modeling & Documentation",
            image: "https://picsum.photos/600/800?1",
        },
        {
            id: 2,
            title: "Civil 3D",
            category: "Infrastructure",
            duration: "50 Hours",
            description: "Road Design & Land Development",
            image: "https://picsum.photos/600/800?2",
        },
        {
            id: 3,
            title: "Primavera P6",
            category: "Project Management",
            duration: "36 Hours",
            description: "Planning, Scheduling & Resource Management",
            image: "https://picsum.photos/600/800?3",
        },
    ];

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