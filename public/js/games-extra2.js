/* ===== EXTRA GAMES PACK 2 — 12 Visual DOM Games (Word Category) ===== */
(function () {
  'use strict';
  var E = window.GamesEngine;
  var shuffle = E.shuffle, pick = E.pick;

  /* ── Shared Style Injection ── */
  var styleInjected = false;
  function injectStyles() {
    if (styleInjected) return;
    styleInjected = true;
    var style = document.createElement('style');
    style.textContent =
      /* Keyframes */
      '@keyframes ge2-pop{0%{transform:scale(0.8);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}' +
      '@keyframes ge2-shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px)}30%{transform:translateX(8px)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}90%{transform:translateX(3px)}}' +
      '@keyframes ge2-flip{0%{transform:rotateX(0)}50%{transform:rotateX(90deg)}100%{transform:rotateX(0)}}' +
      '@keyframes ge2-pulse{0%,100%{opacity:1}50%{opacity:0.4}}' +
      '@keyframes ge2-glow{0%,100%{box-shadow:0 0 8px rgba(255,215,0,0.3)}50%{box-shadow:0 0 24px rgba(255,215,0,0.7)}}' +
      '@keyframes ge2-fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}' +
      '@keyframes ge2-celebPop{0%{transform:scale(0)}50%{transform:scale(1.3)}100%{transform:scale(1)}}' +
      '@keyframes ge2-blink{0%,100%{border-color:rgba(255,215,0,0.7)}50%{border-color:rgba(255,215,0,0.1)}}' +
      '@keyframes ge2-slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}' +

      /* Base container */
      '.ge2-wrap{display:flex;flex-direction:column;align-items:center;width:100%;max-width:500px;margin:0 auto;padding:8px 12px;font-family:Inter,sans-serif;color:#eef;box-sizing:border-box}' +

      /* Card */
      '.ge2-card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,215,0,0.1);border-radius:12px;padding:20px;width:100%;box-sizing:border-box;margin-bottom:12px;transition:all 0.3s ease}' +
      '.ge2-card:hover{border-color:rgba(255,215,0,0.2)}' +

      /* Title */
      '.ge2-title{font-family:Orbitron,sans-serif;font-size:1.1rem;color:#FFD700;text-align:center;margin-bottom:8px;letter-spacing:0.5px}' +
      '.ge2-subtitle{font-family:Inter,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.5);text-align:center;margin-bottom:12px}' +

      /* Buttons */
      '.ge2-btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 20px;border:none;border-radius:10px;font-family:Orbitron,sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;transition:all 0.2s ease;color:#000;background:linear-gradient(135deg,#FFD700,#FFA500);box-shadow:0 3px 12px rgba(0,0,0,0.3);min-width:120px;text-align:center}' +
      '.ge2-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(255,215,0,0.35)}' +
      '.ge2-btn:active{transform:translateY(0)}' +
      '.ge2-btn.teal{background:linear-gradient(135deg,#00C9A7,#00A98F);color:#000}' +
      '.ge2-btn.teal:hover{box-shadow:0 6px 20px rgba(0,201,167,0.35)}' +
      '.ge2-btn.orange{background:linear-gradient(135deg,#FF6B35,#FF4500);color:#fff}' +
      '.ge2-btn.orange:hover{box-shadow:0 6px 20px rgba(255,107,53,0.35)}' +
      '.ge2-btn.sm{padding:8px 14px;font-size:0.75rem;min-width:80px;border-radius:8px}' +
      '.ge2-btn.disabled{opacity:0.4;pointer-events:none;cursor:default}' +

      /* Option buttons grid */
      '.ge2-opts{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;width:100%;margin:10px 0}' +
      '.ge2-opt{flex:1 1 calc(50% - 10px);min-width:140px;padding:14px 10px;border:2px solid rgba(255,215,0,0.15);border-radius:10px;background:rgba(255,255,255,0.04);color:#eef;font-family:Inter,sans-serif;font-size:0.9rem;cursor:pointer;transition:all 0.25s ease;text-align:center}' +
      '.ge2-opt:hover{background:rgba(255,215,0,0.1);border-color:rgba(255,215,0,0.4);transform:translateY(-2px)}' +
      '.ge2-opt.correct{background:rgba(0,201,167,0.2)!important;border-color:#00C9A7!important;box-shadow:0 0 16px rgba(0,201,167,0.4);animation:ge2-pop 0.4s ease}' +
      '.ge2-opt.wrong{background:rgba(255,59,59,0.2)!important;border-color:#ff3b3b!important;animation:ge2-shake 0.4s ease}' +

      /* Input */
      '.ge2-input{width:100%;max-width:300px;padding:12px 16px;border:2px solid rgba(255,215,0,0.2);border-radius:10px;background:rgba(0,0,0,0.3);color:#FFD700;font-family:Orbitron,sans-serif;font-size:1rem;text-align:center;outline:none;transition:border-color 0.3s;letter-spacing:1px;box-sizing:border-box}' +
      '.ge2-input:focus{border-color:rgba(255,215,0,0.6)}' +
      '.ge2-input::placeholder{color:rgba(255,215,0,0.3)}' +

      /* Progress dots */
      '.ge2-dots{display:flex;gap:6px;justify-content:center;margin:8px 0}' +
      '.ge2-dot{width:10px;height:10px;border-radius:50%;transition:all 0.3s;background:rgba(255,255,255,0.15)}' +
      '.ge2-dot.done{background:#00C9A7;box-shadow:0 0 6px #00C9A7}' +
      '.ge2-dot.active{background:#FFD700;box-shadow:0 0 8px #FFD700;transform:scale(1.3)}' +

      /* Progress bar */
      '.ge2-pbar{width:100%;height:8px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;margin:6px 0}' +
      '.ge2-pbar-fill{height:100%;background:linear-gradient(90deg,#00C9A7,#FFD700);border-radius:4px;transition:width 0.4s ease}' +

      /* Score display */
      '.ge2-score{font-family:Orbitron,sans-serif;font-size:0.8rem;color:#00C9A7;text-align:center;margin:4px 0}' +

      /* Big emoji display */
      '.ge2-big-emoji{font-size:3.5rem;text-align:center;margin:10px 0;line-height:1.2}' +

      /* Correct/wrong flash on card */
      '.ge2-card.flash-correct{box-shadow:0 0 24px rgba(0,201,167,0.5);border-color:#00C9A7;animation:ge2-pop 0.4s ease}' +
      '.ge2-card.flash-wrong{box-shadow:0 0 24px rgba(255,59,59,0.4);border-color:#ff3b3b;animation:ge2-shake 0.4s ease}' +

      /* Wordle grid */
      '.ge2-wordle-row{display:flex;gap:5px;justify-content:center;margin-bottom:5px}' +
      '.ge2-wordle-tile{width:48px;height:48px;border:2px solid rgba(255,255,255,0.15);border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:Orbitron,sans-serif;font-size:1.3rem;font-weight:700;color:#eef;text-transform:uppercase;transition:all 0.2s;background:rgba(255,255,255,0.04)}' +
      '.ge2-wordle-tile.filled{border-color:rgba(255,215,0,0.4)}' +
      '.ge2-wordle-tile.correct{background:#538d4e;border-color:#538d4e;animation:ge2-flip 0.5s ease}' +
      '.ge2-wordle-tile.present{background:#b59f3b;border-color:#b59f3b;animation:ge2-flip 0.5s ease}' +
      '.ge2-wordle-tile.absent{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.1);animation:ge2-flip 0.5s ease}' +

      /* Keyboard */
      '.ge2-kb{display:flex;flex-direction:column;align-items:center;gap:5px;margin-top:10px}' +
      '.ge2-kb-row{display:flex;gap:4px;justify-content:center}' +
      '.ge2-kb-key{min-width:28px;height:40px;border:none;border-radius:6px;background:rgba(255,255,255,0.15);color:#eef;font-family:Orbitron,sans-serif;font-size:0.7rem;font-weight:700;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;justify-content:center;padding:0 8px;text-transform:uppercase}' +
      '.ge2-kb-key:hover{background:rgba(255,255,255,0.25)}' +
      '.ge2-kb-key.correct{background:#538d4e}' +
      '.ge2-kb-key.present{background:#b59f3b}' +
      '.ge2-kb-key.absent{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.3)}' +
      '.ge2-kb-key.wide{min-width:52px;font-size:0.65rem}' +

      /* Chain links */
      '.ge2-chain{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0}' +
      '.ge2-chain-link{background:linear-gradient(135deg,rgba(0,201,167,0.15),rgba(255,215,0,0.1));border:1px solid rgba(0,201,167,0.3);border-radius:20px;padding:6px 14px;font-family:Inter,sans-serif;font-size:0.85rem;color:#00C9A7;animation:ge2-fadeIn 0.3s ease}' +

      /* Scroll card (riddle/proverb) */
      '.ge2-scroll{background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,107,53,0.05));border:2px solid rgba(255,215,0,0.2);border-radius:12px;padding:24px 20px;text-align:center;position:relative;margin-bottom:14px}' +
      '.ge2-scroll::before,.ge2-scroll::after{content:"";position:absolute;left:50%;transform:translateX(-50%);width:60%;height:3px;background:linear-gradient(90deg,transparent,rgba(255,215,0,0.3),transparent)}' +
      '.ge2-scroll::before{top:8px}' +
      '.ge2-scroll::after{bottom:8px}' +
      '.ge2-scroll-text{font-family:Inter,sans-serif;font-size:1.05rem;color:#eef;line-height:1.6;font-style:italic}' +

      /* Blank blink */
      '.ge2-blank{display:inline-block;border-bottom:3px solid #FFD700;padding:2px 8px;min-width:80px;animation:ge2-blink 1s infinite;color:#FFD700;font-weight:700}' +
      '.ge2-blank.filled{animation:none;border-color:#00C9A7;color:#00C9A7}' +

      /* Arabic number card */
      '.ge2-arabic-card{font-size:4rem;text-align:center;padding:20px;color:#FFD700;font-weight:700;text-shadow:0 0 20px rgba(255,215,0,0.3);line-height:1.2}' +
      '.ge2-arabic-word{font-family:Inter,sans-serif;font-size:1rem;color:rgba(255,255,255,0.4);text-align:center;margin-top:4px}' +

      /* Emoji art display */
      '.ge2-art{font-size:1.6rem;line-height:1.4;text-align:center;white-space:pre;font-family:monospace;padding:16px;letter-spacing:2px}' +

      /* Book / story container */
      '.ge2-book{background:linear-gradient(135deg,rgba(255,215,0,0.06),rgba(0,201,167,0.04));border:2px solid rgba(255,215,0,0.15);border-radius:12px;padding:20px;min-height:160px;max-height:280px;overflow-y:auto;margin-bottom:12px;width:100%;box-sizing:border-box}' +
      '.ge2-book-line{font-family:Inter,sans-serif;font-size:0.92rem;color:#eef;line-height:1.7;margin-bottom:6px;animation:ge2-slideUp 0.4s ease}' +
      '.ge2-book-line.rashid{color:#00C9A7;font-style:italic}' +
      '.ge2-book-line.player{color:#FFD700}' +

      /* Poetry */
      '.ge2-poem{text-align:center;font-style:italic}' +
      '.ge2-poem .ge2-book-line{text-align:center}' +

      /* Timer bar */
      '.ge2-timer{width:100%;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;margin:6px 0}' +
      '.ge2-timer-fill{height:100%;background:linear-gradient(90deg,#FF6B35,#FFD700);border-radius:3px;transition:width 0.1s linear}' +

      /* Hint button */
      '.ge2-hint-btn{font-family:Inter,sans-serif;font-size:0.75rem;color:rgba(255,215,0,0.6);background:none;border:1px solid rgba(255,215,0,0.2);border-radius:8px;padding:4px 12px;cursor:pointer;transition:all 0.2s}' +
      '.ge2-hint-btn:hover{color:#FFD700;border-color:rgba(255,215,0,0.5)}' +

      /* fadeIn util */
      '.ge2-fadeIn{animation:ge2-fadeIn 0.4s ease}' +
      '.ge2-celebPop{animation:ge2-celebPop 0.5s ease}' +

      /* Responsive */
      '@media(max-width:420px){.ge2-wordle-tile{width:38px;height:38px;font-size:1rem}.ge2-kb-key{min-width:22px;height:34px;font-size:0.6rem;padding:0 5px}.ge2-opt{min-width:110px;padding:10px 8px;font-size:0.8rem}}';

    document.head.appendChild(style);
  }

  /* ── Shared Helpers ── */
  function buildDots(current, total) {
    var html = '<div class="ge2-dots">';
    for (var i = 0; i < total; i++) {
      html += '<div class="ge2-dot' + (i < current ? ' done' : (i === current ? ' active' : '')) + '"></div>';
    }
    html += '</div>';
    return html;
  }

  function buildProgressBar(current, total) {
    var pct = Math.min(100, Math.round((current / total) * 100));
    return '<div class="ge2-pbar"><div class="ge2-pbar-fill" style="width:' + pct + '%"></div></div>';
  }

  function flashCard(el, correct) {
    var cls = correct ? 'flash-correct' : 'flash-wrong';
    el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, 600);
  }

  function disableOpts(container) {
    var opts = container.querySelectorAll('.ge2-opt');
    for (var i = 0; i < opts.length; i++) {
      opts[i].style.pointerEvents = 'none';
    }
  }

  function diffVal(diff, easy, med, hard) {
    if (diff === 'easy') return easy;
    if (diff === 'hard') return hard;
    return med;
  }

  /* ═══════════════════════════════════════════════════ */
  /*  1. SECRET WORD (Wordle Clone)                     */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'secret-word', name: 'Secret Word', emoji: '\uD83D\uDD24', category: 'word', has2P: false,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      var secretWords = ['pearl', 'oasis', 'camel', 'dates', 'henna', 'spice', 'abaya', 'souk'];
      var maxGuesses = diffVal(diff, 7, 6, 5);
      var answer = pick(secretWords).toUpperCase();
      var wordLen = answer.length;
      var currentRow = 0;
      var currentCol = 0;
      var currentGuess = '';
      var gameOver = false;
      var keyStates = {};

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      /* Title */
      wrap.innerHTML = '<div class="ge2-title">Guess the UAE Word!</div>' +
        '<div class="ge2-subtitle">' + maxGuesses + ' tries \u2022 ' + wordLen + ' letters</div>';

      /* Grid */
      var gridDiv = document.createElement('div');
      gridDiv.style.cssText = 'margin-bottom:10px;';
      for (var r = 0; r < maxGuesses; r++) {
        var rowDiv = document.createElement('div');
        rowDiv.className = 'ge2-wordle-row';
        rowDiv.setAttribute('data-row', r);
        for (var c = 0; c < wordLen; c++) {
          var tile = document.createElement('div');
          tile.className = 'ge2-wordle-tile';
          tile.setAttribute('data-row', r);
          tile.setAttribute('data-col', c);
          rowDiv.appendChild(tile);
        }
        gridDiv.appendChild(rowDiv);
      }
      wrap.appendChild(gridDiv);

      /* Keyboard */
      var kbRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
      var kbDiv = document.createElement('div');
      kbDiv.className = 'ge2-kb';
      for (var kr = 0; kr < kbRows.length; kr++) {
        var kbRow = document.createElement('div');
        kbRow.className = 'ge2-kb-row';
        if (kr === 2) {
          var enterKey = document.createElement('button');
          enterKey.className = 'ge2-kb-key wide';
          enterKey.textContent = 'ENT';
          enterKey.setAttribute('data-key', 'Enter');
          kbRow.appendChild(enterKey);
        }
        for (var ki = 0; ki < kbRows[kr].length; ki++) {
          var k = document.createElement('button');
          k.className = 'ge2-kb-key';
          k.textContent = kbRows[kr][ki];
          k.setAttribute('data-key', kbRows[kr][ki]);
          kbRow.appendChild(k);
        }
        if (kr === 2) {
          var bkKey = document.createElement('button');
          bkKey.className = 'ge2-kb-key wide';
          bkKey.textContent = '\u232B';
          bkKey.setAttribute('data-key', 'Backspace');
          kbRow.appendChild(bkKey);
        }
        kbDiv.appendChild(kbRow);
      }
      wrap.appendChild(kbDiv);

      /* Message area */
      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;min-height:24px;margin-top:8px;font-family:Inter,sans-serif;font-size:0.9rem;color:#eef;';
      wrap.appendChild(msgDiv);

      container.appendChild(wrap);

      function getTile(r, c) {
        return gridDiv.querySelector('[data-row="' + r + '"][data-col="' + c + '"]');
      }

      function handleKey(key) {
        if (gameOver) return;
        if (key === 'Backspace') {
          if (currentCol > 0) {
            currentCol--;
            currentGuess = currentGuess.slice(0, -1);
            var t = getTile(currentRow, currentCol);
            t.textContent = '';
            t.classList.remove('filled');
          }
          return;
        }
        if (key === 'Enter') {
          if (currentGuess.length !== wordLen) {
            msgDiv.textContent = 'Not enough letters!';
            self._timers.push(setTimeout(function () { msgDiv.textContent = ''; }, 1500));
            return;
          }
          revealRow();
          return;
        }
        if (/^[A-Z]$/.test(key) && currentCol < wordLen) {
          var t2 = getTile(currentRow, currentCol);
          t2.textContent = key;
          t2.classList.add('filled');
          currentGuess += key;
          currentCol++;
        }
      }

      function revealRow() {
        var guess = currentGuess.toUpperCase();
        var ansArr = answer.split('');
        var result = [];
        var used = [];

        /* First pass: correct positions */
        for (var i = 0; i < wordLen; i++) {
          if (guess[i] === ansArr[i]) {
            result[i] = 'correct';
            used[i] = true;
          } else {
            result[i] = 'absent';
            used[i] = false;
          }
        }
        /* Second pass: present but wrong position */
        for (var j = 0; j < wordLen; j++) {
          if (result[j] === 'correct') continue;
          for (var k = 0; k < wordLen; k++) {
            if (!used[k] && guess[j] === ansArr[k]) {
              result[j] = 'present';
              used[k] = true;
              break;
            }
          }
        }

        /* Animate tiles */
        for (var a = 0; a < wordLen; a++) {
          (function (idx) {
            self._timers.push(setTimeout(function () {
              var tile = getTile(currentRow, idx);
              tile.classList.add(result[idx]);

              /* Update keyboard */
              var letter = guess[idx];
              var prev = keyStates[letter];
              if (result[idx] === 'correct') {
                keyStates[letter] = 'correct';
              } else if (result[idx] === 'present' && prev !== 'correct') {
                keyStates[letter] = 'present';
              } else if (!prev) {
                keyStates[letter] = 'absent';
              }
              var kbBtn = kbDiv.querySelector('[data-key="' + letter + '"]');
              if (kbBtn) {
                kbBtn.className = 'ge2-kb-key';
                if (keyStates[letter]) kbBtn.classList.add(keyStates[letter]);
              }
            }, idx * 120));
          })(a);
        }

        self._timers.push(setTimeout(function () {
          if (guess === answer) {
            gameOver = true;
            var pts = (maxGuesses - currentRow) * 10;
            E.setScore(pts);
            E.rashidSay('Amazing! You got it in ' + (currentRow + 1) + ' tries!');
            msgDiv.innerHTML = '<span style="color:#00C9A7;font-weight:700">Correct! The word was ' + answer + '!</span>';
            E.endGame(pts, maxGuesses * 10);
            return;
          }
          currentRow++;
          if (currentRow >= maxGuesses) {
            gameOver = true;
            E.rashidSay('The word was ' + answer + '. Try again next time!');
            msgDiv.innerHTML = '<span style="color:#FF6B35">The word was <strong>' + answer + '</strong></span>';
            E.endGame(0, maxGuesses * 10);
            return;
          }
          currentCol = 0;
          currentGuess = '';
        }, wordLen * 120 + 200));
      }

      /* Keyboard click handler */
      kbDiv.addEventListener('click', function (e) {
        var key = e.target.getAttribute('data-key');
        if (key) handleKey(key);
      });

      /* Physical keyboard handler */
      function onKeyDown(e) {
        if (gameOver) return;
        if (e.key === 'Enter') handleKey('Enter');
        else if (e.key === 'Backspace') handleKey('Backspace');
        else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
      }
      document.addEventListener('keydown', onKeyDown);
      self._keyHandler = onKeyDown;
    },
    destroy: function () {
      if (this._keyHandler) {
        document.removeEventListener('keydown', this._keyHandler);
        this._keyHandler = null;
      }
      if (this._timers) {
        for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]);
        this._timers = [];
      }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  2. WORD CHAIN                                     */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'word-chain', name: 'Word Chain', emoji: '\uD83D\uDD17', category: 'word', has2P: true,
    _timers: [],
    _intervals: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];
      self._intervals = [];

      /* ── 2-Player Mode ── */
      if (mode === '2p') {
        var validWords2P = ['falcon', 'camel', 'pearl', 'desert', 'mosque', 'emirate', 'oasis', 'sand', 'gold', 'dirham', 'date', 'henna', 'khalifa', 'luqaimat', 'machboos', 'arabian', 'tower', 'dune', 'island', 'palace', 'abra', 'souk', 'dhow', 'burj', 'majlis', 'oryx', 'dolphin', 'flamingo', 'carpet', 'spice', 'eagle', 'eid', 'national', 'landmark', 'tradition', 'culture', 'heritage'];

        var timePerTurn2P = diffVal(diff, 20, 15, 10);
        var chain2P = [];
        var usedWords2P = {};
        var p1Lives = 3, p2Lives = 3;
        var currentPlayer = 1; /* 1 or 2 */
        var timerInterval2P = null;
        var timeLeft2P = timePerTurn2P;
        var gameEnded2P = false;

        /* Start with a random seed word */
        var startWord2P = pick(validWords2P);
        chain2P.push(startWord2P);
        usedWords2P[startWord2P] = true;

        var wrap2P = document.createElement('div');
        wrap2P.className = 'ge2-wrap';
        wrap2P.innerHTML = '<div class="ge2-title">Word Chain - 2 Players</div>' +
          '<div class="ge2-subtitle">Take turns! Each word must start with the last letter of the previous word.</div>';

        /* Turn indicator */
        var turnDiv = document.createElement('div');
        turnDiv.style.cssText = 'font-family:Orbitron,sans-serif;font-size:1.2rem;text-align:center;padding:10px 20px;border-radius:10px;margin:8px 0;width:100%;box-sizing:border-box;';
        wrap2P.appendChild(turnDiv);

        /* Lives display */
        var livesDiv = document.createElement('div');
        livesDiv.style.cssText = 'display:flex;justify-content:space-between;width:100%;font-family:Orbitron,sans-serif;font-size:0.85rem;margin-bottom:8px;';
        wrap2P.appendChild(livesDiv);

        /* Active letter */
        var letterDiv2P = document.createElement('div');
        letterDiv2P.style.cssText = 'font-family:Orbitron,sans-serif;font-size:2.5rem;color:#FFD700;text-align:center;margin:6px 0;text-shadow:0 0 20px rgba(255,215,0,0.4);';
        letterDiv2P.textContent = startWord2P.slice(-1).toUpperCase();
        wrap2P.appendChild(letterDiv2P);

        /* Timer bar */
        var timerWrap2P = document.createElement('div');
        timerWrap2P.className = 'ge2-timer';
        timerWrap2P.innerHTML = '<div class="ge2-timer-fill" style="width:100%"></div>';
        wrap2P.appendChild(timerWrap2P);

        /* Chain display */
        var chainDiv2P = document.createElement('div');
        chainDiv2P.className = 'ge2-chain';
        chainDiv2P.innerHTML = '<span class="ge2-chain-link" style="color:#FFD700">' + startWord2P + '</span>';
        wrap2P.appendChild(chainDiv2P);

        /* Input area */
        var inputRow2P = document.createElement('div');
        inputRow2P.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:12px;width:100%;justify-content:center;';
        var input2P = document.createElement('input');
        input2P.className = 'ge2-input';
        input2P.placeholder = 'Your word...';
        input2P.style.maxWidth = '220px';
        input2P.style.textTransform = 'lowercase';
        input2P.style.letterSpacing = '1px';
        var submitBtn2P = document.createElement('button');
        submitBtn2P.className = 'ge2-btn teal sm';
        submitBtn2P.textContent = 'Go!';
        inputRow2P.appendChild(input2P);
        inputRow2P.appendChild(submitBtn2P);
        wrap2P.appendChild(inputRow2P);

        /* Message */
        var msgDiv2P = document.createElement('div');
        msgDiv2P.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.6);';
        wrap2P.appendChild(msgDiv2P);

        container.appendChild(wrap2P);

        function updateTurnUI() {
          if (currentPlayer === 1) {
            turnDiv.style.border = '2px solid #4ecdc4';
            turnDiv.style.color = '#4ecdc4';
            turnDiv.style.background = 'rgba(78,205,196,0.1)';
            turnDiv.textContent = 'Player 1\'s Turn';
            input2P.style.borderColor = '#4ecdc4';
          } else {
            turnDiv.style.border = '2px solid #ff6b6b';
            turnDiv.style.color = '#ff6b6b';
            turnDiv.style.background = 'rgba(255,107,107,0.1)';
            turnDiv.textContent = 'Player 2\'s Turn';
            input2P.style.borderColor = '#ff6b6b';
          }
          livesDiv.innerHTML = '<span style="color:#4ecdc4">P1 Lives: ' + heartsStr(p1Lives) + '</span>' +
            '<span style="color:#ff6b6b">P2 Lives: ' + heartsStr(p2Lives) + '</span>';
        }

        function heartsStr(n) {
          var s = '';
          for (var i = 0; i < 3; i++) s += i < n ? '\u2764\uFE0F' : '\uD83D\uDDA4';
          return s;
        }

        function startTimer2P() {
          timeLeft2P = timePerTurn2P;
          var fill = timerWrap2P.querySelector('.ge2-timer-fill');
          if (timerInterval2P) clearInterval(timerInterval2P);
          timerInterval2P = setInterval(function () {
            timeLeft2P -= 0.1;
            if (timeLeft2P <= 0) {
              timeLeft2P = 0;
              fill.style.width = '0%';
              clearInterval(timerInterval2P);
              /* Current player loses a life */
              if (currentPlayer === 1) p1Lives--;
              else p2Lives--;
              msgDiv2P.textContent = 'Time\'s up! Player ' + currentPlayer + ' loses a life!';
              msgDiv2P.style.color = '#ff3b3b';
              if (p1Lives <= 0 || p2Lives <= 0) {
                endGame2P();
                return;
              }
              currentPlayer = currentPlayer === 1 ? 2 : 1;
              updateTurnUI();
              self._timers.push(setTimeout(function () {
                msgDiv2P.textContent = '';
                msgDiv2P.style.color = 'rgba(255,255,255,0.6)';
                startTimer2P();
                input2P.focus();
              }, 1200));
              return;
            }
            fill.style.width = Math.round((timeLeft2P / timePerTurn2P) * 100) + '%';
            if (timeLeft2P < 5) fill.style.background = 'linear-gradient(90deg,#ff3b3b,#FF6B35)';
            else fill.style.background = 'linear-gradient(90deg,#FF6B35,#FFD700)';
          }, 100);
          self._intervals.push(timerInterval2P);
        }

        function endGame2P() {
          if (gameEnded2P) return;
          gameEnded2P = true;
          if (timerInterval2P) clearInterval(timerInterval2P);
          input2P.disabled = true;
          submitBtn2P.classList.add('disabled');
          var winner;
          if (p1Lives <= 0) winner = 'Player 2 wins!';
          else if (p2Lives <= 0) winner = 'Player 1 wins!';
          else winner = p1Lives > p2Lives ? 'Player 1 wins!' : (p2Lives > p1Lives ? 'Player 2 wins!' : 'It\'s a tie!');
          E.rashidSay(winner + ' Great chain of ' + chain2P.length + ' words!');
          var finalScore = chain2P.length * 5;
          E.setScore(finalScore);
          E.endGame(finalScore, 100);
        }

        function submitWord2P() {
          if (gameEnded2P) return;
          var word = input2P.value.trim().toLowerCase();
          input2P.value = '';
          if (!word) return;

          var requiredLetter = chain2P[chain2P.length - 1].slice(-1).toLowerCase();

          if (word[0] !== requiredLetter) {
            msgDiv2P.textContent = 'Word must start with "' + requiredLetter.toUpperCase() + '"!';
            msgDiv2P.style.color = '#ff3b3b';
            self._timers.push(setTimeout(function () { msgDiv2P.textContent = ''; msgDiv2P.style.color = 'rgba(255,255,255,0.6)'; }, 1500));
            return;
          }
          if (usedWords2P[word]) {
            msgDiv2P.textContent = 'Already used!';
            msgDiv2P.style.color = '#ff3b3b';
            self._timers.push(setTimeout(function () { msgDiv2P.textContent = ''; msgDiv2P.style.color = 'rgba(255,255,255,0.6)'; }, 1500));
            return;
          }
          var isValid = false;
          for (var i = 0; i < validWords2P.length; i++) {
            if (validWords2P[i] === word) { isValid = true; break; }
          }
          if (!isValid) {
            msgDiv2P.textContent = 'Not a valid UAE word!';
            msgDiv2P.style.color = '#ff3b3b';
            self._timers.push(setTimeout(function () { msgDiv2P.textContent = ''; msgDiv2P.style.color = 'rgba(255,255,255,0.6)'; }, 1500));
            return;
          }

          /* Valid word! */
          chain2P.push(word);
          usedWords2P[word] = true;
          var link = document.createElement('span');
          link.className = 'ge2-chain-link';
          link.style.color = currentPlayer === 1 ? '#4ecdc4' : '#ff6b6b';
          link.textContent = word;
          chainDiv2P.appendChild(link);
          chainDiv2P.scrollLeft = chainDiv2P.scrollWidth;

          letterDiv2P.textContent = word.slice(-1).toUpperCase();

          /* Switch turns */
          currentPlayer = currentPlayer === 1 ? 2 : 1;
          updateTurnUI();
          startTimer2P();
          input2P.focus();
        }

        submitBtn2P.addEventListener('click', submitWord2P);
        input2P.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') submitWord2P();
        });

        updateTurnUI();
        startTimer2P();
        input2P.focus();
        return;
      }
      /* ── End 2-Player Mode ── */

      var validWords = ['falcon', 'camel', 'pearl', 'desert', 'mosque', 'emirate', 'oasis', 'sand', 'gold', 'dirham', 'date', 'henna', 'khalifa', 'luqaimat', 'machboos', 'arabian', 'tower', 'dune', 'island', 'palace', 'abra', 'souk', 'dhow', 'burj', 'majlis', 'oryx', 'dolphin', 'flamingo', 'carpet', 'spice', 'eagle', 'eid', 'national', 'landmark', 'tradition', 'culture', 'heritage'];

      var totalTurns = diffVal(diff, 6, 8, 12);
      var timePerTurn = diffVal(diff, 20, 15, 10);
      var chain = [];
      var score = 0;
      var turn = 0;
      var usedWords = {};
      var timerInterval = null;
      var timeLeft = timePerTurn;
      var gameEnded = false;

      /* Start with a random word from Rashid */
      var startWord = pick(validWords);
      chain.push({ word: startWord, by: 'rashid' });
      usedWords[startWord] = true;

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';
      wrap.innerHTML = '<div class="ge2-title">Word Chain</div>' +
        '<div class="ge2-subtitle">Type a UAE word starting with the last letter</div>';

      /* Active letter */
      var letterDiv = document.createElement('div');
      letterDiv.style.cssText = 'font-family:Orbitron,sans-serif;font-size:2.5rem;color:#FFD700;text-align:center;margin:6px 0;text-shadow:0 0 20px rgba(255,215,0,0.4);';
      letterDiv.textContent = startWord.slice(-1).toUpperCase();
      wrap.appendChild(letterDiv);

      /* Timer bar */
      var timerWrap = document.createElement('div');
      timerWrap.className = 'ge2-timer';
      timerWrap.innerHTML = '<div class="ge2-timer-fill" style="width:100%"></div>';
      wrap.appendChild(timerWrap);

      /* Chain display */
      var chainDiv = document.createElement('div');
      chainDiv.className = 'ge2-chain';
      chainDiv.innerHTML = '<span class="ge2-chain-link" style="color:#00C9A7">' + startWord + '</span>';
      wrap.appendChild(chainDiv);

      /* Input area */
      var inputRow = document.createElement('div');
      inputRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:12px;width:100%;justify-content:center;';
      var input = document.createElement('input');
      input.className = 'ge2-input';
      input.placeholder = 'Your word...';
      input.style.maxWidth = '220px';
      input.style.textTransform = 'lowercase';
      input.style.letterSpacing = '1px';
      var submitBtn = document.createElement('button');
      submitBtn.className = 'ge2-btn teal sm';
      submitBtn.textContent = 'Go!';
      inputRow.appendChild(input);
      inputRow.appendChild(submitBtn);
      wrap.appendChild(inputRow);

      /* Message */
      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.6);';
      wrap.appendChild(msgDiv);

      /* Progress */
      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      progDiv.innerHTML = buildDots(0, totalTurns);
      wrap.appendChild(progDiv);

      /* Score */
      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'ge2-score';
      scoreDiv.textContent = 'Score: 0';
      wrap.appendChild(scoreDiv);

      container.appendChild(wrap);

      function startTimer() {
        timeLeft = timePerTurn;
        var fill = timerWrap.querySelector('.ge2-timer-fill');
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(function () {
          timeLeft -= 0.1;
          if (timeLeft <= 0) {
            timeLeft = 0;
            fill.style.width = '0%';
            clearInterval(timerInterval);
            endGameNow();
            return;
          }
          fill.style.width = Math.round((timeLeft / timePerTurn) * 100) + '%';
          if (timeLeft < 5) fill.style.background = 'linear-gradient(90deg,#ff3b3b,#FF6B35)';
          else fill.style.background = 'linear-gradient(90deg,#FF6B35,#FFD700)';
        }, 100);
        self._intervals.push(timerInterval);
      }

      function endGameNow() {
        if (gameEnded) return;
        gameEnded = true;
        if (timerInterval) clearInterval(timerInterval);
        input.disabled = true;
        submitBtn.classList.add('disabled');
        E.rashidSay('Great chain! You linked ' + turn + ' words!');
        E.setScore(score);
        E.endGame(score, totalTurns * 10);
      }

      function addChainLink(word, by) {
        var link = document.createElement('span');
        link.className = 'ge2-chain-link';
        if (by === 'rashid') link.style.color = '#00C9A7';
        else link.style.color = '#FFD700';
        link.textContent = word;
        chainDiv.appendChild(link);
        chainDiv.scrollLeft = chainDiv.scrollWidth;
      }

      function getLastLetter() {
        return chain[chain.length - 1].word.slice(-1).toLowerCase();
      }

      function submitWord() {
        if (gameEnded) return;
        var word = input.value.trim().toLowerCase();
        input.value = '';
        if (!word) return;

        var requiredLetter = getLastLetter();

        if (word[0] !== requiredLetter) {
          msgDiv.textContent = 'Word must start with "' + requiredLetter.toUpperCase() + '"!';
          msgDiv.style.color = '#ff3b3b';
          self._timers.push(setTimeout(function () { msgDiv.textContent = ''; msgDiv.style.color = 'rgba(255,255,255,0.6)'; }, 1500));
          return;
        }
        if (usedWords[word]) {
          msgDiv.textContent = 'Already used!';
          msgDiv.style.color = '#ff3b3b';
          self._timers.push(setTimeout(function () { msgDiv.textContent = ''; msgDiv.style.color = 'rgba(255,255,255,0.6)'; }, 1500));
          return;
        }
        var isValid = false;
        for (var i = 0; i < validWords.length; i++) {
          if (validWords[i] === word) { isValid = true; break; }
        }
        if (!isValid) {
          msgDiv.textContent = 'Not a valid UAE word!';
          msgDiv.style.color = '#ff3b3b';
          self._timers.push(setTimeout(function () { msgDiv.textContent = ''; msgDiv.style.color = 'rgba(255,255,255,0.6)'; }, 1500));
          return;
        }

        /* Valid word! */
        chain.push({ word: word, by: 'player' });
        usedWords[word] = true;
        addChainLink(word, 'player');
        turn++;
        score += 10;
        E.setScore(score);
        scoreDiv.textContent = 'Score: ' + score;
        progDiv.innerHTML = buildDots(turn, totalTurns);

        if (turn >= totalTurns) {
          endGameNow();
          return;
        }

        /* Rashid's turn */
        var lastLetter = word.slice(-1).toLowerCase();
        letterDiv.textContent = lastLetter.toUpperCase();
        var possible = [];
        for (var j = 0; j < validWords.length; j++) {
          if (validWords[j][0] === lastLetter && !usedWords[validWords[j]]) {
            possible.push(validWords[j]);
          }
        }
        if (possible.length > 0) {
          var rashidWord = pick(possible);
          self._timers.push(setTimeout(function () {
            chain.push({ word: rashidWord, by: 'rashid' });
            usedWords[rashidWord] = true;
            addChainLink(rashidWord, 'rashid');
            letterDiv.textContent = rashidWord.slice(-1).toUpperCase();
            startTimer();
            input.focus();
          }, 800));
        } else {
          /* Rashid can't continue */
          self._timers.push(setTimeout(function () {
            E.rashidSay('I can\'t think of a word! You win!');
            score += 20;
            E.setScore(score);
            endGameNow();
          }, 500));
        }
      }

      submitBtn.addEventListener('click', submitWord);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') submitWord();
      });

      startTimer();
      input.focus();
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
      if (this._intervals) { for (var j = 0; j < this._intervals.length; j++) clearInterval(this._intervals[j]); this._intervals = []; }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  3. RIDDLE ME                                      */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'riddle-me', name: 'Riddle Me', emoji: '\uD83E\uDDE9', category: 'word', has2P: false,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      var riddles = [
        { q: "I'm the tallest building in the world, in Dubai.", a: 'burj khalifa' },
        { q: "I'm a bird used in traditional Emirati sport.", a: 'falcon' },
        { q: "I'm small, round, sweet, covered in date syrup.", a: 'luqaimat' },
        { q: "I'm found in oysters under the Arabian Gulf.", a: 'pearl' },
        { q: "I'm called the ship of the desert.", a: 'camel' },
        { q: "I have 82 domes and I'm in Abu Dhabi.", a: 'mosque' },
        { q: "I'm a picture frame you can walk through, 150m tall!", a: 'dubai frame' },
        { q: "I'm a traditional market for spices and gold.", a: 'souk' },
        { q: "I'm the currency used in the UAE.", a: 'dirham' },
        { q: "I grow on palm trees, served with Arabic coffee.", a: 'dates' }
      ];

      var totalQ = diffVal(diff, 5, 7, 10);
      var questions = shuffle(riddles).slice(0, totalQ);
      var idx = 0;
      var score = 0;
      var hintUsed = false;

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'ge2-title';
      titleDiv.textContent = 'Riddle Me!';
      wrap.appendChild(titleDiv);

      var scrollDiv = document.createElement('div');
      scrollDiv.className = 'ge2-scroll ge2-card';
      wrap.appendChild(scrollDiv);

      var hintBtn = document.createElement('button');
      hintBtn.className = 'ge2-hint-btn';
      hintBtn.textContent = 'Show Hint (-5 pts)';
      wrap.appendChild(hintBtn);

      var hintDiv = document.createElement('div');
      hintDiv.style.cssText = 'text-align:center;font-family:Inter,sans-serif;font-size:0.8rem;color:rgba(255,215,0,0.5);min-height:20px;margin:4px 0;';
      wrap.appendChild(hintDiv);

      var inputRow = document.createElement('div');
      inputRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:8px;width:100%;justify-content:center;';
      var input = document.createElement('input');
      input.className = 'ge2-input';
      input.placeholder = 'Your answer...';
      input.style.textTransform = 'lowercase';
      var goBtn = document.createElement('button');
      goBtn.className = 'ge2-btn teal sm';
      goBtn.textContent = 'Answer';
      inputRow.appendChild(input);
      inputRow.appendChild(goBtn);
      wrap.appendChild(inputRow);

      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;';
      wrap.appendChild(msgDiv);

      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      wrap.appendChild(progDiv);

      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'ge2-score';
      wrap.appendChild(scoreDiv);

      container.appendChild(wrap);

      function showRiddle() {
        if (idx >= totalQ) {
          E.rashidSay('Great riddling! You scored ' + score + ' points!');
          E.endGame(score, totalQ * 10);
          return;
        }
        hintUsed = false;
        hintDiv.textContent = '';
        msgDiv.textContent = '';
        input.value = '';
        input.disabled = false;
        goBtn.classList.remove('disabled');
        scrollDiv.classList.remove('flash-correct', 'flash-wrong');
        var r = questions[idx];
        scrollDiv.innerHTML = '<div class="ge2-scroll-text">' + r.q + '</div>';
        progDiv.innerHTML = buildDots(idx, totalQ);
        scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
        input.focus();
      }

      function checkAnswer() {
        var userAns = input.value.trim().toLowerCase();
        if (!userAns) return;
        var correct = questions[idx].a.toLowerCase();
        input.disabled = true;
        goBtn.classList.add('disabled');

        if (userAns === correct) {
          var pts = hintUsed ? 5 : 10;
          score += pts;
          E.setScore(score);
          flashCard(scrollDiv, true);
          scrollDiv.innerHTML = '<div class="ge2-scroll-text" style="color:#00C9A7">\u2705 ' + questions[idx].a.toUpperCase() + '</div>';
          msgDiv.innerHTML = '<span style="color:#00C9A7">Correct! +' + pts + ' pts</span>';
          E.rashidSay(pick(['Brilliant!', 'You got it!', 'Mashallah!', 'Correct!']));
        } else {
          flashCard(scrollDiv, false);
          scrollDiv.innerHTML = '<div class="ge2-scroll-text" style="color:#ff3b3b">\u274C Answer: ' + questions[idx].a.toUpperCase() + '</div>';
          msgDiv.innerHTML = '<span style="color:#ff3b3b">Not quite! The answer was ' + questions[idx].a + '</span>';
        }

        idx++;
        self._timers.push(setTimeout(showRiddle, 2000));
      }

      hintBtn.addEventListener('click', function () {
        if (hintUsed || idx >= totalQ) return;
        hintUsed = true;
        var ans = questions[idx].a;
        var hint = 'Starts with "' + ans[0].toUpperCase() + '" \u2022 ' + ans.length + ' letters';
        hintDiv.textContent = hint;
      });

      goBtn.addEventListener('click', checkAnswer);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') checkAnswer(); });

      showRiddle();
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  4. FINISH THE FACT                                */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'finish-fact', name: 'Finish the Fact', emoji: '\uD83D\uDCDD', category: 'word', has2P: false,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      var finishFacts = [
        { start: 'The tallest building in the world is the ___', opts: ['Dubai Frame', 'Burj Khalifa', 'CN Tower', 'Petronas'], a: 1 },
        { start: 'The UAE is made up of ___ emirates', opts: ['5', '6', '7', '8'], a: 2 },
        { start: 'The capital of the UAE is ___', opts: ['Dubai', 'Sharjah', 'Abu Dhabi', 'Ajman'], a: 2 },
        { start: 'The UAE currency is called the ___', opts: ['Riyal', 'Dinar', 'Pound', 'Dirham'], a: 3 },
        { start: 'The national bird of the UAE is the ___', opts: ['Eagle', 'Falcon', 'Hawk', 'Parrot'], a: 1 },
        { start: 'UAE National Day is on December ___', opts: ['1', '2', '25', '31'], a: 1 },
        { start: 'The Hope Probe went to ___', opts: ['Moon', 'Jupiter', 'Mars', 'Venus'], a: 2 },
        { start: 'Sweet dumplings in date syrup are called ___', opts: ['Harees', 'Machboos', 'Balaleet', 'Luqaimat'], a: 3 }
      ];

      var totalQ = diffVal(diff, 5, 7, 8);
      var questions = shuffle(finishFacts).slice(0, totalQ);
      var idx = 0;
      var score = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'ge2-title';
      titleDiv.textContent = 'Finish the Fact!';
      wrap.appendChild(titleDiv);

      var factCard = document.createElement('div');
      factCard.className = 'ge2-card';
      wrap.appendChild(factCard);

      var optsDiv = document.createElement('div');
      optsDiv.className = 'ge2-opts';
      wrap.appendChild(optsDiv);

      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;';
      wrap.appendChild(msgDiv);

      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      wrap.appendChild(progDiv);

      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'ge2-score';
      wrap.appendChild(scoreDiv);

      container.appendChild(wrap);

      function showFact() {
        if (idx >= totalQ) {
          E.rashidSay('You know your facts! Score: ' + score + '/' + (totalQ * 10));
          E.endGame(score, totalQ * 10);
          return;
        }
        msgDiv.textContent = '';
        factCard.classList.remove('flash-correct', 'flash-wrong');
        var q = questions[idx];
        var parts = q.start.split('___');
        factCard.innerHTML = '<div style="font-family:Inter,sans-serif;font-size:1.05rem;color:#eef;text-align:center;line-height:1.6">' +
          parts[0] + '<span class="ge2-blank" id="ge2ff-blank">___</span>' + (parts[1] || '') + '</div>';

        optsDiv.innerHTML = '';
        var shuffledOpts = [];
        for (var i = 0; i < q.opts.length; i++) {
          shuffledOpts.push({ text: q.opts[i], isCorrect: i === q.a });
        }
        shuffledOpts = shuffle(shuffledOpts);

        for (var j = 0; j < shuffledOpts.length; j++) {
          (function (opt) {
            var btn = document.createElement('button');
            btn.className = 'ge2-opt';
            btn.textContent = opt.text;
            btn.addEventListener('click', function () {
              disableOpts(optsDiv);
              if (opt.isCorrect) {
                btn.classList.add('correct');
                flashCard(factCard, true);
                var blank = document.getElementById('ge2ff-blank');
                if (blank) {
                  blank.textContent = opt.text;
                  blank.classList.add('filled');
                }
                score += 10;
                E.setScore(score);
                msgDiv.innerHTML = '<span style="color:#00C9A7">Correct! +10 pts</span>';
                E.rashidSay(pick(['Excellent!', 'That\'s right!', 'Smart!', 'Mashallah!']));
              } else {
                btn.classList.add('wrong');
                flashCard(factCard, false);
                /* Highlight correct */
                var allOpts = optsDiv.querySelectorAll('.ge2-opt');
                for (var k = 0; k < allOpts.length; k++) {
                  for (var m = 0; m < shuffledOpts.length; m++) {
                    if (allOpts[k].textContent === shuffledOpts[m].text && shuffledOpts[m].isCorrect) {
                      allOpts[k].classList.add('correct');
                    }
                  }
                }
                var blank2 = document.getElementById('ge2ff-blank');
                if (blank2) {
                  blank2.textContent = q.opts[q.a];
                  blank2.classList.add('filled');
                  blank2.style.color = '#ff3b3b';
                  blank2.style.borderColor = '#ff3b3b';
                }
                msgDiv.innerHTML = '<span style="color:#ff3b3b">The answer was: ' + q.opts[q.a] + '</span>';
              }
              idx++;
              progDiv.innerHTML = buildDots(idx, totalQ);
              scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
              self._timers.push(setTimeout(showFact, 1800));
            });
            optsDiv.appendChild(btn);
          })(shuffledOpts[j]);
        }

        progDiv.innerHTML = buildDots(idx, totalQ);
        scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
      }

      showFact();
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  5. ARABIC NUMBERS                                 */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'arabic-numbers', name: 'Arabic Numbers', emoji: '\uD83D\uDD22', category: 'word', has2P: true,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      /* ── 2-Player Mode ── */
      if (mode === '2p') {
        var nums2P = [
          { arabic: '\u0661', english: '1', word: 'Wahid' },
          { arabic: '\u0662', english: '2', word: 'Ithnan' },
          { arabic: '\u0663', english: '3', word: 'Thalatha' },
          { arabic: '\u0664', english: '4', word: 'Arba\'a' },
          { arabic: '\u0665', english: '5', word: 'Khamsa' },
          { arabic: '\u0666', english: '6', word: 'Sitta' },
          { arabic: '\u0667', english: '7', word: 'Sab\'a' },
          { arabic: '\u0668', english: '8', word: 'Thamania' },
          { arabic: '\u0669', english: '9', word: 'Tis\'a' },
          { arabic: '\u0661\u0660', english: '10', word: 'Ashara' }
        ];

        var totalQ2 = 10;
        var questions2 = shuffle(nums2P).slice(0, totalQ2);
        var idx2 = 0;
        var p1Score = 0, p2Score = 0;

        var wrap2 = document.createElement('div');
        wrap2.className = 'ge2-wrap';

        var titleDiv2 = document.createElement('div');
        titleDiv2.className = 'ge2-title';
        titleDiv2.textContent = 'Arabic Numbers - 2 Players';
        wrap2.appendChild(titleDiv2);

        var scoreBar2 = document.createElement('div');
        scoreBar2.style.cssText = 'display:flex;justify-content:space-between;width:100%;font-family:Orbitron,sans-serif;font-size:0.9rem;margin-bottom:8px;';
        scoreBar2.innerHTML = '<span style="color:#4ecdc4">P1: 0</span><span style="color:#ff6b6b">P2: 0</span>';
        wrap2.appendChild(scoreBar2);

        var numCard2 = document.createElement('div');
        numCard2.className = 'ge2-card';
        numCard2.style.cssText += 'text-align:center;';
        wrap2.appendChild(numCard2);

        var msgDiv2 = document.createElement('div');
        msgDiv2.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;';
        wrap2.appendChild(msgDiv2);

        var splitDiv2 = document.createElement('div');
        splitDiv2.style.cssText = 'display:flex;gap:12px;width:100%;margin-top:10px;';
        var p1Col2 = document.createElement('div');
        p1Col2.style.cssText = 'flex:1;border:2px solid #4ecdc4;border-radius:12px;padding:10px;';
        p1Col2.innerHTML = '<div style="text-align:center;font-family:Orbitron,sans-serif;font-size:0.8rem;color:#4ecdc4;margin-bottom:8px;">Player 1</div>';
        var p1Opts2 = document.createElement('div');
        p1Opts2.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
        p1Col2.appendChild(p1Opts2);

        var p2Col2 = document.createElement('div');
        p2Col2.style.cssText = 'flex:1;border:2px solid #ff6b6b;border-radius:12px;padding:10px;';
        p2Col2.innerHTML = '<div style="text-align:center;font-family:Orbitron,sans-serif;font-size:0.8rem;color:#ff6b6b;margin-bottom:8px;">Player 2</div>';
        var p2Opts2 = document.createElement('div');
        p2Opts2.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
        p2Col2.appendChild(p2Opts2);

        splitDiv2.appendChild(p1Col2);
        splitDiv2.appendChild(p2Col2);
        wrap2.appendChild(splitDiv2);

        var progDiv2 = document.createElement('div');
        progDiv2.style.cssText = 'width:100%;margin-top:8px;';
        wrap2.appendChild(progDiv2);

        container.appendChild(wrap2);

        function showQuestion2P() {
          if (idx2 >= totalQ2) {
            var winner = p1Score > p2Score ? 'Player 1 wins!' : (p2Score > p1Score ? 'Player 2 wins!' : 'It\'s a tie!');
            E.rashidSay(winner + ' P1: ' + p1Score + ' - P2: ' + p2Score);
            E.setScore(Math.max(p1Score, p2Score));
            E.endGame(Math.max(p1Score, p2Score), totalQ2);
            return;
          }
          msgDiv2.textContent = '';
          numCard2.classList.remove('flash-correct', 'flash-wrong');

          var q = questions2[idx2];
          numCard2.innerHTML = '<div class="ge2-arabic-card">' + q.arabic + '</div>' +
            '<div class="ge2-arabic-word">What number is this?</div>';

          /* Build options: correct + 3 random wrong */
          var wrongOpts = [];
          for (var i = 0; i < nums2P.length; i++) {
            if (nums2P[i].english !== q.english) wrongOpts.push(nums2P[i]);
          }
          wrongOpts = shuffle(wrongOpts).slice(0, 3);
          var allOpts = [{ text: q.english + ' (' + q.word + ')', isCorrect: true }];
          for (var j = 0; j < wrongOpts.length; j++) {
            allOpts.push({ text: wrongOpts[j].english + ' (' + wrongOpts[j].word + ')', isCorrect: false });
          }
          allOpts = shuffle(allOpts);

          var roundAnswered = false;

          function buildNumOptButtons(parentEl, player) {
            parentEl.innerHTML = '';
            for (var k = 0; k < allOpts.length; k++) {
              (function (opt) {
                var btn = document.createElement('button');
                btn.className = 'ge2-opt';
                btn.style.cssText = 'min-width:auto;flex:none;width:100%;padding:10px 8px;font-size:0.82rem;';
                btn.textContent = opt.text;
                btn.addEventListener('click', function () {
                  if (roundAnswered) return;
                  roundAnswered = true;
                  disableOpts(p1Opts2);
                  disableOpts(p2Opts2);
                  if (opt.isCorrect) {
                    btn.classList.add('correct');
                    flashCard(numCard2, true);
                    if (player === 1) {
                      p1Score++;
                      msgDiv2.innerHTML = '<span style="color:#4ecdc4">Player 1 scores! +1</span>';
                    } else {
                      p2Score++;
                      msgDiv2.innerHTML = '<span style="color:#ff6b6b">Player 2 scores! +1</span>';
                    }
                    numCard2.innerHTML = '<div class="ge2-arabic-card ge2-celebPop" style="color:#00C9A7">' + q.arabic + ' = ' + q.english + '</div>' +
                      '<div class="ge2-arabic-word" style="color:#00C9A7">' + q.word + '</div>';
                    E.setScore(Math.max(p1Score, p2Score));
                    E.rashidSay(pick(['Fast!', 'Ahsant!', 'Mumtaz!', 'Quick fingers!']));
                  } else {
                    btn.classList.add('wrong');
                    flashCard(numCard2, false);
                    msgDiv2.innerHTML = '<span style="color:#ff3b3b">Wrong! It was ' + q.english + ' (' + q.word + ')</span>';
                    /* highlight correct in both columns */
                    var allBtns = splitDiv2.querySelectorAll('.ge2-opt');
                    for (var m = 0; m < allBtns.length; m++) {
                      for (var n = 0; n < allOpts.length; n++) {
                        if (allBtns[m].textContent === allOpts[n].text && allOpts[n].isCorrect) {
                          allBtns[m].classList.add('correct');
                        }
                      }
                    }
                  }
                  scoreBar2.innerHTML = '<span style="color:#4ecdc4">P1: ' + p1Score + '</span><span style="color:#ff6b6b">P2: ' + p2Score + '</span>';
                  idx2++;
                  progDiv2.innerHTML = buildDots(idx2, totalQ2);
                  self._timers.push(setTimeout(showQuestion2P, 1800));
                });
                parentEl.appendChild(btn);
              })(allOpts[k]);
            }
          }

          buildNumOptButtons(p1Opts2, 1);
          buildNumOptButtons(p2Opts2, 2);
          progDiv2.innerHTML = buildDots(idx2, totalQ2);
        }

        showQuestion2P();
        return;
      }
      /* ── End 2-Player Mode ── */

      var nums = [
        { arabic: '\u0661', english: '1', word: 'Wahid' },
        { arabic: '\u0662', english: '2', word: 'Ithnan' },
        { arabic: '\u0663', english: '3', word: 'Thalatha' },
        { arabic: '\u0664', english: '4', word: 'Arba\'a' },
        { arabic: '\u0665', english: '5', word: 'Khamsa' },
        { arabic: '\u0666', english: '6', word: 'Sitta' },
        { arabic: '\u0667', english: '7', word: 'Sab\'a' },
        { arabic: '\u0668', english: '8', word: 'Thamania' },
        { arabic: '\u0669', english: '9', word: 'Tis\'a' },
        { arabic: '\u0661\u0660', english: '10', word: 'Ashara' }
      ];

      var totalQ = diffVal(diff, 5, 8, 10);
      var questions = shuffle(nums).slice(0, totalQ);
      var idx = 0;
      var score = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'ge2-title';
      titleDiv.textContent = 'Arabic Numbers';
      wrap.appendChild(titleDiv);

      var numCard = document.createElement('div');
      numCard.className = 'ge2-card';
      numCard.style.cssText += 'text-align:center;';
      wrap.appendChild(numCard);

      var optsDiv = document.createElement('div');
      optsDiv.className = 'ge2-opts';
      wrap.appendChild(optsDiv);

      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;';
      wrap.appendChild(msgDiv);

      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      wrap.appendChild(progDiv);

      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'ge2-score';
      wrap.appendChild(scoreDiv);

      container.appendChild(wrap);

      function showQuestion() {
        if (idx >= totalQ) {
          E.rashidSay('Great job with Arabic numbers! Score: ' + score + '/' + (totalQ * 10));
          E.endGame(score, totalQ * 10);
          return;
        }
        msgDiv.textContent = '';
        numCard.classList.remove('flash-correct', 'flash-wrong');

        var q = questions[idx];
        numCard.innerHTML = '<div class="ge2-arabic-card">' + q.arabic + '</div>' +
          '<div class="ge2-arabic-word">What number is this?</div>';

        /* Build options: correct + 3 random wrong */
        var wrongOpts = [];
        for (var i = 0; i < nums.length; i++) {
          if (nums[i].english !== q.english) wrongOpts.push(nums[i]);
        }
        wrongOpts = shuffle(wrongOpts).slice(0, 3);
        var allOpts = [{ text: q.english + ' (' + q.word + ')', isCorrect: true }];
        for (var j = 0; j < wrongOpts.length; j++) {
          allOpts.push({ text: wrongOpts[j].english + ' (' + wrongOpts[j].word + ')', isCorrect: false });
        }
        allOpts = shuffle(allOpts);

        optsDiv.innerHTML = '';
        for (var k = 0; k < allOpts.length; k++) {
          (function (opt) {
            var btn = document.createElement('button');
            btn.className = 'ge2-opt';
            btn.textContent = opt.text;
            btn.addEventListener('click', function () {
              disableOpts(optsDiv);
              if (opt.isCorrect) {
                btn.classList.add('correct');
                flashCard(numCard, true);
                numCard.innerHTML = '<div class="ge2-arabic-card ge2-celebPop" style="color:#00C9A7">' + q.arabic + ' = ' + q.english + '</div>' +
                  '<div class="ge2-arabic-word" style="color:#00C9A7">' + q.word + '</div>';
                score += 10;
                E.setScore(score);
                msgDiv.innerHTML = '<span style="color:#00C9A7">Correct! +10 pts</span>';
                E.rashidSay(pick(['Ahsant!', 'Excellent!', 'Mumtaz!', 'You know Arabic!']));
              } else {
                btn.classList.add('wrong');
                flashCard(numCard, false);
                var allOptBtns = optsDiv.querySelectorAll('.ge2-opt');
                for (var m = 0; m < allOptBtns.length; m++) {
                  for (var n = 0; n < allOpts.length; n++) {
                    if (allOptBtns[m].textContent === allOpts[n].text && allOpts[n].isCorrect) {
                      allOptBtns[m].classList.add('correct');
                    }
                  }
                }
                msgDiv.innerHTML = '<span style="color:#ff3b3b">It was ' + q.english + ' (' + q.word + ')</span>';
              }
              idx++;
              progDiv.innerHTML = buildDots(idx, totalQ);
              scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
              self._timers.push(setTimeout(showQuestion, 1800));
            });
            optsDiv.appendChild(btn);
          })(allOpts[k]);
        }

        progDiv.innerHTML = buildDots(idx, totalQ);
        scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
      }

      showQuestion();
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  6. ARABIC GREETINGS                               */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'arabic-greetings', name: 'Arabic Greetings', emoji: '\uD83D\uDDE3\uFE0F', category: 'word', has2P: false,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      var greetings = [
        { arabic: 'As-salamu Alaykum', meaning: 'Peace be upon you', opts: ['Peace be upon you', 'Thank you', 'Let\'s go', 'My dear'], a: 0 },
        { arabic: 'Marhaba', meaning: 'Hello / Welcome', opts: ['Goodbye', 'Hello / Welcome', 'Please', 'Sorry'], a: 1 },
        { arabic: 'Shukran', meaning: 'Thank you', opts: ['Hello', 'Sorry', 'Thank you', 'Please'], a: 2 },
        { arabic: 'Inshallah', meaning: 'God willing', opts: ['Amazing', 'God willing', 'Thank God', 'Let\'s go'], a: 1 },
        { arabic: 'Mashallah', meaning: 'God has willed it (appreciation)', opts: ['Let\'s go', 'Goodbye', 'God has willed it', 'Peace'], a: 2 },
        { arabic: 'Yalla', meaning: 'Let\'s go!', opts: ['Thank you', 'Sorry', 'Hello', 'Let\'s go!'], a: 3 },
        { arabic: 'Habibi', meaning: 'My dear / My love', opts: ['My dear', 'Thank you', 'Sorry', 'Goodbye'], a: 0 },
        { arabic: 'Ma\'a Salama', meaning: 'Goodbye (with peace)', opts: ['Hello', 'Thank you', 'Come here', 'Goodbye'], a: 3 }
      ];

      var totalQ = diffVal(diff, 5, 7, 8);
      var questions = shuffle(greetings).slice(0, totalQ);
      var idx = 0;
      var score = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'ge2-title';
      titleDiv.textContent = 'Arabic Greetings';
      wrap.appendChild(titleDiv);

      var phraseCard = document.createElement('div');
      phraseCard.className = 'ge2-card';
      phraseCard.style.cssText += 'text-align:center;';
      wrap.appendChild(phraseCard);

      var optsDiv = document.createElement('div');
      optsDiv.className = 'ge2-opts';
      wrap.appendChild(optsDiv);

      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;';
      wrap.appendChild(msgDiv);

      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      wrap.appendChild(progDiv);

      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'ge2-score';
      wrap.appendChild(scoreDiv);

      container.appendChild(wrap);

      function showPhrase() {
        if (idx >= totalQ) {
          E.rashidSay('You speak Arabic well! Score: ' + score + '/' + (totalQ * 10));
          E.endGame(score, totalQ * 10);
          return;
        }
        msgDiv.textContent = '';
        phraseCard.classList.remove('flash-correct', 'flash-wrong');

        var q = questions[idx];
        phraseCard.innerHTML = '<div style="font-family:Orbitron,sans-serif;font-size:1.8rem;color:#FFD700;margin-bottom:8px;text-shadow:0 0 16px rgba(255,215,0,0.3)">' + q.arabic + '</div>' +
          '<div style="font-family:Inter,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.4)">What does this mean?</div>';

        /* Build shuffled options preserving correct index */
        var optData = [];
        for (var i = 0; i < q.opts.length; i++) {
          optData.push({ text: q.opts[i], isCorrect: i === q.a });
        }
        optData = shuffle(optData);

        optsDiv.innerHTML = '';
        for (var j = 0; j < optData.length; j++) {
          (function (opt) {
            var btn = document.createElement('button');
            btn.className = 'ge2-opt';
            btn.textContent = opt.text;
            btn.addEventListener('click', function () {
              disableOpts(optsDiv);
              if (opt.isCorrect) {
                btn.classList.add('correct');
                flashCard(phraseCard, true);
                phraseCard.innerHTML = '<div style="font-family:Orbitron,sans-serif;font-size:1.5rem;color:#00C9A7;margin-bottom:4px">' + q.arabic + '</div>' +
                  '<div style="font-family:Inter,sans-serif;font-size:1rem;color:#00C9A7">' + q.meaning + '</div>';
                score += 10;
                E.setScore(score);
                msgDiv.innerHTML = '<span style="color:#00C9A7">Correct! +10 pts</span>';
                E.rashidSay(pick(['Mumtaz!', 'You know Arabic!', 'Bravo!', 'Mashallah!']));
              } else {
                btn.classList.add('wrong');
                flashCard(phraseCard, false);
                var allBtns = optsDiv.querySelectorAll('.ge2-opt');
                for (var k = 0; k < allBtns.length; k++) {
                  for (var m = 0; m < optData.length; m++) {
                    if (allBtns[k].textContent === optData[m].text && optData[m].isCorrect) {
                      allBtns[k].classList.add('correct');
                    }
                  }
                }
                msgDiv.innerHTML = '<span style="color:#ff3b3b">It means: ' + q.meaning + '</span>';
              }
              idx++;
              progDiv.innerHTML = buildDots(idx, totalQ);
              scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
              self._timers.push(setTimeout(showPhrase, 1800));
            });
            optsDiv.appendChild(btn);
          })(optData[j]);
        }

        progDiv.innerHTML = buildDots(idx, totalQ);
        scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
      }

      showPhrase();
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  7. EMOJI GUESS                                    */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'emoji-guess', name: 'Emoji Guess', emoji: '\uD83D\uDE0E', category: 'word', has2P: true,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      /* ── 2-Player Mode ── */
      if (mode === '2p') {
        var emojiGuesses2P = [
          { emojis: '\uD83C\uDFD7\uFE0F\uD83D\uDCCF\uD83C\uDF06', opts: ['Dubai Frame', 'Burj Khalifa', 'CN Tower', 'Petronas'], a: 1 },
          { emojis: '\uD83D\uDD4C\u2B1C\uD83E\uDD32', opts: ['Church', 'Temple', 'Mosque', 'Palace'], a: 2 },
          { emojis: '\uD83D\uDC2A\uD83C\uDFDC\uFE0F\u2600\uFE0F', opts: ['Beach', 'Desert', 'Mountain', 'Forest'], a: 1 },
          { emojis: '\uD83E\uDD85\uD83D\uDC51\uD83E\uDDE4', opts: ['Eagle', 'Parrot', 'Falcon', 'Hawk'], a: 2 },
          { emojis: '\uD83E\uDED8\uD83C\uDF6F\uD83C\uDF61', opts: ['Machboos', 'Harees', 'Balaleet', 'Luqaimat'], a: 3 },
          { emojis: '\u26F5\uD83D\uDC1A\uD83D\uDC8E', opts: ['Fishing', 'Pearl Diving', 'Surfing', 'Sailing'], a: 1 },
          { emojis: '\uD83D\uDDBC\uFE0F\uD83C\uDFD9\uFE0F\uD83C\uDF09', opts: ['Burj Khalifa', 'Palm Tower', 'Dubai Frame', 'Marina'], a: 2 },
          { emojis: '\u2615\uD83E\uDED6\uD83E\uDD1D', opts: ['English Tea', 'Arabic Coffee', 'Chai', 'Juice'], a: 1 },
          { emojis: '\uD83C\uDF34\uD83D\uDFE4\uD83C\uDF6C', opts: ['Coconut', 'Bananas', 'Dates', 'Figs'], a: 2 },
          { emojis: '\uD83C\uDFD6\uFE0F\uD83C\uDF0A\uD83C\uDFDD\uFE0F', opts: ['Desert', 'Mountain', 'Island', 'Valley'], a: 2 }
        ];

        var totalQ2 = diffVal(diff, 6, 8, 10);
        var questions2 = shuffle(emojiGuesses2P).slice(0, totalQ2);
        var idx2 = 0;
        var p1Score = 0, p2Score = 0;

        var wrap2 = document.createElement('div');
        wrap2.className = 'ge2-wrap';

        var titleDiv2 = document.createElement('div');
        titleDiv2.className = 'ge2-title';
        titleDiv2.textContent = 'Emoji Guess - 2 Players';
        wrap2.appendChild(titleDiv2);

        var scoreBar2 = document.createElement('div');
        scoreBar2.style.cssText = 'display:flex;justify-content:space-between;width:100%;font-family:Orbitron,sans-serif;font-size:0.9rem;margin-bottom:8px;';
        scoreBar2.innerHTML = '<span style="color:#4ecdc4">P1: 0</span><span style="color:#ff6b6b">P2: 0</span>';
        wrap2.appendChild(scoreBar2);

        var emojiCard2 = document.createElement('div');
        emojiCard2.className = 'ge2-card';
        wrap2.appendChild(emojiCard2);

        var msgDiv2 = document.createElement('div');
        msgDiv2.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;';
        wrap2.appendChild(msgDiv2);

        var splitDiv = document.createElement('div');
        splitDiv.style.cssText = 'display:flex;gap:12px;width:100%;margin-top:10px;';
        var p1Col = document.createElement('div');
        p1Col.style.cssText = 'flex:1;border:2px solid #4ecdc4;border-radius:12px;padding:10px;';
        p1Col.innerHTML = '<div style="text-align:center;font-family:Orbitron,sans-serif;font-size:0.8rem;color:#4ecdc4;margin-bottom:8px;">Player 1</div>';
        var p1Opts = document.createElement('div');
        p1Opts.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
        p1Col.appendChild(p1Opts);

        var p2Col = document.createElement('div');
        p2Col.style.cssText = 'flex:1;border:2px solid #ff6b6b;border-radius:12px;padding:10px;';
        p2Col.innerHTML = '<div style="text-align:center;font-family:Orbitron,sans-serif;font-size:0.8rem;color:#ff6b6b;margin-bottom:8px;">Player 2</div>';
        var p2Opts = document.createElement('div');
        p2Opts.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
        p2Col.appendChild(p2Opts);

        splitDiv.appendChild(p1Col);
        splitDiv.appendChild(p2Col);
        wrap2.appendChild(splitDiv);

        var progDiv2 = document.createElement('div');
        progDiv2.style.cssText = 'width:100%;margin-top:8px;';
        wrap2.appendChild(progDiv2);

        container.appendChild(wrap2);

        function showEmoji2P() {
          if (idx2 >= totalQ2) {
            var winner = p1Score > p2Score ? 'Player 1 wins!' : (p2Score > p1Score ? 'Player 2 wins!' : 'It\'s a tie!');
            E.rashidSay(winner + ' P1: ' + p1Score + ' - P2: ' + p2Score);
            E.setScore(Math.max(p1Score, p2Score));
            E.endGame(Math.max(p1Score, p2Score), totalQ2);
            return;
          }
          msgDiv2.textContent = '';
          emojiCard2.classList.remove('flash-correct', 'flash-wrong');

          var q = questions2[idx2];
          emojiCard2.innerHTML = '<div class="ge2-big-emoji ge2-fadeIn">' + q.emojis + '</div>' +
            '<div style="font-family:Inter,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.4);text-align:center">What do these emojis represent?</div>';

          var optData = [];
          for (var i = 0; i < q.opts.length; i++) {
            optData.push({ text: q.opts[i], isCorrect: i === q.a });
          }
          optData = shuffle(optData);

          var roundAnswered = false;

          function buildOptButtons(parentEl, player) {
            parentEl.innerHTML = '';
            for (var j = 0; j < optData.length; j++) {
              (function (opt) {
                var btn = document.createElement('button');
                btn.className = 'ge2-opt';
                btn.style.cssText = 'min-width:auto;flex:none;width:100%;padding:10px 8px;font-size:0.82rem;';
                btn.textContent = opt.text;
                btn.addEventListener('click', function () {
                  if (roundAnswered) return;
                  roundAnswered = true;
                  disableOpts(p1Opts);
                  disableOpts(p2Opts);
                  if (opt.isCorrect) {
                    btn.classList.add('correct');
                    flashCard(emojiCard2, true);
                    if (player === 1) {
                      p1Score++;
                      msgDiv2.innerHTML = '<span style="color:#4ecdc4">Player 1 scores! +1</span>';
                    } else {
                      p2Score++;
                      msgDiv2.innerHTML = '<span style="color:#ff6b6b">Player 2 scores! +1</span>';
                    }
                    E.setScore(Math.max(p1Score, p2Score));
                    E.rashidSay(pick(['Fast fingers!', 'Quick answer!', 'Yalla!', 'Excellent!']));
                  } else {
                    btn.classList.add('wrong');
                    flashCard(emojiCard2, false);
                    msgDiv2.innerHTML = '<span style="color:#ff3b3b">Wrong! It was: ' + q.opts[q.a] + '</span>';
                    /* highlight correct in both columns */
                    var allBtns = splitDiv.querySelectorAll('.ge2-opt');
                    for (var k = 0; k < allBtns.length; k++) {
                      for (var m = 0; m < optData.length; m++) {
                        if (allBtns[k].textContent === optData[m].text && optData[m].isCorrect) {
                          allBtns[k].classList.add('correct');
                        }
                      }
                    }
                  }
                  scoreBar2.innerHTML = '<span style="color:#4ecdc4">P1: ' + p1Score + '</span><span style="color:#ff6b6b">P2: ' + p2Score + '</span>';
                  idx2++;
                  progDiv2.innerHTML = buildDots(idx2, totalQ2);
                  self._timers.push(setTimeout(showEmoji2P, 1800));
                });
                parentEl.appendChild(btn);
              })(optData[j]);
            }
          }

          buildOptButtons(p1Opts, 1);
          buildOptButtons(p2Opts, 2);
          progDiv2.innerHTML = buildDots(idx2, totalQ2);
        }

        showEmoji2P();
        return;
      }
      /* ── End 2-Player Mode ── */

      var emojiGuesses = [
        { emojis: '\uD83C\uDFD7\uFE0F\uD83D\uDCCF\uD83C\uDF06', opts: ['Dubai Frame', 'Burj Khalifa', 'CN Tower', 'Petronas'], a: 1 },
        { emojis: '\uD83D\uDD4C\u2B1C\uD83E\uDD32', opts: ['Church', 'Temple', 'Mosque', 'Palace'], a: 2 },
        { emojis: '\uD83D\uDC2A\uD83C\uDFDC\uFE0F\u2600\uFE0F', opts: ['Beach', 'Desert', 'Mountain', 'Forest'], a: 1 },
        { emojis: '\uD83E\uDD85\uD83D\uDC51\uD83E\uDDE4', opts: ['Eagle', 'Parrot', 'Falcon', 'Hawk'], a: 2 },
        { emojis: '\uD83E\uDED8\uD83C\uDF6F\uD83C\uDF61', opts: ['Machboos', 'Harees', 'Balaleet', 'Luqaimat'], a: 3 },
        { emojis: '\u26F5\uD83D\uDC1A\uD83D\uDC8E', opts: ['Fishing', 'Pearl Diving', 'Surfing', 'Sailing'], a: 1 },
        { emojis: '\uD83D\uDDBC\uFE0F\uD83C\uDFD9\uFE0F\uD83C\uDF09', opts: ['Burj Khalifa', 'Palm Tower', 'Dubai Frame', 'Marina'], a: 2 },
        { emojis: '\u2615\uD83E\uDED6\uD83E\uDD1D', opts: ['English Tea', 'Arabic Coffee', 'Chai', 'Juice'], a: 1 },
        { emojis: '\uD83C\uDF34\uD83D\uDFE4\uD83C\uDF6C', opts: ['Coconut', 'Bananas', 'Dates', 'Figs'], a: 2 },
        { emojis: '\uD83C\uDFD6\uFE0F\uD83C\uDF0A\uD83C\uDFDD\uFE0F', opts: ['Desert', 'Mountain', 'Island', 'Valley'], a: 2 }
      ];

      var totalQ = diffVal(diff, 5, 8, 10);
      var questions = shuffle(emojiGuesses).slice(0, totalQ);
      var idx = 0;
      var score = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'ge2-title';
      titleDiv.textContent = 'Emoji Guess!';
      wrap.appendChild(titleDiv);

      var emojiCard = document.createElement('div');
      emojiCard.className = 'ge2-card';
      wrap.appendChild(emojiCard);

      var optsDiv = document.createElement('div');
      optsDiv.className = 'ge2-opts';
      wrap.appendChild(optsDiv);

      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;';
      wrap.appendChild(msgDiv);

      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      wrap.appendChild(progDiv);

      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'ge2-score';
      wrap.appendChild(scoreDiv);

      container.appendChild(wrap);

      function showEmoji() {
        if (idx >= totalQ) {
          E.rashidSay('Emoji master! Score: ' + score + '/' + (totalQ * 10));
          E.endGame(score, totalQ * 10);
          return;
        }
        msgDiv.textContent = '';
        emojiCard.classList.remove('flash-correct', 'flash-wrong');

        var q = questions[idx];
        emojiCard.innerHTML = '<div class="ge2-big-emoji ge2-fadeIn">' + q.emojis + '</div>' +
          '<div style="font-family:Inter,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.4);text-align:center">What do these emojis represent?</div>';

        var optData = [];
        for (var i = 0; i < q.opts.length; i++) {
          optData.push({ text: q.opts[i], isCorrect: i === q.a });
        }
        optData = shuffle(optData);

        optsDiv.innerHTML = '';
        for (var j = 0; j < optData.length; j++) {
          (function (opt) {
            var btn = document.createElement('button');
            btn.className = 'ge2-opt';
            btn.textContent = opt.text;
            btn.addEventListener('click', function () {
              disableOpts(optsDiv);
              if (opt.isCorrect) {
                btn.classList.add('correct');
                flashCard(emojiCard, true);
                score += 10;
                E.setScore(score);
                msgDiv.innerHTML = '<span style="color:#00C9A7">Correct! +10 pts</span>';
                E.rashidSay(pick(['You read emojis perfectly!', 'Excellent!', 'Yalla!', 'Smart!']));
              } else {
                btn.classList.add('wrong');
                flashCard(emojiCard, false);
                var allBtns = optsDiv.querySelectorAll('.ge2-opt');
                for (var k = 0; k < allBtns.length; k++) {
                  for (var m = 0; m < optData.length; m++) {
                    if (allBtns[k].textContent === optData[m].text && optData[m].isCorrect) {
                      allBtns[k].classList.add('correct');
                    }
                  }
                }
                msgDiv.innerHTML = '<span style="color:#ff3b3b">It was: ' + q.opts[q.a] + '</span>';
              }
              idx++;
              progDiv.innerHTML = buildDots(idx, totalQ);
              scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
              self._timers.push(setTimeout(showEmoji, 1800));
            });
            optsDiv.appendChild(btn);
          })(optData[j]);
        }

        progDiv.innerHTML = buildDots(idx, totalQ);
        scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
      }

      showEmoji();
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  8. EMOJI ART                                      */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'emoji-art', name: 'Emoji Art', emoji: '\uD83C\uDFA8', category: 'word', has2P: false,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      var emojiArt = [
        { art: '    \uD83C\uDFD7\uFE0F\n   \uD83C\uDFD7\uFE0F\uD83C\uDFD7\uFE0F\n  \uD83C\uDFD7\uFE0F\uD83C\uDFD7\uFE0F\uD83C\uDFD7\uFE0F\n \uD83C\uDFD7\uFE0F\uD83C\uDFD7\uFE0F\uD83C\uDFD7\uFE0F\uD83C\uDFD7\uFE0F\n\uD83C\uDFD7\uFE0F\uD83C\uDFD7\uFE0F\uD83C\uDFD7\uFE0F\uD83C\uDFD7\uFE0F\uD83C\uDFD7\uFE0F', opts: ['Dubai Frame', 'Burj Khalifa', 'Pyramid', 'Tower'], a: 1 },
        { art: '  \uD83D\uDD4C\n \uD83D\uDD4C\uD83D\uDD4C\uD83D\uDD4C\n\uD83D\uDD4C\uD83D\uDD4C\uD83D\uDD4C\uD83D\uDD4C\uD83D\uDD4C\n  \u2B1C\u2B1C\u2B1C', opts: ['Palace', 'Mosque', 'Church', 'Fort'], a: 1 },
        { art: '\uD83D\uDC2A\uD83D\uDC2A\uD83D\uDC2A\n\uD83C\uDFDC\uFE0F\uD83C\uDFDC\uFE0F\uD83C\uDFDC\uFE0F\uD83C\uDFDC\uFE0F\n\u2600\uFE0F\u2600\uFE0F\u2600\uFE0F\u2600\uFE0F\u2600\uFE0F', opts: ['Beach', 'Desert Caravan', 'Mountain', 'Forest'], a: 1 },
        { art: '\uD83E\uDD85\n  \u2197\uFE0F\n    \uD83E\uDDE4\n\uD83D\uDC64', opts: ['Hunting', 'Falconry', 'Fishing', 'Racing'], a: 1 },
        { art: '\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\n\uD83D\uDEA3\u200D\u2642\uFE0F\uD83D\uDC1A\uD83D\uDC8E\n\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A', opts: ['Swimming', 'Pearl Diving', 'Surfing', 'Fishing'], a: 1 },
        { art: '\uD83D\uDFE5\uD83D\uDFE5\n\uD83D\uDFE9\uD83D\uDFE9\n\u2B1C\u2B1C\n\u2B1B\u2B1B', opts: ['Qatar Flag', 'UAE Flag', 'Kuwait Flag', 'Oman Flag'], a: 1 }
      ];

      var totalQ = diffVal(diff, 4, 5, 6);
      var questions = shuffle(emojiArt).slice(0, totalQ);
      var idx = 0;
      var score = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'ge2-title';
      titleDiv.textContent = 'Emoji Art';
      wrap.appendChild(titleDiv);

      var artCard = document.createElement('div');
      artCard.className = 'ge2-card';
      wrap.appendChild(artCard);

      var optsDiv = document.createElement('div');
      optsDiv.className = 'ge2-opts';
      wrap.appendChild(optsDiv);

      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;';
      wrap.appendChild(msgDiv);

      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      wrap.appendChild(progDiv);

      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'ge2-score';
      wrap.appendChild(scoreDiv);

      container.appendChild(wrap);

      function showArt() {
        if (idx >= totalQ) {
          E.rashidSay('You see art in emojis! Score: ' + score + '/' + (totalQ * 10));
          E.endGame(score, totalQ * 10);
          return;
        }
        msgDiv.textContent = '';
        artCard.classList.remove('flash-correct', 'flash-wrong');

        var q = questions[idx];
        artCard.innerHTML = '<div class="ge2-art ge2-fadeIn">' + q.art + '</div>' +
          '<div style="font-family:Inter,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.4);text-align:center;margin-top:6px">What is this emoji art?</div>';

        var optData = [];
        for (var i = 0; i < q.opts.length; i++) {
          optData.push({ text: q.opts[i], isCorrect: i === q.a });
        }
        optData = shuffle(optData);

        optsDiv.innerHTML = '';
        for (var j = 0; j < optData.length; j++) {
          (function (opt) {
            var btn = document.createElement('button');
            btn.className = 'ge2-opt';
            btn.textContent = opt.text;
            btn.addEventListener('click', function () {
              disableOpts(optsDiv);
              if (opt.isCorrect) {
                btn.classList.add('correct');
                flashCard(artCard, true);
                score += 10;
                E.setScore(score);
                msgDiv.innerHTML = '<span style="color:#00C9A7">Correct! +10 pts</span>';
                E.rashidSay(pick(['You have artist eyes!', 'Great guess!', 'Yalla!', 'Perfect!']));
              } else {
                btn.classList.add('wrong');
                flashCard(artCard, false);
                var allBtns = optsDiv.querySelectorAll('.ge2-opt');
                for (var k = 0; k < allBtns.length; k++) {
                  for (var m = 0; m < optData.length; m++) {
                    if (allBtns[k].textContent === optData[m].text && optData[m].isCorrect) {
                      allBtns[k].classList.add('correct');
                    }
                  }
                }
                msgDiv.innerHTML = '<span style="color:#ff3b3b">It was: ' + q.opts[q.a] + '</span>';
              }
              idx++;
              progDiv.innerHTML = buildDots(idx, totalQ);
              scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
              self._timers.push(setTimeout(showArt, 1800));
            });
            optsDiv.appendChild(btn);
          })(optData[j]);
        }

        progDiv.innerHTML = buildDots(idx, totalQ);
        scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
      }

      showArt();
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  9. EMOJI TRANSLATE                                */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'emoji-translate', name: 'Emoji Translate', emoji: '\uD83D\uDCAC', category: 'word', has2P: false,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      var emojiTranslate = [
        { sentence: 'The falcon flew over the desert', opts: ['\uD83E\uDD85\u2708\uFE0F\uD83C\uDFDC\uFE0F', '\uD83D\uDC2A\uD83C\uDF0A\uD83C\uDFE0', '\uD83C\uDFD7\uFE0F\uD83C\uDFAE\uD83C\uDF19', '\uD83C\uDF34\u2615\uD83D\uDD4C'], a: 0 },
        { sentence: 'Drinking coffee with dates', opts: ['\uD83C\uDFDC\uFE0F\uD83D\uDC2A\uD83C\uDF0A', '\u2615\uD83C\uDF34\uD83E\uDD1D', '\uD83E\uDD85\uD83D\uDC51\uD83E\uDDE4', '\uD83C\uDFD7\uFE0F\uD83C\uDF06\uD83D\uDCCF'], a: 1 },
        { sentence: 'A camel in the sun', opts: ['\uD83D\uDC2A\u2600\uFE0F', '\uD83E\uDD85\uD83C\uDF19', '\uD83C\uDF0A\uD83D\uDC1A', '\uD83C\uDFD7\uFE0F\u26C8\uFE0F'], a: 0 },
        { sentence: 'The mosque under the moon', opts: ['\uD83C\uDFD7\uFE0F\u2600\uFE0F', '\uD83D\uDC2A\uD83C\uDFDC\uFE0F', '\uD83D\uDD4C\uD83C\uDF19', '\uD83C\uDF0A\uD83D\uDC2C'], a: 2 },
        { sentence: 'Fireworks on National Day', opts: ['\uD83C\uDF0A\uD83C\uDFD6\uFE0F', '\uD83C\uDFD7\uFE0F\uD83D\uDCCF', '\uD83C\uDF86\uD83C\uDDE6\uD83C\uDDEA', '\uD83D\uDC2A\uD83C\uDFDC\uFE0F'], a: 2 },
        { sentence: 'A pearl in the ocean', opts: ['\uD83E\uDD85\u2708\uFE0F', '\uD83D\uDC8E\uD83C\uDF0A', '\uD83D\uDC2A\u2600\uFE0F', '\uD83C\uDFD7\uFE0F\uD83C\uDF06'], a: 1 },
        { sentence: 'Children playing in the park', opts: ['\uD83D\uDC67\uD83C\uDFFB\uD83E\uDD38\uD83C\uDF33', '\uD83D\uDC2A\uD83C\uDFDC\uFE0F\u2600\uFE0F', '\uD83E\uDD85\uD83D\uDC51\uD83E\uDDE4', '\uD83D\uDD4C\uD83C\uDF19\u2B50'], a: 0 }
      ];

      var totalQ = diffVal(diff, 4, 6, 7);
      var questions = shuffle(emojiTranslate).slice(0, totalQ);
      var idx = 0;
      var score = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'ge2-title';
      titleDiv.textContent = 'Emoji Translate';
      wrap.appendChild(titleDiv);

      var sentenceCard = document.createElement('div');
      sentenceCard.className = 'ge2-card';
      sentenceCard.style.cssText += 'text-align:center;';
      wrap.appendChild(sentenceCard);

      var optsDiv = document.createElement('div');
      optsDiv.className = 'ge2-opts';
      wrap.appendChild(optsDiv);

      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;';
      wrap.appendChild(msgDiv);

      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      wrap.appendChild(progDiv);

      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'ge2-score';
      wrap.appendChild(scoreDiv);

      container.appendChild(wrap);

      function showSentence() {
        if (idx >= totalQ) {
          E.rashidSay('You\'re an emoji translator! Score: ' + score + '/' + (totalQ * 10));
          E.endGame(score, totalQ * 10);
          return;
        }
        msgDiv.textContent = '';
        sentenceCard.classList.remove('flash-correct', 'flash-wrong');

        var q = questions[idx];
        sentenceCard.innerHTML = '<div style="font-family:Inter,sans-serif;font-size:1.1rem;color:#eef;margin-bottom:8px;line-height:1.5">"' + q.sentence + '"</div>' +
          '<div style="font-family:Inter,sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.4)">Pick the best emoji translation</div>';

        var optData = [];
        for (var i = 0; i < q.opts.length; i++) {
          optData.push({ text: q.opts[i], isCorrect: i === q.a });
        }
        optData = shuffle(optData);

        optsDiv.innerHTML = '';
        for (var j = 0; j < optData.length; j++) {
          (function (opt) {
            var btn = document.createElement('button');
            btn.className = 'ge2-opt';
            btn.style.fontSize = '1.8rem';
            btn.style.padding = '14px 10px';
            btn.textContent = opt.text;
            btn.addEventListener('click', function () {
              disableOpts(optsDiv);
              if (opt.isCorrect) {
                btn.classList.add('correct');
                flashCard(sentenceCard, true);
                score += 10;
                E.setScore(score);
                msgDiv.innerHTML = '<span style="color:#00C9A7">Perfect translation! +10 pts</span>';
                E.rashidSay(pick(['Emoji genius!', 'Spot on!', 'Brilliant!', 'You speak emoji!']));
              } else {
                btn.classList.add('wrong');
                flashCard(sentenceCard, false);
                var allBtns = optsDiv.querySelectorAll('.ge2-opt');
                for (var k = 0; k < allBtns.length; k++) {
                  for (var m = 0; m < optData.length; m++) {
                    if (allBtns[k].textContent === optData[m].text && optData[m].isCorrect) {
                      allBtns[k].classList.add('correct');
                    }
                  }
                }
                msgDiv.innerHTML = '<span style="color:#ff3b3b">The right emojis were: ' + q.opts[q.a] + '</span>';
              }
              idx++;
              progDiv.innerHTML = buildDots(idx, totalQ);
              scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
              self._timers.push(setTimeout(showSentence, 1800));
            });
            optsDiv.appendChild(btn);
          })(optData[j]);
        }

        progDiv.innerHTML = buildDots(idx, totalQ);
        scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
      }

      showSentence();
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  10. PROVERB FINISH                                */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'proverb-finish', name: 'Proverb Finish', emoji: '\uD83D\uDCDC', category: 'word', has2P: false,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      var proverbs = [
        { start: '"Patience is the key to..."', opts: ['\u0627\u0644\u0641\u0631\u062C (Relief)', '\u0627\u0644\u062D\u0632\u0646 (Sadness)', '\u0627\u0644\u0646\u0648\u0645 (Sleep)', '\u0627\u0644\u0623\u0643\u0644 (Food)'], a: 0 },
        { start: '"Knowledge is light and ignorance is..."', opts: ['Water', 'Darkness', 'Fire', 'Wind'], a: 1 },
        { start: '"The neighbor before the..."', opts: ['Food', 'Money', 'House', 'Friend'], a: 2 },
        { start: '"He who does not know the falcon..."', opts: ['Sells it', 'Grills it', 'Frees it', 'Paints it'], a: 1 },
        { start: '"A friend in need is a friend..."', opts: ['Indeed', 'At home', 'Away', 'Later'], a: 0 },
        { start: '"The camel does not see its own..."', opts: ['Shadow', 'Hump', 'Feet', 'Eyes'], a: 1 }
      ];

      var totalQ = diffVal(diff, 4, 5, 6);
      var questions = shuffle(proverbs).slice(0, totalQ);
      var idx = 0;
      var score = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'ge2-title';
      titleDiv.textContent = 'Proverb Finish';
      wrap.appendChild(titleDiv);

      var scrollDiv = document.createElement('div');
      scrollDiv.className = 'ge2-scroll ge2-card';
      wrap.appendChild(scrollDiv);

      var optsDiv = document.createElement('div');
      optsDiv.className = 'ge2-opts';
      wrap.appendChild(optsDiv);

      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;min-height:22px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.85rem;';
      wrap.appendChild(msgDiv);

      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      wrap.appendChild(progDiv);

      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'ge2-score';
      wrap.appendChild(scoreDiv);

      container.appendChild(wrap);

      function showProverb() {
        if (idx >= totalQ) {
          E.rashidSay('You know your proverbs! Score: ' + score + '/' + (totalQ * 10));
          E.endGame(score, totalQ * 10);
          return;
        }
        msgDiv.textContent = '';
        scrollDiv.classList.remove('flash-correct', 'flash-wrong');

        var q = questions[idx];
        scrollDiv.innerHTML = '<div class="ge2-scroll-text" style="font-size:1.15rem;color:#FFD700">' + q.start + '</div>';

        var optData = [];
        for (var i = 0; i < q.opts.length; i++) {
          optData.push({ text: q.opts[i], isCorrect: i === q.a });
        }
        optData = shuffle(optData);

        optsDiv.innerHTML = '';
        for (var j = 0; j < optData.length; j++) {
          (function (opt) {
            var btn = document.createElement('button');
            btn.className = 'ge2-opt';
            btn.textContent = opt.text;
            btn.addEventListener('click', function () {
              disableOpts(optsDiv);
              if (opt.isCorrect) {
                btn.classList.add('correct');
                flashCard(scrollDiv, true);
                scrollDiv.innerHTML = '<div class="ge2-scroll-text" style="font-size:1.1rem;color:#00C9A7">' + q.start.replace('..."', ' <strong>' + opt.text + '</strong>"') + '</div>';
                score += 10;
                E.setScore(score);
                msgDiv.innerHTML = '<span style="color:#00C9A7">Wise choice! +10 pts</span>';
                E.rashidSay(pick(['Wise words!', 'You know the proverbs!', 'Mashallah!', 'Excellent!']));
              } else {
                btn.classList.add('wrong');
                flashCard(scrollDiv, false);
                var allBtns = optsDiv.querySelectorAll('.ge2-opt');
                for (var k = 0; k < allBtns.length; k++) {
                  for (var m = 0; m < optData.length; m++) {
                    if (allBtns[k].textContent === optData[m].text && optData[m].isCorrect) {
                      allBtns[k].classList.add('correct');
                    }
                  }
                }
                msgDiv.innerHTML = '<span style="color:#ff3b3b">The answer was: ' + q.opts[q.a] + '</span>';
              }
              idx++;
              progDiv.innerHTML = buildDots(idx, totalQ);
              scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
              self._timers.push(setTimeout(showProverb, 2000));
            });
            optsDiv.appendChild(btn);
          })(optData[j]);
        }

        progDiv.innerHTML = buildDots(idx, totalQ);
        scoreDiv.textContent = 'Score: ' + score + ' / ' + (totalQ * 10);
      }

      showProverb();
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  11. STORY BUILDER                                 */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'story-builder', name: 'Story Builder', emoji: '\uD83D\uDCD6', category: 'word', has2P: false,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      var rashidLines = [
        'The wind carried whispers of ancient traditions...',
        'Suddenly, a falcon swooped down from the sky!',
        'The desert sand sparkled like gold under the sun.',
        'Everyone gathered to celebrate with Arabic coffee and dates.',
        'The sound of the oud filled the air with beautiful music.',
        'A dhow sailed across the Arabian Gulf carrying treasures.'
      ];
      var starters = [
        'Once upon a time in Dubai, a young explorer found a golden key...',
        'In the desert near Abu Dhabi, a baby falcon opened its eyes...',
        'At the souk, a merchant discovered a glowing pearl...',
        'On National Day, fireworks lit up the sky and...',
        'A camel named Zayed started walking toward the tallest building...'
      ];

      var totalTurns = diffVal(diff, 4, 6, 8);
      var starter = pick(starters);
      var rashidPool = shuffle(rashidLines);
      var rashidIdx = 0;
      var turn = 0;
      var storyLines = [];

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'ge2-title';
      titleDiv.textContent = 'Story Builder';
      wrap.appendChild(titleDiv);

      var subtitleDiv = document.createElement('div');
      subtitleDiv.className = 'ge2-subtitle';
      subtitleDiv.textContent = 'Build a story with Rashid! Take turns adding sentences.';
      wrap.appendChild(subtitleDiv);

      /* Book container */
      var bookDiv = document.createElement('div');
      bookDiv.className = 'ge2-book';
      wrap.appendChild(bookDiv);

      /* Input area */
      var inputRow = document.createElement('div');
      inputRow.style.cssText = 'display:flex;gap:8px;align-items:center;width:100%;justify-content:center;margin-top:8px;';
      var input = document.createElement('input');
      input.className = 'ge2-input';
      input.placeholder = 'Add your sentence...';
      input.style.maxWidth = '280px';
      input.style.textTransform = 'none';
      input.style.letterSpacing = '0px';
      input.style.fontFamily = 'Inter, sans-serif';
      input.style.fontSize = '0.9rem';
      var addBtn = document.createElement('button');
      addBtn.className = 'ge2-btn teal sm';
      addBtn.textContent = 'Add';
      inputRow.appendChild(input);
      inputRow.appendChild(addBtn);
      wrap.appendChild(inputRow);

      /* Turn indicator */
      var turnDiv = document.createElement('div');
      turnDiv.style.cssText = 'text-align:center;font-family:Inter,sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.5);margin-top:6px;';
      wrap.appendChild(turnDiv);

      /* Progress */
      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      wrap.appendChild(progDiv);

      container.appendChild(wrap);

      function addLine(text, who) {
        var lineDiv = document.createElement('div');
        lineDiv.className = 'ge2-book-line ' + who;
        var prefix = who === 'rashid' ? '\uD83E\uDDD2 Rashid: ' : '\uD83D\uDC66 You: ';
        lineDiv.textContent = prefix + text;
        bookDiv.appendChild(lineDiv);
        bookDiv.scrollTop = bookDiv.scrollHeight;
        storyLines.push({ text: text, who: who });
      }

      function updateUI() {
        turnDiv.textContent = 'Turn ' + (turn + 1) + ' of ' + totalTurns + ' \u2022 Your turn!';
        progDiv.innerHTML = buildDots(turn, totalTurns);
      }

      function endStory() {
        input.disabled = true;
        addBtn.classList.add('disabled');
        turnDiv.innerHTML = '<span style="color:#FFD700">Story complete!</span>';

        /* Add "The End" */
        var endDiv = document.createElement('div');
        endDiv.className = 'ge2-book-line';
        endDiv.style.cssText = 'text-align:center;color:#FFD700;font-family:Orbitron,sans-serif;font-size:1.1rem;margin-top:10px;';
        endDiv.textContent = '\u2728 The End \u2728';
        bookDiv.appendChild(endDiv);
        bookDiv.scrollTop = bookDiv.scrollHeight;

        var pts = totalTurns * 10;
        E.setScore(pts);
        E.rashidSay('What a wonderful story we created together!');
        E.endGame(pts, totalTurns * 10);
      }

      function playerTurn() {
        var text = input.value.trim();
        if (!text) return;
        if (text.length < 3) {
          E.rashidSay('Write a bit more!');
          return;
        }
        input.value = '';
        addLine(text, 'player');
        turn++;
        E.addScore(10);
        progDiv.innerHTML = buildDots(turn, totalTurns);

        if (turn >= totalTurns) {
          endStory();
          return;
        }

        /* Rashid's turn */
        input.disabled = true;
        addBtn.classList.add('disabled');
        turnDiv.textContent = 'Rashid is thinking...';

        self._timers.push(setTimeout(function () {
          var rashidText = rashidPool[rashidIdx % rashidPool.length];
          rashidIdx++;
          addLine(rashidText, 'rashid');
          input.disabled = false;
          addBtn.classList.remove('disabled');
          updateUI();
          input.focus();
        }, 1200));
      }

      /* Start: Rashid's opening line */
      addLine(starter, 'rashid');
      updateUI();
      input.focus();

      addBtn.addEventListener('click', playerTurn);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') playerTurn(); });
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
    }
  });

  /* ═══════════════════════════════════════════════════ */
  /*  12. POETRY BUILDER                                */
  /* ═══════════════════════════════════════════════════ */
  E.register({
    id: 'poetry-builder', name: 'Poetry Builder', emoji: '\uD83D\uDCDC', category: 'word', has2P: false,
    _timers: [],
    init: function (container, mode, diff) {
      injectStyles();
      var self = this;
      self._timers = [];

      var poetryStarters = [
        'The desert wind whispers',
        'Golden dunes stretch far',
        'The falcon soars high',
        'Under starlit skies',
        'The pearl diver dives',
        'Oasis palms sway gently'
      ];
      var rashidPoetryLines = [
        'Across the seven emirates wide',
        'Where ancient trade routes used to be',
        'With camels crossing golden sands',
        'The dhow sails on the azure sea',
        'And children learn of heritage'
      ];

      var totalLines = diffVal(diff, 4, 6, 8);
      var starter = pick(poetryStarters);
      var rashidPool = shuffle(rashidPoetryLines);
      var rashidIdx = 0;
      var lineCount = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge2-wrap';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'ge2-title';
      titleDiv.textContent = 'Poetry Builder';
      wrap.appendChild(titleDiv);

      var subtitleDiv = document.createElement('div');
      subtitleDiv.className = 'ge2-subtitle';
      subtitleDiv.textContent = 'Create a poem about UAE with Rashid! Take turns adding lines.';
      wrap.appendChild(subtitleDiv);

      /* Poem container with gold border */
      var poemOuter = document.createElement('div');
      poemOuter.style.cssText = 'width:100%;border:2px solid rgba(255,215,0,0.25);border-radius:12px;padding:4px;box-sizing:border-box;background:linear-gradient(135deg,rgba(255,215,0,0.03),rgba(0,201,167,0.02));';
      var poemDiv = document.createElement('div');
      poemDiv.className = 'ge2-book ge2-poem';
      poemDiv.style.cssText += 'border:none;background:transparent;min-height:140px;';
      poemOuter.appendChild(poemDiv);
      wrap.appendChild(poemOuter);

      /* Input */
      var inputRow = document.createElement('div');
      inputRow.style.cssText = 'display:flex;gap:8px;align-items:center;width:100%;justify-content:center;margin-top:10px;';
      var input = document.createElement('input');
      input.className = 'ge2-input';
      input.placeholder = 'Add a poetic line...';
      input.style.maxWidth = '280px';
      input.style.textTransform = 'none';
      input.style.letterSpacing = '0px';
      input.style.fontFamily = 'Inter, sans-serif';
      input.style.fontSize = '0.9rem';
      input.style.fontStyle = 'italic';
      var addBtn = document.createElement('button');
      addBtn.className = 'ge2-btn sm';
      addBtn.textContent = 'Add';
      inputRow.appendChild(input);
      inputRow.appendChild(addBtn);
      wrap.appendChild(inputRow);

      /* Turn indicator */
      var turnDiv = document.createElement('div');
      turnDiv.style.cssText = 'text-align:center;font-family:Inter,sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.5);margin-top:6px;';
      wrap.appendChild(turnDiv);

      /* Progress */
      var progDiv = document.createElement('div');
      progDiv.style.cssText = 'width:100%;margin-top:8px;';
      wrap.appendChild(progDiv);

      container.appendChild(wrap);

      function addPoemLine(text, who) {
        var lineDiv = document.createElement('div');
        lineDiv.className = 'ge2-book-line ' + who;
        lineDiv.style.cssText = 'text-align:center;font-style:italic;font-size:0.95rem;';
        if (who === 'rashid') lineDiv.style.color = '#00C9A7';
        else lineDiv.style.color = '#FFD700';
        lineDiv.textContent = text;
        poemDiv.appendChild(lineDiv);
        poemDiv.scrollTop = poemDiv.scrollHeight;
      }

      function updateUI() {
        turnDiv.textContent = 'Line ' + (lineCount + 1) + ' of ' + totalLines + ' \u2022 Your turn!';
        progDiv.innerHTML = buildDots(lineCount, totalLines);
      }

      function endPoem() {
        input.disabled = true;
        addBtn.classList.add('disabled');
        turnDiv.innerHTML = '<span style="color:#FFD700">Poem complete!</span>';

        /* Decorative ending */
        var endDiv = document.createElement('div');
        endDiv.className = 'ge2-book-line';
        endDiv.style.cssText = 'text-align:center;color:#FFD700;font-family:Orbitron,sans-serif;font-size:0.9rem;margin-top:10px;';
        endDiv.textContent = '\u2014 \u2726 \u2014';
        poemDiv.appendChild(endDiv);
        poemDiv.scrollTop = poemDiv.scrollHeight;

        var pts = totalLines * 10;
        E.setScore(pts);
        E.rashidSay('Beautiful poem! You have the soul of a poet!');
        E.endGame(pts, totalLines * 10);
      }

      function playerLine() {
        var text = input.value.trim();
        if (!text) return;
        if (text.length < 2) {
          E.rashidSay('Write a poetic line!');
          return;
        }
        input.value = '';
        addPoemLine(text, 'player');
        lineCount++;
        E.addScore(10);
        progDiv.innerHTML = buildDots(lineCount, totalLines);

        if (lineCount >= totalLines) {
          endPoem();
          return;
        }

        /* Rashid's poetic turn */
        input.disabled = true;
        addBtn.classList.add('disabled');
        turnDiv.textContent = 'Rashid is composing...';

        self._timers.push(setTimeout(function () {
          var rashidText = rashidPool[rashidIdx % rashidPool.length];
          rashidIdx++;
          addPoemLine(rashidText, 'rashid');
          lineCount++;
          progDiv.innerHTML = buildDots(lineCount, totalLines);

          if (lineCount >= totalLines) {
            endPoem();
            return;
          }

          input.disabled = false;
          addBtn.classList.remove('disabled');
          updateUI();
          input.focus();
        }, 1000));
      }

      /* Start: Rashid's opening poetic line */
      addPoemLine(starter, 'rashid');
      lineCount++;
      updateUI();
      input.focus();

      addBtn.addEventListener('click', playerLine);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') playerLine(); });
    },
    destroy: function () {
      if (this._timers) { for (var i = 0; i < this._timers.length; i++) clearTimeout(this._timers[i]); this._timers = []; }
    }
  });

})();
