import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { RoutePath } from '../types';
import { HomePreloader } from '../components/preloader/HomePreloader';
import { WaveCanvas } from '../components/WaveCanvas';
import { SphereIcon } from '../components/SphereIcon';
import { ThreeDCard } from '../components/3DCard';
import { PORTFOLIO_PROJECTS, TESTIMONIALS } from '../data';
import {
  Code2,
  PhoneCall,
  Workflow,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronRight,
  Calculator,
  Zap,
  TrendingUp,
  Award,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: RoutePath) => void;
}

const PRELOADER_SEEN_KEY = 'digital-waves-home-preloader-seen';
const PRELOADER_MIN_MS = 750;
const PRELOADER_MAX_MS = 4500;
const PRELOADER_EXIT_MS = 450;

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window === 'undefined') return false;

    try {
      const navigationEntry = window.performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (navigationEntry?.type === 'reload') {
        return true;
      }

      return window.sessionStorage.getItem(PRELOADER_SEEN_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [isPreloaderExiting, setIsPreloaderExiting] = useState(false);
  const [preloaderProgress, setPreloaderProgress] = useState(12);

  // Calculator state
  const [calcService, setCalcService] = useState<'website' | 'ai-agent' | 'automation' | 'bundle'>('website');
  const [calcComplexity, setCalcComplexity] = useState<'standard' | 'advanced' | 'enterprise'>('standard');

  const getEstimatedPrice = () => {
    let base = 1200;
    if (calcService === 'ai-agent') base = 1500;
    if (calcService === 'automation') base = 950;
    if (calcService === 'bundle') base = 2800;

    if (calcComplexity === 'advanced') base *= 1.6;
    if (calcComplexity === 'enterprise') base *= 2.5;

    return Math.round(base);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  useEffect(() => {
    if (!showPreloader) return;

    let mounted = true;
    let loadReady = document.readyState === 'complete';
    let fontsReady = typeof document.fonts === 'undefined' || document.fonts.status === 'loaded';
    let minElapsed = false;
    let exitStarted = false;
    let frameId = 0;
    let exitTimerId = 0;

    const finish = () => {
      if (!mounted || exitStarted) return;
      exitStarted = true;
      setIsPreloaderExiting(true);

      exitTimerId = window.setTimeout(() => {
        if (!mounted) return;

        setShowPreloader(false);
        setIsPreloaderExiting(false);

        try {
          window.sessionStorage.setItem(PRELOADER_SEEN_KEY, '1');
        } catch {
          // Session storage can fail in private mode; the preloader still exits cleanly.
        }
      }, PRELOADER_EXIT_MS);
    };

    const maybeFinish = (force = false) => {
      if (force || (loadReady && fontsReady && minElapsed)) {
        finish();
      }
    };

    const handleLoad = () => {
      loadReady = true;
      maybeFinish();
    };

    if (!loadReady) {
      window.addEventListener('load', handleLoad, { once: true });
    }

    if (typeof document.fonts !== 'undefined') {
      document.fonts.ready
        .then(() => {
          fontsReady = true;
          maybeFinish();
        })
        .catch(() => {
          fontsReady = true;
          maybeFinish();
        });
    }

    const minTimer = window.setTimeout(() => {
      minElapsed = true;
      maybeFinish();
    }, PRELOADER_MIN_MS);

    const maxTimer = window.setTimeout(() => {
      maybeFinish(true);
    }, PRELOADER_MAX_MS);

    const start = performance.now();
    const animateProgress = () => {
      const elapsed = performance.now() - start;
      const nextProgress = Math.min(96, Math.max(8, 12 + (elapsed / PRELOADER_MIN_MS) * 76));
      setPreloaderProgress(Math.round(nextProgress));

      if (!exitStarted) {
        frameId = window.requestAnimationFrame(animateProgress);
      }
    };

    frameId = window.requestAnimationFrame(animateProgress);

    return () => {
      mounted = false;
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
      window.clearTimeout(exitTimerId);
      window.cancelAnimationFrame(frameId);

      if (!loadReady) {
        window.removeEventListener('load', handleLoad);
      }
    };
  }, [showPreloader]);

  return (
    // No solid background here: the fixed 3D backdrop (SiteBackdrop3D) shows through the sections.
    // Each section keeps a translucent tint so the page still reads correctly when 3D is off.
    <div className="min-h-screen pt-20">
      {showPreloader && <HomePreloader progress={preloaderProgress} isExiting={isPreloaderExiting} />}
      {/* HERO SECTION: the 3D wave lives behind this, in the fixed backdrop */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden py-16">
        {/* Ambient Glow Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="cyan-glow-orb w-[500px] h-[500px] -top-20 -left-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="cyan-glow-orb w-[500px] h-[500px] -bottom-20 -right-20"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          {/* H1 Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#0f172a] tracking-tight leading-[1.08] max-w-5xl mx-auto mb-6"
          >
            We Build Your Website.{' '}
            <span className="bg-gradient-to-r from-[#0f172a] via-[#00b3cc] to-[#00e5ff] bg-clip-text text-transparent">
              You Ride the Wave of Growth.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-[#475569] max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Digital Waves is a full-stack web agency building WordPress sites, custom web apps, and AI-powered automation — from first line of code to live deployment.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 15px 30px rgba(0,229,255,0.5)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-[10px] bg-[#00e5ff] text-[#0f172a] font-extrabold text-base shadow-[0_10px_25px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Get Free Quote <Sparkles className="w-5 h-5 text-[#0f172a]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: '#f8fafc' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('/catalog')}
              className="w-full sm:w-auto px-8 py-4 rounded-[10px] bg-white text-[#0f172a] font-bold text-base border border-[#e2e8f0] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              View Our Work <ChevronRight className="w-5 h-5 text-[#00b3cc]" />
            </motion.button>
          </motion.div>

          {/* 3 Stat Pills */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            <motion.div
              whileHover={{ y: -4, borderColor: '#00e5ff' }}
              className="glass-card rounded-xl p-4 text-center bg-white border border-[#e2e8f0] transition-colors"
            >
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#0f172a] flex items-center justify-center gap-1">
                <TrendingUp className="w-5 h-5 text-[#00b3cc]" /> 120+
              </div>
              <div className="text-xs font-bold text-[#475569] uppercase tracking-wider mt-1">Websites Delivered</div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, borderColor: '#00e5ff' }}
              className="glass-card rounded-xl p-4 text-center bg-white border border-[#e2e8f0] transition-colors"
            >
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#00b3cc] flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 text-[#00b3cc]" /> 350+
              </div>
              <div className="text-xs font-bold text-[#475569] uppercase tracking-wider mt-1">Automations Built</div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, borderColor: '#00e5ff' }}
              className="glass-card rounded-xl p-4 text-center bg-white border border-[#e2e8f0] transition-colors"
            >
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#0f172a] flex items-center justify-center gap-1">
                <Award className="w-5 h-5 text-[#00b3cc]" /> 99.8%
              </div>
              <div className="text-xs font-bold text-[#475569] uppercase tracking-wider mt-1">Client Satisfaction</div>
            </motion.div>
          </motion.div>

          {/* Trust Line */}
          <motion.div variants={itemVariants} className="text-xs font-bold uppercase tracking-widest text-[#475569]">
            WordPress • MERN Stack • n8n Automation • AI Agents
          </motion.div>
        </motion.div>
      </section>

      {/* WHAT WE DO SECTION (3 PILLARS) */}
      <section className="py-24 bg-slate-50/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#00b3cc] mb-2">Our Capabilities</div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#0f172a]">
              Three Pillars of Modern Digital Agency Execution
            </h2>
            <p className="text-[#475569] text-base sm:text-lg mt-4">
              We focus strictly on high-impact services that drive real revenue and save operational hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1: Website Development */}
              <ThreeDCard
                glow
                onClick={() => onNavigate('/services/website-development')}
                className="flex flex-col justify-between group"
              >
                <div>
                  <SphereIcon icon={Code2} size="lg" className="mb-6" />
                  <h3 className="font-display font-bold text-2xl text-[#0f172a] mb-3 group-hover:text-[#00b3cc] transition-colors">
                    Website Development
                  </h3>
                  <p className="text-[#475569] text-sm leading-relaxed mb-6">
                    WordPress builds and custom web apps in MERN or classic HTML-CSS-JS-MySQL-PHP stacks — fast, SEO-ready, and built to scale.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> WordPress & Custom Themes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Full-Stack MERN & PHP Apps
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Deployed on Netlify / Host of choice
                    </li>
                  </ul>
                </div>
                <div className="flex items-center font-bold text-sm text-[#00b3cc] group-hover:underline">
                  Explore Website Development <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </ThreeDCard>

              {/* Pillar 2: AI Agents & Chatbots */}
              <ThreeDCard
                glow
                onClick={() => onNavigate('/services/ai-agent-chatbot')}
                className="flex flex-col justify-between group"
              >
                <div>
                  <SphereIcon icon={PhoneCall} size="lg" className="mb-6" />
                  <h3 className="font-display font-bold text-2xl text-[#0f172a] mb-3 group-hover:text-[#00b3cc] transition-colors">
                    AI Agents & Chatbots
                  </h3>
                  <p className="text-[#475569] text-sm leading-relaxed mb-6">
                    24/7 chatbots and AI calling agents that qualify leads, answer FAQs, and book calls while your team sleeps.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> AI Voice Calling Agents
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> 24/7 Website Chat Assistants
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Google Calendar Auto-Booking
                    </li>
                  </ul>
                </div>
                <div className="flex items-center font-bold text-sm text-[#00b3cc] group-hover:underline">
                  Explore AI Agents & Chatbots <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </ThreeDCard>

              {/* Pillar 3: AI Automation (n8n) */}
              <ThreeDCard
                glow
                onClick={() => onNavigate('/services/ai-automation')}
                className="flex flex-col justify-between group"
              >
                <div>
                  <SphereIcon icon={Workflow} size="lg" className="mb-6" />
                  <h3 className="font-display font-bold text-2xl text-[#0f172a] mb-3 group-hover:text-[#00b3cc] transition-colors">
                    AI Automation (n8n)
                  </h3>
                  <p className="text-[#475569] text-sm leading-relaxed mb-6">
                    We connect your tools — Google Forms, Sheets, CRMs — into automated workflows so nothing falls through the cracks.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Google Forms → Sheets Automation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> n8n Custom Workflow Engine
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b3cc]" /> Real-time Alerting & Logging
                    </li>
                  </ul>
                </div>
                <div className="flex items-center font-bold text-sm text-[#00b3cc] group-hover:underline">
                  Explore AI Automation <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </ThreeDCard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROCESS SECTION: 4-STEP HORIZONTAL TIMELINE WITH WAVE CONNECTING LINE */}
      <section className="py-24 bg-white/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-[#00b3cc] mb-2">How We Work</div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0f172a]">
              4 Steps From Discovery to Live Production
            </h2>
          </div>

          <div className="relative">
            {/* Connecting Wave Line in Background */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gradient-to-r from-[#00e5ff]/20 via-[#00e5ff] to-[#00e5ff]/20 z-0 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.05, ease: 'easeOut' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                <ThreeDCard className="text-center">
                  <div className="w-12 h-12 rounded-full sphere-3d font-display font-bold text-lg text-[#0f172a] flex items-center justify-center mx-auto mb-4">
                    01
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#0f172a] mb-2">Discovery Call</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    We clarify goals, define technical stack (WordPress, MERN, n8n), and lay out a fixed-price roadmap.
                  </p>
                </ThreeDCard>

                <ThreeDCard className="text-center">
                  <div className="w-12 h-12 rounded-full sphere-3d font-display font-bold text-lg text-[#0f172a] flex items-center justify-center mx-auto mb-4">
                    02
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#0f172a] mb-2">Design & Specs</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    3D-enhanced visual layouts, prompt engineering for AI voice agents, and data mapping for automations.
                  </p>
                </ThreeDCard>

                <ThreeDCard className="text-center">
                  <div className="w-12 h-12 rounded-full sphere-3d font-display font-bold text-lg text-[#0f172a] flex items-center justify-center mx-auto mb-4">
                    03
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#0f172a] mb-2">Build & Wire</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Clean full-stack implementation, n8n workflow deployment, and AI agent training on your business data.
                  </p>
                </ThreeDCard>

                <ThreeDCard className="text-center">
                  <div className="w-12 h-12 rounded-full sphere-3d font-display font-bold text-lg text-[#0f172a] flex items-center justify-center mx-auto mb-4">
                    04
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#0f172a] mb-2">Deploy & Support</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Instant deployment to Netlify or Cloud Run, live domain setup, and 30 days of hands-on post-launch support.
                  </p>
                </ThreeDCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO TEASER SECTION */}
      <section className="py-24 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#00b3cc] mb-2">Case Studies</div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0f172a]">
                Featured Client Outcomes
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/catalog')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 font-bold text-sm text-[#00b3cc] hover:underline"
            >
              Explore Full Catalog ({PORTFOLIO_PROJECTS.length} Projects) <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {PORTFOLIO_PROJECTS.slice(0, 3).map((project) => (
                <ThreeDCard key={project.id} className="flex flex-col justify-between group">
                  <div>
                    <div className="relative h-48 rounded-lg overflow-hidden mb-5">
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
                      {project.impactMetrics.map((m, idx) => (
                        <span key={idx} className="text-[11px] font-semibold bg-[#00e5ff]/10 text-[#00b3cc] px-2.5 py-1 rounded-md">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('/catalog')}
                    className="w-full py-2.5 rounded-lg border border-slate-200 hover:border-[#00e5ff] text-xs font-bold text-[#0f172a] hover:text-[#00b3cc] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    View Case Study <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </ThreeDCard>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* INSTANT PROJECT ESTIMATOR / ESTIMATE HELPER */}
      <section className="py-20 bg-white/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 sm:p-10 border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <SphereIcon icon={Calculator} size="md" />
              <div>
                <h3 className="font-display font-bold text-2xl text-[#0f172a]">
                  Instant Project Scope & Cost Estimator
                </h3>
                <p className="text-xs text-[#475569]">
                  Select your desired project type to preview a ballpark investment and timeline.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Controls */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    1. Select Service Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'website', label: 'Website Dev' },
                      { id: 'ai-agent', label: 'AI Voice/Chat Agent' },
                      { id: 'automation', label: 'n8n Automation' },
                      { id: 'bundle', label: 'All 3 (Full Bundle)' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setCalcService(opt.id as any)}
                        className={`p-3 rounded-lg text-xs font-bold border text-left transition-all ${
                          calcService === opt.id
                            ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#0f172a] shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    2. Select Complexity Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'standard', label: 'Standard' },
                      { id: 'advanced', label: 'Advanced' },
                      { id: 'enterprise', label: 'Custom Enterprise' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setCalcComplexity(opt.id as any)}
                        className={`p-2.5 rounded-lg text-xs font-bold border text-center transition-all ${
                          calcComplexity === opt.id
                            ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#0f172a] shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimate Result Box */}
              <div className="bg-[#0f172a] text-white rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="cyan-glow-orb w-40 h-40 -top-10 -right-10" />

                <div>
                  <div className="text-xs font-semibold text-[#00e5ff] uppercase tracking-wider mb-1">
                    Estimated Project Scope
                  </div>
                  <motion.div
                    key={`${calcService}-${calcComplexity}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="font-display font-extrabold text-4xl text-white mb-2"
                  >
                    ~${getEstimatedPrice().toLocaleString()}{' '}
                    <span className="text-xs font-normal text-slate-400">USD</span>
                  </motion.div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Includes full design, senior developer implementation, Netlify/Cloud deployment, and 30-day post-launch warranty.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('/contact')}
                    className="w-full py-3 bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    Lock In Your Quote <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-slate-50/70 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-widest text-[#00b3cc] mb-2">
              Testimonials
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0f172a]">
              What Founders & Leaders Say
            </h2>
            <p className="text-xs text-[#475569] mt-2">
              Continuous feedback from clients across web engineering and AI agent deployments.
            </p>
          </div>
        </div>

        {/* Continuous Infinite Scrolling Carousel Container */}
        {/* Edge fade via mask-image (not opaque overlays), so the 3D backdrop stays visible behind the marquee */}
        <div className="relative w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">

          {/* Marquee Track */}
          <div className="flex w-max group">
            <motion.div
              className="flex gap-6 pr-6 w-max"
              animate={{
                x: ['0%', '-50%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 32,
                  delay: 1,
                  repeatDelay: 1,
                  ease: 'linear',
                },
              }}
              style={{
                display: 'flex',
              }}
            >
              {[
                ...TESTIMONIALS,
                ...TESTIMONIALS,
                ...TESTIMONIALS,
                ...TESTIMONIALS,
              ].map((t, idx) => (
                <div
                  key={`${t.id}-${idx}`}
                  className="w-[300px] sm:w-[360px] shrink-0"
                >
                  <ThreeDCard className="h-full flex flex-col justify-between p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center gap-1 text-[#00b3cc] mb-3">
                        {Array.from({ length: t.stars }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-[#0f172a] italic leading-relaxed mb-6 line-clamp-4">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#00e5ff] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-display font-bold text-sm text-[#0f172a] truncate">
                          {t.name}
                        </div>
                        <div className="text-xs text-[#475569] truncate">
                          {t.role}, {t.company}
                        </div>
                      </div>
                    </div>
                  </ThreeDCard>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BAND WITH WAVE CANVAS */}
      <section className="relative py-28 bg-[#0f172a] text-white overflow-hidden">
        {/* Animated Wave Canvas Background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <WaveCanvas height="100%" speedMultiplier={0.8} />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white mb-6">
            Let's build your next chapter.
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Tell us what you need — a website, an AI agent, an automation, or all three. We reply within one business day.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,229,255,0.6)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('/contact')}
            className="px-10 py-5 rounded-[12px] bg-[#00e5ff] text-[#0f172a] font-extrabold text-lg shadow-[0_10px_35px_rgba(0,229,255,0.5)] transition-all inline-flex items-center gap-3 cursor-pointer"
          >
            Get Free Quote <Sparkles className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
};
