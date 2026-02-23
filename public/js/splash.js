/* ============================================
   Splash / Intro Screen
   Step transitions, voice intro, enter game
   ============================================ */

let currentSplashStep = 1;

function nextSplashStep(step) {
  playSound('flip');

  // Hide current
  const current = document.getElementById('splashStep' + currentSplashStep);
  if (current) {
    current.classList.remove('active');
    current.style.animation = 'splashSlideOut 0.4s ease forwards';
  }

  // Update dots
  document.querySelectorAll('.splash-dot').forEach(d => d.classList.remove('active'));
  const nextDot = document.querySelector(`.splash-dot[data-step="${step}"]`);
  if (nextDot) nextDot.classList.add('active');

  // Show next after delay
  setTimeout(() => {
    currentSplashStep = step;
    const next = document.getElementById('splashStep' + step);
    if (next) {
      next.classList.add('active');
      next.style.animation = 'splashSlideIn 0.5s ease forwards';
    }

    // Mascot reacts to each splash step
    if (typeof Mascot !== 'undefined') {
      Mascot.setSize('large');
      Mascot.onSplashStep(step);
    }

    // Focus name input on step 4
    if (step === 4) {
      setTimeout(() => {
        const nameInput = document.getElementById('splashName');
        if (nameInput) nameInput.focus();
      }, 500);
    }
  }, 400);
}

function enterGame() {
  const nameInput = document.getElementById('splashName');
  const name = nameInput ? nameInput.value.trim() : '';
  const playerName = name || 'Explorer';

  // Save name
  localStorage.setItem('uaequest_player', playerName);

  // Play celebration sound
  playSound('correct');

  // Mascot celebrates and shrinks back to normal size
  if (typeof Mascot !== 'undefined') {
    Mascot.setState('celebrate');
    Mascot.setSize('');
  }

  // Animate splash out
  const overlay = document.getElementById('splashOverlay');
  overlay.style.animation = 'splashFadeOut 0.8s ease forwards';

  setTimeout(() => {
    overlay.style.display = 'none';

    // Show main page
    const main = document.getElementById('mainPage');
    main.style.display = 'block';
    main.style.animation = 'fadeUp 0.6s ease';

    // Update player name in hero
    const heroName = document.getElementById('heroPlayerName');
    if (heroName) heroName.textContent = playerName.toUpperCase();

    // Welcome notification
    showNotification(`Welcome, ${playerName}! Let's explore UAE culture!`);
  }, 800);
}

// Allow Enter key on name input
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('splashName');
  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') enterGame();
    });

    // Pre-fill saved name
    const saved = localStorage.getItem('uaequest_player');
    if (saved && saved !== 'Explorer') {
      nameInput.value = saved;
    }
  }

  // Trigger mascot greeting on splash step 1
  const splashOverlay = document.getElementById('splashOverlay');
  if (splashOverlay && splashOverlay.style.display !== 'none' && typeof Mascot !== 'undefined') {
    Mascot.setSize('large');
    setTimeout(() => Mascot.onSplashStep(1), 800);
  }

  // Check if returning player — skip splash
  const returning = localStorage.getItem('uaequest_splash_seen');
  if (returning) {
    const overlay = document.getElementById('splashOverlay');
    if (overlay) overlay.style.display = 'none';
    const main = document.getElementById('mainPage');
    if (main) {
      main.style.display = 'block';
      const heroName = document.getElementById('heroPlayerName');
      const saved = localStorage.getItem('uaequest_player') || 'Explorer';
      if (heroName) heroName.textContent = saved.toUpperCase();
    }
  }
});

// Mark splash as seen when entering game
const origEnterGame = enterGame;
enterGame = function() {
  localStorage.setItem('uaequest_splash_seen', 'true');
  origEnterGame();
};
