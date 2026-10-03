import React from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface HomePreloaderProps {
  progress: number;
  isExiting: boolean;
}

const easeOutCurve = [0.22, 1, 0.36, 1] as const;

export const HomePreloader: React.FC<HomePreloaderProps> = ({ progress, isExiting }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const logoSrc = '/logo.png';

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.45, ease: easeOutCurve }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#061018] text-white overflow-hidden"
    >
      <span className="sr-only">Loading Digital Waves...</span>

      <div className="relative flex flex-col items-center justify-center gap-6 px-6">
        <div className="relative perspective-[1200px]">
          <motion.div
            animate={
              prefersReducedMotion || isExiting
                ? { rotateY: 0, scale: isExiting ? 0.94 : 1 }
                : {
                    rotateY: 360,
                    scale: [1, 1.04, 1],
                  }
            }
            transition={
              prefersReducedMotion || isExiting
                ? { duration: 0.45, ease: easeOutCurve }
                : {
                    rotateY: { duration: 2.55, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            className="relative flex items-center justify-center will-change-transform"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.div
              animate={
                prefersReducedMotion || isExiting
                  ? { opacity: 0.22, scaleX: 0.92 }
                  : { opacity: [0.2, 0.35, 0.2], scaleX: [0.92, 1, 0.92] }
              }
              transition={
                prefersReducedMotion || isExiting
                  ? { duration: 0.45, ease: easeOutCurve }
                  : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
              }
              className="absolute -bottom-4 left-1/2 h-5 w-32 -translate-x-1/2 rounded-full bg-[#00e5ff]/25 blur-lg"
            />

            <img
              src={logoSrc}
              alt=""
              aria-hidden="true"
              className="relative z-10 h-24 w-24 sm:h-28 sm:w-28 select-none drop-shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
              draggable={false}
            />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="h-1.5 w-44 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#0f6f7a] to-[#8ffcff] transition-[width] duration-200 ease-out"
              style={{ width: `${isExiting ? 100 : progress}%` }}
            />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    </motion.div>
  );
};
