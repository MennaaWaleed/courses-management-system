import HomeIntro from "../features/home/HomeIntro/HomeIntro";
import Statistics from "../features/home/Statistics/Statistics";
import Categories from "../features/home/Categories/Categories";
import FeaturedCourses from "../features/home/FeaturedCourses/FeaturedCourses";

function HomePage() {
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