import HomeIntro from "../../features/home/HomeIntro/HomeIntro.jsx";
import Statistics from "../../features/home/Statistics/Statistics.jsx";
import Categories from "../../features/home/Categories/Categories.jsx";
import FeaturedCourses from "../../features/home/FeaturedCourses/FeaturedCourses.jsx";
import AdminHome from "../AdminHome/AdminHome.jsx";

function HomePage() {

    const role = sessionStorage.getItem("role");

    if (role === "ADMIN") {
        return <AdminHome />;
    }

    return (
        <>
            <HomeIntro />
            <Statistics />
            <Categories />
            <FeaturedCourses />
        </>
    );
}

export default HomePage;