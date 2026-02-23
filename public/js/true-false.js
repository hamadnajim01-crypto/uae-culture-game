/* ============================================
   True or False — Speed Round Mini-Game
   15 statements, timed, fast pace
   ============================================ */

let tfData = [];
let tfCurrent = 0;
let tfScore = 0;
let tfAnswered = false;
let tfTimerInterval = null;
let tfSeconds = 0;
let tfStartHearts = 0;

async function startTrueFalse() {
  try {
    const res = await fetch('/api/true-false');
    tfData = await res.json();
  } catch (e) {
    showNotification('Failed to load questions!');
    return;
  }

  tfCurrent = 0;
  tfScore = 0;
  tfAnswered = false;
  tfSeconds = 0;
  tfStartHearts = getHearts().current;

  document.getElementById('tfStart').style.display = 'none';
  document.getElementById('tfArea').style.display = 'block';

  updateStreak();

  // Start timer
  clearInterval(tfTimerInterval);
  tfTimerInterval = setInterval(() => {
    tfSeconds++;
    const mins = Math.floor(tfSeconds / 60);
    const secs = tfSeconds % 60;
    document.getElementById('tfTimer').textContent = `⏱️ ${mins}:${secs.toString().padStart(2, '0')}`;
  }, 1000);

  showTFQuestion();
}

function showTFQuestion() {
  if (tfCurrent >= tfData.length) {
    finishTrueFalse();
    return;
  }

  tfAnswered = false;
  const q = tfData[tfCurrent];
  const total = tfData.length;

  // Progress
  document.getElementById('tfProgressFill').style.width = ((tfCurrent / total) * 100) + '%';
  document.getElementById('tfProgressText').textContent = `${tfCurrent + 1}/${total}`;

  // Hearts
  const heartsEl = document.getElementById('tfHearts');
  if (heartsEl) {
    const h = getHearts();
    heartsEl.textContent = '❤️'.repeat(h.current) + '🖤'.repeat(5 - h.current);
  }

  // Statement
  document.getElementById('tfStatement').textContent = q.statement;

  // Reset buttons
  const buttonsEl = document.getElementById('tfButtons');
  buttonsEl.innerHTML = `
    <button class="tf-btn tf-true" onclick="answerTF(true)">✅ TRUE</button>
    <button class="tf-btn tf-false" onclick="answerTF(false)">❌ FALSE</button>
  `;

  // Hide fact & next
  document.getElementById('tfFact').style.display = 'none';
  document.getElementById('tfNextBtn').style.display = 'none';

  // Mascot thinks while player reads statement
  if (typeof Mascot !== 'undefined') Mascot.onThink();

  // Animate
  const card = document.getElementById('tfCard');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'fadeUp 0.3s ease';
}

function answerTF(answer) {
  if (tfAnswered) return;
  tfAnswered = true;

  const q = tfData[tfCurrent];
  const isCorrect = answer === q.answer;
  const buttons = document.querySelectorAll('.tf-btn');

  buttons.forEach(btn => btn.classList.add('disabled'));

  if (isCorrect) {
    // Highlight the correct button
    const correctBtn = answer ? buttons[0] : buttons[1];
    correctBtn.classList.add('tf-correct');
    tfScore++;
    playSound('correct');
    addXP(10);
    if (typeof Mascot !== 'undefined') Mascot.onCorrect();
  } else {
    // Highlight wrong and show correct
    const wrongBtn = answer ? buttons[0] : buttons[1];
    const correctBtn = answer ? buttons[1] : buttons[0];
    wrongBtn.classList.add('tf-wrong');
    correctBtn.classList.add('tf-correct');
    playSound('wrong');
    loseHeart();
    if (typeof Mascot !== 'undefined') Mascot.onWrong();
  }

  // Show fact
  if (q.fact) {
    const factEl = document.getElementById('tfFact');
    factEl.textContent = '💡 ' + q.fact;
    factEl.style.display = 'block';
  }

  // Show next
  const nextBtn = document.getElementById('tfNextBtn');
  nextBtn.textContent = tfCurrent < tfData.length - 1 ? 'NEXT →' : 'SEE RESULTS 🏆';
  nextBtn.style.display = 'inline-flex';

  // Update hearts
  const heartsEl = document.getElementById('tfHearts');
  if (heartsEl) {
    const h = getHearts();
    heartsEl.textContent = '❤️'.repeat(h.current) + '🖤'.repeat(5 - h.current);
  }
}

function nextTFQuestion() {
  if (!hasHearts()) return;
  tfCurrent++;
  showTFQuestion();
}

function finishTrueFalse() {
  clearInterval(tfTimerInterval);

  const total = tfData.length;
  addXP(50); // game complete bonus
  if (tfScore === total) addXP(25); // perfect bonus
  markNodeComplete('true-false');

  // Speed demon achievement — under 60 seconds
  if (tfSeconds < 60) awardAchievement('speed_demon');

  // Flawless achievement
  if (getHearts().current === tfStartHearts) awardAchievement('no_hearts_lost');
  if (tfScore === total) awardAchievement('perfect_score');

  showResults(`True or False — ${tfSeconds}s!`, tfScore, total, 'true-false');
}
