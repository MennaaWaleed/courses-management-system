import { useEffect, useState } from "react";
import {deleteCategory,getCategories, toggleCategoryPublished} from "../../api/categoryApi";
import "./AdminCategories.css";
import { useNavigate } from "react-router-dom";

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();

    const [categoryToDelete, setCategoryToDelete] = useState(null);
    // const handleDelete = async () => {
    //     if (!categoryToDelete) {
    //         return;
    //     }
    //
    //     try {
    //         await deleteCategory(categoryToDelete.id);
    //
    //         setCategories((prevCategories) =>
    //             prevCategories.filter(
    //                 (category) => category.id !== categoryToDelete.id
    //             )
    //         );
    //         setCategoryToDelete(null);
    //
    //     } catch (error) {
    //         console.error("Error deleting category:", error);
    //     }
    // };

    const handleDelete = async () => {
        if (!categoryToDelete) {
            return;
        }

        console.log("Deleting category:", categoryToDelete.id);

        try {
            const response = await deleteCategory(categoryToDelete.id);

            console.log("Delete response:", response);

            setCategories((prevCategories) =>
                prevCategories.filter(
                    (category) => category.id !== categoryToDelete.id
                )
            );

            setCategoryToDelete(null);

        } catch (error) {
            console.error("Error deleting category:", error);

            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }
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

    const togglePublished = async (id) => {
        try {
            await toggleCategoryPublished(id);

            const response = await getCategories();
            setCategories(response.data);

        } catch (error) {
            console.error("Error updating publish status:", error);
        }
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

                            <button
                                className="btn edit-button"
                                onClick={() =>
                                    navigate(`/admin/categories/${category.id}/edit`)
                                }
                            >
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
                                onClick={() => setCategoryToDelete(category)}
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                ))}
            </div>
            {categoryToDelete && (
                <div className="modal-overlay">

                    <div className="delete-modal">

                        <h2>Delete Category?</h2>

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{categoryToDelete.categoryName}</strong>?
                        </p>

                        <p className="delete-warning">
                            This action cannot be undone.
                        </p>

                        <div className="modal-actions">

                            <button
                                className="cancel-button"
                                onClick={() => setCategoryToDelete(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-delete-button"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default AdminCategories;