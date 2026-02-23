/* ============================================
   Listening Challenge — Mini-Game
   Hear Arabic word, pick the English meaning
   ============================================ */

let listenData = [];
let listenCurrent = 0;
let listenScore = 0;
let listenAnswered = false;
let listenStartHearts = 0;

async function startListening() {
  try {
    const res = await fetch('/api/listening');
    listenData = await res.json();
  } catch (e) {
    showNotification('Failed to load questions!');
    return;
  }

  listenCurrent = 0;
  listenScore = 0;
  listenAnswered = false;
  listenStartHearts = getHearts().current;

  document.getElementById('listenStart').style.display = 'none';
  document.getElementById('listenArea').style.display = 'block';

  updateStreak();
  showListenQuestion();
}

function showListenQuestion() {
  if (listenCurrent >= listenData.length) {
    finishListening();
    return;
  }

  listenAnswered = false;
  const q = listenData[listenCurrent];
  const total = listenData.length;

  // Progress
  document.getElementById('listenProgressFill').style.width = ((listenCurrent / total) * 100) + '%';
  document.getElementById('listenProgressText').textContent = `${listenCurrent + 1}/${total}`;
  document.getElementById('listenScore').textContent = `SCORE: ${listenScore}`;

  // Hearts
  const heartsEl = document.getElementById('listenHearts');
  if (heartsEl) {
    const h = getHearts();
    heartsEl.textContent = '❤️'.repeat(h.current) + '🖤'.repeat(5 - h.current);
  }

  // Hide reveal
  document.getElementById('listenReveal').style.display = 'none';

  // Build options
  const optionsEl = document.getElementById('listenOptions');
  optionsEl.innerHTML = '';
  const shuffled = [...q.options].sort(() => Math.random() - 0.5);
  shuffled.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = option;
    btn.onclick = () => answerListen(option, btn);
    optionsEl.appendChild(btn);
  });

  // Hide next
  document.getElementById('listenNextBtn').style.display = 'none';

  // Animate
  const card = document.getElementById('listenCard');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'fadeUp 0.4s ease';

  // Mascot thinks while player listens
  if (typeof Mascot !== 'undefined') Mascot.onThink();

  // Auto-play the word after a short delay
  setTimeout(() => playCurrentWord(), 500);
}

function playCurrentWord() {
  if (listenCurrent >= listenData.length) return;
  const q = listenData[listenCurrent];

  if (!('speechSynthesis' in window)) {
    showNotification('Speech not supported in this browser!');
    return;
  }

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(q.arabic);
  utterance.rate = 0.7;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to find an Arabic voice, fallback to any voice
  const voices = speechSynthesis.getVoices();
  const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  // Animate the play button
  const playBtn = document.getElementById('listenPlayBtn');
  if (playBtn) {
    playBtn.classList.add('pulsing');
    utterance.onend = () => playBtn.classList.remove('pulsing');
  }

  speechSynthesis.speak(utterance);
}

function answerListen(answer, btn) {
  if (listenAnswered) return;
  listenAnswered = true;

  const q = listenData[listenCurrent];
  const allBtns = document.querySelectorAll('#listenOptions .quiz-option');
  const isCorrect = answer === q.answer;

  allBtns.forEach(b => b.classList.add('disabled'));

  if (isCorrect) {
    btn.classList.add('correct');
    listenScore++;
    playSound('correct');
    addXP(10);
    if (typeof Mascot !== 'undefined') Mascot.onCorrect();
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => {
      if (b.textContent === q.answer) b.classList.add('correct');
    });
    playSound('wrong');
    loseHeart();
    if (typeof Mascot !== 'undefined') Mascot.onWrong();
  }

  document.getElementById('listenScore').textContent = `SCORE: ${listenScore}`;

  // Show the Arabic word and transliteration
  const revealEl = document.getElementById('listenReveal');
  document.getElementById('listenArabic').textContent = q.arabic;
  document.getElementById('listenTranslit').textContent = q.transliteration || '';
  revealEl.style.display = 'flex';

  // Show next
  const nextBtn = document.getElementById('listenNextBtn');
  nextBtn.textContent = listenCurrent < listenData.length - 1 ? 'NEXT →' : 'SEE RESULTS 🏆';
  nextBtn.style.display = 'inline-flex';

  // Update hearts
  const heartsEl = document.getElementById('listenHearts');
  if (heartsEl) {
    const h = getHearts();
    heartsEl.textContent = '❤️'.repeat(h.current) + '🖤'.repeat(5 - h.current);
  }
}

function nextListenQuestion() {
  if (!hasHearts()) return;
  listenCurrent++;
  showListenQuestion();
}

function finishListening() {
  const total = listenData.length;
  addXP(50);
  if (listenScore === total) addXP(25);
  markNodeComplete('listening');

  if (getHearts().current === listenStartHearts) awardAchievement('no_hearts_lost');
  if (listenScore === total) awardAchievement('perfect_score');

  showResults('Listening Challenge Complete!', listenScore, total, 'listening');
}
