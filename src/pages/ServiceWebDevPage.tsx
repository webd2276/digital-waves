import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoutePath } from '../types';
import { ThreeDCard } from '../components/3DCard';
import { SphereIcon } from '../components/SphereIcon';
import { WaveCanvas } from '../components/WaveCanvas';
import { Code2, CheckCircle2, ArrowRight, Globe, Database, Cpu, Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ServiceWebDevPageProps {
  onNavigate: (path: RoutePath) => void;
}

type TechTab = 'wordpress' | 'mern' | 'php';

const easeOutCurve = [0.22, 1, 0.36, 1] as const;

const tabContent: Record<
  TechTab,
  {
    title: string;
    eyebrow: string;
    description: string;
    items: string[];
    icon: typeof Globe;
  }
> = {
  wordpress: {
    title: 'WordPress Marketing Sites',
    eyebrow: 'Fast Turnaround (1-2 Weeks)',
    description:
      'Best for business websites, service providers, agency portfolios, and blogs where non-technical team members need full visual drag-and-drop editorial control.',
    items: [
      'Gutenberg / Elementor custom blocks',
      'SEO optimization & Yoast/RankMath',
      'Ultra-fast caching & PageSpeed 95+',
      'Security hardening & backup routines',
    ],
    icon: Globe,
  },
  mern: {
    title: 'MERN Custom Web Applications',
    eyebrow: 'High Performance & Custom Logic (2-4 Weeks)',
    description:
      'Ideal for SaaS products, complex client portals, interactive dashboards, dynamic real-time tools, and applications requiring bespoke user authentication and MongoDB collections.',
    items: [
      'React 19 single-page interactivity',
      'Express REST API microservices',
      'JWT & OAuth authentication',
      'Deployed on Cloud Run or Netlify',
    ],
    icon: Cpu,
  },
  php: {
    title: 'Classic HTML / CSS / JS + PHP / MySQL',
    eyebrow: 'Lightweight & Cost-Effective (1-3 Weeks)',
    description:
      'Perfect for lean custom web tools, legacy hosting compatibility, simple database-backed forms, and high-speed web apps with near-zero monthly hosting overhead.',
    items: [
      'Vanilla JS / Tailwind frontend',
      'PHP 8.3 structured backend',
      'MySQL relational database schema',
      'Runs on any cheap standard cPanel / VPS',
    ],
    icon: Database,
  },
};

export const ServiceWebDevPage: React.FC<ServiceWebDevPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TechTab>('wordpress');
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const heroMotion = (delay = 0) =>
    shouldAnimate
      ? {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.34, ease: easeOutCurve, delay },
        }
      : { initial: false, animate: { opacity: 1, y: 0 } };

  const revealMotion = (delay = 0) =>
    shouldAnimate
      ? {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.34, ease: easeOutCurve, delay },
        }
      : { initial: false, animate: { opacity: 1, y: 0 } };

  const pills = [
    'Responsive WordPress builds',
    'Custom themes & plugins',
    'Full-stack MERN apps',
    'PHP/MySQL backends',
    'Deployed on Netlify / Host of choice',
  ] as const;

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
            SERVICE 01 - WEBSITE DEVELOPMENT
          </motion.div>

          <motion.h1
            {...heroMotion(0.12)}
            className="font-display font-extrabold text-4xl sm:text-6xl text-[#0f172a] max-w-4xl mx-auto tracking-tight mb-6"
          >
            WordPress & Custom Web Apps
          </motion.h1>

          <motion.p
            {...heroMotion(0.26)}
            className="text-lg sm:text-xl text-[#475569] max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Need a site live this week? We build on WordPress. Need something custom — a dashboard, an internal tool, a full product? We build it in MERN (MongoDB, Express, React, Node) or a classic HTML/CSS/JS + PHP/MySQL stack, deployed and documented.
          </motion.p>

          <motion.div {...heroMotion(0.38)} className="flex justify-center gap-4">
            <motion.button
              whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
              whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
              onClick={() => onNavigate('/contact')}
              className="px-8 py-4 rounded-lg bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-bold text-sm shadow-md inline-flex items-center gap-2 transition-colors"
            >
              Get Web Dev Quote <Sparkles className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FEATURE BULLETS */}
      <section className="py-16 bg-white border-y border-slate-100">
        <motion.div
          initial={shouldAnimate ? 'hidden' : false}
          whileInView={shouldAnimate ? 'visible' : undefined}
          viewport={{ once: true, amount: 0.3 }}
          variants={
            shouldAnimate
              ? { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }
              : undefined
          }
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
            {pills.map((feat) => (
              <motion.div
                key={feat}
                {...(shouldAnimate
                  ? {
                      variants: {
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: easeOutCurve } },
                      },
                    }
                  : {})}
                className="glass-card rounded-xl p-4 flex flex-col items-center justify-center bg-white border border-slate-200 transition-transform duration-200 ease-out"
              >
                <CheckCircle2 className="w-6 h-6 text-[#00b3cc] mb-2" />
                <span className="font-display font-bold text-xs text-[#0f172a]">{feat}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* INTERACTIVE TECH STACK COMPARISON */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...revealMotion(0)}
            className="text-center mb-12"
          >
            <div className="text-xs font-bold uppercase tracking-widest text-[#00b3cc] mb-2">Architectural Comparison</div>
            <h2 className="font-display font-bold text-3xl text-[#0f172a]">
              Which Technology Fits Your Project Best?
            </h2>
          </motion.div>

          <motion.div
            {...revealMotion(0.08)}
            className="relative grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-200"
          >
            {(Object.keys(tabContent) as TechTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative overflow-hidden px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive ? 'text-white' : 'bg-white text-slate-600 hover:text-[#0f172a]'
                  }`}
                >
                  {isActive && shouldAnimate && (
                    <motion.div
                      layoutId="webdevTabIndicator"
                      className="absolute inset-0 rounded-xl bg-[#0f172a] shadow-md"
                      transition={{ duration: 0.2, ease: easeOutCurve }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab === 'wordpress' ? 'WordPress Engine' : tab === 'mern' ? 'MERN Stack App' : 'Classic HTML/PHP/MySQL'}
                  </span>
                </button>
              );
            })}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={shouldAnimate ? { opacity: 0, y: 10, scale: 0.98 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldAnimate ? { opacity: 0, y: -8, scale: 0.98 } : undefined}
              transition={{ duration: 0.22, ease: easeOutCurve }}
            >
              <ThreeDCard hoverEffect={shouldAnimate} className="p-8 bg-white border border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <SphereIcon icon={tabContent[activeTab].icon} size="md" floating={shouldAnimate} />
                    <div>
                      <h3 className="font-display font-bold text-xl text-[#0f172a]">{tabContent[activeTab].title}</h3>
                      <p className="text-xs text-[#00b3cc] font-semibold">{tabContent[activeTab].eyebrow}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {tabContent[activeTab].description}
                  </p>
                  <motion.div
                    initial={shouldAnimate ? 'hidden' : false}
                    animate="visible"
                    variants={
                      shouldAnimate
                        ? { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } }
                        : undefined
                    }
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700 pt-2"
                  >
                    {tabContent[activeTab].items.map((item) => (
                      <motion.div
                        key={item}
                        {...(shouldAnimate
                          ? {
                              variants: {
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOutCurve } },
                              },
                            }
                          : {})}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> {item}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </ThreeDCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-20 bg-[#0f172a] text-white text-center">
        <motion.div
          {...revealMotion(0)}
          className="max-w-3xl mx-auto px-4"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Need a site or custom web app shipped?
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Tell us your specs and target timeline. We'll reply within 24 hours with a transparent proposal.
          </p>
          <motion.button
            whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
            whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
            onClick={() => onNavigate('/contact')}
            className="px-8 py-4 bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-bold text-sm rounded-lg shadow-lg inline-flex items-center gap-2 transition-colors"
          >
            Request Website Proposal <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};
