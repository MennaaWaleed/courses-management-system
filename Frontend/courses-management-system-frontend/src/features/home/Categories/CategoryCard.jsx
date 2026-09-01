import "./CategoryCard.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../api/axios";

function CategoryCard({
    category,
    index,
    active,
    activeIndex,
    onHover,
    onLeave,
}) {
    const navigate = useNavigate();

    return (
        <article
            className={`
                category-card
                ${active ? "is-active" : ""}
                ${activeIndex !== null && !active ? "is-inactive" : ""}
            `}
            style={{
                animationDelay: `${index * 0.15}s`,
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={() => {
                // FIX: Pass the category ID instead of the Name
                navigate(`/courses?category=${category.id}`);
            }}
        >
            {/* Stack */}
            <div className="category-card__stack">
                <span className="category-card__layer"></span>
                <span className="category-card__layer"></span>
            </div>

            {/* Border */}
            <svg
                className="category-card__border"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <rect
                    x="1"
                    y="1"
                    width="98"
                    height="98"
                    rx="7"
                    ry="7"
                />
            </svg>

            {/* Image */}
            <img
                src={`${BASE_URL}${category.categoryImageUrl}`}
                alt={category.categoryName}
                className="category-card__image"
            />

            {/* Overlay */}
            <div className="category-card__overlay">
                <div className="category-card__content">
                    <h3>{category.categoryName}</h3>
                    <p>{category.categoryShortDescription}</p>

                    <div className="category-card__footer">
                        <span className="category-card__link">Explore</span>
                        <button
                            className="category-card__button"
                            type="button"
                            aria-label={`Explore ${category.categoryName}`}
                        >
                            <svg
                                viewBox="0 0 40 40"
                                className="category-card__circle"
                            >
                                <circle cx="20" cy="20" r="16" />
                                <path d="M17 20H24" />
                                <path d="M21 17L24 20L21 23" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default CategoryCard;