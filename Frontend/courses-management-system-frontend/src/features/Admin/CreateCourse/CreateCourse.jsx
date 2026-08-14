import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../../../api/categoryApi";
import { createCourse } from "../../../api/courseApi";
import "./CreateCourse.css";

function CreateCourse() {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        courseName: "",
        description: "",
        shortDescription: "",
        courseHours: "",
        lectureCount: "",
        price: "",
    });

    const [successMessage, setSuccessMessage] = useState("");

    const [selectedCategories, setSelectedCategories] = useState([categoryId]);
    const [contentFile, setContentFile] = useState(null);
    const [courseImage, setCourseImage] = useState(null);
    const [iconImage, setIconImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Error loading categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (categoryIdClicked) => {
        if (categoryIdClicked === categoryId) {
            return;
        }
        setSelectedCategories((prev) => {
            if (prev.includes(categoryIdClicked)) {
                return prev.filter((id) => id !== categoryIdClicked);
            } else {
                return [...prev, categoryIdClicked];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const finalCategoryIds = [
                ...new Set([categoryId, ...selectedCategories])
            ];

            const data = {
                ...formData,
                courseHours: Number(formData.courseHours),
                lectureCount: Number(formData.lectureCount),
                price: Number(formData.price),
                categoryIds: finalCategoryIds,
                contentFile: contentFile,
                courseImage: courseImage,
                iconImage: iconImage
            };

            await createCourse(data);

            setSuccessMessage("Course created successfully!");
            // navigate(`/admin/categories/${categoryId}/courses`);
        } catch (error) {
            console.error("Error creating course:", error);

            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Response data:", error.response.data);
                console.error("Response headers:", error.response.headers);

                alert(
                    `Failed to create course.\n\n` +
                    `Status: ${error.response.status}\n` +
                    `Error: ${JSON.stringify(error.response.data)}`
                );
            } else if (error.request) {
                console.error("No response received:", error.request);

                alert("No response received from the backend.");
            } else {
                console.error("Request error:", error.message);

                alert(`Request error: ${error.message}`);
            }
        }
    };

    if (loading) {
        return <div className="create-course-loading">Loading...</div>;
    }

    return (
        <div className="create-course">
            {successMessage && (
                <div className="success-overlay">
                    <div className="success-box">

                        <div className="success-icon">
                            ✓
                        </div>

                        <h2>Success!</h2>

                        <p>{successMessage}</p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/admin/categories/${categoryId}/courses`
                                )
                            }
                        >
                            OK
                        </button>

                    </div>
                </div>
            )}

            <div className="create-course-header">
                <h1>Create New Course</h1>
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate(`/admin/categories/${categoryId}/courses`)}
                >
                    ← Back to Courses
                </button>
            </div>

            <form className="create-course-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Course Name</label>
                    <input
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Short Description</label>
                    <textarea
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="course-form-row">
                    <div className="form-group">
                        <label>Course Hours</label>
                        <input
                            type="number"
                            step="0.1"
                            name="courseHours"
                            value={formData.courseHours}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Lecture Count</label>
                        <input
                            type="number"
                            name="lectureCount"
                            value={formData.lectureCount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Course Content (PDF)</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setContentFile(e.target.files[0])}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Course Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCourseImage(e.target.files[0])}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        Course Icon <span className="optional">(Optional)</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIconImage(e.target.files[0])}
                    />
                </div>

                <div className="form-group">

                    <label>Categories</label>

                    <div className="categories-checkbox-list">

                        {categories.map((category) => {

                            const isSelected =
                                selectedCategories.includes(category.id);

                            const isOriginalCategory =
                                category.id === categoryId;

                            return (
                                <label
                                    key={category.id}
                                    className={`category-checkbox ${
                                        isOriginalCategory
                                            ? "required-category"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        disabled={isOriginalCategory}
                                        onChange={() =>
                                            handleCategoryChange(
                                                category.id
                                            )
                                        }
                                    />

                                    <span>
                        {category.categoryName}
                    </span>

                                    {isOriginalCategory && (
                                        <small>
                                            Required
                                        </small>
                                    )}

                                </label>
                            );
                        })}

                    </div>

                </div>

                <div className="create-course-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate(`/admin/categories/${categoryId}/courses`)}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="save-button">
                        Create Course
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateCourse;