'use client';

import React, { useRef, useEffect, useState } from 'react';

interface GlareHoverProps {
  children: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  glareColor = '#77ff00',
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 300,
  transitionDuration = 800,
  playOnce = false,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const glare = glareRef.current;

    if (!container || !glare) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (playOnce && hasPlayed) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = x - centerX;
      const deltaY = y - centerY;

      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

      const normalizedDistance = Math.min(distance / maxDistance, 1);
      const glareIntensity = 1 - normalizedDistance;

      const glareX = x - glareSize / 2;
      const glareY = y - glareSize / 2;

      glare.style.left = `${glareX}px`;
      glare.style.top = `${glareY}px`;
      glare.style.opacity = `${glareIntensity * glareOpacity}`;
      glare.style.transform = `rotate(${angle + glareAngle}deg)`;

      if (!isHovered) {
        setIsHovered(true);
        if (playOnce) {
          setHasPlayed(true);
        }
      }
    };

    const handleMouseLeave = () => {
      if (playOnce && hasPlayed) return;
      
      setIsHovered(false);
      glare.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (playOnce && hasPlayed) return;
      
      setIsHovered(true);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [glareColor, glareOpacity, glareAngle, glareSize, playOnce, hasPlayed, isHovered]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        position: 'relative',
        ...style
      }}
    >
      {children}
      <div
        ref={glareRef}
        className="absolute pointer-events-none"
        style={{
          width: `${glareSize}px`,
          height: `${glareSize}px`,
          background: `linear-gradient(${glareAngle}deg, transparent 0%, ${glareColor} 50%, transparent 100%)`,
          opacity: 0,
          transition: `opacity ${transitionDuration}ms ease-out`,
          zIndex: 10,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};

export default GlareHover;