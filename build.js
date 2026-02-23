/* build.js — Pre-renders EJS templates to static HTML in docs/ for GitHub Pages */
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'docs');
const VIEWS = path.join(__dirname, 'views');
const PUBLIC = path.join(__dirname, 'public');
const DATA = path.join(__dirname, 'data');

// Load content data
const uaeContent = JSON.parse(fs.readFileSync(path.join(DATA, 'uae-content.json'), 'utf-8'));

// Clean & create output
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// Copy static assets
copyDir(PUBLIC, OUT);

// Copy data folder for client-side API shim
copyDir(DATA, path.join(OUT, 'data'));

// Pages to render — { route: { template, data } }
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
  const html = ejs.renderFile ? null : null; // use sync render

  const rendered = ejs.render(
    fs.readFileSync(templatePath, 'utf-8'),
    cfg.data,
    { filename: templatePath } // needed for includes to resolve
  );

  if (route === 'index') {
    // index.html at root
    fs.writeFileSync(path.join(OUT, 'index.html'), rendered);
  } else {
    // Create route/index.html so /landmarks works without .html
    const dir = path.join(OUT, route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), rendered);
  }
  count++;
}

// Create 404.html (copy of index for SPA fallback)
fs.copyFileSync(path.join(OUT, 'index.html'), path.join(OUT, '404.html'));

console.log(`\n  Built ${count} pages to docs/\n`);

// --- Helper ---
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
