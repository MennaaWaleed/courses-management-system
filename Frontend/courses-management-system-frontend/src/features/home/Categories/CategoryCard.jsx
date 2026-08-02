import "./CategoryCard.css";

function CategoryCard({ category, index }) {

    return (

        <article className="category-card"
            style={{
                animationDelay: `${index * .15}s`
            }} >

            <img
                src={category.imageUrl}
                alt={category.categoryName}
                className="category-card__image"
            />

            <div className="category-card__overlay">

                <div className="category-card__content">

                    <h3>{category.categoryName}</h3>

                    <p>{category.shortDescription}</p>

                    <span className="category-card__link">
                        Explore →
                    </span>

                </div>

            </div>

        </article>

    );

}

export default CategoryCard;