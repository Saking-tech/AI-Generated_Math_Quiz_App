'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface MagicBentoProps {
  children: React.ReactNode;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const MagicBento: React.FC<MagicBentoProps> = ({
  children,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = 300,
  particleCount = 12,
  glowColor = "132, 0, 255",
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number; life: number }>>([]);

  const generateParticles = useCallback(() => {
    if (!enableStars || !containerRef.current) return;
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * (containerRef.current?.offsetWidth || 0),
      y: Math.random() * (containerRef.current?.offsetHeight || 0),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: Math.random() * 100 + 50
    }));
    setParticles(newParticles);
  }, [enableStars, particleCount]);

  useEffect(() => {
    if (!enableStars || particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1
      })).filter(particle => particle.life > 0));
    }, 50);

    return () => clearInterval(interval);
  }, [enableStars, particles.length]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = (y - centerY) / centerY * 10;
      const tiltY = (centerX - x) / centerX * 10;
      setTilt({ x: tiltX, y: tiltY });
    }
  }, [enableTilt]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (enableStars) {
      generateParticles();
    }
  }, [enableStars, generateParticles]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback(() => {
    if (clickEffect) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    }
  }, [clickEffect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, handleClick]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: enableTilt ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
        transition: 'transform 0.1s ease-out',
        ...style
      }}
    >
      {enableSpotlight && isHovered && (
        <div
          className="absolute pointer-events-none opacity-30"
          style={{
            left: mousePosition.x - spotlightRadius / 2,
            top: mousePosition.y - spotlightRadius / 2,
            width: spotlightRadius,
            height: spotlightRadius,
            background: `radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, transparent 70%)`,
            borderRadius: '50%',
            zIndex: 1,
          }}
        />
      )}

      {enableBorderGlow && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, rgba(${glowColor}, 0.3), transparent, rgba(${glowColor}, 0.3))`,
            borderRadius: 'inherit',
            zIndex: 2,
          }}
        />
      )}

      {enableStars && particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.life / 100,
            zIndex: 3,
            boxShadow: `0 0 6px rgba(${glowColor}, 0.8)`,
          }}
        />
      ))}

      {clickEffect && isClicked && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(${glowColor}, 0.4) 0%, transparent 50%)`,
            zIndex: 4,
            animation: 'pulse 0.3s ease-out',
          }}
        />
      )}

      <div className="relative z-10">
        {children}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};

export default MagicBento;