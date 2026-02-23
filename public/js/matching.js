/* ============================================
   UAE Culture Quest — Memory Matching Game
   Flip cards, find matching pairs
   ============================================ */

const MATCH_ITEMS = [
  { emoji: '🏗️', label: 'Burj Khalifa' },
  { emoji: '🕌', label: 'Grand Mosque' },
  { emoji: '🦅', label: 'Falcon' },
  { emoji: '🐫', label: 'Camel' },
  { emoji: '🌴', label: 'Palm Tree' },
  { emoji: '🤿', label: 'Pearl Diving' },
  { emoji: '☕', label: 'Arabic Coffee' },
  { emoji: '🇦🇪', label: 'UAE Flag' },
  { emoji: '🖼️', label: 'Dubai Frame' },
  { emoji: '🔮', label: 'Museum' },
  { emoji: '🍛', label: 'Machboos' },
  { emoji: '🍩', label: 'Luqaimat' },
];

let matchCards = [];
let firstCard = null;
let secondCard = null;
let matchMoves = 0;
let matchPairsFound = 0;
let matchTotalPairs = 8;
let matchLocked = false;
let matchTimer = null;
let matchSeconds = 0;

function startMatching() {
  document.getElementById('matchStart').style.display = 'none';
  document.getElementById('matchArea').style.display = 'block';

  matchMoves = 0;
  matchPairsFound = 0;
  matchSeconds = 0;
  firstCard = null;
  secondCard = null;
  matchLocked = false;

  // Pick 8 random items
  const shuffled = [...MATCH_ITEMS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, matchTotalPairs);

  // Create pairs (duplicate each)
  matchCards = [];
  selected.forEach((item, idx) => {
    matchCards.push({ ...item, pairId: idx });
    matchCards.push({ ...item, pairId: idx });
  });

  // Shuffle pairs
  matchCards.sort(() => Math.random() - 0.5);

  // Render grid
  const grid = document.getElementById('matchingGrid');
  grid.innerHTML = '';

  matchCards.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'match-card';
    cardEl.dataset.index = index;
    cardEl.dataset.pairId = card.pairId;
    cardEl.innerHTML = `
      <div class="match-card-front">
        <div class="match-card-emoji">${card.emoji}</div>
        <div class="match-card-label">${card.label}</div>
      </div>
      <div class="match-card-back">🇦🇪</div>
    `;
    cardEl.onclick = () => flipMatchCard(cardEl);
    grid.appendChild(cardEl);
  });

  // Update display
  document.getElementById('matchMoves').textContent = '0';
  document.getElementById('matchPairs').textContent = '0';
  document.getElementById('matchTotal').textContent = matchTotalPairs;

  // Start timer
  if (matchTimer) clearInterval(matchTimer);
  matchTimer = setInterval(() => {
    matchSeconds++;
    const min = Math.floor(matchSeconds / 60);
    const sec = matchSeconds % 60;
    document.getElementById('matchTime').textContent =
      `${min}:${sec.toString().padStart(2, '0')}`;
  }, 1000);
}

function flipMatchCard(cardEl) {
  if (matchLocked) return;
  if (cardEl.classList.contains('flipped')) return;
  if (cardEl.classList.contains('matched')) return;

  cardEl.classList.add('flipped');
  playSound('flip');

  if (!firstCard) {
    firstCard = cardEl;
    return;
  }

  secondCard = cardEl;
  matchMoves++;
  document.getElementById('matchMoves').textContent = matchMoves;
  matchLocked = true;

  // Check match
  if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
    // Match found!
    playSound('match');
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    if (typeof Mascot !== 'undefined') Mascot.onCorrect();
    matchPairsFound++;
    document.getElementById('matchPairs').textContent = matchPairsFound;

    firstCard = null;
    secondCard = null;
    matchLocked = false;

    // Check win
    if (matchPairsFound === matchTotalPairs) {
      clearInterval(matchTimer);
      setTimeout(() => {
        // Score based on moves: perfect = 16 moves (2 per pair)
        const minMoves = matchTotalPairs * 2;
        const maxReasonable = matchTotalPairs * 4;
        const moveScore = Math.max(0, maxReasonable - matchMoves);
        const total = maxReasonable - minMoves;
        showResults('Memory Game Complete!', moveScore, total, 'matching');
      }, 500);
    }
  } else {
    // No match — flip back
    playSound('wrong');
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard = null;
      secondCard = null;
      matchLocked = false;
    }, 800);
  }
}
