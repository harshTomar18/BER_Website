import React, { useRef, useEffect, useState } from 'react';
import './Ber3DArtwork.css';

/**
 * Ber3DArtwork - Realistic 3D Neo-Glass Tech Orbit Centerpiece
 * Matches the reference design with interactive mouse-based parallax tilt,
 * floating glass elements, ambient caustic blue glow, and subtle depth layers.
 */
export default function Ber3DArtwork() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse-driven 3D parallax tilt with inertia
  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let rafId = null;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Subtle, elegant tilt angles (max ~8 degrees)
      targetRotateX = -y * 10;
      targetRotateY = x * 12;
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      targetRotateX = 0;
      targetRotateY = 0;
    };

    const animate = () => {
      // Smooth lerp (linear interpolation)
      currentRotateX += (targetRotateX - currentRotateX) * 0.08;
      currentRotateY += (targetRotateY - currentRotateY) * 0.08;

      card.style.transform = `perspective(1200px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;
      rafId = requestAnimationFrame(animate);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className="neo-artwork-wrap">
      {/* Radiant ambient background aura */}
      <div className="neo-artwork-glow"></div>
      <div className="neo-artwork-glow-ambient"></div>

      {/* 3D Parallax Container */}
      <div ref={cardRef} className="neo-artwork-stage">
        {/* Floating Glass Cube Accents */}
        <div className="neo-cube neo-cube--1" title="Cloud Node"></div>
        <div className="neo-cube neo-cube--2" title="Data Block"></div>
        <div className="neo-cube neo-cube--3" title="Security Token"></div>
        <div className="neo-cube neo-cube--4" title="AI Core"></div>


        {/* Main 3D Artwork Render (Transparent Neo-Glass Orbit) */}
        <div className="neo-artwork-render-box">
          <img
            src="/images/BER Services Neo-Glass Tech Orbit.webp"
            alt="BER Services Neo-Glass Tech Orbit 3D Centerpiece"
            className="neo-artwork-img"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = '/images/BER Services Neo-Glass Tech Orbit.jpeg';
            }}
          />
        </div>


      </div>
    </div>
  );
}
