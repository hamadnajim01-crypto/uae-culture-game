/* ===== WORD & LANGUAGE GAMES (10) — DOM-based, Polished Visuals ===== */
(function () {
  var E = window.GamesEngine;
  var shuffle = E.shuffle, pick = E.pick;

  var UAE_WORDS = ['FALCON','CAMEL','PEARL','MOSQUE','DESERT','OASIS','DHOW','SOUK','HENNA','DATES','DUNE','GOLD','ABAYA','SHEIKH','DUBAI','KHALIFA','DIRHAM','SALAM','OMAN','MAJLIS'];

  /* ── Shared style helpers ── */
  var COLORS = { gold: '#FFD700', teal: '#00C9A7', orange: '#FF6B35', bg: '#13132b', bgLight: '#1a1a3e', bgCard: '#1e1e42', correct: '#00C9A7', wrong: '#ff3b3b', white: '#eef', dim: 'rgba(255,255,255,0.45)' };

  function makeContainer() {
    var d = document.createElement('div');
    d.className = 'gflex-col gw100';
    d.style.cssText = 'align-items:center;padding:6px 0;';
    return d;
  }

  function makeCard(opts) {
    var c = document.createElement('div');
    c.style.cssText = 'background:linear-gradient(135deg,' + COLORS.bgCard + ',' + COLORS.bgLight + ');border-radius:16px;padding:' + (opts.pad || '22px 28px') + ';width:100%;max-width:' + (opts.maxW || '600px') + ';box-shadow:0 4px 24px rgba(0,0,0,0.35);border:1px solid rgba(255,215,0,0.08);margin-bottom:' + (opts.mb || '12px') + ';' + (opts.extra || '');
    return c;
  }

  function makeProgressBar(current, total, color) {
    var pct = Math.min(100, Math.round((current / total) * 100));
    return '<div style="width:100%;height:8px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;margin:6px 0"><div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,' + (color || COLORS.teal) + ',' + (color || COLORS.gold) + ');border-radius:4px;transition:width 0.4s ease"></div></div>';
  }

  function makeProgressDots(current, total) {
    var html = '<div style="display:flex;gap:6px;justify-content:center;margin:8px 0">';
    for (var i = 0; i < total; i++) {
      var filled = i < current;
      var active = i === current;
      html += '<div style="width:10px;height:10px;border-radius:50%;transition:all 0.3s;' +
        (filled ? 'background:' + COLORS.teal + ';box-shadow:0 0 6px ' + COLORS.teal + ';' :
         active ? 'background:' + COLORS.gold + ';box-shadow:0 0 8px ' + COLORS.gold + ';transform:scale(1.3);' :
         'background:rgba(255,255,255,0.15);') + '"></div>';
    }
    html += '</div>';
    return html;
  }

  function animateCorrect(el) {
    el.style.transition = 'all 0.3s ease';
    el.style.boxShadow = '0 0 20px ' + COLORS.teal + ', 0 0 40px rgba(0,201,167,0.3)';
    el.style.transform = 'scale(1.05)';
    setTimeout(function () {
      el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
      el.style.transform = 'scale(1)';
    }, 600);
  }

  function animateWrong(el) {
    el.style.transition = 'all 0.08s ease';
    el.style.boxShadow = '0 0 20px ' + COLORS.wrong + ', 0 0 40px rgba(255,59,59,0.3)';
    var orig = el.style.transform || '';
    el.style.transform = 'translateX(-8px)';
    setTimeout(function () { el.style.transform = 'translateX(8px)'; }, 80);
    setTimeout(function () { el.style.transform = 'translateX(-5px)'; }, 160);
    setTimeout(function () { el.style.transform = 'translateX(5px)'; }, 240);
    setTimeout(function () {
      el.style.transform = orig;
      el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
    }, 400);
  }

  function statusStyle() {
    return 'font-family:Inter,sans-serif;font-size:0.85rem;color:' + COLORS.dim + ';text-align:center;margin-bottom:4px;';
  }

  function titleStyle(color) {
    return 'font-family:Orbitron,sans-serif;font-size:1rem;color:' + (color || COLORS.gold) + ';text-align:center;margin-bottom:2px;letter-spacing:0.5px;';
  }

  function counterStyle() {
    return 'font-family:Orbitron,sans-serif;font-size:0.8rem;color:' + COLORS.teal + ';text-align:center;';
  }

  function btnStyle(bgColor, textColor, extra) {
    return 'display:inline-flex;align-items:center;justify-content:center;padding:10px 22px;border:none;border-radius:10px;font-family:Orbitron,sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;transition:all 0.2s ease;color:' + (textColor || '#000') + ';background:linear-gradient(135deg,' + bgColor + ',' + (bgColor === COLORS.gold ? '#FFA500' : bgColor) + ');box-shadow:0 3px 12px rgba(0,0,0,0.3);' + (extra || '');
  }

  function inputStyle() {
    return 'width:100%;max-width:280px;padding:12px 16px;border:2px solid rgba(255,215,0,0.2);border-radius:10px;background:rgba(0,0,0,0.3);color:#FFD700;font-family:Orbitron,sans-serif;font-size:1rem;text-align:center;outline:none;text-transform:uppercase;transition:border-color 0.3s;letter-spacing:2px;';
  }

  /* ────────────────────────────────────────────── */
  /* ── 23. Word Search ─────────────────────────── */
  /* ────────────────────────────────────────────── */
  E.register({
    id: 'word-search', name: 'Word Search', emoji: '🔍', category: 'word', has2P: false,
    init: function (container, mode, diff) {
      var SIZE = diff === 'easy' ? 8 : diff === 'hard' ? 12 : 10;
      var wordCount = diff === 'easy' ? 4 : diff === 'hard' ? 8 : 6;
      var words = shuffle(UAE_WORDS).slice(0, wordCount);
      var grid = []; for (var i = 0; i < SIZE; i++) { grid[i] = []; for (var j = 0; j < SIZE; j++) grid[i][j] = ''; }
      var placed = [];
      words.forEach(function (word) {
        for (var attempt = 0; attempt < 50; attempt++) {
          var horiz = Math.random() < 0.5;
          var r = Math.floor(Math.random() * (horiz ? SIZE : SIZE - word.length));
          var c = Math.floor(Math.random() * (horiz ? SIZE - word.length : SIZE));
          var ok = true;
          for (var k = 0; k < word.length; k++) {
            var gr = horiz ? r : r + k, gc = horiz ? c + k : c;
            if (grid[gr][gc] !== '' && grid[gr][gc] !== word[k]) { ok = false; break; }
          }
          if (ok) {
            var positions = [];
            for (var k2 = 0; k2 < word.length; k2++) {
              var gr2 = horiz ? r : r + k2, gc2 = horiz ? c + k2 : c;
              grid[gr2][gc2] = word[k2]; positions.push(gr2 * SIZE + gc2);
            }
            placed.push({ word: word, pos: positions, found: false });
            break;
          }
        }
      });
      for (var ri = 0; ri < SIZE; ri++) for (var ci = 0; ci < SIZE; ci++) if (grid[ri][ci] === '') grid[ri][ci] = String.fromCharCode(65 + Math.floor(Math.random() * 26));

      var found = 0, selecting = false, selected = [];
      var cellSize = SIZE > 10 ? 32 : 38;

      var div = makeContainer();
      var card = makeCard({ maxW: '580px', pad: '18px 20px' });

      /* Word list */
      var wordListId = 'ws_wl_' + Date.now();
      var wordListHTML = '<div id="' + wordListId + '" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:14px">';
      placed.forEach(function (p) {
        wordListHTML += '<span data-wsword="' + p.word + '" style="display:inline-block;padding:4px 12px;border-radius:20px;font-family:Orbitron,sans-serif;font-size:0.7rem;font-weight:700;color:' + COLORS.gold + ';background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);transition:all 0.4s;letter-spacing:0.5px">' + p.word + '</span>';
      });
      wordListHTML += '</div>';

      var progressId = 'ws_prog_' + Date.now();
      var gridId = 'ws_grid_' + Date.now();

      card.innerHTML = '<div style="' + titleStyle() + 'margin-bottom:10px">Find the UAE Words</div>' +
        wordListHTML +
        '<div id="' + progressId + '">' + makeProgressBar(0, placed.length) + '</div>' +
        '<div style="' + counterStyle() + 'margin-bottom:10px" id="ws_count_' + gridId + '">Found: 0 / ' + placed.length + '</div>' +
        '<div id="' + gridId + '" style="display:inline-grid;grid-template-columns:repeat(' + SIZE + ',' + cellSize + 'px);gap:2px;user-select:none;justify-content:center"></div>';

      div.appendChild(card);
      container.appendChild(div);

      var gEl = card.querySelector('#' + gridId);
      var cells = [];
      for (var ri2 = 0; ri2 < SIZE; ri2++) for (var ci2 = 0; ci2 < SIZE; ci2++) {
        var cell = document.createElement('div');
        var isEven = (ri2 + ci2) % 2 === 0;
        cell.style.cssText = 'width:' + cellSize + 'px;height:' + cellSize + 'px;display:flex;align-items:center;justify-content:center;font-family:Orbitron,sans-serif;font-size:' + (cellSize > 34 ? '0.8rem' : '0.7rem') + ';font-weight:700;color:' + COLORS.white + ';background:' + (isEven ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)') + ';border-radius:4px;cursor:pointer;transition:all 0.15s ease;border:1px solid rgba(255,255,255,0.05);';
        cell.textContent = grid[ri2][ci2];
        cell.setAttribute('data-idx', ri2 * SIZE + ci2);
        cell.onmouseenter = function () {
          if (!this.getAttribute('data-found')) {
            this.style.background = 'rgba(255,215,0,0.15)';
            this.style.color = COLORS.gold;
            this.style.transform = 'scale(1.1)';
            this.style.zIndex = '2';
          }
        };
        cell.onmouseleave = function () {
          if (!this.getAttribute('data-selected') && !this.getAttribute('data-found')) {
            var idx = parseInt(this.getAttribute('data-idx'));
            var r = Math.floor(idx / SIZE), c2 = idx % SIZE;
            var even = (r + c2) % 2 === 0;
            this.style.background = even ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)';
            this.style.color = COLORS.white;
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
          }
        };
        gEl.appendChild(cell);
        cells.push(cell);
      }

      function markSelected(idx, on) {
        if (cells[idx].getAttribute('data-found')) return;
        cells[idx].setAttribute('data-selected', on ? '1' : '');
        if (on) {
          cells[idx].style.background = 'rgba(0,201,167,0.3)';
          cells[idx].style.color = COLORS.teal;
          cells[idx].style.transform = 'scale(1.12)';
          cells[idx].style.boxShadow = '0 0 8px rgba(0,201,167,0.4)';
        } else {
          var r = Math.floor(idx / SIZE), c = idx % SIZE;
          var even = (r + c) % 2 === 0;
          cells[idx].style.background = even ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)';
          cells[idx].style.color = COLORS.white;
          cells[idx].style.transform = 'scale(1)';
          cells[idx].style.boxShadow = 'none';
        }
      }

      function checkSelection() {
        var selStr = selected.map(function (idx) { return cells[idx].textContent; }).join('');
        var selRev = selStr.split('').reverse().join('');
        placed.forEach(function (p) {
          if (p.found) return;
          if ((selStr === p.word || selRev === p.word) && selected.length === p.word.length) {
            var match = true;
            var sortedSel = selected.slice().sort();
            var sortedPos = p.pos.slice().sort();
            for (var k = 0; k < sortedSel.length; k++) if (sortedSel[k] !== sortedPos[k]) match = false;
            if (match) {
              p.found = true; found++;
              p.pos.forEach(function (idx) {
                cells[idx].setAttribute('data-found', '1');
                cells[idx].style.background = 'rgba(0,201,167,0.25)';
                cells[idx].style.color = COLORS.teal;
                cells[idx].style.fontWeight = '900';
                cells[idx].style.boxShadow = '0 0 10px rgba(0,201,167,0.3)';
                cells[idx].style.border = '1px solid rgba(0,201,167,0.4)';
              });
              /* Strikethrough in word list */
              var wlSpans = card.querySelectorAll('[data-wsword="' + p.word + '"]');
              if (wlSpans.length) {
                wlSpans[0].style.textDecoration = 'line-through';
                wlSpans[0].style.background = 'rgba(0,201,167,0.15)';
                wlSpans[0].style.borderColor = COLORS.teal;
                wlSpans[0].style.color = COLORS.teal;
              }
              E.addScore(1); E.rashidSay('Found "' + p.word + '"! \uD83C\uDFAF');
              card.querySelector('#ws_count_' + gridId).textContent = 'Found: ' + found + ' / ' + placed.length;
              card.querySelector('#' + progressId).innerHTML = makeProgressBar(found, placed.length);
              if (found === placed.length) {
                animateCorrect(card);
                E.endGame(found, placed.length);
              }
            }
          }
        });
      }

      gEl.onmousedown = function (e) {
        if (!e.target.hasAttribute('data-idx')) return;
        e.preventDefault();
        selecting = true;
        selected = [parseInt(e.target.getAttribute('data-idx'))];
        cells.forEach(function (c) { markSelected(parseInt(c.getAttribute('data-idx')), false); });
        markSelected(selected[0], true);
      };
      gEl.onmouseover = function (e) {
        if (!selecting || !e.target.hasAttribute('data-idx')) return;
        var idx = parseInt(e.target.getAttribute('data-idx'));
        if (selected.indexOf(idx) === -1) { selected.push(idx); markSelected(idx, true); }
      };
      gEl.onmouseup = function () {
        selecting = false;
        checkSelection();
        selected.forEach(function (idx) { markSelected(idx, false); });
        selected = [];
      };

      /* Touch support */
      gEl.ontouchstart = function (e) {
        var t = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        if (!t || !t.hasAttribute('data-idx')) return;
        e.preventDefault();
        selecting = true;
        selected = [parseInt(t.getAttribute('data-idx'))];
        cells.forEach(function (c) { markSelected(parseInt(c.getAttribute('data-idx')), false); });
        markSelected(selected[0], true);
      };
      gEl.ontouchmove = function (e) {
        if (!selecting) return;
        e.preventDefault();
        var t = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        if (!t || !t.hasAttribute('data-idx')) return;
        var idx = parseInt(t.getAttribute('data-idx'));
        if (selected.indexOf(idx) === -1) { selected.push(idx); markSelected(idx, true); }
      };
      gEl.ontouchend = function () {
        selecting = false;
        checkSelection();
        selected.forEach(function (idx) { markSelected(idx, false); });
        selected = [];
      };

      return {};
    }, destroy: function () {}
  });

  /* ────────────────────────────────────────────── */
  /* ── 24. Hangman ─────────────────────────────── */
  /* ────────────────────────────────────────────── */
  E.register({
    id: 'hangman', name: 'Hangman', emoji: '🪢', category: 'word', has2P: false,
    init: function (container, mode, diff) {
      var word = pick(UAE_WORDS);
      var guessed = [], wrong = 0, maxWrong = diff === 'easy' ? 8 : diff === 'hard' ? 4 : 6;
      var gameOver = false;

      var div = makeContainer();
      var card = makeCard({ maxW: '520px', pad: '22px 24px' });
      var canvasId = 'hm_cvs_' + Date.now();
      var wordId = 'hm_word_' + Date.now();
      var livesId = 'hm_lives_' + Date.now();
      var letterId = 'hm_letters_' + Date.now();

      card.innerHTML = '<div style="' + titleStyle() + '">Guess the UAE Word</div>' +
        '<div style="display:flex;justify-content:center;margin:12px 0"><canvas id="' + canvasId + '" width="180" height="180" style="border-radius:12px;background:rgba(0,0,0,0.2)"></canvas></div>' +
        '<div id="' + livesId + '" style="margin-bottom:10px">' + makeProgressBar(maxWrong, maxWrong, COLORS.wrong) + '</div>' +
        '<div style="' + counterStyle() + 'margin-bottom:12px"><span id="hm_livect_' + canvasId + '">Lives: ' + maxWrong + ' / ' + maxWrong + '</span></div>' +
        '<div id="' + wordId + '" style="display:flex;justify-content:center;gap:8px;margin-bottom:18px;flex-wrap:wrap"></div>' +
        '<div id="' + letterId + '" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:380px;margin:0 auto"></div>';

      div.appendChild(card);
      container.appendChild(div);

      var canvas = card.querySelector('#' + canvasId);
      var ctx = canvas.getContext('2d');

      function drawGallows(stage) {
        ctx.clearRect(0, 0, 180, 180);
        ctx.strokeStyle = 'rgba(255,215,0,0.3)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        /* Base */
        ctx.beginPath(); ctx.moveTo(20, 160); ctx.lineTo(100, 160); ctx.stroke();
        /* Pole */
        ctx.beginPath(); ctx.moveTo(50, 160); ctx.lineTo(50, 20); ctx.stroke();
        /* Top bar */
        ctx.beginPath(); ctx.moveTo(50, 20); ctx.lineTo(120, 20); ctx.stroke();
        /* Rope */
        ctx.beginPath(); ctx.moveTo(120, 20); ctx.lineTo(120, 40); ctx.stroke();

        ctx.strokeStyle = COLORS.orange;
        ctx.lineWidth = 3;

        if (stage >= 1) { /* Head */
          ctx.beginPath(); ctx.arc(120, 55, 15, 0, Math.PI * 2); ctx.stroke();
          /* Eyes */
          if (stage >= maxWrong) {
            ctx.strokeStyle = COLORS.wrong;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(113, 51); ctx.lineTo(117, 55); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(117, 51); ctx.lineTo(113, 55); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(123, 51); ctx.lineTo(127, 55); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(127, 51); ctx.lineTo(123, 55); ctx.stroke();
            ctx.strokeStyle = COLORS.orange;
            ctx.lineWidth = 3;
          } else {
            ctx.fillStyle = COLORS.gold;
            ctx.beginPath(); ctx.arc(115, 52, 2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(125, 52, 2, 0, Math.PI * 2); ctx.fill();
          }
        }
        if (stage >= 2) { /* Body */
          ctx.beginPath(); ctx.moveTo(120, 70); ctx.lineTo(120, 115); ctx.stroke();
        }
        if (stage >= 3) { /* Left arm */
          ctx.beginPath(); ctx.moveTo(120, 80); ctx.lineTo(95, 100); ctx.stroke();
        }
        if (stage >= 4) { /* Right arm */
          ctx.beginPath(); ctx.moveTo(120, 80); ctx.lineTo(145, 100); ctx.stroke();
        }
        if (stage >= 5) { /* Left leg */
          ctx.beginPath(); ctx.moveTo(120, 115); ctx.lineTo(100, 145); ctx.stroke();
        }
        if (stage >= 6) { /* Right leg */
          ctx.beginPath(); ctx.moveTo(120, 115); ctx.lineTo(140, 145); ctx.stroke();
        }
      }

      function renderWord(reveal) {
        var wordEl = card.querySelector('#' + wordId);
        wordEl.innerHTML = '';
        word.split('').forEach(function (c) {
          var show = reveal || guessed.indexOf(c) > -1;
          var box = document.createElement('div');
          box.style.cssText = 'width:38px;height:46px;display:flex;align-items:center;justify-content:center;font-family:Orbitron,sans-serif;font-size:1.3rem;font-weight:800;color:' + (show ? COLORS.gold : 'transparent') + ';background:rgba(255,215,0,0.06);border-bottom:3px solid ' + (show ? COLORS.gold : 'rgba(255,215,0,0.3)') + ';border-radius:6px 6px 0 0;transition:all 0.3s;';
          box.textContent = c;
          wordEl.appendChild(box);
        });
      }

      function renderLives() {
        var remaining = maxWrong - wrong;
        card.querySelector('#' + livesId).innerHTML = makeProgressBar(remaining, maxWrong, remaining <= 2 ? COLORS.wrong : COLORS.orange);
        card.querySelector('#hm_livect_' + canvasId).textContent = 'Lives: ' + remaining + ' / ' + maxWrong;
      }

      /* Letter buttons */
      var lettersDiv = card.querySelector('#' + letterId);
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (l) {
        var btn = document.createElement('button');
        btn.style.cssText = 'width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:1.5px solid rgba(255,215,0,0.2);border-radius:8px;background:rgba(255,215,0,0.06);color:' + COLORS.gold + ';font-family:Orbitron,sans-serif;font-size:0.75rem;font-weight:700;cursor:pointer;transition:all 0.2s ease;';
        btn.textContent = l;
        btn.onmouseenter = function () {
          if (!btn.getAttribute('data-used')) {
            btn.style.background = 'rgba(255,215,0,0.2)';
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = '0 0 8px rgba(255,215,0,0.3)';
          }
        };
        btn.onmouseleave = function () {
          if (!btn.getAttribute('data-used')) {
            btn.style.background = 'rgba(255,215,0,0.06)';
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
          }
        };
        btn.onclick = function () {
          if (btn.getAttribute('data-used') || gameOver) return;
          btn.setAttribute('data-used', '1');
          guessed.push(l);
          if (word.indexOf(l) > -1) {
            btn.style.background = 'rgba(0,201,167,0.25)';
            btn.style.borderColor = COLORS.teal;
            btn.style.color = COLORS.teal;
            btn.style.boxShadow = '0 0 8px rgba(0,201,167,0.3)';
            btn.style.cursor = 'default';
            E.rashidSay('Yes! \uD83D\uDC4D');
            renderWord(false);
            var allFound = word.split('').every(function (c) { return guessed.indexOf(c) > -1; });
            if (allFound) {
              gameOver = true;
              animateCorrect(card);
              E.endGame(1, 1);
              E.rashidSay('You got it! "' + word + '"! \uD83C\uDF89');
            }
          } else {
            btn.style.background = 'rgba(255,59,59,0.25)';
            btn.style.borderColor = COLORS.wrong;
            btn.style.color = COLORS.wrong;
            btn.style.cursor = 'default';
            /* Shake the button */
            btn.style.transform = 'translateX(-4px)';
            setTimeout(function () { btn.style.transform = 'translateX(4px)'; }, 80);
            setTimeout(function () { btn.style.transform = 'translateX(-2px)'; }, 160);
            setTimeout(function () { btn.style.transform = 'scale(0.9)'; }, 240);
            wrong++;
            renderLives();
            drawGallows(wrong);
            if (wrong >= maxWrong) {
              gameOver = true;
              renderWord(true);
              animateWrong(card);
              E.endGame(0, 1);
              E.rashidSay('The word was "' + word + '"! \uD83D\uDE22');
            }
          }
        };
        lettersDiv.appendChild(btn);
      });

      drawGallows(0);
      renderWord(false);
      renderLives();
      return {};
    }, destroy: function () {}
  });

  /* ────────────────────────────────────────────── */
  /* ── 25. Mini Crossword ──────────────────────── */
  /* ────────────────────────────────────────────── */
  E.register({
    id: 'crossword', name: 'Mini Crossword', emoji: '✏️', category: 'word', has2P: false,
    init: function (container, mode, diff) {
      var clues = [
        { word: 'CAMEL', dir: 'across', row: 0, col: 0, clue: 'Ship of the desert', num: 1 },
        { word: 'PEARL', dir: 'across', row: 2, col: 0, clue: 'Precious gem from the sea', num: 2 },
        { word: 'DATES', dir: 'across', row: 4, col: 0, clue: 'Sweet desert fruit', num: 3 },
        { word: 'CORAL', dir: 'down', row: 0, col: 0, clue: 'Found in UAE reefs', num: 4 },
        { word: 'EAGLE', dir: 'down', row: 0, col: 4, clue: 'Bird of prey (close to falcon)', num: 5 }
      ];
      var SIZE = 5;
      var grid = [];
      for (var r = 0; r < SIZE; r++) { grid[r] = []; for (var c = 0; c < SIZE; c++) grid[r][c] = { letter: '', input: false, clueNum: 0 }; }

      clues.forEach(function (cl) {
        for (var k = 0; k < cl.word.length; k++) {
          var rr = cl.dir === 'across' ? cl.row : cl.row + k;
          var cc = cl.dir === 'across' ? cl.col + k : cl.col;
          if (rr < SIZE && cc < SIZE) { grid[rr][cc].letter = cl.word[k]; grid[rr][cc].input = true; }
        }
        /* Mark first cell with clue number */
        if (cl.row < SIZE && cl.col < SIZE) grid[cl.row][cl.col].clueNum = cl.num;
      });

      var div = makeContainer();
      /* Layout: clues on left, grid on right */
      var wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;gap:16px;width:100%;max-width:620px;align-items:flex-start;flex-wrap:wrap;justify-content:center;';

      /* Clue panel */
      var cluePanel = makeCard({ maxW: '220px', pad: '16px', mb: '0' });
      cluePanel.style.flex = '0 0 auto';

      var acrossClues = clues.filter(function (c) { return c.dir === 'across'; });
      var downClues = clues.filter(function (c) { return c.dir === 'down'; });

      var clueHTML = '<div style="' + titleStyle() + 'font-size:0.8rem;margin-bottom:10px">CLUES</div>';
      clueHTML += '<div style="margin-bottom:10px"><div style="font-family:Orbitron,sans-serif;font-size:0.65rem;color:' + COLORS.orange + ';margin-bottom:6px;letter-spacing:1px">ACROSS</div>';
      acrossClues.forEach(function (cl) {
        clueHTML += '<div data-clue-num="' + cl.num + '" style="font-family:Inter,sans-serif;font-size:0.78rem;color:' + COLORS.dim + ';padding:5px 8px;border-radius:6px;margin-bottom:3px;transition:all 0.3s;cursor:default"><span style="color:' + COLORS.gold + ';font-weight:700">' + cl.num + '.</span> ' + cl.clue + '</div>';
      });
      clueHTML += '</div><div><div style="font-family:Orbitron,sans-serif;font-size:0.65rem;color:' + COLORS.orange + ';margin-bottom:6px;letter-spacing:1px">DOWN</div>';
      downClues.forEach(function (cl) {
        clueHTML += '<div data-clue-num="' + cl.num + '" style="font-family:Inter,sans-serif;font-size:0.78rem;color:' + COLORS.dim + ';padding:5px 8px;border-radius:6px;margin-bottom:3px;transition:all 0.3s;cursor:default"><span style="color:' + COLORS.gold + ';font-weight:700">' + cl.num + '.</span> ' + cl.clue + '</div>';
      });
      clueHTML += '</div>';
      cluePanel.innerHTML = clueHTML;

      /* Grid panel */
      var gridPanel = makeCard({ maxW: '320px', pad: '16px', mb: '0' });
      gridPanel.style.flex = '1 1 auto';
      gridPanel.style.minWidth = '280px';

      var gridId = 'cw_grid_' + Date.now();
      gridPanel.innerHTML = '<div style="' + titleStyle() + 'font-size:0.8rem;margin-bottom:12px">CROSSWORD</div>' +
        '<div id="' + gridId + '" style="display:inline-grid;grid-template-columns:repeat(' + SIZE + ',48px);gap:2px;justify-content:center;margin-bottom:14px"></div>' +
        '<div style="text-align:center"><button id="cw_check_' + gridId + '" style="' + btnStyle(COLORS.gold) + '">Check Answers</button></div>';

      wrapper.appendChild(cluePanel);
      wrapper.appendChild(gridPanel);
      div.appendChild(wrapper);
      container.appendChild(div);

      var gEl = gridPanel.querySelector('#' + gridId);
      var inputs = [];
      var allCells = [];

      for (var ri = 0; ri < SIZE; ri++) for (var ci = 0; ci < SIZE; ci++) {
        var cell = document.createElement('div');
        cell.style.cssText = 'width:48px;height:48px;position:relative;border-radius:4px;';
        if (grid[ri][ci].input) {
          cell.style.background = 'rgba(255,215,0,0.04)';
          cell.style.border = '1.5px solid rgba(255,215,0,0.15)';
          cell.style.transition = 'all 0.3s';
          if (grid[ri][ci].clueNum) {
            var numLabel = document.createElement('span');
            numLabel.style.cssText = 'position:absolute;top:2px;left:4px;font-family:Inter,sans-serif;font-size:0.55rem;color:' + COLORS.orange + ';font-weight:700;z-index:2;';
            numLabel.textContent = grid[ri][ci].clueNum;
            cell.appendChild(numLabel);
          }
          var inp = document.createElement('input');
          inp.type = 'text'; inp.maxLength = 1;
          inp.style.cssText = 'width:100%;height:100%;border:none;background:transparent;color:' + COLORS.gold + ';text-align:center;font-size:1.1rem;font-weight:800;text-transform:uppercase;outline:none;font-family:Orbitron,sans-serif;caret-color:' + COLORS.gold + ';';
          inp.setAttribute('data-r', ri); inp.setAttribute('data-c', ci);
          inp.onfocus = function () {
            this.parentElement.style.borderColor = COLORS.gold;
            this.parentElement.style.boxShadow = '0 0 12px rgba(255,215,0,0.3)';
            this.parentElement.style.background = 'rgba(255,215,0,0.1)';
          };
          inp.onblur = function () {
            this.parentElement.style.borderColor = 'rgba(255,215,0,0.15)';
            this.parentElement.style.boxShadow = 'none';
            this.parentElement.style.background = 'rgba(255,215,0,0.04)';
          };
          /* Auto-advance on input */
          inp.oninput = function () {
            if (this.value.length === 1) {
              var myIndex = inputs.indexOf(this);
              if (myIndex < inputs.length - 1) inputs[myIndex + 1].focus();
            }
          };
          inp.onkeydown = function (e) {
            if (e.key === 'Backspace' && this.value === '') {
              var myIndex = inputs.indexOf(this);
              if (myIndex > 0) { inputs[myIndex - 1].focus(); inputs[myIndex - 1].value = ''; }
            }
          };
          cell.appendChild(inp);
          inputs.push(inp);
        } else {
          cell.style.background = 'rgba(0,0,0,0.4)';
          cell.style.border = '1px solid rgba(0,0,0,0.2)';
        }
        gEl.appendChild(cell);
        allCells.push(cell);
      }

      gridPanel.querySelector('#cw_check_' + gridId).onclick = function () {
        var correct = 0, total = inputs.length;
        inputs.forEach(function (inp) {
          var r = parseInt(inp.getAttribute('data-r')), c = parseInt(inp.getAttribute('data-c'));
          var parentCell = inp.parentElement;
          if (inp.value.toUpperCase() === grid[r][c].letter) {
            correct++;
            inp.style.color = COLORS.teal;
            parentCell.style.background = 'rgba(0,201,167,0.12)';
            parentCell.style.borderColor = COLORS.teal;
          } else {
            inp.style.color = COLORS.wrong;
            parentCell.style.background = 'rgba(255,59,59,0.1)';
            parentCell.style.borderColor = COLORS.wrong;
          }
        });
        E.setScore(correct);
        if (correct === total) {
          E.rashidSay('Perfect crossword! \u270F\uFE0F\uD83C\uDF89');
          animateCorrect(gridPanel);
          E.endGame(correct, total);
        } else {
          animateWrong(gridPanel);
          E.rashidSay(correct + '/' + total + ' correct!');
        }
      };

      if (inputs.length) inputs[0].focus();
      return {};
    }, destroy: function () {}
  });

  /* ────────────────────────────────────────────── */
  /* ── 26. Anagram Solver ──────────────────────── */
  /* ────────────────────────────────────────────── */
  E.register({
    id: 'anagram', name: 'Anagram Solver', emoji: '🔤', category: 'word', has2P: false,
    init: function (container, mode, diff) {
      var wordCount = diff === 'easy' ? 5 : diff === 'hard' ? 10 : 8;
      var words = shuffle(UAE_WORDS).slice(0, wordCount), idx = 0, sc = 0;

      var div = makeContainer();
      var card = makeCard({ maxW: '480px', pad: '24px' });

      var statusId = 'an_st_' + Date.now();
      var chipsId = 'an_chips_' + Date.now();
      var answerId = 'an_ans_' + Date.now();
      var progId = 'an_prog_' + Date.now();

      card.innerHTML = '<div style="' + titleStyle() + '">Unscramble the Word</div>' +
        '<div id="' + progId + '">' + makeProgressBar(0, wordCount) + '</div>' +
        '<div id="' + statusId + '" style="' + statusStyle() + '">Round 1 of ' + wordCount + '</div>' +
        '<div id="' + answerId + '" style="display:flex;gap:6px;justify-content:center;min-height:50px;align-items:center;margin:12px 0;flex-wrap:wrap"></div>' +
        '<div id="' + chipsId + '" style="display:flex;gap:8px;justify-content:center;margin:12px 0;flex-wrap:wrap"></div>' +
        '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px">' +
          '<button id="an_clear_' + chipsId + '" style="' + btnStyle('rgba(255,255,255,0.1)', COLORS.white) + 'padding:8px 18px;font-size:0.75rem;">Clear</button>' +
          '<button id="an_shuffle_' + chipsId + '" style="' + btnStyle('rgba(255,107,53,0.2)', COLORS.orange) + 'padding:8px 18px;font-size:0.75rem;">Shuffle</button>' +
          '<button id="an_submit_' + chipsId + '" style="' + btnStyle(COLORS.gold) + 'padding:8px 22px;font-size:0.75rem;">Submit</button>' +
        '</div>';

      div.appendChild(card);
      container.appendChild(div);

      var currentScrambled = [];
      var selectedLetters = [];
      var chipElements = [];

      function renderAnswer() {
        var ansEl = card.querySelector('#' + answerId);
        ansEl.innerHTML = '';
        if (selectedLetters.length === 0) {
          ansEl.innerHTML = '<div style="font-family:Inter,sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.2)">Tap letters above to build your answer</div>';
          return;
        }
        selectedLetters.forEach(function (obj, i) {
          var slot = document.createElement('div');
          slot.style.cssText = 'width:40px;height:48px;display:flex;align-items:center;justify-content:center;background:rgba(0,201,167,0.12);border:1.5px solid rgba(0,201,167,0.3);border-radius:8px;font-family:Orbitron,sans-serif;font-size:1.1rem;font-weight:800;color:' + COLORS.teal + ';animation:anSlotIn 0.2s ease;cursor:pointer;transition:all 0.15s;';
          slot.textContent = obj.letter;
          slot.onclick = function () {
            /* Return letter to chips */
            chipElements[obj.chipIdx].style.opacity = '1';
            chipElements[obj.chipIdx].style.pointerEvents = 'auto';
            chipElements[obj.chipIdx].style.transform = 'scale(1)';
            selectedLetters.splice(i, 1);
            renderAnswer();
          };
          ansEl.appendChild(slot);
        });
      }

      function showWord() {
        var scrambled = shuffle(words[idx].split(''));
        if (scrambled.join('') === words[idx]) scrambled = shuffle(words[idx].split(''));
        currentScrambled = scrambled;
        selectedLetters = [];
        chipElements = [];

        card.querySelector('#' + statusId).textContent = 'Round ' + (idx + 1) + ' of ' + wordCount;
        card.querySelector('#' + progId).innerHTML = makeProgressBar(idx, wordCount);

        var chipsDiv = card.querySelector('#' + chipsId);
        chipsDiv.innerHTML = '';
        scrambled.forEach(function (letter, ci) {
          var chip = document.createElement('div');
          chip.style.cssText = 'width:44px;height:52px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,215,0,0.06));border:2px solid rgba(255,215,0,0.25);border-radius:10px;font-family:Orbitron,sans-serif;font-size:1.2rem;font-weight:800;color:' + COLORS.gold + ';cursor:pointer;transition:all 0.2s ease;box-shadow:0 3px 8px rgba(0,0,0,0.2);';
          chip.textContent = letter;
          chip.onmouseenter = function () {
            if (chip.style.opacity !== '0.2') {
              chip.style.transform = 'scale(1.1) translateY(-4px)';
              chip.style.boxShadow = '0 6px 16px rgba(255,215,0,0.3)';
            }
          };
          chip.onmouseleave = function () {
            if (chip.style.opacity !== '0.2') {
              chip.style.transform = 'scale(1)';
              chip.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
            }
          };
          chip.onclick = function () {
            if (chip.style.opacity === '0.2') return;
            selectedLetters.push({ letter: letter, chipIdx: ci });
            chip.style.opacity = '0.2';
            chip.style.pointerEvents = 'none';
            chip.style.transform = 'scale(0.8)';
            renderAnswer();
          };
          chipsDiv.appendChild(chip);
          chipElements.push(chip);
        });

        renderAnswer();
      }

      card.querySelector('#an_clear_' + chipsId).onclick = function () {
        selectedLetters = [];
        chipElements.forEach(function (ch) {
          ch.style.opacity = '1';
          ch.style.pointerEvents = 'auto';
          ch.style.transform = 'scale(1)';
        });
        renderAnswer();
      };

      card.querySelector('#an_shuffle_' + chipsId).onclick = function () {
        /* Re-scramble remaining (non-selected) chips */
        card.querySelector('#an_clear_' + chipsId).click();
        var newOrder = shuffle(currentScrambled.slice());
        currentScrambled = newOrder;
        showWord();
      };

      card.querySelector('#an_submit_' + chipsId).onclick = function () {
        var guess = selectedLetters.map(function (o) { return o.letter; }).join('');
        if (guess === words[idx]) {
          sc++; E.addScore(1);
          animateCorrect(card);
          E.rashidSay('Correct! \uD83D\uDD24');
        } else {
          animateWrong(card);
          E.rashidSay('It was "' + words[idx] + '"!');
        }
        idx++;
        if (idx >= words.length) {
          card.querySelector('#' + progId).innerHTML = makeProgressBar(wordCount, wordCount);
          E.endGame(sc, words.length);
        } else showWord();
      };

      showWord();
      return {};
    }, destroy: function () {}
  });

  /* ────────────────────────────────────────────── */
  /* ── 27. Typing Race ─────────────────────────── */
  /* ────────────────────────────────────────────── */
  E.register({
    id: 'typing-race', name: 'Typing Race', emoji: '⌨️', category: 'word', has2P: true,
    _tv: null,
    init: function (container, mode, diff) {
      var words = shuffle(UAE_WORDS.concat(['ARABIA', 'FALCON', 'HERITAGE', 'CULTURE', 'PEARLING', 'BEDOUIN']));
      var timeTotal = diff === 'easy' ? 45 : diff === 'hard' ? 20 : 30;
      var idx = 0, sc1 = 0, sc2 = 0, timeLeft = timeTotal, totalTyped = 0;

      var div = makeContainer();
      var card = makeCard({ maxW: '540px', pad: '22px 26px' });

      var timerId = 'tr_timer_' + Date.now();
      var trackId = 'tr_track_' + Date.now();
      var wordId = 'tr_word_' + Date.now();
      var wpmId = 'tr_wpm_' + Date.now();

      var is2p = mode === '2p';

      var inputsHTML = is2p ?
        '<div style="display:flex;gap:14px;width:100%;margin-top:14px">' +
          '<div style="flex:1;text-align:center"><div style="font-family:Orbitron,sans-serif;font-size:0.65rem;color:' + COLORS.teal + ';margin-bottom:6px;letter-spacing:1px">PLAYER 1</div><input id="tr_in1_' + wordId + '" style="' + inputStyle() + 'max-width:100%;font-size:0.85rem;" placeholder="Type here..." /><div id="tr_sc1_' + wordId + '" style="' + counterStyle() + 'margin-top:6px">Score: 0</div></div>' +
          '<div style="flex:1;text-align:center"><div style="font-family:Orbitron,sans-serif;font-size:0.65rem;color:' + COLORS.orange + ';margin-bottom:6px;letter-spacing:1px">PLAYER 2</div><input id="tr_in2_' + wordId + '" style="' + inputStyle() + 'max-width:100%;font-size:0.85rem;" placeholder="Type here..." /><div id="tr_sc2_' + wordId + '" style="' + counterStyle() + 'margin-top:6px">Score: 0</div></div>' +
        '</div>' :
        '<div style="text-align:center;margin-top:14px"><input id="tr_in1_' + wordId + '" style="' + inputStyle() + '" placeholder="Type the word..." autofocus />' +
        '<div id="tr_sc1_' + wordId + '" style="' + counterStyle() + 'margin-top:8px">Score: 0</div></div>';

      card.innerHTML = '<div style="' + titleStyle() + '">Typing Race</div>' +
        /* Timer bar */
        '<div id="' + timerId + '" style="margin:8px 0">' + makeProgressBar(timeTotal, timeTotal, COLORS.orange) + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
          '<span style="font-family:Orbitron,sans-serif;font-size:0.7rem;color:' + COLORS.dim + '">Time: <span id="tr_timect_' + wordId + '">' + timeTotal + 's</span></span>' +
          '<span id="' + wpmId + '" style="font-family:Orbitron,sans-serif;font-size:0.7rem;color:' + COLORS.teal + '">0 WPM</span>' +
        '</div>' +
        /* Race track visualization */
        '<div id="' + trackId + '" style="width:100%;height:32px;background:rgba(0,0,0,0.3);border-radius:16px;position:relative;overflow:hidden;margin-bottom:10px;border:1px solid rgba(255,215,0,0.1)">' +
          '<div id="tr_car_' + wordId + '" style="position:absolute;top:4px;left:4px;width:24px;height:24px;background:linear-gradient(135deg,' + COLORS.gold + ',' + COLORS.orange + ');border-radius:50%;transition:left 0.5s ease;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 0 10px rgba(255,215,0,0.5)">🏎</div>' +
          '<div style="position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:14px">🏁</div>' +
        '</div>' +
        /* Word display */
        '<div id="' + wordId + '" style="text-align:center;padding:16px;background:rgba(0,0,0,0.2);border-radius:12px;margin-bottom:4px"></div>' +
        inputsHTML;

      div.appendChild(card);
      container.appendChild(div);

      function renderWord(typed) {
        var w = words[idx];
        var html = '';
        var tv = (typed || '').toUpperCase();
        for (var i = 0; i < w.length; i++) {
          var color = COLORS.dim;
          var bg = 'transparent';
          var weight = '700';
          if (i < tv.length) {
            if (tv[i] === w[i]) { color = COLORS.teal; bg = 'rgba(0,201,167,0.1)'; weight = '900'; }
            else { color = COLORS.wrong; bg = 'rgba(255,59,59,0.1)'; }
          } else if (i === tv.length) {
            color = COLORS.gold; weight = '900';
            bg = 'rgba(255,215,0,0.08)';
          }
          html += '<span style="display:inline-block;font-family:Orbitron,sans-serif;font-size:1.8rem;font-weight:' + weight + ';color:' + color + ';background:' + bg + ';padding:2px 4px;border-radius:4px;transition:all 0.15s;letter-spacing:3px;' + (i === tv.length ? 'border-bottom:3px solid ' + COLORS.gold + ';' : '') + '">' + w[i] + '</span>';
        }
        card.querySelector('#' + wordId).innerHTML = html;
      }

      function updateTrack() {
        var maxWords = 10;
        var pct = Math.min(95, (sc1 / maxWords) * 95);
        var car = card.querySelector('#tr_car_' + wordId);
        if (car) car.style.left = 'calc(' + pct + '% - 12px)';
      }

      function nextWord(player) {
        if (player === 1) sc1++; else sc2++;
        totalTyped++;
        E.setScore(is2p ? Math.max(sc1, sc2) : sc1);
        idx++; if (idx >= words.length) idx = 0;
        card.querySelector('#tr_in1_' + wordId).value = '';
        if (is2p) {
          card.querySelector('#tr_in2_' + wordId).value = '';
          card.querySelector('#tr_sc1_' + wordId).textContent = 'Score: ' + sc1;
          card.querySelector('#tr_sc2_' + wordId).textContent = 'Score: ' + sc2;
        } else {
          card.querySelector('#tr_sc1_' + wordId).textContent = 'Score: ' + sc1;
        }
        updateTrack();
        renderWord('');
        /* Flash celebration */
        card.querySelector('#' + wordId).style.boxShadow = '0 0 20px rgba(0,201,167,0.4)';
        setTimeout(function () { card.querySelector('#' + wordId).style.boxShadow = 'none'; }, 400);
      }

      var inp1 = card.querySelector('#tr_in1_' + wordId);
      inp1.oninput = function () {
        renderWord(inp1.value);
        if (inp1.value.trim().toUpperCase() === words[idx]) nextWord(1);
      };

      if (is2p) {
        var inp2 = card.querySelector('#tr_in2_' + wordId);
        inp2.oninput = function () {
          renderWord(inp2.value);
          if (inp2.value.trim().toUpperCase() === words[idx]) nextWord(2);
        };
      }

      renderWord('');
      inp1.focus();

      this._tv = setInterval(function () {
        timeLeft--;
        var elapsed = timeTotal - timeLeft;
        var wpm = elapsed > 0 ? Math.round((totalTyped / elapsed) * 60) : 0;
        card.querySelector('#tr_timect_' + wordId).textContent = timeLeft + 's';
        card.querySelector('#' + timerId).innerHTML = makeProgressBar(timeLeft, timeTotal, timeLeft <= 5 ? COLORS.wrong : COLORS.orange);
        card.querySelector('#' + wpmId).textContent = wpm + ' WPM';
        if (timeLeft <= 5) {
          card.querySelector('#tr_timect_' + wordId).style.color = COLORS.wrong;
        }
        if (timeLeft <= 0) {
          clearInterval(this._tv);
          if (is2p) { var w = sc1 > sc2 ? 'P1 wins!' : sc2 > sc1 ? 'P2 wins!' : 'Draw!'; E.rashidSay(w); }
          E.endGame(is2p ? Math.max(sc1, sc2) : sc1, is2p ? Math.max(sc1, sc2) || 1 : sc1 || 1);
        }
      }.bind(this), 1000);

      return {};
    }, destroy: function () { if (this._tv) clearInterval(this._tv); }
  });

  /* ────────────────────────────────────────────── */
  /* ── 28. Missing Letter ──────────────────────── */
  /* ────────────────────────────────────────────── */
  E.register({
    id: 'missing-letter', name: 'Missing Letter', emoji: '🔡', category: 'word', has2P: false,
    init: function (container, mode, diff) {
      var roundCount = diff === 'easy' ? 6 : diff === 'hard' ? 15 : 10;
      var words = shuffle(UAE_WORDS).slice(0, roundCount), idx = 0, sc = 0;

      var div = makeContainer();
      var card = makeCard({ maxW: '440px', pad: '24px' });
      var wordId = 'ml_w_' + Date.now();
      var optsId = 'ml_opts_' + Date.now();
      var dotsId = 'ml_dots_' + Date.now();
      var progId = 'ml_prog_' + Date.now();

      card.innerHTML = '<div style="' + titleStyle() + '">Pick the Missing Letter</div>' +
        '<div id="' + progId + '">' + makeProgressBar(0, roundCount) + '</div>' +
        '<div id="' + dotsId + '">' + makeProgressDots(0, roundCount) + '</div>' +
        '<div id="' + wordId + '" style="display:flex;justify-content:center;gap:6px;margin:20px 0;flex-wrap:wrap"></div>' +
        '<div id="' + optsId + '" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:240px;margin:0 auto"></div>';

      div.appendChild(card);
      container.appendChild(div);

      function showQuestion() {
        var word = words[idx];
        var pos = Math.floor(Math.random() * word.length);
        var missing = word[pos];

        /* Render word with blank */
        var wordEl = card.querySelector('#' + wordId);
        wordEl.innerHTML = '';
        word.split('').forEach(function (c, i) {
          var letterBox = document.createElement('div');
          if (i === pos) {
            letterBox.style.cssText = 'width:42px;height:50px;display:flex;align-items:center;justify-content:center;background:rgba(255,107,53,0.1);border-bottom:3px solid ' + COLORS.orange + ';border-radius:6px 6px 0 0;font-family:Orbitron,sans-serif;font-size:1.4rem;font-weight:800;color:' + COLORS.orange + ';position:relative;';
            letterBox.innerHTML = '<span style="animation:mlBlink 1s infinite">_</span>';
            /* Add blink animation via inline style */
            var styleTag = document.createElement('style');
            styleTag.textContent = '@keyframes mlBlink{0%,50%{opacity:1}51%,100%{opacity:0.3}}';
            if (!document.querySelector('#ml-blink-style')) { styleTag.id = 'ml-blink-style'; document.head.appendChild(styleTag); }
          } else {
            letterBox.style.cssText = 'width:42px;height:50px;display:flex;align-items:center;justify-content:center;background:rgba(255,215,0,0.06);border-bottom:3px solid rgba(255,215,0,0.15);border-radius:6px 6px 0 0;font-family:Orbitron,sans-serif;font-size:1.4rem;font-weight:800;color:' + COLORS.gold + ';';
            letterBox.textContent = c;
          }
          wordEl.appendChild(letterBox);
        });

        /* Render dots */
        card.querySelector('#' + dotsId).innerHTML = makeProgressDots(idx, roundCount);
        card.querySelector('#' + progId).innerHTML = makeProgressBar(idx, roundCount);

        /* Options in 2x2 grid */
        var opts = [missing]; while (opts.length < 4) { var r = String.fromCharCode(65 + Math.floor(Math.random() * 26)); if (opts.indexOf(r) === -1) opts.push(r); }
        opts = shuffle(opts);
        var optDiv = card.querySelector('#' + optsId);
        optDiv.innerHTML = '';
        var optColors = [COLORS.gold, COLORS.teal, COLORS.orange, '#AB47BC'];
        opts.forEach(function (o, oi) {
          var btn = document.createElement('button');
          var clr = optColors[oi % optColors.length];
          btn.style.cssText = 'padding:14px;border:2px solid ' + clr + '33;border-radius:12px;background:' + clr + '15;color:' + clr + ';font-family:Orbitron,sans-serif;font-size:1.3rem;font-weight:800;cursor:pointer;transition:all 0.2s ease;';
          btn.textContent = o;
          btn.onmouseenter = function () {
            btn.style.background = clr + '30';
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = '0 0 12px ' + clr + '40';
          };
          btn.onmouseleave = function () {
            btn.style.background = clr + '15';
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
          };
          btn.onclick = function () {
            if (o === missing) {
              sc++; E.addScore(1);
              btn.style.background = 'rgba(0,201,167,0.3)';
              btn.style.borderColor = COLORS.teal;
              btn.style.color = COLORS.teal;
              animateCorrect(card);
              E.rashidSay('Correct! \uD83D\uDC4D');
            } else {
              btn.style.background = 'rgba(255,59,59,0.3)';
              btn.style.borderColor = COLORS.wrong;
              btn.style.color = COLORS.wrong;
              animateWrong(card);
              E.rashidSay('It was "' + missing + '"!');
            }
            /* Disable all */
            var allBtns = optDiv.querySelectorAll('button');
            for (var b = 0; b < allBtns.length; b++) allBtns[b].style.pointerEvents = 'none';
            setTimeout(function () {
              idx++;
              if (idx >= words.length) {
                card.querySelector('#' + progId).innerHTML = makeProgressBar(roundCount, roundCount);
                card.querySelector('#' + dotsId).innerHTML = makeProgressDots(roundCount, roundCount);
                E.endGame(sc, words.length);
              } else showQuestion();
            }, 700);
          };
          optDiv.appendChild(btn);
        });
      }
      showQuestion();
      return {};
    }, destroy: function () {}
  });

  /* ────────────────────────────────────────────── */
  /* ── 29. Word Builder ────────────────────────── */
  /* ────────────────────────────────────────────── */
  E.register({
    id: 'word-builder', name: 'Word Builder', emoji: '🏗️', category: 'word', has2P: false,
    _tv: null,
    init: function (container, mode, diff) {
      var validWords = UAE_WORDS.concat(['DATE', 'OAR', 'DEN', 'RED', 'OLD', 'SEA', 'SUN', 'TAN', 'RAN', 'PAN', 'FAN', 'OIL', 'SAND', 'LAND', 'RAIN', 'MAIN', 'DEER', 'SEED', 'REED', 'DONE', 'GONE', 'MOON', 'NOON', 'LOOM', 'ROOM']);
      var letters = [];
      var vowels = 'AEIOU', consonants = 'BCDFGHLMNPRST';
      for (var i = 0; i < 3; i++) letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
      for (var j = 0; j < 4; j++) letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
      letters = shuffle(letters);
      var wbTime = diff === 'easy' ? 90 : diff === 'hard' ? 40 : 60;
      var found = [], sc = 0, timeLeft = wbTime;

      var div = makeContainer();
      var card = makeCard({ maxW: '480px', pad: '22px 24px' });
      var timerId = 'wb_timer_' + Date.now();
      var tilesId = 'wb_tiles_' + Date.now();
      var foundId = 'wb_found_' + Date.now();
      var inputId = 'wb_in_' + Date.now();
      var countId = 'wb_count_' + Date.now();

      card.innerHTML = '<div style="' + titleStyle() + '">Word Builder</div>' +
        '<div id="' + timerId + '" style="margin:8px 0">' + makeProgressBar(wbTime, wbTime, COLORS.orange) + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
          '<span style="font-family:Orbitron,sans-serif;font-size:0.7rem;color:' + COLORS.dim + '">Time: <span id="wb_timect_' + tilesId + '">' + wbTime + 's</span></span>' +
          '<span id="' + countId + '" style="display:inline-flex;align-items:center;gap:4px;font-family:Orbitron,sans-serif;font-size:0.7rem;color:' + COLORS.teal + ';background:rgba(0,201,167,0.1);padding:4px 12px;border-radius:20px;border:1px solid rgba(0,201,167,0.2)">Words: 0</span>' +
        '</div>' +
        '<div style="font-family:Inter,sans-serif;font-size:0.7rem;color:' + COLORS.dim + ';text-align:center;margin-bottom:8px">Build words with 3+ letters using these tiles:</div>' +
        '<div id="' + tilesId + '" style="display:flex;gap:10px;justify-content:center;margin:12px 0;flex-wrap:wrap"></div>' +
        '<div style="text-align:center;margin:14px 0"><input id="' + inputId + '" style="' + inputStyle() + '" placeholder="Build a word..." />' +
        '<div style="font-family:Inter,sans-serif;font-size:0.65rem;color:' + COLORS.dim + ';margin-top:4px">Min. 3 letters</div></div>' +
        '<div style="text-align:center"><button id="wb_sub_' + tilesId + '" style="' + btnStyle(COLORS.gold) + '">Submit Word</button></div>' +
        '<div id="' + foundId + '" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:14px;min-height:28px"></div>';

      div.appendChild(card);
      container.appendChild(div);

      /* Render letter tiles */
      var tilesDiv = card.querySelector('#' + tilesId);
      letters.forEach(function (l) {
        var tile = document.createElement('div');
        tile.style.cssText = 'width:50px;height:56px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(255,215,0,0.15),rgba(255,215,0,0.05));border:2px solid rgba(255,215,0,0.25);border-radius:10px;font-family:Orbitron,sans-serif;font-size:1.3rem;font-weight:800;color:' + COLORS.gold + ';cursor:pointer;transition:all 0.2s;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
        tile.textContent = l;
        tile.onmouseenter = function () {
          tile.style.transform = 'scale(1.1) translateY(-3px)';
          tile.style.boxShadow = '0 6px 18px rgba(255,215,0,0.3)';
        };
        tile.onmouseleave = function () {
          tile.style.transform = 'scale(1)';
          tile.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        };
        tile.onclick = function () {
          var inp = card.querySelector('#' + inputId);
          inp.value += l;
          inp.focus();
        };
        tilesDiv.appendChild(tile);
      });

      function addFoundChip(word) {
        var chip = document.createElement('span');
        chip.style.cssText = 'display:inline-block;padding:4px 12px;border-radius:20px;font-family:Orbitron,sans-serif;font-size:0.7rem;font-weight:700;color:' + COLORS.teal + ';background:rgba(0,201,167,0.1);border:1px solid rgba(0,201,167,0.25);animation:wbChipIn 0.3s ease;';
        chip.textContent = word;
        card.querySelector('#' + foundId).appendChild(chip);
      }

      card.querySelector('#wb_sub_' + tilesId).onclick = function () {
        var inp = card.querySelector('#' + inputId);
        var guess = inp.value.trim().toUpperCase();
        inp.value = '';
        inp.focus();
        if (guess.length < 3) { E.rashidSay('At least 3 letters!'); animateWrong(card); return; }
        if (found.indexOf(guess) > -1) { E.rashidSay('Already found!'); return; }
        var avail = letters.slice();
        var valid = true;
        for (var k = 0; k < guess.length; k++) {
          var pos = avail.indexOf(guess[k]);
          if (pos === -1) { valid = false; break; }
          avail.splice(pos, 1);
        }
        if (valid) {
          found.push(guess); sc++; E.addScore(1);
          addFoundChip(guess);
          card.querySelector('#' + countId).textContent = 'Words: ' + found.length;
          animateCorrect(card);
          E.rashidSay('Nice word! "' + guess + '"! \uD83D\uDCDD');
        } else {
          animateWrong(card);
          E.rashidSay('Can\'t make that word!');
        }
      };

      card.querySelector('#' + inputId).onkeydown = function (e) {
        if (e.key === 'Enter') card.querySelector('#wb_sub_' + tilesId).click();
      };

      this._tv = setInterval(function () {
        timeLeft--;
        card.querySelector('#wb_timect_' + tilesId).textContent = timeLeft + 's';
        card.querySelector('#' + timerId).innerHTML = makeProgressBar(timeLeft, wbTime, timeLeft <= 10 ? COLORS.wrong : COLORS.orange);
        if (timeLeft <= 10) card.querySelector('#wb_timect_' + tilesId).style.color = COLORS.wrong;
        if (timeLeft <= 0) { clearInterval(this._tv); E.endGame(sc, sc || 1); }
      }.bind(this), 1000);

      return {};
    }, destroy: function () { if (this._tv) clearInterval(this._tv); }
  });

  /* ────────────────────────────────────────────── */
  /* ── 30. Spell It ────────────────────────────── */
  /* ────────────────────────────────────────────── */
  E.register({
    id: 'spell-it', name: 'Spell It', emoji: '🐝', category: 'word', has2P: false,
    init: function (container, mode, diff) {
      var items = shuffle([
        { hint: 'Bird used in traditional hunting', word: 'FALCON' },
        { hint: 'Round gem from the sea', word: 'PEARL' },
        { hint: 'Ship of the desert', word: 'CAMEL' },
        { hint: 'Traditional marketplace', word: 'SOUK' },
        { hint: 'Sweet fruit of palm trees', word: 'DATES' },
        { hint: 'Sandy hill in the desert', word: 'DUNE' },
        { hint: 'Islamic place of worship', word: 'MOSQUE' },
        { hint: 'Green area in the desert with water', word: 'OASIS' },
        { hint: 'Traditional wooden boat', word: 'DHOW' },
        { hint: 'UAE currency', word: 'DIRHAM' }
      ]).slice(0, 8);
      var idx = 0, sc = 0;
      var totalRounds = items.length;

      var div = makeContainer();
      var card = makeCard({ maxW: '440px', pad: '24px' });
      var hintId = 'si_hint_' + Date.now();
      var inputId = 'si_in_' + Date.now();
      var statusId = 'si_st_' + Date.now();
      var progId = 'si_prog_' + Date.now();
      var dotsId = 'si_dots_' + Date.now();
      var charId = 'si_char_' + Date.now();
      var feedbackId = 'si_fb_' + Date.now();
      var diffLevel = diff === 'easy' ? 'Easy' : diff === 'hard' ? 'Hard' : 'Medium';
      var diffColor = diff === 'easy' ? COLORS.teal : diff === 'hard' ? COLORS.wrong : COLORS.orange;

      card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
          '<div style="' + titleStyle() + 'margin-bottom:0">Spell It!</div>' +
          '<span style="font-family:Orbitron,sans-serif;font-size:0.6rem;color:' + diffColor + ';background:' + diffColor + '18;padding:3px 10px;border-radius:12px;border:1px solid ' + diffColor + '33">' + diffLevel + '</span>' +
        '</div>' +
        '<div id="' + progId + '">' + makeProgressBar(0, totalRounds) + '</div>' +
        '<div id="' + dotsId + '">' + makeProgressDots(0, totalRounds) + '</div>' +
        '<div id="' + statusId + '" style="' + statusStyle() + '">Round 1 of ' + totalRounds + '</div>' +
        /* Hint card */
        '<div id="' + hintId + '" style="background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,107,53,0.05));border:1px solid rgba(255,215,0,0.15);border-radius:12px;padding:18px;margin:14px 0;text-align:center">' +
          '<div style="font-size:1.5rem;margin-bottom:6px">💡</div>' +
          '<div style="font-family:Inter,sans-serif;font-size:0.95rem;color:' + COLORS.gold + ';font-weight:600;line-height:1.4"></div>' +
        '</div>' +
        /* Input area */
        '<div style="text-align:center;margin:14px 0;position:relative">' +
          '<input id="' + inputId + '" style="' + inputStyle() + '" placeholder="Spell the word..." />' +
          '<div id="' + charId + '" style="font-family:Inter,sans-serif;font-size:0.65rem;color:' + COLORS.dim + ';margin-top:4px">0 characters</div>' +
        '</div>' +
        '<div id="' + feedbackId + '" style="text-align:center;min-height:32px;margin-bottom:10px"></div>' +
        '<div style="text-align:center"><button id="si_sub_' + inputId + '" style="' + btnStyle(COLORS.gold) + '">Check Spelling</button></div>';

      div.appendChild(card);
      container.appendChild(div);

      function show() {
        var hintCard = card.querySelector('#' + hintId);
        hintCard.querySelector('div:last-child').textContent = items[idx].hint;
        card.querySelector('#' + inputId).value = '';
        card.querySelector('#' + statusId).textContent = 'Round ' + (idx + 1) + ' of ' + totalRounds;
        card.querySelector('#' + dotsId).innerHTML = makeProgressDots(idx, totalRounds);
        card.querySelector('#' + progId).innerHTML = makeProgressBar(idx, totalRounds);
        card.querySelector('#' + charId).textContent = '0 characters';
        card.querySelector('#' + feedbackId).innerHTML = '';
        card.querySelector('#' + inputId).focus();
      }

      card.querySelector('#' + inputId).oninput = function () {
        var len = this.value.length;
        card.querySelector('#' + charId).textContent = len + ' character' + (len !== 1 ? 's' : '');
      };

      card.querySelector('#si_sub_' + inputId).onclick = function () {
        var guess = card.querySelector('#' + inputId).value.trim().toUpperCase();
        if (!guess) return;
        var fbEl = card.querySelector('#' + feedbackId);
        if (guess === items[idx].word) {
          sc++; E.addScore(1);
          fbEl.innerHTML = '<span style="font-size:1.5rem">&#10003;</span><span style="font-family:Inter,sans-serif;font-size:0.85rem;color:' + COLORS.teal + ';margin-left:8px">Perfect spelling!</span>';
          fbEl.style.color = COLORS.teal;
          animateCorrect(card);
          E.rashidSay('Perfect spelling! \uD83D\uDC1D');
        } else {
          fbEl.innerHTML = '<span style="font-size:1.5rem">&#10007;</span><span style="font-family:Inter,sans-serif;font-size:0.85rem;color:' + COLORS.wrong + ';margin-left:8px">It was "' + items[idx].word + '"</span>';
          fbEl.style.color = COLORS.wrong;
          animateWrong(card);
          E.rashidSay('It was "' + items[idx].word + '"!');
        }
        setTimeout(function () {
          idx++;
          if (idx >= items.length) {
            card.querySelector('#' + progId).innerHTML = makeProgressBar(totalRounds, totalRounds);
            card.querySelector('#' + dotsId).innerHTML = makeProgressDots(totalRounds, totalRounds);
            E.endGame(sc, items.length);
          } else show();
        }, 900);
      };

      card.querySelector('#' + inputId).onkeydown = function (e) {
        if (e.key === 'Enter') card.querySelector('#si_sub_' + inputId).click();
      };

      show();
      return {};
    }, destroy: function () {}
  });

  /* ────────────────────────────────────────────── */
  /* ── 31. Rhyme Match ─────────────────────────── */
  /* ────────────────────────────────────────────── */
  E.register({
    id: 'rhyme-match', name: 'Rhyme Match', emoji: '🎵', category: 'word', has2P: false,
    init: function (container, mode, diff) {
      var pairs = shuffle([
        ['SAND', 'LAND'], ['GOLD', 'BOLD'], ['PEARL', 'GIRL'], ['MOON', 'DUNE'],
        ['DATE', 'GREAT'], ['SOUK', 'BOOK'], ['RAIN', 'MAIN'], ['STAR', 'FAR']
      ]).slice(0, 6);
      var left = shuffle(pairs.map(function (p) { return p[0]; }));
      var right = shuffle(pairs.map(function (p) { return p[1]; }));
      var matched = [], selectedLeft = -1, sc = 0;

      var div = makeContainer();
      var card = makeCard({ maxW: '500px', pad: '22px 24px' });
      var areaId = 'rm_area_' + Date.now();
      var progId = 'rm_prog_' + Date.now();

      card.innerHTML = '<div style="' + titleStyle() + '">Match the Rhyming Pairs</div>' +
        '<div id="' + progId + '">' + makeProgressBar(0, pairs.length) + '</div>' +
        '<div style="' + counterStyle() + 'margin-bottom:14px" id="rm_count_' + areaId + '">Matched: 0 / ' + pairs.length + '</div>' +
        '<div id="' + areaId + '" style="display:flex;gap:24px;justify-content:center;align-items:flex-start"></div>';

      div.appendChild(card);
      container.appendChild(div);

      var area = card.querySelector('#' + areaId);
      var leftCol = document.createElement('div');
      leftCol.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
      var rightCol = document.createElement('div');
      rightCol.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
      area.appendChild(leftCol);
      area.appendChild(rightCol);

      function makeCardBtn(text, isMatched, isSelected, side, color) {
        var btn = document.createElement('button');
        var bg, border, col;
        if (isMatched) {
          bg = 'rgba(0,201,167,0.15)';
          border = COLORS.teal;
          col = COLORS.teal;
        } else if (isSelected) {
          bg = 'rgba(255,215,0,0.15)';
          border = COLORS.gold;
          col = COLORS.gold;
        } else {
          bg = 'rgba(255,255,255,0.04)';
          border = 'rgba(255,255,255,0.12)';
          col = COLORS.white;
        }
        btn.style.cssText = 'width:120px;padding:14px 10px;border:2px solid ' + border + ';border-radius:12px;background:' + bg + ';color:' + col + ';font-family:Orbitron,sans-serif;font-size:0.85rem;font-weight:700;cursor:' + (isMatched ? 'default' : 'pointer') + ';transition:all 0.25s ease;text-align:center;box-shadow:' + (isSelected ? '0 6px 20px rgba(255,215,0,0.25)' : isMatched ? '0 4px 12px rgba(0,201,167,0.2)' : '0 2px 8px rgba(0,0,0,0.15)') + ';transform:' + (isSelected ? 'translateY(-4px) scale(1.05)' : 'translateY(0)') + ';' + (isMatched ? 'opacity:0.7;' : '');
        btn.textContent = text;
        if (!isMatched) {
          btn.onmouseenter = function () {
            if (!isSelected) {
              btn.style.transform = 'translateY(-2px)';
              btn.style.boxShadow = '0 4px 16px rgba(255,215,0,0.2)';
              btn.style.borderColor = 'rgba(255,215,0,0.3)';
            }
          };
          btn.onmouseleave = function () {
            if (!isSelected) {
              btn.style.transform = 'translateY(0)';
              btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              btn.style.borderColor = 'rgba(255,255,255,0.12)';
            }
          };
        }
        return btn;
      }

      function render() {
        leftCol.innerHTML = ''; rightCol.innerHTML = '';
        left.forEach(function (w, i) {
          var isM = matched.indexOf(w) > -1;
          var isSel = selectedLeft === i;
          var btn = makeCardBtn(w, isM, isSel, 'left');
          if (!isM) btn.onclick = function () { selectedLeft = i; render(); };
          leftCol.appendChild(btn);
        });
        right.forEach(function (w, j) {
          var isM = matched.indexOf(w) > -1;
          var btn = makeCardBtn(w, isM, false, 'right');
          if (!isM) btn.onclick = function () {
            if (selectedLeft < 0) return;
            var lWord = left[selectedLeft];
            var isMatch = pairs.some(function (p) { return (p[0] === lWord && p[1] === w) || (p[1] === lWord && p[0] === w); });
            if (isMatch) {
              matched.push(lWord, w); sc++; E.addScore(1);
              animateCorrect(card);
              E.rashidSay(lWord + ' \u2194 ' + w + '! \uD83C\uDFB5');
              card.querySelector('#rm_count_' + areaId).textContent = 'Matched: ' + sc + ' / ' + pairs.length;
              card.querySelector('#' + progId).innerHTML = makeProgressBar(sc, pairs.length);
            } else {
              animateWrong(card);
              E.rashidSay('Not a match!');
            }
            selectedLeft = -1; render();
            if (matched.length === left.length + right.length) E.endGame(sc, pairs.length);
          };
          rightCol.appendChild(btn);
        });
      }
      render();
      return {};
    }, destroy: function () {}
  });

  /* ────────────────────────────────────────────── */
  /* ── 32. Arabic Match ────────────────────────── */
  /* ────────────────────────────────────────────── */
  E.register({
    id: 'arabic-match', name: 'Arabic Match', emoji: '🔤', category: 'word', has2P: false,
    init: function (container, mode, diff) {
      var pairs = shuffle([
        ['\u0633\u0644\u0627\u0645', 'Hello'],
        ['\u0634\u0643\u0631\u0627\u064B', 'Thank you'],
        ['\u0645\u0627\u0621', 'Water'],
        ['\u0634\u0645\u0633', 'Sun'],
        ['\u0642\u0645\u0631', 'Moon'],
        ['\u0628\u062D\u0631', 'Sea'],
        ['\u062C\u0645\u0644', 'Camel'],
        ['\u0646\u062E\u0644\u0629', 'Palm tree'],
        ['\u0635\u0642\u0631', 'Falcon'],
        ['\u0644\u0624\u0644\u0624\u0629', 'Pearl']
      ]).slice(0, 8);
      var left = shuffle(pairs.map(function (p) { return p[0]; }));
      var right = shuffle(pairs.map(function (p) { return p[1]; }));
      var matched = [], selectedLeft = -1, sc = 0;

      var div = makeContainer();
      var card = makeCard({ maxW: '560px', pad: '22px 24px' });
      var areaId = 'am_area_' + Date.now();
      var progId = 'am_prog_' + Date.now();
      var scoreId = 'am_score_' + Date.now();

      card.innerHTML = '<div style="' + titleStyle() + '">Arabic \u2194 English Match</div>' +
        '<div id="' + progId + '">' + makeProgressBar(0, pairs.length) + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
          '<div id="' + scoreId + '" style="' + counterStyle() + '">Score: 0 / ' + pairs.length + '</div>' +
          '<div style="font-family:Inter,sans-serif;font-size:0.65rem;color:' + COLORS.dim + '">Tap Arabic, then English</div>' +
        '</div>' +
        '<div id="' + areaId + '" style="display:flex;gap:20px;justify-content:center;align-items:flex-start"></div>';

      div.appendChild(card);
      container.appendChild(div);

      var area = card.querySelector('#' + areaId);

      /* Arabic column with decorative border */
      var leftCol = document.createElement('div');
      leftCol.style.cssText = 'display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:12px;background:linear-gradient(135deg,rgba(255,215,0,0.04),rgba(255,107,53,0.03));border:1px solid rgba(255,215,0,0.1);';
      var leftLabel = document.createElement('div');
      leftLabel.style.cssText = 'font-family:Orbitron,sans-serif;font-size:0.6rem;color:' + COLORS.gold + ';text-align:center;margin-bottom:6px;letter-spacing:2px;';
      leftLabel.textContent = 'ARABIC';
      leftCol.appendChild(leftLabel);

      /* English column */
      var rightCol = document.createElement('div');
      rightCol.style.cssText = 'display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:12px;background:rgba(0,201,167,0.03);border:1px solid rgba(0,201,167,0.1);';
      var rightLabel = document.createElement('div');
      rightLabel.style.cssText = 'font-family:Orbitron,sans-serif;font-size:0.6rem;color:' + COLORS.teal + ';text-align:center;margin-bottom:6px;letter-spacing:2px;';
      rightLabel.textContent = 'ENGLISH';
      rightCol.appendChild(rightLabel);

      area.appendChild(leftCol);
      area.appendChild(rightCol);

      function render() {
        /* Remove all except the label */
        while (leftCol.children.length > 1) leftCol.removeChild(leftCol.lastChild);
        while (rightCol.children.length > 1) rightCol.removeChild(rightCol.lastChild);

        left.forEach(function (w, i) {
          var isM = matched.indexOf(w) > -1;
          var isSel = selectedLeft === i;
          var btn = document.createElement('button');
          var bg, border, col;
          if (isM) { bg = 'rgba(0,201,167,0.15)'; border = COLORS.teal; col = COLORS.teal; }
          else if (isSel) { bg = 'rgba(255,215,0,0.15)'; border = COLORS.gold; col = COLORS.gold; }
          else { bg = 'rgba(255,215,0,0.05)'; border = 'rgba(255,215,0,0.15)'; col = COLORS.gold; }
          btn.style.cssText = 'width:130px;padding:12px 8px;border:2px solid ' + border + ';border-radius:10px;background:' + bg + ';color:' + col + ';font-size:1.2rem;font-weight:700;cursor:' + (isM ? 'default' : 'pointer') + ';transition:all 0.25s ease;text-align:center;direction:rtl;font-family:"Noto Naskh Arabic",serif;box-shadow:' + (isSel ? '0 4px 16px rgba(255,215,0,0.25)' : '0 2px 6px rgba(0,0,0,0.15)') + ';transform:' + (isSel ? 'scale(1.05)' : 'scale(1)') + ';' + (isM ? 'opacity:0.6;' : '');
          btn.textContent = w;
          if (!isM) {
            btn.onmouseenter = function () {
              if (!isSel) { btn.style.transform = 'scale(1.03)'; btn.style.boxShadow = '0 4px 12px rgba(255,215,0,0.2)'; }
            };
            btn.onmouseleave = function () {
              if (!isSel) { btn.style.transform = 'scale(1)'; btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'; }
            };
            btn.onclick = function () { selectedLeft = i; render(); };
          }
          leftCol.appendChild(btn);
        });

        right.forEach(function (w, j) {
          var isM = matched.indexOf(w) > -1;
          var btn = document.createElement('button');
          var bg, border, col;
          if (isM) { bg = 'rgba(0,201,167,0.15)'; border = COLORS.teal; col = COLORS.teal; }
          else { bg = 'rgba(0,201,167,0.05)'; border = 'rgba(0,201,167,0.15)'; col = COLORS.white; }
          btn.style.cssText = 'width:130px;padding:12px 8px;border:2px solid ' + border + ';border-radius:10px;background:' + bg + ';color:' + col + ';font-family:Inter,sans-serif;font-size:0.85rem;font-weight:700;cursor:' + (isM ? 'default' : 'pointer') + ';transition:all 0.25s ease;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,0.15);' + (isM ? 'opacity:0.6;' : '');
          btn.textContent = w;
          if (!isM) {
            btn.onmouseenter = function () {
              btn.style.transform = 'scale(1.03)';
              btn.style.boxShadow = '0 4px 12px rgba(0,201,167,0.2)';
            };
            btn.onmouseleave = function () {
              btn.style.transform = 'scale(1)';
              btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
            };
            btn.onclick = function () {
              if (selectedLeft < 0) return;
              var lWord = left[selectedLeft];
              var isMatch = pairs.some(function (p) { return p[0] === lWord && p[1] === w; });
              if (isMatch) {
                matched.push(lWord, w); sc++; E.addScore(1);
                animateCorrect(card);
                E.rashidSay(lWord + ' = ' + w + '! \u2705');
                card.querySelector('#' + scoreId).textContent = 'Score: ' + sc + ' / ' + pairs.length;
                card.querySelector('#' + progId).innerHTML = makeProgressBar(sc, pairs.length);
              } else {
                animateWrong(card);
                E.rashidSay('Try again!');
              }
              selectedLeft = -1; render();
              if (matched.length === left.length + right.length) E.endGame(sc, pairs.length);
            };
          }
          rightCol.appendChild(btn);
        });
      }
      render();
      return {};
    }, destroy: function () {}
  });

})();
