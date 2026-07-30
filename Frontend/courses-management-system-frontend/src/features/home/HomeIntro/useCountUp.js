import { useEffect, useRef, useState } from "react";

export default function useCountUp(end, duration = 1500) {

    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    const ref = useRef(null);

    useEffect(() => {

        const observer = new IntersectionObserver(
            ([entry]) => {

                if (entry.isIntersecting) {
                    setStarted(true);
                    observer.disconnect();
                }

            },
            {
                threshold: 0.4,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();

    }, []);

    useEffect(() => {

        if (!started) return;

        let start = 0;

        const increment = end / (duration / 16);

        const timer = setInterval(() => {

            start += increment;

            if (start >= end) {
                start = end;
                clearInterval(timer);
            }

            setCount(Math.floor(start));

        }, 16);

        return () => clearInterval(timer);

    }, [started, end, duration]);

    return { ref, count };
}