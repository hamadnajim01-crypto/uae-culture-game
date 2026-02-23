/* ===== FUN & PARTY GAMES (8) — Mixed ===== */
(function () {
  var E = window.GamesEngine;
  var shuffle = E.shuffle, pick = E.pick;

  /* ── 43. Simon Says ── */
  E.register({
    id: 'simon-says', name: 'Simon Says', emoji: '🎯', category: 'fun', has2P: false,
    _tv: null,
    init: function (container, mode, diff) {
      var colors = ['#FF6B35','#FFD700','#00C9A7','#9b59b6'];
      var dimColors = ['rgba(255,107,53,0.12)','rgba(255,215,0,0.12)','rgba(0,201,167,0.12)','rgba(155,89,182,0.12)'];
      var emojis = ['🕌','🐪','🌴','💎'];
      var sequence = [], playerIdx = 0, round = 0, showing = false;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gmb" id="ssStatus" style="font-size:1.1rem;min-height:30px">Watch the pattern!</div>' +
        '<div class="gtext gtext-sm gmb" id="ssRound" style="font-family:Orbitron;opacity:0.6">Round 0</div>' +
        '<div style="display:grid;grid-template-columns:repeat(2,110px);gap:12px" id="ssGrid"></div>' +
        '<div class="gtext gmt gtext-sm" id="ssHint" style="opacity:0.4;min-height:20px"></div>';
      container.appendChild(div);
      var grid = div.querySelector('#ssGrid'); var cells = [];
      for (var i = 0; i < 4; i++) {
        var c = document.createElement('div');
        c.style.cssText = 'width:110px;height:110px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:2.4rem;cursor:pointer;transition:all 0.15s;background:' + dimColors[i] + ';border:2px solid ' + colors[i] + '30;user-select:none';
        c.textContent = emojis[i]; c.setAttribute('data-i', i);
        grid.appendChild(c); cells.push(c);
      }

      var flashDur = diff === 'easy' ? 600 : diff === 'hard' ? 250 : 400;
      var flashGap = diff === 'easy' ? 800 : diff === 'hard' ? 400 : 600;
      function flash(idx, duration) {
        cells[idx].style.background = colors[idx];
        cells[idx].style.transform = 'scale(1.12)';
        cells[idx].style.boxShadow = '0 0 30px ' + colors[idx] + '60';
        cells[idx].style.borderColor = colors[idx];
        setTimeout(function() {
          cells[idx].style.background = dimColors[idx];
          cells[idx].style.transform = 'scale(1)';
          cells[idx].style.boxShadow = 'none';
          cells[idx].style.borderColor = colors[idx] + '30';
        }, duration || flashDur);
      }

      function nextRound() {
        round++; E.setScore(round - 1);
        sequence.push(Math.floor(Math.random() * 4));
        playerIdx = 0; showing = true;
        div.querySelector('#ssStatus').textContent = '👀 Watch carefully!';
        div.querySelector('#ssRound').textContent = 'Round ' + round;
        div.querySelector('#ssHint').textContent = sequence.length + ' to remember';
        var i = 0;
        var iv = setInterval(function() {
          if (i >= sequence.length) {
            clearInterval(iv); showing = false;
            div.querySelector('#ssStatus').textContent = '🎯 Your turn! Repeat the pattern';
            div.querySelector('#ssHint').textContent = playerIdx + '/' + sequence.length;
            return;
          }
          flash(sequence[i], flashDur - 50); i++;
        }, flashGap);
      }

      grid.onclick = function(e) {
        if (showing) return;
        var t = e.target; while (t && !t.hasAttribute('data-i') && t !== grid) t = t.parentNode;
        if (!t || !t.hasAttribute('data-i')) return;
        var idx = parseInt(t.getAttribute('data-i'));
        flash(idx, 200);
        if (idx === sequence[playerIdx]) {
          playerIdx++;
          div.querySelector('#ssHint').textContent = playerIdx + '/' + sequence.length;
          if (playerIdx >= sequence.length) {
            E.rashidSay(pick(['Nice memory! 🧠','Perfect! 🎯','Amazing! 🌟','Keep going! 💪']));
            div.querySelector('#ssStatus').textContent = '✅ Round ' + round + ' complete!';
            setTimeout(nextRound, 800);
          }
        } else {
          cells[idx].style.background = 'rgba(255,50,50,0.3)';
          cells[idx].style.borderColor = '#ff6b6b';
          div.querySelector('#ssStatus').textContent = '❌ Wrong! You reached round ' + round;
          div.querySelector('#ssHint').textContent = round > 5 ? 'Amazing run!' : round > 2 ? 'Good effort!' : 'Try again!';
          E.rashidSay('Game over at round ' + round + '!');
          E.endGame(round - 1, round - 1 || 1);
        }
      };

      setTimeout(nextRound, 600);
      return {};
    }, destroy: function() {}
  });

  /* ── 44. Reaction Time ── */
  E.register({
    id: 'reaction-time', name: 'Reaction Time', emoji: '⚡', category: 'fun', has2P: true,
    _tv: null,
    init: function (container, mode, diff) {
      var rounds = diff === 'easy' ? 3 : diff === 'hard' ? 7 : 5;
      var round = 0, times1 = [], times2 = [], waiting = false, startTime = 0, tooEarly = false;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gmb" id="rtStatus" style="font-size:1.1rem">Get ready...</div>' +
        '<div class="gtext gtext-sm gmb" id="rtRound" style="font-family:Orbitron;opacity:0.5">Round 0/' + rounds + '</div>' +
        '<div id="rtBox" style="width:320px;height:220px;border-radius:20px;background:linear-gradient(135deg,#ff3232,#cc2929);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;user-select:none;transition:all 0.15s;box-shadow:0 8px 30px rgba(255,50,50,0.3);border:2px solid rgba(255,255,255,0.1)">' +
        '<span style="font-size:3rem;margin-bottom:8px" id="rtEmoji">🔴</span>' +
        '<span class="gtext gtext-lg" id="rtText" style="font-weight:700">Wait for GREEN...</span>' +
        '<span class="gtext gtext-sm" id="rtSub" style="opacity:0.6;margin-top:4px">Don\'t tap yet!</span></div>' +
        '<div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;justify-content:center" id="rtTimes"></div>' +
        (mode === '2p' ?
        '<div class="gflex gmt" style="gap:20px"><div class="gtext" id="rtP1" style="font-family:Orbitron">P1: --</div><div class="gtext" id="rtP2" style="font-family:Orbitron">P2: --</div></div>' :
        '<div class="gtext gmt" id="rtResult" style="font-family:Orbitron;font-size:1.2rem"></div>') +
        '<div class="gtext gmt gtext-sm" id="rtBest" style="opacity:0.5"></div>';
      container.appendChild(div);
      var box = div.querySelector('#rtBox');
      var textEl = div.querySelector('#rtText');
      var emojiEl = div.querySelector('#rtEmoji');
      var subEl = div.querySelector('#rtSub');
      var timesDiv = div.querySelector('#rtTimes');
      var self = this;

      function addTimeDot(time) {
        var dot = document.createElement('div');
        var color = time < 250 ? '#00C9A7' : time < 400 ? '#FFD700' : '#FF6B35';
        dot.style.cssText = 'padding:4px 10px;border-radius:20px;background:' + color + '20;border:1px solid ' + color + '50;font-size:0.75rem;font-family:Orbitron;color:' + color;
        dot.textContent = time + 'ms';
        timesDiv.appendChild(dot);
      }

      function startRound() {
        round++;
        if (round > rounds) { finish(); return; }
        waiting = false; tooEarly = false;
        box.style.background = 'linear-gradient(135deg,#ff3232,#cc2929)';
        box.style.boxShadow = '0 8px 30px rgba(255,50,50,0.3)';
        emojiEl.textContent = '🔴'; textEl.textContent = 'Wait for GREEN...'; subEl.textContent = "Don't tap yet!";
        div.querySelector('#rtRound').textContent = 'Round ' + round + '/' + rounds;
        div.querySelector('#rtStatus').textContent = 'Get ready...';
        var delay = 1500 + Math.random() * 3000;
        self._tv = setTimeout(function() {
          box.style.background = 'linear-gradient(135deg,#00C9A7,#009a7a)';
          box.style.boxShadow = '0 8px 30px rgba(0,201,167,0.4)';
          emojiEl.textContent = '🟢'; textEl.textContent = 'TAP NOW!'; subEl.textContent = 'Go go go!';
          div.querySelector('#rtStatus').textContent = '⚡ TAP!';
          startTime = Date.now(); waiting = true;
        }, delay);
      }

      function finish() {
        var avg1 = times1.length > 0 ? Math.round(times1.reduce(function(a,b){return a+b;},0) / times1.length) : 9999;
        var best1 = times1.length > 0 ? Math.min.apply(null, times1) : 9999;
        box.style.background = 'linear-gradient(135deg,#FFD700,#e6c200)';
        box.style.boxShadow = '0 8px 30px rgba(255,215,0,0.3)';
        emojiEl.textContent = '🏆';
        textEl.textContent = 'Average: ' + avg1 + 'ms';
        subEl.textContent = 'Best: ' + best1 + 'ms';
        var rating = avg1 < 200 ? 'Lightning! ⚡' : avg1 < 300 ? 'Super fast! 🚀' : avg1 < 400 ? 'Quick! 👍' : 'Keep practicing! 💪';
        div.querySelector('#rtStatus').textContent = rating;
        if (mode === '2p') {
          var avg2 = times2.length > 0 ? Math.round(times2.reduce(function(a,b){return a+b;},0) / times2.length) : 9999;
          var w = avg1 < avg2 ? 'P1 wins! 🏆' : avg2 < avg1 ? 'P2 wins! 🏆' : 'Draw! 🤝';
          E.rashidSay(w + ' P1: ' + avg1 + 'ms, P2: ' + avg2 + 'ms');
        } else {
          E.rashidSay(rating + ' Average: ' + avg1 + 'ms!');
        }
        E.endGame(Math.max(1, Math.round((500 - avg1) / 50)), 10);
      }

      box.onclick = function() {
        if (waiting) {
          var time = Date.now() - startTime;
          times1.push(time); addTimeDot(time);
          box.style.background = 'linear-gradient(135deg,#FFD700,#e6c200)';
          box.style.boxShadow = '0 8px 30px rgba(255,215,0,0.3)';
          emojiEl.textContent = '⚡'; textEl.textContent = time + 'ms!';
          subEl.textContent = time < 200 ? 'INCREDIBLE!' : time < 300 ? 'Fast!' : time < 400 ? 'Good!' : 'Not bad!';
          div.querySelector('#rtStatus').textContent = '✅ ' + time + 'ms';
          var best = Math.min.apply(null, times1);
          div.querySelector('#rtBest').textContent = 'Best: ' + best + 'ms';
          if (mode === '2p') div.querySelector('#rtP1').textContent = 'P1: ' + time + 'ms';
          else { var res = div.querySelector('#rtResult'); if (res) res.textContent = time + 'ms'; }
          waiting = false;
          setTimeout(function() { startRound(); }, 1200);
        } else if (!tooEarly) {
          tooEarly = true;
          if (self._tv) clearTimeout(self._tv);
          box.style.background = 'linear-gradient(135deg,#8B0000,#660000)';
          emojiEl.textContent = '❌'; textEl.textContent = 'TOO EARLY!';
          subEl.textContent = 'Wait for green next time!';
          div.querySelector('#rtStatus').textContent = '⛔ Too early!';
          E.rashidSay('Patience! Wait for green! 🔴');
          setTimeout(function() { startRound(); }, 1500);
        }
      };

      setTimeout(function() { startRound(); }, 800);
      return {};
    }, destroy: function() { if (this._tv) clearTimeout(this._tv); }
  });

  /* ── 45. Color Match (Stroop Test) ── */
  E.register({
    id: 'color-match', name: 'Color Match', emoji: '🎨', category: 'fun', has2P: false,
    _tv: null,
    init: function (container, mode, diff) {
      var colorNames = ['RED','BLUE','GREEN','YELLOW'];
      var colorValues = { RED: '#ff3232', BLUE: '#3498db', GREEN: '#00C9A7', YELLOW: '#FFD700' };
      var cmRounds = diff === 'easy' ? 12 : diff === 'hard' ? 25 : 20;
      var cmTime = diff === 'easy' ? 45 : diff === 'hard' ? 20 : 30;
      var rounds = cmRounds, round = 0, sc = 0, timeLeft = cmTime, streak = 0;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">' +
        '<div class="gtext" id="cmTimer" style="font-family:Orbitron;font-size:1.3rem">⏱️ ' + cmTime + '</div>' +
        '<div class="gtext gtext-sm" id="cmStreak" style="opacity:0"></div></div>' +
        '<div style="width:100%;max-width:300px;height:4px;background:rgba(255,255,255,0.08);border-radius:4px;margin-bottom:12px;overflow:hidden"><div id="cmTimerBar" style="width:100%;height:100%;background:linear-gradient(90deg,#FFD700,#FF6B35);transition:width 1s linear;border-radius:4px"></div></div>' +
        '<div class="gtext gtext-sm gmb" style="padding:8px 16px;background:rgba(255,215,0,0.08);border-radius:10px;border:1px solid rgba(255,215,0,0.15)">Click the color matching the <strong>WORD</strong>, not the ink! 🧠</div>' +
        '<div style="width:200px;height:100px;display:flex;align-items:center;justify-content:center;margin:16px 0;background:rgba(255,255,255,0.03);border-radius:16px;border:1.5px solid rgba(255,255,255,0.06)">' +
        '<div id="cmWord" style="font-size:2.8rem;font-weight:900;font-family:Orbitron;letter-spacing:3px;text-shadow:0 4px 15px rgba(0,0,0,0.3);transition:transform 0.15s"></div></div>' +
        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%;max-width:260px" id="cmBtns"></div>' +
        '<div id="cmFeedback" style="min-height:24px;margin-top:10px;font-weight:700;font-size:0.9rem"></div>' +
        '<div class="gtext gmt" id="cmScore" style="font-family:Orbitron">Score: 0/' + rounds + '</div>';
      container.appendChild(div);

      function show() {
        round++;
        var word = pick(colorNames);
        var ink = pick(colorNames.filter(function(c) { return c !== word; }));
        var wordEl = div.querySelector('#cmWord');
        wordEl.textContent = word;
        wordEl.style.color = colorValues[ink];
        wordEl.style.transform = 'scale(0.8)';
        setTimeout(function() { wordEl.style.transform = 'scale(1)'; }, 50);
        div.querySelector('#cmFeedback').textContent = '';
        var btns = div.querySelector('#cmBtns'); btns.innerHTML = '';
        colorNames.forEach(function(c) {
          var btn = document.createElement('button'); btn.className = 'gbtn';
          btn.style.cssText = 'padding:16px;background:' + colorValues[c] + '25;border:2.5px solid ' + colorValues[c] + ';border-radius:14px;cursor:pointer;transition:all 0.15s;font-weight:700;color:' + colorValues[c] + ';font-size:0.9rem';
          btn.textContent = c;
          btn.onmouseenter = function() { btn.style.background = colorValues[c] + '50'; btn.style.transform = 'scale(1.05)'; };
          btn.onmouseleave = function() { btn.style.background = colorValues[c] + '25'; btn.style.transform = 'scale(1)'; };
          btn.onclick = function() {
            var fb = div.querySelector('#cmFeedback');
            if (c === word) {
              sc++; streak++; E.setScore(sc);
              fb.textContent = '✅' + (streak > 2 ? ' 🔥' + streak + ' streak!' : ''); fb.style.color = '#00C9A7';
              div.querySelector('#cmStreak').textContent = streak > 1 ? '🔥' + streak : '';
              div.querySelector('#cmStreak').style.opacity = streak > 1 ? '1' : '0';
            } else {
              streak = 0;
              fb.textContent = '❌ The word said ' + word + '!'; fb.style.color = '#ff6b6b';
              div.querySelector('#cmStreak').style.opacity = '0';
            }
            div.querySelector('#cmScore').textContent = 'Score: ' + sc + '/' + rounds;
            if (round >= rounds || timeLeft <= 0) E.endGame(sc, rounds);
            else show();
          };
          btns.appendChild(btn);
        });
      }

      this._tv = setInterval(function() { timeLeft--;
        div.querySelector('#cmTimer').textContent = '⏱️ ' + timeLeft;
        div.querySelector('#cmTimerBar').style.width = (timeLeft / cmTime * 100) + '%';
        if (timeLeft <= 5) { div.querySelector('#cmTimer').style.color = '#ff6b6b'; div.querySelector('#cmTimerBar').style.background = 'linear-gradient(90deg,#ff6b6b,#FF6B35)'; }
        if (timeLeft <= 0) { clearInterval(this._tv); E.endGame(sc, rounds); }
      }.bind(this), 1000);
      show();
      return {};
    }, destroy: function() { if (this._tv) clearInterval(this._tv); }
  });

  /* ── 46. Spot Difference ── */
  E.register({
    id: 'spot-diff', name: 'Spot Difference', emoji: '🔎', category: 'fun', has2P: false,
    _tv: null,
    init: function (container, mode, diff) {
      var items = ['🕌','🐪','🌴','💎','🦅','🏜️','⭐','🌙','🪙','🐫','🎯','🏗️','⛵','🐚','🌊','🎨','🦢','🎪','🌺','🦜'];
      var SIZE = 4;
      var numDiffs = diff === 'easy' ? 3 : diff === 'hard' ? 7 : 5;
      var base = shuffle(items).slice(0, SIZE * SIZE);
      var modified = base.slice();
      var diffPositions = shuffle(Array.from({length: SIZE*SIZE}, function(_,i){return i;})).slice(0, numDiffs);
      var alternates = shuffle(items.filter(function(i) { return base.indexOf(i) === -1; }).concat(['🔴','🟡','🟢','🔵','🟣','🟠','🩵']));
      diffPositions.forEach(function(p, i) { modified[p] = alternates[i] || '❓'; });

      var found = [], sc = 0, mistakes = 0;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gmb" style="font-size:1.05rem">🔎 Find ' + numDiffs + ' differences! Tap the changed emoji in the right grid.</div>' +
        '<div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">' +
        '<div style="text-align:center"><div class="gtext gtext-sm gmb" style="color:#00C9A7;font-weight:700">✅ Original</div><div class="gboard" style="grid-template-columns:repeat('+SIZE+',50px);gap:4px" id="sdLeft"></div></div>' +
        '<div style="text-align:center"><div class="gtext gtext-sm gmb" style="color:#FFD700;font-weight:700">🔍 Find changes here</div><div class="gboard" style="grid-template-columns:repeat('+SIZE+',50px);gap:4px" id="sdRight"></div></div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-top:12px;align-items:center" id="sdDots"></div>' +
        '<div class="gtext gmt" id="sdStatus" style="font-family:Orbitron">Found: 0/' + numDiffs + '</div>';
      container.appendChild(div);

      // Progress dots
      var dotsDiv = div.querySelector('#sdDots');
      for (var d = 0; d < numDiffs; d++) {
        var dot = document.createElement('div');
        dot.style.cssText = 'width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.1);border:1.5px solid rgba(255,215,0,0.2);transition:all 0.3s';
        dot.setAttribute('data-dot', d);
        dotsDiv.appendChild(dot);
      }

      var leftGrid = div.querySelector('#sdLeft'), rightGrid = div.querySelector('#sdRight');
      for (var i = 0; i < SIZE * SIZE; i++) {
        var c1 = document.createElement('div'); c1.className = 'gcell';
        c1.style.cssText = 'height:50px;width:50px;font-size:1.5rem;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(255,255,255,0.03);border:1.5px solid rgba(255,255,255,0.06)';
        c1.textContent = base[i]; leftGrid.appendChild(c1);
        var c2 = document.createElement('div'); c2.className = 'gcell';
        c2.style.cssText = 'height:50px;width:50px;font-size:1.5rem;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(255,255,255,0.03);border:1.5px solid rgba(255,215,0,0.1);cursor:pointer;transition:all 0.2s';
        c2.textContent = modified[i]; c2.setAttribute('data-i', i);
        rightGrid.appendChild(c2);
      }

      rightGrid.onclick = function(e) {
        var t = e.target; if (!t.hasAttribute('data-i')) return;
        var idx = parseInt(t.getAttribute('data-i'));
        if (found.indexOf(idx) > -1) return;
        if (diffPositions.indexOf(idx) > -1) {
          found.push(idx); sc++; E.addScore(1);
          t.style.background = 'rgba(0,201,167,0.2)'; t.style.borderColor = '#00C9A7'; t.style.boxShadow = '0 0 15px rgba(0,201,167,0.3)';
          // Also highlight in left grid
          leftGrid.children[idx].style.background = 'rgba(0,201,167,0.2)'; leftGrid.children[idx].style.borderColor = '#00C9A7';
          // Fill dot
          var dots = dotsDiv.querySelectorAll('[data-dot]');
          if (dots[sc-1]) { dots[sc-1].style.background = '#00C9A7'; dots[sc-1].style.borderColor = '#00C9A7'; dots[sc-1].style.boxShadow = '0 0 8px rgba(0,201,167,0.5)'; }
          div.querySelector('#sdStatus').textContent = 'Found: ' + sc + '/' + numDiffs;
          E.rashidSay(pick(['Found one! 🔎','Sharp eyes! 👀','Nice spot! 🎯']));
          if (sc >= numDiffs) { E.rashidSay('All found! 🎉'); E.endGame(numDiffs, numDiffs); }
        } else {
          mistakes++;
          t.style.background = 'rgba(255,50,50,0.15)'; t.style.borderColor = 'rgba(255,50,50,0.3)';
          setTimeout(function() { t.style.background = 'rgba(255,255,255,0.03)'; t.style.borderColor = 'rgba(255,215,0,0.1)'; }, 400);
          E.rashidSay(pick(['Not there!','Keep looking!','Try again!']));
        }
      };
      return {};
    }, destroy: function() { if (this._tv) clearInterval(this._tv); }
  });

  /* ── 47. Falcon Pearl Sand (RPS) ── */
  E.register({
    id: 'falcon-pearl-sand', name: 'Falcon Pearl Sand', emoji: '✊', category: 'fun', has2P: true,
    init: function (container, mode, diff) {
      var choices = [{name:'Falcon',emoji:'🦅',beats:'Pearl',color:'#FF6B35'},{name:'Pearl',emoji:'💎',beats:'Sand',color:'#00C9A7'},{name:'Sand',emoji:'🏜️',beats:'Falcon',color:'#FFD700'}];
      var rounds = diff === 'easy' ? 3 : diff === 'hard' ? 7 : 5;
      var round = 0, sc1 = 0, sc2 = 0, p1Choice = null, locked = false;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gmb" id="rpsStatus" style="font-family:Orbitron;font-size:1.1rem">Round 1/' + rounds + '</div>' +
        '<div class="gtext gtext-sm gmb" style="padding:8px 16px;background:rgba(255,215,0,0.06);border-radius:10px;border:1px solid rgba(255,215,0,0.1)">🦅 beats 💎 · 💎 beats 🏜️ · 🏜️ beats 🦅</div>' +
        '<div id="rpsArena" style="display:flex;align-items:center;gap:20px;margin:16px 0;min-height:100px">' +
        '<div id="rpsP1Show" style="width:80px;height:80px;border-radius:50%;background:rgba(255,215,0,0.08);border:2px solid rgba(255,215,0,0.2);display:flex;align-items:center;justify-content:center;font-size:2.5rem;transition:all 0.3s">❓</div>' +
        '<div class="gtext" style="font-size:1.5rem;font-weight:900">VS</div>' +
        '<div id="rpsP2Show" style="width:80px;height:80px;border-radius:50%;background:rgba(0,201,167,0.08);border:2px solid rgba(0,201,167,0.2);display:flex;align-items:center;justify-content:center;font-size:2.5rem;transition:all 0.3s">❓</div>' +
        '</div>' +
        (mode === '2p' ? '<div class="gtext gmb gtext-sm" id="rpsP1Status">P1: Choose!</div>' : '') +
        '<div style="display:flex;gap:10px;margin-bottom:12px" id="rpsBtns"></div>' +
        '<div id="rpsResult" style="min-height:32px;font-weight:700;font-size:1.1rem;transition:opacity 0.3s"></div>' +
        '<div class="gtext gmt" id="rpsScore" style="font-family:Orbitron">P1: 0 | ' + (mode==='2p'?'P2':'Rashid') + ': 0</div>';
      container.appendChild(div);

      function renderBtns(cb) {
        var btns = div.querySelector('#rpsBtns'); btns.innerHTML = '';
        locked = false;
        choices.forEach(function(c) {
          var btn = document.createElement('button'); btn.className = 'gbtn';
          btn.style.cssText = 'padding:14px 20px;border-radius:14px;background:' + c.color + '15;border:2px solid ' + c.color + '40;color:#fff;cursor:pointer;transition:all 0.2s;font-size:1rem;display:flex;flex-direction:column;align-items:center;gap:4px';
          btn.innerHTML = '<span style="font-size:2rem">' + c.emoji + '</span><span style="font-size:0.8rem">' + c.name + '</span>';
          btn.onmouseenter = function() { btn.style.background = c.color + '30'; btn.style.transform = 'scale(1.08)'; };
          btn.onmouseleave = function() { btn.style.background = c.color + '15'; btn.style.transform = 'scale(1)'; };
          btn.onclick = function() { if (!locked) cb(c); };
          btns.appendChild(btn);
        });
      }

      function showResult(c1, c2, result) {
        var p1Show = div.querySelector('#rpsP1Show');
        var p2Show = div.querySelector('#rpsP2Show');
        p1Show.textContent = c1.emoji; p1Show.style.borderColor = c1.color; p1Show.style.background = c1.color + '20';
        p2Show.textContent = c2.emoji; p2Show.style.borderColor = c2.color; p2Show.style.background = c2.color + '20';
        var resultEl = div.querySelector('#rpsResult');
        if (result === 'p1') {
          p1Show.style.boxShadow = '0 0 20px ' + c1.color + '60'; p1Show.style.transform = 'scale(1.15)';
          resultEl.textContent = '🏆 ' + c1.name + ' beats ' + c2.name + '! You win!'; resultEl.style.color = '#00C9A7';
        } else if (result === 'p2') {
          p2Show.style.boxShadow = '0 0 20px ' + c2.color + '60'; p2Show.style.transform = 'scale(1.15)';
          resultEl.textContent = '😤 ' + c2.name + ' beats ' + c1.name + '! ' + (mode==='2p'?'P2':'Rashid') + ' wins!'; resultEl.style.color = '#ff6b6b';
        } else {
          resultEl.textContent = '🤝 Draw! Both chose ' + c1.emoji; resultEl.style.color = '#FFD700';
        }
      }

      function resolveRound(c1, c2) {
        locked = true; round++;
        var result;
        if (c1.name === c2.name) result = 'draw';
        else if (c1.beats === c2.name) result = 'p1';
        else result = 'p2';
        if (result === 'p1') { sc1++; E.rashidSay(c1.emoji + ' beats ' + c2.emoji + '!'); }
        else if (result === 'p2') { sc2++; E.rashidSay(c2.emoji + ' beats ' + c1.emoji + '!'); }
        else E.rashidSay('Draw!');
        showResult(c1, c2, result);
        div.querySelector('#rpsScore').textContent = 'P1: '+sc1+' | '+(mode==='2p'?'P2':'Rashid')+': '+sc2;
        E.setScore(sc1);
        if (round >= rounds) { setTimeout(function() { E.endGame(sc1, rounds); }, 1200); return; }
        setTimeout(function() {
          div.querySelector('#rpsStatus').textContent = 'Round ' + (round + 1) + '/' + rounds;
          div.querySelector('#rpsP1Show').textContent = '❓'; div.querySelector('#rpsP1Show').style.boxShadow = 'none'; div.querySelector('#rpsP1Show').style.transform = 'scale(1)'; div.querySelector('#rpsP1Show').style.borderColor = 'rgba(255,215,0,0.2)'; div.querySelector('#rpsP1Show').style.background = 'rgba(255,215,0,0.08)';
          div.querySelector('#rpsP2Show').textContent = '❓'; div.querySelector('#rpsP2Show').style.boxShadow = 'none'; div.querySelector('#rpsP2Show').style.transform = 'scale(1)'; div.querySelector('#rpsP2Show').style.borderColor = 'rgba(0,201,167,0.2)'; div.querySelector('#rpsP2Show').style.background = 'rgba(0,201,167,0.08)';
          div.querySelector('#rpsResult').textContent = '';
          startRound();
        }, 1200);
      }

      function startRound() {
        if (mode === '2p') {
          p1Choice = null;
          if (div.querySelector('#rpsP1Status')) div.querySelector('#rpsP1Status').textContent = 'P1: Choose!';
          renderBtns(function(c) {
            if (!p1Choice) {
              p1Choice = c;
              div.querySelector('#rpsP1Show').textContent = '✅';
              if (div.querySelector('#rpsP1Status')) div.querySelector('#rpsP1Status').textContent = 'P1 chose! P2: Choose!';
              renderBtns(function(c2) { resolveRound(p1Choice, c2); });
            }
          });
        } else {
          var lastPlayerChoice = null;
          renderBtns(function(c) {
            locked = true;
            div.querySelector('#rpsP1Show').textContent = c.emoji;
            div.querySelector('#rpsP2Show').textContent = '🤔';
            // Dramatic pause
            setTimeout(function() {
              var aiChoice;
              if (diff === 'hard' && lastPlayerChoice) {
                aiChoice = choices.filter(function(ch) { return ch.beats === lastPlayerChoice.name; })[0] || pick(choices);
              } else {
                aiChoice = pick(choices);
              }
              lastPlayerChoice = c;
              resolveRound(c, aiChoice);
            }, 600);
          });
        }
      }
      startRound();
      return {};
    }, destroy: function() {}
  });

  /* ── 48. Drawing Guess ── */
  E.register({
    id: 'drawing-guess', name: 'Drawing Guess', emoji: '✏️', category: 'fun', has2P: false,
    _tv: null,
    init: function (container, mode, diff) {
      var allAnswers = ['Camel','Mosque','Palm Tree','Sun','Boat','Falcon','Desert','Pearl','Dune','Oasis','Tent','Fish','Crown','Star','Moon','Flower'];
      var items = shuffle([
        { answer: 'Camel', steps: ['🟤','🟤🟤','🟤🟤\n  🦵','🟤🟤\n  🦵🦵','🐪'] },
        { answer: 'Mosque', steps: ['🟦','🟦\n🏛️','🟦\n🏛️🕌','🟦☪️\n🏛️🕌','🕌'] },
        { answer: 'Palm Tree', steps: ['|','|🟤','|🟤\n🌿','🌿🌿\n|🟤\n🌿','🌴'] },
        { answer: 'Sun', steps: ['·','○','☀️ rays','☀️','☀️🏜️'] },
        { answer: 'Boat', steps: ['~','~⛵~','~🚢~','~🚢~🌊','⛵'] },
        { answer: 'Falcon', steps: ['🟤','🟤👁️','🟤👁️\n🪶','🟤👁️\n🪶🪶','🦅'] },
        { answer: 'Desert', steps: ['🟡','🟡🟡','🟡🟡\n~~','🟡🟡☀️\n~~','🏜️'] },
        { answer: 'Pearl', steps: ['🫧','🫧⚪','🫧⚪✨','🫧⚪✨🐚','💎'] },
        { answer: 'Fish', steps: ['〰️','〰️>','〰️><','〰️><>','🐟'] },
        { answer: 'Star', steps: ['.','✦','✦⭐','⭐✨','🌟'] }
      ]).slice(0, diff === 'easy' ? 5 : diff === 'hard' ? 8 : 6);
      var idx = 0, sc = 0, step = 0;
      var revealSpeed = diff === 'easy' ? 2500 : diff === 'hard' ? 1200 : 1800;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gtext-sm gmb" style="opacity:0.5;font-family:Orbitron" id="dgRound">Round 1/' + items.length + '</div>' +
        '<div class="gtext gmb" id="dgStatus" style="font-size:1rem">✏️ Rashid is drawing something...</div>' +
        /* Artistic canvas with decorative border */
        '<div style="position:relative;width:240px;height:180px;margin-bottom:12px">' +
        '<div style="position:absolute;inset:-4px;border-radius:22px;background:linear-gradient(135deg,rgba(255,215,0,0.3),rgba(0,201,167,0.2),rgba(155,89,182,0.2));opacity:0.5;filter:blur(2px)"></div>' +
        '<div id="dgCanvas" style="position:relative;width:100%;height:100%;background:linear-gradient(145deg,rgba(15,15,25,0.95),rgba(20,20,35,0.95));border:2.5px solid rgba(255,215,0,0.25);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:3rem;white-space:pre-line;transition:all 0.4s;box-shadow:inset 0 0 40px rgba(255,215,0,0.03),0 8px 30px rgba(0,0,0,0.3);overflow:hidden">' +
        '<div style="position:absolute;top:6px;left:10px;font-size:0.55rem;color:rgba(255,215,0,0.25);font-weight:600">RASHID\'S CANVAS</div>' +
        '<div style="position:absolute;bottom:6px;right:8px;font-size:0.55rem;color:rgba(255,255,255,0.15)">✏️ Drawing...</div>' +
        '</div></div>' +
        /* Step progress dots */
        '<div style="display:flex;gap:6px;margin-bottom:14px" id="dgStepDots"></div>' +
        '<div class="gtext gtext-sm" id="dgHint" style="color:rgba(255,215,0,0.6);min-height:20px;margin-bottom:10px">Watch the drawing unfold...</div>' +
        /* 2x2 choice grid */
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;max-width:320px" id="dgChoices"></div>' +
        /* Score dots */
        '<div style="display:flex;align-items:center;gap:6px;margin-top:14px">' +
        '<div style="display:flex;gap:4px" id="dgDots"></div>' +
        '<div class="gtext gtext-sm" style="font-family:Orbitron;color:#FFD700" id="dgScore">0/' + items.length + '</div>' +
        '</div>';
      container.appendChild(div);
      var self = this;

      // Build score dots
      var dotsDiv = div.querySelector('#dgDots');
      for (var d = 0; d < items.length; d++) {
        var dotEl = document.createElement('div');
        dotEl.style.cssText = 'width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,215,0,0.15);transition:all 0.3s';
        dotEl.setAttribute('data-dot', d);
        dotsDiv.appendChild(dotEl);
      }

      function getDistractors(answer) {
        var pool = allAnswers.filter(function(a) { return a !== answer; });
        return shuffle(pool).slice(0, 3);
      }

      function buildStepDots(totalSteps) {
        var sdDiv = div.querySelector('#dgStepDots');
        sdDiv.innerHTML = '';
        for (var s = 0; s < totalSteps; s++) {
          var sd = document.createElement('div');
          sd.style.cssText = 'width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,215,0,0.15);transition:all 0.3s';
          sd.setAttribute('data-step', s);
          sdDiv.appendChild(sd);
        }
        // Highlight first
        var first = sdDiv.querySelector('[data-step="0"]');
        if (first) { first.style.background = '#FFD700'; first.style.borderColor = '#FFD700'; }
      }

      function show() {
        step = 0;
        var canvas = div.querySelector('#dgCanvas');
        // Clear extra children but keep the position markers
        var existing = canvas.querySelectorAll('.dgContent');
        existing.forEach(function(el) { el.remove(); });
        var contentEl = document.createElement('div');
        contentEl.className = 'dgContent';
        contentEl.style.cssText = 'transition:transform 0.3s,opacity 0.3s;transform:scale(0.8);opacity:0';
        contentEl.textContent = items[idx].steps[0];
        canvas.appendChild(contentEl);
        setTimeout(function() { contentEl.style.transform = 'scale(1)'; contentEl.style.opacity = '1'; }, 50);

        canvas.style.borderColor = 'rgba(255,215,0,0.25)'; canvas.style.boxShadow = 'inset 0 0 40px rgba(255,215,0,0.03),0 8px 30px rgba(0,0,0,0.3)';
        div.querySelector('#dgRound').textContent = 'Round ' + (idx+1) + '/' + items.length;
        div.querySelector('#dgStatus').textContent = '✏️ Rashid is drawing something...';
        div.querySelector('#dgHint').textContent = 'Watch the drawing unfold...';
        div.querySelector('#dgHint').style.color = 'rgba(255,215,0,0.6)';
        buildStepDots(items[idx].steps.length);

        // Build 2x2 choice buttons
        var choices = shuffle([items[idx].answer].concat(getDistractors(items[idx].answer)));
        var choicesDiv = div.querySelector('#dgChoices'); choicesDiv.innerHTML = '';
        var choiceEmojis = ['A','B','C','D'];
        var choiceColors = ['#FF6B35','#FFD700','#00C9A7','#9b59b6'];
        choices.forEach(function(c, ci) {
          var btn = document.createElement('button');
          btn.style.cssText = 'padding:14px 10px;border-radius:14px;background:rgba(255,255,255,0.04);border:2px solid rgba(255,215,0,0.15);color:#fff;cursor:pointer;transition:all 0.25s;font-size:0.95rem;font-weight:600;display:flex;align-items:center;gap:8px;justify-content:center;font-family:Inter,sans-serif';
          btn.innerHTML = '<span style="display:inline-flex;width:24px;height:24px;border-radius:7px;background:' + choiceColors[ci] + '20;color:' + choiceColors[ci] + ';align-items:center;justify-content:center;font-weight:800;font-size:0.75rem;flex-shrink:0">' + choiceEmojis[ci] + '</span><span>' + c + '</span>';
          btn.setAttribute('data-answer', c);
          btn.onmouseenter = function() { if (!btn.disabled) { btn.style.borderColor = choiceColors[ci]; btn.style.background = choiceColors[ci] + '15'; btn.style.transform = 'scale(1.03)'; } };
          btn.onmouseleave = function() { if (!btn.disabled) { btn.style.borderColor = 'rgba(255,215,0,0.15)'; btn.style.background = 'rgba(255,255,255,0.04)'; btn.style.transform = 'scale(1)'; } };
          btn.onclick = function() {
            if (btn.disabled) return;
            choicesDiv.querySelectorAll('button').forEach(function(b) { b.disabled = true; b.style.opacity = '0.4'; b.style.transform = 'scale(1)'; });
            var isCorrect = c === items[idx].answer;
            var dots = dotsDiv.querySelectorAll('[data-dot]');
            if (isCorrect) {
              sc++; E.addScore(1);
              btn.style.opacity = '1'; btn.style.background = 'rgba(0,201,167,0.25)'; btn.style.borderColor = '#00C9A7'; btn.style.boxShadow = '0 0 15px rgba(0,201,167,0.3)';
              canvas.style.borderColor = '#00C9A7'; canvas.style.boxShadow = 'inset 0 0 40px rgba(0,201,167,0.06),0 0 25px rgba(0,201,167,0.2)';
              E.rashidSay('You guessed it! ✏️ It\'s a ' + items[idx].answer + '!');
              div.querySelector('#dgHint').textContent = '✅ Correct! It\'s a ' + items[idx].answer + '!';
              div.querySelector('#dgHint').style.color = '#00C9A7';
              if (dots[idx]) { dots[idx].style.background = '#00C9A7'; dots[idx].style.borderColor = '#00C9A7'; }
            } else {
              btn.style.opacity = '1'; btn.style.background = 'rgba(255,50,50,0.25)'; btn.style.borderColor = '#ff6b6b';
              btn.style.animation = 'cellShake 0.4s ease';
              choicesDiv.querySelectorAll('button').forEach(function(b) {
                if (b.getAttribute('data-answer') === items[idx].answer) { b.style.opacity = '1'; b.style.background = 'rgba(0,201,167,0.25)'; b.style.borderColor = '#00C9A7'; }
              });
              canvas.style.borderColor = '#ff6b6b'; canvas.style.boxShadow = 'inset 0 0 40px rgba(255,50,50,0.06),0 0 25px rgba(255,50,50,0.2)';
              E.rashidSay('Nope! It was a ' + items[idx].answer + '!');
              div.querySelector('#dgHint').textContent = '❌ It was a ' + items[idx].answer + '!';
              div.querySelector('#dgHint').style.color = '#ff6b6b';
              if (dots[idx]) { dots[idx].style.background = '#ff6b6b'; dots[idx].style.borderColor = '#ff6b6b'; }
            }
            if (self._tv) clearInterval(self._tv);
            // Reveal animation - show final emoji with scale
            var finalContent = canvas.querySelector('.dgContent');
            if (finalContent) {
              finalContent.style.transform = 'scale(0.5)'; finalContent.style.opacity = '0';
              setTimeout(function() {
                finalContent.textContent = items[idx].steps[items[idx].steps.length - 1];
                finalContent.style.fontSize = '3.5rem';
                finalContent.style.transform = 'scale(1)'; finalContent.style.opacity = '1';
              }, 200);
            }
            div.querySelector('#dgScore').textContent = sc + '/' + items.length;
            idx++;
            setTimeout(function() {
              if (idx >= items.length) E.endGame(sc, items.length);
              else show();
            }, 1400);
          };
          choicesDiv.appendChild(btn);
        });

        // Progressively reveal with step dot updates
        self._tv = setInterval(function() {
          step++;
          if (step >= items[idx].steps.length) { clearInterval(self._tv); return; }
          var contentEl2 = canvas.querySelector('.dgContent');
          if (contentEl2) {
            contentEl2.style.transform = 'scale(0.8)'; contentEl2.style.opacity = '0.5';
            setTimeout(function() {
              contentEl2.textContent = items[idx].steps[step];
              contentEl2.style.transform = 'scale(1)'; contentEl2.style.opacity = '1';
            }, 150);
          }
          // Update step dot
          var sdDiv = div.querySelector('#dgStepDots');
          var stepDot = sdDiv.querySelector('[data-step="' + step + '"]');
          if (stepDot) { stepDot.style.background = '#FFD700'; stepDot.style.borderColor = '#FFD700'; stepDot.style.boxShadow = '0 0 6px rgba(255,215,0,0.4)'; }
        }, revealSpeed);
      }

      show();
      return {};
    }, destroy: function() { if (this._tv) clearInterval(this._tv); }
  });

  /* ── 49. Dice Adventure ── */
  E.register({
    id: 'dice-roll', name: 'Dice Adventure', emoji: '🎲', category: 'fun', has2P: true,
    init: function (container, mode, diff) {
      var boardSize = diff === 'easy' ? 15 : diff === 'hard' ? 30 : 20;
      var triviaQ = shuffle([
        { q: 'Capital of UAE?', a: 'Abu Dhabi', opts: ['Abu Dhabi','Dubai','Sharjah','Ajman'] },
        { q: 'UAE national bird?', a: 'Falcon', opts: ['Eagle','Falcon','Hawk','Parrot'] },
        { q: 'Tallest building?', a: 'Burj Khalifa', opts: ['Burj Khalifa','Burj Al Arab','CN Tower','Eiffel Tower'] },
        { q: 'UAE currency?', a: 'Dirham', opts: ['Dirham','Riyal','Dollar','Pound'] },
        { q: 'Traditional boat?', a: 'Dhow', opts: ['Dhow','Kayak','Canoe','Yacht'] },
        { q: 'How many emirates?', a: '7', opts: ['5','6','7','8'] },
        { q: 'Famous Abu Dhabi mosque?', a: 'Sheikh Zayed', opts: ['Blue Mosque','Sheikh Zayed','Al Aqsa','Grand Mosque'] },
        { q: 'Sweet desert fruit?', a: 'Dates', opts: ['Dates','Figs','Grapes','Mangoes'] },
        { q: 'Year UAE founded?', a: '1971', opts: ['1965','1971','1975','1980'] },
        { q: 'Traditional marketplace?', a: 'Souk', opts: ['Souk','Bazaar','Mall','Market'] }
      ]);
      var boardColors = ['rgba(255,215,0,0.06)','rgba(0,201,167,0.06)','rgba(155,89,182,0.06)','rgba(255,107,53,0.06)','rgba(78,205,196,0.06)'];
      var triviaSquareColor = 'rgba(155,89,182,0.15)';
      var pos1 = 0, pos2 = 0, turn = 1, qIdx = 0, rolling = false;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gmb" id="daStatus" style="font-size:1.05rem;font-weight:700">' +
        '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#FFD700;margin-right:6px;box-shadow:0 0 6px rgba(255,215,0,0.4)"></span>' +
        (turn===1?'P1':'P2') + '\'s turn!</div>' +
        /* Progress bar to finish */
        '<div style="width:100%;max-width:400px;margin-bottom:10px">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:3px">' +
        '<span style="font-size:0.6rem;color:#FFD700;font-weight:700">🟡 P1</span>' +
        '<span style="font-size:0.6rem;color:#00C9A7;font-weight:700">🟢 ' + (mode==='2p'?'P2':'Rashid') + '</span></div>' +
        '<div style="width:100%;height:6px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;position:relative">' +
        '<div id="daBar1" style="position:absolute;height:100%;width:0%;background:linear-gradient(90deg,#FFD700,#FF6B35);border-radius:4px;transition:width 0.5s;z-index:2"></div>' +
        '<div id="daBar2" style="position:absolute;height:100%;width:0%;background:linear-gradient(90deg,#00C9A7,#4ecdc4);border-radius:4px;transition:width 0.5s;opacity:0.7"></div>' +
        '</div></div>' +
        /* Board */
        '<div style="display:flex;gap:4px;flex-wrap:wrap;max-width:400px;margin:0 auto 14px;padding:12px;background:rgba(255,255,255,0.02);border-radius:14px;border:1px solid rgba(255,215,0,0.08)" id="daBoard"></div>' +
        /* Dice area */
        '<div style="display:flex;align-items:center;gap:16px;margin-bottom:10px">' +
        '<div id="daDice" style="width:70px;height:70px;border-radius:14px;background:linear-gradient(145deg,rgba(255,215,0,0.1),rgba(255,215,0,0.04));border:2px solid rgba(255,215,0,0.2);display:flex;align-items:center;justify-content:center;font-size:2.4rem;transition:all 0.15s;box-shadow:0 4px 15px rgba(0,0,0,0.2)">🎲</div>' +
        '<button class="gbtn gbtn-gold" id="daRoll" style="padding:14px 28px;font-size:1.05rem;border-radius:14px">Roll! 🎲</button>' +
        '</div>' +
        '<div class="gtext gtext-sm" id="daInfo" style="font-family:Orbitron;opacity:0.7">P1: 0 | ' + (mode==='2p'?'P2':'Rashid') + ': 0</div>' +
        /* Trivia popup card */
        '<div style="display:none;width:100%;max-width:340px;padding:20px;background:linear-gradient(145deg,rgba(20,20,40,0.98),rgba(15,15,30,0.98));border:2px solid rgba(155,89,182,0.4);border-radius:18px;box-shadow:0 12px 40px rgba(155,89,182,0.2);margin-top:10px;animation:popIn 0.3s ease" id="daTrivia">' +
        '<div style="text-align:center;font-size:0.65rem;color:rgba(155,89,182,0.7);font-weight:700;margin-bottom:8px;letter-spacing:1px">TRIVIA CHALLENGE</div>' +
        '<div class="gtext gmb" id="daTriviaQ" style="font-size:1.05rem;font-weight:600"></div>' +
        '<div class="gflex-col" id="daTriviaOpts" style="gap:8px;width:100%"></div>' +
        '<div style="text-align:center;margin-top:8px;font-size:0.7rem;color:rgba(0,201,167,0.6)">Correct = +2 bonus squares!</div>' +
        '</div>';
      container.appendChild(div);

      // Render board
      var boardDiv = div.querySelector('#daBoard');
      for (var i = 0; i < boardSize; i++) {
        var cell = document.createElement('div');
        var isTrivia = (i + 1) % 3 === 0 && i > 0;
        var isFinish = i === boardSize - 1;
        var bgColor = isFinish ? 'rgba(255,215,0,0.15)' : isTrivia ? triviaSquareColor : boardColors[i % boardColors.length];
        var borderColor = isFinish ? 'rgba(255,215,0,0.4)' : isTrivia ? 'rgba(155,89,182,0.3)' : 'rgba(255,215,0,0.1)';
        cell.style.cssText = 'width:36px;height:36px;border-radius:8px;border:1.5px solid ' + borderColor + ';display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:rgba(255,255,255,0.5);position:relative;background:' + bgColor + ';transition:all 0.3s;font-weight:600';
        cell.textContent = isFinish ? '🏁' : isTrivia ? '🧠' : (i + 1);
        cell.setAttribute('data-pos', i);
        boardDiv.appendChild(cell);
      }

      function renderBoard() {
        boardDiv.querySelectorAll('[data-pos]').forEach(function(cell) {
          var p = parseInt(cell.getAttribute('data-pos'));
          var isTrivia = (p + 1) % 3 === 0 && p > 0;
          var isFinish = p === boardSize - 1;
          var hasP1 = p === pos1;
          var hasP2 = p === pos2;
          // Reset
          cell.style.boxShadow = 'none'; cell.style.transform = 'scale(1)';
          var content = isFinish ? '🏁' : isTrivia ? '🧠' : (p + 1);
          if (hasP1 && hasP2) {
            cell.innerHTML = '<span style="font-size:0.7rem">🟡🟢</span>';
            cell.style.boxShadow = '0 0 10px rgba(255,215,0,0.3)'; cell.style.transform = 'scale(1.1)';
          } else if (hasP1) {
            cell.innerHTML = '<span style="font-size:1rem">🟡</span>';
            cell.style.boxShadow = '0 0 10px rgba(255,215,0,0.3)'; cell.style.transform = 'scale(1.1)';
          } else if (hasP2) {
            cell.innerHTML = '<span style="font-size:1rem">🟢</span>';
            cell.style.boxShadow = '0 0 10px rgba(0,201,167,0.3)'; cell.style.transform = 'scale(1.1)';
          } else {
            cell.textContent = content;
          }
        });
        div.querySelector('#daInfo').textContent = 'P1: ' + pos1 + ' | ' + (mode==='2p'?'P2':'Rashid') + ': ' + pos2;
        // Update progress bars
        div.querySelector('#daBar1').style.width = (pos1 / (boardSize - 1) * 100) + '%';
        div.querySelector('#daBar2').style.width = (pos2 / (boardSize - 1) * 100) + '%';
      }

      function animateDice(finalRoll, cb) {
        rolling = true;
        var diceEl = div.querySelector('#daDice');
        var faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
        var count = 0, maxCount = 8;
        var iv = setInterval(function() {
          var r = Math.floor(Math.random() * 6);
          diceEl.textContent = faces[r];
          diceEl.style.transform = 'rotate(' + (count * 45) + 'deg) scale(1.1)';
          count++;
          if (count >= maxCount) {
            clearInterval(iv);
            diceEl.textContent = faces[finalRoll - 1];
            diceEl.style.transform = 'rotate(0deg) scale(1.2)';
            setTimeout(function() { diceEl.style.transform = 'scale(1)'; rolling = false; cb(); }, 200);
          }
        }, 80);
      }

      function updateTurnIndicator() {
        var color = turn === 1 ? '#FFD700' : '#00C9A7';
        var name = turn === 1 ? 'P1' : (mode==='2p'?'P2':'Rashid');
        div.querySelector('#daStatus').innerHTML = '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + color + ';margin-right:6px;box-shadow:0 0 6px ' + color + '60"></span>' + name + '\'s turn!';
      }

      function showTrivia(cb) {
        var q = triviaQ[qIdx % triviaQ.length]; qIdx++;
        var triviaDiv = div.querySelector('#daTrivia');
        triviaDiv.style.display = 'block';
        div.querySelector('#daTriviaQ').textContent = '🧠 ' + q.q;
        div.querySelector('#daRoll').disabled = true;
        var optsDiv = div.querySelector('#daTriviaOpts'); optsDiv.innerHTML = '';
        shuffle(q.opts).forEach(function(o) {
          var btn = document.createElement('button');
          btn.style.cssText = 'width:100%;padding:12px;border-radius:12px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(155,89,182,0.25);color:#fff;cursor:pointer;transition:all 0.2s;font-size:0.9rem;font-weight:600;font-family:Inter,sans-serif';
          btn.textContent = o;
          btn.onmouseenter = function() { btn.style.borderColor = 'rgba(155,89,182,0.6)'; btn.style.background = 'rgba(155,89,182,0.1)'; };
          btn.onmouseleave = function() { btn.style.borderColor = 'rgba(155,89,182,0.25)'; btn.style.background = 'rgba(255,255,255,0.04)'; };
          btn.onclick = function() {
            optsDiv.querySelectorAll('button').forEach(function(b) { b.disabled = true; b.style.opacity = '0.4'; });
            var correct = o.toLowerCase().indexOf(q.a.toLowerCase()) > -1;
            if (correct) {
              btn.style.opacity = '1'; btn.style.background = 'rgba(0,201,167,0.2)'; btn.style.borderColor = '#00C9A7';
            } else {
              btn.style.opacity = '1'; btn.style.background = 'rgba(255,50,50,0.2)'; btn.style.borderColor = '#ff6b6b';
            }
            setTimeout(function() {
              triviaDiv.style.display = 'none';
              div.querySelector('#daRoll').disabled = false;
              if (correct) { E.rashidSay('Correct! +2 bonus! 🎯'); cb(2); }
              else { E.rashidSay('Wrong! Answer: ' + q.a); cb(0); }
            }, 600);
          };
          optsDiv.appendChild(btn);
        });
      }

      div.querySelector('#daRoll').onclick = function() {
        if (rolling) return;
        var roll = 1 + Math.floor(Math.random() * 6);
        animateDice(roll, function() {
          if (turn === 1) {
            pos1 = Math.min(boardSize - 1, pos1 + roll);
            renderBoard();
            if (pos1 >= boardSize - 1) { E.rashidSay('P1 wins! 🏆'); E.endGame(1, 1); return; }
            if (pos1 % 3 === 0 && pos1 > 0) {
              showTrivia(function(bonus) { pos1 = Math.min(boardSize - 1, pos1 + bonus); renderBoard();
                if (pos1 >= boardSize - 1) { E.rashidSay('P1 wins! 🏆'); E.endGame(1, 1); return; }
                turn = 2; updateTurnIndicator();
                if (mode === '1p') setTimeout(aiTurn, 800);
              });
              return;
            }
            turn = 2; updateTurnIndicator();
            if (mode === '1p') setTimeout(aiTurn, 800);
          } else if (mode === '2p') {
            pos2 = Math.min(boardSize - 1, pos2 + roll); renderBoard();
            if (pos2 >= boardSize - 1) { E.rashidSay('P2 wins! 🏆'); E.endGame(0, 1); return; }
            turn = 1; updateTurnIndicator();
          }
        });
      };

      function aiTurn() {
        var roll = 1 + Math.floor(Math.random() * 6);
        animateDice(roll, function() {
          pos2 = Math.min(boardSize - 1, pos2 + roll);
          if (pos2 % 3 === 0 && pos2 > 0 && Math.random() < 0.5) pos2 = Math.min(boardSize - 1, pos2 + 1);
          renderBoard();
          if (pos2 >= boardSize - 1) { E.rashidSay('Rashid wins! 🐫'); E.endGame(0, 1); return; }
          turn = 1; updateTurnIndicator();
        });
      }

      renderBoard();
      return {};
    }, destroy: function() {}
  });

  /* ── 50. Lucky Wheel ── */
  E.register({
    id: 'lucky-wheel', name: 'Lucky Wheel', emoji: '🎡', category: 'fun', has2P: false,
    init: function (container, mode, diff) {
      var prizes = [
        { label: '+50 XP', emoji: '⭐', action: function() { if(window.Progression) Progression.addXP(50); return 'Won 50 XP!'; } },
        { label: '+20 XP', emoji: '✨', action: function() { if(window.Progression) Progression.addXP(20); return 'Won 20 XP!'; } },
        { label: 'Fun Fact', emoji: '🧠', action: function() { return pick(['The UAE has 0 rivers!','Dubai police use supercars!','The UAE has its own space program!','Burj Khalifa took 6 years to build!']); } },
        { label: '+100 XP', emoji: '💎', action: function() { if(window.Progression) Progression.addXP(100); return 'JACKPOT! 100 XP!'; } },
        { label: 'Joke', emoji: '😂', action: function() { return pick(['Why did the camel cross the road? To get to the other dune!','What do you call a lazy falcon? A sit-con!']); } },
        { label: '+10 XP', emoji: '🪙', action: function() { if(window.Progression) Progression.addXP(10); return 'Won 10 XP!'; } },
        { label: 'Challenge', emoji: '🏆', action: function() { return 'Challenge: Name 3 emirates in 5 seconds! Go!'; } },
        { label: 'Bonus Spin', emoji: '🎡', action: function() { return 'Bonus spin!'; } }
      ];
      var spinsLeft = diff === 'easy' ? 5 : diff === 'hard' ? 2 : 3;
      var spinning = false, sc = 0;
      var CW = 300, CH = 300;

      container.style.flexDirection = 'column'; container.style.display = 'flex'; container.style.alignItems = 'center';

      // Wrapper for wheel with glow
      var wheelWrap = document.createElement('div');
      wheelWrap.style.cssText = 'position:relative;width:' + CW + 'px;height:' + (CH + 20) + 'px;display:flex;align-items:center;justify-content:center';

      // Glow behind wheel
      var glowEl = document.createElement('div');
      glowEl.style.cssText = 'position:absolute;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(255,215,0,0.12) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;transition:opacity 0.3s';
      glowEl.id = 'lwGlow';
      wheelWrap.appendChild(glowEl);

      // Pointer arrow (above canvas)
      var pointer = document.createElement('div');
      pointer.style.cssText = 'position:absolute;top:0;left:50%;transform:translateX(-50%);z-index:10;font-size:1.6rem;filter:drop-shadow(0 2px 6px rgba(255,215,0,0.5));transition:transform 0.1s';
      pointer.id = 'lwPointer';
      pointer.textContent = '🔻';
      wheelWrap.appendChild(pointer);

      var canvas = E.makeCanvas(CW, CH);
      canvas.style.borderRadius = '50%';
      canvas.style.boxShadow = '0 0 30px rgba(255,215,0,0.1),0 8px 30px rgba(0,0,0,0.3)';
      wheelWrap.appendChild(canvas);
      container.appendChild(wheelWrap);

      var ctx = canvas.getContext('2d');
      var angle = 0, velocity = 0;
      var colors = ['#FF6B35','#FFD700','#00C9A7','#4ecdc4','#ff6b6b','#9b59b6','#3498db','#e74c3c'];
      var darkColors = ['#cc5629','#ccac00','#009a7a','#3db0a8','#cc5555','#7c4799','#2a7ab0','#b83c32'];

      function draw() {
        ctx.clearRect(0, 0, CW, CH);
        // Dark bg circle
        ctx.fillStyle = '#0a0a12'; ctx.beginPath(); ctx.arc(CW/2, CH/2, 150, 0, Math.PI*2); ctx.fill();
        // Outer ring
        ctx.strokeStyle = 'rgba(255,215,0,0.3)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(CW/2, CH/2, 132, 0, Math.PI*2); ctx.stroke();

        var sliceAngle = (Math.PI * 2) / prizes.length;
        prizes.forEach(function(p, i) {
          // Main slice
          ctx.beginPath(); ctx.moveTo(CW/2, CH/2);
          ctx.arc(CW/2, CH/2, 130, angle + i * sliceAngle, angle + (i+1) * sliceAngle);
          ctx.closePath();
          // Gradient per slice
          var grad = ctx.createRadialGradient(CW/2, CH/2, 20, CW/2, CH/2, 130);
          grad.addColorStop(0, darkColors[i]); grad.addColorStop(1, colors[i]);
          ctx.fillStyle = grad; ctx.fill();
          // Slice borders
          ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.5; ctx.stroke();

          // Label - emoji + text
          ctx.save(); ctx.translate(CW/2, CH/2);
          ctx.rotate(angle + (i + 0.5) * sliceAngle);
          // Emoji
          ctx.font = 'bold 16px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = '#fff';
          ctx.fillText(p.emoji, 85, -4);
          // Text label
          ctx.font = 'bold 9px Inter,sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.fillText(p.label, 85, 10);
          ctx.restore();
        });

        // Inner decorative ring
        ctx.strokeStyle = 'rgba(255,215,0,0.2)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(CW/2, CH/2, 40, 0, Math.PI*2); ctx.stroke();

        // Center hub
        var centerGrad = ctx.createRadialGradient(CW/2, CH/2, 0, CW/2, CH/2, 24);
        centerGrad.addColorStop(0, '#FFD700'); centerGrad.addColorStop(1, '#FF6B35');
        ctx.fillStyle = centerGrad; ctx.beginPath(); ctx.arc(CW/2, CH/2, 22, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(CW/2, CH/2, 22, 0, Math.PI*2); ctx.stroke();
        ctx.fillStyle = '#000'; ctx.font = 'bold 16px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🎡', CW/2, CH/2);

        // Tick marks on outer ring
        for (var t = 0; t < prizes.length * 3; t++) {
          var ta = (t / (prizes.length * 3)) * Math.PI * 2;
          ctx.save(); ctx.translate(CW/2, CH/2);
          ctx.rotate(ta);
          ctx.fillStyle = t % 3 === 0 ? 'rgba(255,215,0,0.6)' : 'rgba(255,255,255,0.2)';
          ctx.fillRect(125, -1, t % 3 === 0 ? 8 : 5, 2);
          ctx.restore();
        }
      }

      // Spins info
      var info = document.createElement('div');
      info.style.cssText = 'margin-top:12px;font-family:Orbitron,sans-serif;font-size:0.85rem;color:#fff;text-align:center';
      info.id = 'lwInfo';
      info.innerHTML = 'Spins left: <span style="color:#FFD700;font-weight:800">' + spinsLeft + '</span>';
      container.appendChild(info);

      // Spin button
      var btn = document.createElement('button');
      btn.className = 'gbtn gbtn-gold';
      btn.style.cssText = 'margin-top:10px;padding:16px 40px;font-size:1.15rem;border-radius:16px;letter-spacing:1px';
      btn.textContent = 'SPIN! 🎡';
      btn.id = 'lwSpin';
      container.appendChild(btn);

      // Prize reveal card
      var resultCard = document.createElement('div');
      resultCard.id = 'lwResult';
      resultCard.style.cssText = 'margin-top:14px;padding:16px 24px;background:linear-gradient(145deg,rgba(20,20,40,0.95),rgba(15,15,30,0.95));border:2px solid rgba(255,215,0,0.2);border-radius:16px;text-align:center;min-width:250px;opacity:0;transform:scale(0.9);transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 8px 30px rgba(0,0,0,0.3)';
      resultCard.innerHTML = '<div id="lwResultEmoji" style="font-size:2rem;margin-bottom:4px"></div><div id="lwResultText" class="gtext" style="font-weight:700;font-size:1rem"></div>';
      container.appendChild(resultCard);

      function showPrizeReveal(emoji, msg) {
        resultCard.querySelector('#lwResultEmoji').textContent = emoji;
        resultCard.querySelector('#lwResultText').textContent = msg;
        resultCard.style.opacity = '1'; resultCard.style.transform = 'scale(1)';
        resultCard.style.borderColor = 'rgba(255,215,0,0.5)';
        resultCard.style.boxShadow = '0 8px 30px rgba(255,215,0,0.15),0 0 40px rgba(255,215,0,0.05)';
        // Mini confetti
        for (var c = 0; c < 8; c++) {
          var conf = document.createElement('div');
          conf.className = 'gconfetti';
          conf.style.left = (30 + Math.random() * 40) + '%';
          conf.style.background = pick(['#FFD700','#FF6B35','#00C9A7','#9b59b6','#ff6b6b']);
          conf.style.animationDuration = (1.5 + Math.random()) + 's';
          document.body.appendChild(conf);
          setTimeout(function(el) { return function() { if (el.parentNode) el.parentNode.removeChild(el); }; }(conf), 2500);
        }
      }

      function spin() {
        if (spinning || spinsLeft <= 0) return;
        spinning = true; spinsLeft--;
        info.innerHTML = 'Spins left: <span style="color:#FFD700;font-weight:800">' + spinsLeft + '</span>';
        resultCard.style.opacity = '0'; resultCard.style.transform = 'scale(0.9)';
        velocity = 15 + Math.random() * 10;
        // Glow intensifies
        glowEl.style.background = 'radial-gradient(circle,rgba(255,215,0,0.25) 0%,transparent 70%)';
        // Button animation
        btn.style.transform = 'scale(0.95)'; btn.style.opacity = '0.6';

        var pointerEl = document.getElementById('lwPointer');
        function animate() {
          angle += velocity * 0.01;
          velocity *= 0.985;
          draw();
          // Pointer wobble when fast
          if (velocity > 5 && pointerEl) {
            pointerEl.style.transform = 'translateX(-50%) rotate(' + (Math.sin(angle * 10) * 8) + 'deg)';
          } else if (pointerEl) {
            pointerEl.style.transform = 'translateX(-50%) rotate(0deg)';
          }
          if (velocity > 0.5) { requestAnimationFrame(animate); }
          else {
            spinning = false;
            glowEl.style.background = 'radial-gradient(circle,rgba(255,215,0,0.12) 0%,transparent 70%)';
            btn.style.transform = 'scale(1)'; btn.style.opacity = '1';
            // Determine prize
            var sliceAngle = (Math.PI * 2) / prizes.length;
            var normalized = ((2 * Math.PI - (angle % (2 * Math.PI))) + Math.PI / 2) % (2 * Math.PI);
            var prizeIdx = Math.floor(normalized / sliceAngle) % prizes.length;
            var prize = prizes[prizeIdx];
            var msg = prize.action();
            showPrizeReveal(prize.emoji, msg);
            E.rashidSay(msg);
            sc++;
            if (prize.label === 'Bonus Spin') { spinsLeft++; info.innerHTML = 'Spins left: <span style="color:#FFD700;font-weight:800">' + spinsLeft + '</span> (BONUS!)'; }
            else { info.innerHTML = 'Spins left: <span style="color:#FFD700;font-weight:800">' + spinsLeft + '</span>'; }
            if (spinsLeft <= 0) { btn.disabled = true; btn.style.opacity = '0.4'; setTimeout(function() { E.endGame(sc, sc); }, 2000); }
          }
        }
        animate();
      }

      btn.onclick = spin;
      draw();
      return {};
    }, destroy: function() {}
  });

})();
