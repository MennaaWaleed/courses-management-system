import "./Categories.css";
import CategoryCard from "./CategoryCard";
import architecture from "../../../assets/images/architecture2.jpg";
import { useEffect, useRef, useState } from "react";
function Categories() {


const [showCards, setShowCards] = useState(false);

const sectionRef = useRef(null);

useEffect(() => {

    const observer = new IntersectionObserver(

        ([entry]) => {

            if(entry.isIntersecting){

                setShowCards(true);

                observer.disconnect();

            }

        },

        {
            threshold:.2
        }

    );

    if(sectionRef.current){

        observer.observe(sectionRef.current);

    }

    return ()=>observer.disconnect();

},[]);



    const categories = [
        {
            id: 1,
            categoryName: "Architecture",
            shortDescription: "BIM Design & Architectural Visualization",
            imageUrl: architecture,
        },
        {
            id: 2,
            categoryName: "Structure",
            shortDescription: "Structural Analysis & BIM Modeling",
            imageUrl: architecture,
        },
        {
            id: 3,
            categoryName: "Mechanical",
            shortDescription: "HVAC • Plumbing • Fire Fighting",
            imageUrl: architecture,
        },
        {
            id: 4,
            categoryName: "Electrical",
            shortDescription: "Power • Lighting • BIM MEP",
            imageUrl: architecture,
        },
        {
            id: 5,
            categoryName: "Civil",
            shortDescription: "Infrastructure & Road Design",
            imageUrl: architecture,
        },
        {
            id: 6,
            categoryName: "Interior Design",
            shortDescription: "Visualization & Interior Modeling",
            imageUrl: architecture,
        },
    ];

    return (
        <section ref={sectionRef}  className={`categories ${showCards ? "show" : ""}`} >

            <div className="categories__container">

                <div className="categories__header">

                    <span className="categories__badge">
                        Explore Categories
                    </span>

                    <h2>
                        Choose Your Engineering Specialization
                    </h2>

                    <p>
                        Discover professional training paths designed for every engineering discipline.
                    </p>

                </div>

                <div className="categories__grid">

                    {categories.map((category, index) => (

                        <CategoryCard
                            key={category.id}
                            category={category}
                            index={index}
                        />

                    ))}

                </div>

            </div>

        </section>
    );
}

export default Categories;