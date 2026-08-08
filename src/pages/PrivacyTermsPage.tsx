import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RoutePath } from '../types';
import {
  ShieldCheck,
  FileText,
  Lock,
  Scale,
  CheckCircle2,
  HelpCircle,
  Mail,
  ArrowRight,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

interface PrivacyTermsPageProps {
  onNavigate: (path: RoutePath) => void;
}

export const PrivacyTermsPage: React.FC<PrivacyTermsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const [searchQuery, setSearchQuery] = useState('');

  const privacySections = [
    {
      id: 'p-1',
      title: '1. Information We Collect',
      icon: ShieldCheck,
      content: `Digital Waves Agency ("we," "our," or "us") collects information necessary to build custom web applications, WordPress platforms, and AI automation solutions. This includes:
• Contact Details: Name, business email, phone number, and company name when filling out quote forms or contacting us.
• Project Specifications: Technical requirements, design preferences, brand assets, and system credentials provided for development.
• Automated Web Analytics: Anonymous operational metrics such as device type, browser model, and page interaction timestamps to optimize our website performance.`,
    },
    {
      id: 'p-2',
      title: '2. How We Use Your Data',
      icon: Lock,
      content: `Your data is strictly utilized to engineer, deliver, and maintain your software projects:
• Engineering & Delivery: Building custom MERN/PHP web apps, WordPress themes, and AI agent workflows according to your contract.
• Communication & Support: Providing milestone updates, technical support, and post-launch maintenance.
• Security & Quality Assurance: Ensuring full data encryption, preventing unauthorized server access, and conducting code reviews.
We NEVER sell, rent, or trade client personal or corporate data to third-party advertising brokers.`,
    },
    {
      id: 'p-3',
      title: '3. AI Models & Automation Privacy',
      icon: Sparkles,
      content: `For projects incorporating AI Agents, Chatbots, or n8n Automation Workflows:
• Training Exemption: Client proprietary datasets, custom API keys, and end-user chatbot logs are processed via enterprise API endpoints configured with zero data retention for public model training.
• Confidentiality: Workflows built on n8n or custom Python/Node scripts reside on client-controlled infrastructure or isolated encrypted servers.
• Third-Party AI APIs: Integrations with Gemini, OpenAI, or voice calling providers adhere strictly to enterprise-level data processing agreements.`,
    },
    {
      id: 'p-4',
      title: '4. Data Security & Storage Practices',
      icon: CheckCircle2,
      content: `We enforce industry-standard security safeguards to protect your intellectual property:
• Encrypted Transmission: All API interactions and credentials use TLS 1.3 encryption in transit and AES-256 at rest.
• Restricted Access: Only senior engineers assigned to your project hold access keys during active development.
• Secret Management: API keys and database credentials are managed via secure environment variables, never hardcoded or committed to public code repositories.`,
    },
    {
      id: 'p-5',
      title: '5. Cookies & Tracking',
      icon: FileText,
      content: `Our website utilizes essential functional cookies to remember navigation state and session preferences. Analytical cookies assist us in understanding traffic patterns. You may disable cookies at any time through your web browser settings without losing access to core site features.`,
    },
    {
      id: 'p-6',
      title: '6. Client Rights & Data Control',
      icon: Scale,
      content: `You hold full authority over your data. Upon written request, Digital Waves Agency will:
• Provide a complete archive of any personal or project records retained in our active directory.
• Purge development staging files, temporary API logs, and access credentials once a project reaches final delivery and approval.
• Sign formal Non-Disclosure Agreements (NDAs) prior to reviewing proprietary business logic or codebases.`,
    },
  ];

  const termsSections = [
    {
      id: 't-1',
      title: '1. Service Scope & Acceptance',
      icon: Scale,
      content: `By engaging Digital Waves Agency for WordPress development, custom web applications, AI agent integration, or automation services, you agree to these Terms of Service. Individual projects are governed by detailed proposals and Statements of Work (SOW) outlining scope, milestone deadlines, and agreed deliverables.`,
    },
    {
      id: 't-2',
      title: '2. Payment Terms & Milestone Deliverables',
      icon: FileText,
      content: `• Deposit & Milestones: Projects typically follow a structured payment milestone schedule (e.g., 50% upfront deposit, 50% upon final staging approval before production handover).
• Staging & Approval: Deliverables are reviewed on secure staging environments (e.g., Cloud Run, Vercel, or client staging servers) prior to final deployment.
• Invoicing: Payments are due within 7 business days of invoice issuance unless otherwise specified in your project agreement.`,
    },
    {
      id: 't-3',
      title: '3. Intellectual Property & Code Ownership',
      icon: ShieldCheck,
      content: `• 100% Client Ownership: Upon receipt of final payment, full ownership rights to all bespoke source code, database schemas, custom WordPress themes, and design assets transfer exclusively to the client.
• Pre-existing Utilities: Open-source libraries, frameworks (React, Node, WordPress core), and standard agency boilerplate utilities remain under their respective open-source licenses.`,
    },
    {
      id: 't-4',
      title: '4. Revisions & Scope Management',
      icon: Clock,
      content: `• Included Revisions: Each milestone includes structured revision cycles as defined in your SOW to ensure full alignment with project requirements.
• Scope Adjustments: Requests for new features, additional pages, or workflow changes outside the original proposal are handled transparently via change orders with updated time and cost estimates.`,
    },
    {
      id: 't-5',
      title: '5. Bug-Free Warranty & Post-Launch SLA',
      icon: CheckCircle2,
      content: `• 30-Day Bug Fix Warranty: Digital Waves Agency provides a complimentary 30-day post-launch warranty covering any bugs or unexpected defects directly attributable to our code.
• Ongoing Maintenance: Optional monthly maintenance packages cover ongoing security patches, server monitoring, API updates, and feature enhancements.`,
    },
    {
      id: 't-6',
      title: '6. Limitation of Liability & Termination',
      icon: Lock,
      content: `• Maximum Liability: Digital Waves Agency's total financial liability under any contract is capped at the total amount paid by the client for that specific engagement.
• Mutual Termination: Either party may terminate an active project with written notice if the other party breaches material terms, with payment due for all completed work up to the date of termination.`,
    },
  ];

  const currentSections = activeTab === 'privacy' ? privacySections : termsSections;

  const filteredSections = currentSections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12 lg:py-20 bg-white min-h-screen text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-xs font-bold uppercase tracking-wider text-[#00b3cc] mb-4">
            <ShieldCheck className="w-4 h-4 text-[#00b3cc]" />
            <span>Legal Framework & Transparency</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[#0f172a] mb-4">
            Privacy Policy & <span className="text-[#00b3cc]">Terms of Service</span>
          </h1>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            Clear, straightforward terms regarding how Digital Waves Agency protects your intellectual property, handles data, and executes software deliverables.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#00b3cc]" /> Last Updated: August 2026
            </span>
            <span>•</span>
            <span>GDPR & CCPA Compliant Practices</span>
          </div>
        </div>

        {/* Tab Selection & Search Bar */}
        <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-slate-50 border border-slate-200">
          {/* Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-white text-[#0f172a] shadow-sm border border-slate-200/80 text-[#00b3cc]'
                  : 'text-[#475569] hover:text-[#0f172a] hover:bg-white/50'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${activeTab === 'privacy' ? 'text-[#00b3cc]' : ''}`} />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => setActiveTab('terms')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-white text-[#0f172a] shadow-sm border border-slate-200/80 text-[#00b3cc]'
                  : 'text-[#475569] hover:text-[#0f172a] hover:bg-white/50'
              }`}
            >
              <Scale className={`w-4 h-4 ${activeTab === 'terms' ? 'text-[#00b3cc]' : ''}`} />
              <span>Terms of Service</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policy clauses..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#00b3cc] text-[#0f172a]"
            />
          </div>
        </div>

        {/* Content Section List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredSections.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold">No legal clauses match your query.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-[#00b3cc] font-bold hover:underline"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-[#00b3cc]/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00e5ff]/10 text-[#00b3cc] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#0f172a]">
                      {sec.title}
                    </h3>
                  </div>

                  <div className="text-xs sm:text-sm text-[#475569] leading-relaxed whitespace-pre-line pl-0 sm:pl-13">
                    {sec.content}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Contact Legal CTA Banner */}
        <div className="max-w-4xl mx-auto mt-16 p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#00e5ff]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#00e5ff]">
                <Mail className="w-3.5 h-3.5" /> Direct Legal & Engineering Inquiries
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                Have specific questions about custom NDAs or project SLAs?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Our leadership team provides custom Non-Disclosure Agreements (NDAs), master service agreements, and security compliance documentation upon request.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/contact')}
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-[#00e5ff] text-[#0f172a] font-display font-bold text-xs sm:text-sm hover:bg-[#00b3cc] hover:text-white transition-all shadow-lg cursor-pointer"
            >
              <span>Contact Legal Team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
