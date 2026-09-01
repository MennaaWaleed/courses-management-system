import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "../../../api/categoryApi.js";
import "./EditCategory.css";

function EditCategory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await getCategoryById(id);
                const category = response.data;
                setCategoryName(category.categoryName || "");
                setCategoryDescription(category.categoryDescription || "");
                setShortDescription(category.categoryShortDescription || "");
                setCurrentImageUrl(category.categoryImageUrl || "");
            } catch (error) {
                console.error("Error fetching category:", error);
                setError("Could not load category.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setShowConfirm(true);
    };

    const handleConfirmSave = async () => {
        setSaving(true);
        setError("");

        const categoryData = {
            categoryName: categoryName,
            categoryDescription: categoryDescription,
            shortDescription: shortDescription,
            image: selectedImage
        };

        try {
            await updateCategory(id, categoryData);
            setShowConfirm(false);
            navigate("/admin/categories");
        } catch (error) {
            console.error("Error updating category:", error);
            setError("Could not update category.");
            setShowConfirm(false);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelConfirm = () => {
        if (!saving) setShowConfirm(false);
    };

    if (loading) {
        return (
            <div className="edit-category">
                <p>Loading category...</p>
            </div>
        );
    }

    return (
        <div className="edit-category">
            <div className="edit-category-header">
                <h1>Edit Category</h1>
                <button className="back-button" onClick={() => navigate("/admin/categories")}>
                    ← Back
                </button>
            </div>

            {error && <div className="edit-error">{error}</div>}

            <form className="edit-category-form" onSubmit={handleSubmit}>
                <label>Category Name</label>
                <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />

                <label>Short Description</label>
                <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required />

                <label>Description</label>
                <textarea value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} required />

                <label>Category Image</label>
                <div className="image-preview-container">
                    {imagePreview ? (
                        <>
                            <p>New Image:</p>
                            <img src={imagePreview} alt="New category preview" className="image-preview" />
                        </>
                    ) : currentImageUrl ? (
                        <>
                            <p>Current Image:</p>
                            <img src={`http://localhost:8080${currentImageUrl}`} alt="Current category" className="image-preview" />
                        </>
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                <div className="edit-category-actions">
                    <button type="button" className="cancel-button" onClick={() => navigate("/admin/categories")}>
                        Cancel
                    </button>
                    <button type="submit" className="save-button" disabled={saving}>
                        Save Changes
                    </button>
                </div>
            </form>

            {showConfirm && (
                <div className="confirmation-overlay">
                    <div className="confirmation-box">
                        <h2>Save Changes?</h2>
                        <p>Are you sure you want to save these changes?</p>
                        <div className="confirmation-actions">
                            <button type="button" className="confirmation-cancel" onClick={handleCancelConfirm} disabled={saving}>
                                Cancel
                            </button>
                            <button type="button" className="confirmation-save" onClick={handleConfirmSave} disabled={saving}>
                                {saving ? "Saving..." : "Yes, Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditCategory;