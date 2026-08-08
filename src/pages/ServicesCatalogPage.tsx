import React from 'react';
import { motion } from 'motion/react';
import { RoutePath } from '../types';
import { ThreeDCard } from '../components/3DCard';
import { SphereIcon } from '../components/SphereIcon';
import { Code2, PhoneCall, Workflow, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ServicesCatalogPageProps {
  onNavigate: (path: RoutePath) => void;
}

export const ServicesCatalogPage: React.FC<ServicesCatalogPageProps> = ({ onNavigate }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const easeOutCurve = [0.22, 1, 0.36, 1] as const;
  const heroDelay = { eyebrow: 0, headline: 0.12, subtext: 0.26 };

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

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden text-center">
        {shouldAnimate ? (
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,217,230,0.14),transparent_32%),linear-gradient(180deg,rgba(248,250,252,0.82),rgba(255,255,255,0.96))]" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))]" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            {...heroMotion(heroDelay.eyebrow)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-xs font-bold text-[#00b3cc] mb-6"
          >
            SERVICES CATALOG
          </motion.div>

          <motion.h1
            {...heroMotion(heroDelay.headline)}
            className="font-display font-extrabold text-4xl sm:text-6xl text-[#0f172a] max-w-4xl mx-auto tracking-tight mb-4"
          >
            Three services. Zero fluff.
          </motion.h1>

          <motion.p
            {...heroMotion(heroDelay.subtext)}
            className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Pick a lane below, or let us build all three into one cohesive, revenue-generating system.
          </motion.p>
        </div>
      </section>

      {/* 3 LARGE SERVICE CARDS */}
      <section className="py-12 bg-white">
        <motion.div
          initial={shouldAnimate ? 'hidden' : false}
          whileInView={shouldAnimate ? 'visible' : undefined}
          viewport={{ once: true, amount: 0.2 }}
          variants={
            shouldAnimate
              ? {
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
                }
              : undefined
          }
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
        >
          {/* Card 1: Website Development */}
          <motion.div
            {...(shouldAnimate
              ? {
                  variants: {
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: easeOutCurve } },
                  },
                }
              : {})}
          >
            <ThreeDCard
              glow={shouldAnimate}
              hoverEffect={shouldAnimate}
              onClick={() => onNavigate('/services/website-development')}
              className="p-8 sm:p-10 group bg-slate-50/80 hover:bg-white border border-slate-200 transition-shadow duration-200"
            >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-4">
                  <SphereIcon icon={Code2} size="lg" floating={shouldAnimate} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00b3cc]">Service 01</span>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0f172a] group-hover:text-[#00b3cc] transition-colors">
                      WordPress & Custom Web Apps
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                  Need a site live this week? We build on WordPress. Need something custom — a dashboard, an internal tool, a full product? We build it in MERN (MongoDB, Express, React, Node) or a classic HTML/CSS/JS + PHP/MySQL stack, deployed and documented.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Responsive WordPress builds
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Custom themes & plugins
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Full-stack MERN web apps
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> PHP/MySQL custom backends
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center items-lg-end pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-8">
                <div className="text-xs font-semibold text-slate-500 mb-2">Typical Timeline: 1–3 Weeks</div>
                <motion.button
                  onClick={() => onNavigate('/services/website-development')}
                  whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
                  whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                  className="px-6 py-3 bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                >
                  Explore Web Development <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </motion.button>
              </div>
            </div>
            </ThreeDCard>
          </motion.div>

          {/* Card 2: AI Agents & Chatbots */}
          <motion.div {...(shouldAnimate ? { variants: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: easeOutCurve } } } } : {})}>
          <ThreeDCard
            glow={shouldAnimate}
            hoverEffect={shouldAnimate}
            onClick={() => onNavigate('/services/ai-agent-chatbot')}
            className="p-8 sm:p-10 group bg-slate-50/80 hover:bg-white border border-slate-200 transition-shadow duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-4">
                  <SphereIcon icon={PhoneCall} size="lg" floating={shouldAnimate} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00b3cc]">Service 02</span>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0f172a] group-hover:text-[#00b3cc] transition-colors">
                      AI Calling Agents & 24/7 Chatbots
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                  Your customers don't stop asking questions at 6 PM. We build AI chat assistants and voice/calling agents that answer instantly, qualify leads, and hand off warm conversations to your team — trained on your actual business, not generic scripts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Website 24/7 chat assistants
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> AI voice/calling agents
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Lead qualification & booking
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Human hand-off when it matters
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center items-lg-end pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-8">
                <div className="text-xs font-semibold text-slate-500 mb-2">Typical Timeline: 1–2 Weeks</div>
                <motion.button
                  onClick={() => onNavigate('/services/ai-agent-chatbot')}
                  whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
                  whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                  className="px-6 py-3 bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                >
                  Explore AI Calling Agents <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </motion.button>
              </div>
            </div>
          </ThreeDCard>
          </motion.div>

          {/* Card 3: AI Automation (n8n) */}
          <motion.div {...(shouldAnimate ? { variants: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: easeOutCurve } } } } : {})}>
          <ThreeDCard
            glow={shouldAnimate}
            hoverEffect={shouldAnimate}
            onClick={() => onNavigate('/services/ai-automation')}
            className="p-8 sm:p-10 group bg-slate-50/80 hover:bg-white border border-slate-200 transition-shadow duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-4">
                  <SphereIcon icon={Workflow} size="lg" floating={shouldAnimate} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00b3cc]">Service 03</span>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0f172a] group-hover:text-[#00b3cc] transition-colors">
                      AI Automation with n8n
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                  Manual copy-pasting between Google Forms, Sheets, email, and your CRM costs hours every week. We design n8n workflows that move data automatically — form submission to sheet to notification to follow-up, without you touching it.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Google Forms → Sheets automation
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Workflow orchestration via n8n
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> AI agent + automation combos
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Ongoing monitoring & fixes
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center items-lg-end pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-8">
                <div className="text-xs font-semibold text-slate-500 mb-2">Typical Timeline: 1 Week</div>
                <motion.button
                  onClick={() => onNavigate('/services/ai-automation')}
                  whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
                  whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                  className="px-6 py-3 bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                >
                  Explore AI Automation <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </motion.button>
              </div>
            </div>
          </ThreeDCard>
          </motion.div>
        </motion.div>
      </section>

      {/* BUNDLE SUMMARY CTA */}
      <section className="py-16 bg-slate-50">
        <motion.div
          {...revealMotion(0.04)}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h3 className="font-display font-bold text-2xl text-[#0f172a] mb-2">
            Want All Three Integrated Into One System?
          </h3>
          <p className="text-sm text-[#475569] mb-6">
            We can build a responsive WordPress/MERN site, attach a 24/7 AI chat agent, and wire up n8n automations to sync all lead submissions straight to Google Sheets and Slack.
          </p>
          <motion.button
            onClick={() => onNavigate('/contact')}
            whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
            whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
            className="px-8 py-3.5 bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-sm rounded-lg shadow-md inline-flex items-center gap-2 transition-colors"
          >
            Get Full System Quote <Sparkles className="w-4 h-4 text-[#00e5ff] transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};
