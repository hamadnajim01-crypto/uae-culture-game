/* merge-content.js — Merges expanded content files into uae-content.json */
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, 'data');

// Load expansion files
const files = ['expand-learning.json', 'expand-arabic.json', 'expand-quiz.json', 'expand-game.json'];
const parts = {};
for (const f of files) {
  const fp = path.join(DATA, f);
  if (!fs.existsSync(fp)) { console.log('  MISSING:', f); continue; }
  try {
    const d = JSON.parse(fs.readFileSync(fp, 'utf-8'));
    Object.assign(parts, d);
    console.log('  Loaded:', f, '— keys:', Object.keys(d).join(', '));
  } catch(e) { console.log('  ERROR parsing', f, ':', e.message); }
}

// Build final merged data
const merged = {
  landmarks: parts.landmarks || [],
  traditions: parts.traditions || [],
  foods: parts.foods || [],
  arabicWords: parts.arabicWords || [],
  quizQuestions: parts.quizQuestions || [],
  sectionQuizzes: parts.sectionQuizzes || {},
  fillInTheBlank: parts.fillInTheBlank || [],
  trueFalse: parts.trueFalse || [],
  listeningChallenge: parts.listeningChallenge || [],
  wordScramble: parts.wordScramble || [],
  timeline: parts.timeline || []
};

// Sort timeline by year
merged.timeline.sort((a, b) => a.year - b.year);

// Print stats
console.log('\n  === MERGED CONTENT STATS ===');
console.log('  Landmarks:', merged.landmarks.length);
console.log('  Traditions:', merged.traditions.length);
console.log('  Foods:', merged.foods.length);
console.log('  Arabic Words:', merged.arabicWords.length);
console.log('  Quiz Questions:', merged.quizQuestions.length);
console.log('  Fill in Blank:', merged.fillInTheBlank.length);
console.log('  True/False:', merged.trueFalse.length);
console.log('  Listening:', merged.listeningChallenge.length);
console.log('  Word Scramble:', merged.wordScramble.length);
console.log('  Timeline:', merged.timeline.length);
const sq = merged.sectionQuizzes;
for (const k in sq) console.log('  Section Quiz [' + k + ']:', sq[k].length);

const total = merged.landmarks.length + merged.traditions.length + merged.foods.length +
  merged.arabicWords.length + merged.quizQuestions.length + merged.fillInTheBlank.length +
  merged.trueFalse.length + merged.listeningChallenge.length + merged.wordScramble.length +
  merged.timeline.length + Object.values(sq).reduce((s, a) => s + a.length, 0);
console.log('\n  TOTAL CONTENT ITEMS:', total);

// Write
fs.writeFileSync(path.join(DATA, 'uae-content.json'), JSON.stringify(merged, null, 2));
console.log('\n  Written to data/uae-content.json\n');
