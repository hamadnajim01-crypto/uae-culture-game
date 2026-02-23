/* ===== BOARD & STRATEGY GAMES (10) — DOM-based, difficulty-aware ===== */
/* Rewritten with enhanced visuals, animations, and polish */
(function () {
  var E = window.GamesEngine;
  var shuffle = E.shuffle, pick = E.pick, clamp = E.clamp;

  /* ── Shared style injection (once) ── */
  (function injectBoardStyles() {
    if (document.getElementById('board-games-styles')) return;
    var style = document.createElement('style');
    style.id = 'board-games-styles';
    style.textContent =
      '@keyframes bgShake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-4px)}20%,40%,60%,80%{transform:translateX(4px)}}' +
      '@keyframes bgGlow{0%{box-shadow:0 0 5px #00C9A7}50%{box-shadow:0 0 25px #00C9A7,0 0 50px rgba(0,201,167,0.3)}100%{box-shadow:0 0 5px #00C9A7}}' +
      '@keyframes bgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}' +
      '@keyframes bgPop{0%{transform:scale(0.3);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}' +
      '@keyframes bgFlipIn{0%{transform:rotateY(90deg)}100%{transform:rotateY(0deg)}}' +
      '@keyframes bgDrop{0%{transform:translateY(-200px);opacity:0}70%{transform:translateY(10px)}100%{transform:translateY(0);opacity:1}}' +
      '@keyframes bgRipple{0%{box-shadow:0 0 0 0 rgba(0,150,255,0.4)}100%{box-shadow:0 0 0 15px rgba(0,150,255,0)}}' +
      '@keyframes bgExplosion{0%{transform:scale(1)}30%{transform:scale(1.4)}100%{transform:scale(1)}}' +
      '@keyframes bgSparkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.15)}}' +
      '@keyframes bgSlide{0%{transform:translate(var(--sx),var(--sy))}100%{transform:translate(0,0)}}' +
      '@keyframes bgWinFlash{0%,100%{background:rgba(255,215,0,0.3)}50%{background:rgba(255,215,0,0.7)}}' +
      '@keyframes bgLightOn{0%{box-shadow:0 0 5px rgba(255,215,0,0.5)}100%{box-shadow:0 0 20px rgba(255,215,0,0.8),0 0 40px rgba(255,215,0,0.3)}}' +
      '@keyframes bgCelebrate{0%{transform:scale(1) rotate(0deg)}25%{transform:scale(1.1) rotate(-2deg)}50%{transform:scale(1.15) rotate(2deg)}75%{transform:scale(1.1) rotate(-1deg)}100%{transform:scale(1) rotate(0deg)}}' +
      '@keyframes bgRadar{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}' +
      '@keyframes bgFadeIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}' +
      '@keyframes bgNeonPulse{0%,100%{border-color:rgba(0,201,167,0.6);box-shadow:0 0 8px rgba(0,201,167,0.3)}50%{border-color:rgba(0,201,167,1);box-shadow:0 0 20px rgba(0,201,167,0.6)}}' +
      '@keyframes bgProgressFill{0%{width:100%}100%{width:0%}}' +
      '@keyframes bgSwing{0%,100%{transform:translateX(0)}50%{transform:translateX(var(--swing-dist,30px))}}' +
      '@keyframes bgCountDown{0%{transform:scale(1.5);opacity:1}100%{transform:scale(0.8);opacity:0.5}}' +
      '.bg-container{background:linear-gradient(145deg,rgba(15,15,30,0.95),rgba(10,10,25,0.98));border:1px solid rgba(255,215,0,0.15);border-radius:16px;padding:20px;box-shadow:0 8px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05)}' +
      '.bg-status{font-family:Inter,sans-serif;font-size:1rem;color:#e0e0e0;text-align:center;margin-bottom:12px;padding:8px 16px;background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid rgba(255,255,255,0.06)}' +
      '.bg-score{font-family:Orbitron,sans-serif;color:#FFD700;font-weight:700}' +
      '.bg-progress{width:100%;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;margin:8px 0;overflow:hidden}' +
      '.bg-progress-fill{height:100%;border-radius:3px;transition:width 0.4s ease}';
    document.head.appendChild(style);
  })();

  /* Helper: create styled game wrapper */
  function makeWrap() {
    var d = document.createElement('div');
    d.className = 'gflex-col bg-container';
    d.style.cssText = 'align-items:center;gap:6px;animation:bgFadeIn 0.4s ease';
    return d;
  }
  /* Helper: create status bar */
  function makeStatus(id, html) {
    return '<div class="bg-status" id="' + id + '">' + html + '</div>';
  }
  /* Helper: create progress bar */
  function makeProgress(id, color) {
    return '<div class="bg-progress"><div class="bg-progress-fill" id="' + id + '" style="width:100%;background:' + (color || 'linear-gradient(90deg,#FFD700,#FF6B35)') + '"></div></div>';
  }
  /* Helper: flash effect on element */
  function flashCorrect(el) {
    el.style.animation = 'none'; el.offsetHeight;
    el.style.boxShadow = '0 0 20px rgba(0,201,167,0.8), inset 0 0 10px rgba(0,201,167,0.3)';
    el.style.animation = 'bgGlow 0.6s ease';
    setTimeout(function () { el.style.boxShadow = ''; }, 700);
  }
  function flashWrong(el) {
    el.style.animation = 'none'; el.offsetHeight;
    el.style.animation = 'bgShake 0.5s ease';
    el.style.boxShadow = '0 0 20px rgba(255,50,50,0.7)';
    setTimeout(function () { el.style.boxShadow = ''; el.style.animation = ''; }, 600);
  }

  /* ── 13. Tic-Tac-Toe ── */
  E.register({
    id: 'tic-tac-toe', name: 'Tic-Tac-Toe', emoji: '⭕', category: 'board', has2P: true,
    init: function (container, mode, diff) {
      var board = ['','','','','','','','',''], turn = 'p1', done = false;
      var div = makeWrap();
      var turnColors = { p1: '#FFD700', p2: '#00C9A7' };
      div.innerHTML = makeStatus('tttStatus', '<span style="color:' + turnColors.p1 + '">Your turn (🌙)</span>') +
        '<div class="gboard" style="grid-template-columns:repeat(3,90px);gap:6px;padding:10px;background:rgba(0,0,0,0.3);border-radius:14px;border:1px solid rgba(0,201,167,0.2)" id="tttGrid"></div>';
      container.appendChild(div);
      var grid = div.querySelector('#tttGrid');
      var cells = [];
      for (var i = 0; i < 9; i++) {
        var c = document.createElement('div');
        c.className = 'gcell';
        c.style.cssText = 'height:90px;width:90px;font-size:2.4rem;display:flex;align-items:center;justify-content:center;' +
          'background:linear-gradient(145deg,rgba(20,20,40,0.9),rgba(15,15,35,0.95));' +
          'border:2px solid rgba(0,201,167,0.25);border-radius:12px;cursor:pointer;transition:all 0.25s ease;' +
          'box-shadow:0 2px 8px rgba(0,0,0,0.3)';
        c.setAttribute('data-i', i);
        c.onmouseenter = function () { if (!done && board[parseInt(this.getAttribute('data-i'))] === '') { this.style.borderColor = 'rgba(0,201,167,0.7)'; this.style.boxShadow = '0 0 15px rgba(0,201,167,0.3)'; this.style.transform = 'scale(1.05)'; } };
        c.onmouseleave = function () { if (!this.classList.contains('ttt-win')) { this.style.borderColor = 'rgba(0,201,167,0.25)'; this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'; this.style.transform = 'scale(1)'; } };
        grid.appendChild(c); cells.push(c);
      }
      var wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      function check(mark) { return wins.some(function(w) { return board[w[0]]===mark && board[w[1]]===mark && board[w[2]]===mark; }); }
      function isFull() { return board.every(function(c) { return c !== ''; }); }
      function render() {
        cells.forEach(function(c, i) {
          c.textContent = board[i];
          if (board[i] === '🌙') { c.style.background = 'linear-gradient(145deg,rgba(255,215,0,0.15),rgba(255,215,0,0.05))'; c.style.borderColor = 'rgba(255,215,0,0.4)'; }
          else if (board[i] === '⭐') { c.style.background = 'linear-gradient(145deg,rgba(0,201,167,0.15),rgba(0,201,167,0.05))'; c.style.borderColor = 'rgba(0,201,167,0.4)'; }
        });
      }

      function minimax(b, isMax, depth) {
        if (check('⭐')) return 10 - depth;
        if (check('🌙')) return depth - 10;
        if (b.every(function(c) { return c !== ''; })) return 0;
        var best = isMax ? -100 : 100;
        for (var i = 0; i < 9; i++) {
          if (b[i] !== '') continue;
          b[i] = isMax ? '⭐' : '🌙';
          var val = minimax(b, !isMax, depth + 1);
          b[i] = '';
          best = isMax ? Math.max(best, val) : Math.min(best, val);
        }
        return best;
      }

      function aiMove() {
        var empty = []; board.forEach(function(c,i) { if (c==='') empty.push(i); });
        if (empty.length === 0) return;
        if (diff === 'easy') {
          var choice = empty[Math.floor(Math.random() * empty.length)];
          board[choice] = '⭐'; render(); cells[choice].style.animation = 'bgPop 0.4s ease'; afterMove('⭐');
          return;
        }
        if (diff === 'hard') {
          var bestScore = -100, bestIdx = empty[0];
          for (var i = 0; i < empty.length; i++) {
            board[empty[i]] = '⭐';
            var s = minimax(board, false, 0);
            board[empty[i]] = '';
            if (s > bestScore) { bestScore = s; bestIdx = empty[i]; }
          }
          board[bestIdx] = '⭐'; render(); cells[bestIdx].style.animation = 'bgPop 0.4s ease'; afterMove('⭐');
          return;
        }
        for (var i = 0; i < empty.length; i++) { board[empty[i]] = '⭐'; if (check('⭐')) { render(); cells[empty[i]].style.animation = 'bgPop 0.4s ease'; afterMove('⭐'); return; } board[empty[i]] = ''; }
        for (var j = 0; j < empty.length; j++) { board[empty[j]] = '🌙'; if (check('🌙')) { board[empty[j]] = '⭐'; render(); cells[empty[j]].style.animation = 'bgPop 0.4s ease'; afterMove('⭐'); return; } board[empty[j]] = ''; }
        var choice2 = empty.indexOf(4) > -1 ? 4 : empty[Math.floor(Math.random()*empty.length)];
        board[choice2] = '⭐'; render(); cells[choice2].style.animation = 'bgPop 0.4s ease'; afterMove('⭐');
      }

      function afterMove(mark) {
        if (check(mark)) {
          done = true;
          wins.forEach(function(w) {
            if (board[w[0]]===mark && board[w[1]]===mark && board[w[2]]===mark) {
              [w[0],w[1],w[2]].forEach(function(idx) {
                cells[idx].classList.add('ttt-win');
                cells[idx].style.animation = 'bgWinFlash 0.6s ease infinite';
                cells[idx].style.borderColor = '#FFD700';
                cells[idx].style.boxShadow = '0 0 25px rgba(255,215,0,0.6)';
                cells[idx].style.transform = 'scale(1.1)';
              });
            }
          });
          var winner = mark === '🌙' ? 'You win!' : (mode === '2p' ? 'Player 2 wins!' : 'Rashid wins!');
          div.querySelector('#tttStatus').innerHTML = '<span style="font-size:1.2rem;color:#FFD700">' + winner + ' 🎉</span>';
          div.querySelector('#tttStatus').style.animation = 'bgCelebrate 0.8s ease';
          E.rashidSay(mark === '🌙' ? 'Great move! 🎉' : 'I win! 😎');
          E.endGame(mark === '🌙' ? 1 : 0, 1); return;
        }
        if (isFull()) { done = true; div.querySelector('#tttStatus').innerHTML = '<span style="color:#FFD700">Draw! 🤝</span>'; E.rashidSay('Good game! 🤝'); E.endGame(0, 1); return; }
        turn = turn === 'p1' ? 'p2' : 'p1';
        var col = turn === 'p1' ? turnColors.p1 : turnColors.p2;
        var txt = turn === 'p1' ? 'Your turn (🌙)' : (mode === '2p' ? 'Player 2 (⭐)' : 'Rashid thinking...');
        div.querySelector('#tttStatus').innerHTML = '<span style="color:' + col + '">' + txt + '</span>';
        if (turn === 'p2' && mode === '1p') setTimeout(aiMove, 500);
      }
      cells.forEach(function(c, idx) {
        c.onclick = function() {
          if (done || board[idx] !== '') return;
          if (turn === 'p1') { board[idx] = '🌙'; render(); cells[idx].style.animation = 'bgPop 0.4s ease'; afterMove('🌙'); }
          else if (mode === '2p') { board[idx] = '⭐'; render(); cells[idx].style.animation = 'bgPop 0.4s ease'; afterMove('⭐'); }
        };
      });
      render();
      return {};
    }, destroy: function() {}
  });

  /* ── 14. Connect Four ── */
  E.register({
    id: 'connect-four', name: 'Connect Four', emoji: '🔴', category: 'board', has2P: true,
    init: function (container, mode, diff) {
      var COLS = 7, ROWS = 6;
      var board = []; for (var i = 0; i < COLS; i++) { board[i] = []; for (var j = 0; j < ROWS; j++) board[i][j] = ''; }
      var turn = 'p1', done = false;
      var div = makeWrap();
      div.innerHTML = makeStatus('c4Status', '<span style="color:#ff4444">Your turn (🔴)</span>') +
        '<div class="gboard" style="grid-template-columns:repeat(' + COLS + ',52px);gap:4px;padding:14px;background:linear-gradient(180deg,rgba(0,0,80,0.4),rgba(0,0,60,0.6));border-radius:14px;border:2px solid rgba(0,100,200,0.3)" id="c4Grid"></div>';
      container.appendChild(div);
      var grid = div.querySelector('#c4Grid'); var cells = [];
      var hoverCol = -1;
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
        var cell = document.createElement('div');
        cell.className = 'gcell';
        cell.style.cssText = 'height:52px;width:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;' +
          'background:radial-gradient(circle at 35% 35%,rgba(30,30,60,0.9),rgba(10,10,30,0.95));' +
          'border:2px solid rgba(100,100,200,0.2);transition:all 0.2s ease;box-shadow:inset 0 2px 8px rgba(0,0,0,0.5)';
        cell.setAttribute('data-c', c); cell.setAttribute('data-r', r);
        cell.onmouseenter = function () {
          if (done) return;
          var col = parseInt(this.getAttribute('data-c'));
          if (hoverCol !== col) {
            hoverCol = col;
            for (var rr = 0; rr < ROWS; rr++) {
              if (board[col][rr] === '') cells[col][rr].style.borderColor = 'rgba(255,215,0,0.4)';
            }
          }
        };
        cell.onmouseleave = function () {
          var col = parseInt(this.getAttribute('data-c'));
          for (var rr = 0; rr < ROWS; rr++) {
            if (board[col][rr] === '') cells[col][rr].style.borderColor = 'rgba(100,100,200,0.2)';
          }
          hoverCol = -1;
        };
        grid.appendChild(cell); if (!cells[c]) cells[c] = []; cells[c][r] = cell;
      }
      function render() {
        for (var c = 0; c < COLS; c++) for (var r = 0; r < ROWS; r++) {
          var cl = cells[c][r];
          cl.textContent = board[c][r];
          if (board[c][r] === '🔴') {
            cl.style.background = 'radial-gradient(circle at 35% 35%,#ff6666,#cc0000,#880000)';
            cl.style.borderColor = 'rgba(255,50,50,0.6)';
            cl.style.boxShadow = '0 0 10px rgba(255,0,0,0.3),inset 0 2px 4px rgba(255,255,255,0.2)';
          } else if (board[c][r] === '🟡') {
            cl.style.background = 'radial-gradient(circle at 35% 35%,#ffee55,#ffcc00,#cc9900)';
            cl.style.borderColor = 'rgba(255,215,0,0.6)';
            cl.style.boxShadow = '0 0 10px rgba(255,215,0,0.3),inset 0 2px 4px rgba(255,255,255,0.2)';
          } else {
            cl.style.background = 'radial-gradient(circle at 35% 35%,rgba(30,30,60,0.9),rgba(10,10,30,0.95))';
            cl.style.borderColor = 'rgba(100,100,200,0.2)';
            cl.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.5)';
          }
        }
      }
      function drop(col) { for (var r = ROWS - 1; r >= 0; r--) { if (board[col][r] === '') return r; } return -1; }
      function checkWin(mark) {
        for (var c = 0; c < COLS; c++) for (var r = 0; r < ROWS; r++) {
          if (c+3<COLS && board[c][r]===mark && board[c+1][r]===mark && board[c+2][r]===mark && board[c+3][r]===mark) return [[c,r],[c+1,r],[c+2,r],[c+3,r]];
          if (r+3<ROWS && board[c][r]===mark && board[c][r+1]===mark && board[c][r+2]===mark && board[c][r+3]===mark) return [[c,r],[c,r+1],[c,r+2],[c,r+3]];
          if (c+3<COLS && r+3<ROWS && board[c][r]===mark && board[c+1][r+1]===mark && board[c+2][r+2]===mark && board[c+3][r+3]===mark) return [[c,r],[c+1,r+1],[c+2,r+2],[c+3,r+3]];
          if (c+3<COLS && r-3>=0 && board[c][r]===mark && board[c+1][r-1]===mark && board[c+2][r-2]===mark && board[c+3][r-3]===mark) return [[c,r],[c+1,r-1],[c+2,r-2],[c+3,r-3]];
        }
        return null;
      }
      function checkWinBool(mark) { return checkWin(mark) !== null; }
      function isFull() { for (var c = 0; c < COLS; c++) if (board[c][0] === '') return false; return true; }
      function playCol(col, mark) {
        var r = drop(col); if (r < 0) return false;
        board[col][r] = mark; render();
        cells[col][r].style.animation = 'none'; cells[col][r].offsetHeight;
        cells[col][r].style.animation = 'bgDrop 0.4s ease';
        var winCells = checkWin(mark);
        if (winCells) {
          done = true;
          winCells.forEach(function(pos) {
            cells[pos[0]][pos[1]].style.animation = 'bgWinFlash 0.5s ease infinite';
            cells[pos[0]][pos[1]].style.transform = 'scale(1.1)';
          });
          var w = mark==='🔴'?'You win!':'Player 2 wins!'; if(mark==='🟡'&&mode==='1p') w='Rashid wins!';
          div.querySelector('#c4Status').innerHTML = '<span style="color:#FFD700;font-size:1.1rem">' + w + ' 🎉</span>';
          E.endGame(mark==='🔴'?1:0, 1); return true;
        }
        if (isFull()) { done = true; div.querySelector('#c4Status').innerHTML = '<span style="color:#FFD700">Draw! 🤝</span>'; E.endGame(0, 1); return true; }
        turn = turn==='p1'?'p2':'p1';
        var col2 = turn === 'p1' ? '#ff4444' : '#ffcc00';
        var txt = turn==='p1'?'Your turn (🔴)':(mode==='2p'?'Player 2 (🟡)':'Rashid...');
        div.querySelector('#c4Status').innerHTML = '<span style="color:' + col2 + '">' + txt + '</span>';
        return true;
      }

      function countThreats(mark, col) {
        var r = drop(col); if (r < 0) return 0;
        board[col][r] = mark;
        var threats = 0;
        for (var c = 0; c < COLS; c++) for (var rr = 0; rr < ROWS; rr++) {
          var dirs = [[1,0],[0,1],[1,1],[1,-1]];
          dirs.forEach(function(d) {
            var count = 0, empty = 0;
            for (var s = 0; s < 4; s++) {
              var cc = c + d[0]*s, rrr = rr + d[1]*s;
              if (cc < 0 || cc >= COLS || rrr < 0 || rrr >= ROWS) return;
              if (board[cc][rrr] === mark) count++;
              else if (board[cc][rrr] === '') empty++;
              else return;
            }
            if (count === 3 && empty === 1) threats++;
          });
        }
        board[col][r] = '';
        return threats;
      }

      function aiMove() {
        var mark = '🟡', opp = '🔴';
        var avail = []; for (var c = 0; c < COLS; c++) if (drop(c) >= 0) avail.push(c);
        if (avail.length === 0) return;
        if (diff === 'easy') { playCol(pick(avail), mark); return; }
        for (var c2 = 0; c2 < COLS; c2++) { var r = drop(c2); if (r < 0) continue; board[c2][r] = mark; if (checkWinBool(mark)) { board[c2][r] = ''; playCol(c2, mark); return; } board[c2][r] = ''; }
        for (var c3 = 0; c3 < COLS; c3++) { var r2 = drop(c3); if (r2 < 0) continue; board[c3][r2] = opp; if (checkWinBool(opp)) { board[c3][r2] = ''; playCol(c3, mark); return; } board[c3][r2] = ''; }
        if (diff === 'hard') {
          var safe = avail.filter(function(col) {
            var r = drop(col); if (r <= 0) return true;
            board[col][r] = mark; board[col][r-1] = opp;
            var danger = checkWinBool(opp);
            board[col][r-1] = ''; board[col][r] = '';
            return !danger;
          });
          if (safe.length === 0) safe = avail;
          var best = safe[0], bestT = -1;
          safe.forEach(function(col) { var t = countThreats(mark, col); if (t > bestT) { bestT = t; best = col; } });
          playCol(best, mark); return;
        }
        if (avail.indexOf(3) > -1) playCol(3, mark); else playCol(pick(avail), mark);
      }

      grid.onclick = function(e) {
        if (done) return;
        var t = e.target; if (!t.hasAttribute('data-c')) return;
        var col = parseInt(t.getAttribute('data-c'));
        if (turn === 'p1') { if (playCol(col, '🔴') && !done && mode === '1p') setTimeout(aiMove, 400); }
        else if (mode === '2p') playCol(col, '🟡');
      };
      render();
      return {};
    }, destroy: function() {}
  });

  /* ── 15. Memory Cards ── */
  E.register({
    id: 'memory-cards', name: 'Memory Cards', emoji: '🃏', category: 'board', has2P: false,
    init: function (container, mode, diff) {
      var pairCount = diff === 'easy' ? 6 : diff === 'hard' ? 10 : 8;
      var cols = diff === 'easy' ? 3 : diff === 'hard' ? 5 : 4;
      var totalCards = pairCount * 2;
      var allItems = shuffle(['🕌','🗼','🐪','🦅','🌴','🏜️','💎','🪙','🐫','🎭']);
      var items = allItems.slice(0, pairCount);
      var deck = shuffle(items.concat(items));
      var flipped = [], matched = [], moves = 0, locked = false;
      var div = makeWrap();
      div.innerHTML = makeStatus('memStatus', '🃏 <span class="bg-score">Moves: 0</span> &nbsp;|&nbsp; Pairs: 0/' + pairCount) +
        makeProgress('memPeekBar', 'linear-gradient(90deg,#FF6B35,#FFD700)') +
        '<div style="font-family:Inter,sans-serif;font-size:0.75rem;color:rgba(255,255,255,0.4);margin-bottom:6px">Memorize the cards!</div>' +
        '<div class="gboard" style="grid-template-columns:repeat(' + cols + ',68px);gap:6px;padding:10px;background:rgba(0,0,0,0.2);border-radius:14px" id="memGrid"></div>' +
        '<div id="memRating" style="font-family:Inter,sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-top:8px"></div>';
      container.appendChild(div);
      var grid = div.querySelector('#memGrid'); var cells = [];
      for (var i = 0; i < totalCards; i++) {
        var c = document.createElement('div');
        c.className = 'gcell';
        c.style.cssText = 'height:68px;width:68px;font-size:1.8rem;display:flex;align-items:center;justify-content:center;' +
          'background:linear-gradient(135deg,#1a1a3e,#2a1a4e);border:2px solid rgba(155,89,182,0.4);border-radius:10px;' +
          'cursor:pointer;transition:transform 0.3s ease,box-shadow 0.3s ease,background 0.3s ease;' +
          'box-shadow:0 3px 10px rgba(0,0,0,0.4);perspective:600px';
        c.textContent = '❓';
        c.setAttribute('data-i', i);
        c.onmouseenter = function () { if (!locked && matched.indexOf(parseInt(this.getAttribute('data-i'))) === -1) this.style.transform = 'scale(1.06)'; };
        c.onmouseleave = function () { if (!this.classList.contains('mem-matched')) this.style.transform = 'scale(1)'; };
        grid.appendChild(c); cells.push(c);
      }
      function reveal(idx) {
        cells[idx].textContent = deck[idx];
        cells[idx].style.background = 'linear-gradient(135deg,rgba(255,215,0,0.15),rgba(155,89,182,0.15))';
        cells[idx].style.borderColor = 'rgba(255,215,0,0.5)';
        cells[idx].style.animation = 'bgFlipIn 0.3s ease';
      }
      function hide(idx) {
        cells[idx].textContent = '❓';
        cells[idx].style.background = 'linear-gradient(135deg,#1a1a3e,#2a1a4e)';
        cells[idx].style.borderColor = 'rgba(155,89,182,0.4)';
        cells[idx].style.animation = 'bgFlipIn 0.3s ease';
        cells[idx].style.boxShadow = '0 3px 10px rgba(0,0,0,0.4)';
      }
      function updateRating() {
        var ratio = pairCount > 0 ? moves / pairCount : 0;
        var stars = ratio <= 1.5 ? '⭐⭐⭐' : ratio <= 2.5 ? '⭐⭐' : '⭐';
        div.querySelector('#memRating').textContent = 'Rating: ' + stars;
      }
      // Peek: show all cards then flip back with timer bar
      locked = true;
      for (var p = 0; p < totalCards; p++) reveal(p);
      var peekBar = div.querySelector('#memPeekBar');
      peekBar.style.transition = 'width 1.2s linear';
      setTimeout(function () { peekBar.style.width = '0%'; }, 50);
      setTimeout(function () {
        for (var p2 = 0; p2 < totalCards; p2++) hide(p2);
        locked = false;
        peekBar.parentNode.style.display = 'none';
        div.querySelector('#memStatus').nextElementSibling.nextElementSibling.style.display = 'none';
      }, 1200);

      grid.onclick = function(e) {
        if (locked) return;
        var t = e.target; if (!t.hasAttribute('data-i')) return;
        var idx = parseInt(t.getAttribute('data-i'));
        if (matched.indexOf(idx) > -1 || flipped.indexOf(idx) > -1) return;
        reveal(idx); flipped.push(idx);
        if (flipped.length === 2) {
          moves++;
          div.querySelector('#memStatus').innerHTML = '🃏 <span class="bg-score">Moves: ' + moves + '</span> &nbsp;|&nbsp; Pairs: ' + (matched.length/2) + '/' + pairCount;
          updateRating();
          locked = true;
          if (deck[flipped[0]] === deck[flipped[1]]) {
            matched.push(flipped[0], flipped[1]);
            var m0 = flipped[0], m1 = flipped[1];
            cells[m0].classList.add('mem-matched');
            cells[m1].classList.add('mem-matched');
            cells[m0].style.animation = 'bgSparkle 0.6s ease';
            cells[m1].style.animation = 'bgSparkle 0.6s ease';
            cells[m0].style.boxShadow = '0 0 20px rgba(0,201,167,0.5)';
            cells[m1].style.boxShadow = '0 0 20px rgba(0,201,167,0.5)';
            cells[m0].style.borderColor = 'rgba(0,201,167,0.6)';
            cells[m1].style.borderColor = 'rgba(0,201,167,0.6)';
            div.querySelector('#memStatus').innerHTML = '🃏 <span class="bg-score">Moves: ' + moves + '</span> &nbsp;|&nbsp; Pairs: ' + (matched.length/2) + '/' + pairCount;
            flipped = []; locked = false;
            if (matched.length === totalCards) {
              E.rashidSay('All matched! 🎉');
              div.querySelector('#memStatus').innerHTML = '<span style="color:#FFD700;font-size:1.1rem">All matched in ' + moves + ' moves! 🎉</span>';
              div.querySelector('#memStatus').style.animation = 'bgCelebrate 0.8s ease';
              E.endGame(Math.max(1, pairCount * 3 - moves), pairCount * 3);
            }
          } else {
            var f = flipped.slice();
            cells[f[0]].style.boxShadow = '0 0 15px rgba(255,50,50,0.5)';
            cells[f[1]].style.boxShadow = '0 0 15px rgba(255,50,50,0.5)';
            setTimeout(function() {
              hide(f[0]); hide(f[1]); flipped = []; locked = false;
            }, 800);
          }
        }
      };
      return {};
    }, destroy: function() {}
  });

  /* ── 16. Battleship ── */
  E.register({
    id: 'battleship', name: 'Battleship', emoji: '🚢', category: 'board', has2P: true,
    _tv: [],
    init: function (container, mode, diff) {
      var SIZE = diff === 'easy' ? 8 : diff === 'hard' ? 10 : 9;
      var CELL = SIZE <= 8 ? 42 : SIZE <= 9 ? 38 : 34;
      var SHIPS = [
        { name: 'Patrol Boat', len: 2, pts: 2, emoji: '🚤', color: '#4ecdc4' },
        { name: 'Submarine', len: 3, pts: 3, emoji: '🔱', color: '#9b59b6' },
        { name: 'Destroyer', len: 4, pts: 4, emoji: '🚢', color: '#FFD700' },
        { name: 'Carrier', len: 5, pts: 5, emoji: '⛴️', color: '#FF6B35' }
      ];
      var TOTAL_PTS = 14;
      var self = this; self._tv = [];

      /* ── Player data ── */
      function mkPlayer() {
        var g = [];
        for (var r = 0; r < SIZE; r++) { g[r] = []; for (var c = 0; c < SIZE; c++) g[r][c] = { ship: -1, hit: false }; }
        return { grid: g, ships: [], score: 0, placed: false };
      }
      var P = [mkPlayer(), mkPlayer()];
      var turn = 0, gameOver = false;
      var div = makeWrap(); div.style.maxWidth = '720px';
      container.appendChild(div);

      /* ── Helpers ── */
      function canPlace(pi, r, c, len, h) {
        for (var i = 0; i < len; i++) {
          var rr = h ? r : r + i, cc = h ? c + i : c;
          if (rr >= SIZE || cc >= SIZE) return false;
          if (P[pi].grid[rr][cc].ship !== -1) return false;
        }
        return true;
      }
      function doPlace(pi, r, c, len, h) {
        var cells = [];
        for (var i = 0; i < len; i++) {
          var rr = h ? r : r + i, cc = h ? c + i : c;
          P[pi].grid[rr][cc].ship = P[pi].ships.length;
          cells.push({ r: rr, c: cc });
        }
        P[pi].ships.push({ cells: cells, sunk: false, def: SHIPS[P[pi].ships.length], horiz: h });
      }
      /* Ship shape styling — makes ships look real with bow/stern */
      function shipShape(ship, idx, opacity) {
        var o = opacity || 1;
        var sc = ship.def.color;
        var isFirst = idx === 0, isLast = idx === ship.cells.length - 1;
        var rad = '2px';
        if (ship.horiz) {
          if (isFirst) rad = '14px 4px 4px 14px';
          else if (isLast) rad = '4px 14px 14px 4px';
        } else {
          if (isFirst) rad = '14px 14px 4px 4px';
          else if (isLast) rad = '4px 4px 14px 14px';
        }
        var bg = 'linear-gradient(' + (ship.horiz ? '180deg' : '90deg') + ',' + sc + (o < 1 ? '44' : 'cc') + ',' + sc + (o < 1 ? '22' : '88') + ')';
        var bdr = '1.5px solid ' + sc + (o < 1 ? '55' : '');
        var shadow = o < 1 ? 'none' : '0 0 8px ' + sc + '33,inset 0 1px 0 rgba(255,255,255,0.15)';
        return 'background:' + bg + ';border:' + bdr + ';border-radius:' + rad + ';box-shadow:' + shadow + ';';
      }
      function shipContent(ship, idx) {
        if (idx === 0) return ship.def.emoji;
        if (idx === ship.cells.length - 1) return ship.horiz ? '▸' : '▾';
        return ship.horiz ? '━' : '┃';
      }
      function aiPlaceAll(pi) {
        for (var s = 0; s < SHIPS.length; s++) {
          var ok = false;
          while (!ok) {
            var h = Math.random() > 0.5, r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
            if (canPlace(pi, r, c, SHIPS[s].len, h)) { doPlace(pi, r, c, SHIPS[s].len, h); ok = true; }
          }
        }
        P[pi].placed = true;
      }
      function isSunk(pi, si) {
        var sh = P[pi].ships[si];
        for (var i = 0; i < sh.cells.length; i++) if (!P[pi].grid[sh.cells[i].r][sh.cells[i].c].hit) return false;
        return true;
      }
      function allSunk(pi) {
        for (var i = 0; i < P[pi].ships.length; i++) if (!P[pi].ships[i].sunk) return false;
        return P[pi].ships.length > 0;
      }
      function cellCSS() {
        return 'height:' + CELL + 'px;width:' + CELL + 'px;font-size:0.85rem;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:all 0.2s;';
      }
      function waterCSS() {
        return 'background:linear-gradient(180deg,rgba(0,60,120,0.4),rgba(0,40,80,0.6));border:1px solid rgba(0,100,200,0.2);color:rgba(100,180,255,0.4);cursor:pointer;';
      }
      function gridCSS() {
        return 'grid-template-columns:repeat(' + SIZE + ',' + CELL + 'px);gap:2px;padding:6px;background:linear-gradient(180deg,rgba(0,30,60,0.6),rgba(0,20,50,0.8));border-radius:12px;border:1.5px solid rgba(0,100,200,0.2);transition:border-color 0.3s';
      }

      /* ══════════════════════════════════════════
         PHASE 1 — SHIP PLACEMENT
         ══════════════════════════════════════════ */
      function showPlacement(pi) {
        var shipIdx = P[pi].ships.length, horiz = true;
        var pColor = pi === 0 ? '#4ecdc4' : '#ff6b6b';
        var pName = mode === '2p' ? (pi === 0 ? 'Player 1' : 'Player 2') : 'Captain';
        div.innerHTML = '';

        /* Status */
        var hdr = document.createElement('div'); hdr.className = 'bg-status'; hdr.id = 'bsPlSt';
        hdr.innerHTML = '🚢 <span style="color:' + pColor + '">' + pName + '</span> — Place your fleet!';
        div.appendChild(hdr);

        /* Ship info */
        var info = document.createElement('div'); info.id = 'bsShipInf';
        info.style.cssText = 'text-align:center;margin-bottom:6px;font-size:0.82rem;color:rgba(255,255,255,0.7)';
        div.appendChild(info);

        /* Ship roster */
        var roster = document.createElement('div'); roster.id = 'bsRoster';
        roster.style.cssText = 'display:flex;gap:8px;justify-content:center;margin-bottom:8px;flex-wrap:wrap';
        for (var s = 0; s < SHIPS.length; s++) {
          var chip = document.createElement('div');
          chip.style.cssText = 'padding:4px 10px;border-radius:8px;font-size:0.72rem;font-family:Orbitron,sans-serif;border:1.5px solid ' + SHIPS[s].color + '33;color:' + SHIPS[s].color + ';background:rgba(0,0,0,0.2);transition:all 0.3s';
          chip.textContent = SHIPS[s].emoji + ' ' + SHIPS[s].len + ' cells';
          chip.id = 'bsChip' + s;
          roster.appendChild(chip);
        }
        div.appendChild(roster);

        /* Rotate btn */
        var ctrls = document.createElement('div');
        ctrls.style.cssText = 'display:flex;gap:8px;justify-content:center;margin-bottom:6px';
        var rotBtn = document.createElement('button');
        rotBtn.style.cssText = 'padding:6px 14px;border:1.5px solid rgba(255,215,0,0.3);border-radius:8px;background:rgba(255,255,255,0.06);color:#FFD700;cursor:pointer;font-family:Orbitron,sans-serif;font-size:0.72rem;transition:all 0.2s';
        rotBtn.textContent = '🔄 Horizontal';
        rotBtn.onclick = function () { horiz = !horiz; rotBtn.textContent = horiz ? '🔄 Horizontal' : '🔄 Vertical'; };
        ctrls.appendChild(rotBtn);
        div.appendChild(ctrls);

        /* Grid */
        var gEl = document.createElement('div'); gEl.className = 'gboard'; gEl.style.cssText = gridCSS();
        div.appendChild(gEl);
        var cells = [];
        for (var i = 0; i < SIZE * SIZE; i++) {
          var ce = document.createElement('div'); ce.className = 'gcell';
          ce.style.cssText = cellCSS() + waterCSS();
          ce.textContent = '~';
          ce.setAttribute('data-r', Math.floor(i / SIZE));
          ce.setAttribute('data-c', i % SIZE);
          /* Hover ghost */
          ce.onmouseenter = function () {
            if (shipIdx >= SHIPS.length) return;
            var cr = parseInt(this.getAttribute('data-r')), cc = parseInt(this.getAttribute('data-c'));
            var ok = canPlace(pi, cr, cc, SHIPS[shipIdx].len, horiz);
            for (var j = 0; j < SHIPS[shipIdx].len; j++) {
              var rr = horiz ? cr : cr + j, ccc = horiz ? cc + j : cc;
              if (rr < SIZE && ccc < SIZE && P[pi].grid[rr][ccc].ship === -1) {
                cells[rr * SIZE + ccc].style.background = ok ? 'rgba(0,201,167,0.25)' : 'rgba(255,50,50,0.25)';
                cells[rr * SIZE + ccc].style.borderColor = ok ? 'rgba(0,201,167,0.6)' : 'rgba(255,50,50,0.6)';
              }
            }
          };
          ce.onmouseleave = function () {
            for (var j = 0; j < cells.length; j++) {
              var rr = Math.floor(j / SIZE), ccc = j % SIZE;
              if (P[pi].grid[rr][ccc].ship === -1) { cells[j].style.background = ''; cells[j].style.borderColor = ''; cells[j].style.cssText = cellCSS() + waterCSS(); }
            }
          };
          /* Click to place */
          ce.onclick = function () {
            if (shipIdx >= SHIPS.length) return;
            var cr = parseInt(this.getAttribute('data-r')), cc = parseInt(this.getAttribute('data-c'));
            if (!canPlace(pi, cr, cc, SHIPS[shipIdx].len, horiz)) return;
            doPlace(pi, cr, cc, SHIPS[shipIdx].len, horiz);
            var sh = P[pi].ships[P[pi].ships.length - 1];
            for (var j = 0; j < sh.cells.length; j++) {
              var idx = sh.cells[j].r * SIZE + sh.cells[j].c;
              cells[idx].style.cssText = cellCSS() + shipShape(sh, j) + 'color:#fff;cursor:default;font-size:' + (j === 0 ? '1rem' : '0.7rem') + ';';
              cells[idx].textContent = shipContent(sh, j);
            }
            /* Update roster chip */
            var chip = document.getElementById('bsChip' + shipIdx);
            if (chip) { chip.style.background = SHIPS[shipIdx].color + '22'; chip.style.borderColor = SHIPS[shipIdx].color; chip.style.textDecoration = 'line-through'; }
            shipIdx++;
            updInfo();
            if (shipIdx >= SHIPS.length) {
              P[pi].placed = true;
              var rb = document.createElement('button');
              rb.style.cssText = 'margin-top:10px;padding:12px 28px;border:none;border-radius:10px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#000;font-family:Orbitron,sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;display:block;margin-left:auto;margin-right:auto;transition:all 0.2s';
              rb.textContent = '✅ Ready for Battle!';
              rb.onmouseenter = function () { this.style.transform = 'scale(1.05)'; };
              rb.onmouseleave = function () { this.style.transform = 'scale(1)'; };
              rb.onclick = function () {
                if (mode === '2p' && pi === 0) showPass();
                else showBattle();
              };
              div.appendChild(rb);
              document.getElementById('bsPlSt').innerHTML = '✅ <span style="color:' + pColor + '">Fleet placed!</span> Ready for battle!';
            }
          };
          gEl.appendChild(ce); cells.push(ce);
        }
        function updInfo() {
          var el = document.getElementById('bsShipInf');
          if (!el) return;
          if (shipIdx >= SHIPS.length) { el.innerHTML = '<span style="color:#00C9A7">All ships placed! Hit Ready!</span>'; return; }
          var s = SHIPS[shipIdx];
          el.innerHTML = 'Placing: ' + s.emoji + ' <strong style="color:' + s.color + '">' + s.name + '</strong> — ' + s.len + ' cells (' + s.pts + ' pts)';
        }
        updInfo();
      }

      /* ══════════════════════════════════════════
         PASS SCREEN (2P only)
         ══════════════════════════════════════════ */
      function showPass() {
        div.innerHTML = '<div style="text-align:center;padding:40px 20px">' +
          '<div style="font-size:3rem;margin-bottom:16px">🔄</div>' +
          '<div style="font-family:Orbitron,sans-serif;font-size:1.1rem;color:#FFD700;margin-bottom:10px">Pass to Player 2!</div>' +
          '<div style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-bottom:20px">Don\'t peek! P2 needs to place their ships.</div>' +
          '</div>';
        var gb = document.createElement('button');
        gb.style.cssText = 'display:block;margin:0 auto;padding:14px 32px;border:none;border-radius:10px;background:linear-gradient(135deg,#ff6b6b,#ff4444);color:#fff;font-family:Orbitron,sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;transition:all 0.2s';
        gb.textContent = "I'm Player 2 — Let's Go!";
        gb.onclick = function () { showPlacement(1); };
        div.appendChild(gb);
      }

      /* ══════════════════════════════════════════
         PHASE 2 — BATTLE
         ══════════════════════════════════════════ */
      var bCells = [[], []]; // battle cell refs

      function showBattle() {
        turn = 0; gameOver = false;
        div.innerHTML = '';

        /* Status */
        var st = document.createElement('div'); st.className = 'bg-status'; st.id = 'bsBattSt'; div.appendChild(st);

        /* Score row */
        var sc = document.createElement('div'); sc.id = 'bsScRow';
        sc.style.cssText = 'display:flex;justify-content:center;gap:16px;margin-bottom:6px;font-family:Orbitron,sans-serif;font-size:0.78rem';
        div.appendChild(sc);

        /* Ship status row */
        var shRow = document.createElement('div'); shRow.id = 'bsShipRow';
        shRow.style.cssText = 'display:flex;justify-content:center;gap:12px;margin-bottom:8px;font-size:0.72rem;flex-wrap:wrap';
        div.appendChild(shRow);

        /* Two grids */
        var gWrap = document.createElement('div');
        gWrap.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;justify-content:center;width:100%';
        div.appendChild(gWrap);

        for (var p = 0; p < 2; p++) {
          bCells[p] = [];
          var col = document.createElement('div');
          col.style.cssText = 'text-align:center;flex:1;min-width:' + (CELL * SIZE + 14) + 'px';
          var lbl = document.createElement('div'); lbl.id = 'bsBLbl' + p;
          lbl.style.cssText = 'font-family:Orbitron,sans-serif;font-size:0.68rem;margin-bottom:3px;letter-spacing:1px;transition:all 0.3s';
          if (mode === '2p') {
            lbl.textContent = p === 0 ? "P1's FLEET" : "P2's FLEET";
          } else {
            lbl.textContent = p === 0 ? 'YOUR FLEET' : 'ENEMY WATERS';
          }
          col.appendChild(lbl);
          var g = document.createElement('div'); g.className = 'gboard'; g.id = 'bsBG' + p;
          g.style.cssText = gridCSS();
          col.appendChild(g); gWrap.appendChild(col);

          for (var i = 0; i < SIZE * SIZE; i++) {
            var r = Math.floor(i / SIZE), c = i % SIZE;
            var ce = document.createElement('div'); ce.className = 'gcell';
            ce.setAttribute('data-r', r); ce.setAttribute('data-c', c); ce.setAttribute('data-p', p);
            var isShip = P[p].grid[r][c].ship !== -1;
            /* On your own fleet, show ships with real shape (subtle); on enemy grid, hide them */
            if (mode === '1p' && p === 0 && isShip) {
              var si2 = P[p].grid[r][c].ship, sh2 = P[p].ships[si2];
              var ci2 = 0; for (var q = 0; q < sh2.cells.length; q++) { if (sh2.cells[q].r === r && sh2.cells[q].c === c) { ci2 = q; break; } }
              ce.style.cssText = cellCSS() + shipShape(sh2, ci2, 0.5) + 'color:' + sh2.def.color + '88;cursor:default;font-size:' + (ci2 === 0 ? '0.85rem' : '0.65rem') + ';';
              ce.textContent = shipContent(sh2, ci2);
            } else {
              ce.style.cssText = cellCSS() + waterCSS();
              ce.textContent = '~';
            }
            g.appendChild(ce); bCells[p].push(ce);
          }

          g.onclick = (function (pIdx) {
            return function (e) {
              if (gameOver) return;
              var t = e.target; if (!t.hasAttribute('data-r')) return;
              var r = parseInt(t.getAttribute('data-r')), c = parseInt(t.getAttribute('data-c'));
              fireAt(pIdx, r, c);
            };
          })(p);
        }

        updateBattleUI();
        E.rashidSay(pick(["Battle stations! 🚢", "Fire at will! 💥", "Yalla, sink 'em! ⚓"]));
      }

      /* ── Fire at a grid cell ── */
      function fireAt(targetP, r, c) {
        var expected = turn === 0 ? 1 : 0;
        if (mode === '1p' && targetP !== 1) { E.rashidSay("Attack the enemy waters! ➡️"); return; }
        if (mode === '2p' && targetP !== expected) {
          E.rashidSay(turn === 0 ? "Fire at P2's fleet! ➡️" : "Fire at P1's fleet! ⬅️"); return;
        }
        if (mode === '1p' && turn !== 0) return;

        var cell = P[targetP].grid[r][c];
        if (cell.hit) { E.rashidSay("Already fired there! 🔄"); return; }
        cell.hit = true;
        var ce = bCells[targetP][r * SIZE + c];

        var wasHit = false;
        if (cell.ship !== -1) {
          /* HIT — you get another turn! */
          wasHit = true;
          ce.textContent = '💥'; ce.style.cssText = cellCSS() + 'background:radial-gradient(circle,rgba(255,50,50,0.5),rgba(200,0,0,0.2));border:1.5px solid rgba(255,50,50,0.6);box-shadow:0 0 15px rgba(255,50,50,0.4);animation:bgExplosion 0.5s ease;font-size:1.1rem;cursor:default;';
          var sh = P[targetP].ships[cell.ship];
          if (isSunk(targetP, cell.ship)) {
            sh.sunk = true;
            var pts = sh.def.pts;
            P[turn].score += pts;
            E.setScore(mode === '1p' ? P[0].score : Math.max(P[0].score, P[1].score));
            /* Reveal sunk ship with its real shape */
            for (var i = 0; i < sh.cells.length; i++) {
              var se = bCells[targetP][sh.cells[i].r * SIZE + sh.cells[i].c];
              var sunkRad = '2px';
              if (sh.horiz) {
                if (i === 0) sunkRad = '14px 4px 4px 14px';
                else if (i === sh.cells.length - 1) sunkRad = '4px 14px 14px 4px';
              } else {
                if (i === 0) sunkRad = '14px 14px 4px 4px';
                else if (i === sh.cells.length - 1) sunkRad = '4px 4px 14px 14px';
              }
              se.textContent = i === 0 ? '🔥' : '💀';
              se.style.cssText = cellCSS() + 'background:radial-gradient(circle,rgba(255,100,0,0.4),rgba(200,50,0,0.2));border:1.5px solid rgba(255,100,0,0.6);box-shadow:0 0 18px rgba(255,100,0,0.5);border-radius:' + sunkRad + ';font-size:0.9rem;cursor:default;';
            }
            var who = mode === '1p' ? '' : (turn === 0 ? 'P1 ' : 'P2 ');
            E.rashidSay(who + 'sank ' + sh.def.emoji + ' ' + sh.def.name + '! +' + pts + 'pts! Keep firing! 🎯');
            if (allSunk(targetP)) {
              gameOver = true;
              var winner = mode === '1p' ? 'You' : (turn === 0 ? 'Player 1' : 'Player 2');
              var wc = turn === 0 ? '#4ecdc4' : '#ff6b6b';
              document.getElementById('bsBattSt').innerHTML = '<span style="color:' + wc + ';font-size:1.05rem">' + winner + ' wins! All ships sunk! 🎉</span>';
              document.getElementById('bsBattSt').style.animation = 'bgCelebrate 0.8s ease';
              E.endGame(P[turn].score, TOTAL_PTS);
              return;
            }
          } else {
            var w2 = mode === '1p' ? '' : (turn === 0 ? 'P1: ' : 'P2: ');
            E.rashidSay(w2 + pick(['Direct hit! Fire again! 💥', 'Hit! Keep going! 🔥', 'Boom! Another shot! 💣']));
          }
        } else {
          /* MISS — turn switches to opponent */
          ce.textContent = '💨'; ce.style.cssText = cellCSS() + 'background:linear-gradient(180deg,rgba(0,40,80,0.3),rgba(0,20,50,0.4));border:1px solid rgba(0,80,160,0.2);animation:bgRipple 0.6s ease;color:rgba(100,180,255,0.3);cursor:default;';
        }

        /* Only switch turns on MISS */
        if (!wasHit) {
          turn = 1 - turn;
        }
        updateBattleUI();

        /* AI turn (on miss it's AI's turn, on AI hit AI goes again) */
        if (mode === '1p' && turn === 1 && !gameOver) {
          self._tv.push(setTimeout(function () { aiTurn(); }, 700));
        }
      }

      /* ── AI attack logic ── */
      var aiHits = [];
      function aiTurn() {
        if (gameOver) return;
        var r, c, found = false;
        /* Hunt mode: try adjacent to un-sunk hits */
        var dirs = shuffle([[-1,0],[1,0],[0,-1],[0,1]]);
        for (var h = 0; h < aiHits.length && !found; h++) {
          for (var d = 0; d < dirs.length && !found; d++) {
            r = aiHits[h].r + dirs[d][0]; c = aiHits[h].c + dirs[d][1];
            if (r >= 0 && r < SIZE && c >= 0 && c < SIZE && !P[0].grid[r][c].hit) found = true;
          }
        }
        if (!found) {
          var tries = 0;
          do { r = Math.floor(Math.random() * SIZE); c = Math.floor(Math.random() * SIZE); tries++; }
          while (P[0].grid[r][c].hit && tries < 300);
          if (tries >= 300) return;
        }
        P[0].grid[r][c].hit = true;
        var ce = bCells[0][r * SIZE + c];
        var aiWasHit = false;
        if (P[0].grid[r][c].ship !== -1) {
          aiWasHit = true;
          ce.textContent = '💥'; ce.style.cssText = cellCSS() + 'background:radial-gradient(circle,rgba(255,50,50,0.5),rgba(200,0,0,0.2));border:1.5px solid rgba(255,50,50,0.6);box-shadow:0 0 15px rgba(255,50,50,0.4);animation:bgExplosion 0.5s ease;font-size:1.1rem;cursor:default;';
          aiHits.push({ r: r, c: c });
          var si = P[0].grid[r][c].ship;
          if (isSunk(0, si)) {
            P[0].ships[si].sunk = true;
            P[1].score += P[0].ships[si].def.pts;
            var sunkSh = P[0].ships[si];
            for (var i = 0; i < sunkSh.cells.length; i++) {
              var se = bCells[0][sunkSh.cells[i].r * SIZE + sunkSh.cells[i].c];
              var sRad = '2px';
              if (sunkSh.horiz) { if (i === 0) sRad = '14px 4px 4px 14px'; else if (i === sunkSh.cells.length - 1) sRad = '4px 14px 14px 4px'; }
              else { if (i === 0) sRad = '14px 14px 4px 4px'; else if (i === sunkSh.cells.length - 1) sRad = '4px 4px 14px 14px'; }
              se.textContent = i === 0 ? '🔥' : '💀';
              se.style.cssText = cellCSS() + 'background:radial-gradient(circle,rgba(255,100,0,0.4),rgba(200,50,0,0.2));border:1.5px solid rgba(255,100,0,0.6);box-shadow:0 0 18px rgba(255,100,0,0.5);border-radius:' + sRad + ';font-size:0.9rem;cursor:default;';
            }
            aiHits = aiHits.filter(function (h) {
              for (var j = 0; j < sunkSh.cells.length; j++) if (sunkSh.cells[j].r === h.r && sunkSh.cells[j].c === h.c) return false;
              return true;
            });
            E.rashidSay('Rashid sank your ' + sunkSh.def.name + '! Firing again! 😈');
            if (allSunk(0)) {
              gameOver = true;
              document.getElementById('bsBattSt').innerHTML = '<span style="color:#ff6b6b;font-size:1.05rem">Rashid wins! All your ships sunk! 😈</span>';
              E.endGame(P[0].score, TOTAL_PTS); return;
            }
          } else { E.rashidSay(pick(['Rashid hits! Firing again! 💥', 'Got one! Another shot! 😏', 'Boom! Again! 🔥'])); }
        } else {
          ce.textContent = '💨'; ce.style.cssText = cellCSS() + 'background:linear-gradient(180deg,rgba(0,40,80,0.3),rgba(0,20,50,0.4));border:1px solid rgba(0,80,160,0.2);animation:bgRipple 0.6s ease;color:rgba(100,180,255,0.3);cursor:default;';
          E.rashidSay(pick(['Rashid missed! Your turn! 🔄', 'Splash! You\'re up! 🌊', 'Miss! Go ahead! 😊']));
        }
        /* AI keeps turn on hit, switches on miss */
        if (!aiWasHit) {
          turn = 0;
        }
        updateBattleUI();
        /* If AI hit, fire again after delay */
        if (aiWasHit && !gameOver) {
          self._tv.push(setTimeout(function () { aiTurn(); }, 800));
        }
      }

      /* ── Update battle UI ── */
      function updateBattleUI() {
        var st = document.getElementById('bsBattSt');
        var sc = document.getElementById('bsScRow');
        var sh = document.getElementById('bsShipRow');
        if (!st) return;

        if (mode === '1p') {
          var tc = turn === 0 ? '#4ecdc4' : '#ff6b6b';
          var turnMsg = turn === 0 ? 'Your turn — fire at enemy waters!' : "Rashid's turn...";
          st.innerHTML = '🚢 <span style="color:' + tc + '">' + turnMsg + '</span> <span style="font-size:0.7rem;color:rgba(255,255,255,0.4)">(Hit = fire again!)</span>';
          sc.innerHTML = '<span style="color:#4ecdc4">You: ' + P[0].score + '/' + TOTAL_PTS + 'pts</span> <span style="color:rgba(255,255,255,0.2)">|</span> <span style="color:#ff6b6b">Rashid: ' + P[1].score + '/' + TOTAL_PTS + 'pts</span>';
          /* Ship status with names */
          sh.innerHTML = '<span style="color:#4ecdc4;font-size:0.62rem">You: ' + SHIPS.map(function(s, i) { var sunk = P[0].ships[i] && P[0].ships[i].sunk; return '<span style="opacity:' + (sunk ? '0.3;text-decoration:line-through' : '1') + '">' + s.emoji + s.len + '</span>'; }).join(' ') + '</span>' +
            ' <span style="color:rgba(255,255,255,0.15)">|</span> ' +
            '<span style="color:#ff6b6b;font-size:0.62rem">Enemy: ' + SHIPS.map(function(s, i) { var sunk = P[1].ships[i] && P[1].ships[i].sunk; return '<span style="opacity:' + (sunk ? '0.3' : '1') + '">' + (sunk ? '🔥' : '❓') + s.len + '</span>'; }).join(' ') + '</span>';
        } else {
          var tc2 = turn === 0 ? '#4ecdc4' : '#ff6b6b';
          var tn2 = turn === 0 ? 'Player 1' : 'Player 2';
          st.innerHTML = '🚢 <span style="color:' + tc2 + '">' + tn2 + ' — Fire!</span> <span style="font-size:0.7rem;color:rgba(255,255,255,0.4)">(Hit = fire again!)</span>';
          sc.innerHTML = '<span style="color:#4ecdc4">P1: ' + P[0].score + '/' + TOTAL_PTS + 'pts</span> <span style="color:rgba(255,255,255,0.2)">|</span> <span style="color:#ff6b6b">P2: ' + P[1].score + '/' + TOTAL_PTS + 'pts</span>';
          sh.innerHTML = '';
        }

        /* Highlight active grid */
        var g0 = document.getElementById('bsBG0'), g1 = document.getElementById('bsBG1');
        var l0 = document.getElementById('bsBLbl0'), l1 = document.getElementById('bsBLbl1');
        if (turn === 0) {
          if (g1) g1.style.borderColor = 'rgba(255,107,107,0.5)';
          if (g0) g0.style.borderColor = 'rgba(0,100,200,0.2)';
          if (l1) l1.style.color = '#ff6b6b';
          if (l0) l0.style.color = 'rgba(78,205,196,0.5)';
        } else {
          if (g0) g0.style.borderColor = 'rgba(78,205,196,0.5)';
          if (g1) g1.style.borderColor = 'rgba(0,100,200,0.2)';
          if (l0) l0.style.color = '#4ecdc4';
          if (l1) l1.style.color = 'rgba(255,107,107,0.5)';
        }
      }

      /* ── START ── */
      if (mode === '1p') { aiPlaceAll(1); showPlacement(0); }
      else { showPlacement(0); }

      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });

  /* ── 17. Gem Miner (Minesweeper) ── */
  E.register({
    id: 'minesweeper', name: 'Gem Miner', emoji: '💎', category: 'board', has2P: false,
    init: function (container, mode, diff) {
      var SIZE = diff === 'easy' ? 5 : diff === 'hard' ? 7 : 6;
      var MINES = diff === 'easy' ? 4 : diff === 'hard' ? 10 : 6;
      var board = [], revealed = [], flagged = [];
      for (var i = 0; i < SIZE*SIZE; i++) { board[i] = 0; revealed[i] = false; flagged[i] = false; }
      var minePos = shuffle(Array.from({length:SIZE*SIZE},function(_,i){return i;})).slice(0,MINES);
      minePos.forEach(function(p) { board[p] = -1; });
      for (var y = 0; y < SIZE; y++) for (var x = 0; x < SIZE; x++) {
        if (board[y*SIZE+x] === -1) continue;
        var count = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var nx = x+dx, ny = y+dy;
          if (nx>=0 && nx<SIZE && ny>=0 && ny<SIZE && board[ny*SIZE+nx] === -1) count++;
        }
        board[y*SIZE+x] = count;
      }
      var flagMode = false;
      var div = makeWrap();
      var safeTotal = SIZE*SIZE - MINES, safeFound = 0;
      div.innerHTML = makeStatus('msStatus', '💎 Find safe cells! Avoid 💥 sandstorms!') +
        makeProgress('msProgress', 'linear-gradient(90deg,#00C9A7,#FFD700)') +
        '<div style="display:flex;gap:10px;margin-bottom:8px;align-items:center">' +
          '<button id="msFlagBtn" class="gbtn gbtn-outline" style="font-size:0.85rem;padding:6px 14px;border-radius:8px;cursor:pointer;transition:all 0.2s ease">🚩 Flag Mode: OFF</button>' +
          '<span style="font-family:Orbitron,sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.5)" id="msSafeCount">Safe: 0/' + safeTotal + '</span>' +
        '</div>' +
        '<div class="gboard" style="grid-template-columns:repeat(' + SIZE + ',50px);gap:3px;padding:10px;background:rgba(0,0,0,0.25);border-radius:14px;border:1px solid rgba(0,201,167,0.15)" id="msGrid"></div>';
      container.appendChild(div);
      var grid = div.querySelector('#msGrid'); var cells = [];
      var numColors = ['','#4488ff','#00C9A7','#ff4444','#9b59b6','#FF6B35','#00C9A7','#FFD700','#ffffff'];
      for (var j = 0; j < SIZE*SIZE; j++) {
        var c = document.createElement('div');
        c.className = 'gcell';
        c.style.cssText = 'height:50px;width:50px;font-size:0.95rem;font-weight:700;display:flex;align-items:center;justify-content:center;' +
          'background:linear-gradient(145deg,rgba(25,25,50,0.9),rgba(18,18,38,0.95));' +
          'border:1.5px solid rgba(0,201,167,0.2);border-radius:8px;cursor:pointer;transition:all 0.25s ease;' +
          'box-shadow:0 2px 6px rgba(0,0,0,0.3);font-family:Orbitron,sans-serif';
        c.textContent = '';
        c.setAttribute('data-i', j);
        c.onmouseenter = function () { if (!this.classList.contains('ms-revealed') && !dead) { this.style.borderColor = 'rgba(0,201,167,0.5)'; this.style.transform = 'scale(1.05)'; } };
        c.onmouseleave = function () { if (!this.classList.contains('ms-revealed')) { this.style.borderColor = 'rgba(0,201,167,0.2)'; this.style.transform = 'scale(1)'; } };
        grid.appendChild(c); cells.push(c);
      }
      // Flag mode toggle
      div.querySelector('#msFlagBtn').onclick = function () {
        flagMode = !flagMode;
        this.textContent = '🚩 Flag Mode: ' + (flagMode ? 'ON' : 'OFF');
        this.style.background = flagMode ? 'rgba(255,107,53,0.3)' : '';
        this.style.borderColor = flagMode ? 'rgba(255,107,53,0.6)' : '';
      };
      var dead = false;
      function updateProgress() {
        var pct = Math.max(0, safeFound / safeTotal * 100);
        div.querySelector('#msProgress').style.width = pct + '%';
        div.querySelector('#msSafeCount').textContent = 'Safe: ' + safeFound + '/' + safeTotal;
      }
      function revealCell(idx) {
        if (revealed[idx] || dead || flagged[idx]) return;
        revealed[idx] = true;
        cells[idx].classList.add('ms-revealed');
        if (board[idx] === -1) {
          cells[idx].textContent = '💥';
          cells[idx].style.background = 'radial-gradient(circle,rgba(255,50,50,0.5),rgba(200,0,0,0.3))';
          cells[idx].style.borderColor = 'rgba(255,50,50,0.6)';
          cells[idx].style.boxShadow = '0 0 20px rgba(255,50,50,0.5)';
          cells[idx].style.animation = 'bgExplosion 0.5s ease';
          dead = true; E.rashidSay('Sandstorm! 💥');
          minePos.forEach(function(p) {
            cells[p].textContent = '💥';
            cells[p].style.background = 'radial-gradient(circle,rgba(255,50,50,0.3),rgba(200,0,0,0.15))';
            cells[p].classList.add('ms-revealed');
          });
          E.endGame(safeFound, safeTotal);
          return;
        }
        safeFound++;
        updateProgress();
        cells[idx].style.background = 'linear-gradient(145deg,rgba(0,201,167,0.1),rgba(0,150,120,0.05))';
        cells[idx].style.borderColor = 'rgba(0,201,167,0.15)';
        cells[idx].style.animation = 'bgSparkle 0.4s ease';
        cells[idx].style.cursor = 'default';
        if (board[idx] === 0) {
          cells[idx].textContent = '';
          var x = idx % SIZE, y2 = Math.floor(idx / SIZE);
          for (var dy2 = -1; dy2 <= 1; dy2++) for (var dx2 = -1; dx2 <= 1; dx2++) {
            var nx2 = x+dx2, ny2 = y2+dy2;
            if (nx2>=0 && nx2<SIZE && ny2>=0 && ny2<SIZE) revealCell(ny2*SIZE+nx2);
          }
        } else {
          cells[idx].textContent = board[idx];
          cells[idx].style.color = numColors[board[idx]] || '#fff';
        }
        if (safeFound >= safeTotal) {
          E.rashidSay('All safe! 💎🎉');
          div.querySelector('#msStatus').innerHTML = '<span style="color:#FFD700;font-size:1.1rem">All gems found! 💎🎉</span>';
          div.querySelector('#msStatus').style.animation = 'bgCelebrate 0.8s ease';
          E.endGame(safeTotal, safeTotal);
        }
      }
      grid.onclick = function(e) {
        var t = e.target; if (!t.hasAttribute('data-i')) return;
        var idx = parseInt(t.getAttribute('data-i'));
        if (revealed[idx] || dead) return;
        if (flagMode) {
          flagged[idx] = !flagged[idx];
          cells[idx].textContent = flagged[idx] ? '🚩' : '';
          cells[idx].style.borderColor = flagged[idx] ? 'rgba(255,107,53,0.5)' : 'rgba(0,201,167,0.2)';
          return;
        }
        revealCell(idx);
      };
      return {};
    }, destroy: function() {}
  });

  /* ── 18. Dots & Boxes ── */
  E.register({
    id: 'dots-boxes', name: 'Dots & Boxes', emoji: '📦', category: 'board', has2P: true,
    init: function (container, mode, diff) {
      var N = 4;
      var hLines = [], vLines = [], boxes = [];
      for (var r = 0; r < N; r++) { hLines[r] = []; for (var c = 0; c < N-1; c++) hLines[r][c] = 0; }
      for (var r2 = 0; r2 < N-1; r2++) { vLines[r2] = []; for (var c2 = 0; c2 < N; c2++) vLines[r2][c2] = 0; }
      for (var r3 = 0; r3 < N-1; r3++) { boxes[r3] = []; for (var c3 = 0; c3 < N-1; c3++) boxes[r3][c3] = 0; }
      var turn = 1, score1 = 0, score2 = 0, done = false;
      var div = makeWrap();
      div.innerHTML = makeStatus('dbStatus', '<span style="color:#FFD700">Player 1 (🟡)</span> turn') +
        '<canvas id="dbCanvas" width="320" height="320" style="border-radius:14px;border:1px solid rgba(255,215,0,0.15);cursor:pointer;background:linear-gradient(145deg,rgba(10,10,25,0.95),rgba(5,5,15,0.98))"></canvas>' +
        '<div class="gtext gmt" id="dbScore" style="font-family:Orbitron,sans-serif;font-size:0.95rem">' +
          '<span style="color:#FFD700">🟡 P1: 0</span> &nbsp;|&nbsp; <span style="color:#00C9A7">🟢 ' + (mode==='2p'?'P2':'Rashid') + ': 0</span></div>';
      container.appendChild(div);
      var canvas = div.querySelector('#dbCanvas');
      var ctx = canvas.getContext('2d');
      var GAP = 72, OFF = 22;

      function drawBoard() {
        ctx.fillStyle = 'rgba(8,8,20,1)'; ctx.fillRect(0, 0, 320, 320);
        // Box fills with animation feel
        for (var r = 0; r < N-1; r++) for (var c = 0; c < N-1; c++) {
          if (boxes[r][c] === 1) {
            ctx.fillStyle = 'rgba(255,215,0,0.12)';
            ctx.fillRect(OFF+c*GAP+3, OFF+r*GAP+3, GAP-6, GAP-6);
            ctx.strokeStyle = 'rgba(255,215,0,0.25)'; ctx.lineWidth = 1;
            ctx.strokeRect(OFF+c*GAP+3, OFF+r*GAP+3, GAP-6, GAP-6);
          } else if (boxes[r][c] === 2) {
            ctx.fillStyle = 'rgba(0,201,167,0.12)';
            ctx.fillRect(OFF+c*GAP+3, OFF+r*GAP+3, GAP-6, GAP-6);
            ctx.strokeStyle = 'rgba(0,201,167,0.25)'; ctx.lineWidth = 1;
            ctx.strokeRect(OFF+c*GAP+3, OFF+r*GAP+3, GAP-6, GAP-6);
          }
        }
        // Horizontal lines
        for (var r2 = 0; r2 < N; r2++) for (var c2 = 0; c2 < N-1; c2++) {
          ctx.strokeStyle = hLines[r2][c2] ? (hLines[r2][c2]===1?'#FFD700':'#00C9A7') : 'rgba(255,255,255,0.08)';
          ctx.lineWidth = hLines[r2][c2] ? 4 : 1.5;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(OFF+c2*GAP, OFF+r2*GAP); ctx.lineTo(OFF+(c2+1)*GAP, OFF+r2*GAP); ctx.stroke();
          if (hLines[r2][c2]) {
            ctx.shadowColor = hLines[r2][c2]===1 ? 'rgba(255,215,0,0.4)' : 'rgba(0,201,167,0.4)';
            ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.moveTo(OFF+c2*GAP, OFF+r2*GAP); ctx.lineTo(OFF+(c2+1)*GAP, OFF+r2*GAP); ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
        // Vertical lines
        for (var r3 = 0; r3 < N-1; r3++) for (var c3 = 0; c3 < N; c3++) {
          ctx.strokeStyle = vLines[r3][c3] ? (vLines[r3][c3]===1?'#FFD700':'#00C9A7') : 'rgba(255,255,255,0.08)';
          ctx.lineWidth = vLines[r3][c3] ? 4 : 1.5;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(OFF+c3*GAP, OFF+r3*GAP); ctx.lineTo(OFF+c3*GAP, OFF+(r3+1)*GAP); ctx.stroke();
          if (vLines[r3][c3]) {
            ctx.shadowColor = vLines[r3][c3]===1 ? 'rgba(255,215,0,0.4)' : 'rgba(0,201,167,0.4)';
            ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.moveTo(OFF+c3*GAP, OFF+r3*GAP); ctx.lineTo(OFF+c3*GAP, OFF+(r3+1)*GAP); ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
        // Dots with glow
        for (var r4 = 0; r4 < N; r4++) for (var c4 = 0; c4 < N; c4++) {
          ctx.shadowColor = 'rgba(255,215,0,0.6)'; ctx.shadowBlur = 8;
          ctx.fillStyle = '#FFD700';
          ctx.beginPath(); ctx.arc(OFF+c4*GAP, OFF+r4*GAP, 5, 0, Math.PI*2); ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      function boxSides(r, c) {
        var count = 0;
        if (hLines[r] && hLines[r][c]) count++;
        if (hLines[r+1] && hLines[r+1][c]) count++;
        if (vLines[r] && vLines[r][c] !== undefined && vLines[r][c]) count++;
        if (vLines[r] && vLines[r][c+1] !== undefined && vLines[r][c+1]) count++;
        return count;
      }

      function checkBoxes() {
        var scored = false;
        for (var r = 0; r < N-1; r++) for (var c = 0; c < N-1; c++) {
          if (boxes[r][c] !== 0) continue;
          if (hLines[r][c] && hLines[r+1][c] && vLines[r][c] && vLines[r][c+1]) {
            boxes[r][c] = turn; if (turn === 1) score1++; else score2++; scored = true;
          }
        }
        return scored;
      }

      function allDone() {
        for (var r = 0; r < N-1; r++) for (var c = 0; c < N-1; c++) if (boxes[r][c] === 0) return false;
        return true;
      }

      function updateUI() {
        drawBoard();
        div.querySelector('#dbScore').innerHTML = '<span style="color:#FFD700">🟡 P1: ' + score1 + '</span> &nbsp;|&nbsp; <span style="color:#00C9A7">🟢 ' + (mode==='2p'?'P2':'Rashid') + ': ' + score2 + '</span>';
        var turnColor = turn === 1 ? '#FFD700' : '#00C9A7';
        var turnName = turn===1?'Player 1 (🟡)':(mode==='2p'?'Player 2 (🟢)':'Rashid thinking...');
        div.querySelector('#dbStatus').innerHTML = '<span style="color:' + turnColor + '">' + turnName + ' turn</span>';
      }

      function handleClick(mx, my) {
        if (done) return;
        var bestDist = 99, bestType = '', bestR = 0, bestC = 0;
        for (var r = 0; r < N; r++) for (var c = 0; c < N-1; c++) {
          var cx = OFF + c*GAP + GAP/2, cy = OFF + r*GAP;
          var d = Math.abs(mx-cx) + Math.abs(my-cy);
          if (d < bestDist && !hLines[r][c]) { bestDist = d; bestType = 'h'; bestR = r; bestC = c; }
        }
        for (var r2 = 0; r2 < N-1; r2++) for (var c2 = 0; c2 < N; c2++) {
          var cx2 = OFF + c2*GAP, cy2 = OFF + r2*GAP + GAP/2;
          var d2 = Math.abs(mx-cx2) + Math.abs(my-cy2);
          if (d2 < bestDist && !vLines[r2][c2]) { bestDist = d2; bestType = 'v'; bestR = r2; bestC = c2; }
        }
        if (bestDist > 30) return;
        if (bestType === 'h') hLines[bestR][bestC] = turn;
        else vLines[bestR][bestC] = turn;
        var scored = checkBoxes();
        if (allDone()) { done = true; updateUI();
          var w = score1 > score2 ? 'Player 1 wins!' : score2 > score1 ? (mode==='2p'?'Player 2 wins!':'Rashid wins!') : 'Draw!';
          div.querySelector('#dbStatus').innerHTML = '<span style="color:#FFD700;font-size:1.1rem">' + w + '</span>';
          E.endGame(score1, score1 + score2);
          return;
        }
        if (!scored) turn = turn === 1 ? 2 : 1;
        updateUI();
        if (turn === 2 && mode === '1p') setTimeout(aiTurn, 500);
      }

      function aiTurn() {
        if (done) return;
        var avail = [];
        for (var r = 0; r < N; r++) for (var c = 0; c < N-1; c++) if (!hLines[r][c]) avail.push({t:'h',r:r,c:c});
        for (var r2 = 0; r2 < N-1; r2++) for (var c2 = 0; c2 < N; c2++) if (!vLines[r2][c2]) avail.push({t:'v',r:r2,c:c2});
        if (avail.length === 0) return;

        if (diff === 'easy') {
          var move = pick(avail);
          if (move.t === 'h') hLines[move.r][move.c] = 2; else vLines[move.r][move.c] = 2;
        } else {
          var boxMove = null;
          for (var i = 0; i < avail.length; i++) {
            var m = avail[i];
            if (m.t === 'h') hLines[m.r][m.c] = 2; else vLines[m.r][m.c] = 2;
            var wouldScore = false;
            for (var rr = 0; rr < N-1; rr++) for (var cc = 0; cc < N-1; cc++) {
              if (boxes[rr][cc] === 0 && hLines[rr][cc] && hLines[rr+1][cc] && vLines[rr][cc] && vLines[rr][cc+1]) wouldScore = true;
            }
            if (m.t === 'h') hLines[m.r][m.c] = 0; else vLines[m.r][m.c] = 0;
            if (wouldScore) { boxMove = m; break; }
          }
          if (boxMove) {
            if (boxMove.t === 'h') hLines[boxMove.r][boxMove.c] = 2; else vLines[boxMove.r][boxMove.c] = 2;
          } else if (diff === 'hard') {
            var safe = avail.filter(function(m) {
              if (m.t === 'h') hLines[m.r][m.c] = 2; else vLines[m.r][m.c] = 2;
              var gives = false;
              for (var rr = 0; rr < N-1; rr++) for (var cc = 0; cc < N-1; cc++) {
                if (boxes[rr][cc] === 0 && boxSides(rr, cc) === 3) gives = true;
              }
              if (m.t === 'h') hLines[m.r][m.c] = 0; else vLines[m.r][m.c] = 0;
              return !gives;
            });
            var chosen = safe.length > 0 ? pick(safe) : pick(avail);
            if (chosen.t === 'h') hLines[chosen.r][chosen.c] = 2; else vLines[chosen.r][chosen.c] = 2;
          } else {
            var move2 = pick(avail);
            if (move2.t === 'h') hLines[move2.r][move2.c] = 2; else vLines[move2.r][move2.c] = 2;
          }
        }

        var scored = checkBoxes();
        if (allDone()) { done = true; updateUI();
          var w = score1 > score2 ? 'Player 1 wins!' : score2 > score1 ? 'Rashid wins!' : 'Draw!';
          div.querySelector('#dbStatus').innerHTML = '<span style="color:#FFD700;font-size:1.1rem">' + w + '</span>';
          E.endGame(score1, score1+score2); return;
        }
        if (!scored) turn = 1;
        else if (mode === '1p') { updateUI(); setTimeout(aiTurn, 400); return; }
        updateUI();
      }

      canvas.onclick = function(e) {
        if (turn === 2 && mode === '1p') return;
        var rect = canvas.getBoundingClientRect();
        handleClick(e.clientX - rect.left, e.clientY - rect.top);
      };

      drawBoard();
      return {};
    }, destroy: function() {}
  });

  /* ── 19. Lights Out ── */
  E.register({
    id: 'lights-out', name: 'Lights Out', emoji: '💡', category: 'board', has2P: false,
    init: function (container, mode, diff) {
      var SIZE = diff === 'easy' ? 4 : diff === 'hard' ? 6 : 5;
      var board = [];
      for (var i = 0; i < SIZE*SIZE; i++) board[i] = Math.random() < 0.5;
      var moves = 0, litCount = 0;
      board.forEach(function (b) { if (b) litCount++; });
      var div = makeWrap();
      div.innerHTML = makeStatus('loStatus', '💡 Turn all lights OFF! &nbsp; <span class="bg-score">Moves: 0</span>') +
        makeProgress('loProgress', 'linear-gradient(90deg,#FFD700,#FF6B35)') +
        '<div style="display:flex;gap:10px;margin-bottom:8px;align-items:center">' +
          '<span style="font-family:Orbitron,sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.5)" id="loLitCount">Lights on: ' + litCount + '</span>' +
          (diff === 'easy' ? '<button id="loHintBtn" class="gbtn gbtn-outline" style="font-size:0.75rem;padding:4px 10px;border-radius:8px;cursor:pointer">💡 Hint</button>' : '') +
        '</div>' +
        '<div class="gboard" style="grid-template-columns:repeat(' + SIZE + ',58px);gap:4px;padding:12px;background:rgba(0,0,0,0.3);border-radius:14px;border:1px solid rgba(255,215,0,0.1)" id="loGrid"></div>';
      container.appendChild(div);
      var grid = div.querySelector('#loGrid'); var cells = [];
      for (var j = 0; j < SIZE*SIZE; j++) {
        var c = document.createElement('div');
        c.className = 'gcell';
        c.style.cssText = 'height:58px;width:58px;font-size:1.6rem;display:flex;align-items:center;justify-content:center;' +
          'border-radius:12px;cursor:pointer;transition:all 0.3s ease;' +
          'border:2px solid rgba(255,215,0,0.15)';
        c.setAttribute('data-i', j); grid.appendChild(c); cells.push(c);
      }
      function render() {
        litCount = 0;
        for (var i = 0; i < SIZE*SIZE; i++) {
          if (board[i]) {
            litCount++;
            cells[i].textContent = '💡';
            cells[i].style.background = 'radial-gradient(circle at 50% 40%,rgba(255,235,150,0.4),rgba(255,215,0,0.15))';
            cells[i].style.boxShadow = '0 0 20px rgba(255,215,0,0.4),0 0 40px rgba(255,215,0,0.15)';
            cells[i].style.borderColor = 'rgba(255,215,0,0.4)';
          } else {
            cells[i].textContent = '⬛';
            cells[i].style.background = 'linear-gradient(145deg,rgba(15,15,30,0.9),rgba(10,10,20,0.95))';
            cells[i].style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.5)';
            cells[i].style.borderColor = 'rgba(255,255,255,0.06)';
          }
        }
        var pct = litCount > 0 ? ((SIZE * SIZE - litCount) / (SIZE * SIZE)) * 100 : 100;
        div.querySelector('#loProgress').style.width = pct + '%';
        div.querySelector('#loLitCount').textContent = 'Lights on: ' + litCount;
      }
      function toggle(idx) {
        var x = idx % SIZE, y = Math.floor(idx / SIZE);
        board[idx] = !board[idx];
        if (x > 0) board[idx-1] = !board[idx-1];
        if (x < SIZE-1) board[idx+1] = !board[idx+1];
        if (y > 0) board[idx-SIZE] = !board[idx-SIZE];
        if (y < SIZE-1) board[idx+SIZE] = !board[idx+SIZE];
      }
      function allOff() { return board.every(function(b) { return !b; }); }
      // Hint system for easy mode
      if (diff === 'easy') {
        var hintBtn = div.querySelector('#loHintBtn');
        if (hintBtn) {
          hintBtn.onclick = function () {
            // Find a lit cell and flash it
            for (var i = 0; i < SIZE*SIZE; i++) {
              if (board[i]) {
                cells[i].style.animation = 'bgNeonPulse 0.5s ease 3';
                setTimeout((function (idx) { return function () { cells[idx].style.animation = ''; }; })(i), 1600);
                break;
              }
            }
          };
        }
      }
      grid.onclick = function(e) {
        var t = e.target; if (!t.hasAttribute('data-i')) return;
        var idx = parseInt(t.getAttribute('data-i'));
        toggle(idx); moves++; render();
        // Animate toggled cells
        var x = idx % SIZE, y = Math.floor(idx / SIZE);
        var affected = [idx];
        if (x > 0) affected.push(idx - 1);
        if (x < SIZE - 1) affected.push(idx + 1);
        if (y > 0) affected.push(idx - SIZE);
        if (y < SIZE - 1) affected.push(idx + SIZE);
        affected.forEach(function (ai) {
          cells[ai].style.animation = 'none'; cells[ai].offsetHeight;
          cells[ai].style.animation = 'bgPulse 0.3s ease';
        });
        div.querySelector('#loStatus').innerHTML = '💡 Turn all lights OFF! &nbsp; <span class="bg-score">Moves: ' + moves + '</span>';
        if (allOff()) {
          E.rashidSay('Brilliant! All off! 🌙');
          div.querySelector('#loStatus').innerHTML = '<span style="color:#FFD700;font-size:1.1rem">All lights off in ' + moves + ' moves! 🌙🎉</span>';
          div.querySelector('#loStatus').style.animation = 'bgCelebrate 0.8s ease';
          E.endGame(Math.max(1, SIZE * SIZE - moves), SIZE * SIZE);
        }
      };
      render();
      return {};
    }, destroy: function() {}
  });

  /* ── 20. Sliding Puzzle ── */
  E.register({
    id: 'sliding-puzzle', name: 'Sliding Puzzle', emoji: '🧩', category: 'board', has2P: false,
    init: function (container, mode, diff) {
      var SIZE = diff === 'easy' ? 3 : diff === 'hard' ? 4 : 3;
      var total = SIZE*SIZE;
      var tiles = []; for (var i = 1; i < total; i++) tiles.push(i); tiles.push(0);
      var shuffleMoves = diff === 'easy' ? 30 : diff === 'hard' ? 500 : 200;
      for (var s = 0; s < shuffleMoves; s++) {
        var empty = tiles.indexOf(0);
        var ex = empty % SIZE, ey = Math.floor(empty / SIZE);
        var dirs = []; if (ex > 0) dirs.push(-1); if (ex < SIZE-1) dirs.push(1); if (ey > 0) dirs.push(-SIZE); if (ey < SIZE-1) dirs.push(SIZE);
        var d = pick(dirs); tiles[empty] = tiles[empty + d]; tiles[empty + d] = 0;
      }
      var moves = 0;
      var tileSize = SIZE <= 3 ? 80 : 65;
      var div = makeWrap();
      var maxTile = total - 1;
      div.innerHTML = makeStatus('spStatus', '🧩 Order tiles 1-' + maxTile + '! &nbsp; <span class="bg-score">Moves: 0</span>') +
        makeProgress('spProgress', 'linear-gradient(90deg,#00C9A7,#FFD700)') +
        '<div class="gboard" style="grid-template-columns:repeat(' + SIZE + ',' + tileSize + 'px);gap:5px;padding:12px;background:rgba(0,0,0,0.3);border-radius:14px;border:1px solid rgba(0,201,167,0.15)" id="spGrid"></div>';
      container.appendChild(div);
      var grid = div.querySelector('#spGrid');
      var tileColors = ['#FF6B35','#FFD700','#00C9A7','#4ecdc4','#ff6b6b','#9b59b6','#3498db','#e74c3c',
                        '#2ecc71','#f39c12','#1abc9c','#e67e22','#16a085','#d35400','#8e44ad'];
      function render() {
        grid.innerHTML = '';
        var correctCount = 0;
        tiles.forEach(function(t, i) {
          var c = document.createElement('div');
          c.className = 'gcell';
          var isCorrect = (t !== 0 && t === i + 1);
          if (isCorrect) correctCount++;
          if (t === 0) {
            c.style.cssText = 'height:' + tileSize + 'px;width:' + tileSize + 'px;background:transparent;border:2px dashed rgba(255,255,255,0.06);border-radius:10px';
          } else {
            var baseColor = tileColors[(t - 1) % tileColors.length];
            c.style.cssText = 'height:' + tileSize + 'px;width:' + tileSize + 'px;font-size:' + (SIZE <= 3 ? '1.6rem' : '1.2rem') + ';font-weight:800;' +
              'font-family:Orbitron,sans-serif;display:flex;align-items:center;justify-content:center;' +
              'background:linear-gradient(145deg,' + baseColor + 'cc,' + baseColor + '88);' +
              'border:2px solid ' + baseColor + ';border-radius:10px;cursor:pointer;transition:all 0.2s ease;' +
              'box-shadow:0 4px 12px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.2);' +
              'color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.5)';
            if (isCorrect) {
              c.style.borderColor = '#00C9A7';
              c.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.2),0 0 10px rgba(0,201,167,0.3)';
            }
          }
          c.textContent = t === 0 ? '' : t;
          c.setAttribute('data-i', i);
          grid.appendChild(c);
        });
        // Update progress
        var pct = (correctCount / maxTile) * 100;
        div.querySelector('#spProgress').style.width = pct + '%';
      }
      function isSolved() { for (var i = 0; i < total - 1; i++) if (tiles[i] !== i + 1) return false; return tiles[total-1] === 0; }
      grid.onclick = function(e) {
        var t = e.target; if (!t.hasAttribute('data-i')) return;
        var idx = parseInt(t.getAttribute('data-i'));
        var empty = tiles.indexOf(0);
        var ex = empty%SIZE, ey = Math.floor(empty/SIZE), tx = idx%SIZE, ty = Math.floor(idx/SIZE);
        if ((Math.abs(ex-tx) === 1 && ey === ty) || (Math.abs(ey-ty) === 1 && ex === tx)) {
          tiles[empty] = tiles[idx]; tiles[idx] = 0; moves++; render();
          div.querySelector('#spStatus').innerHTML = '🧩 Order tiles 1-' + maxTile + '! &nbsp; <span class="bg-score">Moves: ' + moves + '</span>';
          if (isSolved()) {
            E.rashidSay('Solved! 🧩🎉');
            div.querySelector('#spStatus').innerHTML = '<span style="color:#FFD700;font-size:1.1rem">Solved in ' + moves + ' moves! 🧩🎉</span>';
            div.querySelector('#spStatus').style.animation = 'bgCelebrate 0.8s ease';
            E.endGame(Math.max(1, total * 4 - moves), total * 4);
          }
        }
      };
      render();
      return {};
    }, destroy: function() {}
  });

  /* ── 21. Tower Stack ── */
  E.register({
    id: 'tower-stack', name: 'Tower Stack', emoji: '🏗️', category: 'board', has2P: false,
    _running: false,
    init: function (container, mode, diff) {
      var CW = 320, CH = 520;
      var div = makeWrap();
      div.innerHTML = '<div style="position:relative;display:inline-block">' +
        '<canvas id="tsCanvas" width="' + CW + '" height="' + CH + '" style="border-radius:14px;cursor:pointer;display:block"></canvas>' +
        '<div id="tsHeightMeter" style="position:absolute;right:6px;top:30px;bottom:40px;width:14px;background:rgba(255,255,255,0.05);border-radius:7px;overflow:hidden">' +
          '<div id="tsHeightFill" style="position:absolute;bottom:0;left:0;width:100%;height:0%;background:linear-gradient(0deg,#00C9A7,#FFD700);border-radius:7px;transition:height 0.3s ease"></div>' +
        '</div>' +
        '</div>' +
        '<div style="font-family:Inter,sans-serif;font-size:0.75rem;color:rgba(255,255,255,0.35);margin-top:6px">Click / Space / Tap to drop</div>';
      container.appendChild(div);
      var canvas = div.querySelector('#tsCanvas');
      var ctx = canvas.getContext('2d');
      var baseSpeed = diff === 'easy' ? 2 : diff === 'hard' ? 4.5 : 3;
      var accel = diff === 'easy' ? 0.1 : diff === 'hard' ? 0.3 : 0.2;
      var blocks = [], currentBlock = { x: 0, w: 80, dir: 1, speed: baseSpeed };
      var baseY = CH - 30, blockH = 25, sc = 0;
      this._running = true; var self = this;
      blocks.push({ x: CW/2 - 40, w: 80, y: baseY });
      var perfectText = '', perfectTimer = 0;
      var cameraOffset = 0;
      var blockGradients = [
        ['#FF6B35','#ff8c5a'], ['#FFD700','#ffe44d'], ['#00C9A7','#33e0c0'],
        ['#4ecdc4','#6ee0d8'], ['#ff6b6b','#ff8e8e'], ['#9b59b6','#b07cc6'], ['#3498db','#5dade2']
      ];

      E.loop(function () {
        if (!self._running) return;
        currentBlock.x += currentBlock.dir * currentBlock.speed;
        if (currentBlock.x + currentBlock.w > CW - 20 || currentBlock.x < 20) currentBlock.dir *= -1;

        // Camera scroll: keep top blocks visible
        var targetOffset = Math.max(0, (blocks.length * blockH) - (CH - 100));
        cameraOffset += (targetOffset - cameraOffset) * 0.08;

        ctx.fillStyle = '#0a0a18'; ctx.fillRect(0, 0, CW, CH);
        // Starfield background
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        for (var star = 0; star < 30; star++) {
          var sx = (star * 73 + 17) % CW, sy = (star * 47 + 31) % CH;
          ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2); ctx.fill();
        }
        // Ground
        var groundY = baseY + cameraOffset;
        ctx.fillStyle = 'linear-gradient(0deg,#2a1a0a,#C4935A)';
        ctx.fillStyle = '#C4935A';
        ctx.fillRect(0, groundY, CW, CH - groundY + 50);
        ctx.fillStyle = '#a07040';
        ctx.fillRect(0, groundY, CW, 3);

        // Draw existing blocks
        blocks.forEach(function(b, i) {
          var gc = blockGradients[i % blockGradients.length];
          var drawY = b.y + cameraOffset;
          if (drawY > CH + 30 || drawY < -30) return;
          var grad = ctx.createLinearGradient(b.x, drawY, b.x, drawY + blockH);
          grad.addColorStop(0, gc[1]); grad.addColorStop(1, gc[0]);
          ctx.fillStyle = grad;
          ctx.fillRect(b.x, drawY, b.w, blockH - 2);
          // Top highlight
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(b.x + 2, drawY, b.w - 4, 3);
          // Bottom shadow
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.fillRect(b.x, drawY + blockH - 4, b.w, 2);
          ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1;
          ctx.strokeRect(b.x, drawY, b.w, blockH - 2);
        });

        // Current moving block
        var cy = baseY - (blocks.length) * blockH + cameraOffset;
        var cGc = blockGradients[blocks.length % blockGradients.length];
        var cGrad = ctx.createLinearGradient(currentBlock.x, cy, currentBlock.x, cy + blockH);
        cGrad.addColorStop(0, cGc[1]); cGrad.addColorStop(1, cGc[0]);
        ctx.fillStyle = cGrad;
        ctx.fillRect(currentBlock.x, cy, currentBlock.w, blockH - 2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(currentBlock.x + 2, cy, currentBlock.w - 4, 3);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
        ctx.strokeRect(currentBlock.x, cy, currentBlock.w, blockH - 2);

        // Score
        ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Orbitron,sans-serif'; ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(255,215,0,0.5)'; ctx.shadowBlur = 10;
        ctx.fillText('Height: ' + sc, CW/2, 25);
        ctx.shadowBlur = 0;

        // Perfect text
        if (perfectTimer > 0) {
          perfectTimer--;
          ctx.save();
          var pa = Math.min(1, perfectTimer / 20);
          ctx.globalAlpha = pa;
          ctx.fillStyle = perfectText === 'PERFECT!' ? '#00C9A7' : '#FFD700';
          ctx.font = 'bold 26px Orbitron,sans-serif'; ctx.textAlign = 'center';
          ctx.shadowColor = perfectText === 'PERFECT!' ? 'rgba(0,201,167,0.8)' : 'rgba(255,215,0,0.8)';
          ctx.shadowBlur = 15;
          ctx.fillText(perfectText, CW/2, CH/2 - 30 + (60 - perfectTimer) * 0.3);
          ctx.shadowBlur = 0;
          ctx.restore();
        }

        // Height meter
        var hPct = Math.min(100, (sc / 15) * 100);
        div.querySelector('#tsHeightFill').style.height = hPct + '%';
      });

      function dropBlock() {
        if (!self._running) return;
        var prev = blocks[blocks.length - 1];
        var overlapStart = Math.max(currentBlock.x, prev.x);
        var overlapEnd = Math.min(currentBlock.x + currentBlock.w, prev.x + prev.w);
        var overlapW = overlapEnd - overlapStart;
        if (overlapW <= 0) {
          self._running = false;
          perfectText = 'GAME OVER'; perfectTimer = 90;
          E.endGame(sc, sc || 1); return;
        }
        var isPerfect = false;
        if (Math.abs(currentBlock.x - prev.x) <= 3 && Math.abs(currentBlock.w - prev.w) <= 3) {
          overlapStart = prev.x; overlapW = prev.w; isPerfect = true;
          perfectText = 'PERFECT!'; perfectTimer = 60;
        } else if (overlapW > prev.w * 0.85) {
          perfectText = 'GREAT!'; perfectTimer = 40;
        }
        var cy = baseY - blocks.length * blockH;
        blocks.push({ x: overlapStart, w: overlapW, y: cy });
        currentBlock.x = 0; currentBlock.w = overlapW;
        currentBlock.speed = Math.min(8, baseSpeed + sc * accel);
        sc++; if (isPerfect) sc++;
        E.setScore(sc);
        if (sc >= 15) { self._running = false; E.rashidSay('15 blocks! Amazing! 🏗️'); E.endGame(15, 15); }
      }

      canvas.onclick = dropBlock;
      canvas.ontouchstart = function(e) { e.preventDefault(); dropBlock(); };
      this._keyHandler = function(e) { if (e.code === 'Space') { e.preventDefault(); dropBlock(); } };
      document.addEventListener('keydown', this._keyHandler);
      return {};
    },
    destroy: function () { this._running = false; if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler); }
  });

  /* ── 22. Desert Pong ── */
  E.register({
    id: 'pong', name: 'Desert Pong', emoji: '🏓', category: 'board', has2P: true,
    _running: false,
    init: function (container, mode, diff) {
      var CW = 520, CH = 370;
      var div = makeWrap();
      div.innerHTML = '<canvas id="pongCanvas" width="' + CW + '" height="' + CH + '" style="border-radius:14px;cursor:none;display:block"></canvas>' +
        '<div style="display:flex;justify-content:space-between;width:100%;max-width:' + CW + 'px;margin-top:6px;font-family:Inter,sans-serif;font-size:0.7rem;color:rgba(255,255,255,0.3)">' +
          '<span>W/S - Player 1</span>' +
          '<span>' + (mode === '2p' ? 'Arrow Keys - Player 2' : 'AI - Rashid') + '</span>' +
        '</div>';
      container.appendChild(div);
      var canvas = div.querySelector('#pongCanvas');
      var ctx = canvas.getContext('2d');
      var padH = 65, padW = 12, ballR = 8;
      var aiSpeed = diff === 'easy' ? 2 : diff === 'hard' ? 5.5 : 3.5;
      var aiDeadzone = diff === 'easy' ? 25 : diff === 'hard' ? 5 : 10;
      var ballSpeed = diff === 'easy' ? 3.5 : diff === 'hard' ? 5 : 4;
      var p1 = { y: CH/2 }, p2 = { y: CH/2 };
      var ball = { x: CW/2, y: CH/2, vx: ballSpeed, vy: 2 };
      var score1 = 0, score2 = 0, maxScore = 5, keys = {};
      var trail = [], flashTimer = 0, hitFlash = 0;
      var speedText = '', speedTimer = 0;
      this._running = true; var self = this;

      this._keyHandler = function(e) { keys[e.key] = e.type === 'keydown'; };
      document.addEventListener('keydown', this._keyHandler);
      document.addEventListener('keyup', this._keyHandler);

      E.loop(function() {
        if (!self._running) return;
        if (keys.w || keys.W) p1.y -= 5;
        if (keys.s || keys.S) p1.y += 5;
        p1.y = clamp(p1.y, padH/2, CH - padH/2);
        if (mode === '2p') {
          if (keys.ArrowUp) p2.y -= 5; if (keys.ArrowDown) p2.y += 5;
        } else {
          if (ball.vx > 0) {
            if (p2.y < ball.y - aiDeadzone) p2.y += aiSpeed;
            else if (p2.y > ball.y + aiDeadzone) p2.y -= aiSpeed;
          } else if (diff === 'easy') {
            if (p2.y < CH/2 - 10) p2.y += 1; else if (p2.y > CH/2 + 10) p2.y -= 1;
          }
        }
        p2.y = clamp(p2.y, padH/2, CH - padH/2);
        ball.x += ball.vx; ball.y += ball.vy;
        if (ball.y < ballR || ball.y > CH - ballR) ball.vy *= -1;
        // Paddle collision with speed boost feedback
        if (ball.x - ballR < padW + 18 && ball.y > p1.y - padH/2 && ball.y < p1.y + padH/2 && ball.vx < 0) {
          ball.vx *= -1.02; ball.vy += (ball.y - p1.y) * 0.1; hitFlash = 8;
          if (Math.abs(ball.vx) > ballSpeed * 1.3) { speedText = 'SPEED UP!'; speedTimer = 30; }
        }
        if (ball.x + ballR > CW - padW - 18 && ball.y > p2.y - padH/2 && ball.y < p2.y + padH/2 && ball.vx > 0) {
          ball.vx *= -1.02; ball.vy += (ball.y - p2.y) * 0.1; hitFlash = 8;
          if (Math.abs(ball.vx) > ballSpeed * 1.3) { speedText = 'SPEED UP!'; speedTimer = 30; }
        }
        // Cap speed
        if (Math.abs(ball.vx) > 9) ball.vx = ball.vx > 0 ? 9 : -9;
        if (ball.x < 0) { score2++; ball.x = CW/2; ball.y = CH/2; ball.vx = ballSpeed; ball.vy = 2; trail = []; flashTimer = 15; }
        if (ball.x > CW) { score1++; ball.x = CW/2; ball.y = CH/2; ball.vx = -ballSpeed; ball.vy = -2; trail = []; flashTimer = 15; }
        if (score1 >= maxScore) { self._running = false; E.rashidSay('Player 1 wins! 🏆'); E.endGame(score1, maxScore); return; }
        if (score2 >= maxScore) { self._running = false; var w = mode==='2p'?'Player 2':'Rashid'; E.rashidSay(w+' wins!'); E.endGame(score1, maxScore); return; }
        trail.push({ x: ball.x, y: ball.y }); if (trail.length > 12) trail.shift();

        // Background
        ctx.fillStyle = '#080818'; ctx.fillRect(0, 0, CW, CH);
        // Border glow
        ctx.strokeStyle = 'rgba(255,215,0,0.08)'; ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, CW - 2, CH - 2);
        // Center line with dots
        ctx.fillStyle = 'rgba(255,215,0,0.12)';
        for (var dotY = 10; dotY < CH; dotY += 18) {
          ctx.beginPath(); ctx.arc(CW/2, dotY, 2.5, 0, Math.PI * 2); ctx.fill();
        }

        // Paddle 1 with glow
        ctx.shadowColor = 'rgba(255,215,0,0.6)'; ctx.shadowBlur = 15;
        var p1Grad = ctx.createLinearGradient(18, p1.y - padH/2, 18 + padW, p1.y - padH/2);
        p1Grad.addColorStop(0, '#FFD700'); p1Grad.addColorStop(1, '#ffaa00');
        ctx.fillStyle = p1Grad;
        ctx.beginPath();
        ctx.roundRect(18, p1.y - padH/2, padW, padH, 4);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Paddle 2 with glow
        ctx.shadowColor = 'rgba(0,201,167,0.6)'; ctx.shadowBlur = 15;
        var p2Grad = ctx.createLinearGradient(CW - 18 - padW, p2.y - padH/2, CW - 18, p2.y - padH/2);
        p2Grad.addColorStop(0, '#00C9A7'); p2Grad.addColorStop(1, '#00a88e');
        ctx.fillStyle = p2Grad;
        ctx.beginPath();
        ctx.roundRect(CW - 18 - padW, p2.y - padH/2, padW, padH, 4);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Ball trail particles
        for (var ti = 0; ti < trail.length; ti++) {
          var alpha = (ti + 1) / trail.length * 0.4;
          var radius = ballR * ((ti + 1) / trail.length) * 0.7;
          ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
          ctx.beginPath(); ctx.arc(trail[ti].x, trail[ti].y, radius, 0, Math.PI*2); ctx.fill();
        }
        // Ball with glow
        ctx.shadowColor = 'rgba(255,255,255,0.8)'; ctx.shadowBlur = 12;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(ball.x, ball.y, ballR, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
        // Ball highlight
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath(); ctx.arc(ball.x - 2, ball.y - 2, ballR * 0.4, 0, Math.PI * 2); ctx.fill();

        // Hit flash
        if (hitFlash > 0) { hitFlash--; ctx.fillStyle = 'rgba(255,255,255,' + (hitFlash / 8 * 0.15) + ')'; ctx.fillRect(0, 0, CW, CH); }

        // Score with neon glow
        ctx.textAlign = 'center'; ctx.font = 'bold 32px Orbitron,sans-serif';
        ctx.shadowColor = 'rgba(255,215,0,0.7)'; ctx.shadowBlur = 12;
        ctx.fillStyle = '#FFD700'; ctx.fillText(score1, CW/2 - 55, 45);
        ctx.shadowColor = 'rgba(0,201,167,0.7)';
        ctx.fillStyle = '#00C9A7'; ctx.fillText(score2, CW/2 + 55, 45);
        ctx.shadowBlur = 0;

        // Dash between scores
        ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = 'bold 20px Orbitron,sans-serif';
        ctx.fillText('-', CW/2, 43);

        // Speed text
        if (speedTimer > 0) {
          speedTimer--;
          ctx.save();
          ctx.globalAlpha = Math.min(1, speedTimer / 10);
          ctx.fillStyle = '#FF6B35'; ctx.font = 'bold 16px Orbitron,sans-serif';
          ctx.shadowColor = 'rgba(255,107,53,0.7)'; ctx.shadowBlur = 10;
          ctx.fillText(speedText, CW/2, CH/2 + 5);
          ctx.shadowBlur = 0;
          ctx.restore();
        }

        // Controls legend
        ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '11px Inter,sans-serif';
        ctx.textAlign = 'left'; ctx.fillText('W/S', 18, CH - 10);
        ctx.textAlign = 'right'; ctx.fillText(mode==='2p'?'↑/↓':'AI', CW - 18, CH - 10);

        // Score flash overlay
        if (flashTimer > 0) { ctx.fillStyle = 'rgba(255,215,0,' + (flashTimer / 15 * 0.2) + ')'; ctx.fillRect(0, 0, CW, CH); flashTimer--; }
      });
      return {};
    },
    destroy: function() { this._running = false; if (this._keyHandler) { document.removeEventListener('keydown', this._keyHandler); document.removeEventListener('keyup', this._keyHandler); } }
  });

})();
