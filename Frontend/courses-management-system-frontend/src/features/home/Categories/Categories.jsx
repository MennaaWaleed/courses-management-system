import "./Categories.css";
import CategoryCard from "./CategoryCard";
import { getPublishedCategories } from "../../../api/categoryApi";
import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

function Categories() {
    const [showCards, setShowCards] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await getPublishedCategories();
            const data = response.data;

            const imagePromises = data
                .filter((category) => category.imageUrl)
                .map(
                    (category) =>
                        new Promise((resolve) => {
                            const img = new Image();

                            img.onload = resolve;
                            img.onerror = resolve;

                            img.src = category.imageUrl.startsWith("http")
                                ? category.imageUrl
                                : `${BASE_URL}${category.imageUrl}`;
                        })
                );

            await Promise.all(imagePromises);

            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchCategories();
}, []);

    return (
        <section ref={ref} className={`categories ${inView ? "show" : ""}`}>
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
                    {loading ? (
                        [...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="category-skeleton"
                            ></div>
                        ))
                    ) : (
                        categories.map((category, index) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                index={index}
                                active={activeCard === index}
                                activeIndex={activeCard}
                                onHover={() => setActiveCard(index)}
                                onLeave={() => setActiveCard(null)}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default Categories;