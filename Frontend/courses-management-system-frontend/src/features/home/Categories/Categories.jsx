import "./Categories.css";
import CategoryCard from "./CategoryCard";

import { getCategories } from "../../../api/categoryApi";
import { useEffect, useRef, useState } from "react";

function Categories() {
    const [showCards, setShowCards] = useState(false);
    const [activeCard, setActiveCard] = useState(null);

    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowCards(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.2,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

    const fetchCategories = async () => {

        try {

            const response = await getCategories();

            setCategories(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    fetchCategories();

}, []);


if (loading) {
    return (
        <section className="categories">
            <div className="categories__container">
                <h2>Loading...</h2>
            </div>
        </section>
    );
}

    return (
        <section
            ref={sectionRef}
            className={`categories ${showCards ? "show" : ""}`}
        >
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
                            active={activeCard === index}
                            activeIndex={activeCard}
                            onHover={() => setActiveCard(index)}
                            onLeave={() => setActiveCard(null)}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}

export default Categories;