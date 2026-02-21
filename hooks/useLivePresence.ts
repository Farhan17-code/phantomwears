import { useState, useEffect } from 'react';

export const useLivePresence = () => {
    const [liveCount, setLiveCount] = useState(0);

    useEffect(() => {
        // Mock live count between 10 and 50
        setLiveCount(Math.floor(Math.random() * 40) + 10);
        
        const interval = setInterval(() => {
            setLiveCount(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                return Math.max(1, prev + change);
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return { liveCount };
};