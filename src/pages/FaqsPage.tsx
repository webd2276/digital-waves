import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RoutePath } from '../types';
import { FAQ_DATA } from '../data';
import { WaveCanvas } from '../components/WaveCanvas';
import { ArrowRight, Plus, Search } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface FaqsPageProps {
  onNavigate: (path: RoutePath) => void;
}

const easeOutCurve = [0.22, 1, 0.36, 1] as const;

const heroReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.34, ease: easeOutCurve, delay },
});

const listStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.03,
    },
  },
} as const;

const faqItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: easeOutCurve },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: easeOutCurve },
  },
} as const;

const answerVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.28, ease: easeOutCurve },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.22, ease: easeOutCurve },
  },
} as const;

export const FaqsPage: React.FC<FaqsPageProps> = ({ onNavigate }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const [openId, setOpenId] = useState<number | null>(1); // Default open first question
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const openTimerRef = useRef<number | null>(null);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return FAQ_DATA;

    return FAQ_DATA.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  const toggleAccordion = (id: number) => {
    if (!shouldAnimate) {
      setOpenId(openId === id ? null : id);
      return;
    }

    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    if (openId === id) {
      setOpenId(null);
      return;
    }

    if (openId !== null) {
      setOpenId(null);
      openTimerRef.current = window.setTimeout(() => {
        setOpenId(id);
        openTimerRef.current = null;
      }, 72);
      return;
    }

    setOpenId(id);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <WaveCanvas height="100%" speedMultiplier={0.8} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            {...(shouldAnimate ? heroReveal(0) : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-xs font-bold text-[#00b3cc] mb-6"
          >
            FREQUENTLY ASKED QUESTIONS
          </motion.div>

          <motion.h1
            {...(shouldAnimate ? heroReveal(0.12) : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="font-display font-extrabold text-4xl sm:text-6xl text-[#0f172a] max-w-4xl mx-auto tracking-tight mb-4"
          >
            Questions, answered.
          </motion.h1>

          <motion.p
            {...(shouldAnimate ? heroReveal(0.26) : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Clear, honest answers about our web development process, AI voice agents, and n8n automations.
          </motion.p>

          {/* SEARCH BAR */}
          <motion.div
            {...(shouldAnimate ? heroReveal(0.38) : { initial: false, animate: { opacity: 1, y: 0 } })}
            className="max-w-xl mx-auto relative"
          >
            <motion.div
              animate={{ scale: isSearchFocused ? 1.05 : 1 }}
              transition={{ duration: 0.15, ease: easeOutCurve }}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <Search className="w-5 h-5 text-slate-400" />
            </motion.div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search FAQs (e.g. WordPress, hosting, timeline)..."
              className={`w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-sm text-[#0f172a] shadow-sm outline-none border transition-[border-color,box-shadow] duration-150 ${
                isSearchFocused
                  ? 'border-[#00e5ff] shadow-[0_0_0_4px_rgba(0,229,255,0.12)]'
                  : 'border-slate-200'
              }`}
            />
          </motion.div>
        </div>
      </section>

      {/* ACCORDION LIST */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No matching questions found for "{searchQuery}". Try searching for another keyword.
            </div>
          ) : (
            <motion.div
              initial={shouldAnimate ? 'hidden' : false}
              whileInView={shouldAnimate ? 'visible' : undefined}
              viewport={shouldAnimate ? { once: true, amount: 0.15 } : undefined}
              variants={shouldAnimate ? listStagger : undefined}
              className="space-y-4"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {filteredFaqs.map((faq) => {
                  const isOpen = openId === faq.id;
                  const panelId = `faq-panel-${faq.id}`;

                  return (
                    <motion.article
                      key={faq.id}
                      layout
                      variants={shouldAnimate ? faqItemVariants : undefined}
                      initial={shouldAnimate ? 'hidden' : false}
                      animate="visible"
                      exit={shouldAnimate ? 'exit' : undefined}
                      className="glass-card rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleAccordion(faq.id)}
                        className="group w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none transition-colors duration-150 hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="font-display font-bold text-base sm:text-lg text-[#0f172a]">
                          {faq.question}
                        </span>
                        <motion.div
                          animate={{
                            rotate: isOpen ? 45 : 0,
                            backgroundColor: isOpen ? 'rgba(0, 229, 255, 1)' : 'rgba(241, 245, 249, 1)',
                            color: isOpen ? 'rgb(15, 23, 42)' : 'rgb(100, 116, 139)',
                          }}
                          transition={{ duration: 0.2, ease: easeOutCurve }}
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key={panelId}
                            id={panelId}
                            initial={shouldAnimate ? 'closed' : false}
                            animate="open"
                            exit={shouldAnimate ? 'closed' : undefined}
                            variants={shouldAnimate ? answerVariants : undefined}
                            className="overflow-hidden"
                            style={{ willChange: 'height, opacity' }}
                          >
                            <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-[#475569] leading-relaxed border-t border-slate-100 pt-4">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* STILL HAVE QUESTIONS? */}
      <section className="py-20 bg-slate-50 text-center">
        <motion.div
          {...(shouldAnimate
            ? {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.3 },
                transition: { duration: 0.34, ease: easeOutCurve },
              }
            : { initial: false, animate: { opacity: 1, y: 0 } })}
          className="max-w-2xl mx-auto px-4"
        >
          <h3 className="font-display font-bold text-2xl text-[#0f172a] mb-3">
            Have a question not listed here?
          </h3>
          <p className="text-sm text-[#475569] mb-6">
            We're happy to discuss your specific project needs and technical setup.
          </p>
          <motion.button
            {...(shouldAnimate
              ? {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                }
              : { initial: false })}
            onClick={() => onNavigate('/contact')}
            className="group px-8 py-3.5 bg-[#00e5ff] text-[#0f172a] font-bold text-sm rounded-lg shadow-md inline-flex items-center gap-2 cursor-pointer transition-colors duration-150 hover:bg-[#00b3cc]"
          >
            Ask Our Engineers
            <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};
