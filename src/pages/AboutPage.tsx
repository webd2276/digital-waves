import React from 'react';
import { motion } from 'motion/react';
import { RoutePath } from '../types';
import { ThreeDCard } from '../components/3DCard';
import { CheckCircle2, ArrowRight, Code, Users, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface AboutPageProps {
  onNavigate: (path: RoutePath) => void;
}

const easeOutCurve = [0.22, 1, 0.36, 1] as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: easeOutCurve },
  },
};

const fadeUpShortVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: easeOutCurve },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.38, ease: easeOutCurve },
  },
};

const staggerChildren = (stagger: number, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

const heroDelays = [0, 0.12, 0.26] as const;
const codeLines = [
  '✓ Senior Full-Stack Engineers On Every Account',
  '✓ WordPress, MERN & PHP Production Architecture',
  '✓ Gemini Voice & Text AI Agent Integrations',
  '✓ Automated n8n Workflow Pipelines',
  '✓ Netlify & Cloud Run CI/CD Deployment',
] as const;

const standards = [
  {
    icon: Users,
    title: 'Hands-On Developers',
    copy: 'You talk directly to the engineers building your site or AI agent - no account managers relaying specs.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Pricing',
    copy: 'Clear fixed-price milestones. No surprise invoices, hidden maintenance add-ons, or hourly scope creep.',
  },
  {
    icon: Zap,
    title: 'Fast Production',
    copy: 'Most WordPress sites ship within 1-2 weeks; custom web apps and n8n automations ship in 2-4 weeks.',
  },
  {
    icon: HeartHandshake,
    title: '30-Day Guarantee',
    copy: 'Full 30-day post-launch warranty covering performance tuning, bug fixes, and operational guidance.',
  },
] as const;

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,217,230,0.12),transparent_30%),linear-gradient(180deg,rgba(248,250,252,0.8),rgba(255,255,255,0.96))]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            {...(shouldAnimate
              ? {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.34, ease: easeOutCurve, delay: heroDelays[0] },
                }
              : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-xs font-bold text-[#00b3cc] mb-6"
          >
            OUR AGENCY ETHOS
          </motion.div>

          <motion.h1
            {...(shouldAnimate
              ? {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.38, ease: easeOutCurve, delay: heroDelays[1] },
                }
              : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="font-display font-extrabold text-4xl sm:text-6xl text-[#0f172a] max-w-4xl mx-auto tracking-tight leading-tight mb-6"
          >
            A small team. No middlemen, no outsourcing chains.
          </motion.h1>

          <motion.p
            {...(shouldAnimate
              ? {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.4, ease: easeOutCurve, delay: heroDelays[2] },
                }
              : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="text-lg sm:text-xl text-[#475569] max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Digital Waves is a hands-on web agency - every project is built by the people you talk to, not handed off to a subcontractor. We specialize in three things: shipping production-grade websites, wiring up AI agents that actually convert, and automating the busywork with n8n.
          </motion.p>
        </div>
      </section>

      {/* STORY SECTION - 2 COLUMNS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Story */}
            <motion.div
              {...(shouldAnimate
                ? {
                    initial: 'hidden',
                    whileInView: 'visible',
                    viewport: { once: true, amount: 0.3 },
                    variants: {
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
                    },
                  }
                : { initial: false })}
              className="space-y-6"
            >
              <motion.div
                {...(shouldAnimate ? { variants: fadeUpShortVariants } : { initial: false, animate: { opacity: 1, y: 0 } })}
                className="text-xs font-bold uppercase tracking-widest text-[#00b3cc]"
              >
                The Digital Waves Story
              </motion.div>

              <motion.h2
                {...(shouldAnimate ? { variants: fadeUpVariants } : { initial: false, animate: { opacity: 1, y: 0 } })}
                className="font-display font-bold text-3xl sm:text-4xl text-[#0f172a]"
              >
                Why We Built an Agency That Works Differently
              </motion.h2>

              <motion.p
                {...(shouldAnimate ? { variants: fadeUpVariants } : { initial: false, animate: { opacity: 1, y: 0 } })}
                className="text-[#475569] leading-relaxed"
              >
                Traditional agencies are plagued with slow communication chains, junior account managers relaying messages, and offshore outsourcing that degrades codebase quality.
              </motion.p>

              <motion.p
                {...(shouldAnimate ? { variants: fadeUpVariants } : { initial: false, animate: { opacity: 1, y: 0 } })}
                className="text-[#475569] leading-relaxed"
              >
                We founded Digital Waves to flip that model upside down. You partner directly with senior full-stack developers and AI engineers who write every line of code, craft every n8n workflow, and train every voice AI agent themselves.
              </motion.p>

              <motion.div
                {...(shouldAnimate
                  ? { variants: staggerChildren(0.08, 0.16) }
                  : { initial: false })}
                className="space-y-3 pt-2"
              >
                {[
                  'Direct communication with lead engineers',
                  'Transparent fixed pricing & timeline guarantees',
                  '100% owned codebases with zero vendor lock-in',
                ].map((item) => (
                  <motion.div
                    key={item}
                    {...(shouldAnimate ? { variants: fadeUpShortVariants } : { initial: false, animate: { opacity: 1, y: 0 } })}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#00b3cc] shrink-0" />
                    <span className="font-semibold text-sm text-[#0f172a]">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column: Graphic Visual */}
            <motion.div
              {...(shouldAnimate
                ? {
                    initial: { opacity: 0, scale: 0.97 },
                    whileInView: { opacity: 1, scale: 1 },
                    viewport: { once: true, amount: 0.3 },
                    transition: { duration: 0.38, ease: easeOutCurve },
                  }
                : { initial: false, animate: { opacity: 1, scale: 1 } })}
              className="relative"
            >
              <ThreeDCard glow={shouldAnimate} hoverEffect={shouldAnimate} className="bg-slate-900 text-white p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-full sphere-3d flex items-center justify-center">
                    <Code className="w-7 h-7 text-[#0f172a]" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#00e5ff] bg-[#00e5ff]/10 px-3 py-1 rounded-full">
                    DIGITAL_WAVES_CORE_ENGINE
                  </span>
                </div>

                <motion.div
                  {...(shouldAnimate
                    ? {
                        initial: 'hidden',
                        whileInView: 'visible',
                        viewport: { once: true, amount: 0.3 },
                        variants: staggerChildren(0.08, 0.1),
                      }
                    : { initial: false })}
                  className="space-y-4 font-mono text-xs text-slate-300 border-l-2 border-[#00e5ff] pl-4 py-2"
                >
                  {codeLines.map((line) => (
                    <motion.p
                      key={line}
                      {...(shouldAnimate ? { variants: fadeUpShortVariants } : { initial: false, animate: { opacity: 1, y: 0 } })}
                    >
                      {line}
                    </motion.p>
                  ))}
                </motion.div>

                <motion.div
                  {...(shouldAnimate
                    ? {
                        initial: { opacity: 0, y: 12 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true, amount: 0.3 },
                        transition: { duration: 0.3, ease: easeOutCurve, delay: 0.62 },
                      }
                    : { initial: false, animate: { opacity: 1, y: 0 } })}
                  className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between"
                >
                  <span className="text-xs text-slate-400">Response Guarantee</span>
                  <span className="font-display font-bold text-sm text-[#00e5ff]">Under 24 Hours</span>
                </motion.div>
              </ThreeDCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE VALUES / APPROACH */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...(shouldAnimate
              ? {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.3 },
                  transition: { duration: 0.34, ease: easeOutCurve },
                }
              : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="text-xs font-bold uppercase tracking-widest text-[#00b3cc] mb-2">Our Operating Standards</div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0f172a]">
              Built on Transparency & Senior Execution
            </h2>
          </motion.div>

          <motion.div
            {...(shouldAnimate
              ? {
                  initial: 'hidden',
                  whileInView: 'visible',
                  viewport: { once: true, amount: 0.25 },
                  variants: {
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
                  },
                }
              : { initial: false })}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {standards.map(({ icon: Icon, title, copy }) => (
              <motion.div
                key={title}
                {...(shouldAnimate
                  ? {
                      variants: fadeUpShortVariants,
                      whileHover: {
                        y: -5,
                        transition: { duration: 0.18, ease: easeOutCurve },
                      },
                    }
                  : { initial: false, animate: { opacity: 1, y: 0 } })}
              >
                <ThreeDCard hoverEffect={shouldAnimate} className="text-center group">
                  <div className="w-14 h-14 rounded-full sphere-3d flex items-center justify-center mx-auto mb-4 transition-transform duration-200 ease-out group-hover:scale-[1.05]">
                    <Icon className="w-6 h-6 text-[#0f172a]" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#0f172a] mb-2">{title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{copy}</p>
                </ThreeDCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            {...(shouldAnimate
              ? {
                  initial: 'hidden',
                  whileInView: 'visible',
                  viewport: { once: true, amount: 0.3 },
                  variants: {
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
                  },
                }
              : { initial: false })}
          >
            <motion.h2
              {...(shouldAnimate ? { variants: fadeUpVariants } : { initial: false, animate: { opacity: 1, y: 0 } })}
              className="font-display font-bold text-3xl sm:text-4xl text-[#0f172a] mb-4"
            >
              Ready to work directly with senior builders?
            </motion.h2>
            <motion.p
              {...(shouldAnimate ? { variants: fadeUpVariants } : { initial: false, animate: { opacity: 1, y: 0 } })}
              className="text-[#475569] text-base mb-8"
            >
              Let's discuss your web project, AI calling agent, or n8n workflow during a free discovery call.
            </motion.p>
            <motion.button
              {...(shouldAnimate
                ? {
                    variants: fadeUpShortVariants,
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                  }
                : { initial: false, animate: { opacity: 1, y: 0 } })}
              onClick={() => onNavigate('/contact')}
              className="group px-8 py-4 bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-bold text-sm rounded-[10px] shadow-lg transition-colors inline-flex items-center gap-2"
            >
              Start Your Project
              <motion.span
                {...(shouldAnimate ? { whileHover: { x: 4 }, transition: { duration: 0.18, ease: easeOutCurve } } : {})}
                className="inline-flex"
              >
                <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
