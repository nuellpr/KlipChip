'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  speedY: number;
  speedX: number;
  color: string;
}

export function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const COLORS = ['#7C3AED', '#A78BFA', '#F43F5E', '#06b6d4', '#10b981'];

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 60;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 0.3 + 0.05,
        speedX: (Math.random() - 0.5) * 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    // 5 parallax blob layers (hue vary)
    const blobs = Array.from({ length: 5 }, (_, i) => ({
      x: (i * 0.25 + 0.1) * width,
      y: (i * 0.35 + 0.1) * height,
      r: 90 + i * 40,
      hue: 260 - i * 40, // purple -> pink -> cyan-ish
      speed: 0.05 + i * 0.03,
    }));

    let frameId: number;
    let t = 0;

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = (e.clientY - rect.top) / rect.height;
    };

    window.addEventListener('mousemove', handleMouse);

    const resizeObserver = new ResizeObserver(() => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });
    resizeObserver.observe(canvas);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.008;

      // Draw parallax blobs
      blobs.forEach((b, i) => {
        const px = b.x + Math.sin(t + i) * 30 + (mouse.current.x - 0.5) * (i + 1) * 30;
        const py = b.y + Math.cos(t * 0.7 + i) * 20 + (mouse.current.y - 0.5) * (i + 1) * 15;
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, b.r);
        gradient.addColorStop(0, `hsla(${b.hue}, 80%, 55%, 0.28)`);
        gradient.addColorStop(0.7, `hsla(${b.hue}, 80%, 45%, 0.08)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw particles
      particles.forEach((p) => {
        const parallax = (p.z - 0.5) * 40;
        const x = p.x + parallax * (mouse.current.x - 0.5);
        const y = p.y + parallax * (mouse.current.y - 0.5);
        ctx.globalAlpha = 0.5 + p.z * 0.5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.size * (0.5 + p.z), 0, Math.PI * 2);
        ctx.fill();

        if (!prefersReducedMotion) {
          p.y -= p.speedY;
          p.x += p.speedX;
          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }
      });

      // Glow outline around mouse area
      const gx = mouse.current.x * width;
      const gy = mouse.current.y * height;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 180);
      g.addColorStop(0, 'rgba(244, 63, 94, 0.18)');
      g.addColorStop(0.5, 'rgba(124, 58, 237, 0.08)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouse);
      resizeObserver.disconnect();
    };
  }, [isMounted]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      aria-hidden="true"
    />
  );
}
