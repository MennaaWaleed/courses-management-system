import { useEffect, useState } from "react";
import { getCategories } from "../../api/categoryApi";
import "./AdminCategories.css";
import api from "../../api/axios";

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const deleteCategory = async (id) => {
        try {
            await api.delete(`/categories/${id}`);

            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== id)
            );

        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

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

    const togglePublished = (id) => {
        console.log("Toggling publish status for category ID:", id);
    };

    if (loading) {
        return (
            <div className="admin-categories">
                <div className="admin-header">
                    <h1>Categories</h1>
                </div>
                <div className="loading-spinner">Loading categories...</div>
            </div>
        );
    }

    return (
        <div className="admin-categories">
            <div className="admin-header">
                <h1>Categories</h1>

                <button className="create-category-button">
                    + Create New Category
                </button>
            </div>

            <div className="admin-categories-list">
                {categories.map((category, index) => (
                    <div
                        key={category.id}
                        className="admin-category-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* --- New Image Section --- */}
                        <div className="card-image-container">
                            <img
                                src={
                                    category.imageUrl
                                        ? `http://localhost:8080${category.imageUrl}`
                                        : "/default-category.png"
                                }
                                alt={category.categoryName}
                                className="category-image"
                            />
                        </div>

                        <div className="card-header">
                            <h2>{category.categoryName}</h2>
                            <span
                                className={`status-badge ${category.published ? "status-published" : "status-draft"}`}
                            >
                                {category.published ? "Published" : "Not Published"}
                            </span>
                        </div>

                        <div className="category-actions">

                            <button className="btn edit-button">
                                Edit
                            </button>

                            <button
                                className={`btn ${
                                    category.published
                                        ? "unpublish-button"
                                        : "publish-button"
                                }`}
                                onClick={() => togglePublished(category.id)}
                            >
                                {category.published ? "Unpublish" : "Publish"}
                            </button>

                            <button
                                className="btn delete-button"
                                onClick={() => deleteCategory(category.id)}
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminCategories;