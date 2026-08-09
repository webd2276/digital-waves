import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

const baseUrl = (process.env.URL || process.env.APP_URL || 'https://digitalwavesz.netlify.app').replace(/\/$/, '');
const lastmod = new Date().toISOString().split('T')[0];

const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/website-development', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/ai-agent-chatbot', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/ai-automation', priority: '0.7', changefreq: 'monthly' },
  { path: '/catalog', priority: '0.8', changefreq: 'monthly' },
  { path: '/faqs', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy-terms', priority: '0.3', changefreq: 'yearly' },
];

const urlEntries = routes
  .map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${path === '/' ? '/' : path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);
writeFileSync(join(publicDir, 'robots.txt'), robots);

console.log(`Generated sitemap for ${baseUrl}`);
