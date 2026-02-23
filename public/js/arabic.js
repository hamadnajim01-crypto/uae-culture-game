/* ============================================
   UAE Culture Quest — Arabic Learning + Memory Game
   Learn Arabic words with flip cards and memory matching
   ============================================ */

// ===== LEARNING CARDS =====
function revealArabic(card) {
  card.classList.toggle('revealed');

  // Simple pronunciation simulation using speech synthesis
  if (card.classList.contains('revealed')) {
    const transliteration = card.querySelector('.arabic-transliteration').textContent;
    const meaning = card.querySelector('.arabic-meaning').textContent;
    playSound('flip');
    showNotification(`${transliteration} = ${meaning}`, 2000);
  }
}

// ===== ARABIC MEMORY GAME =====
// Match Arabic word to its English meaning

let arabicCards = [];
let arabicFirst = null;
let arabicSecond = null;
let arabicMoves = 0;
let arabicPairs = 0;
let arabicLocked = false;
const ARABIC_TOTAL_PAIRS = 8;

async function startArabicMemory() {
  document.getElementById('arabicStartBtn').style.display = 'none';
  document.getElementById('arabicStats').style.display = 'flex';

  arabicMoves = 0;
  arabicPairs = 0;
  arabicFirst = null;
  arabicSecond = null;
  arabicLocked = false;

  // Fetch words
  let words;
  try {
    const res = await fetch('/api/arabic-words');
    words = await res.json();
  } catch (e) {
    showNotification('Failed to load words');
    return;
  }

  // Pick 8 random words
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, ARABIC_TOTAL_PAIRS);

  // Create card pairs: Arabic card + English meaning card
  arabicCards = [];
  selected.forEach((word, idx) => {
    // Arabic side
    arabicCards.push({
      pairId: idx,
      type: 'arabic',
      display: word.word,
      sub: word.transliteration,
      emoji: word.emoji,
    });
    // English side
    arabicCards.push({
      pairId: idx,
      type: 'english',
      display: word.meaning,
      sub: word.emoji,
      emoji: word.emoji,
    });
  });

  // Shuffle
  arabicCards.sort(() => Math.random() - 0.5);

  // Render grid
  const grid = document.getElementById('arabicMemoryGrid');
  grid.innerHTML = '';

  arabicCards.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'arabic-memory-card';
    cardEl.dataset.index = index;
    cardEl.dataset.pairId = card.pairId;
    cardEl.dataset.type = card.type;

    // Initially show a question mark
    cardEl.innerHTML = `
      <div class="card-hidden" style="font-size: 2rem;">❓</div>
      <div class="card-content" style="display:none; text-align:center;">
        <div style="font-size: ${card.type === 'arabic' ? '1.8rem' : '1.2rem'};
                    font-family: ${card.type === 'arabic' ? "'Cairo', sans-serif" : "'Fredoka', sans-serif"};
                    color: ${card.type === 'arabic' ? '#D4A24E' : '#3B82F6'};">
          ${card.display}
        </div>
        <div style="font-size: 0.8rem; color: #6B7280; margin-top: 4px;">
          ${card.sub}
        </div>
      </div>
    `;

    cardEl.onclick = () => flipArabicCard(cardEl);
    grid.appendChild(cardEl);
  });

  // Update display
  document.getElementById('arabicMoves').textContent = '0';
  document.getElementById('arabicPairs').textContent = '0';
}

function flipArabicCard(cardEl) {
  if (arabicLocked) return;
  if (cardEl.classList.contains('flipped')) return;
  if (cardEl.classList.contains('matched')) return;

  // Flip the card
  cardEl.classList.add('flipped');
  cardEl.querySelector('.card-hidden').style.display = 'none';
  cardEl.querySelector('.card-content').style.display = 'block';
  playSound('flip');

  if (!arabicFirst) {
    arabicFirst = cardEl;
    return;
  }

  arabicSecond = cardEl;
  arabicMoves++;
  document.getElementById('arabicMoves').textContent = arabicMoves;
  arabicLocked = true;

  // Check: must be same pairId but different type (arabic + english)
  const sameGroup = arabicFirst.dataset.pairId === arabicSecond.dataset.pairId;
  const diffType = arabicFirst.dataset.type !== arabicSecond.dataset.type;

  if (sameGroup && diffType) {
    // Match!
    playSound('match');
    arabicFirst.classList.add('matched');
    arabicSecond.classList.add('matched');
    arabicPairs++;
    document.getElementById('arabicPairs').textContent = arabicPairs;

    arabicFirst = null;
    arabicSecond = null;
    arabicLocked = false;

    // Check win
    if (arabicPairs === ARABIC_TOTAL_PAIRS) {
      setTimeout(() => {
        const minMoves = ARABIC_TOTAL_PAIRS;
        const maxReasonable = ARABIC_TOTAL_PAIRS * 3;
        const moveScore = Math.max(0, maxReasonable - arabicMoves);
        const total = maxReasonable - minMoves;
        showResults('Arabic Memory Complete!', moveScore, total, 'arabic');
      }, 500);
    }
  } else {
    // No match
    playSound('wrong');
    setTimeout(() => {
      arabicFirst.classList.remove('flipped');
      arabicFirst.querySelector('.card-hidden').style.display = 'block';
      arabicFirst.querySelector('.card-content').style.display = 'none';

      arabicSecond.classList.remove('flipped');
      arabicSecond.querySelector('.card-hidden').style.display = 'block';
      arabicSecond.querySelector('.card-content').style.display = 'none';

      arabicFirst = null;
      arabicSecond = null;
      arabicLocked = false;
    }, 1000);
  }
}
