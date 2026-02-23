/* ===== EXTRA GAMES PACK 1 (13 games) — DOM-based ===== */
(function () {
  var E = window.GamesEngine;
  var shuffle = E.shuffle, pick = E.pick;

  /* ── Shared CSS (injected once) ── */
  var styleId = 'gex1-styles';
  if (!document.getElementById(styleId)) {
    var st = document.createElement('style'); st.id = styleId;
    st.textContent =
      '.gex1-wrap{max-width:500px;margin:0 auto;padding:16px;font-family:"Inter",sans-serif;color:#fff;text-align:center;}' +
      '.gex1-wrap *{box-sizing:border-box;}' +
      '.gex1-title{font-family:"Orbitron",sans-serif;font-size:1.15rem;margin-bottom:12px;color:#FFD700;letter-spacing:1px;}' +
      '.gex1-card{background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,215,0,0.12);border-radius:12px;padding:18px;margin-bottom:12px;transition:all 0.35s ease;}' +
      '.gex1-card:hover{border-color:rgba(255,215,0,0.25);}' +
      '.gex1-q{font-size:1.05rem;font-weight:600;line-height:1.5;margin-bottom:14px;}' +
      '.gex1-opts{display:flex;flex-direction:column;gap:8px;width:100%;}' +
      '.gex1-btn{display:block;width:100%;padding:13px 16px;border:1.5px solid rgba(255,215,0,0.18);border-radius:10px;background:rgba(255,255,255,0.04);color:#fff;font-size:0.95rem;font-weight:600;cursor:pointer;transition:all 0.25s ease;text-align:left;font-family:"Inter",sans-serif;}' +
      '.gex1-btn:hover:not(:disabled){background:rgba(255,215,0,0.1);border-color:rgba(255,215,0,0.4);transform:translateY(-1px);}' +
      '.gex1-btn:disabled{cursor:default;opacity:0.5;}' +
      '.gex1-btn-gold{background:linear-gradient(135deg,rgba(255,215,0,0.18),rgba(255,107,53,0.12));border-color:rgba(255,215,0,0.35);text-align:center;}' +
      '.gex1-btn-gold:hover:not(:disabled){background:linear-gradient(135deg,rgba(255,215,0,0.3),rgba(255,107,53,0.2));box-shadow:0 0 18px rgba(255,215,0,0.15);}' +
      '.gex1-btn-big{padding:16px 24px;font-size:1.1rem;border-radius:12px;text-align:center;}' +
      '.gex1-timer-bar{width:100%;height:6px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;margin-bottom:10px;}' +
      '.gex1-timer-fill{height:100%;border-radius:4px;transition:width 0.3s linear;background:linear-gradient(90deg,#FFD700,#FF6B35);}' +
      '.gex1-dots{display:flex;gap:5px;justify-content:center;margin:10px 0;}' +
      '.gex1-dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.1);border:1.5px solid rgba(255,215,0,0.15);transition:all 0.3s ease;}' +
      '.gex1-label{font-size:0.78rem;color:rgba(255,255,255,0.45);margin-bottom:6px;font-family:"Orbitron",sans-serif;}' +
      '.gex1-big-emoji{font-size:3.5rem;margin-bottom:10px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.4));}' +
      '.gex1-feedback{min-height:28px;font-weight:700;margin-top:8px;transition:opacity 0.3s;}' +
      '.gex1-row{display:flex;gap:10px;justify-content:center;align-items:stretch;flex-wrap:wrap;}' +
      '.gex1-grid4{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;}' +
      '.gex1-streak{font-family:"Orbitron",sans-serif;color:#FF6B35;font-size:0.85rem;min-height:20px;}' +
      '.gex1-score{font-family:"Orbitron",sans-serif;font-size:0.85rem;color:#FFD700;margin-top:6px;}' +
      '.gex1-input{width:100%;padding:14px;border:1.5px solid rgba(255,215,0,0.2);border-radius:10px;background:rgba(255,255,255,0.05);color:#fff;font-size:1.1rem;font-family:"Orbitron",sans-serif;text-align:center;outline:none;transition:border-color 0.3s;}' +
      '.gex1-input:focus{border-color:rgba(255,215,0,0.5);}' +
      '.gex1-meter{width:100%;height:10px;background:rgba(255,255,255,0.06);border-radius:6px;overflow:hidden;margin:8px 0;}' +
      '.gex1-meter-fill{height:100%;border-radius:6px;transition:width 0.5s ease;background:linear-gradient(90deg,#00C9A7,#FFD700);}' +
      '@keyframes gex1Pop{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}' +
      '@keyframes gex1Shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}' +
      '@keyframes gex1Glow{0%{box-shadow:0 0 5px rgba(0,201,167,0.2)}50%{box-shadow:0 0 20px rgba(0,201,167,0.5)}100%{box-shadow:0 0 5px rgba(0,201,167,0.2)}}' +
      '@keyframes gex1FadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}' +
      '@keyframes gex1SlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}' +
      '.gex1-pop{animation:gex1Pop 0.35s ease forwards;}' +
      '.gex1-shake{animation:gex1Shake 0.4s ease;}' +
      '.gex1-glow{animation:gex1Glow 0.8s ease;}' +
      '.gex1-fadein{animation:gex1FadeIn 0.4s ease forwards;}' +
      '.gex1-correct{background:rgba(0,201,167,0.15)!important;border-color:#00C9A7!important;box-shadow:0 0 18px rgba(0,201,167,0.25)!important;}' +
      '.gex1-wrong{background:rgba(255,50,50,0.15)!important;border-color:#ff6b6b!important;}' +
      '.gex1-hl-card{flex:1;min-width:140px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,215,0,0.15);border-radius:12px;padding:18px 12px;text-align:center;transition:all 0.4s ease;}' +
      '.gex1-star{display:inline-block;font-size:1.4rem;transition:all 0.3s;opacity:0.2;}' +
      '.gex1-star.lit{opacity:1;filter:drop-shadow(0 0 6px rgba(255,215,0,0.6));}';
    document.head.appendChild(st);
  }

  /* Helpers */
  function makeDots(parent, count) {
    for (var i = 0; i < count; i++) {
      var d = document.createElement('div'); d.className = 'gex1-dot';
      d.setAttribute('data-idx', i); parent.appendChild(d);
    }
  }
  function setDot(wrap, idx, good) {
    var dots = wrap.querySelectorAll('.gex1-dot');
    if (dots[idx]) {
      dots[idx].style.background = good ? '#00C9A7' : '#ff6b6b';
      dots[idx].style.borderColor = good ? '#00C9A7' : '#ff6b6b';
      dots[idx].style.boxShadow = '0 0 6px ' + (good ? 'rgba(0,201,167,0.6)' : 'rgba(255,50,50,0.6)');
    }
  }
  function diffNum(diff, easy, med, hard) {
    return diff === 'easy' ? easy : diff === 'hard' ? hard : med;
  }

  /* =========================================================
     1. TRIVIA BLITZ
     ========================================================= */
  E.register({
    id: 'trivia-blitz', name: 'Trivia Blitz', emoji: '\u26A1', category: 'trivia', has2P: true,
    _iv: null,
    init: function (container, mode, diff) {
      if (mode === '2p') {
        var triviaQs2 = [
          { q: 'What is the capital of the UAE?', opts: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'], a: 1 },
          { q: 'How many emirates are in the UAE?', opts: ['5', '6', '7', '8'], a: 2 },
          { q: 'What is the tallest building in the world?', opts: ['Dubai Frame', 'CN Tower', 'Burj Al Arab', 'Burj Khalifa'], a: 3 },
          { q: 'What bird is used in Emirati falconry?', opts: ['Eagle', 'Falcon', 'Hawk', 'Parrot'], a: 1 },
          { q: 'What is the UAE currency called?', opts: ['Riyal', 'Dinar', 'Dirham', 'Pound'], a: 2 },
          { q: 'When is UAE National Day?', opts: ['Jan 1', 'Dec 2', 'Nov 30', 'Sep 1'], a: 1 },
          { q: 'What is Luqaimat?', opts: ['A drink', 'A dance', 'A sweet dumpling', 'A building'], a: 2 },
          { q: 'Which emirate is the cultural capital?', opts: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Fujairah'], a: 2 },
          { q: 'What UAE probe reached Mars in 2021?', opts: ['Mars One', 'Spirit', 'Al Amal (Hope)', 'Viking'], a: 2 },
          { q: 'What is the oldest mosque in the UAE?', opts: ['Al Bidyah', 'Sheikh Zayed', 'Jumeirah', 'Al Fahidi'], a: 0 }
        ];
        var qs2 = shuffle(triviaQs2).slice(0, 10);
        var idx2 = 0, p1Score = 0, p2Score = 0, locked2 = false;
        var p1Picked = false, p2Picked = false, p1Choice = -1, p2Choice = -1;
        var roundTimer = null;
        var self2 = this;
        var letters2 = ['A', 'B', 'C', 'D'];

        var w2 = document.createElement('div'); w2.className = 'gex1-wrap'; w2.style.maxWidth = '600px';
        w2.innerHTML =
          '<div class="gex1-label" id="tb2-status">Question 1/' + qs2.length + '</div>' +
          '<div style="display:flex;justify-content:center;gap:24px;margin-bottom:10px;">' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.95rem;color:#4ecdc4;font-weight:700;" id="tb2-p1sc">P1: 0</div>' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.3);">vs</div>' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.95rem;color:#ff6b6b;font-weight:700;" id="tb2-p2sc">P2: 0</div>' +
          '</div>' +
          '<div class="gex1-timer-bar"><div class="gex1-timer-fill" id="tb2-bar" style="width:100%"></div></div>' +
          '<div class="gex1-card" id="tb2-card"><div class="gex1-q" id="tb2-q"></div></div>' +
          '<div style="display:flex;gap:12px;margin-top:10px;" id="tb2-cols">' +
            '<div style="flex:1;">' +
              '<div style="font-family:Orbitron,sans-serif;font-size:0.75rem;color:#4ecdc4;margin-bottom:6px;text-align:center;">PLAYER 1</div>' +
              '<div id="tb2-p1opts" style="display:flex;flex-direction:column;gap:6px;"></div>' +
            '</div>' +
            '<div style="flex:1;">' +
              '<div style="font-family:Orbitron,sans-serif;font-size:0.75rem;color:#ff6b6b;margin-bottom:6px;text-align:center;">PLAYER 2</div>' +
              '<div id="tb2-p2opts" style="display:flex;flex-direction:column;gap:6px;"></div>' +
            '</div>' +
          '</div>' +
          '<div class="gex1-feedback" id="tb2-fb"></div>' +
          '<div class="gex1-dots" id="tb2-dots"></div>';
        container.appendChild(w2);
        makeDots(w2.querySelector('#tb2-dots'), qs2.length);

        function show2() {
          locked2 = false; p1Picked = false; p2Picked = false; p1Choice = -1; p2Choice = -1;
          var timeLeft = 5;
          var bar = w2.querySelector('#tb2-bar');
          bar.style.width = '100%';
          bar.style.background = 'linear-gradient(90deg,#FFD700,#FF6B35)';
          w2.querySelector('#tb2-status').textContent = 'Question ' + (idx2 + 1) + '/' + qs2.length;
          w2.querySelector('#tb2-q').textContent = qs2[idx2].q;
          w2.querySelector('#tb2-fb').textContent = '';
          w2.querySelector('#tb2-card').className = 'gex1-card gex1-pop';
          w2.querySelector('#tb2-card').style.borderColor = 'rgba(255,215,0,0.12)';

          var p1opts = w2.querySelector('#tb2-p1opts'); p1opts.innerHTML = '';
          var p2opts = w2.querySelector('#tb2-p2opts'); p2opts.innerHTML = '';

          qs2[idx2].opts.forEach(function (o, i) {
            var btn1 = document.createElement('button'); btn1.className = 'gex1-btn';
            btn1.style.borderColor = 'rgba(78,205,196,0.3)'; btn1.style.fontSize = '0.85rem'; btn1.style.padding = '10px 12px';
            btn1.innerHTML = '<span style="display:inline-block;width:22px;height:22px;border-radius:6px;background:rgba(78,205,196,0.15);text-align:center;line-height:22px;font-size:0.7rem;margin-right:8px;color:#4ecdc4;font-weight:800">' + letters2[i] + '</span>' + o;
            btn1.onclick = function () { pickAnswer(1, i, btn1); };
            p1opts.appendChild(btn1);

            var btn2 = document.createElement('button'); btn2.className = 'gex1-btn';
            btn2.style.borderColor = 'rgba(255,107,107,0.3)'; btn2.style.fontSize = '0.85rem'; btn2.style.padding = '10px 12px';
            btn2.innerHTML = '<span style="display:inline-block;width:22px;height:22px;border-radius:6px;background:rgba(255,107,107,0.15);text-align:center;line-height:22px;font-size:0.7rem;margin-right:8px;color:#ff6b6b;font-weight:800">' + letters2[i] + '</span>' + o;
            btn2.onclick = function () { pickAnswer(2, i, btn2); };
            p2opts.appendChild(btn2);
          });

          if (roundTimer) clearInterval(roundTimer);
          roundTimer = setInterval(function () {
            timeLeft--;
            var pct = timeLeft / 5 * 100;
            bar.style.width = pct + '%';
            if (timeLeft <= 2) bar.style.background = 'linear-gradient(90deg,#ff6b6b,#FF6B35)';
            if (timeLeft <= 0) {
              clearInterval(roundTimer); roundTimer = null; self2._iv = null;
              resolveRound();
            }
          }, 1000);
          self2._iv = roundTimer;
        }

        function pickAnswer(player, choice, btn) {
          if (locked2) return;
          if (player === 1 && p1Picked) return;
          if (player === 2 && p2Picked) return;
          if (player === 1) { p1Picked = true; p1Choice = choice; disableColumn(w2.querySelector('#tb2-p1opts'), btn); }
          if (player === 2) { p2Picked = true; p2Choice = choice; disableColumn(w2.querySelector('#tb2-p2opts'), btn); }
          if (p1Picked && p2Picked) {
            if (roundTimer) { clearInterval(roundTimer); roundTimer = null; }
            setTimeout(resolveRound, 300);
          }
        }

        function disableColumn(col, selectedBtn) {
          var btns = col.querySelectorAll('.gex1-btn');
          btns.forEach(function (b) { b.disabled = true; b.style.opacity = '0.4'; });
          selectedBtn.style.opacity = '1';
          selectedBtn.style.background = 'rgba(255,255,255,0.08)';
        }

        function resolveRound() {
          if (locked2) return;
          locked2 = true;
          var correctIdx = qs2[idx2].a;
          var p1Correct = p1Choice === correctIdx;
          var p2Correct = p2Choice === correctIdx;
          var fb = w2.querySelector('#tb2-fb');
          var card = w2.querySelector('#tb2-card');

          // Highlight correct answers in both columns
          var p1btns = w2.querySelector('#tb2-p1opts').querySelectorAll('.gex1-btn');
          var p2btns = w2.querySelector('#tb2-p2opts').querySelectorAll('.gex1-btn');
          p1btns.forEach(function (b) { b.disabled = true; });
          p2btns.forEach(function (b) { b.disabled = true; });
          if (p1btns[correctIdx]) p1btns[correctIdx].classList.add('gex1-correct');
          if (p2btns[correctIdx]) p2btns[correctIdx].classList.add('gex1-correct');
          if (p1Picked && !p1Correct && p1btns[p1Choice]) { p1btns[p1Choice].classList.add('gex1-wrong'); }
          if (p2Picked && !p2Correct && p2btns[p2Choice]) { p2btns[p2Choice].classList.add('gex1-wrong'); }

          if (p1Correct && !p2Correct) {
            p1Score++; fb.innerHTML = '<span style="color:#4ecdc4;">P1 scores! +1</span>'; card.style.borderColor = '#4ecdc4';
            E.rashidSay('Player 1 gets it!');
          } else if (p2Correct && !p1Correct) {
            p2Score++; fb.innerHTML = '<span style="color:#ff6b6b;">P2 scores! +1</span>'; card.style.borderColor = '#ff6b6b';
            E.rashidSay('Player 2 gets it!');
          } else if (p1Correct && p2Correct) {
            p1Score++; p2Score++; fb.innerHTML = '<span style="color:#FFD700;">Both correct! +1 each</span>'; card.style.borderColor = '#FFD700';
            E.rashidSay('Both right!');
          } else {
            fb.innerHTML = '<span style="color:rgba(255,255,255,0.5);">No one scored</span>'; card.style.borderColor = 'rgba(255,255,255,0.2)';
            E.rashidSay(pick(['Nobody got it!', 'Both wrong!']));
          }
          setDot(w2, idx2, p1Correct || p2Correct);
          w2.querySelector('#tb2-p1sc').textContent = 'P1: ' + p1Score;
          w2.querySelector('#tb2-p2sc').textContent = 'P2: ' + p2Score;
          E.setScore(p1Score + p2Score);
          idx2++;
          setTimeout(function () {
            if (idx2 >= qs2.length) {
              var winner = p1Score > p2Score ? 'Player 1 wins!' : p2Score > p1Score ? 'Player 2 wins!' : 'It\'s a tie!';
              E.rashidSay(winner + ' (P1: ' + p1Score + ' - P2: ' + p2Score + ')');
              E.endGame(p1Score + p2Score, qs2.length * 2);
            } else show2();
          }, 1200);
        }

        show2();
        return {};
      }
      var triviaQs = [
        { q: 'What is the capital of the UAE?', opts: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'], a: 1 },
        { q: 'How many emirates are in the UAE?', opts: ['5', '6', '7', '8'], a: 2 },
        { q: 'What is the tallest building in the world?', opts: ['Dubai Frame', 'CN Tower', 'Burj Al Arab', 'Burj Khalifa'], a: 3 },
        { q: 'What bird is used in Emirati falconry?', opts: ['Eagle', 'Falcon', 'Hawk', 'Parrot'], a: 1 },
        { q: 'What is the UAE currency called?', opts: ['Riyal', 'Dinar', 'Dirham', 'Pound'], a: 2 },
        { q: 'When is UAE National Day?', opts: ['Jan 1', 'Dec 2', 'Nov 30', 'Sep 1'], a: 1 },
        { q: 'What is Luqaimat?', opts: ['A drink', 'A dance', 'A sweet dumpling', 'A building'], a: 2 },
        { q: 'Which emirate is the cultural capital?', opts: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Fujairah'], a: 2 },
        { q: 'What UAE probe reached Mars in 2021?', opts: ['Mars One', 'Spirit', 'Al Amal (Hope)', 'Viking'], a: 2 },
        { q: 'What is the oldest mosque in the UAE?', opts: ['Al Bidyah', 'Sheikh Zayed', 'Jumeirah', 'Al Fahidi'], a: 0 }
      ];
      var qs = shuffle(triviaQs).slice(0, diffNum(diff, 6, 8, 10));
      var timerMax = diffNum(diff, 14, 10, 7);
      var idx = 0, sc = 0, timer = timerMax, locked = false;
      var self = this;

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-label" id="tb-status">Question 1/' + qs.length + '</div>' +
        '<div class="gex1-timer-bar"><div class="gex1-timer-fill" id="tb-bar" style="width:100%"></div></div>' +
        '<div class="gex1-card" id="tb-card"><div class="gex1-q" id="tb-q"></div></div>' +
        '<div class="gex1-opts" id="tb-opts"></div>' +
        '<div class="gex1-feedback" id="tb-fb"></div>' +
        '<div class="gex1-dots" id="tb-dots"></div>' +
        '<div class="gex1-score" id="tb-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#tb-dots'), qs.length);
      var letters = ['A', 'B', 'C', 'D'];

      function show() {
        locked = false; timer = timerMax;
        var bar = w.querySelector('#tb-bar');
        bar.style.width = '100%';
        bar.style.background = 'linear-gradient(90deg,#FFD700,#FF6B35)';
        w.querySelector('#tb-status').textContent = 'Question ' + (idx + 1) + '/' + qs.length;
        w.querySelector('#tb-q').textContent = qs[idx].q;
        w.querySelector('#tb-fb').textContent = '';
        var card = w.querySelector('#tb-card');
        card.className = 'gex1-card gex1-pop';
        card.style.borderColor = 'rgba(255,215,0,0.12)';
        card.style.boxShadow = 'none';
        var opts = w.querySelector('#tb-opts'); opts.innerHTML = '';
        qs[idx].opts.forEach(function (o, i) {
          var btn = document.createElement('button'); btn.className = 'gex1-btn';
          btn.innerHTML = '<span style="display:inline-block;width:26px;height:26px;border-radius:7px;background:rgba(255,215,0,0.1);text-align:center;line-height:26px;font-size:0.8rem;margin-right:10px;color:#FFD700;font-weight:800">' + letters[i] + '</span>' + o;
          btn.onclick = function () { answer(i, btn); };
          opts.appendChild(btn);
        });
      }

      function answer(i, btn) {
        if (locked) return; locked = true;
        var correct = i === qs[idx].a;
        var opts = w.querySelector('#tb-opts').querySelectorAll('.gex1-btn');
        opts.forEach(function (b) { b.disabled = true; });
        var card = w.querySelector('#tb-card');
        var fb = w.querySelector('#tb-fb');
        if (correct) {
          sc++; E.addScore(1);
          btn.classList.add('gex1-correct');
          card.style.borderColor = '#00C9A7'; card.style.boxShadow = '0 0 18px rgba(0,201,167,0.2)';
          fb.textContent = 'Correct!'; fb.style.color = '#00C9A7';
          E.rashidSay(pick(['Right! \u26A1', 'Correct! \uD83C\uDFAF', 'Nice! \uD83E\uDDE0']));
        } else {
          btn.classList.add('gex1-wrong'); btn.classList.add('gex1-shake');
          opts[qs[idx].a].classList.add('gex1-correct');
          card.style.borderColor = '#ff6b6b';
          fb.textContent = 'Wrong! Answer: ' + qs[idx].opts[qs[idx].a]; fb.style.color = '#ff6b6b';
          E.rashidSay(pick(['Oops!', 'Not quite!', 'Wrong!']));
        }
        setDot(w, idx, correct);
        w.querySelector('#tb-sc').textContent = 'Score: ' + sc;
        idx++;
        setTimeout(function () {
          if (idx >= qs.length) E.endGame(sc, qs.length);
          else show();
        }, 900);
      }

      self._iv = setInterval(function () {
        if (locked) return;
        timer--;
        var pct = timer / timerMax * 100;
        var bar = w.querySelector('#tb-bar');
        bar.style.width = pct + '%';
        if (timer <= 3) bar.style.background = 'linear-gradient(90deg,#ff6b6b,#FF6B35)';
        if (timer <= 0) {
          locked = true;
          w.querySelector('#tb-fb').textContent = 'Time\'s up!';
          w.querySelector('#tb-fb').style.color = '#FFD700';
          setDot(w, idx, false);
          E.rashidSay('Too slow! \u23F0');
          idx++;
          setTimeout(function () {
            if (idx >= qs.length) E.endGame(sc, qs.length);
            else show();
          }, 700);
        }
      }, 1000);

      show();
      return {};
    },
    destroy: function () { if (this._iv) { clearInterval(this._iv); this._iv = null; } }
  });

  /* =========================================================
     2. TWENTY QUESTIONS
     ========================================================= */
  E.register({
    id: 'twenty-questions', name: '20 Questions', emoji: '\uD83E\uDD14', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var items = [
        { thing: 'Burj Khalifa', emoji: '\uD83C\uDFD7\uFE0F', hints: { tall: 'y', building: 'y', dubai: 'y', landmark: 'y', old: 'n', food: 'n', animal: 'n', natural: 'n' } },
        { thing: 'Falcon', emoji: '\uD83E\uDD85', hints: { animal: 'y', bird: 'y', fly: 'y', pet: 'y', food: 'n', building: 'n', big: 'n', water: 'n' } },
        { thing: 'Luqaimat', emoji: '\uD83C\uDF61', hints: { food: 'y', sweet: 'y', small: 'y', round: 'y', animal: 'n', building: 'n', tall: 'n', fly: 'n' } },
        { thing: 'Pearl', emoji: '\uD83D\uDC8E', hints: { small: 'y', valuable: 'y', white: 'y', water: 'y', ocean: 'y', food: 'n', animal: 'n', building: 'n' } },
        { thing: 'Camel', emoji: '\uD83D\uDC2A', hints: { animal: 'y', big: 'y', desert: 'y', ride: 'y', fly: 'n', building: 'n', food: 'n', water: 'n' } },
        { thing: 'Arabic Coffee', emoji: '\u2615', hints: { food: 'y', drink: 'y', hot: 'y', traditional: 'y', animal: 'n', building: 'n', big: 'n', fly: 'n' } },
        { thing: 'Sheikh Zayed Mosque', emoji: '\uD83D\uDD4C', hints: { building: 'y', big: 'y', white: 'y', abudhabi: 'y', food: 'n', animal: 'n', small: 'n', water: 'n' } },
        { thing: 'Date Palm', emoji: '\uD83C\uDF34', hints: { food: 'y', tall: 'y', desert: 'y', sweet: 'y', animal: 'n', building: 'n', water: 'n', fly: 'n' } }
      ];
      var pool = shuffle(items).slice(0, diffNum(diff, 4, 6, 8));
      var round = 0, sc = 0;

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83E\uDD14 20 Questions</div>' +
        '<div class="gex1-label" id="tq-status">Round 1/' + pool.length + '</div>' +
        '<div id="tq-area"></div>' +
        '<div class="gex1-dots" id="tq-dots"></div>' +
        '<div class="gex1-score" id="tq-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#tq-dots'), pool.length);

      function showRound() {
        var item = pool[round];
        var hintKeys = Object.keys(item.hints);
        var hintsUsed = 0;
        var area = w.querySelector('#tq-area');
        w.querySelector('#tq-status').textContent = 'Round ' + (round + 1) + '/' + pool.length;

        area.innerHTML =
          '<div class="gex1-card" id="tq-mystery" style="font-size:4rem;padding:24px;position:relative;">' +
            '<div style="position:absolute;top:8px;right:12px;font-size:0.7rem;color:rgba(255,215,0,0.5)" id="tq-hcount">0 hints used</div>' +
            '<div>???</div>' +
            '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-top:6px;">Ask yes/no questions to guess!</div>' +
          '</div>' +
          '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin:10px 0;">Click hints to reveal clues:</div>' +
          '<div class="gex1-grid4" id="tq-hints"></div>' +
          '<div style="margin-top:14px;" id="tq-answers" style="display:none;"></div>';

        var hintsDiv = area.querySelector('#tq-hints');
        hintKeys.forEach(function (key) {
          var btn = document.createElement('button'); btn.className = 'gex1-btn';
          btn.style.textAlign = 'center'; btn.style.textTransform = 'capitalize';
          btn.textContent = 'Is it ' + key + '?';
          btn.onclick = function () {
            if (btn.disabled) return;
            btn.disabled = true;
            hintsUsed++;
            area.querySelector('#tq-hcount').textContent = hintsUsed + ' hints used';
            var ans = item.hints[key];
            if (ans === 'y') {
              btn.textContent = '\u2705 ' + key.charAt(0).toUpperCase() + key.slice(1) + ' — YES';
              btn.classList.add('gex1-correct');
            } else {
              btn.textContent = '\u274C ' + key.charAt(0).toUpperCase() + key.slice(1) + ' — NO';
              btn.style.borderColor = 'rgba(255,50,50,0.3)'; btn.style.color = '#ff6b6b';
            }
            if (hintsUsed >= 3 && !area.querySelector('#tq-choices')) showChoices();
          };
          hintsDiv.appendChild(btn);
        });

        function showChoices() {
          var answersDiv = area.querySelector('#tq-answers');
          answersDiv.style.display = 'block';
          answersDiv.innerHTML = '<div style="font-size:0.85rem;color:#FFD700;margin-bottom:8px;font-weight:700;">Now guess! (Fewer hints = more points)</div>';
          var distractors = shuffle(items.filter(function (it) { return it.thing !== item.thing; })).slice(0, 3).map(function (it) { return it.thing; });
          var choices = shuffle([item.thing].concat(distractors));
          var choiceDiv = document.createElement('div'); choiceDiv.className = 'gex1-opts';
          choices.forEach(function (c) {
            var btn = document.createElement('button'); btn.className = 'gex1-btn gex1-btn-gold';
            btn.textContent = c;
            btn.onclick = function () {
              choiceDiv.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
              var pts = Math.max(1, 8 - hintsUsed);
              if (c === item.thing) {
                sc += pts; E.setScore(sc);
                btn.classList.add('gex1-correct');
                area.querySelector('#tq-mystery').innerHTML = '<div style="font-size:3rem;">' + item.emoji + '</div><div style="font-size:1.1rem;color:#00C9A7;margin-top:6px;">' + item.thing + '!</div>';
                area.querySelector('#tq-mystery').classList.add('gex1-glow');
                E.rashidSay('Correct! +' + pts + ' points! \uD83C\uDFAF');
                setDot(w, round, true);
              } else {
                btn.classList.add('gex1-wrong'); btn.classList.add('gex1-shake');
                area.querySelector('#tq-mystery').innerHTML = '<div style="font-size:3rem;">' + item.emoji + '</div><div style="font-size:1.1rem;color:#ff6b6b;margin-top:6px;">It was ' + item.thing + '!</div>';
                E.rashidSay('It was ' + item.thing + '!');
                setDot(w, round, false);
              }
              w.querySelector('#tq-sc').textContent = 'Score: ' + sc;
              round++;
              setTimeout(function () {
                if (round >= pool.length) E.endGame(sc, pool.length * 8);
                else showRound();
              }, 1200);
            };
            choiceDiv.appendChild(btn);
          });
          answersDiv.appendChild(choiceDiv);
        }

        // Auto-show choices after a delay anyway
        setTimeout(function () {
          if (!area.querySelector('#tq-choices')) showChoices();
        }, 200);
      }
      showRound();
      return {};
    },
    destroy: function () {}
  });

  /* =========================================================
     3. HIGHER OR LOWER
     ========================================================= */
  E.register({
    id: 'higher-lower', name: 'Higher or Lower', emoji: '\u2B06\uFE0F', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var hlFacts = [
        { fact: 'Height of Burj Khalifa (meters)', value: 828 },
        { fact: 'Number of UAE emirates', value: 7 },
        { fact: 'Year UAE was founded', value: 1971 },
        { fact: 'Domes in Sheikh Zayed Mosque', value: 82 },
        { fact: 'Floors in Burj Khalifa', value: 163 },
        { fact: 'Year oil was discovered in UAE', value: 1958 },
        { fact: 'Width of Dubai Frame (meters)', value: 93 },
        { fact: 'Number of UAE flag colors', value: 4 },
        { fact: 'UAE population in millions', value: 10 },
        { fact: 'UAE coastline length (km)', value: 1318 }
      ];
      var pool = shuffle(hlFacts);
      var idx = 1, sc = 0, streak = 0, total = pool.length - 1;
      var locked = false;

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\u2B06\uFE0F Higher or Lower?</div>' +
        '<div class="gex1-streak" id="hl-streak"></div>' +
        '<div class="gex1-label" id="hl-status">Round 1/' + total + '</div>' +
        '<div class="gex1-row" id="hl-cards" style="margin-bottom:14px;">' +
          '<div class="gex1-hl-card" id="hl-left">' +
            '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-bottom:6px">KNOWN</div>' +
            '<div style="font-size:0.85rem;margin-bottom:8px;" id="hl-left-fact"></div>' +
            '<div style="font-family:Orbitron;font-size:1.6rem;color:#FFD700;" id="hl-left-val"></div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;font-size:1.3rem;color:rgba(255,215,0,0.4);">VS</div>' +
          '<div class="gex1-hl-card" id="hl-right">' +
            '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-bottom:6px">MYSTERY</div>' +
            '<div style="font-size:0.85rem;margin-bottom:8px;" id="hl-right-fact"></div>' +
            '<div style="font-family:Orbitron;font-size:1.6rem;color:rgba(255,255,255,0.3);" id="hl-right-val">???</div>' +
          '</div>' +
        '</div>' +
        '<div class="gex1-row" style="gap:14px;">' +
          '<button class="gex1-btn gex1-btn-big" id="hl-higher" style="flex:1;text-align:center;border-color:rgba(0,201,167,0.3);color:#00C9A7;">\u2B06\uFE0F HIGHER</button>' +
          '<button class="gex1-btn gex1-btn-big" id="hl-lower" style="flex:1;text-align:center;border-color:rgba(255,107,53,0.3);color:#FF6B35;">\u2B07\uFE0F LOWER</button>' +
        '</div>' +
        '<div class="gex1-feedback" id="hl-fb"></div>' +
        '<div class="gex1-dots" id="hl-dots"></div>' +
        '<div class="gex1-score" id="hl-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#hl-dots'), total);

      function show() {
        locked = false;
        w.querySelector('#hl-status').textContent = 'Round ' + idx + '/' + total;
        w.querySelector('#hl-left-fact').textContent = pool[idx - 1].fact;
        w.querySelector('#hl-left-val').textContent = pool[idx - 1].value.toLocaleString();
        w.querySelector('#hl-right-fact').textContent = pool[idx].fact;
        w.querySelector('#hl-right-val').textContent = '???';
        w.querySelector('#hl-right-val').style.color = 'rgba(255,255,255,0.3)';
        w.querySelector('#hl-right').style.borderColor = 'rgba(255,215,0,0.15)';
        w.querySelector('#hl-right').style.boxShadow = 'none';
        w.querySelector('#hl-fb').textContent = '';
        w.querySelector('#hl-higher').disabled = false;
        w.querySelector('#hl-lower').disabled = false;
      }

      function guess(higher) {
        if (locked) return; locked = true;
        w.querySelector('#hl-higher').disabled = true;
        w.querySelector('#hl-lower').disabled = true;
        var leftVal = pool[idx - 1].value;
        var rightVal = pool[idx].value;
        var correct = higher ? rightVal >= leftVal : rightVal <= leftVal;
        // Reveal
        w.querySelector('#hl-right-val').textContent = rightVal.toLocaleString();
        w.querySelector('#hl-right-val').style.color = '#FFD700';
        w.querySelector('#hl-right-val').classList.add('gex1-pop');

        var fb = w.querySelector('#hl-fb');
        var rCard = w.querySelector('#hl-right');
        if (correct) {
          sc++; streak++; E.addScore(1);
          fb.textContent = 'Correct! ' + rightVal.toLocaleString(); fb.style.color = '#00C9A7';
          rCard.style.borderColor = '#00C9A7'; rCard.style.boxShadow = '0 0 18px rgba(0,201,167,0.25)';
          E.rashidSay(pick(['Right!', 'Nice!', 'Smart!']));
          setDot(w, idx - 1, true);
        } else {
          streak = 0;
          fb.textContent = 'Wrong! It was ' + rightVal.toLocaleString(); fb.style.color = '#ff6b6b';
          rCard.style.borderColor = '#ff6b6b'; rCard.style.boxShadow = '0 0 18px rgba(255,50,50,0.25)';
          rCard.classList.add('gex1-shake');
          E.rashidSay(pick(['Nope!', 'Wrong!', 'Oops!']));
          setDot(w, idx - 1, false);
        }
        w.querySelector('#hl-streak').textContent = streak > 1 ? '\uD83D\uDD25 ' + streak + ' streak!' : '';
        w.querySelector('#hl-sc').textContent = 'Score: ' + sc;
        idx++;
        setTimeout(function () {
          if (idx > pool.length - 1) E.endGame(sc, total);
          else show();
        }, 1100);
      }

      w.querySelector('#hl-higher').onclick = function () { guess(true); };
      w.querySelector('#hl-lower').onclick = function () { guess(false); };
      show();
      return {};
    },
    destroy: function () {}
  });

  /* =========================================================
     4. YEAR GUESSER
     ========================================================= */
  E.register({
    id: 'year-guesser', name: 'Year Guesser', emoji: '\uD83D\uDCC5', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var yearEvents = [
        { event: 'UAE was founded (union of 7 emirates)', year: 1971 },
        { event: 'Oil first discovered in Abu Dhabi', year: 1958 },
        { event: 'Burj Khalifa opened to public', year: 2010 },
        { event: 'Dubai Metro opened', year: 2009 },
        { event: 'Expo 2020 held in Dubai', year: 2020 },
        { event: 'Hope Probe reached Mars orbit', year: 2021 },
        { event: 'Museum of the Future opened', year: 2022 },
        { event: 'Abu Dhabi Louvre museum opened', year: 2017 },
        { event: 'Emirates airline founded', year: 1985 },
        { event: 'Palm Jumeirah completed', year: 2006 }
      ];
      var pool = shuffle(yearEvents).slice(0, diffNum(diff, 5, 7, 10));
      var idx = 0, sc = 0, guess = 1990;

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83D\uDCC5 Year Guesser</div>' +
        '<div class="gex1-label" id="yg-status">Round 1/' + pool.length + '</div>' +
        '<div class="gex1-card" id="yg-card">' +
          '<div class="gex1-q" id="yg-event"></div>' +
        '</div>' +
        '<div style="margin:10px 0;">' +
          '<div style="font-family:Orbitron;font-size:2rem;color:#FFD700;margin-bottom:8px;" id="yg-val">1990</div>' +
          '<div style="display:flex;align-items:center;gap:8px;justify-content:center;">' +
            '<button class="gex1-btn" id="yg-m10" style="width:50px;text-align:center;padding:10px;">-10</button>' +
            '<button class="gex1-btn" id="yg-m1" style="width:50px;text-align:center;padding:10px;">-1</button>' +
            '<input type="range" id="yg-slider" min="1950" max="2025" value="1990" style="flex:1;accent-color:#FFD700;">' +
            '<button class="gex1-btn" id="yg-p1" style="width:50px;text-align:center;padding:10px;">+1</button>' +
            '<button class="gex1-btn" id="yg-p10" style="width:50px;text-align:center;padding:10px;">+10</button>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;font-size:0.65rem;color:rgba(255,255,255,0.3);margin-top:2px;"><span>1950</span><span>2025</span></div>' +
        '</div>' +
        '<button class="gex1-btn gex1-btn-gold gex1-btn-big" id="yg-submit" style="margin:8px auto;width:200px;">Submit Guess</button>' +
        '<div id="yg-reveal" style="min-height:60px;margin-top:8px;opacity:0;transition:opacity 0.4s;">' +
          '<div style="display:flex;justify-content:center;gap:20px;align-items:center;">' +
            '<div><div style="font-size:0.6rem;color:rgba(255,255,255,0.4)">YOUR GUESS</div><div id="yg-rguess" style="font-family:Orbitron;font-size:1.3rem;color:#FFD700;"></div></div>' +
            '<div style="font-size:1.2rem;">\u2192</div>' +
            '<div><div style="font-size:0.6rem;color:rgba(255,255,255,0.4)">ACTUAL</div><div id="yg-ractual" style="font-family:Orbitron;font-size:1.3rem;color:#00C9A7;"></div></div>' +
          '</div>' +
          '<div id="yg-rpoints" style="font-weight:700;margin-top:6px;"></div>' +
        '</div>' +
        '<div class="gex1-dots" id="yg-dots"></div>' +
        '<div class="gex1-score" id="yg-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#yg-dots'), pool.length);

      var slider = w.querySelector('#yg-slider');
      var valEl = w.querySelector('#yg-val');
      function updateVal(v) {
        guess = Math.max(1950, Math.min(2025, v));
        slider.value = guess;
        valEl.textContent = guess;
      }
      slider.oninput = function () { updateVal(parseInt(slider.value)); };
      w.querySelector('#yg-m10').onclick = function () { updateVal(guess - 10); };
      w.querySelector('#yg-m1').onclick = function () { updateVal(guess - 1); };
      w.querySelector('#yg-p1').onclick = function () { updateVal(guess + 1); };
      w.querySelector('#yg-p10').onclick = function () { updateVal(guess + 10); };

      function show() {
        w.querySelector('#yg-status').textContent = 'Round ' + (idx + 1) + '/' + pool.length;
        w.querySelector('#yg-event').textContent = pool[idx].event;
        w.querySelector('#yg-reveal').style.opacity = '0';
        w.querySelector('#yg-submit').disabled = false;
        w.querySelector('#yg-card').style.borderColor = 'rgba(255,215,0,0.12)';
        w.querySelector('#yg-card').style.boxShadow = 'none';
        w.querySelector('#yg-card').className = 'gex1-card gex1-pop';
        updateVal(1990);
      }

      w.querySelector('#yg-submit').onclick = function () {
        w.querySelector('#yg-submit').disabled = true;
        var actual = pool[idx].year;
        var dist = Math.abs(guess - actual);
        var pts = dist === 0 ? 5 : dist <= 3 ? 4 : dist <= 5 ? 3 : dist <= 10 ? 2 : dist <= 20 ? 1 : 0;
        sc += pts; E.setScore(sc);

        var card = w.querySelector('#yg-card');
        var color = dist === 0 ? '#FFD700' : dist <= 5 ? '#00C9A7' : dist <= 10 ? '#FF6B35' : '#ff6b6b';
        card.style.borderColor = color;
        card.style.boxShadow = '0 0 18px ' + color + '40';

        var rev = w.querySelector('#yg-reveal');
        rev.style.opacity = '1';
        w.querySelector('#yg-rguess').textContent = guess;
        w.querySelector('#yg-ractual').textContent = actual;
        var rp = w.querySelector('#yg-rpoints');
        rp.textContent = dist === 0 ? '\uD83C\uDFC6 EXACT! +5' : '+' + pts + ' (off by ' + dist + ')';
        rp.style.color = color;

        setDot(w, idx, pts > 0);
        w.querySelector('#yg-sc').textContent = 'Score: ' + sc;
        E.rashidSay(dist === 0 ? 'EXACT! Amazing! \uD83C\uDFC6' : dist <= 5 ? 'Very close! \uD83D\uDC4F' : 'It was ' + actual + '!');

        idx++;
        setTimeout(function () {
          if (idx >= pool.length) E.endGame(sc, pool.length * 5);
          else show();
        }, 1800);
      };

      show();
      return {};
    },
    destroy: function () {}
  });

  /* =========================================================
     5. ODD ONE OUT
     ========================================================= */
  E.register({
    id: 'odd-one-out', name: 'Odd One Out', emoji: '\uD83D\uDD0D', category: 'trivia', has2P: true,
    init: function (container, mode, diff) {
      if (mode === '2p') {
        var oddItems2 = [
          { items: ['\uD83E\uDD85 Falcon', '\uD83E\uDD85 Eagle', '\uD83D\uDC2A Camel', '\uD83E\uDD85 Hawk'], odd: 2, reason: 'Camel is not a bird!' },
          { items: ['\uD83C\uDFDB\uFE0F Abu Dhabi', '\uD83C\uDFD9\uFE0F Dubai', '\uD83C\uDFDB\uFE0F Cairo', '\uD83C\uDFDB\uFE0F Sharjah'], odd: 2, reason: 'Cairo is in Egypt!' },
          { items: ['\uD83C\uDF61 Luqaimat', '\uD83C\uDF5A Machboos', '\uD83C\uDF72 Harees', '\uD83C\uDF63 Sushi'], odd: 3, reason: 'Sushi is Japanese!' },
          { items: ['\uD83D\uDCB0 Dirham', '\uD83D\uDCB0 Fils', '\uD83D\uDCB5 Dollar', '\uD83D\uDCB0 AED'], odd: 2, reason: 'Dollar is not UAE currency!' },
          { items: ['\uD83C\uDFD7\uFE0F Burj Khalifa', '\uD83D\uDDBC\uFE0F Dubai Frame', '\uD83D\uDDFC Eiffel Tower', '\uD83C\uDFDB\uFE0F Museum of Future'], odd: 2, reason: 'Eiffel Tower is in Paris!' },
          { items: ['\uD83E\uDD3F Pearl Diving', '\uD83E\uDD85 Falconry', '\uD83C\uDFC4 Surfing', '\uD83D\uDC2A Camel Racing'], odd: 2, reason: 'Surfing isn\'t traditional Emirati!' },
          { items: ['\uD83D\uDC58 Kandura', '\uD83D\uDC57 Abaya', '\uD83D\uDC58 Kimono', '\uD83E\uDDD5 Ghutrah'], odd: 2, reason: 'Kimono is Japanese!' },
          { items: ['\uD83C\uDDE6\uD83C\uDDEA Red', '\uD83C\uDDE6\uD83C\uDDEA Green', '\uD83C\uDDE6\uD83C\uDDEA Yellow', '\uD83C\uDDE6\uD83C\uDDEA White'], odd: 2, reason: 'Yellow is not a UAE flag color!' }
        ];
        var pool2 = shuffle(oddItems2).slice(0, 8);
        var idx2 = 0, p1Score = 0, p2Score = 0, locked2 = false;

        var w2 = document.createElement('div'); w2.className = 'gex1-wrap'; w2.style.maxWidth = '600px';
        w2.innerHTML =
          '<div class="gex1-title">\uD83D\uDD0D Odd One Out — 2P</div>' +
          '<div class="gex1-label" id="oo2-status">Round 1/' + pool2.length + '</div>' +
          '<div style="display:flex;justify-content:center;gap:24px;margin-bottom:10px;">' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.95rem;color:#4ecdc4;font-weight:700;" id="oo2-p1sc">P1: 0</div>' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.3);">vs</div>' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.95rem;color:#ff6b6b;font-weight:700;" id="oo2-p2sc">P2: 0</div>' +
          '</div>' +
          '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:10px;">Tap the one that doesn\'t belong! First correct click scores.</div>' +
          '<div style="margin-bottom:8px;">' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.75rem;color:#4ecdc4;margin-bottom:6px;text-align:center;">PLAYER 1</div>' +
            '<div class="gex1-grid4" id="oo2-p1grid"></div>' +
          '</div>' +
          '<div style="margin-bottom:8px;">' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.75rem;color:#ff6b6b;margin-bottom:6px;text-align:center;">PLAYER 2</div>' +
            '<div class="gex1-grid4" id="oo2-p2grid"></div>' +
          '</div>' +
          '<div class="gex1-feedback" id="oo2-fb"></div>' +
          '<div class="gex1-dots" id="oo2-dots"></div>';
        container.appendChild(w2);
        makeDots(w2.querySelector('#oo2-dots'), pool2.length);

        function show2() {
          locked2 = false;
          w2.querySelector('#oo2-status').textContent = 'Round ' + (idx2 + 1) + '/' + pool2.length;
          w2.querySelector('#oo2-fb').textContent = '';
          var p1grid = w2.querySelector('#oo2-p1grid'); p1grid.innerHTML = '';
          var p2grid = w2.querySelector('#oo2-p2grid'); p2grid.innerHTML = '';

          pool2[idx2].items.forEach(function (item, i) {
            // P1 card
            var card1 = document.createElement('div');
            card1.className = 'gex1-card gex1-fadein';
            card1.style.cssText = 'cursor:pointer;padding:16px 8px;text-align:center;font-size:0.9rem;font-weight:600;animation-delay:' + (i * 0.06) + 's;border-color:rgba(78,205,196,0.2);';
            card1.textContent = item;
            card1.onclick = function () { handlePick(1, i, card1, p1grid, p2grid); };
            p1grid.appendChild(card1);

            // P2 card
            var card2 = document.createElement('div');
            card2.className = 'gex1-card gex1-fadein';
            card2.style.cssText = 'cursor:pointer;padding:16px 8px;text-align:center;font-size:0.9rem;font-weight:600;animation-delay:' + (i * 0.06) + 's;border-color:rgba(255,107,107,0.2);';
            card2.textContent = item;
            card2.onclick = function () { handlePick(2, i, card2, p1grid, p2grid); };
            p2grid.appendChild(card2);
          });
        }

        function handlePick(player, choice, card, p1grid, p2grid) {
          if (locked2) return;
          locked2 = true;
          var correct = choice === pool2[idx2].odd;
          var fb = w2.querySelector('#oo2-fb');

          // Disable all cards
          var allP1 = p1grid.querySelectorAll('.gex1-card');
          var allP2 = p2grid.querySelectorAll('.gex1-card');
          allP1.forEach(function (c) { c.style.cursor = 'default'; c.onclick = null; });
          allP2.forEach(function (c) { c.style.cursor = 'default'; c.onclick = null; });

          // Highlight the correct odd one in both grids
          if (allP1[pool2[idx2].odd]) allP1[pool2[idx2].odd].classList.add('gex1-correct');
          if (allP2[pool2[idx2].odd]) allP2[pool2[idx2].odd].classList.add('gex1-correct');

          if (correct) {
            card.classList.add('gex1-glow');
            if (player === 1) {
              p1Score++;
              fb.innerHTML = '<span style="color:#4ecdc4;">P1 scores! ' + pool2[idx2].reason + '</span>';
              E.rashidSay('Player 1 spotted it!');
            } else {
              p2Score++;
              fb.innerHTML = '<span style="color:#ff6b6b;">P2 scores! ' + pool2[idx2].reason + '</span>';
              E.rashidSay('Player 2 spotted it!');
            }
            setDot(w2, idx2, true);
          } else {
            card.classList.add('gex1-wrong'); card.classList.add('gex1-shake');
            fb.innerHTML = '<span style="color:rgba(255,255,255,0.5);">Wrong pick! ' + pool2[idx2].reason + '</span>';
            E.rashidSay(pool2[idx2].reason);
            setDot(w2, idx2, false);
          }
          w2.querySelector('#oo2-p1sc').textContent = 'P1: ' + p1Score;
          w2.querySelector('#oo2-p2sc').textContent = 'P2: ' + p2Score;
          E.setScore(p1Score + p2Score);
          idx2++;
          setTimeout(function () {
            if (idx2 >= pool2.length) {
              var winner = p1Score > p2Score ? 'Player 1 wins!' : p2Score > p1Score ? 'Player 2 wins!' : 'It\'s a tie!';
              E.rashidSay(winner + ' (P1: ' + p1Score + ' - P2: ' + p2Score + ')');
              E.endGame(p1Score + p2Score, pool2.length * 2);
            } else show2();
          }, 1200);
        }

        show2();
        return {};
      }
      var oddItems = [
        { items: ['\uD83E\uDD85 Falcon', '\uD83E\uDD85 Eagle', '\uD83D\uDC2A Camel', '\uD83E\uDD85 Hawk'], odd: 2, reason: 'Camel is not a bird!' },
        { items: ['\uD83C\uDFDB\uFE0F Abu Dhabi', '\uD83C\uDFD9\uFE0F Dubai', '\uD83C\uDFDB\uFE0F Cairo', '\uD83C\uDFDB\uFE0F Sharjah'], odd: 2, reason: 'Cairo is in Egypt!' },
        { items: ['\uD83C\uDF61 Luqaimat', '\uD83C\uDF5A Machboos', '\uD83C\uDF72 Harees', '\uD83C\uDF63 Sushi'], odd: 3, reason: 'Sushi is Japanese!' },
        { items: ['\uD83D\uDCB0 Dirham', '\uD83D\uDCB0 Fils', '\uD83D\uDCB5 Dollar', '\uD83D\uDCB0 AED'], odd: 2, reason: 'Dollar is not UAE currency!' },
        { items: ['\uD83C\uDFD7\uFE0F Burj Khalifa', '\uD83D\uDDBC\uFE0F Dubai Frame', '\uD83D\uDDFC Eiffel Tower', '\uD83C\uDFDB\uFE0F Museum of Future'], odd: 2, reason: 'Eiffel Tower is in Paris!' },
        { items: ['\uD83E\uDD3F Pearl Diving', '\uD83E\uDD85 Falconry', '\uD83C\uDFC4 Surfing', '\uD83D\uDC2A Camel Racing'], odd: 2, reason: 'Surfing isn\'t traditional Emirati!' },
        { items: ['\uD83D\uDC58 Kandura', '\uD83D\uDC57 Abaya', '\uD83D\uDC58 Kimono', '\uD83E\uDDD5 Ghutrah'], odd: 2, reason: 'Kimono is Japanese!' },
        { items: ['\uD83C\uDDE6\uD83C\uDDEA Red', '\uD83C\uDDE6\uD83C\uDDEA Green', '\uD83C\uDDE6\uD83C\uDDEA Yellow', '\uD83C\uDDE6\uD83C\uDDEA White'], odd: 2, reason: 'Yellow is not a UAE flag color!' }
      ];
      var pool = shuffle(oddItems).slice(0, diffNum(diff, 5, 7, 8));
      var idx = 0, sc = 0, locked = false;

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83D\uDD0D Odd One Out</div>' +
        '<div class="gex1-label" id="oo-status">Round 1/' + pool.length + '</div>' +
        '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:12px;">Tap the one that doesn\'t belong!</div>' +
        '<div class="gex1-grid4" id="oo-grid"></div>' +
        '<div class="gex1-feedback" id="oo-fb"></div>' +
        '<div class="gex1-dots" id="oo-dots"></div>' +
        '<div class="gex1-score" id="oo-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#oo-dots'), pool.length);

      function show() {
        locked = false;
        w.querySelector('#oo-status').textContent = 'Round ' + (idx + 1) + '/' + pool.length;
        w.querySelector('#oo-fb').textContent = '';
        var grid = w.querySelector('#oo-grid'); grid.innerHTML = '';
        pool[idx].items.forEach(function (item, i) {
          var card = document.createElement('div');
          card.className = 'gex1-card gex1-fadein';
          card.style.cssText = 'cursor:pointer;padding:20px 10px;text-align:center;font-size:1rem;font-weight:600;animation-delay:' + (i * 0.08) + 's;';
          card.textContent = item;
          card.onclick = function () {
            if (locked) return; locked = true;
            var correct = i === pool[idx].odd;
            var fb = w.querySelector('#oo-fb');
            if (correct) {
              sc++; E.addScore(1);
              card.classList.add('gex1-correct'); card.classList.add('gex1-glow');
              fb.innerHTML = '<span style="color:#00C9A7">\u2705 ' + pool[idx].reason + '</span>';
              E.rashidSay('Correct! ' + pool[idx].reason);
              setDot(w, idx, true);
            } else {
              card.classList.add('gex1-wrong'); card.classList.add('gex1-shake');
              grid.children[pool[idx].odd].classList.add('gex1-correct');
              fb.innerHTML = '<span style="color:#ff6b6b">\u274C ' + pool[idx].reason + '</span>';
              E.rashidSay(pool[idx].reason);
              setDot(w, idx, false);
            }
            w.querySelector('#oo-sc').textContent = 'Score: ' + sc;
            idx++;
            setTimeout(function () {
              if (idx >= pool.length) E.endGame(sc, pool.length);
              else show();
            }, 1200);
          };
          grid.appendChild(card);
        });
      }
      show();
      return {};
    },
    destroy: function () {}
  });

  /* =========================================================
     6. TWO TRUTHS ONE LIE
     ========================================================= */
  E.register({
    id: 'two-truths', name: 'Two Truths One Lie', emoji: '\uD83E\uDD25', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var twoTruthsItems = [
        { statements: ['The UAE has 7 emirates', 'Burj Khalifa has 163 floors', 'The UAE flag has 5 colors'], lie: 2, explain: 'The flag has 4 colors!' },
        { statements: ['Falcons have passports in UAE', 'Dubai is the capital', 'Oil discovered in 1958'], lie: 1, explain: 'Abu Dhabi is the capital!' },
        { statements: ['Hope Probe went to Mars', 'Jebel Jais is tallest peak', 'Luqaimat is a drink'], lie: 2, explain: 'Luqaimat is a sweet dumpling!' },
        { statements: ['Pearl diving was major trade', 'UAE was founded in 1990', 'Coffee is served with dates'], lie: 1, explain: 'UAE was founded in 1971!' },
        { statements: ['Dirham is UAE currency', 'Sheikh Zayed Mosque has 82 domes', 'UAE desert is the Sahara'], lie: 2, explain: 'It\'s the Rub\' al Khali!' },
        { statements: ['Dubai Creek divides Deira and Bur Dubai', 'Abu Dhabi means Father of Gazelle', 'Sharjah is the smallest emirate'], lie: 2, explain: 'Ajman is the smallest!' },
        { statements: ['Henna is used for body art', 'Oud is a musical instrument', 'Abaya is worn only by men'], lie: 2, explain: 'Abaya is worn by women!' },
        { statements: ['Arabian Oryx is national animal', 'Dubai has the tallest hotel', 'UAE has no mountains'], lie: 2, explain: 'Hajar Mountains & Jebel Jais!' }
      ];
      var pool = shuffle(twoTruthsItems).slice(0, diffNum(diff, 5, 7, 8));
      var idx = 0, sc = 0, locked = false;

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83E\uDD25 Two Truths, One Lie</div>' +
        '<div class="gex1-label" id="tt-status">Round 1/' + pool.length + '</div>' +
        '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:12px;">Find the LIE!</div>' +
        '<div class="gex1-opts" id="tt-cards"></div>' +
        '<div class="gex1-feedback" id="tt-fb" style="min-height:36px;"></div>' +
        '<div class="gex1-dots" id="tt-dots"></div>' +
        '<div class="gex1-score" id="tt-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#tt-dots'), pool.length);

      function show() {
        locked = false;
        w.querySelector('#tt-status').textContent = 'Round ' + (idx + 1) + '/' + pool.length;
        w.querySelector('#tt-fb').textContent = '';
        var cards = w.querySelector('#tt-cards'); cards.innerHTML = '';
        pool[idx].statements.forEach(function (s, i) {
          var card = document.createElement('div');
          card.className = 'gex1-card gex1-fadein';
          card.style.cssText = 'cursor:pointer;padding:16px;text-align:left;font-size:0.95rem;animation-delay:' + (i * 0.1) + 's;display:flex;align-items:center;gap:10px;';
          card.innerHTML = '<span style="font-size:1.3rem;">' + (i === pool[idx].lie ? '\uD83D\uDCA1' : '\uD83D\uDCA1') + '</span><span>' + s + '</span>';
          card.onclick = function () {
            if (locked) return; locked = true;
            var correct = i === pool[idx].lie;
            var fb = w.querySelector('#tt-fb');
            cards.querySelectorAll('.gex1-card').forEach(function (c, ci) {
              c.style.cursor = 'default';
              if (ci === pool[idx].lie) {
                c.style.borderColor = '#ff6b6b'; c.style.background = 'rgba(255,50,50,0.1)';
                c.innerHTML = '<span style="font-size:1.3rem;">\uD83E\uDD25</span><span style="text-decoration:line-through;color:#ff6b6b;">' + pool[idx].statements[ci] + '</span>';
              } else {
                c.style.borderColor = '#00C9A7'; c.style.background = 'rgba(0,201,167,0.06)';
                c.querySelector('span').textContent = '\u2705';
              }
            });
            if (correct) {
              sc++; E.addScore(1);
              fb.innerHTML = '<span style="color:#00C9A7;">\u2705 Correct! ' + pool[idx].explain + '</span>';
              E.rashidSay('You found the lie! \uD83C\uDFAF');
              setDot(w, idx, true);
            } else {
              card.classList.add('gex1-shake');
              fb.innerHTML = '<span style="color:#ff6b6b;">\u274C ' + pool[idx].explain + '</span>';
              E.rashidSay(pool[idx].explain);
              setDot(w, idx, false);
            }
            w.querySelector('#tt-sc').textContent = 'Score: ' + sc;
            idx++;
            setTimeout(function () {
              if (idx >= pool.length) E.endGame(sc, pool.length);
              else show();
            }, 1500);
          };
          cards.appendChild(card);
        });
      }
      show();
      return {};
    },
    destroy: function () {}
  });

  /* =========================================================
     7. EMIRATES QUIZ
     ========================================================= */
  E.register({
    id: 'emirates-quiz', name: 'Emirates Quiz', emoji: '\uD83C\uDFDB\uFE0F', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var emiratesQs = [
        { q: 'Which emirate is the UAE capital?', a: 'abu dhabi', emoji: '\uD83C\uDFDB\uFE0F' },
        { q: 'Which emirate has Burj Khalifa?', a: 'dubai', emoji: '\uD83C\uDFD7\uFE0F' },
        { q: 'Which is called the cultural capital?', a: 'sharjah', emoji: '\uD83D\uDCDA' },
        { q: 'Which is the smallest emirate?', a: 'ajman', emoji: '\uD83C\uDFD8\uFE0F' },
        { q: 'Which faces the Indian Ocean?', a: 'fujairah', emoji: '\uD83C\uDF0A' },
        { q: 'Which has Jebel Jais mountain?', a: 'ras al khaimah', emoji: '\u26F0\uFE0F' },
        { q: 'Which is known for mangroves?', a: 'umm al quwain', emoji: '\uD83C\uDF3F' }
      ];
      var idx = 0, sc = 0;
      var litEmirs = [];
      var emirNames = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
      var emirColors = ['#FFD700', '#FF6B35', '#00C9A7', '#9b59b6', '#4ecdc4', '#3498db', '#e74c3c'];

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83C\uDFDB\uFE0F Emirates Quiz</div>' +
        '<div class="gex1-label" id="eq-status">Question 1/7</div>' +
        '<div id="eq-map" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:14px;"></div>' +
        '<div class="gex1-card" id="eq-card">' +
          '<div style="font-size:2rem;margin-bottom:6px;" id="eq-emoji"></div>' +
          '<div class="gex1-q" id="eq-q"></div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;justify-content:center;margin-bottom:8px;">' +
          '<input class="gex1-input" type="text" id="eq-input" placeholder="Type emirate name..." style="flex:1;max-width:280px;text-align:left;font-family:Inter,sans-serif;font-size:0.95rem;">' +
          '<button class="gex1-btn gex1-btn-gold" id="eq-submit" style="padding:14px 20px;">Go!</button>' +
        '</div>' +
        '<div class="gex1-feedback" id="eq-fb"></div>' +
        '<div style="display:flex;gap:4px;justify-content:center;margin:8px 0;" id="eq-stars"></div>' +
        '<div class="gex1-score" id="eq-sc">Score: 0 / 7</div>';
      container.appendChild(w);

      // Build mini map
      var mapDiv = w.querySelector('#eq-map');
      emirNames.forEach(function (name, i) {
        var chip = document.createElement('div');
        chip.setAttribute('data-em', i);
        chip.style.cssText = 'padding:6px 12px;border-radius:8px;font-size:0.7rem;font-weight:700;border:1.5px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.3);transition:all 0.4s;';
        chip.textContent = name;
        mapDiv.appendChild(chip);
      });

      // Stars
      var starsDiv = w.querySelector('#eq-stars');
      for (var s = 0; s < 7; s++) {
        var star = document.createElement('span'); star.className = 'gex1-star';
        star.textContent = '\u2B50'; star.setAttribute('data-si', s);
        starsDiv.appendChild(star);
      }

      function lightEmirate(name) {
        var normName = name.toLowerCase();
        emirNames.forEach(function (en, i) {
          if (en.toLowerCase() === normName) {
            var chips = mapDiv.querySelectorAll('[data-em]');
            if (chips[i]) {
              chips[i].style.borderColor = emirColors[i];
              chips[i].style.background = emirColors[i] + '25';
              chips[i].style.color = emirColors[i];
              chips[i].style.boxShadow = '0 0 12px ' + emirColors[i] + '40';
            }
          }
        });
      }

      function show() {
        w.querySelector('#eq-status').textContent = 'Question ' + (idx + 1) + '/7';
        w.querySelector('#eq-emoji').textContent = emiratesQs[idx].emoji;
        w.querySelector('#eq-q').textContent = emiratesQs[idx].q;
        w.querySelector('#eq-input').value = '';
        w.querySelector('#eq-input').disabled = false;
        w.querySelector('#eq-submit').disabled = false;
        w.querySelector('#eq-fb').textContent = '';
        w.querySelector('#eq-card').className = 'gex1-card gex1-pop';
        w.querySelector('#eq-card').style.borderColor = 'rgba(255,215,0,0.12)';
        w.querySelector('#eq-input').focus();
      }

      function submit() {
        var input = w.querySelector('#eq-input');
        var val = input.value.trim().toLowerCase();
        if (!val) { E.rashidSay('Type an answer!'); return; }
        input.disabled = true;
        w.querySelector('#eq-submit').disabled = true;
        var fb = w.querySelector('#eq-fb');
        var card = w.querySelector('#eq-card');

        // Flexible matching
        var correct = val === emiratesQs[idx].a || emiratesQs[idx].a.indexOf(val) === 0 || val.indexOf(emiratesQs[idx].a.split(' ')[0]) >= 0;
        // Also match shortened forms
        var aliases = { 'abu dhabi': ['abu dhabi', 'abudhabi', 'abu'], 'dubai': ['dubai'], 'sharjah': ['sharjah'], 'ajman': ['ajman'], 'fujairah': ['fujairah'], 'ras al khaimah': ['ras al khaimah', 'rak', 'ras'], 'umm al quwain': ['umm al quwain', 'uaq', 'umm'] };
        var al = aliases[emiratesQs[idx].a] || [emiratesQs[idx].a];
        if (al.indexOf(val) >= 0) correct = true;

        if (correct) {
          sc++; E.addScore(1);
          fb.innerHTML = '<span style="color:#00C9A7;">\u2705 Correct!</span>';
          card.style.borderColor = '#00C9A7'; card.style.boxShadow = '0 0 18px rgba(0,201,167,0.2)';
          E.rashidSay('Right! \uD83C\uDFDB\uFE0F');
          lightEmirate(emiratesQs[idx].a);
          var stars = starsDiv.querySelectorAll('.gex1-star');
          if (stars[idx]) stars[idx].classList.add('lit');
        } else {
          var proper = emiratesQs[idx].a.split(' ').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
          fb.innerHTML = '<span style="color:#ff6b6b;">\u274C It was ' + proper + '!</span>';
          card.style.borderColor = '#ff6b6b';
          card.classList.add('gex1-shake');
          E.rashidSay('It was ' + proper + '!');
          lightEmirate(emiratesQs[idx].a);
        }
        w.querySelector('#eq-sc').textContent = 'Score: ' + sc + ' / 7';
        idx++;
        setTimeout(function () {
          if (idx >= emiratesQs.length) E.endGame(sc, 7);
          else show();
        }, 1300);
      }

      w.querySelector('#eq-submit').onclick = submit;
      w.querySelector('#eq-input').onkeydown = function (e) { if (e.key === 'Enter') submit(); };
      show();
      return {};
    },
    destroy: function () {}
  });

  /* =========================================================
     8. ARCHITECTURE QUIZ
     ========================================================= */
  E.register({
    id: 'architecture-quiz', name: 'Architecture Quiz', emoji: '\uD83C\uDFD7\uFE0F', category: 'trivia', has2P: false,
    _iv: null,
    init: function (container, mode, diff) {
      var archQs = [
        { q: 'Tallest building in the world?', a: 0, opts: ['Burj Khalifa', 'Burj Al Arab', 'Dubai Frame', 'CN Tower'], emoji: '\uD83C\uDFE2' },
        { q: 'Sail-shaped hotel symbol of Dubai?', a: 1, opts: ['Cayan Tower', 'Burj Al Arab', 'Atlantis', 'JW Marriott'], emoji: '\u26F5' },
        { q: 'Grand white mosque in Abu Dhabi?', a: 0, opts: ['Sheikh Zayed Mosque', 'Al Bidyah', 'Jumeirah Mosque', 'Blue Mosque'], emoji: '\uD83D\uDD4C' },
        { q: 'Museum sharing name with Paris museum?', a: 2, opts: ['Guggenheim', 'National Museum', 'Louvre Abu Dhabi', 'MOCA'], emoji: '\uD83D\uDDBC\uFE0F' },
        { q: 'Frame-shaped landmark 150m tall?', a: 1, opts: ['Address Tower', 'Dubai Frame', 'Cayan Tower', 'Marina Bay'], emoji: '\uD83D\uDDBC\uFE0F' },
        { q: 'Palm tree shaped man-made island?', a: 0, opts: ['Palm Jumeirah', 'World Islands', 'Yas Island', 'Pearl Island'], emoji: '\uD83C\uDF34' },
        { q: 'Silver torus-shaped museum in Dubai?', a: 3, opts: ['Dubai Museum', 'Al Fahidi', 'Future Museum', 'Museum of Future'], emoji: '\uD83D\uDD2E' }
      ];
      var pool = shuffle(archQs).slice(0, diffNum(diff, 5, 6, 7));
      var timerMax = diffNum(diff, 14, 10, 7);
      var idx = 0, sc = 0, timer = timerMax, locked = false;
      var self = this;

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83C\uDFD7\uFE0F Architecture Quiz</div>' +
        '<div class="gex1-label" id="aq-status">Question 1/' + pool.length + '</div>' +
        '<div class="gex1-timer-bar"><div class="gex1-timer-fill" id="aq-bar" style="width:100%"></div></div>' +
        '<div class="gex1-card" id="aq-card">' +
          '<div class="gex1-big-emoji" id="aq-emoji"></div>' +
          '<div class="gex1-q" id="aq-q"></div>' +
        '</div>' +
        '<div class="gex1-opts" id="aq-opts"></div>' +
        '<div class="gex1-feedback" id="aq-fb"></div>' +
        '<div class="gex1-dots" id="aq-dots"></div>' +
        '<div class="gex1-score" id="aq-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#aq-dots'), pool.length);

      function show() {
        locked = false; timer = timerMax;
        w.querySelector('#aq-bar').style.width = '100%';
        w.querySelector('#aq-bar').style.background = 'linear-gradient(90deg,#FFD700,#FF6B35)';
        w.querySelector('#aq-status').textContent = 'Question ' + (idx + 1) + '/' + pool.length;
        w.querySelector('#aq-emoji').textContent = pool[idx].emoji;
        w.querySelector('#aq-q').textContent = pool[idx].q;
        w.querySelector('#aq-fb').textContent = '';
        w.querySelector('#aq-card').className = 'gex1-card gex1-pop';
        w.querySelector('#aq-card').style.borderColor = 'rgba(255,215,0,0.12)';
        var opts = w.querySelector('#aq-opts'); opts.innerHTML = '';
        pool[idx].opts.forEach(function (o, i) {
          var btn = document.createElement('button'); btn.className = 'gex1-btn';
          btn.textContent = o;
          btn.onclick = function () {
            if (locked) return; locked = true;
            opts.querySelectorAll('.gex1-btn').forEach(function (b) { b.disabled = true; });
            var correct = i === pool[idx].a;
            var fb = w.querySelector('#aq-fb');
            var card = w.querySelector('#aq-card');
            if (correct) {
              sc++; E.addScore(1);
              btn.classList.add('gex1-correct');
              card.style.borderColor = '#00C9A7'; card.style.boxShadow = '0 0 18px rgba(0,201,167,0.2)';
              // "Assemble" animation - make emoji grow
              w.querySelector('#aq-emoji').style.transform = 'scale(1.3)';
              w.querySelector('#aq-emoji').style.transition = 'transform 0.4s ease';
              setTimeout(function () { w.querySelector('#aq-emoji').style.transform = 'scale(1)'; }, 400);
              fb.textContent = '\u2705 Correct!'; fb.style.color = '#00C9A7';
              E.rashidSay(pick(['Right! \uD83C\uDFD7\uFE0F', 'You know your buildings!', 'Correct! \uD83C\uDFAF']));
              setDot(w, idx, true);
            } else {
              btn.classList.add('gex1-wrong'); btn.classList.add('gex1-shake');
              opts.querySelectorAll('.gex1-btn')[pool[idx].a].classList.add('gex1-correct');
              fb.textContent = '\u274C Answer: ' + pool[idx].opts[pool[idx].a]; fb.style.color = '#ff6b6b';
              E.rashidSay('It was ' + pool[idx].opts[pool[idx].a] + '!');
              setDot(w, idx, false);
            }
            w.querySelector('#aq-sc').textContent = 'Score: ' + sc;
            idx++;
            setTimeout(function () {
              if (idx >= pool.length) E.endGame(sc, pool.length);
              else show();
            }, 1000);
          };
          opts.appendChild(btn);
        });
      }

      self._iv = setInterval(function () {
        if (locked) return;
        timer--;
        w.querySelector('#aq-bar').style.width = (timer / timerMax * 100) + '%';
        if (timer <= 3) w.querySelector('#aq-bar').style.background = 'linear-gradient(90deg,#ff6b6b,#FF6B35)';
        if (timer <= 0) {
          locked = true;
          w.querySelector('#aq-fb').textContent = '\u23F0 Time\'s up!'; w.querySelector('#aq-fb').style.color = '#FFD700';
          setDot(w, idx, false); idx++;
          setTimeout(function () {
            if (idx >= pool.length) E.endGame(sc, pool.length);
            else show();
          }, 700);
        }
      }, 1000);

      show();
      return {};
    },
    destroy: function () { if (this._iv) { clearInterval(this._iv); this._iv = null; } }
  });

  /* =========================================================
     9. RULER MATCH
     ========================================================= */
  E.register({
    id: 'ruler-match', name: 'Ruler Match', emoji: '\uD83D\uDC51', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var rulerQs = [
        { q: 'Who is the founder of the UAE?', a: 0, opts: ['Sheikh Zayed', 'Sheikh Rashid', 'Sheikh Mohammed', 'Sheikh Khalifa'] },
        { q: 'Which family rules Dubai?', a: 1, opts: ['Al Nahyan', 'Al Maktoum', 'Al Qasimi', 'Al Nuaimi'] },
        { q: 'Which family rules Abu Dhabi?', a: 0, opts: ['Al Nahyan', 'Al Maktoum', 'Al Sharqi', 'Al Mualla'] },
        { q: 'Year Sheikh Zayed became president?', a: 2, opts: ['1965', '1968', '1971', '1975'] },
        { q: 'How many emirates in the UAE?', a: 1, opts: ['5', '7', '9', '6'] },
        { q: 'Sheikh Zayed was ruler of which emirate?', a: 0, opts: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman'] }
      ];
      var pool = shuffle(rulerQs).slice(0, diffNum(diff, 4, 5, 6));
      var idx = 0, sc = 0, locked = false;

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83D\uDC51 Ruler Match</div>' +
        '<div class="gex1-label" id="rm-status">Question 1/' + pool.length + '</div>' +
        '<div class="gex1-card" id="rm-card" style="border-color:rgba(255,215,0,0.25);background:linear-gradient(145deg,rgba(255,215,0,0.04),rgba(255,107,53,0.02));">' +
          '<div style="font-size:2.5rem;margin-bottom:8px;">\uD83D\uDC51</div>' +
          '<div class="gex1-q" id="rm-q"></div>' +
        '</div>' +
        '<div class="gex1-opts" id="rm-opts"></div>' +
        '<div class="gex1-feedback" id="rm-fb"></div>' +
        '<div class="gex1-dots" id="rm-dots"></div>' +
        '<div class="gex1-score" id="rm-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#rm-dots'), pool.length);

      function show() {
        locked = false;
        w.querySelector('#rm-status').textContent = 'Question ' + (idx + 1) + '/' + pool.length;
        w.querySelector('#rm-q').textContent = pool[idx].q;
        w.querySelector('#rm-fb').textContent = '';
        w.querySelector('#rm-card').className = 'gex1-card gex1-pop';
        w.querySelector('#rm-card').style.boxShadow = 'none';
        var opts = w.querySelector('#rm-opts'); opts.innerHTML = '';
        pool[idx].opts.forEach(function (o, i) {
          var btn = document.createElement('button'); btn.className = 'gex1-btn';
          btn.style.borderColor = 'rgba(255,215,0,0.2)';
          btn.innerHTML = '<span style="margin-right:8px;">\uD83D\uDC51</span>' + o;
          btn.onclick = function () {
            if (locked) return; locked = true;
            opts.querySelectorAll('.gex1-btn').forEach(function (b) { b.disabled = true; });
            var correct = i === pool[idx].a;
            var fb = w.querySelector('#rm-fb');
            if (correct) {
              sc++; E.addScore(1);
              btn.classList.add('gex1-correct');
              fb.textContent = '\u2705 Correct!'; fb.style.color = '#00C9A7';
              E.rashidSay(pick(['Right! \uD83D\uDC51', 'Correct!', 'You know your rulers!']));
              setDot(w, idx, true);
            } else {
              btn.classList.add('gex1-wrong'); btn.classList.add('gex1-shake');
              opts.querySelectorAll('.gex1-btn')[pool[idx].a].classList.add('gex1-correct');
              fb.textContent = '\u274C Answer: ' + pool[idx].opts[pool[idx].a]; fb.style.color = '#ff6b6b';
              E.rashidSay('It was ' + pool[idx].opts[pool[idx].a] + '!');
              setDot(w, idx, false);
            }
            w.querySelector('#rm-sc').textContent = 'Score: ' + sc;
            idx++;
            setTimeout(function () {
              if (idx >= pool.length) E.endGame(sc, pool.length);
              else show();
            }, 1000);
          };
          opts.appendChild(btn);
        });
      }
      show();
      return {};
    },
    destroy: function () {}
  });

  /* =========================================================
     10. CULTURAL ETIQUETTE
     ========================================================= */
  E.register({
    id: 'cultural-etiquette', name: 'Cultural Etiquette', emoji: '\uD83E\uDD1D', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var etiquetteQs = [
        { q: 'When greeting an Emirati, which hand to shake?', a: 0, opts: ['Right hand', 'Left hand', 'Both hands'], explain: 'Always use the right hand!' },
        { q: 'Should you remove shoes when visiting an Emirati home?', a: 0, opts: ['Yes', 'No', 'Only sometimes'], explain: 'Yes, it\'s respectful!' },
        { q: 'Is it polite to refuse Arabic coffee?', a: 1, opts: ['Yes', 'No, accept at least one', 'Doesn\'t matter'], explain: 'Accept at least one cup as courtesy!' },
        { q: 'During Ramadan, eat in public?', a: 1, opts: ['Yes', 'No', 'Only indoors'], explain: 'It\'s respectful not to eat in public during fasting hours!' },
        { q: 'When given a business card, you should...', a: 1, opts: ['Put it away fast', 'Look at it respectfully', 'Write on it'], explain: 'Look at it as a sign of respect!' },
        { q: 'How to say "Thank you" in Arabic?', a: 1, opts: ['Marhaba', 'Shukran', 'Yalla'], explain: 'Shukran means Thank you!' }
      ];
      var pool = shuffle(etiquetteQs).slice(0, diffNum(diff, 4, 5, 6));
      var idx = 0, sc = 0, locked = false;

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83E\uDD1D Cultural Etiquette</div>' +
        '<div class="gex1-label" id="ce-status">Question 1/' + pool.length + '</div>' +
        '<div style="margin-bottom:8px;">' +
          '<div style="font-size:0.7rem;color:rgba(255,255,255,0.35);margin-bottom:2px;">Etiquette Meter</div>' +
          '<div class="gex1-meter"><div class="gex1-meter-fill" id="ce-meter" style="width:0%;"></div></div>' +
        '</div>' +
        '<div class="gex1-card" id="ce-card" style="background:linear-gradient(145deg,rgba(0,201,167,0.04),rgba(255,215,0,0.02));">' +
          '<div style="font-size:2rem;margin-bottom:8px;">\uD83E\uDD1D</div>' +
          '<div class="gex1-q" id="ce-q"></div>' +
        '</div>' +
        '<div class="gex1-opts" id="ce-opts"></div>' +
        '<div class="gex1-feedback" id="ce-fb" style="min-height:40px;"></div>' +
        '<div class="gex1-dots" id="ce-dots"></div>' +
        '<div class="gex1-score" id="ce-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#ce-dots'), pool.length);
      var labels = ['A', 'B', 'C'];

      function show() {
        locked = false;
        w.querySelector('#ce-status').textContent = 'Question ' + (idx + 1) + '/' + pool.length;
        w.querySelector('#ce-q').textContent = pool[idx].q;
        w.querySelector('#ce-fb').textContent = '';
        w.querySelector('#ce-card').className = 'gex1-card gex1-pop';
        w.querySelector('#ce-card').style.borderColor = 'rgba(0,201,167,0.15)';
        w.querySelector('#ce-card').style.boxShadow = 'none';
        var opts = w.querySelector('#ce-opts'); opts.innerHTML = '';
        pool[idx].opts.forEach(function (o, i) {
          var btn = document.createElement('button'); btn.className = 'gex1-btn';
          btn.innerHTML = '<span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:rgba(0,201,167,0.1);text-align:center;line-height:24px;font-size:0.75rem;margin-right:10px;color:#00C9A7;font-weight:800;">' + labels[i] + '</span>' + o;
          btn.onclick = function () {
            if (locked) return; locked = true;
            opts.querySelectorAll('.gex1-btn').forEach(function (b) { b.disabled = true; });
            var correct = i === pool[idx].a;
            var fb = w.querySelector('#ce-fb');
            var card = w.querySelector('#ce-card');
            if (correct) {
              sc++; E.addScore(1);
              btn.classList.add('gex1-correct');
              card.style.borderColor = '#00C9A7'; card.style.boxShadow = '0 0 18px rgba(0,201,167,0.2)';
              fb.innerHTML = '<span style="color:#00C9A7;">\u2705 ' + pool[idx].explain + '</span>';
              E.rashidSay(pick(['Good manners! \uD83E\uDD1D', 'Correct!', 'Very polite!']));
              setDot(w, idx, true);
            } else {
              btn.classList.add('gex1-wrong'); btn.classList.add('gex1-shake');
              opts.querySelectorAll('.gex1-btn')[pool[idx].a].classList.add('gex1-correct');
              fb.innerHTML = '<span style="color:#ff6b6b;">\u274C ' + pool[idx].explain + '</span>';
              E.rashidSay(pool[idx].explain);
              setDot(w, idx, false);
            }
            w.querySelector('#ce-meter').style.width = (sc / pool.length * 100) + '%';
            w.querySelector('#ce-sc').textContent = 'Score: ' + sc;
            idx++;
            setTimeout(function () {
              if (idx >= pool.length) E.endGame(sc, pool.length);
              else show();
            }, 1400);
          };
          opts.appendChild(btn);
        });
      }
      show();
      return {};
    },
    destroy: function () {}
  });

  /* =========================================================
     11. TRANSPORT QUIZ
     ========================================================= */
  E.register({
    id: 'transport-quiz', name: 'Transport Quiz', emoji: '\uD83D\uDE87', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var transportQs = [
        { q: 'Dubai\'s driverless metro system?', a: 0, opts: ['Dubai Metro', 'Dubai Tram', 'Dubai Bus', 'RTA Rail'], emoji: '\uD83D\uDE87' },
        { q: 'Wooden boat crossing Dubai Creek?', a: 1, opts: ['Dhow', 'Abra', 'Ferry', 'Yacht'], emoji: '\uD83D\uDEA3' },
        { q: 'UAE national airline from Abu Dhabi?', a: 2, opts: ['Emirates', 'FlyDubai', 'Etihad', 'Gulf Air'], emoji: '\u2708\uFE0F' },
        { q: 'Dubai\'s famous airline?', a: 0, opts: ['Emirates', 'Etihad', 'FlyDubai', 'Air Arabia'], emoji: '\u2708\uFE0F' },
        { q: 'Monorail runs along which island?', a: 1, opts: ['Yas Island', 'Palm Jumeirah', 'Bluewaters', 'Saadiyat'], emoji: '\uD83D\uDE9D' },
        { q: 'What water taxi travels Dubai waterways?', a: 0, opts: ['Abra/Water Taxi', 'Speedboat', 'Kayak', 'Gondola'], emoji: '\uD83D\uDEA4' }
      ];
      var pool = shuffle(transportQs).slice(0, diffNum(diff, 4, 5, 6));
      var idx = 0, sc = 0, locked = false;

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83D\uDE87 Transport Quiz</div>' +
        '<div class="gex1-label" id="tq2-status">Question 1/' + pool.length + '</div>' +
        '<div class="gex1-card" id="tq2-card">' +
          '<div class="gex1-big-emoji" id="tq2-emoji"></div>' +
          '<div class="gex1-q" id="tq2-q"></div>' +
        '</div>' +
        '<div class="gex1-opts" id="tq2-opts"></div>' +
        '<div class="gex1-feedback" id="tq2-fb"></div>' +
        '<div class="gex1-dots" id="tq2-dots"></div>' +
        '<div class="gex1-score" id="tq2-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#tq2-dots'), pool.length);

      function show() {
        locked = false;
        w.querySelector('#tq2-status').textContent = 'Question ' + (idx + 1) + '/' + pool.length;
        w.querySelector('#tq2-emoji').textContent = pool[idx].emoji;
        w.querySelector('#tq2-q').textContent = pool[idx].q;
        w.querySelector('#tq2-fb').textContent = '';
        w.querySelector('#tq2-card').className = 'gex1-card gex1-pop';
        w.querySelector('#tq2-card').style.borderColor = 'rgba(255,215,0,0.12)';
        var opts = w.querySelector('#tq2-opts'); opts.innerHTML = '';
        pool[idx].opts.forEach(function (o, i) {
          var btn = document.createElement('button'); btn.className = 'gex1-btn';
          btn.innerHTML = '<span style="margin-right:8px;">' + pool[idx].emoji + '</span>' + o;
          btn.onclick = function () {
            if (locked) return; locked = true;
            opts.querySelectorAll('.gex1-btn').forEach(function (b) { b.disabled = true; });
            var correct = i === pool[idx].a;
            var fb = w.querySelector('#tq2-fb');
            if (correct) {
              sc++; E.addScore(1);
              btn.classList.add('gex1-correct');
              fb.textContent = '\u2705 Correct!'; fb.style.color = '#00C9A7';
              E.rashidSay(pick(['Right! \uD83D\uDE87', 'Correct!', 'You know UAE transport!']));
              setDot(w, idx, true);
            } else {
              btn.classList.add('gex1-wrong'); btn.classList.add('gex1-shake');
              opts.querySelectorAll('.gex1-btn')[pool[idx].a].classList.add('gex1-correct');
              fb.textContent = '\u274C Answer: ' + pool[idx].opts[pool[idx].a]; fb.style.color = '#ff6b6b';
              E.rashidSay('It was ' + pool[idx].opts[pool[idx].a] + '!');
              setDot(w, idx, false);
            }
            w.querySelector('#tq2-sc').textContent = 'Score: ' + sc;
            idx++;
            setTimeout(function () {
              if (idx >= pool.length) E.endGame(sc, pool.length);
              else show();
            }, 1000);
          };
          opts.appendChild(btn);
        });
      }
      show();
      return {};
    },
    destroy: function () {}
  });

  /* =========================================================
     12. FESTIVAL QUIZ
     ========================================================= */
  E.register({
    id: 'festival-quiz', name: 'Festival Quiz', emoji: '\uD83C\uDF8A', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var festivalQs = [
        { q: 'Month-long Islamic fasting celebration?', a: 0, opts: ['Ramadan', 'Eid Al Fitr', 'Hajj', 'Mawlid'] },
        { q: 'Holiday celebrating end of Ramadan?', a: 1, opts: ['Eid Al Adha', 'Eid Al Fitr', 'National Day', 'New Year'] },
        { q: 'UAE National Day is on...?', a: 2, opts: ['January 1', 'November 30', 'December 2', 'September 1'] },
        { q: 'Festival of sacrifice?', a: 0, opts: ['Eid Al Adha', 'Eid Al Fitr', 'Ramadan', 'Isra Mi\'raj'] },
        { q: 'Dubai\'s biggest shopping festival (January)?', a: 1, opts: ['Dubai Expo', 'Dubai Shopping Festival', 'Dubai Food Festival', 'Art Dubai'] },
        { q: 'Abu Dhabi heritage festival?', a: 2, opts: ['UAE Day', 'Al Dhafra', 'Qasr Al Hosn', 'Arabian Nights'] }
      ];
      var pool = shuffle(festivalQs).slice(0, diffNum(diff, 4, 5, 6));
      var idx = 0, sc = 0, locked = false;
      var festiveEmojis = ['\uD83C\uDF8A', '\uD83C\uDF89', '\uD83C\uDF86', '\u2728', '\uD83C\uDF1F', '\uD83C\uDF8B'];

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83C\uDF8A Festival Quiz</div>' +
        '<div class="gex1-label" id="fq-status">Question 1/' + pool.length + '</div>' +
        '<div class="gex1-card" id="fq-card" style="border-color:rgba(255,107,53,0.2);background:linear-gradient(145deg,rgba(255,107,53,0.04),rgba(255,215,0,0.03));">' +
          '<div style="font-size:2rem;margin-bottom:8px;" id="fq-fmoji">\uD83C\uDF8A</div>' +
          '<div class="gex1-q" id="fq-q"></div>' +
        '</div>' +
        '<div class="gex1-opts" id="fq-opts"></div>' +
        '<div class="gex1-feedback" id="fq-fb"></div>' +
        '<div class="gex1-dots" id="fq-dots"></div>' +
        '<div class="gex1-score" id="fq-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#fq-dots'), pool.length);

      function show() {
        locked = false;
        w.querySelector('#fq-status').textContent = 'Question ' + (idx + 1) + '/' + pool.length;
        w.querySelector('#fq-q').textContent = pool[idx].q;
        w.querySelector('#fq-fmoji').textContent = festiveEmojis[idx % festiveEmojis.length];
        w.querySelector('#fq-fb').textContent = '';
        w.querySelector('#fq-card').className = 'gex1-card gex1-pop';
        w.querySelector('#fq-card').style.boxShadow = 'none';
        var opts = w.querySelector('#fq-opts'); opts.innerHTML = '';
        pool[idx].opts.forEach(function (o, i) {
          var btn = document.createElement('button'); btn.className = 'gex1-btn';
          btn.style.borderColor = 'rgba(255,107,53,0.2)';
          btn.innerHTML = '<span style="margin-right:8px;">\u2728</span>' + o;
          btn.onclick = function () {
            if (locked) return; locked = true;
            opts.querySelectorAll('.gex1-btn').forEach(function (b) { b.disabled = true; });
            var correct = i === pool[idx].a;
            var fb = w.querySelector('#fq-fb');
            if (correct) {
              sc++; E.addScore(1);
              btn.classList.add('gex1-correct');
              fb.textContent = '\u2705 Correct!'; fb.style.color = '#00C9A7';
              E.rashidSay(pick(['Right! \uD83C\uDF8A', 'Correct!', 'Festive knowledge!']));
              setDot(w, idx, true);
            } else {
              btn.classList.add('gex1-wrong'); btn.classList.add('gex1-shake');
              opts.querySelectorAll('.gex1-btn')[pool[idx].a].classList.add('gex1-correct');
              fb.textContent = '\u274C Answer: ' + pool[idx].opts[pool[idx].a]; fb.style.color = '#ff6b6b';
              E.rashidSay('It was ' + pool[idx].opts[pool[idx].a] + '!');
              setDot(w, idx, false);
            }
            w.querySelector('#fq-sc').textContent = 'Score: ' + sc;
            idx++;
            setTimeout(function () {
              if (idx >= pool.length) E.endGame(sc, pool.length);
              else show();
            }, 1000);
          };
          opts.appendChild(btn);
        });
      }
      show();
      return {};
    },
    destroy: function () {}
  });

  /* =========================================================
     13. SPEED MATH
     ========================================================= */
  E.register({
    id: 'speed-math', name: 'Speed Math', emoji: '\uD83D\uDD22', category: 'trivia', has2P: true,
    _iv: null,
    init: function (container, mode, diff) {
      if (mode === '2p') {
        var mathFacts2 = [
          { text: 'emirates in the UAE', val: 7 },
          { text: 'domes in Sheikh Zayed Mosque', val: 82 },
          { text: 'floors in Burj Khalifa', val: 163 },
          { text: 'colors on UAE flag', val: 4 },
          { text: 'fils in a Dirham', val: 100 }
        ];
        var totalRounds2 = 10;
        var round2 = 0, p1Score = 0, p2Score = 0, locked2 = false, answer2 = 0;
        var self2 = this;
        var roundTimer2 = null;
        var letters2 = ['A', 'B', 'C', 'D'];

        function genProblem2() {
          var f = pick(mathFacts2);
          var add = Math.floor(Math.random() * 30) + 1;
          var isSub = Math.random() > 0.5 && f.val > add;
          answer2 = isSub ? f.val - add : f.val + add;
          return 'There are ' + f.val + ' ' + f.text + '. ' + (isSub ? 'Subtract' : 'Add') + ' ' + add + '. = ?';
        }

        function genChoices(correct) {
          var choices = [correct];
          while (choices.length < 4) {
            var offset = Math.floor(Math.random() * 20) - 10;
            var wrong = correct + offset;
            if (wrong !== correct && wrong > 0 && choices.indexOf(wrong) === -1) {
              choices.push(wrong);
            }
          }
          return shuffle(choices);
        }

        var w2 = document.createElement('div'); w2.className = 'gex1-wrap'; w2.style.maxWidth = '600px';
        w2.innerHTML =
          '<div class="gex1-title">\uD83D\uDD22 Speed Math — 2P</div>' +
          '<div class="gex1-label" id="sm2-status">Round 1/' + totalRounds2 + '</div>' +
          '<div style="display:flex;justify-content:center;gap:24px;margin-bottom:10px;">' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.95rem;color:#4ecdc4;font-weight:700;" id="sm2-p1sc">P1: 0</div>' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.3);">vs</div>' +
            '<div style="font-family:Orbitron,sans-serif;font-size:0.95rem;color:#ff6b6b;font-weight:700;" id="sm2-p2sc">P2: 0</div>' +
          '</div>' +
          '<div class="gex1-timer-bar"><div class="gex1-timer-fill" id="sm2-bar" style="width:100%"></div></div>' +
          '<div class="gex1-card" id="sm2-card">' +
            '<div class="gex1-q" id="sm2-problem"></div>' +
          '</div>' +
          '<div style="display:flex;gap:12px;margin-top:10px;" id="sm2-cols">' +
            '<div style="flex:1;">' +
              '<div style="font-family:Orbitron,sans-serif;font-size:0.75rem;color:#4ecdc4;margin-bottom:6px;text-align:center;">PLAYER 1</div>' +
              '<div id="sm2-p1opts" style="display:flex;flex-direction:column;gap:6px;"></div>' +
            '</div>' +
            '<div style="flex:1;">' +
              '<div style="font-family:Orbitron,sans-serif;font-size:0.75rem;color:#ff6b6b;margin-bottom:6px;text-align:center;">PLAYER 2</div>' +
              '<div id="sm2-p2opts" style="display:flex;flex-direction:column;gap:6px;"></div>' +
            '</div>' +
          '</div>' +
          '<div class="gex1-feedback" id="sm2-fb"></div>' +
          '<div class="gex1-dots" id="sm2-dots"></div>';
        container.appendChild(w2);
        makeDots(w2.querySelector('#sm2-dots'), totalRounds2);

        var p1Picked2 = false, p2Picked2 = false, p1Choice2 = -1, p2Choice2 = -1;

        function show2() {
          locked2 = false; p1Picked2 = false; p2Picked2 = false; p1Choice2 = -1; p2Choice2 = -1;
          var timeLeft = 8;
          var bar = w2.querySelector('#sm2-bar');
          bar.style.width = '100%';
          bar.style.background = 'linear-gradient(90deg,#FFD700,#FF6B35)';
          w2.querySelector('#sm2-status').textContent = 'Round ' + (round2 + 1) + '/' + totalRounds2;
          var problemText = genProblem2();
          w2.querySelector('#sm2-problem').textContent = problemText;
          w2.querySelector('#sm2-fb').textContent = '';
          w2.querySelector('#sm2-card').className = 'gex1-card gex1-pop';
          w2.querySelector('#sm2-card').style.borderColor = 'rgba(255,215,0,0.12)';

          var choices = genChoices(answer2);
          var p1opts = w2.querySelector('#sm2-p1opts'); p1opts.innerHTML = '';
          var p2opts = w2.querySelector('#sm2-p2opts'); p2opts.innerHTML = '';

          choices.forEach(function (c, i) {
            var btn1 = document.createElement('button'); btn1.className = 'gex1-btn';
            btn1.style.borderColor = 'rgba(78,205,196,0.3)'; btn1.style.fontSize = '0.95rem'; btn1.style.padding = '10px 12px'; btn1.style.textAlign = 'center';
            btn1.style.fontFamily = 'Orbitron,sans-serif';
            btn1.innerHTML = '<span style="display:inline-block;width:22px;height:22px;border-radius:6px;background:rgba(78,205,196,0.15);text-align:center;line-height:22px;font-size:0.7rem;margin-right:8px;color:#4ecdc4;font-weight:800">' + letters2[i] + '</span>' + c;
            btn1.setAttribute('data-val', c);
            btn1.onclick = function () { pickAnswer2(1, c, btn1); };
            p1opts.appendChild(btn1);

            var btn2 = document.createElement('button'); btn2.className = 'gex1-btn';
            btn2.style.borderColor = 'rgba(255,107,107,0.3)'; btn2.style.fontSize = '0.95rem'; btn2.style.padding = '10px 12px'; btn2.style.textAlign = 'center';
            btn2.style.fontFamily = 'Orbitron,sans-serif';
            btn2.innerHTML = '<span style="display:inline-block;width:22px;height:22px;border-radius:6px;background:rgba(255,107,107,0.15);text-align:center;line-height:22px;font-size:0.7rem;margin-right:8px;color:#ff6b6b;font-weight:800">' + letters2[i] + '</span>' + c;
            btn2.setAttribute('data-val', c);
            btn2.onclick = function () { pickAnswer2(2, c, btn2); };
            p2opts.appendChild(btn2);
          });

          if (roundTimer2) clearInterval(roundTimer2);
          roundTimer2 = setInterval(function () {
            timeLeft--;
            var pct = timeLeft / 8 * 100;
            bar.style.width = pct + '%';
            if (timeLeft <= 2) bar.style.background = 'linear-gradient(90deg,#ff6b6b,#FF6B35)';
            if (timeLeft <= 0) {
              clearInterval(roundTimer2); roundTimer2 = null; self2._iv = null;
              resolveRound2();
            }
          }, 1000);
          self2._iv = roundTimer2;
        }

        function pickAnswer2(player, val, btn) {
          if (locked2) return;
          if (player === 1 && p1Picked2) return;
          if (player === 2 && p2Picked2) return;
          if (player === 1) { p1Picked2 = true; p1Choice2 = val; disableCol2(w2.querySelector('#sm2-p1opts'), btn); }
          if (player === 2) { p2Picked2 = true; p2Choice2 = val; disableCol2(w2.querySelector('#sm2-p2opts'), btn); }
          if (p1Picked2 && p2Picked2) {
            if (roundTimer2) { clearInterval(roundTimer2); roundTimer2 = null; self2._iv = null; }
            setTimeout(resolveRound2, 300);
          }
        }

        function disableCol2(col, selectedBtn) {
          var btns = col.querySelectorAll('.gex1-btn');
          btns.forEach(function (b) { b.disabled = true; b.style.opacity = '0.4'; });
          selectedBtn.style.opacity = '1';
          selectedBtn.style.background = 'rgba(255,255,255,0.08)';
        }

        function resolveRound2() {
          if (locked2) return;
          locked2 = true;
          var p1Correct = p1Choice2 === answer2;
          var p2Correct = p2Choice2 === answer2;
          var fb = w2.querySelector('#sm2-fb');
          var card = w2.querySelector('#sm2-card');

          // Highlight correct answer in both columns
          var p1btns = w2.querySelector('#sm2-p1opts').querySelectorAll('.gex1-btn');
          var p2btns = w2.querySelector('#sm2-p2opts').querySelectorAll('.gex1-btn');
          p1btns.forEach(function (b) { b.disabled = true; if (parseInt(b.getAttribute('data-val')) === answer2) b.classList.add('gex1-correct'); });
          p2btns.forEach(function (b) { b.disabled = true; if (parseInt(b.getAttribute('data-val')) === answer2) b.classList.add('gex1-correct'); });

          if (p1Correct && !p2Correct) {
            p1Score++; fb.innerHTML = '<span style="color:#4ecdc4;">P1 scores! Answer: ' + answer2 + '</span>'; card.style.borderColor = '#4ecdc4';
            E.rashidSay('Player 1 is fast!');
          } else if (p2Correct && !p1Correct) {
            p2Score++; fb.innerHTML = '<span style="color:#ff6b6b;">P2 scores! Answer: ' + answer2 + '</span>'; card.style.borderColor = '#ff6b6b';
            E.rashidSay('Player 2 is fast!');
          } else if (p1Correct && p2Correct) {
            p1Score++; p2Score++; fb.innerHTML = '<span style="color:#FFD700;">Both correct! Answer: ' + answer2 + '</span>'; card.style.borderColor = '#FFD700';
            E.rashidSay('Both got it right!');
          } else {
            fb.innerHTML = '<span style="color:rgba(255,255,255,0.5);">No one scored. Answer: ' + answer2 + '</span>'; card.style.borderColor = 'rgba(255,255,255,0.2)';
            E.rashidSay('The answer was ' + answer2 + '!');
          }
          setDot(w2, round2, p1Correct || p2Correct);
          w2.querySelector('#sm2-p1sc').textContent = 'P1: ' + p1Score;
          w2.querySelector('#sm2-p2sc').textContent = 'P2: ' + p2Score;
          E.setScore(p1Score + p2Score);
          round2++;
          setTimeout(function () {
            if (round2 >= totalRounds2) {
              var winner = p1Score > p2Score ? 'Player 1 wins!' : p2Score > p1Score ? 'Player 2 wins!' : 'It\'s a tie!';
              E.rashidSay(winner + ' (P1: ' + p1Score + ' - P2: ' + p2Score + ')');
              E.endGame(p1Score + p2Score, totalRounds2 * 2);
            } else show2();
          }, 1200);
        }

        show2();
        return {};
      }
      var mathFacts = [
        { text: 'emirates in the UAE', val: 7 },
        { text: 'domes in Sheikh Zayed Mosque', val: 82 },
        { text: 'floors in Burj Khalifa', val: 163 },
        { text: 'colors on UAE flag', val: 4 },
        { text: 'fils in a Dirham', val: 100 }
      ];
      var totalRounds = diffNum(diff, 5, 8, 10);
      var timerMax = diffNum(diff, 8, 5, 4);
      var round = 0, sc = 0, streak = 0, timer = timerMax, locked = false, answer = 0;
      var self = this;
      var inputVal = '';

      function genProblem() {
        var f = pick(mathFacts);
        var add = Math.floor(Math.random() * 30) + 1;
        var isSub = Math.random() > 0.5 && f.val > add;
        answer = isSub ? f.val - add : f.val + add;
        return 'There are ' + f.val + ' ' + f.text + '. ' + (isSub ? 'Subtract' : 'Add') + ' ' + add + '. = ?';
      }

      var w = document.createElement('div'); w.className = 'gex1-wrap';
      w.innerHTML =
        '<div class="gex1-title">\uD83D\uDD22 Speed Math</div>' +
        '<div class="gex1-label" id="sm-status">Round 1/' + totalRounds + '</div>' +
        '<div class="gex1-timer-bar"><div class="gex1-timer-fill" id="sm-bar" style="width:100%"></div></div>' +
        '<div class="gex1-streak" id="sm-streak"></div>' +
        '<div class="gex1-card" id="sm-card">' +
          '<div class="gex1-q" id="sm-problem"></div>' +
        '</div>' +
        '<div style="font-family:Orbitron;font-size:2.2rem;color:#FFD700;margin:10px 0;min-height:50px;" id="sm-display">&nbsp;</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:240px;margin:0 auto 10px;" id="sm-keypad"></div>' +
        '<div class="gex1-row" style="max-width:240px;margin:0 auto;gap:6px;">' +
          '<button class="gex1-btn" id="sm-clear" style="flex:1;text-align:center;color:#ff6b6b;border-color:rgba(255,50,50,0.3);">C</button>' +
          '<button class="gex1-btn gex1-btn-gold" id="sm-go" style="flex:2;text-align:center;">Submit</button>' +
        '</div>' +
        '<div class="gex1-feedback" id="sm-fb"></div>' +
        '<div class="gex1-dots" id="sm-dots"></div>' +
        '<div class="gex1-score" id="sm-sc">Score: 0</div>';
      container.appendChild(w);
      makeDots(w.querySelector('#sm-dots'), totalRounds);

      // Build keypad 1-9, 0
      var keypad = w.querySelector('#sm-keypad');
      for (var k = 1; k <= 9; k++) {
        (function (num) {
          var btn = document.createElement('button'); btn.className = 'gex1-btn';
          btn.style.textAlign = 'center'; btn.style.padding = '12px'; btn.style.fontSize = '1.1rem';
          btn.style.fontFamily = 'Orbitron,sans-serif';
          btn.textContent = num;
          btn.onclick = function () { if (!locked) { inputVal += num; w.querySelector('#sm-display').textContent = inputVal; } };
          keypad.appendChild(btn);
        })(k);
      }
      // 0 button spanning center
      var btn0 = document.createElement('button'); btn0.className = 'gex1-btn';
      btn0.style.cssText = 'text-align:center;padding:12px;font-size:1.1rem;font-family:Orbitron,sans-serif;grid-column:2;';
      btn0.textContent = '0';
      btn0.onclick = function () { if (!locked) { inputVal += '0'; w.querySelector('#sm-display').textContent = inputVal; } };
      keypad.appendChild(btn0);

      w.querySelector('#sm-clear').onclick = function () { inputVal = ''; w.querySelector('#sm-display').textContent = '\u00A0'; };

      function show() {
        locked = false; timer = timerMax; inputVal = '';
        w.querySelector('#sm-bar').style.width = '100%';
        w.querySelector('#sm-bar').style.background = 'linear-gradient(90deg,#FFD700,#FF6B35)';
        w.querySelector('#sm-status').textContent = 'Round ' + (round + 1) + '/' + totalRounds;
        w.querySelector('#sm-problem').textContent = genProblem();
        w.querySelector('#sm-display').textContent = '\u00A0';
        w.querySelector('#sm-fb').textContent = '';
        w.querySelector('#sm-card').className = 'gex1-card gex1-pop';
        w.querySelector('#sm-card').style.borderColor = 'rgba(255,215,0,0.12)';
        w.querySelector('#sm-go').disabled = false;
      }

      function submit() {
        if (locked) return;
        var val = parseInt(inputVal);
        if (isNaN(val)) { E.rashidSay('Enter a number!'); return; }
        locked = true;
        w.querySelector('#sm-go').disabled = true;
        var correct = val === answer;
        var fb = w.querySelector('#sm-fb');
        var card = w.querySelector('#sm-card');
        if (correct) {
          sc++; streak++; E.addScore(1);
          fb.textContent = '\u2705 Correct!'; fb.style.color = '#00C9A7';
          card.style.borderColor = '#00C9A7'; card.style.boxShadow = '0 0 18px rgba(0,201,167,0.2)';
          E.rashidSay(pick(['Right! \uD83D\uDD22', 'Fast math!', 'Correct!']));
          setDot(w, round, true);
        } else {
          streak = 0;
          fb.textContent = '\u274C Answer was ' + answer; fb.style.color = '#ff6b6b';
          card.style.borderColor = '#ff6b6b'; card.classList.add('gex1-shake');
          E.rashidSay('Nope! It was ' + answer);
          setDot(w, round, false);
        }
        w.querySelector('#sm-streak').textContent = streak > 1 ? '\uD83D\uDD25 ' + streak + ' streak!' : '';
        w.querySelector('#sm-sc').textContent = 'Score: ' + sc;
        round++;
        setTimeout(function () {
          if (round >= totalRounds) E.endGame(sc, totalRounds);
          else show();
        }, 1000);
      }

      w.querySelector('#sm-go').onclick = submit;

      self._iv = setInterval(function () {
        if (locked) return;
        timer--;
        w.querySelector('#sm-bar').style.width = (timer / timerMax * 100) + '%';
        if (timer <= 2) w.querySelector('#sm-bar').style.background = 'linear-gradient(90deg,#ff6b6b,#FF6B35)';
        if (timer <= 0) {
          locked = true; streak = 0;
          w.querySelector('#sm-fb').textContent = '\u23F0 Time\'s up! Answer: ' + answer;
          w.querySelector('#sm-fb').style.color = '#FFD700';
          w.querySelector('#sm-streak').textContent = '';
          setDot(w, round, false);
          round++;
          setTimeout(function () {
            if (round >= totalRounds) E.endGame(sc, totalRounds);
            else show();
          }, 900);
        }
      }, 1000);

      show();
      return {};
    },
    destroy: function () { if (this._iv) { clearInterval(this._iv); this._iv = null; } }
  });

})();
