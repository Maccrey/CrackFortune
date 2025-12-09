import React, { useEffect, useRef } from 'react';

interface KakaoAdFitProps {
    unitId: string;
    width: string;
    height: string;
    disabled?: boolean;
    className?: string;
}

const KakaoAdFit: React.FC<KakaoAdFitProps> = ({ unitId, width, height, disabled = false, className = '' }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled) return;
        if (!containerRef.current) return;

        // Clear previous content to prevent duplicating ads if re-rendered
        // containerRef.current.innerHTML = ''; 
        // Actually, clearing innerHTML removes the <ins> tag we need.
        // We should reconstruct the structure.
        
        const ins = document.createElement('ins');
        ins.className = 'kakao_ad_area';
        ins.style.display = 'none';
        ins.setAttribute('data-ad-unit', unitId);
        ins.setAttribute('data-ad-width', width);
        ins.setAttribute('data-ad-height', height);

        const script = document.createElement('script');
        script.async = true;
        script.type = 'text/javascript';
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

        // Clean up previous children
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        containerRef.current.appendChild(ins);
        containerRef.current.appendChild(script);

        return () => {
            // Cleanup (?) - Usually not strictly necessary for script tags but good for the ins tag container
            if (containerRef.current) {
                // containerRef.current.innerHTML = '';
            }
        };
    }, [unitId, width, height, disabled]);

    if (disabled) return null;

    return <div ref={containerRef} className={`kakao-adfit-container flex justify-center ${className}`} style={{ width: `${width}px`, height: `${height}px` }} />;
};

export default KakaoAdFit;
