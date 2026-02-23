/* ============================================
   UAE Culture Quest — Main JavaScript
   Handles: navigation, player name, stars, facts carousel, confetti
   ============================================ */

// ===== PLAYER NAME =====
function getPlayerName() {
  return localStorage.getItem('uaequest_player') || 'Explorer';
}

function setPlayerName(name) {
  localStorage.setItem('uaequest_player', name);
}

function startExploring() {
  const input = document.getElementById('playerName');
  if (!input) return;

  const name = input.value.trim() || 'Explorer';
  setPlayerName(name);

  const section = document.getElementById('gamesSection');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }

  showNotification(`Welcome, ${name}! Let's explore UAE culture! 🇦🇪`);
}

// ===== STARS =====
function getStars() {
  const data = JSON.parse(localStorage.getItem('uaequest_scores') || '{}');
  let total = 0;
  for (const game of Object.values(data)) {
    total += game.stars || 0;
  }
  return total;
}

function saveGameScore(game, score, total) {
  const data = JSON.parse(localStorage.getItem('uaequest_scores') || '{}');
  const stars = total > 0 ? Math.ceil((score / total) * 3) : 0;
  data[game] = { score, total, stars };
  localStorage.setItem('uaequest_scores', JSON.stringify(data));
  updateStarsDisplay();
  return stars;
}

// XP breakdown helper for results
function getXPBreakdown(score, total) {
  const perQuestion = score * 10;
  const completionBonus = 50;
  const perfectBonus = score === total ? 25 : 0;
  return { perQuestion, completionBonus, perfectBonus, total: perQuestion + completionBonus + perfectBonus };
}

function updateStarsDisplay() {
  const el = document.getElementById('navStars');
  if (el) {
    el.textContent = `⭐ ${getStars()} Stars`;
  }
}

// Update on load
document.addEventListener('DOMContentLoaded', () => {
  updateStarsDisplay();

  // Set player name in input if exists
  const input = document.getElementById('playerName');
  if (input) {
    const saved = getPlayerName();
    if (saved !== 'Explorer') input.value = saved;
  }

  // Init facts carousel
  initFactsCarousel();

  // Update card stars on home page
  updateCardStars();

  // Game page floating particles
  initGameParticles();

  // Auto-start music if saved preference is 'on' (requires user interaction)
  if (localStorage.getItem('uaequest_music') === 'on') {
    document.addEventListener('click', function startMusicOnce() {
      startBackgroundMusic();
      document.removeEventListener('click', startMusicOnce);
    }, { once: true });
  }
  updateSoundToggleBtn();
});

// ===== CARD STARS ON HOME PAGE =====
function updateCardStars() {
  const data = JSON.parse(localStorage.getItem('uaequest_scores') || '{}');
  document.querySelectorAll('.card-stars').forEach(el => {
    const game = el.dataset.game;
    if (data[game]) {
      const stars = data[game].stars || 0;
      el.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      el.style.color = '#D4A24E';
    }
  });
}

// ===== MOBILE NAV =====
function toggleNav() {
  document.querySelector('.nav-links').classList.toggle('open');
}

// ===== FACTS CAROUSEL =====
function initFactsCarousel() {
  const carousel = document.getElementById('factsCarousel');
  const dotsContainer = document.getElementById('factsDots');
  if (!carousel || !dotsContainer) return;

  const cards = carousel.querySelectorAll('.fact-card');
  let current = 0;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'fact-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToFact(i);
    dotsContainer.appendChild(dot);
  });

  function goToFact(index) {
    cards[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = index;
    cards[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  // Touch swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToFact((current + 1) % cards.length);
      else goToFact((current - 1 + cards.length) % cards.length);
    }
  });

  // Auto-rotate every 5 seconds
  setInterval(() => {
    goToFact((current + 1) % cards.length);
  }, 5000);
}

