/* ============================================
   Word Scramble — Mini-Game
   Tap scrambled letters to spell UAE words
   ============================================ */

let scrambleData = [];
let scrambleCurrent = 0;
let scrambleScore = 0;
let scrambleAnswered = false;
let scrambleSelected = [];
let scrambleStartHearts = 0;

async function startScramble() {
  try {
    const res = await fetch('/api/scramble');
    scrambleData = await res.json();
  } catch (e) {
    showNotification('Failed to load words!');
    return;
  }

  scrambleCurrent = 0;
  scrambleScore = 0;
  scrambleAnswered = false;
  scrambleSelected = [];
  scrambleStartHearts = getHearts().current;

  document.getElementById('scrambleStart').style.display = 'none';
  document.getElementById('scrambleArea').style.display = 'block';

  updateStreak();
  showScrambleWord();
}

function showScrambleWord() {
  if (scrambleCurrent >= scrambleData.length) {
    finishScramble();
    return;
  }

  scrambleAnswered = false;
  scrambleSelected = [];

  const q = scrambleData[scrambleCurrent];
  const total = scrambleData.length;

  // Progress
  document.getElementById('scrambleProgressFill').style.width = ((scrambleCurrent / total) * 100) + '%';
  document.getElementById('scrambleProgressText').textContent = `${scrambleCurrent + 1}/${total}`;
  document.getElementById('scrambleScore').textContent = `SCORE: ${scrambleScore}`;

  // Hearts
  const heartsEl = document.getElementById('scrambleHearts');
  if (heartsEl) {
    const h = getHearts();
    heartsEl.textContent = '❤️'.repeat(h.current) + '🖤'.repeat(5 - h.current);
  }

  // Hint
  document.getElementById('scrambleHint').textContent = '💡 ' + q.hint;

  // Answer slots (empty)
  updateScrambleAnswer(q.word.length);

  // Scrambled letters
  const lettersEl = document.getElementById('scrambleLetters');
  lettersEl.innerHTML = '';

  // Scramble the word's letters
  const letters = q.word.toUpperCase().split('');
  const scrambled = [...letters].sort(() => Math.random() - 0.5);

  // Prevent identical order
  if (scrambled.join('') === letters.join('')) {
    const temp = scrambled[0];
    scrambled[0] = scrambled[scrambled.length - 1];
    scrambled[scrambled.length - 1] = temp;
  }

  scrambled.forEach((letter, idx) => {
    const tile = document.createElement('button');
    tile.className = 'scramble-tile';
    tile.textContent = letter;
    tile.dataset.index = idx;
    tile.onclick = () => tapScrambleLetter(tile, letter);
    lettersEl.appendChild(tile);
  });

  // Hide fact & next
  document.getElementById('scrambleFact').style.display = 'none';
  document.getElementById('scrambleNextBtn').style.display = 'none';

  // Mascot thinks while player unscrambles
  if (typeof Mascot !== 'undefined') Mascot.onThink();

  // Animate
  const card = document.getElementById('scrambleCard');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'fadeUp 0.4s ease';
}

function tapScrambleLetter(tile, letter) {
  if (scrambleAnswered || tile.classList.contains('used')) return;

  const q = scrambleData[scrambleCurrent];

  tile.classList.add('used');
  scrambleSelected.push({ tile, letter });

  playSound('flip');

  updateScrambleAnswer(q.word.length);
}

function updateScrambleAnswer(wordLength) {
  const answerEl = document.getElementById('scrambleAnswer');
  answerEl.innerHTML = '';

  for (let i = 0; i < wordLength; i++) {
    const slot = document.createElement('span');
    slot.className = 'scramble-slot';
    if (scrambleSelected[i]) {
      slot.textContent = scrambleSelected[i].letter;
      slot.classList.add('filled');
    } else {
      slot.textContent = '_';
    }
    answerEl.appendChild(slot);
  }
}

function clearScramble() {
  if (scrambleAnswered) return;

  // Reset all tiles
  scrambleSelected.forEach(item => {
    item.tile.classList.remove('used');
  });
  scrambleSelected = [];

  const q = scrambleData[scrambleCurrent];
  updateScrambleAnswer(q.word.length);
}

function checkScramble() {
  if (scrambleAnswered) return;

  const q = scrambleData[scrambleCurrent];
  const userAnswer = scrambleSelected.map(s => s.letter).join('');

  if (userAnswer.length < q.word.length) {
    // Not enough letters selected
    const answerEl = document.getElementById('scrambleAnswer');
    answerEl.classList.add('shake');
    setTimeout(() => answerEl.classList.remove('shake'), 500);
    return;
  }

  scrambleAnswered = true;
  const isCorrect = userAnswer.toUpperCase() === q.word.toUpperCase();

  const answerEl = document.getElementById('scrambleAnswer');

  if (isCorrect) {
    answerEl.classList.add('scramble-correct');
    scrambleScore++;
    playSound('correct');
    addXP(10);
    if (typeof Mascot !== 'undefined') Mascot.onCorrect();
  } else {
    answerEl.classList.add('scramble-wrong');
    playSound('wrong');
    loseHeart();
    if (typeof Mascot !== 'undefined') Mascot.onWrong();

    // Show correct answer after a moment
    setTimeout(() => {
      answerEl.innerHTML = '';
      q.word.toUpperCase().split('').forEach(letter => {
        const slot = document.createElement('span');
        slot.className = 'scramble-slot filled correct-letter';
        slot.textContent = letter;
        answerEl.appendChild(slot);
      });
    }, 800);
  }

  document.getElementById('scrambleScore').textContent = `SCORE: ${scrambleScore}`;

  // Show fact
  if (q.fact) {
    const factEl = document.getElementById('scrambleFact');
    factEl.textContent = '💡 ' + q.fact;
    factEl.style.display = 'block';
  }

  // Show next
  const nextBtn = document.getElementById('scrambleNextBtn');
  nextBtn.textContent = scrambleCurrent < scrambleData.length - 1 ? 'NEXT →' : 'SEE RESULTS 🏆';
  nextBtn.style.display = 'inline-flex';

  // Update hearts
  const heartsEl = document.getElementById('scrambleHearts');
  if (heartsEl) {
    const h = getHearts();
    heartsEl.textContent = '❤️'.repeat(h.current) + '🖤'.repeat(5 - h.current);
  }
}

function nextScrambleWord() {
  if (!hasHearts()) return;
  scrambleCurrent++;
  showScrambleWord();
}

function finishScramble() {
  const total = scrambleData.length;
  addXP(50);
  if (scrambleScore === total) addXP(25);
  markNodeComplete('scramble');

  if (getHearts().current === scrambleStartHearts) awardAchievement('no_hearts_lost');
  if (scrambleScore === total) awardAchievement('perfect_score');

  showResults('Word Scramble Complete!', scrambleScore, total, 'scramble');
}
