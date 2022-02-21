import { useState, useEffect } from 'react';

// Custom hook to determine if our browser size fits the specs of a mobile browser
const MOBILE_WIDTH = 500;
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

// Code to handle moving up of input form when iOS Safari keyboard is out
// This code is hacky and I don't like it
// In a real environment, however, there would be several key differences
//  1. A chat application would not be written as a web-app for mobile (it would either be written natively or with React Native)
//  2. If, for some godforsaken reason we were making a mobile chat webapp, I would add a lot more handling for other browsers/devices etc.
export const useMobileSafariKeyboard = (inputRef, formRef) => {
    const isMobile = useIsMobile();

    useEffect(() => {
        if (isMobile) {
            const onFocus = (e) => {
                e.preventDefault();
                e.stopPropagation();
                setTimeout(() => window.scrollTo({top: 0, left: 0, behavior: 'smooth'}), 150);
                formRef.current.classList.add('mobile-keyboard');
                document.getElementById('messages-wrapper').style.height = "35%";
            }
        
            const onBlur = () => {
                document.getElementById('messages-wrapper').removeAttribute('style');
                formRef.current.classList.remove('mobile-keyboard');
            }
        
            inputRef.current.addEventListener('focus', onFocus);
            inputRef.current.addEventListener('blur', onBlur);
                
                
            return () => {
                inputRef.current.removeEventListener('focus', onFocus);
                inputRef.current.removeEventListener('blur', onBlur);
            }
        }
    }, [])
    
}