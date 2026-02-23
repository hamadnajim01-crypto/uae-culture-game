const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Load UAE content data
const uaeContent = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'uae-content.json'), 'utf-8')
);

// In-memory score storage
const playerScores = {};

// ============= PAGES =============

app.get('/', (req, res) => {
  res.render('index', { title: 'UAE Culture Learning Kids' });
});

app.get('/landmarks', (req, res) => {
  res.render('landmarks', { title: 'Landmarks', landmarks: uaeContent.landmarks });
});

app.get('/traditions', (req, res) => {
  res.render('traditions', { title: 'Traditions', traditions: uaeContent.traditions });
});

app.get('/food', (req, res) => {
  res.render('food', { title: 'Traditional Food', foods: uaeContent.foods });
});

app.get('/quiz', (req, res) => {
  res.render('quiz', { title: 'Culture Quiz' });
});

app.get('/arabic', (req, res) => {
  res.render('arabic', { title: 'Learn Arabic', words: uaeContent.arabicWords });
});

app.get('/matching', (req, res) => {
  res.render('matching', { title: 'Match the Landmark' });
});

app.get('/fill-blank', (req, res) => {
  res.render('fill-blank', { title: 'Fill in the Blank' });
});

app.get('/true-false', (req, res) => {
  res.render('true-false', { title: 'True or False' });
});

app.get('/listening', (req, res) => {
  res.render('listening', { title: 'Listening Challenge' });
});

app.get('/scramble', (req, res) => {
  res.render('scramble', { title: 'Word Scramble' });
});

app.get('/timeline', (req, res) => {
  res.render('timeline', { title: 'Timeline Sort' });
});

app.get('/games', (req, res) => {
  res.render('games', { title: 'Games Arcade' });
});

app.get('/updates', (req, res) => {
  res.render('updates', { title: 'Update Log' });
});

// ============= API ENDPOINTS =============

app.get('/api/quiz-questions', (req, res) => {
  const shuffled = [...uaeContent.quizQuestions].sort(() => Math.random() - 0.5);
  res.json(shuffled.slice(0, 10));
});

app.get('/api/landmarks', (req, res) => {
  res.json(uaeContent.landmarks);
});

app.get('/api/arabic-words', (req, res) => {
  res.json(uaeContent.arabicWords);
});

app.get('/api/foods', (req, res) => {
  res.json(uaeContent.foods);
});

app.get('/api/section-quiz/:section', (req, res) => {
  const section = req.params.section;
  const questions = uaeContent.sectionQuizzes && uaeContent.sectionQuizzes[section];
  if (!questions) {
    return res.status(404).json({ error: 'Section not found' });
  }
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  res.json(shuffled);
});

app.get('/api/fill-blank', (req, res) => {
  const shuffled = [...uaeContent.fillInTheBlank].sort(() => Math.random() - 0.5);
  res.json(shuffled.slice(0, 10));
});

app.get('/api/true-false', (req, res) => {
  const shuffled = [...uaeContent.trueFalse].sort(() => Math.random() - 0.5);
  res.json(shuffled.slice(0, 15));
});

app.get('/api/listening', (req, res) => {
  const shuffled = [...uaeContent.listeningChallenge].sort(() => Math.random() - 0.5);
  res.json(shuffled.slice(0, 10));
});

app.get('/api/scramble', (req, res) => {
  const shuffled = [...uaeContent.wordScramble].sort(() => Math.random() - 0.5);
  res.json(shuffled.slice(0, 10));
});

app.get('/api/timeline', (req, res) => {
  const shuffled = [...uaeContent.timeline].sort(() => Math.random() - 0.5);
  res.json(shuffled.slice(0, 8));
});

app.post('/api/score', (req, res) => {
  const { playerName, game, score, total } = req.body;
  if (!playerName || !game) {
    return res.status(400).json({ error: 'Missing playerName or game' });
  }

  if (!playerScores[playerName]) {
    playerScores[playerName] = { totalStars: 0, games: {} };
  }

  const stars = Math.ceil((score / total) * 3);
  playerScores[playerName].games[game] = { score, total, stars, date: new Date() };

  let totalStars = 0;
  for (const g of Object.values(playerScores[playerName].games)) {
    totalStars += g.stars;
  }
  playerScores[playerName].totalStars = totalStars;

  res.json({ stars, totalStars });
});

app.get('/api/scores/:playerName', (req, res) => {
  const data = playerScores[req.params.playerName];
  res.json(data || { totalStars: 0, games: {} });
});

// ============= START SERVER =============

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   🇦🇪  UAE Culture Learning Kids          ║');
  console.log('  ║   Server is running!                     ║');
  console.log(`  ║   → http://localhost:${PORT}                ║`);
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n  ❌ Port ${PORT} is already in use!`);
    console.log(`  Trying port ${PORT + 1}...\n`);
    app.listen(PORT + 1, '0.0.0.0', () => {
      console.log(`  ✅ Running on http://localhost:${PORT + 1}\n`);
    });
  } else {
    console.error('Server error:', err);
  }
});