// ===== NOTIFICATIONS =====
function showNotification(text, duration = 3000) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: linear-gradient(135deg, #D4A24E, #B8872F);
    color: #1A1A2E;
    padding: 14px 28px;
    border-radius: 24px;
    font-family: 'Fredoka', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    z-index: 5000;
    opacity: 0;
    transition: all 0.4s ease;
    box-shadow: 0 8px 30px rgba(212,162,78,0.4);
    text-align: center;
    max-width: 90vw;
  `;
  document.body.appendChild(notif);
  notif.textContent = text;

  requestAnimationFrame(() => {
    notif.style.opacity = '1';
    notif.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => notif.remove(), 400);
  }, duration);
}

// ===== CONFETTI =====
function launchConfetti() {
  const colors = ['#D4A24E', '#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (Math.random() * 10 + 5) + 'px';
    piece.style.height = (Math.random() * 10 + 5) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
    piece.style.animationDelay = (Math.random() * 1) + 's';
    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 4000);
  }
}

// ===== RESULTS OVERLAY =====
function showResults(title, score, total, game) {
  const stars = saveGameScore(game, score, total);
  const xp = getXPBreakdown(score, total);

  const message = stars === 3 ? 'PERFECT! You are a UAE Culture Champion!' :
                  stars === 2 ? 'Great job! Almost perfect!' :
                  'Good try! Keep learning and try again!';

  const overlay = document.createElement('div');
  overlay.className = 'results-overlay';
  overlay.innerHTML = `
    <div class="results-card">
      <h2 style="color: #FFD700; font-size: 1.8rem; margin-bottom: 8px; font-family:'Orbitron',sans-serif;">${title}</h2>
      <div class="results-score" id="resultsScoreNum">0/${total}</div>
      <div class="results-stars" id="resultsStarsWrap"></div>
      <div class="results-xp-breakdown">
        <div class="xp-line"><span>Correct answers</span><span>+${xp.perQuestion} XP</span></div>
        <div class="xp-line"><span>Completion bonus</span><span>+${xp.completionBonus} XP</span></div>
        ${xp.perfectBonus ? `<div class="xp-line xp-perfect"><span>Perfect bonus!</span><span>+${xp.perfectBonus} XP</span></div>` : ''}
        <div class="xp-line xp-total"><span>Total</span><span>+${xp.total} XP</span></div>
      </div>
      <div class="results-message">${message}</div>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-gold" onclick="this.closest('.results-overlay').remove(); location.reload();">Play Again 🔄</button>
        <a href="/" class="btn btn-blue">Home 🏠</a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Animated score count-up
  const scoreEl = document.getElementById('resultsScoreNum');
  let currentCount = 0;
  if (score > 0) {
    const countInterval = setInterval(() => {
      currentCount++;
      scoreEl.textContent = `${currentCount}/${total}`;
      if (currentCount >= score) clearInterval(countInterval);
    }, 80);
  }

  // Stars reveal one-by-one with bounce
  const starsWrap = document.getElementById('resultsStarsWrap');
  for (let i = 0; i < 3; i++) {
    const star = document.createElement('span');
    star.textContent = i < stars ? '⭐' : '☆';
    star.style.cssText = 'display:inline-block;font-size:2rem;opacity:0;transform:scale(0);transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);';
    starsWrap.appendChild(star);
    setTimeout(() => {
      star.style.opacity = '1';
      star.style.transform = 'scale(1)';
    }, 400 + i * 300);
  }

  // Mascot reacts to results
  if (typeof Mascot !== 'undefined') Mascot.onResults(stars);

  if (stars >= 2) {
    launchConfetti();
    playSound('levelup');
  }
}

// ===== VOICE NARRATION (Text-to-Speech) =====
let currentUtterance = null;

function speakText(text) {
  if (!('speechSynthesis' in window)) return;

  // Stop any current speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = 1;

  // Use saved voice preference from voice picker
  const voices = speechSynthesis.getVoices();
  const savedName = typeof getSavedVoiceName === 'function' ? getSavedVoiceName() : null;
  const savedSpeed = typeof getSavedSpeed === 'function' ? getSavedSpeed() : 0.9;
  const savedPitch = typeof getSavedPitch === 'function' ? getSavedPitch() : 1.05;

  utterance.rate = savedSpeed;
  utterance.pitch = savedPitch;

  if (savedName) {
    const savedVoice = voices.find(v => v.name === savedName);
    if (savedVoice) utterance.voice = savedVoice;
  }

  // Fallback: pick a good English voice if nothing saved
  if (!utterance.voice) {
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Microsoft'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;
  }

  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

function toggleVoiceBtn(btn) {
  const isPlaying = btn.classList.contains('playing');
  if (isPlaying) {
    stopSpeaking();
    btn.classList.remove('playing');
    btn.textContent = '🔊 Listen';
  } else {
    const text = btn.getAttribute('data-text');
    if (text) speakText(text);
    btn.classList.add('playing');
    btn.textContent = '⏹️ Stop';

    if ('speechSynthesis' in window) {
      const checkDone = setInterval(() => {
        if (!speechSynthesis.speaking) {
          btn.classList.remove('playing');
          btn.textContent = '🔊 Listen';
          clearInterval(checkDone);
        }
      }, 300);
    }
  }
}

// Load voices early
if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  speechSynthesis.getVoices();
}

