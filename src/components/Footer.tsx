import React from 'react';
import { RoutePath } from '../types';
import { Waves, ArrowRight, Mail, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: RoutePath) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: RoutePath) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f8fafc] border-t border-[#e2e8f0] relative overflow-hidden pt-16 pb-12">
      {/* Background Cyan Glow Orb */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#00e5ff]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button onClick={() => handleNav('/')} className="flex items-center gap-3 text-left group">
              <div className="w-10 h-10 rounded-[10px] sphere-3d flex items-center justify-center">
                <Waves className="w-5 h-5 text-[#0f172a]" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-[#0f172a]">
                Digital <span className="text-[#00b3cc]">Waves</span>
              </span>
            </button>

            <p className="text-sm text-[#475569] leading-relaxed max-w-md">
              Digital Waves is a full-stack web agency building WordPress sites, custom web apps, and AI-powered automation — from first line of code to live deployment.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-2">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-[#00b3cc]" /> 24h Response Guarantee
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00b3cc]" /> Senior-Only Engineers
              </span>
            </div>
          </div>

          {/* Sitemap Navigation */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#0f172a] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#475569]">
              <li>
                <button onClick={() => handleNav('/')} className="hover:text-[#00b3cc] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-[#00b3cc] transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services')} className="hover:text-[#00b3cc] transition-colors">
                  Services Catalog
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/catalog')} className="hover:text-[#00b3cc] transition-colors">
                  Portfolio & Work
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/faqs')} className="hover:text-[#00b3cc] transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/privacy-terms')} className="hover:text-[#00b3cc] transition-colors">
                  Privacy & Terms
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="hover:text-[#00b3cc] transition-colors">
                  Contact Agency
                </button>
              </li>
            </ul>
          </div>

          {/* Services Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#0f172a] mb-4">
              Core Services
            </h4>
            <ul className="space-y-2.5 text-sm text-[#475569]">
              <li>
                <button
                  onClick={() => handleNav('/services/website-development')}
                  className="hover:text-[#00b3cc] transition-colors text-left"
                >
                  WordPress Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/services/website-development')}
                  className="hover:text-[#00b3cc] transition-colors text-left"
                >
                  Custom MERN & PHP Web Apps
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/services/ai-agent-chatbot')}
                  className="hover:text-[#00b3cc] transition-colors text-left"
                >
                  24/7 AI Chatbots
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/services/ai-agent-chatbot')}
                  className="hover:text-[#00b3cc] transition-colors text-left"
                >
                  AI Voice Calling Agents
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/services/ai-automation')}
                  className="hover:text-[#00b3cc] transition-colors text-left"
                >
                  AI Automation with n8n
                </button>
              </li>
            </ul>
          </div>

          {/* Tech Stack Trust */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#0f172a] mb-4">
              Built With
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#475569]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00b3cc]" /> WordPress & PHP/MySQL
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00b3cc]" /> MERN Stack (React, Node)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00b3cc]" /> n8n Automation Workflows
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00b3cc]" /> Gemini & Voice AI Agents
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00b3cc]" /> Netlify & Cloud Deployment
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#475569] gap-4">
          <div>
            © {new Date().getFullYear()} Digital Waves Agency. All rights reserved. "We Build Your Website. You Ride the Wave of Growth."
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('/privacy-terms')} className="hover:text-[#00b3cc]">
              Privacy & Terms
            </button>
            <button onClick={() => handleNav('/faqs')} className="hover:text-[#00b3cc]">
              FAQs
            </button>
            <button onClick={() => handleNav('/contact')} className="hover:text-[#00b3cc] font-bold text-[#00b3cc]">
              Get Free Quote
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
