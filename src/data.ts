import { PortfolioProject, FaqItem, Testimonial } from './types';

export const FAQ_DATA: FaqItem[] = [
  {
    id: 1,
    question: "What's the difference between a WordPress site and a custom web app?",
    answer: "A WordPress site is ideal for fast, content-managed marketing sites, blogs, and standard business presence with an easy admin panel. A custom web app (built in MERN or custom PHP/MySQL) is designed for custom logic, complex user dashboards, client portals, SaaS products, and high-performance interactive tools tailored exactly to your workflow."
  },
  {
    id: 2,
    question: "How long does a typical website take to build?",
    answer: "A standard WordPress build or landing page usually ships within 1–2 weeks. Custom MERN or PHP web applications typically take 3–5 weeks depending on functional complexity and third-party API integrations."
  },
  {
    id: 3,
    question: "Do you handle hosting and deployment?",
    answer: "Yes, completely! We configure production hosting on Netlify, Vercel, AWS, Cloud Run, or your existing host of choice, set up custom domains, free SSL certificates, and configure automated deployment pipelines so your site stays updated effortlessly."
  },
  {
    id: 4,
    question: "What's an AI calling agent and how is it different from a chatbot?",
    answer: "An AI chatbot handles text-based messaging on your website or WhatsApp 24/7. An AI calling agent is a voice-based AI assistant that physically answers or places phone calls, speaks naturally with callers, qualifies prospective leads, and directly schedules bookings on your Google Calendar."
  },
  {
    id: 5,
    question: "Can you connect our existing tools (Google Sheets, CRM) into an automation?",
    answer: "Absolutely. We specialize in building custom n8n workflows that seamlessly bridge Google Forms, Google Sheets, HubSpot, Salesforce, Slack, Gmail, and custom databases without requiring manual copy-pasting."
  },
  {
    id: 6,
    question: "Do we need technical knowledge to manage the site after launch?",
    answer: "Not at all. For WordPress, we provide intuitive visual editors. For custom web apps, we build streamlined admin dashboards and provide complete video walkthroughs along with documentation so your team can easily update content."
  },
  {
    id: 7,
    question: "What does the n8n automation setup process look like?",
    answer: "We begin with a brief discovery call to map your current manual steps. Next, we design and test the automated n8n workflow in a staging environment, connect your OAuth accounts, verify edge cases, and deploy live with automated error alerting."
  },
  {
    id: 8,
    question: "Can you redesign an existing website instead of building from scratch?",
    answer: "Yes! We frequently migrate legacy, slow websites to modern responsive frameworks or WordPress builds, preserving your existing SEO rankings, backlink juice, and domain authority while completely overhauling the visual identity and speed."
  },
  {
    id: 9,
    question: "What's included in ongoing support after launch?",
    answer: "Every project includes 30 days of post-launch hands-on support for bug fixes, performance tuning, and minor adjustments. We also offer monthly maintenance packages for security updates, hosting monitoring, and ongoing feature enhancements."
  },
  {
    id: 10,
    question: "How do we get started and what do you need from us first?",
    answer: "Simply submit our quick contact form or request a quote! We'll reach out within one business day with a clear proposal. All we need to start is your core branding materials (or ideas), desired feature list, and any existing content."
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "vapes4less-co-uk",
    title: "Vapes4Less UK Storefront",
    category: "Website Development",
    shortDesc: "Retail e-commerce homepage for a vape brand with a bold product-led hero and clear navigation.",
    fullDesc: "Vapes4Less is a product-focused online storefront designed to present disposable vapes, offers, and shopping categories in a clean, conversion-friendly layout. The redesign emphasizes strong branding, fast browsing, and a storefront experience built for online retail customers.",
    client: "vapes4less.co.uk",
    timeline: "Website Redesign",
    impactMetrics: ["E-Commerce Retail Layout", "Strong Product Visibility", "Mobile-Responsive Storefront"],
    techStack: ["WordPress", "E-Commerce", "Custom Theme", "Responsive UI"],
    image: "/portfolio/vape4less.png",
    featured: true
  },
  {
    id: "themobilemasters-com",
    title: "The Mobile Masters Store",
    category: "Website Development",
    shortDesc: "Electronics storefront with a clean search-oriented header and category-first shopping structure.",
    fullDesc: "The Mobile Masters website presents a broad electronics catalog with a practical shopping interface, strong product discovery, and a modern retail layout. The structure is designed to help customers browse categories quickly while keeping the brand presentation professional and trustworthy.",
    client: "themobilemasters.com",
    timeline: "Website Redesign",
    impactMetrics: ["Catalog-Friendly Navigation", "Conversion-Focused Structure", "Desktop & Mobile Optimized"],
    techStack: ["WordPress", "E-Commerce", "Custom Frontend", "SEO Structure"],
    image: "/portfolio/themobilemaster.png",
    featured: true
  },
  {
    id: "laforge-com-pk",
    title: "La Forge Luxury Fragrance Store",
    category: "Website Development",
    shortDesc: "Luxury fragrance storefront with a clean shopping-focused homepage and polished product presentation.",
    fullDesc: "La Forge is a refined fragrance brand website built to showcase premium products with a minimal, high-end feel. The layout emphasizes elegant visuals, clear navigation, and a storefront experience that supports brand storytelling and product discovery.",
    client: "laforge.com.pk",
    timeline: "Website Redesign",
    impactMetrics: ["Premium Brand Presentation", "Mobile-Responsive Layout", "E-Commerce Ready Structure"],
    techStack: ["WordPress", "Custom Theme", "Responsive UI", "E-Commerce"],
    image: "/portfolio/laforge.png",
    featured: true
  },
  {
    id: "fourteenstartravels-ae",
    title: "Fourteen Star Travels",
    category: "Website Development",
    shortDesc: "Travel agency website with a destination-led hero section and booking-oriented brand experience.",
    fullDesc: "Fourteen Star Travels is a travel and tourism website designed to highlight UAE services with a bold skyline hero, clear service navigation, and a professional booking-focused presentation for customers exploring tours and travel support.",
    client: "fourteenstartravels.ae",
    timeline: "Website Redesign",
    impactMetrics: ["Travel Brand Identity", "Lead-Friendly Layout", "Desktop & Mobile Friendly"],
    techStack: ["WordPress", "Custom Frontend", "SEO Structure", "Responsive Design"],
    image: "/portfolio/fourteen.png",
    featured: true
  },
  {
    id: "ai-deal-flow-email-intelligence-system",
    title: "AI Deal Flow Email Intelligence System",
    category: "AI Automation",
    shortDesc: "n8n-powered email intelligence workflow that extracts acquisition data from broker deal flow in real time.",
    fullDesc: "An enterprise-grade automation system built with n8n and Anthropic Claude that monitors broker emails, identifies acquisition opportunities, extracts financial intelligence, normalizes deal data, and stores structured records into spreadsheets or databases automatically.",
    client: "Private Acquisition Team",
    timeline: "Automation Build",
    impactMetrics: ["Real-Time Email Monitoring", "Structured Deal Intelligence", "Spreadsheet / DB Sync"],
    techStack: ["n8n", "Anthropic Claude", "Email Parsing", "Google Sheets", "Database Sync"],
    image: "/portfolio/ai-deal-flow.png",
    featured: true
  },
  {
    id: "ai-outbound-calling-system",
    title: "AI Outbound Calling System",
    category: "AI Automation",
    shortDesc: "Conversational outbound calling workflow for real estate lead qualification and homeowner outreach.",
    fullDesc: "An AI-powered outbound calling automation system built for residential real estate teams. It uses conversational voice AI to call homeowners, ask natural questions, detect seller motivation, classify lead quality, and sync call outcomes directly into Airtable for acquisition follow-up.",
    client: "Residential Acquisitions Team",
    timeline: "Automation Build",
    impactMetrics: ["Voice AI Calling", "Lead Qualification", "Airtable CRM Sync"],
    techStack: ["n8n", "Voice AI", "Airtable", "Call Routing", "Real Estate CRM"],
    image: "/portfolio/AI-Outbound-Calling-System.png",
    featured: true
  },
  {
    id: "fiduciary-architecture",
    title: "Fiduciary Architecture",
    category: "AI Automation",
    shortDesc: "Make.com business operations architecture for onboarding, document generation, storage, and team notifications.",
    fullDesc: "Fiduciary Architecture is a fully automated business workflow system built with Make.com to streamline fiduciary operations, client onboarding, CRM updates, document generation, cloud storage, team collaboration, and automated notifications into one seamless operations pipeline.",
    client: "Fiduciary Services",
    timeline: "Automation Architecture",
    impactMetrics: ["End-to-End Operations Flow", "Document Automation", "Cloud & CRM Sync"],
    techStack: ["Make.com", "HubSpot CRM", "PDFMonkey", "OneDrive", "Slack"],
    image: "/portfolio/Fiduciary-Architecture.png",
    featured: true
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Marcus Vance",
    role: "Founder & CEO",
    company: "Apex Analytics",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote: "Digital Waves delivered our web app ahead of schedule. The engineering quality, attention to speed, and 3D wave aesthetics made our brand stand out instantly.",
    stars: 5,
    projectType: "Custom Web App"
  },
  {
    id: "2",
    name: "Dr. Elena Rostova",
    role: "Clinical Director",
    company: "Zenith Care",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    quote: "Our front desk was buried in phone calls every single day. Digital Waves built an AI calling agent that handles appointment bookings 24/7 without a glitch.",
    stars: 5,
    projectType: "AI Voice Agent"
  },
  {
    id: "3",
    name: "David Chen",
    role: "Head of Operations",
    company: "OmniScale B2B",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "The n8n automations they wired up connecting our Google Forms, Sheets, and CRM saved our sales team over 15 hours a week. Truly hands-on, zero middlemen.",
    stars: 5,
    projectType: "n8n AI Automation"
  }
];
