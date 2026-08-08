import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoutePath } from '../types';
import { ThreeDCard } from '../components/3DCard';
import { SphereIcon } from '../components/SphereIcon';
import { WaveCanvas } from '../components/WaveCanvas';
import { Workflow, CheckCircle2, ArrowRight, Sparkles, FileText, Table, Bell, Zap, Play } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ServiceAiAutomationPageProps {
  onNavigate: (path: RoutePath) => void;
}

const easeOutCurve = [0.22, 1, 0.36, 1] as const;

export const ServiceAiAutomationPage: React.FC<ServiceAiAutomationPageProps> = ({ onNavigate }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isRunningSim, setIsRunningSim] = useState(false);

  const workflowNodes = [
    {
      step: 1,
      title: '1. Form Submission',
      icon: FileText,
      desc: 'Inbound lead submits inquiry via Google Form or custom website form.',
      codeSample: `{
  "event": "form_submit",
  "lead": { "name": "Sarah Connor", "email": "sarah@cyber.com" }
}`,
    },
    {
      step: 2,
      title: '2. n8n Engine',
      icon: Workflow,
      desc: 'n8n workflow triggers instantly, validating data & running AI scoring.',
      codeSample: `// n8n Node Function
if (lead.score > 80) {
  return { priority: "HIGH", routeTo: "VIP_CRM" };
}`,
    },
    {
      step: 3,
      title: '3. Google Sheet Sync',
      icon: Table,
      desc: 'Lead record is written automatically to designated Google Sheet database.',
      codeSample: `GOOGLE_SHEET_API.appendRow({
  sheetId: "LEADS_2026",
  row: ["Sarah Connor", "sarah@cyber.com", "VIP_CRM"]
});`,
    },
    {
      step: 4,
      title: '4. AI Alert & CRM',
      icon: Bell,
      desc: 'Instant Slack notification posted & CRM contact record created.',
      codeSample: `SLACK.postMessage("#sales-leads", {
  text: "🚀 New High-Value Lead: Sarah Connor"
});`,
    },
  ] as const;

  const triggerSimulation = () => {
    setIsRunningSim(true);
    setActiveStep(1);
    setTimeout(() => setActiveStep(2), 700);
    setTimeout(() => setActiveStep(3), 1400);
    setTimeout(() => setActiveStep(4), 2100);
    setTimeout(() => setIsRunningSim(false), 2800);
  };

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

  const features = [
    'Google Forms → Sheets automation',
    'Workflow orchestration with n8n',
    'AI agent + automation combos',
    'Ongoing monitoring & fixes',
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
            SERVICE 03 - AI AUTOMATION (n8n)
          </motion.div>

          <motion.h1
            {...heroMotion(0.12)}
            className="font-display font-extrabold text-4xl sm:text-6xl text-[#0f172a] max-w-4xl mx-auto tracking-tight mb-6"
          >
            AI Automation with n8n
          </motion.h1>

          <motion.p
            {...heroMotion(0.26)}
            className="text-lg sm:text-xl text-[#475569] max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Manual copy-pasting between Google Forms, Sheets, email, and your CRM costs hours every week. We design n8n workflows that move data automatically — form submission to sheet to notification to follow-up, without you touching it.
          </motion.p>

          <motion.div {...heroMotion(0.38)} className="flex justify-center gap-4">
            <motion.button
              whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
              whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
              onClick={() => onNavigate('/contact')}
              className="px-8 py-4 rounded-lg bg-[#00e5ff] text-[#0f172a] font-bold text-sm shadow-md inline-flex items-center gap-2 cursor-pointer transition-colors hover:bg-[#00b3cc]"
            >
              Get Automation Quote <Sparkles className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
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
              ? { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } }
              : undefined
          }
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {features.map((feat) => (
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

      {/* INTERACTIVE WORKFLOW DIAGRAM */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...revealMotion(0)} className="text-center mb-10">
            <div className="text-xs font-bold uppercase tracking-widest text-[#00b3cc] mb-2">
              Visual Workflow Architecture
            </div>
            <h2 className="font-display font-bold text-3xl text-[#0f172a] mb-3">
              How n8n Automates Google Forms to Sheets
            </h2>
            <p className="text-xs text-[#475569] max-w-xl mx-auto mb-6">
              Click any node or press "Run Live Simulation" to watch simulated lead packets flow across nodes in real-time.
            </p>

            <motion.button
              whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
              whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
              onClick={triggerSimulation}
              disabled={isRunningSim}
              className="px-6 py-2.5 rounded-full bg-[#0f172a] text-[#00e5ff] border border-[#00e5ff]/40 text-xs font-bold inline-flex items-center gap-2 shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunningSim ? 'Simulating Live Data Pipeline...' : 'Run Live Data Simulation'}
            </motion.button>
          </motion.div>

          <motion.div
            initial={shouldAnimate ? 'hidden' : false}
            whileInView={shouldAnimate ? 'visible' : undefined}
            viewport={{ once: true, amount: 0.3 }}
            variants={
              shouldAnimate
                ? { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } }
                : undefined
            }
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative"
          >
            {workflowNodes.map((node) => {
              const IconComp = node.icon;
              const isActive = activeStep === node.step;
              return (
                <motion.button
                  key={node.step}
                  onClick={() => setActiveStep(node.step)}
                  whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
                  whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                  {...(shouldAnimate
                    ? {
                        variants: {
                          hidden: { opacity: 0, y: 12 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOutCurve } },
                        },
                      }
                    : {})}
                  className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                    isActive
                      ? 'bg-[#0f172a] text-white border-[#00e5ff] shadow-xl ring-2 ring-[#00e5ff]/50'
                      : 'bg-white text-[#0f172a] border-slate-200 hover:border-[#00e5ff]'
                  }`}
                >
                  {isActive && shouldAnimate && (
                    <motion.div
                      layoutId="automationActiveIndicator"
                      animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.02, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-xl border border-[#00e5ff]/40 shadow-[inset_0_0_0_1px_rgba(0,229,255,0.35),0_0_24px_rgba(0,229,255,0.16)] pointer-events-none"
                    />
                  )}

                  <div
                    className={`p-2.5 rounded-lg inline-block mb-3 transition-transform duration-200 ease-out ${
                      isActive ? 'bg-[#00e5ff] text-[#0f172a] scale-[1.05]' : 'bg-slate-100 text-[#00b3cc]'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="font-display font-bold text-sm mb-1">{node.title}</div>
                  <div className={`text-[11px] leading-relaxed ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {node.desc}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div {...revealMotion(0.14)}>
            <ThreeDCard hoverEffect={shouldAnimate} className="p-8 bg-white border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <SphereIcon icon={Zap} size="md" floating={shouldAnimate} />
                  <div>
                    <h3 className="font-display font-bold text-xl text-[#0f172a]">
                      Step {activeStep} Deep Inspection
                    </h3>
                    <span className="text-xs text-[#00b3cc] font-semibold">Zero Manual Copy-Pasting Required</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-[#00e5ff]/10 text-[#00b3cc] px-3 py-1 rounded-full">
                  NODE_0{activeStep}
                </span>
              </div>

              <p className="text-sm text-[#475569] leading-relaxed mb-4">
                {workflowNodes[activeStep - 1].desc} Digital Waves builds robust error handling so if a sheet row is temporarily locked or an API rate limit occurs, n8n automatically retries without losing data.
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={shouldAnimate ? { opacity: 0, scale: 0.97 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldAnimate ? { opacity: 0, scale: 0.97 } : undefined}
                  transition={{ duration: 0.24, ease: easeOutCurve }}
                  className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-[#00e5ff] shadow-inner relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2 text-[10px]">
                    <span>AUTOMATION_NODE_PAYLOAD.json</span>
                    <span className="text-emerald-400">STATUS: 200 OK (0.32s)</span>
                  </div>
                  <motion.div
                    initial={shouldAnimate ? 'hidden' : false}
                    animate="visible"
                    variants={
                      shouldAnimate
                        ? { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } } }
                        : undefined
                    }
                    className="space-y-1"
                  >
                    {workflowNodes[activeStep - 1].codeSample.split('\n').map((line, index) => (
                      <motion.div
                        key={`${activeStep}-${index}`}
                        {...(shouldAnimate
                          ? {
                              variants: {
                                hidden: { opacity: 0, y: 8 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: easeOutCurve } },
                              },
                            }
                          : {})}
                        className="whitespace-pre-wrap font-mono text-[11px] text-slate-200 leading-relaxed"
                      >
                        {line}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </ThreeDCard>
          </motion.div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-20 bg-[#0f172a] text-white text-center">
        <motion.div {...revealMotion(0)} className="max-w-3xl mx-auto px-4">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Eliminate repetitive copy-pasting today.
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Tell us which tools you use daily (Google Forms, Sheets, HubSpot, Slack) and we'll build an automated n8n pipeline for you.
          </p>
          <motion.button
            whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
            whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
            onClick={() => onNavigate('/contact')}
            className="px-8 py-4 bg-[#00e5ff] text-[#0f172a] font-bold text-sm rounded-lg shadow-lg inline-flex items-center gap-2 cursor-pointer transition-colors hover:bg-[#00b3cc]"
          >
            Automate Your Workflow <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};
