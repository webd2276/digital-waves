import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoutePath } from '../types';
import { ThreeDCard } from '../components/3DCard';
import { SphereIcon } from '../components/SphereIcon';
import { WaveCanvas } from '../components/WaveCanvas';
import { PhoneCall, CheckCircle2, ArrowRight, Bot, Send, Sparkles, User, Volume2, Mic } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ServiceAiAgentPageProps {
  onNavigate: (path: RoutePath) => void;
}

const easeOutCurve = [0.22, 1, 0.36, 1] as const;

export const ServiceAiAgentPage: React.FC<ServiceAiAgentPageProps> = ({ onNavigate }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am the Digital Waves 24/7 AI Assistant. How can I help you regarding web development or AI voice agents today?',
      time: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    const newMsg = { sender: 'user' as const, text: userText, time: 'Now' };
    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "That's a great question! Our Digital Waves team can configure a custom AI agent tailored specifically to your business FAQs and Google Calendar.";
      const lower = userText.toLowerCase();

      if (lower.includes('price') || lower.includes('cost') || lower.includes('quote')) {
        botResponse = 'Our 24/7 AI Chatbot setup starts at $950, while full AI Voice Calling Agents start at $1,500. Both include training on your business docs & calendar integration!';
      } else if (lower.includes('call') || lower.includes('voice') || lower.includes('phone')) {
        botResponse = 'Our AI Voice Calling Agents connect directly to phone lines. They speak naturally, answer caller questions, qualify leads, and directly schedule appointments on your calendar!';
      } else if (lower.includes('time') || lower.includes('long') || lower.includes('fast')) {
        botResponse = 'An AI Chatbot or Voice Agent can be fully trained, tested, and deployed to your live website in under 10 business days.';
      } else if (lower.includes('hello') || lower.includes('hi')) {
        botResponse = 'Hi there! Ready to automate lead qualification and answer customer inquiries around the clock?';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse, time: 'Now' }]);
      setIsTyping(false);
    }, 1000);
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
    'Website chat assistants',
    'AI voice/calling agents',
    'Lead qualification & booking',
    'Human hand-off when it matters',
  ] as const;

  const waveformBaseHeights = [12, 28, 42, 18, 36, 48, 22, 38, 50, 24, 32, 16] as const;

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
            SERVICE 02 - AI AGENTS & CHATBOTS
          </motion.div>

          <motion.h1
            {...heroMotion(0.12)}
            className="font-display font-extrabold text-4xl sm:text-6xl text-[#0f172a] max-w-4xl mx-auto tracking-tight mb-6"
          >
            AI Calling Agents & 24/7 Chatbots
          </motion.h1>

          <motion.p
            {...heroMotion(0.26)}
            className="text-lg sm:text-xl text-[#475569] max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Your customers don't stop asking questions at 6 PM. We build AI chat assistants and voice/calling agents that answer instantly, qualify leads, and hand off warm conversations to your team — trained on your actual business, not generic scripts.
          </motion.p>

          <motion.div {...heroMotion(0.38)} className="flex justify-center gap-4">
            <motion.button
              whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
              whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
              onClick={() => onNavigate('/contact')}
              className="px-8 py-4 rounded-lg bg-[#00e5ff] text-[#0f172a] font-bold text-sm shadow-md inline-flex items-center gap-2 cursor-pointer transition-colors hover:bg-[#00b3cc]"
            >
              Get AI Agent Quote <Sparkles className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
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

      {/* AI VOICE EQUALIZER MOTION GRAPHIC & CHATBOT SANDBOX */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...revealMotion(0)} className="text-center mb-10">
            <div className="text-xs font-bold uppercase tracking-widest text-[#00b3cc] mb-2">
              Interactive Audio & Chat Demo
            </div>
            <h2 className="font-display font-bold text-3xl text-[#0f172a]">
              Test Our 24/7 AI Agent Sandbox
            </h2>
            <p className="text-xs text-[#475569] mt-2">
              Toggle voice simulation or send a text message below to experience natural AI conversations.
            </p>
          </motion.div>

          <motion.div
            {...revealMotion(0.08)}
            className="bg-[#0f172a] text-white p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-[#00e5ff]/30"
          >
            <div className="flex items-center gap-4">
              <SphereIcon icon={Volume2} size="md" floating={shouldAnimate} />
              <div>
                <div className="font-display font-bold text-base text-white flex items-center gap-2">
                  AI Voice Calling Synthesis <span className="text-[10px] bg-[#00e5ff]/20 text-[#00e5ff] px-2 py-0.5 rounded-full">REALTIME AUDIO</span>
                </div>
                <div className="text-xs text-slate-400">Human-sounding speech with ultra-low latency</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 h-12 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
              {waveformBaseHeights.map((baseHeight, i) => (
                <motion.div
                  key={i}
                  animate={
                    shouldAnimate
                      ? {
                          height: isPlayingVoice ? [10, baseHeight, 12] : [10, 16, 10],
                          opacity: [0.72, 1, 0.72],
                        }
                      : { height: baseHeight }
                  }
                  transition={{
                    duration: isPlayingVoice ? 0.9 : 1.7,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    delay: i * 0.05,
                    ease: 'easeInOut',
                  }}
                  className="w-1.5 rounded-full bg-[#00e5ff]"
                />
              ))}
            </div>

            <motion.button
              whileHover={shouldAnimate ? { scale: 1.02, boxShadow: '0 0 0 1px rgba(0,229,255,0.35), 0 0 24px rgba(0,229,255,0.18)' } : undefined}
              whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
              onClick={() => setIsPlayingVoice(!isPlayingVoice)}
              className="px-5 py-2.5 rounded-xl bg-[#00e5ff] text-[#0f172a] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-colors"
            >
              <Mic className="w-4 h-4" />
              {isPlayingVoice ? 'Pause AI Voice' : 'Test AI Voice Wave'}
            </motion.button>
          </motion.div>

          <motion.div {...revealMotion(0.12)}>
            <ThreeDCard hoverEffect={shouldAnimate} className="p-0 overflow-hidden bg-white border border-slate-200 shadow-2xl rounded-2xl">
              <div className="bg-[#0f172a] text-white p-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full sphere-3d flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#0f172a]" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-white flex items-center gap-2">
                      Digital Waves AI Agent <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
                    </div>
                    <div className="text-[10px] text-slate-400">Trained on Business FAQs & Booking API</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-[#00e5ff]/10 text-[#00e5ff] px-2.5 py-1 rounded-full border border-[#00e5ff]/30">
                  ONLINE 24/7
                </span>
              </div>

              <div className="p-6 h-80 overflow-y-auto space-y-4 bg-slate-50/50">
                <AnimatePresence initial={false}>
                  {messages.map((m, idx) => (
                    <motion.div
                      key={`${idx}-${m.sender}-${m.time}`}
                      initial={idx === 0 && shouldAnimate ? { opacity: 0, y: 10 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldAnimate ? { opacity: 0, y: -8 } : undefined}
                      transition={{ duration: 0.24, ease: easeOutCurve }}
                      className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                          m.sender === 'user'
                            ? 'bg-[#0f172a] text-white'
                            : 'bg-[#00e5ff] text-[#0f172a]'
                        }`}
                      >
                        {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                          m.sender === 'user'
                            ? 'bg-[#0f172a] text-white rounded-tr-none'
                            : 'bg-white text-[#0f172a] border border-slate-200 rounded-tl-none'
                        }`}
                      >
                        {m.text}
                        <div className="text-[9px] text-slate-400 text-right mt-1">{m.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                    <Bot className="w-4 h-4 text-[#00b3cc] animate-spin" /> Digital Waves AI is typing...
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask about pricing, voice calling agents, or deployment..."
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-colors duration-200"
                />
                <motion.button
                  type="submit"
                  whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
                  whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                  className="px-5 py-2.5 bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Send <Send className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </motion.button>
              </form>
            </ThreeDCard>
          </motion.div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-[#0f172a] text-white text-center">
        <motion.div {...revealMotion(0)} className="max-w-3xl mx-auto px-4">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Never miss an after-hours lead again.
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Deploy an AI Voice Calling Agent or 24/7 Chatbot trained specifically on your brand assets and schedule.
          </p>
          <motion.button
            whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
            whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
            onClick={() => onNavigate('/contact')}
            className="px-8 py-4 bg-[#00e5ff] text-[#0f172a] font-bold text-sm rounded-lg shadow-lg inline-flex items-center gap-2 cursor-pointer transition-colors hover:bg-[#00b3cc]"
          >
            Deploy Your AI Agent <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};
