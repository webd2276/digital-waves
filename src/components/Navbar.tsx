import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoutePath } from '../types';
import { Waves, Menu, X, ChevronDown, Sparkles, ArrowRight, PhoneCall, Code2, Workflow } from 'lucide-react';

interface NavbarProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; path: RoutePath; hasDropdown?: boolean }[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services', hasDropdown: true },
    { label: 'Catalog', path: '/catalog' },
    { label: 'FAQs', path: '/faqs' },
    { label: 'Contact', path: '/contact' },
  ];

  const subServices: { label: string; sub: string; path: RoutePath; icon: any }[] = [
    {
      label: 'Website Development',
      sub: 'WordPress & Custom MERN / PHP Web Apps',
      path: '/services/website-development',
      icon: Code2,
    },
    {
      label: 'AI Agents & Chatbots',
      sub: '24/7 Voice Calling & Website Assistants',
      path: '/services/ai-agent-chatbot',
      icon: PhoneCall,
    },
    {
      label: 'AI Automation (n8n)',
      sub: 'Google Forms, Sheets & CRM Integration',
      path: '/services/ai-automation',
      icon: Workflow,
    },
  ];

  const handleLinkClick = (path: RoutePath) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setMobileServicesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/70 backdrop-blur-sm border-b border-slate-100/80 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sphere-3d flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
              <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-[#0f172a]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#0f172a] block">
                Digital <span className="text-[#00b3cc]">Waves</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-[#475569] uppercase tracking-wider block -mt-1">
                Web & AI Agency
              </span>
            </div>
          </button>

          {/* Center Navigation - Glassy Effect with Rounded Border */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 p-1 lg:p-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-[#00b3cc]/40 transition-all">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || (item.hasDropdown && currentPath.startsWith('/services'));

              if (item.hasDropdown) {
                return (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      onClick={() => handleLinkClick('/services')}
                      className={`flex items-center gap-1 lg:gap-1.5 px-2.5 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'text-[#00b3cc] bg-[#00e5ff]/15 font-bold shadow-xs'
                          : 'text-[#475569] hover:text-[#0f172a] hover:bg-slate-100/70'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-200 ${
                          servicesDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Services Dropdown Menu */}
                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full left-0 w-80 pt-2 z-50"
                        >
                          <div className="glass-card rounded-2xl p-2.5 shadow-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl">
                            <div className="px-3 py-2 border-b border-slate-100">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Our 3 Core Services
                              </span>
                            </div>
                            <div className="py-1 space-y-1">
                              {subServices.map((sub) => {
                                const SubIcon = sub.icon;
                                return (
                                  <button
                                    key={sub.path}
                                    onClick={() => handleLinkClick(sub.path)}
                                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                                  >
                                    <div className="p-2 rounded-lg bg-[#00e5ff]/10 text-[#00b3cc] group-hover:bg-[#00e5ff] group-hover:text-[#0f172a] transition-colors">
                                      <SubIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-[#0f172a] group-hover:text-[#00b3cc] transition-colors">
                                        {sub.label}
                                      </div>
                                      <div className="text-xs text-[#475569]">{sub.sub}</div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="p-2 bg-slate-50/80 rounded-xl mt-1 text-center">
                              <button
                                onClick={() => handleLinkClick('/services')}
                                className="text-xs font-semibold text-[#00b3cc] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                              >
                                Explore Services Catalog <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  key={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`px-2.5 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#00b3cc] bg-[#00e5ff]/15 font-bold shadow-xs'
                      : 'text-[#475569] hover:text-[#0f172a] hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop & Tablet Right Action Controls */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            <button
              onClick={() => handleLinkClick('/contact')}
              className="relative group overflow-hidden rounded-[8px] bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-bold text-xs lg:text-sm px-4 lg:px-5 py-2 lg:py-2.5 transition-all shadow-[0_4px_14px_rgba(0,229,255,0.4)] hover:shadow-[0_6px_20px_rgba(0,229,255,0.6)] active:scale-95 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1.5 lg:gap-2">
                Get Free Quote <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#0f172a]" />
              </span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => handleLinkClick('/contact')}
              className="bg-[#00e5ff] active:bg-[#00b3cc] text-[#0f172a] font-extrabold text-xs px-3 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Get Quote
            </button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer with Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Mobile Drawer Panel */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="md:hidden glass-card border-b border-slate-200 bg-white/98 px-5 pt-4 pb-6 space-y-4 shadow-2xl relative z-50 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00e5ff] via-[#00b3cc] to-[#00e5ff]" />

              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
                  },
                }}
                className="space-y-1"
              >
                {navItems.map((item) => {
                  if (item.hasDropdown) {
                    return (
                      <div key={item.path} className="space-y-1">
                        <div
                          className={`w-full px-4 py-3 rounded-xl text-base font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            currentPath.startsWith('/services')
                              ? 'bg-[#00e5ff]/15 text-[#00b3cc] font-bold shadow-sm'
                              : 'text-[#0f172a] hover:bg-slate-50'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleLinkClick(item.path)}
                            className="flex-1 text-left flex items-center justify-between"
                          >
                            <span>{item.label}</span>
                          </button>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileServicesOpen(!mobileServicesOpen);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-200/50 text-[#00b3cc] focus:outline-none"
                            aria-label="Toggle Services dropdown"
                          >
                            <motion.div
                              animate={{ rotate: mobileServicesOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-5 h-5" />
                            </motion.div>
                          </motion.button>
                        </div>

                        {/* Dropdown Accordion Content */}
                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden pl-3 space-y-1 border-l-2 border-[#00e5ff]/40 my-1 ml-3"
                            >
                              {subServices.map((sub) => {
                                const SubIcon = sub.icon;
                                return (
                                  <motion.button
                                    key={sub.path}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleLinkClick(sub.path)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                                      currentPath === sub.path
                                        ? 'bg-[#00e5ff]/20 text-[#0f172a] font-bold'
                                        : 'text-slate-600 hover:text-[#00b3cc] hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className="p-1.5 rounded-md bg-[#00e5ff]/10 text-[#00b3cc]">
                                      <SubIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <div className="font-bold text-[#0f172a]">{sub.label}</div>
                                      <div className="text-[10px] text-slate-400">{sub.sub}</div>
                                    </div>
                                  </motion.button>
                                );
                              })}
                              <button
                                onClick={() => handleLinkClick('/services')}
                                className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold text-[#00b3cc] hover:underline flex items-center gap-1 mt-1"
                              >
                                View All Services Catalog <ArrowRight className="w-3 h-3" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <motion.button
                      key={item.path}
                      variants={{
                        hidden: { opacity: 0, x: -12 },
                        show: { opacity: 1, x: 0 },
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleLinkClick(item.path)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all flex items-center justify-between ${
                        currentPath === item.path
                          ? 'bg-[#00e5ff]/15 text-[#00b3cc] font-bold shadow-sm'
                          : 'text-[#0f172a] hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {currentPath === item.path && (
                        <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* CTA Action Button */}

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleLinkClick('/contact')}
                  className="w-full py-3.5 bg-[#00e5ff] hover:bg-[#00b3cc] text-[#0f172a] font-extrabold rounded-xl text-center flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,229,255,0.35)]"
                >
                  Get Free Quote <Sparkles className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
