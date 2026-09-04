import { useState } from "react";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import ScrollToTop from "./components/common/ScrollToTop";

import HomePage from "./pages/HomePage";
import ContactUs from "./pages/ContactUs";
import Courses from "./pages/Courses/Courses";
import Login from "./features/auth/Login/Login";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Register from "./features/auth/Register/Register";
import ProfilePage from "./pages/ProfilePage";

import CourseDetails from "./pages/Courses/CourseDetails/CourseDetails";
import AdminMessages from './features/Admin/AdminMessages/AdminMessages';
import AdminRoute from "./components/auth/AdminRoute";
import AdminCategories from "./features/Admin/AdminCategories/AdminCategories.jsx";
import EditCategory from "./features/Admin/EditCategory/EditCategory";
import CreateCategory from "./features/Admin/CreateCategory/ CreateCategory";
import CategoryCourses from "./features/Admin/CategoryCourses/CategoryCourses";
import CreateCourse from "./features/Admin/CreateCourse/CreateCourse";
import EditCourse from "./features/Admin/EditCourse/EditCourse";
import CourseBatches from "./features/Admin/BatchesManagement/CourseBatches/CourseBatches";
import CreateBatch from "./features/Admin/BatchesManagement/CreateBatch/CreateBatch";
import AdminEnrollmentRequests from "./features/Admin/AdminEnrollmentRequests"
import BatchLectures from './features/student/BatchLectures/pages/BatchLectures';
import AdminLecturesPage from './features/Admin/ManageLectures/pages/AdminLecturesPage';
import AdminInstructors from "./features/Admin/AdminInstructors/AdminInstructors";
function ProtectedRoute({ isLoggedIn, children }) {
    if (!isLoggedIn) {
        return <Navigate to="/auth/login" replace />;
    }
    return children;
}

function App() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = sessionStorage.getItem("token");
        return !!token;
    });

    const role = sessionStorage.getItem("role");
    const isAdmin = role === "ADMIN";

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        setIsLoggedIn(false);
        navigate("/auth/login");
    };

    return (
        <>
            <ScrollToTop />

            <Navbar
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
            />

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/contact" element={<ContactUs />} />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/auth/login"
                        element={<Login setIsLoggedIn={setIsLoggedIn} />}
                    />

                    <Route
                        path="/auth/register"
                        element={<Register setIsLoggedIn={setIsLoggedIn} />}
                    />

                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetails />} />

                    <Route
                        path="/admin/categories"
                        element={
                            <AdminRoute>
                                <AdminCategories />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories/:id/edit"
                        element={
                            <AdminRoute>
                                <EditCategory />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories/create"
                        element={
                            <AdminRoute>
                                <CreateCategory />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories/:categoryId/courses"
                        element={
                            <AdminRoute>
                                <CategoryCourses />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories/:categoryId/courses/create"
                        element={
                            <AdminRoute>
                                <CreateCourse />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/courses/edit/:id"
                        element={
                            <AdminRoute>
                                <EditCourse />
                            </AdminRoute>
                        }
                    />
                        <Route
                            path="/admin/courses/:courseId/batches"
                            element={
                                <AdminRoute>
                                    <CourseBatches />
                                </AdminRoute>
                            }
                          />
              
                    <Route
                        path="/admin/courses/:courseId/batches/create"
                        element={
                            <AdminRoute>
                                <CreateBatch />
                            </AdminRoute>
                        }
                    />

                    <Route path="/admin/enrollment-requests" element={<AdminEnrollmentRequests />} />

                    
                   <Route 
                          path="/student/batches/:batchId/lectures"
                          element={<BatchLectures />
                         } 
                    />


           

                    <Route
                                path="/admin/batches/:batchId/lectures"
                                element={
                                    <AdminRoute>
                                        <AdminLecturesPage />
                                    </AdminRoute>
                                }
                            />
                    <Route
                            path="/admin/instructors"
                            element={
                                <AdminRoute>
                                    <AdminInstructors />
                                </AdminRoute>
                            }
                        />
                    <Route
                        path="/courses/:id"
                        element={<CourseDetails />}
                    />
                    <Route path="/admin/messages" element={<AdminMessages />} />
                </Routes>
            </main>

            {!isAdmin && <Footer />}
        </>
    );
}

export default App;