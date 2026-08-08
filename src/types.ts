export type RoutePath = 
  | '/'
  | '/about'
  | '/services'
  | '/services/website-development'
  | '/services/ai-agent-chatbot'
  | '/services/ai-automation'
  | '/catalog'
  | '/faqs'
  | '/privacy-terms'
  | '/contact';

export type ServiceCategory = 'Website Development' | 'AI Agents & Chatbots' | 'AI Automation';

export interface PortfolioProject {
  id: string;
  title: string;
  category: ServiceCategory;
  shortDesc: string;
  fullDesc: string;
  client: string;
  timeline: string;
  impactMetrics: string[];
  techStack: string[];
  image: string;
  featured?: boolean;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  stars: number;
  projectType: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
}
