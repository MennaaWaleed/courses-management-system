import HomeIntro from "../features/home/HomeIntro/HomeIntro";
import Statistics from "../features/home/Statistics/Statistics";
import Categories from "../features/home/Categories/Categories";

function HomePage() {
    return (
        <>
            <HomeIntro />
            <Statistics />
            <Categories />
        </>
    );
}

export default HomePage;