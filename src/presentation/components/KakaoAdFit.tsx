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

        // Dev Mode Check: Prevent AdFit script from running on localhost to avoid 429/CORS errors
        // Dev Mode Check: Prevent AdFit script from running on localhost or 127.0.0.1 to avoid 429/CORS errors
        const isLocalhost = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' || 
                            window.location.hostname.includes('192.168.') ||
                            window.location.port !== '';

        if (isLocalhost) {
            containerRef.current.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;background:rgba(255,255,255,0.05);color:#888;font-size:11px;border-radius:8px;"><span>AdFit Placeholder</span><span>(${width}x${height})</span></div>`;
            return;
        }

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

        // Debug log to confirm attempt to load
        console.log(`[KakaoAdFit] Initializing ad unit: ${unitId} (${width}x${height})`);

        // Clean up previous children immediately before appending
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        containerRef.current.appendChild(ins);
        containerRef.current.appendChild(script);

        return () => {
            // Cleanup: remove the script and ins tag on unmount
            // This prevents duplicate scripts execution and DOM clutter
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [unitId, width, height, disabled]);

    if (disabled) return null;

    return <div ref={containerRef} className={`kakao-adfit-container flex justify-center ${className}`} style={{ width: `${width}px`, height: `${height}px` }} />;
};

export default KakaoAdFit;
