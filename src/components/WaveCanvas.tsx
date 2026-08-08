import React, { useEffect, useRef } from 'react';

interface WaveCanvasProps {
  height?: string;
  className?: string;
  speedMultiplier?: number;
  interactive?: boolean;
}

export const WaveCanvas: React.FC<WaveCanvasProps> = ({
  height = '100%',
  className = '',
  speedMultiplier = 1,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 400;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Wave parameters
    const lines = [
      { amplitude: 22, wavelength: 0.008, speed: 0.015, opacity: 0.25, strokeWidth: 1.8, color: '#00e5ff', yOffset: 0.4 },
      { amplitude: 35, wavelength: 0.005, speed: 0.011, opacity: 0.20, strokeWidth: 2.2, color: '#00b3cc', yOffset: 0.5 },
      { amplitude: 18, wavelength: 0.012, speed: 0.022, opacity: 0.18, strokeWidth: 1.5, color: '#00e5ff', yOffset: 0.6 },
      { amplitude: 28, wavelength: 0.006, speed: 0.008, opacity: 0.12, strokeWidth: 1.2, color: '#00e5ff', yOffset: 0.45 },
    ];

    // Floating cyan particles
    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 400),
      radius: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const heightVal = canvas.height;

      // Render floating cyan particles
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = heightVal;
          if (p.y > heightVal) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 225, 255, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00e5ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render Sine-Wave Mesh Lines
      lines.forEach((line) => {
        ctx.beginPath();
        const baseOffset = heightVal * line.yOffset;

        for (let x = 0; x <= width; x += 3) {
          // Subtle mouse attraction / ripple effect
          const distToMouse = Math.hypot(x - mouseX, baseOffset - mouseY);
          const mouseFactor = interactive && distToMouse < 200 ? (1 - distToMouse / 200) * 15 : 0;

          const sine1 = Math.sin(x * line.wavelength + step * line.speed * speedMultiplier);
          const sine2 = Math.cos(x * line.wavelength * 0.5 + step * line.speed * 0.7 * speedMultiplier);

          const y = baseOffset + (sine1 + sine2) * line.amplitude + mouseFactor;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.opacity;
        ctx.lineWidth = line.strokeWidth;
        ctx.stroke();
      });

      ctx.globalAlpha = 1.0;

      if (!prefersReducedMotion) {
        step += 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [speedMultiplier, interactive]);

  return (
    <div className={`relative w-full overflow-hidden pointer-events-none ${className}`} style={{ height }}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
