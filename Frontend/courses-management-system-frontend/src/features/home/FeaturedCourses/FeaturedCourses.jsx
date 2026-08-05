import "./FeaturedCourses.css";
import CourseCard from "./CourseCard";

import { useEffect, useState } from "react";
import { getFeaturedCourses } from "../../../api/courseApi";





// import revitIcon from "../../../assets/icons/autodesk-revit-icon.png";
// import civilIcon from "../../../assets/icons/autodesk-civil-3d-icon.png";
// import cadIcon from "../../../assets/icons/autocad-icon.png";
// import maxIcon from "../../../assets/icons/autodesk-3ds-max-icon.png";


// import revitImg from "../../../assets/Courses_img/Revit_Archi9.png";
// import civilImg from "../../../assets/Courses_img/CIVIL_3D.png";
// import cadImg from "../../../assets/Courses_img/AutoCAD_2D.png";
// import InteriorImg from "../../../assets/Courses_img/Interior_Design_Diploma.png";


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