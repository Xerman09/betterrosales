const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const outDir = path.join(process.cwd(), 'dist');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const files = [
  'index.html',
  '403.html',
  '404.html',
  '500.html',
  'offline.html',
  'manifest.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'sw.js',
  'version.json',
];

const dirs = [
  'accessibility',
  'assets',
  'budget',
  'contact',
  'data',
  'faq',
  'government',
  'legislative',
  'news',
  'privacy',
  'service-details',
  'services',
  'sitemap',
  'statistics',
  'terms',
];

for (const f of files) {
  const src = path.join(repoRoot, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outDir, f));
  }
}

for (const d of dirs) {
  const src = path.join(repoRoot, d);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(outDir, d), { recursive: true });
  }
}

console.log('Vercel static build copied from', repoRoot, 'to', outDir);
