import { useEffect, useState } from "react";

function Counter({
    end,
    duration = 1500,
    suffix = "",
    start = false,
}) {

    const [count, setCount] = useState(0);

    useEffect(() => {

        if (!start) return;

        let current = 0;

        const increment = end / (duration / 16);

        const timer = setInterval(() => {

            current += increment;

            if (current >= end) {
                current = end;
                clearInterval(timer);
            }

            setCount(Math.floor(current));

        }, 16);

        return () => clearInterval(timer);

    }, [start, end, duration]);

    return (
        <h3>
            {count}
            {suffix}
        </h3>
    );
}

export default Counter;