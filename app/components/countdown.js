import React, { useState, useEffect } from 'react';

const Countdown = ({ onComplete }) => {
    const [counter, setCounter] = useState(3);

    useEffect(() => {
        if (counter === 0) {
            onComplete();
            return
        }

        const timer = setTimeout(() => {
            setCounter(counter - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [counter, onComplete]);

    return (
        <div className="countdown-overlay">
            <div className="countdown">
                {counter}
            </div>
        </div>
    );
};

export default Countdown;