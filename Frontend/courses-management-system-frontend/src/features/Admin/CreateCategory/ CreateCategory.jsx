import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../api/categoryApi";
import "./CreateCategory.css";

function CreateCategory() {
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [image, setImage] = useState(null);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");

        const categoryData = {
            categoryName,
            categoryDescription,
            shortDescription,
            image
        };

        try {
            await createCategory(categoryData);

            navigate("/admin/categories");

        } catch (error) {
            console.error("Error creating category:", error);
            setError("Could not create category.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="create-category">

            <div className="create-category-header">

                <h1>Create New Category</h1>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin/categories")}
                >
                    ← Back
                </button>

            </div>

            <form
                className="create-category-form"
                onSubmit={handleSubmit}
            >

                <label>
                    Category Name
                </label>

                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) =>
                        setCategoryName(e.target.value)
                    }
                    required
                />


                <label>
                    Short Description
                </label>

                <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) =>
                        setShortDescription(e.target.value)
                    }
                    required
                />


                <label>
                    Description
                </label>

                <textarea
                    value={categoryDescription}
                    onChange={(e) =>
                        setCategoryDescription(e.target.value)
                    }
                    required
                />


                <label>
                    Category Image
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setImage(e.target.files[0])
                    }
                />


                {image && (
                    <div className="image-preview">

                        <img
                            src={URL.createObjectURL(image)}
                            alt="Category preview"
                        />

                    </div>
                )}


                {error && (
                    <p className="create-error">
                        {error}
                    </p>
                )}


                <div className="create-category-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                            navigate("/admin/categories")
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="save-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Creating..."
                            : "Create Category"
                        }
                    </button>

                </div>

            </form>

        </div>
    );
}

export default CreateCategory;