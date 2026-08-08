import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  glow?: boolean;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
  glow = false,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rY = ((x - centerX) / centerX) * 6;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={
        hoverEffect
          ? {
              scale: 1.02,
              boxShadow: '0 20px 35px -10px rgba(0, 229, 255, 0.15), 0 10px 20px -5px rgba(15, 23, 42, 0.08)',
            }
          : {}
      }
      whileTap={onClick ? { scale: 0.98 } : {}}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className={`glass-card rounded-[12px] p-6 relative overflow-hidden bg-white border border-[#e2e8f0] transition-colors duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {glow && (
        <motion.div
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#00e5ff]/20 blur-2xl pointer-events-none"
        />
      )}
      <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
        {children}
      </div>
    </motion.div>
  );
};
