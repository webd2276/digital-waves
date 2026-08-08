import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoutePath, PortfolioProject } from '../types';
import { PORTFOLIO_PROJECTS } from '../data';
import { ThreeDCard } from '../components/3DCard';
import { WaveCanvas } from '../components/WaveCanvas';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface PortfolioCatalogPageProps {
  onNavigate: (path: RoutePath) => void;
}

type PortfolioFilter = 'All' | 'Website Development' | 'AI Automation';

const easeOutCurve = [0.22, 1, 0.36, 1] as const;

const GRID_VARIANTS = {
  fadeUp: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.11,
        delayChildren: 0.05,
      },
    },
  },
  slideLeft: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.04,
      },
    },
  },
  slideRight: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.04,
      },
    },
  },
} as const;

const CARD_VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.68, ease: easeOutCurve },
    },
    exit: {
      opacity: 0,
      y: 12,
      transition: { duration: 0.2, ease: easeOutCurve },
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -72 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.68, ease: easeOutCurve },
    },
    exit: {
      opacity: 0,
      x: -14,
      transition: { duration: 0.2, ease: easeOutCurve },
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: 72 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.68, ease: easeOutCurve },
    },
    exit: {
      opacity: 0,
      x: 14,
      transition: { duration: 0.2, ease: easeOutCurve },
    },
  },
} as const;

