import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface SphereIconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  floating?: boolean;
}

export const SphereIcon: React.FC<SphereIconProps> = ({
  icon: Icon,
  size = 'md',
  className = '',
  floating = true,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-18 h-18',
    xl: 'w-22 h-22',
  };

  const iconSizes = {
    sm: 18,
    md: 26,
    lg: 32,
    xl: 38,
  };

  return (
    <motion.div
      animate={
        floating
          ? {
              y: [0, -5, 0],
            }
          : {}
      }
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.1, rotate: 4 }}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex items-center justify-center rounded-full sphere-3d flex-shrink-0 cursor-pointer shadow-[0_8px_20px_rgba(0,229,255,0.25)] ${sizeClasses[size]} ${className}`}
    >
      <Icon size={iconSizes[size]} className="text-[#0f172a] drop-shadow-sm z-10" />

      {/* Pulsing Outer Glow Aura */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-[#00e5ff]/20 blur-sm pointer-events-none"
      />

      {/* Specular highlight dot */}
      <motion.span
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-1.5 left-2.5 w-2 h-2 rounded-full bg-white/95 blur-[0.5px] pointer-events-none z-20"
      />
    </motion.div>
  );
};
