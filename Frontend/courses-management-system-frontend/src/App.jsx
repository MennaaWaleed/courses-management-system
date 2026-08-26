import { useState } from "react";
import Navbar from "./components/layout/Navbar/Navbar";

import Footer from "./components/layout/Footer/Footer";
import ScrollToTop from "./components/common/ScrollToTop";

import HomePage from "./pages/HomePage";
import ContactUs from "./pages/ContactUs";
import Courses from "./pages/Courses/Courses";
import Login from "./features/auth/Login/Login";
import { Routes, Route } from "react-router-dom";
import Register from "./features/auth/Register/Register";

import CourseDetails from "./pages/Courses/CourseDetails/CourseDetails";


import AdminRoute from "./components/auth/AdminRoute";
import AdminCategories from "./features/Admin/AdminCategories/AdminCategories.jsx";
import EditCategory from "./features/Admin/EditCategory/EditCategory";
import CreateCategory from "./features/Admin/CreateCategory/ CreateCategory";
import CategoryCourses from "./features/Admin/CategoryCourses/CategoryCourses";
import CreateCourse from "./features/Admin/CreateCourse/CreateCourse";
import EditCourse from "./features/Admin/EditCourse/EditCourse";
import BatchLectures from './features/student/BatchLectures/pages/BatchLectures';

function App() {

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


                    <Route
                        path="/"
                        element={<HomePage />}
                    />

                    <Route
                        path="/contact"
                        element={<ContactUs />}
                    />

                    <Route
                        path="/auth/login"
                        element={
                            <Login
                                setIsLoggedIn={setIsLoggedIn}
                            />
                        }
                    />

                    <Route
                        path="/auth/register"
                        element={
                            <Register
                                setIsLoggedIn={setIsLoggedIn}
                            />
                        }
                    />

                    <Route
                        path="/courses"
                        element={<Courses />}
                    />

                    <Route
                        path="/courses/:id"
                        element={<CourseDetails />}
                    />



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
                          path="/student/batches/:batchId/lectures"
                          element={<BatchLectures />
                         } 
                    />
                </Routes>

            </main>

            {!isAdmin && <Footer />}

        </>
    );
}

export default App;