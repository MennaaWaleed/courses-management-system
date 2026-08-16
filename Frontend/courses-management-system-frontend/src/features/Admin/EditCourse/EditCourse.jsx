import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getCourseById,
    updateCourse
} from "../../../api/courseApi";

import { getCategories } from "../../../api/categoryApi";

import "./EditCourse.css";

function EditCourse() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [courseName, setCourseName] = useState("");
    const [description, setDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [courseHours, setCourseHours] = useState("");
    const [lectureCount, setLectureCount] = useState("");
    const [price, setPrice] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [published, setPublished] = useState(false);
    const [featured, setFeatured] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [contentUrl, setContentUrl] = useState("");
    const [courseImage, setCourseImage] = useState(null);
    const [iconImage, setIconImage] = useState(null);
    const [contentFile, setContentFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);
                setError("");

                const courseResponse =
                    await getCourseById(id);

                const categoriesResponse =
                    await getCategories();

                const course =
                    courseResponse.data;

                const categoriesData =
                    categoriesResponse.data;


                setCourseName(
                    course.courseName || ""
                );

                setDescription(
                    course.description || ""
                );

                setShortDescription(
                    course.shortDescription || ""
                );

                setCourseHours(
                    course.courseHours ?? ""
                );

                setLectureCount(
                    course.lectureCount ?? ""
                );

                setPrice(
                    course.price ?? ""
                );


                setCategories(
                    categoriesData || []
                );

                setCategoryIds(
                    course.categoryIds || []
                );


                setPublished(
                    course.published || false
                );

                setFeatured(
                    course.featured || false
                );


                setImageUrl(
                    course.imageUrl || ""
                );

                setIconUrl(
                    course.iconUrl || ""
                );

                setContentUrl(
                    course.content_url || ""
                );

            } catch (error) {

                console.error(
                    "Error loading course:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load course."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchData();

    }, [id]);


    const handleCategoryChange = (categoryId) => {

        setCategoryIds((previousIds) => {

            if (previousIds.includes(categoryId)) {

                return previousIds.filter(
                    (id) => id !== categoryId
                );

            }

            return [
                ...previousIds,
                categoryId
            ];

        });


        setError("");
    };


    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            setCourseImage(file);
        }
    };

    const handleIconChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            setIconImage(file);
        }
    };


    const handleContentChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            setContentFile(file);
        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (categoryIds.length === 0) {

            setSuccessMessage("");

            setError(
                "At least one category is required."
            );

            return;
        }

        setSaving(true);

        setError("");
        setSuccessMessage("");


        try {

            const courseData = {

                courseName,
                description,
                shortDescription,

                courseHours,
                lectureCount,
                price,

                categoryIds,

                published,
                featured,

                courseImage,
                iconImage,
                contentFile
            };



            await updateCourse(
                id,
                courseData
            );

            setError("");
            setShowSuccessModal(true);


            setError("");

            setSuccessMessage(
                "Course updated successfully!"
            );


        } catch (error) {

            console.error(
                "Error updating course:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );


            setSuccessMessage("");

            setError(
                error.response?.data?.message ||
                "Failed to update course."
            );

        } finally {

            setSaving(false);

        }
    };



    if (loading) {

        return (
            <div className="edit-course">

                <h2>
                    Loading course...
                </h2>

            </div>
        );
    }



    return (

        <div className="edit-course">

            <h1>
                Edit Course
            </h1>



            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}



            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}



            <form onSubmit={handleSubmit}>



                <div className="form-group">

                    <label>
                        Course Name
                    </label>

                    <input
                        type="text"
                        value={courseName}
                        onChange={(e) =>
                            setCourseName(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>



                <div className="form-group">

                    <label>
                        Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>



                <div className="form-group">

                    <label>
                        Short Description
                    </label>

                    <input
                        type="text"
                        value={shortDescription}
                        onChange={(e) =>
                            setShortDescription(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>



                <div className="form-group">

                    <label>
                        Course Hours
                    </label>

                    <input
                        type="number"
                        step="0.1"
                        value={courseHours}
                        onChange={(e) =>
                            setCourseHours(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>



                <div className="form-group">

                    <label>
                        Lecture Count
                    </label>

                    <input
                        type="number"
                        value={lectureCount}
                        onChange={(e) =>
                            setLectureCount(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>



                <div className="form-group">

                    <label>
                        Price
                    </label>

                    <input
                        type="number"
                        value={price}
                        onChange={(e) =>
                            setPrice(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>


                <div className="form-group">

                    <label>
                        Categories
                    </label>

                    <div className="categories-checkbox-list">

                        {categories.length === 0 ? (

                            <p>
                                No categories available.
                            </p>

                        ) : (

                            categories.map((category) => (

                                <label
                                    key={category.id}
                                    className="category-checkbox"
                                >

                                    <input
                                        type="checkbox"
                                        value={category.id}
                                        checked={categoryIds.includes(
                                            category.id
                                        )}
                                        onChange={() =>
                                            handleCategoryChange(
                                                category.id
                                            )
                                        }
                                    />

                                    <span>
                                        {category.categoryName}
                                    </span>

                                </label>

                            ))

                        )}

                    </div>

                </div>




                <div className="form-group">

                    <label>
                        Course Image
                    </label>


                    {imageUrl && (

                        <div>

                            <p>
                                Current Image:
                            </p>

                            <img
                                src={`http://localhost:8080${imageUrl}`}
                                alt="Current course"
                                className="current-image"
                            />

                        </div>

                    )}


                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />


                    {courseImage && (

                        <p>
                            New image:{" "}
                            {courseImage.name}
                        </p>

                    )}

                </div>



                <div className="form-group">

                    <label>
                        Course Icon
                    </label>


                    {iconUrl && (

                        <div>

                            <p>
                                Current Icon:
                            </p>

                            <img
                                src={`http://localhost:8080${iconUrl}`}
                                alt="Current icon"
                                className="current-icon"
                            />

                        </div>

                    )}


                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                    />


                    {iconImage && (

                        <p>
                            New icon:{" "}
                            {iconImage.name}
                        </p>

                    )}

                </div>



                <div className="form-group">

                    <label>
                        Course Content PDF
                    </label>


                    {contentUrl && (

                        <p>
                            Current PDF:{" "}
                            {contentUrl
                                .split("/")
                                .pop()}
                        </p>

                    )}


                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleContentChange}
                    />


                    {contentFile && (

                        <p>
                            New PDF:{" "}
                            {contentFile.name}
                        </p>

                    )}

                </div>



                <div className="form-group">

                    <label className="checkbox-label">

                        <input
                            type="checkbox"
                            checked={published}
                            onChange={(e) =>
                                setPublished(
                                    e.target.checked
                                )
                            }
                        />

                        <span>
                            Published
                        </span>

                    </label>

                </div>



                <div className="form-group">

                    <label className="checkbox-label">

                        <input
                            type="checkbox"
                            checked={featured}
                            onChange={(e) =>
                                setFeatured(
                                    e.target.checked
                                )
                            }
                        />

                        <span>
                            Featured
                        </span>

                    </label>

                </div>



                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="save-course-button"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save Changes"}

                    </button>

                </div>


            </form>

            {showSuccessModal && (
                <div className="success-modal-overlay">

                    <div className="success-modal">

                        <div className="success-icon">
                            ✓
                        </div>

                        <h2>Success!</h2>

                        <p>
                            Course updated successfully!
                        </p>

                        <button
                            className="success-ok-button"
                            onClick={() => navigate(-1)}
                        >
                            OK
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default EditCourse;