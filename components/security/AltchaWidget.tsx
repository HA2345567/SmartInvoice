'use client';

import { useEffect, useRef } from 'react';

interface AltchaWidgetProps {
  onStateChange?: (state: string) => void;
}

export function AltchaWidget({ onStateChange }: AltchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the ALTCHA widget element
    const widget = document.createElement('altcha-widget');
    widget.setAttribute('challengeurl', '/api/altcha-challenge');
    widget.setAttribute('name', 'altcha');
    widget.setAttribute('hidelogo', 'true');
    widget.setAttribute('hideload', 'true');
    widget.setAttribute('workers', '1');

    // Apply custom styling
    widget.style.setProperty('--altcha-border', 'none');
    widget.style.setProperty('--altcha-color-background', 'transparent');
    widget.style.setProperty('--altcha-padding', '0');

    containerRef.current.appendChild(widget);

    if (onStateChange) {
      widget.addEventListener('statechange', (e: any) => {
        onStateChange(e.detail?.state || '');
      });
    }

    return () => {
      if (containerRef.current && widget.parentNode === containerRef.current) {
        containerRef.current.removeChild(widget);
      }
    };
  }, [onStateChange]);

  return (
    <div ref={containerRef} className="w-full" />
  );
}

export default AltchaWidget;