export const PortfolioCatalogPage: React.FC<PortfolioCatalogPageProps> = ({ onNavigate }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const [selectedCategory, setSelectedCategory] = useState<PortfolioFilter>('All');
  const [activeModalProject, setActiveModalProject] = useState<PortfolioProject | null>(null);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return PORTFOLIO_PROJECTS;
    return PORTFOLIO_PROJECTS.filter((project) => project.category === selectedCategory);
  }, [selectedCategory]);

  const heroMotion = (delay = 0) =>
    shouldAnimate
      ? {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.34, ease: easeOutCurve, delay },
        }
      : { initial: false, animate: { opacity: 1, y: 0 } };

  const ctaMotion = (delay = 0) =>
    shouldAnimate
      ? {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.34, ease: easeOutCurve, delay },
        }
      : { initial: false, animate: { opacity: 1, y: 0 } };

  const gridVariantKey: 'fadeUp' | 'slideLeft' | 'slideRight' =
    selectedCategory === 'Website Development'
      ? 'slideLeft'
      : selectedCategory === 'AI Automation'
        ? 'slideRight'
        : 'fadeUp';

  const filterPills: PortfolioFilter[] = ['All', 'Website Development', 'AI Automation'];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden text-center">
        {shouldAnimate ? (
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <WaveCanvas height="100%" speedMultiplier={0.8} />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))]" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            {...heroMotion(0)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-xs font-bold text-[#00b3cc] mb-6"
          >
            AGENCY PORTFOLIO & CASE STUDIES
          </motion.div>

          <motion.h1
            {...heroMotion(0.12)}
            className="font-display font-extrabold text-4xl sm:text-6xl text-[#0f172a] max-w-4xl mx-auto tracking-tight mb-4"
          >
            Real projects. Real outcomes.
          </motion.h1>

          <motion.p
            {...heroMotion(0.26)}
            className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Filter by category to see how we've built websites, AI agents, and automations for real clients.
          </motion.p>

          <motion.div
            {...heroMotion(0.36)}
            className="relative flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto p-1.5 rounded-full bg-slate-100/85 border border-slate-200 shadow-sm"
          >
            {filterPills.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`group relative overflow-hidden px-5 py-2.5 rounded-full text-xs font-bold transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-[#00e5ff]' : 'text-slate-600 hover:text-[#0f172a]'
                  }`}
                >
                  {isActive && shouldAnimate && (
                    <motion.span
                      layoutId="portfolio-filter-pill"
                      className="absolute inset-0 rounded-full bg-[#0f172a] border border-[#00e5ff]/40 shadow-md"
                      transition={{ duration: 0.22, ease: easeOutCurve }}
                    />
                  )}
                  {!isActive && (
                    <span className="pointer-events-none absolute inset-0 rounded-full bg-white border border-slate-200 transition-colors duration-200 group-hover:bg-slate-50" />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* PROJECT GRID */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              layout
              initial={shouldAnimate ? 'hidden' : false}
              animate="visible"
              exit={shouldAnimate ? 'hidden' : undefined}
              variants={shouldAnimate ? GRID_VARIANTS[gridVariantKey] : undefined}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              style={{ willChange: 'transform, opacity' }}
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  variants={shouldAnimate ? CARD_VARIANTS[gridVariantKey] : undefined}
                  initial={shouldAnimate ? 'hidden' : false}
                  animate="visible"
                  exit={shouldAnimate ? 'exit' : undefined}
                >
                  <ThreeDCard
                    hoverEffect={shouldAnimate}
                    onClick={() => setActiveModalProject(project)}
                    className="flex flex-col justify-between group bg-white border border-slate-200 h-full transition-shadow duration-200"
                  >
                    <div>
                      <div className="relative h-52 rounded-lg overflow-hidden mb-5">
                        <img
                          src={project.image}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <h3 className="font-display font-bold text-xl text-[#0f172a] mb-2 group-hover:text-[#00b3cc] transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-xs text-[#475569] leading-relaxed mb-4">
                        {project.shortDesc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.impactMetrics.map((metric, idx) => (
                          <span key={idx} className="text-[11px] font-semibold bg-[#00e5ff]/10 text-[#00b3cc] px-2.5 py-1 rounded-md">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      whileHover={shouldAnimate ? { x: 2 } : undefined}
                      className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-[#00b3cc] group-hover:underline"
                    >
                      <span>View Case Study</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                    </motion.div>
                  </ThreeDCard>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CASE STUDY MODAL */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={shouldAnimate ? { opacity: 0, scale: 0.94, y: 16 } : false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldAnimate ? { opacity: 0, scale: 0.96, y: 12 } : undefined}
              transition={{ duration: 0.24, ease: easeOutCurve }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-xs font-bold text-[#00b3cc] uppercase tracking-wider mb-1">
                {activeModalProject.category}
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0f172a] mb-4">
                {activeModalProject.title}
              </h2>

              <div className="relative h-60 rounded-xl overflow-hidden mb-6">
                <img
                  src={activeModalProject.image}
                  alt={activeModalProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl mb-6 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Client</span>
                  <span className="font-bold text-[#0f172a]">{activeModalProject.client}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Timeline</span>
                  <span className="font-bold text-[#0f172a]">{activeModalProject.timeline}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-display font-bold text-sm text-[#0f172a] mb-2">Project Overview</h4>
                <p className="text-xs text-[#475569] leading-relaxed">{activeModalProject.fullDesc}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-display font-bold text-sm text-[#0f172a] mb-2">Impact & Results</h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.impactMetrics.map((m, idx) => (
                    <span key={idx} className="text-xs font-bold bg-[#00e5ff]/15 text-[#00b3cc] px-3 py-1.5 rounded-lg">
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-display font-bold text-sm text-[#0f172a] mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalProject.techStack.map((tech, idx) => (
                    <span key={idx} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveModalProject(null);
                    onNavigate('/contact');
                  }}
                  className="px-6 py-2.5 bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  Request Similar Project <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-[#0f172a] text-white text-center">
        <motion.div {...ctaMotion(0)} className="max-w-3xl mx-auto px-4">
          <motion.h2
            {...ctaMotion(0.02)}
            className="font-display font-bold text-3xl sm:text-4xl text-white mb-4"
          >
            Have a project in mind?
          </motion.h2>
          <motion.p
            {...ctaMotion(0.1)}
            className="text-slate-300 text-sm mb-8"
          >
            Let's discuss how we can build a similar high-performing outcome for your business.
          </motion.p>
          <motion.button
            {...(shouldAnimate
              ? {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                }
              : {})}
            onClick={() => onNavigate('/contact')}
            className="group px-8 py-4 bg-[#00e5ff] text-[#0f172a] font-bold text-sm rounded-lg shadow-lg inline-flex items-center gap-2 cursor-pointer transition-colors hover:bg-[#00b3cc]"
          >
            Get Free Quote
            <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};
