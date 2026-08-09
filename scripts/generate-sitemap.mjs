import { execSync } from 'child_process';
import { statSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

const baseUrl = (process.env.URL || process.env.APP_URL || 'https://digitalwavesz.netlify.app').replace(/\/$/, '');

const routes = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly',
    sources: [
      'src/pages/HomePage.tsx',
      'src/data.ts',
      'src/components/hero/HeroBuilderScene.tsx',
      'src/components/preloader/HomePreloader.tsx',
    ],
  },
  { path: '/about', priority: '0.8', changefreq: 'monthly', sources: ['src/pages/AboutPage.tsx'] },
  { path: '/services', priority: '0.9', changefreq: 'monthly', sources: ['src/pages/ServicesCatalogPage.tsx'] },
  {
    path: '/services/website-development',
    priority: '0.7',
    changefreq: 'monthly',
    sources: ['src/pages/ServiceWebDevPage.tsx'],
  },
  {
    path: '/services/ai-agent-chatbot',
    priority: '0.7',
    changefreq: 'monthly',
    sources: ['src/pages/ServiceAiAgentPage.tsx'],
  },
  {
    path: '/services/ai-automation',
    priority: '0.7',
    changefreq: 'monthly',
    sources: ['src/pages/ServiceAiAutomationPage.tsx'],
  },
  {
    path: '/catalog',
    priority: '0.8',
    changefreq: 'monthly',
    sources: ['src/pages/PortfolioCatalogPage.tsx', 'src/data.ts'],
  },
  {
    path: '/faqs',
    priority: '0.6',
    changefreq: 'monthly',
    sources: ['src/pages/FaqsPage.tsx', 'src/data.ts'],
  },
  { path: '/contact', priority: '0.8', changefreq: 'monthly', sources: ['src/pages/ContactPage.tsx'] },
  {
    path: '/privacy-terms',
    priority: '0.3',
    changefreq: 'yearly',
    sources: ['src/pages/PrivacyTermsPage.tsx'],
  },
];

function getSourceLastMod(relativePath) {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${relativePath}"`, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (iso) {
      return iso.split('T')[0];
    }
  } catch {
    // Fall back to filesystem mtime when git history is unavailable.
  }

  try {
    return statSync(join(root, relativePath)).mtime.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

function getRouteLastMod(sources) {
  const dates = sources.map(getSourceLastMod).filter(Boolean);
  if (dates.length === 0) {
    return null;
  }

  return dates.sort().at(-1);
}

const routeLastMods = routes.map(({ path, sources }) => ({
  path,
  lastmod: getRouteLastMod(sources),
}));

const uniqueLastMods = new Set(routeLastMods.map(({ lastmod }) => lastmod).filter(Boolean));
const includeLastMod = uniqueLastMods.size > 1;

const urlEntries = routes
  .map(({ path, priority, changefreq, sources }) => {
    const lastmod = includeLastMod ? getRouteLastMod(sources) : null;
    const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';

    return `  <url>
    <loc>${baseUrl}${path === '/' ? '/' : path}</loc>${lastmodLine}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
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

const lastmods = routeLastMods.map(({ path, lastmod }) => `${path}: ${lastmod ?? 'unknown'}`);
console.log(`Generated sitemap for ${baseUrl}`);
console.log(includeLastMod ? 'Including per-route lastmod tags.' : 'Omitting lastmod tags (all routes share the same date).');
console.log(lastmods.join('\n'));
