import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RoutePath } from '../types';
import { ThreeDCard } from '../components/3DCard';
import { SphereIcon } from '../components/SphereIcon';
import { WaveCanvas } from '../components/WaveCanvas';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
  Send,
  Loader2,
  AlertCircle,
  User,
  Building2,
  Mail,
  Briefcase,
  FileText,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ContactPageProps {
  onNavigate: (path: RoutePath) => void;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

interface FormState {
  name: string;
  companyBrandName: string;
  workEmail: string;
  projectTypeService: string;
  projectOverview: string;
  emailAddress: string;
}

const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL?.trim();

const initialFormState: FormState = {
  name: '',
  companyBrandName: '',
  workEmail: '',
  projectTypeService: '',
  projectOverview: '',
  emailAddress: '',
};

const easeOutCurve = [0.22, 1, 0.36, 1] as const;

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.34, ease: easeOutCurve, delay },
});

const cardReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.38, ease: easeOutCurve, delay },
});

export const ContactPage: React.FC<ContactPageProps> = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (honeypot) {
      return;
    }

    if (!GOOGLE_APPS_SCRIPT_URL) {
      setSubmitState('error');
      setStatusMessage(
        'Missing VITE_GOOGLE_APPS_SCRIPT_URL. Add your Apps Script web app URL in .env before submitting.'
      );
      return;
    }

    setSubmitState('submitting');
    setStatusMessage('');

    try {
      const payload = new URLSearchParams({
        timestamp: new Date().toISOString(),
        name: formData.name,
        company_brand_name: formData.companyBrandName,
        work_email: formData.workEmail,
        project_type_service: formData.projectTypeService,
        project_overview: formData.projectOverview,
        email_address: formData.emailAddress,
        page_url: window.location.href,
      });

      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: payload.toString(),
      });

      setSubmitState('success');
      setStatusMessage('Your response has been sent to Google Sheets successfully.');
      setFormData(initialFormState);
      setHoneypot('');
    } catch {
      setSubmitState('error');
      setStatusMessage('Submission failed. Please check the Apps Script URL and try again.');
    }
  };

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-slate-400 shadow-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#00b3cc] focus:ring-4 focus:ring-[#00e5ff]/10';
  const labelClass = 'text-xs font-bold uppercase tracking-[0.18em] text-[#475569]';

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 text-[#0f172a]">
      <section className="relative py-16 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <WaveCanvas height="100%" speedMultiplier={0.8} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            {...(shouldAnimate ? reveal(0) : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-xs font-bold text-[#00b3cc] mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00b3cc]" />
            <span>START YOUR PROJECT</span>
          </motion.div>

          <motion.h1
            {...(shouldAnimate ? reveal(0.12) : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="font-display font-extrabold text-4xl sm:text-6xl text-[#0f172a] max-w-4xl mx-auto tracking-tight mb-4"
          >
            Connect with Digital Waves
          </motion.h1>

          <motion.p
            {...(shouldAnimate ? reveal(0.26) : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed"
          >
            Fill out the custom project form below and responses will be sent directly to your Google Sheet.
          </motion.p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <motion.div {...(shouldAnimate ? cardReveal(0) : { initial: false, animate: { opacity: 1, y: 0 } })}>
                <ThreeDCard className="p-6 sm:p-8 bg-white border border-slate-200 shadow-lg rounded-3xl" hoverEffect={false}>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display font-bold text-xl text-[#0f172a]">
                            Project Inquiry Form
                          </h3>
                          <p className="text-xs text-[#475569]">
                            Same response flow as Google Form, but fully custom on your site
                          </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/25 text-[11px] font-bold text-[#00b3cc]">
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Google Sheets Sync</span>
                        </div>
                      </div>

                      <p className="text-[11px] leading-relaxed text-slate-500 max-w-2xl">
                        The form below posts to a Google Apps Script web app. That script appends each response into your Google Sheet, including a timestamp.
                      </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="sr-only" aria-hidden="true">
                        <label>
                          Website
                          <input
                            type="text"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className={labelClass} htmlFor="name">
                            Your Name *
                          </label>
                          <div className="group relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 group-focus-within:text-[#00b3cc]" />
                            <input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              className={`${inputClass} pl-11`}
                              placeholder="Your full name"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className={labelClass} htmlFor="companyBrandName">
                            Company / Brand Name
                          </label>
                          <div className="group relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 group-focus-within:text-[#00b3cc]" />
                            <input
                              id="companyBrandName"
                              name="companyBrandName"
                              type="text"
                              value={formData.companyBrandName}
                              onChange={handleChange}
                              className={`${inputClass} pl-11`}
                              placeholder="Company or brand name"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className={labelClass} htmlFor="workEmail">
                            Work Email *
                          </label>
                          <div className="group relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 group-focus-within:text-[#00b3cc]" />
                            <input
                              id="workEmail"
                              name="workEmail"
                              type="email"
                              required
                              value={formData.workEmail}
                              onChange={handleChange}
                              className={`${inputClass} pl-11`}
                              placeholder="you@company.com"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className={labelClass} htmlFor="emailAddress">
                            Email Address
                          </label>
                          <div className="group relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 group-focus-within:text-[#00b3cc]" />
                            <input
                              id="emailAddress"
                              name="emailAddress"
                              type="email"
                              value={formData.emailAddress}
                              onChange={handleChange}
                              className={`${inputClass} pl-11`}
                              placeholder="Optional alternate email"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className={labelClass} htmlFor="projectTypeService">
                            Project Type / Service *
                          </label>
                          <div className="group relative">
                            <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 group-focus-within:text-[#00b3cc]" />
                            <select
                              id="projectTypeService"
                              name="projectTypeService"
                              required
                              value={formData.projectTypeService}
                              onChange={handleChange}
                              className={`${inputClass} pl-11 appearance-none`}
                            >
                              <option value="">Select a service</option>
                              <option value="Website Development">Website Development</option>
                              <option value="AI Agents & Chatbots">AI Agents & Chatbots</option>
                              <option value="AI Automation">AI Automation</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className={labelClass} htmlFor="projectOverview">
                            Project Overview *
                          </label>
                          <div className="group relative">
                            <FileText className="w-4 h-4 text-slate-400 absolute left-4 top-4 pointer-events-none transition-colors duration-150 group-focus-within:text-[#00b3cc]" />
                            <textarea
                              id="projectOverview"
                              name="projectOverview"
                              required
                              rows={7}
                              value={formData.projectOverview}
                              onChange={handleChange}
                              className={`${inputClass} pl-11 pt-3 resize-none`}
                              placeholder="Tell us about the website, app, automation, goals, timeline, and anything else we should know."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3 text-xs text-slate-500 max-w-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>
                            Responses are appended to your Google Sheet automatically with a timestamp, just like Google Forms.
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={submitState === 'submitting'}
                          className="group inline-flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-[10px] bg-[#00e5ff] px-5 font-extrabold text-sm text-[#0f172a] shadow-[0_10px_25px_rgba(0,229,255,0.35)] transition-[transform,filter,background-color,opacity] duration-150 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {submitState === 'submitting' ? (
                              <motion.span
                                key="submitting"
                                initial={shouldAnimate ? { opacity: 0, y: 4 } : false}
                                animate={{ opacity: 1, y: 0 }}
                                exit={shouldAnimate ? { opacity: 0, y: -4 } : undefined}
                                transition={{ duration: 0.18, ease: easeOutCurve }}
                                className="inline-flex items-center gap-2"
                              >
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                              </motion.span>
                            ) : (
                              <motion.span
                                key="idle"
                                initial={shouldAnimate ? { opacity: 0, y: 4 } : false}
                                animate={{ opacity: 1, y: 0 }}
                                exit={shouldAnimate ? { opacity: 0, y: -4 } : undefined}
                                transition={{ duration: 0.18, ease: easeOutCurve }}
                                className="inline-flex items-center gap-2"
                              >
                                Submit Response
                                <motion.span
                                  whileHover={shouldAnimate ? { x: 4 } : undefined}
                                  transition={{ duration: 0.15, ease: easeOutCurve }}
                                  className="inline-flex"
                                >
                                  <Send className="w-4 h-4" />
                                </motion.span>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>

                      <AnimatePresence initial={false} mode="popLayout">
                        {statusMessage && (
                          <motion.div
                            key={statusMessage}
                            initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
                            animate={{ opacity: 1, y: 0 }}
                            exit={shouldAnimate ? { opacity: 0, y: -4 } : undefined}
                            transition={{ duration: 0.24, ease: easeOutCurve }}
                            className={`rounded-2xl border px-4 py-3 text-sm flex items-start gap-3 ${
                              submitState === 'success'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : 'border-rose-200 bg-rose-50 text-rose-800'
                            }`}
                          >
                            {submitState === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            )}
                            <span>{statusMessage}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </div>
                </ThreeDCard>
              </motion.div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <motion.div {...(shouldAnimate ? cardReveal(0.12) : { initial: false, animate: { opacity: 1, y: 0 } })}>
                <ThreeDCard className="p-6 bg-[#0f172a] text-white rounded-2xl border border-slate-800" hoverEffect={false}>
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      {...(shouldAnimate
                        ? {
                            initial: { opacity: 0, scale: 0.92 },
                            whileInView: { opacity: 1, scale: 1 },
                            viewport: { once: true, amount: 0.15 },
                            transition: { duration: 0.3, ease: easeOutCurve },
                          }
                        : { initial: false, animate: { opacity: 1, scale: 1 } })}
                    >
                      <SphereIcon icon={Clock} size="md" />
                    </motion.div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-white">Response Guarantee</h4>
                      <span className="text-xs text-[#00e5ff]">Under 24 Business Hours</span>
                    </div>
                  </div>

                  <motion.div
                    {...(shouldAnimate
                      ? {
                          initial: 'hidden',
                          whileInView: 'visible',
                          viewport: { once: true, amount: 0.15 },
                          variants: {
                            hidden: {},
                            visible: {
                              transition: {
                                staggerChildren: 0.07,
                                delayChildren: 0.04,
                              },
                            },
                          },
                        }
                      : { initial: false, animate: { opacity: 1, y: 0 } })}
                    className="space-y-3 border-t border-slate-800 pt-4"
                  >
                    <motion.div
                      {...(shouldAnimate
                        ? {
                            initial: 'hidden',
                            whileInView: 'visible',
                            viewport: { once: true, amount: 0.15 },
                            variants: {
                              hidden: { opacity: 0, y: 10 },
                              visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: easeOutCurve } },
                            },
                          }
                        : { initial: false, animate: { opacity: 1, y: 0 } })}
                      className="flex items-center gap-3 text-xs text-slate-300"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
                      <span>Talk directly to senior engineers & founders</span>
                    </motion.div>
                    <motion.div
                      {...(shouldAnimate
                        ? {
                            initial: 'hidden',
                            whileInView: 'visible',
                            viewport: { once: true, amount: 0.15 },
                            variants: {
                              hidden: { opacity: 0, y: 10 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.24, ease: easeOutCurve, delay: 0.07 },
                              },
                            },
                          }
                        : { initial: false, animate: { opacity: 1, y: 0 } })}
                      className="flex items-center gap-3 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00e5ff]" />
                      <span>100% code ownership & custom NDAs upon request</span>
                    </motion.div>
                  </motion.div>
                </ThreeDCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
