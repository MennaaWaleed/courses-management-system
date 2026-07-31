import "./Statistics.css";

import Counter from "../HomeIntro/Counter";
import { useEffect, useState ,useRef } from "react";
import {
    GraduationCap,
    BookOpen,
    Trophy,
    BadgeCheck,
} from "lucide-react";

const statistics = [
    {
        icon: GraduationCap,
        value: 30,
        suffix: "K+",
        title: "Students Trained",
    },
    {
        icon: BookOpen,
        value: 1100,
        suffix: "+",
        title: "Training Batches Delivered",
    },
    {
        icon: Trophy,
        value: new Date().getFullYear() - 2010,
        suffix: "+",
        title: "Years of Excellence",
    },
    {
        icon: BadgeCheck,
        value: null,
        title: "Official Autodesk",
        subtitle: "Authorized Training Center",
    },
];

function Statistics() {

const [visible, setVisible] = useState(false);

const sectionRef = useRef(null);

useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                observer.unobserve(entry.target);
            }
        },
        {
            threshold: 0.25,
        }
    );

    if (sectionRef.current) {
        observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
}, []);


    return (
        <section ref={sectionRef} className={`statistics ${visible ? "show" : ""}`}>

            <div className="statistics__container">

                <div className="statistics__header">

                    <span className="statistics__badge">
                        Our Impact
                    </span>

                    <h2>
                        Trusted by Thousands of Future Engineers
                    </h2>

                    <p>
                        More than a decade of excellence in engineering training,
                        helping students and professionals build successful careers.
                    </p>

                </div>

                <div className="statistics__grid">

                    {statistics.map((item, index) => {

                        const Icon = item.icon;

                        return (

                         <div
                            className={`statistics__card ${
                                item.value === null ? "statistics__card--autodesk" : ""
                            }`}
                            key={index}
                        >

                                <div className="statistics__icon">
                                    <Icon size={30} />
                                </div>

                                {item.value !== null ? (
                                    <>
                                        <Counter
                                            end={item.value}
                                            suffix={item.suffix}
                                             start={visible}
                                        />

                                        <p>{item.title}</p>
                                    </>
                                ) : (
                                    <>
                                         <span className="statistics__official">
                                            OFFICIAL
                                        </span>

                                        <h3>{item.title}</h3>

                                        <p>{item.subtitle}</p>
                                    </>
                                )}

                            </div>

                        );
                    })}

                </div>

            </div>

        </section>
    );
}

export default Statistics;