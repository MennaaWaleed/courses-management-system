import { useEffect, useState } from "react";

function Counter({ end, duration = 1500, suffix = "" }) {

    const [count, setCount] = useState(0);

    useEffect(() => {

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

    }, [end, duration]);

    return (
        <h3>
            {count}
            {suffix}
        </h3>
    );
}

export default Counter;