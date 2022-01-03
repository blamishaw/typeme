import { useState, useEffect } from 'react';

// Custom hook to determine if our browser size fits the specs of a mobile browser
const MOBILE_WIDTH = 450;
const MOBILE_HEIGHT = 950;

export const useIsMobile = () => {
    const [browserSize, setBrowserSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResizeEvent = () => {
            setBrowserSize({ width: window.innerWidth, height: window.innerHeight });
        }

        window.addEventListener('resize', handleResizeEvent)
        return () => window.removeEventListener('resize', handleResizeEvent);
    }, [])

    return (browserSize.width < MOBILE_WIDTH && browserSize.height < MOBILE_HEIGHT);
}