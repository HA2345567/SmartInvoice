'use client';

import React, { useEffect, useRef } from 'react';

// Configuration for behavior
const CONFIG = {
    TRAIL_COUNT: 2,
    SPLASH_COUNT: 12,
    COLORS: ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899'], // Modern blue/purple/pink gradient
    PARTICLE_LIFE_DECAY: 0.03,
    PARTICLE_SIZE_DECAY: 0.96,
    SPEED_RANGE: 3
};

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    life: number;
}

const SplashCursor: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // Set canvas size (handling DPI)
        const setSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        setSize();

        const particles: Particle[] = [];

        // Create particles
        const createParticles = (x: number, y: number, count: number) => {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * CONFIG.SPEED_RANGE;

                particles.push({
                    x,
                    y,
                    size: Math.random() * 4 + 2,
                    speedX: Math.cos(angle) * velocity,
                    speedY: Math.sin(angle) * velocity,
                    color: CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)],
                    life: 1.0
                });
            }
        };

        // Event handlers
        const handleMouseMove = (e: MouseEvent) => {
            createParticles(e.clientX, e.clientY, CONFIG.TRAIL_COUNT);
        };

        const handleMouseDown = (e: MouseEvent) => {
            createParticles(e.clientX, e.clientY, CONFIG.SPLASH_COUNT);
        };

        window.addEventListener('resize', setSize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);

        // Animation loop
        let animationFrameId: number;
        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Update physics
                p.x += p.speedX;
                p.y += p.speedY;
                p.life -= CONFIG.PARTICLE_LIFE_DECAY;
                p.size *= CONFIG.PARTICLE_SIZE_DECAY;

                // Draw
                if (p.life > 0 && p.size > 0.5) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life;
                    ctx.fill();
                } else {
                    // Remove dead particles
                    particles.splice(i, 1);
                    i--;
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setSize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
};

export default SplashCursor;