// ===== ARABIC CARD REVEAL =====
function revealArabic(card) {
  card.classList.toggle('revealed');
  playSound('flip');
}

// ===== SOUND HELPERS (Enhanced) =====
function playSound(type) {
  if (localStorage.getItem('uaequest_sfx') === 'off') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain();
    master.connect(ctx.destination);

    if (type === 'correct') {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
        g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.1 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.5);
        osc.connect(g); g.connect(master);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.5);
      });
      setTimeout(() => ctx.close(), 800);
    } else if (type === 'wrong') {
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
      o1.frequency.value = 200; o2.frequency.value = 212;
      o1.type = 'sawtooth'; o2.type = 'sawtooth';
      g.gain.value = 0.04;
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      o1.connect(g); o2.connect(g); g.connect(master);
      o1.start(); o2.start();
      o1.stop(ctx.currentTime + 0.4); o2.stop(ctx.currentTime + 0.4);
      setTimeout(() => ctx.close(), 500);
    } else if (type === 'flip') {
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.frequency.value = 440; g.gain.value = 0.05;
      osc.connect(g); g.connect(master);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
      setTimeout(() => ctx.close(), 200);
    } else if (type === 'match') {
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.frequency.value = 587.33; g.gain.value = 0.1;
      osc.connect(g); g.connect(master);
      osc.start();
      setTimeout(() => { osc.frequency.value = 880; }, 150);
      setTimeout(() => { osc.stop(); ctx.close(); }, 300);
    } else if (type === 'levelup') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.12 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
        osc.connect(g); g.connect(master);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.6);
      });
      setTimeout(() => ctx.close(), 1200);
    } else if (type === 'achievement') {
      [1318.51, 1567.98, 2093.00].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
        g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.15 + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.8);
        osc.connect(g); g.connect(master);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.8);
      });
      setTimeout(() => ctx.close(), 1500);
    }
  } catch (e) {}
}

// ===== BACKGROUND MUSIC =====
let musicCtx = null;
let musicPlaying = false;
let musicGain = null;
let musicInterval = null;

function startBackgroundMusic() {
  if (musicPlaying) return;
  try {
    if (!musicCtx) {
      musicCtx = new (window.AudioContext || window.webkitAudioContext)();
      musicGain = musicCtx.createGain();
      musicGain.gain.value = 0.03;
      musicGain.connect(musicCtx.destination);
    }
    musicPlaying = true;
    const notes = [293.66, 349.23, 392.00, 440.00, 466.16, 587.33];
    let noteIdx = 0;
    function playNote() {
      if (!musicPlaying) return;
      const osc = musicCtx.createOscillator();
      const g = musicCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[noteIdx % notes.length];
      g.gain.setValueAtTime(0.03, musicCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, musicCtx.currentTime + 2);
      osc.connect(g); g.connect(musicGain);
      osc.start(); osc.stop(musicCtx.currentTime + 2.5);
      noteIdx++;
    }
    playNote();
    musicInterval = setInterval(playNote, 3000);
    updateSoundToggleBtn();
  } catch (e) {}
}

function stopBackgroundMusic() {
  musicPlaying = false;
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  updateSoundToggleBtn();
}

function toggleMusic() {
  if (musicPlaying) stopBackgroundMusic();
  else startBackgroundMusic();
  localStorage.setItem('uaequest_music', musicPlaying ? 'on' : 'off');
}

function updateSoundToggleBtn() {
  const icon = document.getElementById('soundIcon');
  const btn = document.getElementById('soundToggle');
  if (!icon || !btn) return;
  icon.textContent = musicPlaying ? '🔊' : '🔇';
  btn.classList.toggle('music-on', musicPlaying);
}

// ===== GAME PARTICLES =====
function initGameParticles() {
  if (window.location.pathname === '/') return;
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
  for (let i = 0; i < 4; i++) {
    const p = document.createElement('span');
    p.className = 'hero-particle';
    p.style.left = (15 + i * 22) + '%';
    p.style.animationDelay = (i * 1.5) + 's';
    container.appendChild(p);
  }
  document.body.appendChild(container);
}
