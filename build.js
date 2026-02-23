/* build.js — Pre-renders EJS templates to static HTML in docs/ for GitHub Pages */
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'docs');
const VIEWS = path.join(__dirname, 'views');
const PUBLIC = path.join(__dirname, 'public');
const DATA = path.join(__dirname, 'data');
const BASE = '/uae-culture-game'; // GitHub Pages repo name

// Load content data
const uaeContent = JSON.parse(fs.readFileSync(path.join(DATA, 'uae-content.json'), 'utf-8'));

// Clean & create output
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// Copy static assets
copyDir(PUBLIC, OUT);

// Copy data folder for client-side API shim
copyDir(DATA, path.join(OUT, 'data'));

// Pages to render
const pages = {
  'index': { template: 'index.ejs', data: { title: 'UAE Culture Learning Kids' } },
  'landmarks': { template: 'landmarks.ejs', data: { title: 'Landmarks', landmarks: uaeContent.landmarks } },
  'traditions': { template: 'traditions.ejs', data: { title: 'Traditions', traditions: uaeContent.traditions } },
  'food': { template: 'food.ejs', data: { title: 'Traditional Food', foods: uaeContent.foods } },
  'arabic': { template: 'arabic.ejs', data: { title: 'Learn Arabic', words: uaeContent.arabicWords } },
  'quiz': { template: 'quiz.ejs', data: { title: 'Culture Quiz' } },
  'matching': { template: 'matching.ejs', data: { title: 'Match the Landmark' } },
  'fill-blank': { template: 'fill-blank.ejs', data: { title: 'Fill in the Blank' } },
  'true-false': { template: 'true-false.ejs', data: { title: 'True or False' } },
  'listening': { template: 'listening.ejs', data: { title: 'Listening Challenge' } },
  'scramble': { template: 'scramble.ejs', data: { title: 'Word Scramble' } },
  'timeline': { template: 'timeline.ejs', data: { title: 'Timeline Sort' } },
  'games': { template: 'games.ejs', data: { title: 'Games Arcade' } },
  'updates': { template: 'updates.ejs', data: { title: 'Update Log' } },
};

let count = 0;
for (const [route, cfg] of Object.entries(pages)) {
  const templatePath = path.join(VIEWS, cfg.template);

  let rendered = ejs.render(
    fs.readFileSync(templatePath, 'utf-8'),
    cfg.data,
    { filename: templatePath }
  );

  // Rewrite absolute paths for GitHub Pages subfolder
  rendered = rewritePaths(rendered);

  if (route === 'index') {
    fs.writeFileSync(path.join(OUT, 'index.html'), rendered);
  } else {
    const dir = path.join(OUT, route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), rendered);
  }
  count++;
}

// Create 404.html
const fourOhFour = rewritePaths(fs.readFileSync(path.join(OUT, 'index.html'), 'utf-8'));
fs.writeFileSync(path.join(OUT, '404.html'), fourOhFour);

// Also fix api-shim.js path to data file
const shimPath = path.join(OUT, 'js', 'api-shim.js');
let shim = fs.readFileSync(shimPath, 'utf-8');
shim = shim.replace('/data/uae-content.json', BASE + '/data/uae-content.json');
fs.writeFileSync(shimPath, shim);

console.log(`\n  Built ${count} pages to docs/ (base: ${BASE})\n`);

// --- Helpers ---

function rewritePaths(html) {
  // Rewrite href="/..." and src="/..." to include base path
  // But skip external URLs (href="https://", href="//", href="#", href="javascript:")
  return html
    .replace(/(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`)
    .replace(/fetch\('\/api\//g, `fetch('${BASE}/api/`);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
