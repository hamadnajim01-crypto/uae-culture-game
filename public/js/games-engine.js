/* ===== GAMES ENGINE v2 — Mode Select + Difficulty ===== */
window.GamesEngine = (function () {
  'use strict';

  var games = {};
  var currentGame = null;
  var currentId = null;
  var mode = '1p';       // '1p' or '2p'
  var difficulty = 'medium'; // 'easy', 'medium', 'hard'
  var score = 0;
  var animFrame = null;

  // DOM refs (resolved once on first use)
  var refs = {};
  function el(id) { return refs[id] || (refs[id] = document.getElementById(id)); }

  /* ── Helpers ── */
  function shuffle(a) { var b = a.slice(); for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ── Registration ── */
  function register(def) {
    // def: { id, name, emoji, category, has2P, init(container, mode, difficulty), destroy() }
    games[def.id] = def;
  }

  /* ── Hub Rendering ── */
  function renderHub() {
    var grid = el('gamesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    var keys = Object.keys(games);
    keys.forEach(function (id) {
      var g = games[id];
      var card = document.createElement('div');
      card.className = 'game-card';
      card.setAttribute('data-cat', g.category);
      card.innerHTML =
        (g.has2P ? '<span class="game-card-2p">2P</span>' : '') +
        '<span class="game-card-emoji">' + g.emoji + '</span>' +
        '<span class="game-card-name">' + g.name + '</span>' +
        '<span class="game-card-cat">' + g.category + '</span>';
      card.onclick = function () { launch(id); };
      grid.appendChild(card);
    });

    // Tab filtering
    var tabs = document.querySelectorAll('.games-tab');
    tabs.forEach(function (tab) {
      tab.onclick = function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.getAttribute('data-cat');
        var cards = grid.querySelectorAll('.game-card');
        cards.forEach(function (c) {
          c.style.display = (cat === 'all' || c.getAttribute('data-cat') === cat) ? '' : 'none';
        });
      };
    });
  }

  /* ── Launch → Mode Selection Screen ── */
  function launch(gameId) {
    var g = games[gameId];
    if (!g) return;
    currentId = gameId;
    score = 0;

    // Show overlay
    el('gameOverlay').classList.add('open');
    el('gameTopEmoji').textContent = g.emoji;
    el('gameTopName').textContent = g.name;
    el('gameTopScore').textContent = 'Score: 0';
    el('gameTopDiff').textContent = '';
    el('gameOverScreen').style.display = 'none';

    // Show mode selection, hide game body
    el('gameModeScreen').style.display = 'flex';
    el('gameBody').style.display = 'none';

    // Fill mode screen info
    el('gameModeEmoji').textContent = g.emoji;
    el('gameModeTitle').textContent = g.name;

    // Show/hide 2P button based on game support
    var btn2P = el('gameMode2P');
    if (btn2P) btn2P.style.display = g.has2P ? '' : 'none';

    // Reset to 1P + medium defaults
    mode = '1p';
    difficulty = 'medium';
    resetModeButtons();
    resetDiffButtons();

    // Show difficulty section only for 1P
    updateDiffVisibility();

    // Rashid speech on mode screen
    var speech = el('gameModeRashidSpeech');
    if (speech) speech.textContent = pick([
      "Pick a mode and let's play! 🎮",
      "I'm ready! Choose wisely! 😊",
      "Yalla! Let's see what you've got! 🌟",
      "Challenge me if you dare! 🤖"
    ]);
  }

  /* ── Start Game (after mode screen) ── */
  function startGame() {
    var g = games[currentId];
    if (!g) return;

    // Hide mode screen, show game body
    el('gameModeScreen').style.display = 'none';
    el('gameBody').style.display = 'flex';

    // Update topbar
    el('gameTopDiff').textContent = mode === '2p' ? '👥 2P' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    // Clear stage
    el('gameStage').innerHTML = '';

    // Rashid greeting
    rashidSay(pick([
      "Let's play " + g.name + "! 🎮",
      "This is fun! Ready? 😊",
      "I love this game! Let's go! 🌟",
      "Yalla! Here we go! 🚀"
    ]));

    // Init game — pass mode and difficulty
    currentGame = g.init(el('gameStage'), mode, difficulty);

    // Add happiness
    if (window.Mascot && Mascot.addHappiness) Mascot.addHappiness(1);
  }

  /* ── Mode / Difficulty Button Helpers ── */
  function resetModeButtons() {
    var bot = el('gameModeBot');
    var p2 = el('gameMode2P');
    if (bot) bot.classList.toggle('active', mode === '1p');
    if (p2) p2.classList.toggle('active', mode === '2p');
  }

  function resetDiffButtons() {
    var btns = document.querySelectorAll('.game-mode-diff');
    btns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-diff') === difficulty);
    });
  }

  function updateDiffVisibility() {
    var sec = el('gameDiffSection');
    if (sec) sec.style.display = mode === '1p' ? '' : 'none';
  }

  /* ── Destroy Current ── */
  function destroyCurrent() {
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    if (currentGame && games[currentId] && games[currentId].destroy) {
      try { games[currentId].destroy(); } catch (e) {}
    }
    currentGame = null;
  }

  /* ── Back to Hub ── */
  function backToHub() {
    destroyCurrent();
    el('gameOverlay').classList.remove('open');
    el('gameStage').innerHTML = '';
    el('gameBody').style.display = 'none';
    el('gameModeScreen').style.display = 'flex';
    currentId = null;
  }

  /* ── End Game ── */
  function endGame(finalScore, total) {
    score = finalScore;
    destroyCurrent();

    var pct = total > 0 ? finalScore / total : 0;
    var stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct > 0 ? 1 : 0;

    // XP
    var xp = finalScore * 10 + (stars === 3 ? 25 : 0);
    if (window.Progression) {
      Progression.addXP(xp);
      if (window.Mascot && Mascot.addHappiness) Mascot.addHappiness(stars >= 2 ? 2 : 1);
    }

    // Rashid reaction + confetti
    if (stars === 3) { rashidSay("PERFECT! You're amazing! 🌟🎉"); spawnConfetti(); }
    else if (stars >= 2) rashidSay("Great job! 👏😊");
    else if (finalScore > 0) rashidSay("Good try! Keep it up! 💪");
    else rashidSay("Don't give up! Try again! 😊");

    // Show game-over screen
    el('gameOverEmoji').textContent = stars === 3 ? '🏆' : stars >= 2 ? '🎉' : '👏';
    el('gameOverTitle').textContent = stars === 3 ? 'Perfect Score!' : 'Game Over!';
    el('gameOverScore').textContent = 'Score: ' + finalScore + (total > 0 ? ' / ' + total : '');
    el('gameOverStars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    el('gameOverXP').textContent = '+' + xp + ' XP';
    el('gameOverScreen').style.display = 'flex';
  }

  /* ── Score ── */
  function setScore(n) {
    score = n;
    var s = el('gameTopScore');
    if (s) {
      s.textContent = 'Score: ' + n;
      s.classList.remove('gscore-pulse');
      void s.offsetWidth; // force reflow
      s.classList.add('gscore-pulse');
    }
  }
  function addScore(n) { setScore(score + (n || 1)); }
  function getScore() { return score; }

  /* ── Rashid Says ── */
  function rashidSay(text) {
    var b = el('gameRashidBubble');
    if (b) {
      b.textContent = text;
      b.style.animation = 'none';
      void b.offsetWidth;
      b.style.animation = 'bubblePop 0.3s ease';
    }
  }

  /* ── Confetti on Perfect Score ── */
  function spawnConfetti() {
    var colors = ['#FFD700','#FF6B35','#00C9A7','#4ecdc4','#ff6b6b','#9b59b6','#3498db'];
    for (var i = 0; i < 40; i++) {
      (function(delay) {
        setTimeout(function() {
          var c = document.createElement('div');
          c.className = 'gconfetti';
          c.style.left = (Math.random() * 100) + 'vw';
          c.style.background = colors[Math.floor(Math.random() * colors.length)];
          c.style.width = (5 + Math.random() * 8) + 'px';
          c.style.height = (5 + Math.random() * 8) + 'px';
          c.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
          document.body.appendChild(c);
          setTimeout(function() { if (c.parentNode) c.parentNode.removeChild(c); }, 3500);
        }, delay);
      })(i * 40);
    }
  }

  /* ── Canvas Helper ── */
  function makeCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.style.width = Math.min(w, 500) + 'px';
    c.style.height = Math.min(h, 500) + 'px';
    c.style.background = '#0a0a12';
    c.style.borderRadius = '12px';
    c.style.border = '1.5px solid rgba(255,215,0,0.15)';
    return c;
  }

  /* ── Animation Frame Helper ── */
  function loop(fn) {
    function step(ts) {
      fn(ts);
      animFrame = requestAnimationFrame(step);
    }
    animFrame = requestAnimationFrame(step);
  }

  /* ── Init on DOM ready ── */
  function init() {
    renderHub();

    // Wire back button
    if (el('gameBackBtn')) el('gameBackBtn').onclick = backToHub;

    // Wire replay + back on game over
    if (el('gameOverReplay')) el('gameOverReplay').onclick = function () {
      el('gameOverScreen').style.display = 'none';
      if (currentId) {
        // Re-start game directly with same mode/difficulty
        el('gameBody').style.display = 'flex';
        el('gameStage').innerHTML = '';
        score = 0;
        el('gameTopScore').textContent = 'Score: 0';
        var g = games[currentId];
        if (g) {
          rashidSay(pick(["Let's go again! 🔄", "Round two! 💪", "I'm ready! 🎮"]));
          currentGame = g.init(el('gameStage'), mode, difficulty);
        }
      }
    };
    if (el('gameOverBack')) el('gameOverBack').onclick = backToHub;

    // Wire mode buttons (1P / 2P)
    var modeBot = el('gameModeBot');
    var mode2P = el('gameMode2P');
    if (modeBot) modeBot.onclick = function () {
      mode = '1p';
      resetModeButtons();
      updateDiffVisibility();
    };
    if (mode2P) mode2P.onclick = function () {
      mode = '2p';
      resetModeButtons();
      updateDiffVisibility();
    };

    // Wire difficulty buttons
    var diffBtns = document.querySelectorAll('.game-mode-diff');
    diffBtns.forEach(function (btn) {
      btn.onclick = function () {
        difficulty = btn.getAttribute('data-diff');
        resetDiffButtons();
      };
    });

    // Wire PLAY button
    var playBtn = el('gameModePlay');
    if (playBtn) playBtn.onclick = startGame;
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

  /* ── Public API ── */
  return {
    register: register,
    launch: launch,
    endGame: endGame,
    backToHub: backToHub,
    setScore: setScore,
    addScore: addScore,
    getScore: getScore,
    getMode: function () { return mode; },
    getDifficulty: function () { return difficulty; },
    rashidSay: rashidSay,
    makeCanvas: makeCanvas,
    loop: loop,
    shuffle: shuffle,
    pick: pick,
    clamp: clamp,
    el: el,
    getStage: function () { return el('gameStage'); }
  };
})();
