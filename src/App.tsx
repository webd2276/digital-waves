import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoutePath } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesCatalogPage } from './pages/ServicesCatalogPage';
import { ServiceWebDevPage } from './pages/ServiceWebDevPage';
import { ServiceAiAgentPage } from './pages/ServiceAiAgentPage';
import { ServiceAiAutomationPage } from './pages/ServiceAiAutomationPage';
import { PortfolioCatalogPage } from './pages/PortfolioCatalogPage';
import { FaqsPage } from './pages/FaqsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyTermsPage } from './pages/PrivacyTermsPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => {
    const path = window.location.pathname as RoutePath;
    const validPaths: RoutePath[] = [
      '/',
      '/about',
      '/services',
      '/services/website-development',
      '/services/ai-agent-chatbot',
      '/services/ai-automation',
      '/catalog',
      '/faqs',
      '/privacy-terms',
      '/contact',
    ];
    return validPaths.includes(path) ? path : '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as RoutePath;
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: RoutePath) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/services':
        return <ServicesCatalogPage onNavigate={navigate} />;
      case '/services/website-development':
        return <ServiceWebDevPage onNavigate={navigate} />;
      case '/services/ai-agent-chatbot':
        return <ServiceAiAgentPage onNavigate={navigate} />;
      case '/services/ai-automation':
        return <ServiceAiAutomationPage onNavigate={navigate} />;
      case '/catalog':
        return <PortfolioCatalogPage onNavigate={navigate} />;
      case '/faqs':
        return <FaqsPage onNavigate={navigate} />;
      case '/privacy-terms':
        return <PrivacyTermsPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col bg-white text-[#0f172a] selection:bg-[#00e5ff]/20 selection:text-[#00b3cc] overflow-x-hidden">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <div className="relative z-10">
        <Footer onNavigate={navigate} />
      </div>
    </div>
  );
}
