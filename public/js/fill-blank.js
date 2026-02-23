/* ============================================
   Fill in the Blank — Mini-Game
   Complete sentences about UAE culture
   ============================================ */

let fillData = [];
let fillCurrent = 0;
let fillScore = 0;
let fillAnswered = false;
let fillStartHearts = 0;

async function startFillBlank() {
  try {
    const res = await fetch('/api/fill-blank');
    fillData = await res.json();
  } catch (e) {
    showNotification('Failed to load questions!');
    return;
  }

  fillCurrent = 0;
  fillScore = 0;
  fillAnswered = false;
  fillStartHearts = getHearts().current;

  document.getElementById('fillStart').style.display = 'none';
  document.getElementById('fillArea').style.display = 'block';

  updateStreak();
  showFillQuestion();
}

function showFillQuestion() {
  if (fillCurrent >= fillData.length) {
    finishFillBlank();
    return;
  }

  fillAnswered = false;
  const q = fillData[fillCurrent];
  const total = fillData.length;

  // Progress
  document.getElementById('fillProgressFill').style.width = ((fillCurrent / total) * 100) + '%';
  document.getElementById('fillProgressText').textContent = `${fillCurrent + 1}/${total}`;
  document.getElementById('fillScore').textContent = `SCORE: ${fillScore}`;

  // Hearts
  const heartsEl = document.getElementById('fillHearts');
  if (heartsEl) {
    const h = getHearts();
    heartsEl.textContent = '❤️'.repeat(h.current) + '🖤'.repeat(5 - h.current);
  }

  // Sentence with blank
  const sentenceEl = document.getElementById('fillSentence');
  sentenceEl.innerHTML = q.sentence.replace('___', '<span class="fill-blank-slot" id="fillSlot">___</span>');

  // Hint
  const hintEl = document.getElementById('fillHint');
  if (q.hint) {
    hintEl.textContent = '💡 Hint: ' + q.hint;
    hintEl.style.display = 'block';
  } else {
    hintEl.style.display = 'none';
  }

  // Word bank
  const bankEl = document.getElementById('fillWordBank');
  bankEl.innerHTML = '';
  const shuffled = [...q.options].sort(() => Math.random() - 0.5);
  shuffled.forEach(word => {
    const btn = document.createElement('button');
    btn.className = 'fill-word-btn';
    btn.textContent = word;
    btn.onclick = () => selectFillWord(word, btn);
    bankEl.appendChild(btn);
  });

  // Hide fact & next
  document.getElementById('fillFact').style.display = 'none';
  document.getElementById('fillNextBtn').style.display = 'none';

  // Mascot thinks while player reads question
  if (typeof Mascot !== 'undefined') Mascot.onThink();

  // Animate
  const card = document.getElementById('fillCard');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'fadeUp 0.4s ease';
}

function selectFillWord(word, btn) {
  if (fillAnswered) return;
  fillAnswered = true;

  const q = fillData[fillCurrent];
  const slot = document.getElementById('fillSlot');
  const allBtns = document.querySelectorAll('.fill-word-btn');

  // Place word in slot
  slot.textContent = word;

  // Disable all word buttons
  allBtns.forEach(b => b.classList.add('disabled'));

  if (word === q.answer) {
    slot.classList.add('correct');
    btn.classList.add('correct');
    fillScore++;
    playSound('correct');
    addXP(10);
    if (typeof Mascot !== 'undefined') Mascot.onCorrect();
  } else {
    slot.classList.add('wrong');
    btn.classList.add('wrong');
    // Highlight correct word
    allBtns.forEach(b => {
      if (b.textContent === q.answer) b.classList.add('correct');
    });
    playSound('wrong');
    loseHeart();
    if (typeof Mascot !== 'undefined') Mascot.onWrong();
  }

  document.getElementById('fillScore').textContent = `SCORE: ${fillScore}`;

  // Show fact
  if (q.fact) {
    const factEl = document.getElementById('fillFact');
    factEl.textContent = '💡 ' + q.fact;
    factEl.style.display = 'block';
  }

  // Show next
  const nextBtn = document.getElementById('fillNextBtn');
  nextBtn.textContent = fillCurrent < fillData.length - 1 ? 'NEXT →' : 'SEE RESULTS 🏆';
  nextBtn.style.display = 'inline-flex';

  // Update hearts display
  const heartsEl = document.getElementById('fillHearts');
  if (heartsEl) {
    const h = getHearts();
    heartsEl.textContent = '❤️'.repeat(h.current) + '🖤'.repeat(5 - h.current);
  }
}

function nextFillQuestion() {
  if (!hasHearts()) return;
  fillCurrent++;
  showFillQuestion();
}

function finishFillBlank() {
  const total = fillData.length;
  addXP(50); // game complete bonus
  if (fillScore === total) addXP(25); // perfect bonus
  markNodeComplete('fill-blank');

  // Check flawless achievement
  if (getHearts().current === fillStartHearts) {
    awardAchievement('no_hearts_lost');
  }
  if (fillScore === total) awardAchievement('perfect_score');

  showResults('Fill in the Blank Complete!', fillScore, total, 'fill-blank');
}
