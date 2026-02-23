/* ===== EXTRA FUN GAMES 3 (12) — Visual DOM-based UAE Culture Games ===== */
(function () {
  var E = window.GamesEngine;
  var shuffle = E.shuffle, pick = E.pick;

  /* ── Inject shared CSS once ── */
  var styleId = 'games-extra3-styles';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent =
      /* Layout helpers */
      '.ge3-wrap{display:flex;flex-direction:column;align-items:center;width:100%;max-width:500px;margin:0 auto;font-family:Inter,sans-serif;color:#fff;}' +
      '.ge3-title{font-family:Orbitron,sans-serif;font-size:1.15rem;color:#FFD700;margin-bottom:10px;text-align:center;letter-spacing:1px;}' +
      '.ge3-sub{font-size:0.85rem;opacity:0.6;margin-bottom:8px;text-align:center;}' +
      '.ge3-status{font-size:1rem;min-height:28px;text-align:center;margin-bottom:8px;transition:all 0.3s;}' +

      /* Cards */
      '.ge3-card{background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,215,0,0.12);border-radius:12px;padding:14px;text-align:center;cursor:pointer;transition:all 0.2s;user-select:none;}' +
      '.ge3-card:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(255,215,0,0.15);border-color:rgba(255,215,0,0.3);}' +
      '.ge3-card-active{border-color:#FFD700!important;box-shadow:0 0 20px rgba(255,215,0,0.25)!important;transform:scale(1.04)!important;}' +

      /* Buttons */
      '.ge3-btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border:none;border-radius:10px;cursor:pointer;font-family:Inter,sans-serif;font-size:0.95rem;font-weight:600;color:#fff;transition:all 0.2s;user-select:none;outline:none;min-width:100px;}' +
      '.ge3-btn:hover{transform:scale(1.05);filter:brightness(1.1);}' +
      '.ge3-btn:active{transform:scale(0.97);}' +
      '.ge3-btn-gold{background:linear-gradient(135deg,#FFD700,#e6a800);}' +
      '.ge3-btn-teal{background:linear-gradient(135deg,#00C9A7,#009a7a);}' +
      '.ge3-btn-orange{background:linear-gradient(135deg,#FF6B35,#cc5528);}' +
      '.ge3-btn-dim{background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15);}' +
      '.ge3-btn-dim:hover{background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.25);}' +

      /* Grid / flex layouts */
      '.ge3-grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%;}' +
      '.ge3-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;}' +
      '.ge3-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:100%;}' +
      '.ge3-grid5{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;width:100%;}' +
      '.ge3-flex{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}' +

      /* Progress dots */
      '.ge3-dots{display:flex;gap:6px;justify-content:center;margin:10px 0;}' +
      '.ge3-dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.15);transition:all 0.3s;}' +
      '.ge3-dot-done{background:#00C9A7;box-shadow:0 0 8px rgba(0,201,167,0.4);}' +
      '.ge3-dot-cur{background:#FFD700;box-shadow:0 0 8px rgba(255,215,0,0.4);transform:scale(1.25);}' +

      /* Timer bar */
      '.ge3-timer-wrap{width:100%;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;margin:8px 0;overflow:hidden;}' +
      '.ge3-timer-bar{height:100%;background:linear-gradient(90deg,#FFD700,#FF6B35);border-radius:3px;transition:width 0.3s linear;}' +

      /* Animations */
      '@keyframes ge3Pop{0%{transform:scale(0.5);opacity:0}50%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}' +
      '@keyframes ge3Shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}' +
      '@keyframes ge3Glow{0%,100%{box-shadow:0 0 8px rgba(0,201,167,0.3)}50%{box-shadow:0 0 22px rgba(0,201,167,0.6)}}' +
      '@keyframes ge3FadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}' +
      '@keyframes ge3Float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}' +
      '@keyframes ge3Pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}' +
      '@keyframes ge3Sparkle{0%{opacity:0;transform:scale(0) rotate(0deg)}50%{opacity:1;transform:scale(1.2) rotate(180deg)}100%{opacity:0;transform:scale(0) rotate(360deg)}}' +
      '@keyframes ge3Reveal{0%{clip-path:circle(0% at 50% 50%)}100%{clip-path:circle(100% at 50% 50%)}}' +
      '@keyframes ge3SlideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}' +
      '@keyframes ge3BingoLine{from{width:0}to{width:100%}}' +

      '.ge3-pop{animation:ge3Pop 0.35s ease;}' +
      '.ge3-shake{animation:ge3Shake 0.4s ease;}' +
      '.ge3-glow{animation:ge3Glow 1s ease infinite;}' +
      '.ge3-fadein{animation:ge3FadeIn 0.4s ease;}' +
      '.ge3-float{animation:ge3Float 2s ease-in-out infinite;}' +
      '.ge3-pulse{animation:ge3Pulse 1.2s ease-in-out infinite;}' +

      /* Correct / wrong feedback */
      '.ge3-correct{background:rgba(0,201,167,0.2)!important;border-color:#00C9A7!important;box-shadow:0 0 15px rgba(0,201,167,0.3)!important;}' +
      '.ge3-wrong{background:rgba(255,80,80,0.2)!important;border-color:#ff5050!important;}' +

      /* Big emoji display */
      '.ge3-big-emoji{font-size:3.5rem;margin:10px 0;text-align:center;line-height:1.2;}' +
      '.ge3-med-emoji{font-size:2rem;margin:6px 0;text-align:center;line-height:1.2;}' +

      /* Crystal ball for fortune teller */
      '.ge3-crystal{width:180px;height:180px;border-radius:50%;background:radial-gradient(circle at 35% 35%,rgba(180,120,255,0.4),rgba(60,20,120,0.8),rgba(20,5,50,0.95));border:2px solid rgba(180,120,255,0.3);display:flex;align-items:center;justify-content:center;position:relative;transition:all 0.5s;margin:16px auto;}' +
      '.ge3-crystal:hover{box-shadow:0 0 40px rgba(180,120,255,0.4);}' +
      '.ge3-crystal-glow{box-shadow:0 0 50px rgba(180,120,255,0.6),0 0 100px rgba(180,120,255,0.3)!important;border-color:rgba(255,200,255,0.5)!important;}' +
      '.ge3-sparkle{position:absolute;width:8px;height:8px;background:#FFD700;border-radius:50%;pointer-events:none;}' +

      /* Treasure hunt grid cell */
      '.ge3-cell{width:100%;aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.75rem;font-weight:600;transition:all 0.2s;user-select:none;}' +
      '.ge3-sand{background:linear-gradient(135deg,rgba(210,180,120,0.2),rgba(180,150,90,0.15));border:1.5px solid rgba(210,180,120,0.2);}' +
      '.ge3-sand:hover{background:rgba(210,180,120,0.3);border-color:rgba(210,180,120,0.4);}' +
      '.ge3-dug{background:rgba(120,90,50,0.3)!important;border-color:rgba(120,90,50,0.3)!important;cursor:default!important;}' +

      /* Bingo */
      '.ge3-bingo-cell{background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.12);border-radius:8px;padding:8px 4px;text-align:center;font-size:0.72rem;font-weight:600;cursor:pointer;transition:all 0.2s;user-select:none;min-height:50px;display:flex;align-items:center;justify-content:center;}' +
      '.ge3-bingo-cell:hover{background:rgba(255,255,255,0.12);border-color:rgba(255,215,0,0.3);}' +
      '.ge3-bingo-marked{background:rgba(0,201,167,0.2)!important;border-color:#00C9A7!important;}' +

      /* Passport stamp style */
      '.ge3-stamp{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border:2px dashed rgba(255,215,0,0.3);border-radius:8px;font-size:0.8rem;color:#FFD700;background:rgba(255,215,0,0.05);margin:3px;}' +

      /* Category buckets */
      '.ge3-bucket{flex:1;min-width:80px;padding:10px 6px;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.2s;font-size:0.8rem;font-weight:600;border:2px solid transparent;}' +
      '.ge3-bucket:hover{transform:scale(1.05);filter:brightness(1.15);}' +

      /* Safari path */
      '.ge3-safari-path{display:flex;gap:4px;align-items:center;justify-content:center;margin:8px 0;}' +
      '.ge3-safari-step{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.12);transition:all 0.3s;}' +
      '.ge3-safari-done{background:rgba(0,201,167,0.2);border-color:#00C9A7;}' +
      '.ge3-safari-cur{background:rgba(255,215,0,0.2);border-color:#FFD700;transform:scale(1.2);box-shadow:0 0 10px rgba(255,215,0,0.3);}' +

      /* Map visual for islands */
      '.ge3-map{width:100%;max-width:280px;aspect-ratio:1.4;background:linear-gradient(180deg,rgba(0,80,140,0.3),rgba(0,40,80,0.5));border-radius:14px;border:1.5px solid rgba(0,150,200,0.2);position:relative;margin:10px auto;overflow:hidden;}' +
      '.ge3-island-pin{position:absolute;font-size:1.2rem;transition:all 0.4s;}' +

      /* Outfit meter */
      '.ge3-outfit-meter{width:100%;height:8px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;margin:8px 0;}' +
      '.ge3-outfit-fill{height:100%;background:linear-gradient(90deg,#FF6B35,#FFD700);border-radius:4px;transition:width 0.5s ease;}' +

      /* Responsive */
      '@media(max-width:400px){.ge3-grid4{grid-template-columns:repeat(2,1fr);}.ge3-grid5{grid-template-columns:repeat(5,1fr);gap:4px;}.ge3-crystal{width:140px;height:140px;}.ge3-big-emoji{font-size:2.5rem;}}' +
      '';
    document.head.appendChild(style);
  }

  /* ── Helper: build progress dots ── */
  function buildDots(count) {
    var html = '<div class="ge3-dots">';
    for (var i = 0; i < count; i++) {
      html += '<div class="ge3-dot" id="ge3dot' + i + '"></div>';
    }
    html += '</div>';
    return html;
  }
  function updateDots(wrap, current, total) {
    for (var i = 0; i < total; i++) {
      var d = wrap.querySelector('#ge3dot' + i);
      if (!d) continue;
      d.className = 'ge3-dot';
      if (i < current) d.classList.add('ge3-dot-done');
      else if (i === current) d.classList.add('ge3-dot-cur');
    }
  }

  /* ── Helper: disable/enable all buttons in container ── */
  function disableBtns(container) {
    var btns = container.querySelectorAll('.ge3-btn');
    for (var i = 0; i < btns.length; i++) { btns[i].style.pointerEvents = 'none'; btns[i].style.opacity = '0.5'; }
  }
  function enableBtns(container) {
    var btns = container.querySelectorAll('.ge3-btn');
    for (var i = 0; i < btns.length; i++) { btns[i].style.pointerEvents = ''; btns[i].style.opacity = ''; }
  }


  /* ═══════════════════════════════════════════════════
     1. MEMORY CHAIN
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'memory-chain', name: 'Memory Chain', emoji: '🧠', category: 'fun', has2P: true,
    _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];

      /* ── 2-PLAYER MODE ── */
      if (mode === '2p') {
        var memoryItems2 = [
          {name:'Falcon',emoji:'🦅'}, {name:'Date',emoji:'🌴'}, {name:'Pearl',emoji:'💎'},
          {name:'Camel',emoji:'🐪'}, {name:'Mosque',emoji:'🕌'}, {name:'Dune',emoji:'🏜️'},
          {name:'Dirham',emoji:'💰'}, {name:'Souk',emoji:'🏪'}, {name:'Dhow',emoji:'⛵'},
          {name:'Oasis',emoji:'🌿'}, {name:'Oryx',emoji:'🦌'}, {name:'Coffee',emoji:'☕'},
          {name:'Henna',emoji:'✋'}, {name:'Oud',emoji:'🎵'}
        ];
        var P1_COLOR = '#4ecdc4', P2_COLOR = '#ff6b6b';
        var chain2 = [];
        var currentPlayer = 1; // 1 or 2
        var phase = 'add'; // 'recite' or 'add'
        var reciteIdx = 0;
        var gameOver2 = false;

        var wrap2 = document.createElement('div');
        wrap2.className = 'ge3-wrap';
        wrap2.innerHTML =
          '<div class="ge3-title">Memory Chain 🧠 — 2 Players</div>' +
          '<div class="ge3-status" id="mc2Status">P1 starts the chain!</div>' +
          '<div id="mc2Turn" style="font-size:1.1rem;font-weight:700;text-align:center;margin:6px 0;color:' + P1_COLOR + ';">Player 1\'s Turn</div>' +
          '<div id="mc2Chain" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:50px;margin:8px 0;padding:10px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);"></div>' +
          '<div id="mc2Prompt" style="text-align:center;font-size:0.9rem;margin:8px 0;color:#FFD700;"></div>' +
          '<div id="mc2Grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:100%;margin-top:8px;"></div>';
        container.appendChild(wrap2);

        var statusEl2 = wrap2.querySelector('#mc2Status');
        var turnEl2 = wrap2.querySelector('#mc2Turn');
        var chainEl2 = wrap2.querySelector('#mc2Chain');
        var promptEl2 = wrap2.querySelector('#mc2Prompt');
        var gridEl2 = wrap2.querySelector('#mc2Grid');

        function getPlayerColor(p) { return p === 1 ? P1_COLOR : P2_COLOR; }
        function getPlayerName(p) { return 'Player ' + p; }

        function renderChain() {
          chainEl2.innerHTML = '';
          if (chain2.length === 0) {
            chainEl2.innerHTML = '<span style="opacity:0.4;font-size:0.85rem;">Chain is empty — add the first item!</span>';
            return;
          }
          for (var i = 0; i < chain2.length; i++) {
            var tag = document.createElement('span');
            tag.className = 'ge3-pop';
            tag.style.cssText = 'display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(255,255,255,0.08);border-radius:8px;font-size:0.85rem;border:1px solid rgba(255,255,255,0.12);';
            tag.innerHTML = '<span style="font-size:1.2rem;">' + chain2[i].emoji + '</span> ' + chain2[i].name;
            chainEl2.appendChild(tag);
          }
        }

        function buildGrid(exclude, onPick) {
          gridEl2.innerHTML = '';
          var available = memoryItems2.filter(function(it) {
            for (var i = 0; i < exclude.length; i++) { if (exclude[i].name === it.name) return false; }
            return true;
          });
          var gridItems = shuffle(available).slice(0, Math.min(8, available.length));
          for (var g = 0; g < gridItems.length; g++) {
            (function(item) {
              var cell = document.createElement('div');
              cell.className = 'ge3-card ge3-fadein';
              cell.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:10px 4px;cursor:pointer;';
              cell.innerHTML = '<span style="font-size:1.5rem;">' + item.emoji + '</span><span style="font-size:0.65rem;margin-top:2px;">' + item.name + '</span>';
              cell.onclick = function() { onPick(item, cell); };
              gridEl2.appendChild(cell);
            })(gridItems[g]);
          }
        }

        function buildReciteGrid(onPick) {
          gridEl2.innerHTML = '';
          // Show all chain items + some distractors, shuffled
          var extras = memoryItems2.filter(function(it) {
            for (var i = 0; i < chain2.length; i++) { if (chain2[i].name === it.name) return false; }
            return true;
          });
          var distractors = shuffle(extras).slice(0, Math.max(3, 8 - chain2.length));
          var allItems = shuffle(chain2.concat(distractors));
          for (var g = 0; g < allItems.length; g++) {
            (function(item) {
              var cell = document.createElement('div');
              cell.className = 'ge3-card ge3-fadein';
              cell.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:10px 4px;cursor:pointer;';
              cell.innerHTML = '<span style="font-size:1.5rem;">' + item.emoji + '</span><span style="font-size:0.65rem;margin-top:2px;">' + item.name + '</span>';
              cell.onclick = function() {
                if (cell.classList.contains('ge3-correct')) return;
                onPick(item, cell);
              };
              gridEl2.appendChild(cell);
            })(allItems[g]);
          }
        }

        function startAddPhase() {
          phase = 'add';
          var pColor = getPlayerColor(currentPlayer);
          turnEl2.style.color = pColor;
          turnEl2.textContent = getPlayerName(currentPlayer) + '\'s Turn';
          statusEl2.textContent = getPlayerName(currentPlayer) + ': Add a new item to the chain!';
          promptEl2.innerHTML = 'Pick an item to add to the chain';
          renderChain();

          buildGrid(chain2, function(item, cell) {
            cell.classList.add('ge3-correct');
            gridEl2.style.pointerEvents = 'none';
            chain2.push(item);
            renderChain();
            E.rashidSay(getPlayerName(currentPlayer) + ' added ' + item.emoji + ' ' + item.name + '!');

            // Switch to other player's recite phase
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            var t = setTimeout(function() {
              if (!gameOver2) startRecitePhase();
            }, 1000);
            self._tv.push(t);
          });
        }

        function startRecitePhase() {
          phase = 'recite';
          reciteIdx = 0;
          var pColor = getPlayerColor(currentPlayer);
          turnEl2.style.color = pColor;
          turnEl2.textContent = getPlayerName(currentPlayer) + '\'s Turn';
          statusEl2.textContent = getPlayerName(currentPlayer) + ': Recite the chain in order! (' + (reciteIdx + 1) + '/' + chain2.length + ')';
          promptEl2.innerHTML = 'Click item <strong>' + (reciteIdx + 1) + '</strong> of ' + chain2.length + ' in the chain';

          // Hide the chain display during recite
          chainEl2.innerHTML = '';
          var hiddenChainHtml = '';
          for (var i = 0; i < chain2.length; i++) {
            hiddenChainHtml += '<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(255,255,255,0.06);border-radius:8px;font-size:0.85rem;border:1px dashed rgba(255,255,255,0.15);min-width:40px;justify-content:center;" id="mc2hidden' + i + '">❓</span>';
          }
          chainEl2.innerHTML = hiddenChainHtml;

          buildReciteGrid(function(item, cell) {
            if (gameOver2) return;
            if (item.name === chain2[reciteIdx].name) {
              // Correct recite
              cell.classList.add('ge3-correct');
              cell.style.pointerEvents = 'none';
              var revealEl = wrap2.querySelector('#mc2hidden' + reciteIdx);
              if (revealEl) { revealEl.innerHTML = '<span style="font-size:1.2rem;">' + item.emoji + '</span> ' + item.name; revealEl.style.borderStyle = 'solid'; revealEl.style.background = 'rgba(0,201,167,0.15)'; }
              reciteIdx++;
              if (reciteIdx >= chain2.length) {
                // Recite complete — now this player adds a new item
                statusEl2.textContent = '✅ ' + getPlayerName(currentPlayer) + ' recited perfectly! Now add a new item!';
                promptEl2.innerHTML = 'Pick an item to add to the chain';
                E.rashidSay(getPlayerName(currentPlayer) + ' remembered the whole chain! 🧠');

                // Check if we ran out of items
                if (chain2.length >= memoryItems2.length - 1) {
                  gameOver2 = true;
                  statusEl2.textContent = '🏆 Incredible! The chain is complete!';
                  promptEl2.innerHTML = '';
                  gridEl2.innerHTML = '';
                  renderChain();
                  E.rashidSay('Both players have amazing memories! Chain length: ' + chain2.length + '! 🧠');
                  E.endGame(chain2.length, memoryItems2.length);
                  return;
                }

                var t2 = setTimeout(function() {
                  if (!gameOver2) {
                    renderChain();
                    buildGrid(chain2, function(newItem, newCell) {
                      newCell.classList.add('ge3-correct');
                      gridEl2.style.pointerEvents = 'none';
                      chain2.push(newItem);
                      renderChain();
                      E.rashidSay(getPlayerName(currentPlayer) + ' added ' + newItem.emoji + ' ' + newItem.name + '!');
                      currentPlayer = currentPlayer === 1 ? 2 : 1;
                      var t3 = setTimeout(function() { if (!gameOver2) startRecitePhase(); }, 1000);
                      self._tv.push(t3);
                    });
                  }
                }, 800);
                self._tv.push(t2);
              } else {
                statusEl2.textContent = getPlayerName(currentPlayer) + ': Recite the chain! (' + (reciteIdx + 1) + '/' + chain2.length + ')';
                promptEl2.innerHTML = 'Click item <strong>' + (reciteIdx + 1) + '</strong> of ' + chain2.length;
              }
            } else {
              // Wrong — this player loses
              gameOver2 = true;
              cell.classList.add('ge3-wrong');
              cell.classList.add('ge3-shake');
              gridEl2.style.pointerEvents = 'none';
              var winner = currentPlayer === 1 ? 2 : 1;
              statusEl2.textContent = '❌ ' + getPlayerName(currentPlayer) + ' broke the chain!';
              turnEl2.style.color = getPlayerColor(winner);
              turnEl2.textContent = '🏆 ' + getPlayerName(winner) + ' Wins!';
              promptEl2.innerHTML = 'Chain length reached: ' + chain2.length;
              // Reveal full chain
              renderChain();
              E.rashidSay(getPlayerName(winner) + ' wins! Chain was ' + chain2.length + ' items long! 🏆');
              E.endGame(chain2.length, memoryItems2.length);
            }
          });
        }

        // Start: P1 adds first item
        var tStart2 = setTimeout(function() { startAddPhase(); }, 500);
        self._tv.push(tStart2);
        return {};
      }

      var memoryItems = [
        {name:'Falcon',emoji:'🦅'}, {name:'Date',emoji:'🌴'}, {name:'Pearl',emoji:'💎'},
        {name:'Camel',emoji:'🐪'}, {name:'Mosque',emoji:'🕌'}, {name:'Dune',emoji:'🏜️'},
        {name:'Dirham',emoji:'💰'}, {name:'Souk',emoji:'🏪'}, {name:'Dhow',emoji:'⛵'},
        {name:'Oasis',emoji:'🌿'}, {name:'Oryx',emoji:'🦌'}, {name:'Coffee',emoji:'☕'},
        {name:'Henna',emoji:'✋'}, {name:'Oud',emoji:'🎵'}
      ];

      var startLen = diff === 'easy' ? 2 : diff === 'hard' ? 4 : 3;
      var chainLen = startLen;
      var round = 0, score = 0, clickIdx = 0;
      var chain = [];
      var playing = false;

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Memory Chain 🧠</div>' +
        '<div class="ge3-status" id="mcStatus">Watch the sequence!</div>' +
        '<div class="ge3-sub" id="mcRound">Round 1 — Chain: ' + chainLen + '</div>' +
        '<div id="mcShowArea" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;min-height:70px;margin:8px 0;"></div>' +
        '<div id="mcGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:100%;margin-top:10px;"></div>';
      container.appendChild(wrap);

      var statusEl = wrap.querySelector('#mcStatus');
      var roundEl = wrap.querySelector('#mcRound');
      var showArea = wrap.querySelector('#mcShowArea');
      var gridEl = wrap.querySelector('#mcGrid');

      function newRound() {
        round++;
        chainLen = startLen + round - 1;
        clickIdx = 0;
        playing = false;

        var pool = shuffle(memoryItems).slice(0, Math.min(chainLen + 4, memoryItems.length));
        chain = pool.slice(0, chainLen);

        statusEl.textContent = '👀 Watch the sequence!';
        roundEl.textContent = 'Round ' + round + ' — Chain: ' + chainLen;
        showArea.innerHTML = '';
        gridEl.innerHTML = '';
        gridEl.style.opacity = '0.3';
        gridEl.style.pointerEvents = 'none';

        // Show items one by one
        var showDelay = diff === 'easy' ? 900 : diff === 'hard' ? 500 : 700;
        for (var i = 0; i < chain.length; i++) {
          (function(idx) {
            var t = setTimeout(function () {
              var card = document.createElement('div');
              card.className = 'ge3-card ge3-pop';
              card.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;padding:8px 12px;min-width:60px;';
              card.innerHTML = '<span style="font-size:1.6rem;">' + chain[idx].emoji + '</span><span style="font-size:0.7rem;margin-top:2px;">' + chain[idx].name + '</span>';
              showArea.appendChild(card);
            }, idx * showDelay);
            self._tv.push(t);
          })(i);
        }

        // After showing, hide and build grid
        var t2 = setTimeout(function () {
          showArea.innerHTML = '<div style="color:#FFD700;font-size:0.9rem;">Now click them in order!</div>';
          statusEl.textContent = '🎯 Click items in the correct order!';

          var gridItems = shuffle(pool);
          gridEl.innerHTML = '';
          gridEl.style.opacity = '1';
          gridEl.style.pointerEvents = '';

          for (var g = 0; g < gridItems.length; g++) {
            (function(gIdx) {
              var cell = document.createElement('div');
              cell.className = 'ge3-card ge3-fadein';
              cell.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:10px 4px;cursor:pointer;';
              cell.innerHTML = '<span style="font-size:1.5rem;">' + gridItems[gIdx].emoji + '</span><span style="font-size:0.65rem;margin-top:2px;">' + gridItems[gIdx].name + '</span>';
              cell.setAttribute('data-name', gridItems[gIdx].name);

              cell.onclick = function () {
                if (!playing) return;
                if (cell.classList.contains('ge3-correct')) return;

                if (gridItems[gIdx].name === chain[clickIdx].name) {
                  // Correct
                  cell.classList.add('ge3-correct');
                  cell.style.pointerEvents = 'none';
                  cell.innerHTML = '<span style="font-size:1.5rem;">' + gridItems[gIdx].emoji + '</span><span style="font-size:0.65rem;margin-top:2px;">✅ ' + (clickIdx + 1) + '</span>';
                  clickIdx++;

                  if (clickIdx >= chain.length) {
                    // Round complete
                    score += chainLen;
                    E.setScore(score);
                    E.rashidSay(pick(['Amazing memory! 🧠', 'Perfect chain! ⛓️', 'You remembered them all! 🌟', 'Brilliant! 💫']));
                    statusEl.textContent = '✅ Round ' + round + ' complete!';
                    playing = false;
                    var t3 = setTimeout(function () { newRound(); }, 1200);
                    self._tv.push(t3);
                  }
                } else {
                  // Wrong — game over
                  cell.classList.add('ge3-wrong');
                  cell.classList.add('ge3-shake');
                  playing = false;
                  statusEl.textContent = '❌ Wrong! The chain breaks at round ' + round;
                  E.rashidSay('Game over! You scored ' + score + ' points! 💪');
                  gridEl.style.pointerEvents = 'none';
                  E.endGame(score, score || 1);
                }
              };
              gridEl.appendChild(cell);
            })(g);
          }
          playing = true;
        }, chain.length * showDelay + 800);
        self._tv.push(t2);
      }

      var tStart = setTimeout(function () { newRound(); }, 500);
      self._tv.push(tStart);
      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     2. COUNTDOWN
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'countdown', name: 'Countdown', emoji: '⏳', category: 'fun', has2P: false,
    _iv: null, _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];
      var categories = [
        { cat: 'UAE Emirates', all: ['Abu Dhabi','Dubai','Sharjah','Ajman','Fujairah','Ras Al Khaimah','Umm Al Quwain'], decoys: ['Muscat','Doha','Riyadh','Manama'] },
        { cat: 'UAE Landmarks', all: ['Burj Khalifa','Dubai Frame','Sheikh Zayed Mosque','Museum of the Future','Palm Jumeirah','Burj Al Arab','Louvre Abu Dhabi'], decoys: ['Eiffel Tower','Big Ben','Pyramids','Taj Mahal'] },
        { cat: 'Emirati Foods', all: ['Machboos','Luqaimat','Harees','Balaleet','Thareed','Khameer','Regag'], decoys: ['Sushi','Pizza','Pasta','Tacos'] },
        { cat: 'Desert Animals', all: ['Camel','Oryx','Falcon','Gazelle','Fox','Scorpion','Lizard'], decoys: ['Penguin','Polar Bear','Panda','Koala'] },
        { cat: 'Arabic Greetings', all: ['Marhaba','Salam','Shukran','Yalla','Habibi','Inshallah','Mashallah'], decoys: ['Bonjour','Gracias','Arigato','Ciao'] }
      ];

      var totalTime = diff === 'easy' ? 40 : diff === 'hard' ? 20 : 30;
      var cat = pick(categories);
      var correctItems = shuffle(cat.all);
      var numCorrect = Math.min(diff === 'easy' ? 5 : 7, correctItems.length);
      correctItems = correctItems.slice(0, numCorrect);
      var decoys = shuffle(cat.decoys).slice(0, 8 - numCorrect);
      var allItems = shuffle(correctItems.concat(decoys));

      var found = 0, timeLeft = totalTime, done = false;

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Countdown ⏳</div>' +
        '<div class="ge3-status" id="cdCat" style="color:#FFD700;font-size:1.1rem;">Find all: ' + cat.cat + '</div>' +
        '<div style="display:flex;align-items:center;gap:10px;width:100%;margin-bottom:6px;">' +
          '<span id="cdTimer" style="font-family:Orbitron,sans-serif;font-size:1.1rem;color:#FF6B35;min-width:40px;">⏱️ ' + totalTime + '</span>' +
          '<div class="ge3-timer-wrap" style="flex:1;"><div class="ge3-timer-bar" id="cdBar" style="width:100%;"></div></div>' +
          '<span id="cdFound" style="font-family:Orbitron,sans-serif;font-size:0.85rem;color:#00C9A7;">' + found + '/' + numCorrect + '</span>' +
        '</div>' +
        '<div id="cdGrid" class="ge3-grid2" style="margin-top:6px;"></div>' +
        '<div class="ge3-sub" id="cdHint" style="margin-top:8px;">Tap the correct items!</div>';
      container.appendChild(wrap);

      var timerEl = wrap.querySelector('#cdTimer');
      var barEl = wrap.querySelector('#cdBar');
      var foundEl = wrap.querySelector('#cdFound');
      var gridEl = wrap.querySelector('#cdGrid');
      var hintEl = wrap.querySelector('#cdHint');

      // Build buttons
      for (var i = 0; i < allItems.length; i++) {
        (function(idx) {
          var btn = document.createElement('div');
          btn.className = 'ge3-card ge3-fadein';
          btn.style.cssText = 'padding:14px 8px;font-size:0.95rem;font-weight:600;';
          btn.textContent = allItems[idx];
          btn.setAttribute('data-item', allItems[idx]);

          btn.onclick = function () {
            if (done) return;
            if (btn.classList.contains('ge3-correct') || btn.classList.contains('ge3-wrong')) return;

            var isCorrect = false;
            for (var c = 0; c < correctItems.length; c++) {
              if (correctItems[c] === allItems[idx]) { isCorrect = true; break; }
            }

            if (isCorrect) {
              btn.classList.add('ge3-correct');
              btn.innerHTML = '✅ ' + allItems[idx];
              btn.style.pointerEvents = 'none';
              found++;
              E.addScore(1);
              foundEl.textContent = found + '/' + numCorrect;
              E.rashidSay(pick(['Correct! ✅', 'Found one! 🎯', 'Great pick! 🌟', 'Yes! 👏']));

              if (found >= numCorrect) {
                done = true;
                clearInterval(self._iv);
                hintEl.textContent = '🎉 You found them all!';
                hintEl.style.color = '#00C9A7';
                E.rashidSay('Amazing! You found all ' + cat.cat + '! 🏆');
                E.endGame(found, numCorrect);
              }
            } else {
              btn.classList.add('ge3-wrong');
              btn.classList.add('ge3-shake');
              btn.style.opacity = '0.4';
              btn.style.pointerEvents = 'none';
              E.rashidSay(pick(['Not quite! ❌', 'Try another one!', 'That doesn\'t belong!']));
            }
          };
          gridEl.appendChild(btn);
        })(i);
      }

      // Timer
      self._iv = setInterval(function () {
        if (done) return;
        timeLeft--;
        timerEl.textContent = '⏱️ ' + timeLeft;
        barEl.style.width = ((timeLeft / totalTime) * 100) + '%';
        if (timeLeft <= 5) {
          timerEl.style.color = '#ff5050';
          barEl.style.background = 'linear-gradient(90deg,#ff5050,#ff3030)';
        }
        if (timeLeft <= 0) {
          done = true;
          clearInterval(self._iv);
          hintEl.textContent = '⏰ Time\'s up!';
          hintEl.style.color = '#ff5050';
          disableBtns(gridEl);
          E.rashidSay('Time\'s up! You found ' + found + ' out of ' + numCorrect + '!');
          E.endGame(found, numCorrect);
        }
      }, 1000);

      return {};
    },
    destroy: function () {
      if (this._iv) clearInterval(this._iv);
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     3. WOULD YOU RATHER
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'would-you-rather', name: 'Would You Rather', emoji: '🤷', category: 'fun', has2P: true,
    _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];

      /* ── 2-PLAYER MODE ── */
      if (mode === '2p') {
        var P1_COLOR = '#4ecdc4', P2_COLOR = '#ff6b6b';
        var wyrChoices2 = [
          { a: {text:'Visit Burj Khalifa',emoji:'🏗️'}, b: {text:'Visit Sheikh Zayed Mosque',emoji:'🕌'}, reactA: 'The views from 828m are breathtaking!', reactB: 'It has 82 domes and the world\'s largest carpet!' },
          { a: {text:'Ride a camel in the desert',emoji:'🐪'}, b: {text:'Swim with dolphins',emoji:'🐬'}, reactA: 'Camels are the ships of the desert!', reactB: 'Arabian Gulf dolphins are so friendly!' },
          { a: {text:'Eat Luqaimat',emoji:'🍡'}, b: {text:'Eat Machboos',emoji:'🍚'}, reactA: 'Sweet and crispy — the best treat!', reactB: 'Spiced rice perfection!' },
          { a: {text:'Go to Mars with Hope Probe',emoji:'🚀'}, b: {text:'Zipline on Jebel Jais',emoji:'🏔️'}, reactA: 'First Arab nation to reach Mars!', reactB: 'World\'s longest zipline — 2.8 km!' },
          { a: {text:'Be a falconer',emoji:'🦅'}, b: {text:'Be a pearl diver',emoji:'💎'}, reactA: 'Falcons are like royalty in the UAE!', reactB: 'Arabian Gulf has the best pearls!' },
          { a: {text:'Ride Dubai Metro',emoji:'🚇'}, b: {text:'Sail on a dhow',emoji:'⛵'}, reactA: 'It\'s completely driverless!', reactB: 'Traditional wooden boats are so cool!' },
          { a: {text:'Skydive over Palm Jumeirah',emoji:'🪂'}, b: {text:'Dune bash in the desert',emoji:'🏜️'}, reactA: 'The palm shape from above is amazing!', reactB: 'Hold on tight — it\'s a bumpy ride!' }
        ];

        var totalRounds2 = 6;
        var round2 = 0, matches2 = 0;
        var pool2 = shuffle(wyrChoices2).slice(0, totalRounds2);
        var p1Choice = null, p2Choice = null;

        var wrap2 = document.createElement('div');
        wrap2.className = 'ge3-wrap';
        wrap2.innerHTML =
          '<div class="ge3-title">Would You Rather? 🤷 — 2 Players</div>' +
          '<div class="ge3-status" id="wyr2Status">Both players pick!</div>' +
          '<div id="wyr2Score" style="text-align:center;font-size:1rem;font-weight:700;margin:6px 0;">Matched: 0 / 0</div>' +
          buildDots(totalRounds2) +
          '<div id="wyr2Question" style="width:100%;margin-top:8px;"></div>' +
          '<div id="wyr2React" style="min-height:50px;margin-top:12px;text-align:center;font-size:0.9rem;padding:10px 14px;background:rgba(255,215,0,0.05);border-radius:10px;border:1px solid rgba(255,215,0,0.1);display:none;"></div>';
        container.appendChild(wrap2);

        var statusEl2 = wrap2.querySelector('#wyr2Status');
        var scoreEl2 = wrap2.querySelector('#wyr2Score');
        var questionEl2 = wrap2.querySelector('#wyr2Question');
        var reactEl2 = wrap2.querySelector('#wyr2React');

        function updateWyrScore() {
          scoreEl2.textContent = 'Matched: ' + matches2 + ' / ' + round2;
        }

        function showWyrRound() {
          if (round2 >= totalRounds2) {
            statusEl2.textContent = '🎉 All rounds done!';
            var pct = Math.round((matches2 / totalRounds2) * 100);
            var msg = pct >= 80 ? 'You two think alike! 🧠' : pct >= 50 ? 'Pretty in sync! 🤝' : 'Opposites attract! 😄';
            E.rashidSay(msg + ' Matched ' + matches2 + ' out of ' + totalRounds2 + '!');
            E.endGame(matches2, totalRounds2);
            return;
          }

          p1Choice = null;
          p2Choice = null;
          var q = pool2[round2];
          updateDots(wrap2, round2, totalRounds2);
          statusEl2.textContent = 'Round ' + (round2 + 1) + ' — Both players pick!';
          reactEl2.style.display = 'none';

          questionEl2.innerHTML = '';

          // Two option columns, each containing P1 and P2 buttons
          var sides = ['a', 'b'];
          var optionColors = ['#FF6B35', '#00C9A7'];

          var html = '<div style="display:flex;gap:12px;width:100%;">';
          for (var s = 0; s < 2; s++) {
            var side = sides[s];
            var data = q[side];
            var oColor = optionColors[s];
            html += '<div style="flex:1;text-align:center;">' +
              '<div class="ge3-card" style="padding:16px 10px;border-color:' + oColor + '40;margin-bottom:10px;cursor:default;">' +
                '<div style="font-size:2.5rem;margin-bottom:6px;">' + data.emoji + '</div>' +
                '<div style="font-size:0.85rem;font-weight:600;color:' + oColor + ';">' + data.text + '</div>' +
              '</div>' +
              '<div class="ge3-btn ge3-btn-dim" id="wyr2p1' + side + '" style="width:100%;margin-bottom:6px;border:2px solid ' + P1_COLOR + '40;color:' + P1_COLOR + ';font-size:0.85rem;">P1: Pick This</div>' +
              '<div class="ge3-btn ge3-btn-dim" id="wyr2p2' + side + '" style="width:100%;border:2px solid ' + P2_COLOR + '40;color:' + P2_COLOR + ';font-size:0.85rem;">P2: Pick This</div>' +
            '</div>';
          }
          html += '</div>';
          questionEl2.innerHTML = html;

          // Wire up buttons
          for (var s2 = 0; s2 < 2; s2++) {
            (function(side) {
              var p1Btn = wrap2.querySelector('#wyr2p1' + side);
              var p2Btn = wrap2.querySelector('#wyr2p2' + side);

              p1Btn.onclick = function() {
                if (p1Choice) return;
                p1Choice = side;
                // Disable other P1 button
                var otherSide = side === 'a' ? 'b' : 'a';
                var otherP1 = wrap2.querySelector('#wyr2p1' + otherSide);
                p1Btn.style.background = P1_COLOR;
                p1Btn.style.color = '#fff';
                p1Btn.style.borderColor = P1_COLOR;
                p1Btn.textContent = 'P1: ✓';
                otherP1.style.opacity = '0.3';
                otherP1.style.pointerEvents = 'none';
                if (p1Choice && p2Choice) resolveWyrRound(q);
              };
              p2Btn.onclick = function() {
                if (p2Choice) return;
                p2Choice = side;
                var otherSide = side === 'a' ? 'b' : 'a';
                var otherP2 = wrap2.querySelector('#wyr2p2' + otherSide);
                p2Btn.style.background = P2_COLOR;
                p2Btn.style.color = '#fff';
                p2Btn.style.borderColor = P2_COLOR;
                p2Btn.textContent = 'P2: ✓';
                otherP2.style.opacity = '0.3';
                otherP2.style.pointerEvents = 'none';
                if (p1Choice && p2Choice) resolveWyrRound(q);
              };
            })(sides[s2]);
          }
        }

        function resolveWyrRound(q) {
          // Disable all buttons
          questionEl2.style.pointerEvents = 'none';
          var matched = (p1Choice === p2Choice);
          if (matched) {
            matches2++;
            E.addScore(1);
          }
          round2++;
          updateWyrScore();

          var reaction = p1Choice === 'a' ? q.reactA : q.reactB;
          reactEl2.style.display = 'block';
          if (matched) {
            reactEl2.innerHTML = '<span style="color:#00C9A7;font-weight:700;">🎉 You both picked the same!</span><br><span style="color:#FFD700;">💡</span> ' + reaction;
            E.rashidSay(pick(['Great minds think alike! 🧠', 'Perfect match! 🤝', 'You two are in sync! 💫']));
          } else {
            var p1react = p1Choice === 'a' ? q.reactA : q.reactB;
            var p2react = p2Choice === 'a' ? q.reactA : q.reactB;
            reactEl2.innerHTML = '<span style="color:#ff6b6b;font-weight:700;">Different picks!</span><br>' +
              '<span style="color:' + P1_COLOR + ';">P1:</span> ' + q[p1Choice].text + ' — ' +
              '<span style="color:' + P2_COLOR + ';">P2:</span> ' + q[p2Choice].text;
            E.rashidSay(pick(['Opposites attract! 😄', 'Different tastes! 🤔', 'Variety is the spice of life! 🌶️']));
          }
          reactEl2.className = 'ge3-pop';

          var t = setTimeout(function() { showWyrRound(); }, 2800);
          self._tv.push(t);
        }

        var tStart2 = setTimeout(function() { showWyrRound(); }, 400);
        self._tv.push(tStart2);
        return {};
      }

      var wyrChoices = [
        { a: {text:'Visit Burj Khalifa',emoji:'🏗️'}, b: {text:'Visit Sheikh Zayed Mosque',emoji:'🕌'}, reactA: 'The views from 828m are breathtaking!', reactB: 'It has 82 domes and the world\'s largest carpet!' },
        { a: {text:'Ride a camel in the desert',emoji:'🐪'}, b: {text:'Swim with dolphins',emoji:'🐬'}, reactA: 'Camels are the ships of the desert!', reactB: 'Arabian Gulf dolphins are so friendly!' },
        { a: {text:'Eat Luqaimat',emoji:'🍡'}, b: {text:'Eat Machboos',emoji:'🍚'}, reactA: 'Sweet and crispy — the best treat!', reactB: 'Spiced rice perfection!' },
        { a: {text:'Go to Mars with Hope Probe',emoji:'🚀'}, b: {text:'Zipline on Jebel Jais',emoji:'🏔️'}, reactA: 'First Arab nation to reach Mars!', reactB: 'World\'s longest zipline — 2.8 km!' },
        { a: {text:'Be a falconer',emoji:'🦅'}, b: {text:'Be a pearl diver',emoji:'💎'}, reactA: 'Falcons are like royalty in the UAE!', reactB: 'Arabian Gulf has the best pearls!' },
        { a: {text:'Ride Dubai Metro',emoji:'🚇'}, b: {text:'Sail on a dhow',emoji:'⛵'}, reactA: 'It\'s completely driverless!', reactB: 'Traditional wooden boats are so cool!' },
        { a: {text:'Skydive over Palm Jumeirah',emoji:'🪂'}, b: {text:'Dune bash in the desert',emoji:'🏜️'}, reactA: 'The palm shape from above is amazing!', reactB: 'Hold on tight — it\'s a bumpy ride!' }
      ];

      var totalRounds = 5;
      var round = 0, score = 0;
      var pool = shuffle(wyrChoices).slice(0, totalRounds);

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Would You Rather? 🤷</div>' +
        '<div class="ge3-status" id="wyrStatus">Choose one!</div>' +
        buildDots(totalRounds) +
        '<div id="wyrCards" style="display:flex;gap:12px;width:100%;margin-top:8px;"></div>' +
        '<div id="wyrReact" style="min-height:50px;margin-top:12px;text-align:center;font-size:0.9rem;padding:10px 14px;background:rgba(255,215,0,0.05);border-radius:10px;border:1px solid rgba(255,215,0,0.1);display:none;"></div>';
      container.appendChild(wrap);

      var statusEl = wrap.querySelector('#wyrStatus');
      var cardsEl = wrap.querySelector('#wyrCards');
      var reactEl = wrap.querySelector('#wyrReact');

      function showRound() {
        if (round >= totalRounds) {
          statusEl.textContent = '🎉 All done! Great choices!';
          E.rashidSay('You have great taste! Final score: ' + score + '! 🌟');
          E.endGame(score, totalRounds);
          return;
        }

        var q = pool[round];
        updateDots(wrap, round, totalRounds);
        statusEl.textContent = 'Round ' + (round + 1) + ' of ' + totalRounds;
        reactEl.style.display = 'none';
        cardsEl.innerHTML = '';

        // Build two choice cards
        var sides = ['a', 'b'];
        var colors = ['#FF6B35', '#00C9A7'];
        for (var s = 0; s < 2; s++) {
          (function(side, color) {
            var data = q[side];
            var card = document.createElement('div');
            card.className = 'ge3-card ge3-fadein';
            card.style.cssText = 'flex:1;padding:20px 12px;text-align:center;border-color:' + color + '40;cursor:pointer;';
            card.innerHTML =
              '<div style="font-size:3rem;margin-bottom:10px;">' + data.emoji + '</div>' +
              '<div style="font-size:0.95rem;font-weight:600;color:' + color + ';">' + data.text + '</div>';

            card.onmouseenter = function () { card.style.borderColor = color; card.style.boxShadow = '0 0 20px ' + color + '30'; };
            card.onmouseleave = function () { card.style.borderColor = color + '40'; card.style.boxShadow = 'none'; };

            card.onclick = function () {
              // Highlight selected
              card.classList.add('ge3-card-active');
              card.style.borderColor = color;
              card.style.boxShadow = '0 0 25px ' + color + '40';
              cardsEl.style.pointerEvents = 'none';

              score++;
              E.addScore(1);

              var reaction = side === 'a' ? q.reactA : q.reactB;
              reactEl.style.display = 'block';
              reactEl.innerHTML = '<span style="color:#FFD700;">💡 Fun Fact:</span> ' + reaction;
              reactEl.className = 'ge3-pop';
              E.rashidSay(pick(['Great choice! ', 'Interesting pick! ', 'I love that one too! ']) + reaction);

              round++;
              var t = setTimeout(function () { showRound(); }, 2500);
              self._tv.push(t);
            };
            cardsEl.appendChild(card);
          })(sides[s], colors[s]);
        }
      }

      var tStart = setTimeout(function () { showRound(); }, 400);
      self._tv.push(tStart);
      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     4. FORTUNE TELLER
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'fortune-teller', name: 'Fortune Teller', emoji: '🔮', category: 'fun', has2P: false,
    _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];
      var fortunes = [
        'You will visit the Burj Khalifa and see all of Dubai from the top! 🏗️',
        'A falcon will land on your shoulder and bring you good luck! 🦅',
        'You will discover a hidden oasis in the desert with golden dates! 🌴',
        'The Sheikh will invite you for Arabic coffee and Luqaimat! ☕',
        'You will find a pearl in the Arabian Gulf worth a million dirhams! 💎',
        'A magic carpet will fly you over Sheikh Zayed Mosque at sunset! 🕌',
        'You will win a camel race and be crowned champion! 🐪',
        'The Museum of the Future will name an exhibit after you! 🔮',
        'A friendly oryx will guide you to hidden desert treasure! 🦌',
        'You will write a poem so beautiful it will be read in every majlis! 📜'
      ];

      var totalFortunes = 3;
      var fortuneIdx = 0, score = 0;
      var usedFortunes = shuffle(fortunes).slice(0, totalFortunes);
      var revealing = false;

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Fortune Teller 🔮</div>' +
        '<div class="ge3-status" id="ftStatus">Gaze into the crystal ball...</div>' +
        buildDots(totalFortunes) +
        '<div class="ge3-crystal" id="ftBall">' +
          '<div id="ftBallText" style="font-size:2.5rem;transition:all 0.5s;">🔮</div>' +
        '</div>' +
        '<div id="ftFortune" style="min-height:60px;text-align:center;font-size:0.95rem;padding:12px 16px;margin:8px 0;opacity:0;transition:all 0.6s;color:#FFD700;"></div>' +
        '<button class="ge3-btn ge3-btn-gold" id="ftReveal" style="margin-top:4px;padding:14px 28px;font-size:1rem;">✨ Reveal Fortune ✨</button>' +
        '<div class="ge3-sub" id="ftCount" style="margin-top:10px;">' + totalFortunes + ' fortunes remaining</div>';
      container.appendChild(wrap);

      var ballEl = wrap.querySelector('#ftBall');
      var ballTextEl = wrap.querySelector('#ftBallText');
      var fortuneEl = wrap.querySelector('#ftFortune');
      var revealBtn = wrap.querySelector('#ftReveal');
      var statusEl = wrap.querySelector('#ftStatus');
      var countEl = wrap.querySelector('#ftCount');

      function spawnSparkle() {
        var sparkle = document.createElement('div');
        sparkle.className = 'ge3-sparkle';
        sparkle.style.left = (20 + Math.random() * 140) + 'px';
        sparkle.style.top = (20 + Math.random() * 140) + 'px';
        sparkle.style.animation = 'ge3Sparkle ' + (0.6 + Math.random() * 0.6) + 's ease forwards';
        ballEl.appendChild(sparkle);
        var t = setTimeout(function () { if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle); }, 1200);
        self._tv.push(t);
      }

      revealBtn.onclick = function () {
        if (revealing) return;
        if (fortuneIdx >= totalFortunes) return;

        revealing = true;
        revealBtn.style.pointerEvents = 'none';
        revealBtn.style.opacity = '0.5';
        fortuneEl.style.opacity = '0';

        // Glow animation
        ballEl.classList.add('ge3-crystal-glow');
        ballTextEl.style.transform = 'scale(1.3)';
        ballTextEl.textContent = '✨';
        statusEl.textContent = '🌀 The ball is glowing...';

        // Sparkles
        for (var s = 0; s < 8; s++) {
          var st = setTimeout(function () { spawnSparkle(); }, s * 150);
          self._tv.push(st);
        }

        var t1 = setTimeout(function () {
          ballTextEl.style.transform = 'scale(1)';
          ballTextEl.textContent = '🔮';
          ballEl.classList.remove('ge3-crystal-glow');

          var fortune = usedFortunes[fortuneIdx];
          fortuneEl.textContent = fortune;
          fortuneEl.style.opacity = '1';
          fortuneEl.className = 'ge3-pop';

          score++;
          fortuneIdx++;
          E.addScore(1);

          statusEl.textContent = '🌟 Fortune ' + fortuneIdx + ' of ' + totalFortunes;
          updateDots(wrap, fortuneIdx, totalFortunes);
          countEl.textContent = (totalFortunes - fortuneIdx) + ' fortunes remaining';

          E.rashidSay(pick(['Interesting! ', 'How exciting! ', 'What a fortune! ']) + fortune);

          if (fortuneIdx >= totalFortunes) {
            revealBtn.textContent = '🎉 All Fortunes Revealed!';
            revealBtn.style.opacity = '0.5';
            var t2 = setTimeout(function () {
              E.endGame(score, totalFortunes);
            }, 1500);
            self._tv.push(t2);
          } else {
            revealBtn.style.pointerEvents = '';
            revealBtn.style.opacity = '';
          }
          revealing = false;
        }, 1800);
        self._tv.push(t1);
      };

      updateDots(wrap, 0, totalFortunes);
      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     5. INGREDIENT MATCH
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'ingredient-match', name: 'Ingredient Match', emoji: '🍽️', category: 'fun', has2P: true,
    _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];

      /* ── 2-PLAYER MODE ── */
      if (mode === '2p') {
        var P1_COLOR = '#4ecdc4', P2_COLOR = '#ff6b6b';
        var dishes2 = [
          { dish: 'Machboos', emoji: '🍚', ingredients: ['Rice 🍚','Meat 🥩','Spices 🌶️','Onion 🧅'] },
          { dish: 'Luqaimat', emoji: '🍡', ingredients: ['Flour 🌾','Sugar 🍬','Saffron 🧡','Cardamom 💛'] },
          { dish: 'Harees', emoji: '🍲', ingredients: ['Wheat 🌾','Meat 🥩','Butter 🧈','Salt 🧂'] },
          { dish: 'Thareed', emoji: '🥘', ingredients: ['Bread 🍞','Vegetables 🥕','Meat 🥩','Broth 🍜'] },
          { dish: 'Balaleet', emoji: '🍝', ingredients: ['Vermicelli 🍝','Eggs 🥚','Sugar 🍬','Cardamom 💛'] },
          { dish: 'Khameer', emoji: '🫓', ingredients: ['Flour 🌾','Dates 🌴','Yeast 🫧','Butter 🧈'] }
        ];

        var totalRounds2 = 6;
        var pool2 = shuffle(dishes2).slice(0, totalRounds2);
        var round2 = 0, p1Score = 0, p2Score = 0;
        var answered = false;

        var wrap2 = document.createElement('div');
        wrap2.className = 'ge3-wrap';
        wrap2.innerHTML =
          '<div class="ge3-title">Ingredient Match 🍽️ — 2 Players</div>' +
          '<div id="im2Scores" style="display:flex;justify-content:center;gap:20px;font-size:1rem;font-weight:700;margin:6px 0;">' +
            '<span style="color:' + P1_COLOR + ';">P1: 0</span>' +
            '<span style="opacity:0.4;">|</span>' +
            '<span style="color:' + P2_COLOR + ';">P2: 0</span>' +
          '</div>' +
          '<div class="ge3-status" id="im2Status">Race to match the dish!</div>' +
          buildDots(totalRounds2) +
          '<div id="im2Ingredients" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:10px 0;min-height:60px;"></div>' +
          '<div style="font-size:0.85rem;color:#FFD700;margin:6px 0;text-align:center;">⬇️ Which dish uses these ingredients?</div>' +
          '<div style="display:flex;gap:16px;width:100%;margin-top:6px;" id="im2Sides"></div>';
        container.appendChild(wrap2);

        var scoresEl2 = wrap2.querySelector('#im2Scores');
        var statusEl2 = wrap2.querySelector('#im2Status');
        var ingredientsEl2 = wrap2.querySelector('#im2Ingredients');
        var sidesEl2 = wrap2.querySelector('#im2Sides');

        function updateImScores() {
          scoresEl2.innerHTML =
            '<span style="color:' + P1_COLOR + ';">P1: ' + p1Score + '</span>' +
            '<span style="opacity:0.4;">|</span>' +
            '<span style="color:' + P2_COLOR + ';">P2: ' + p2Score + '</span>';
        }

        function showImRound() {
          if (round2 >= totalRounds2) {
            statusEl2.textContent = '🎉 All dishes done!';
            var winner = p1Score > p2Score ? 'Player 1' : p2Score > p1Score ? 'Player 2' : 'Tie';
            var msg = winner === 'Tie' ? 'It\'s a tie! Both great chefs! 👨‍🍳' : winner + ' wins! Master chef! 👨‍🍳';
            E.rashidSay(msg + ' P1: ' + p1Score + ' | P2: ' + p2Score);
            E.endGame(Math.max(p1Score, p2Score), totalRounds2);
            return;
          }

          answered = false;
          var current = pool2[round2];
          updateDots(wrap2, round2, totalRounds2);
          statusEl2.textContent = 'Round ' + (round2 + 1) + ' — Race to pick the right dish!';

          // Show ingredients
          ingredientsEl2.innerHTML = '';
          for (var ing = 0; ing < current.ingredients.length; ing++) {
            var card = document.createElement('div');
            card.className = 'ge3-card ge3-pop';
            card.style.cssText = 'padding:8px 12px;font-size:0.85rem;cursor:default;min-width:60px;';
            card.textContent = current.ingredients[ing];
            card.style.animationDelay = (ing * 0.1) + 's';
            ingredientsEl2.appendChild(card);
          }

          // Build options
          var otherDishes = dishes2.filter(function(d) { return d.dish !== current.dish; });
          var wrongDishes = shuffle(otherDishes).slice(0, 3);
          var options = shuffle([current].concat(wrongDishes));

          sidesEl2.innerHTML = '';

          // P1 side and P2 side
          var players = [
            { label: 'P1', color: P1_COLOR, scoreKey: 'p1' },
            { label: 'P2', color: P2_COLOR, scoreKey: 'p2' }
          ];

          for (var p = 0; p < players.length; p++) {
            (function(player) {
              var side = document.createElement('div');
              side.style.cssText = 'flex:1;';
              side.innerHTML = '<div style="text-align:center;font-weight:700;font-size:0.9rem;color:' + player.color + ';margin-bottom:8px;border-bottom:2px solid ' + player.color + '40;padding-bottom:4px;">' + player.label + '</div>';

              var grid = document.createElement('div');
              grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:6px;';

              for (var d = 0; d < options.length; d++) {
                (function(opt) {
                  var btn = document.createElement('div');
                  btn.className = 'ge3-card ge3-fadein';
                  btn.style.cssText = 'padding:10px 6px;cursor:pointer;text-align:center;font-size:0.8rem;';
                  btn.innerHTML = '<div style="font-size:1.4rem;">' + opt.emoji + '</div><div style="font-size:0.75rem;font-weight:600;margin-top:2px;">' + opt.dish + '</div>';

                  btn.onclick = function() {
                    if (answered) return;
                    answered = true;

                    // Disable both sides
                    sidesEl2.style.pointerEvents = 'none';

                    if (opt.dish === current.dish) {
                      btn.classList.add('ge3-correct');
                      if (player.scoreKey === 'p1') { p1Score++; } else { p2Score++; }
                      E.addScore(1);
                      updateImScores();
                      statusEl2.textContent = '✅ ' + player.label + ' got it! ' + current.dish + '!';
                      E.rashidSay(player.label + ' is faster! ' + pick(['Delicious match! 🍽️', 'Quick hands! 😋', 'Chef instincts! 👨‍🍳']));
                    } else {
                      btn.classList.add('ge3-wrong');
                      btn.classList.add('ge3-shake');
                      statusEl2.textContent = '❌ ' + player.label + ' wrong! It was ' + current.dish + '!';
                      // Award point to other player
                      if (player.scoreKey === 'p1') { p2Score++; } else { p1Score++; }
                      E.addScore(1);
                      updateImScores();
                      var otherLabel = player.scoreKey === 'p1' ? 'P2' : 'P1';
                      E.rashidSay(otherLabel + ' gets the point! It was ' + current.dish + '! 🍽️');
                    }

                    // Highlight correct in both sides
                    var allBtns = sidesEl2.querySelectorAll('.ge3-card');
                    for (var b = 0; b < allBtns.length; b++) {
                      if (allBtns[b].textContent.indexOf(current.dish) !== -1) {
                        allBtns[b].classList.add('ge3-correct');
                      }
                    }

                    round2++;
                    var t = setTimeout(function() { showImRound(); }, 1400);
                    self._tv.push(t);
                  };
                  grid.appendChild(btn);
                })(options[d]);
              }

              side.appendChild(grid);
              sidesEl2.appendChild(side);
            })(players[p]);
          }
          sidesEl2.style.pointerEvents = '';
        }

        var tStart2 = setTimeout(function() { showImRound(); }, 400);
        self._tv.push(tStart2);
        return {};
      }

      var dishes = [
        { dish: 'Machboos', emoji: '🍚', ingredients: ['Rice 🍚','Meat 🥩','Spices 🌶️','Onion 🧅'] },
        { dish: 'Luqaimat', emoji: '🍡', ingredients: ['Flour 🌾','Sugar 🍬','Saffron 🧡','Cardamom 💛'] },
        { dish: 'Harees', emoji: '🍲', ingredients: ['Wheat 🌾','Meat 🥩','Butter 🧈','Salt 🧂'] },
        { dish: 'Thareed', emoji: '🥘', ingredients: ['Bread 🍞','Vegetables 🥕','Meat 🥩','Broth 🍜'] },
        { dish: 'Balaleet', emoji: '🍝', ingredients: ['Vermicelli 🍝','Eggs 🥚','Sugar 🍬','Cardamom 💛'] },
        { dish: 'Khameer', emoji: '🫓', ingredients: ['Flour 🌾','Dates 🌴','Yeast 🫧','Butter 🧈'] }
      ];

      var totalRounds = diff === 'easy' ? 4 : diff === 'hard' ? 6 : 5;
      var pool = shuffle(dishes).slice(0, totalRounds);
      var round = 0, score = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Ingredient Match 🍽️</div>' +
        '<div class="ge3-status" id="imStatus">Match the ingredients to the dish!</div>' +
        buildDots(totalRounds) +
        '<div id="imIngredients" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:10px 0;min-height:60px;"></div>' +
        '<div style="font-size:0.85rem;color:#FFD700;margin:6px 0;text-align:center;">⬇️ Which dish uses these ingredients?</div>' +
        '<div id="imDishes" class="ge3-grid2" style="margin-top:6px;"></div>';
      container.appendChild(wrap);

      var statusEl = wrap.querySelector('#imStatus');
      var ingredientsEl = wrap.querySelector('#imIngredients');
      var dishesEl = wrap.querySelector('#imDishes');

      function showRound() {
        if (round >= totalRounds) {
          statusEl.textContent = '🎉 All dishes matched!';
          E.rashidSay('Master chef! You matched ' + score + ' dishes! 👨‍🍳');
          E.endGame(score, totalRounds);
          return;
        }

        var current = pool[round];
        updateDots(wrap, round, totalRounds);
        statusEl.textContent = 'Round ' + (round + 1) + ' of ' + totalRounds;

        // Show ingredients
        ingredientsEl.innerHTML = '';
        for (var ing = 0; ing < current.ingredients.length; ing++) {
          var card = document.createElement('div');
          card.className = 'ge3-card ge3-pop';
          card.style.cssText = 'padding:8px 12px;font-size:0.85rem;cursor:default;min-width:60px;';
          card.textContent = current.ingredients[ing];
          card.style.animationDelay = (ing * 0.1) + 's';
          ingredientsEl.appendChild(card);
        }

        // Build 4 dish buttons (correct + 3 random others)
        var otherDishes = dishes.filter(function (d) { return d.dish !== current.dish; });
        var wrongDishes = shuffle(otherDishes).slice(0, 3);
        var options = shuffle([current].concat(wrongDishes));

        dishesEl.innerHTML = '';
        for (var d = 0; d < options.length; d++) {
          (function(opt) {
            var btn = document.createElement('div');
            btn.className = 'ge3-card ge3-fadein';
            btn.style.cssText = 'padding:14px 8px;cursor:pointer;text-align:center;';
            btn.innerHTML = '<div style="font-size:1.8rem;">' + opt.emoji + '</div><div style="font-size:0.9rem;font-weight:600;margin-top:4px;">' + opt.dish + '</div>';

            btn.onclick = function () {
              dishesEl.style.pointerEvents = 'none';

              if (opt.dish === current.dish) {
                btn.classList.add('ge3-correct');
                // Animate ingredients flying in
                var cards = ingredientsEl.querySelectorAll('.ge3-card');
                for (var c = 0; c < cards.length; c++) {
                  cards[c].style.transition = 'all 0.5s ease';
                  cards[c].style.transform = 'scale(0.5)';
                  cards[c].style.opacity = '0.3';
                  cards[c].classList.add('ge3-correct');
                }
                score++;
                E.addScore(1);
                E.rashidSay(pick(['Delicious match! 🍽️', 'You know your Emirati food! 😋', 'Perfect pairing! 👨‍🍳', 'Yum! 🤤']));
                statusEl.textContent = '✅ ' + current.dish + ' — Correct!';
                round++;
                var t = setTimeout(function () { showRound(); }, 1200);
                self._tv.push(t);
              } else {
                btn.classList.add('ge3-wrong');
                btn.classList.add('ge3-shake');
                E.rashidSay('That\'s not right! Those ingredients make ' + current.dish + '! 🍽️');
                statusEl.textContent = '❌ It was ' + current.dish + '!';
                // Highlight correct
                var allBtns = dishesEl.querySelectorAll('.ge3-card');
                for (var b = 0; b < allBtns.length; b++) {
                  if (allBtns[b].textContent.indexOf(current.dish) !== -1) {
                    allBtns[b].classList.add('ge3-correct');
                  }
                }
                round++;
                var t2 = setTimeout(function () { showRound(); }, 1500);
                self._tv.push(t2);
              }
            };
            dishesEl.appendChild(btn);
          })(options[d]);
        }
        dishesEl.style.pointerEvents = '';
      }

      var tStart = setTimeout(function () { showRound(); }, 400);
      self._tv.push(tStart);
      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     6. ANIMAL SAFARI
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'animal-safari', name: 'Animal Safari', emoji: '🐪', category: 'fun', has2P: false,
    _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];
      var animals = [
        { clue: 'Ship of the desert, symbol of the UAE', emoji: '🐪', opts: ['Camel','Horse','Donkey','Elephant'], a: 0 },
        { clue: 'Bird of prey used in traditional sport', emoji: '🦅', opts: ['Eagle','Falcon','Hawk','Parrot'], a: 1 },
        { clue: 'White hoofed animal, national symbol', emoji: '🦌', opts: ['Deer','Gazelle','Arabian Oryx','Goat'], a: 2 },
        { clue: 'Sea creature with hard shell, protected in UAE waters', emoji: '🐢', opts: ['Crab','Sea Turtle','Lobster','Seal'], a: 1 },
        { clue: 'Pink bird found in UAE wetlands', emoji: '🦩', opts: ['Parrot','Pelican','Flamingo','Crane'], a: 2 },
        { clue: 'Playful sea mammal in Arabian Gulf', emoji: '🐬', opts: ['Whale','Shark','Dolphin','Seal'], a: 2 },
        { clue: 'Small desert fox with big ears', emoji: '🦊', opts: ['Wolf','Fennec Fox','Cat','Jackal'], a: 1 }
      ];

      var totalRounds = diff === 'easy' ? 5 : 7;
      var pool = shuffle(animals).slice(0, totalRounds);
      var round = 0, score = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Animal Safari 🐪</div>' +
        '<div class="ge3-status" id="asStatus">Identify the desert animals!</div>' +
        '<div class="ge3-safari-path" id="asSafari"></div>' +
        '<div style="background:rgba(255,255,255,0.04);border-radius:16px;padding:20px;width:100%;text-align:center;margin:10px 0;border:1.5px solid rgba(255,255,255,0.08);">' +
          '<div id="asEmoji" style="font-size:4rem;filter:brightness(0.15) contrast(2);transition:all 0.5s;">🐪</div>' +
          '<div id="asClue" style="font-size:0.9rem;margin-top:10px;color:#FFD700;font-style:italic;">Loading...</div>' +
        '</div>' +
        '<div id="asOpts" class="ge3-grid2" style="margin-top:6px;"></div>';
      container.appendChild(wrap);

      var statusEl = wrap.querySelector('#asStatus');
      var emojiEl = wrap.querySelector('#asEmoji');
      var clueEl = wrap.querySelector('#asClue');
      var optsEl = wrap.querySelector('#asOpts');
      var safariEl = wrap.querySelector('#asSafari');

      // Build safari path
      function buildSafari() {
        safariEl.innerHTML = '';
        for (var i = 0; i < totalRounds; i++) {
          var step = document.createElement('div');
          step.className = 'ge3-safari-step';
          step.id = 'asStep' + i;
          if (i < round) { step.classList.add('ge3-safari-done'); step.textContent = '✅'; }
          else if (i === round) { step.classList.add('ge3-safari-cur'); step.textContent = '🔍'; }
          else { step.textContent = (i + 1); }
          safariEl.appendChild(step);
          if (i < totalRounds - 1) {
            var dash = document.createElement('div');
            dash.style.cssText = 'width:16px;height:2px;background:rgba(255,255,255,0.15);border-radius:1px;';
            safariEl.appendChild(dash);
          }
        }
      }

      function showRound() {
        if (round >= totalRounds) {
          statusEl.textContent = '🎉 Safari complete!';
          emojiEl.style.filter = 'none';
          emojiEl.textContent = '🏆';
          clueEl.textContent = 'You identified ' + score + ' animals!';
          optsEl.innerHTML = '';
          E.rashidSay('Safari master! ' + score + ' out of ' + totalRounds + ' animals! 🦁');
          E.endGame(score, totalRounds);
          return;
        }

        var q = pool[round];
        buildSafari();
        statusEl.textContent = 'Animal ' + (round + 1) + ' of ' + totalRounds;

        // Silhouette
        emojiEl.textContent = q.emoji;
        emojiEl.style.filter = 'brightness(0.15) contrast(2)';
        clueEl.textContent = '"' + q.clue + '"';

        // Options
        optsEl.innerHTML = '';
        optsEl.style.pointerEvents = '';
        for (var o = 0; o < q.opts.length; o++) {
          (function(optIdx) {
            var btn = document.createElement('div');
            btn.className = 'ge3-btn ge3-btn-dim ge3-fadein';
            btn.style.cssText = 'padding:12px 8px;text-align:center;width:100%;';
            btn.textContent = q.opts[optIdx];

            btn.onclick = function () {
              optsEl.style.pointerEvents = 'none';
              if (optIdx === q.a) {
                btn.style.background = 'rgba(0,201,167,0.2)';
                btn.style.borderColor = '#00C9A7';
                btn.style.color = '#00C9A7';
                // Reveal animal
                emojiEl.style.filter = 'none';
                emojiEl.style.animation = 'ge3Reveal 0.6s ease forwards';
                score++;
                E.addScore(1);
                E.rashidSay(pick(['Correct! It\'s a ' + q.opts[q.a] + '! 🎯', 'You found the ' + q.opts[q.a] + '! 🌟', 'Sharp eyes! 🦅']));
                statusEl.textContent = '✅ ' + q.opts[q.a] + '!';
              } else {
                btn.style.background = 'rgba(255,80,80,0.2)';
                btn.style.borderColor = '#ff5050';
                btn.style.color = '#ff5050';
                btn.classList.add('ge3-shake');
                emojiEl.style.filter = 'none';
                // Highlight correct
                var allBtns = optsEl.querySelectorAll('.ge3-btn');
                allBtns[q.a].style.background = 'rgba(0,201,167,0.2)';
                allBtns[q.a].style.borderColor = '#00C9A7';
                allBtns[q.a].style.color = '#00C9A7';
                E.rashidSay('Not quite! It was the ' + q.opts[q.a] + '! 🤔');
                statusEl.textContent = '❌ It was ' + q.opts[q.a];
              }
              round++;
              var t = setTimeout(function () { showRound(); }, 1400);
              self._tv.push(t);
            };
            optsEl.appendChild(btn);
          })(o);
        }
      }

      var tStart = setTimeout(function () { showRound(); }, 400);
      self._tv.push(tStart);
      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     7. ISLAND EXPLORER
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'island-explorer', name: 'Island Explorer', emoji: '🏝️', category: 'fun', has2P: false,
    _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];
      var islands = [
        { clue: 'Home to Ferrari World and F1 racing', opts: ['Palm Jumeirah','Yas Island','Saadiyat','Bluewaters'], a: 1 },
        { clue: 'Cultural district with Louvre Abu Dhabi', opts: ['Yas Island','The World','Saadiyat Island','Al Marjan'], a: 2 },
        { clue: 'Palm-tree shaped island in Dubai', opts: ['Bluewaters','Yas Island','Palm Jumeirah','World Islands'], a: 2 },
        { clue: 'Nature reserve with Arabian wildlife', opts: ['Sir Bani Yas','Palm Jumeirah','Yas Island','Saadiyat'], a: 0 },
        { clue: 'Home to Ain Dubai (largest Ferris wheel)', opts: ['Yas Island','Saadiyat','Palm Jumeirah','Bluewaters Island'], a: 3 },
        { clue: 'Man-made islands shaped like world map', opts: ['Palm Jumeirah','World Islands','Al Marjan','Yas Island'], a: 1 },
        { clue: 'Coral-shaped island in Ras Al Khaimah', opts: ['Saadiyat','Yas Island','Al Marjan Island','Bluewaters'], a: 2 }
      ];

      // Island pin positions on mini-map (relative percentages)
      var pinPositions = {
        'Yas Island': {x: 25, y: 55},
        'Saadiyat Island': {x: 20, y: 40},
        'Saadiyat': {x: 20, y: 40},
        'Palm Jumeirah': {x: 55, y: 35},
        'Sir Bani Yas': {x: 10, y: 65},
        'Bluewaters Island': {x: 58, y: 42},
        'Bluewaters': {x: 58, y: 42},
        'World Islands': {x: 62, y: 30},
        'The World': {x: 62, y: 30},
        'Al Marjan Island': {x: 78, y: 22},
        'Al Marjan': {x: 78, y: 22}
      };

      var totalRounds = diff === 'easy' ? 5 : 7;
      var pool = shuffle(islands).slice(0, totalRounds);
      var round = 0, score = 0;
      var discovered = [];

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Island Explorer 🏝️</div>' +
        '<div class="ge3-status" id="ieStatus">Discover UAE islands!</div>' +
        buildDots(totalRounds) +
        '<div class="ge3-map" id="ieMap">' +
          '<div style="position:absolute;top:6px;left:8px;font-size:0.65rem;opacity:0.4;">🗺️ UAE Map</div>' +
          '<div style="position:absolute;bottom:6px;right:8px;font-size:0.65rem;opacity:0.4;">Arabian Gulf</div>' +
        '</div>' +
        '<div style="background:rgba(255,215,0,0.06);border:1.5px dashed rgba(255,215,0,0.2);border-radius:12px;padding:14px;width:100%;text-align:center;margin:8px 0;">' +
          '<div style="font-size:0.75rem;opacity:0.5;margin-bottom:4px;">🗺️ TREASURE MAP CLUE</div>' +
          '<div id="ieClue" style="font-size:0.95rem;color:#FFD700;font-weight:600;">Loading...</div>' +
        '</div>' +
        '<div id="ieOpts" class="ge3-grid2" style="margin-top:6px;"></div>' +
        '<div class="ge3-sub" id="ieDiscovered" style="margin-top:8px;">Islands discovered: 0</div>';
      container.appendChild(wrap);

      var statusEl = wrap.querySelector('#ieStatus');
      var clueEl = wrap.querySelector('#ieClue');
      var optsEl = wrap.querySelector('#ieOpts');
      var mapEl = wrap.querySelector('#ieMap');
      var discoveredEl = wrap.querySelector('#ieDiscovered');

      function addIslandPin(name) {
        var pos = pinPositions[name] || {x: 50, y: 50};
        var pin = document.createElement('div');
        pin.className = 'ge3-island-pin ge3-pop';
        pin.style.left = pos.x + '%';
        pin.style.top = pos.y + '%';
        pin.textContent = '🏝️';
        pin.title = name;
        mapEl.appendChild(pin);

        var label = document.createElement('div');
        label.style.cssText = 'position:absolute;font-size:0.5rem;color:#FFD700;white-space:nowrap;transform:translateX(-50%);';
        label.style.left = pos.x + '%';
        label.style.top = (pos.y + 12) + '%';
        label.textContent = name;
        mapEl.appendChild(label);
      }

      function showRound() {
        if (round >= totalRounds) {
          statusEl.textContent = '🎉 Exploration complete!';
          clueEl.textContent = 'You discovered ' + score + ' islands!';
          optsEl.innerHTML = '';
          E.rashidSay('Island explorer! ' + score + ' out of ' + totalRounds + '! 🏝️');
          E.endGame(score, totalRounds);
          return;
        }

        var q = pool[round];
        updateDots(wrap, round, totalRounds);
        statusEl.textContent = 'Island ' + (round + 1) + ' of ' + totalRounds;
        clueEl.textContent = '"' + q.clue + '"';

        optsEl.innerHTML = '';
        optsEl.style.pointerEvents = '';
        for (var o = 0; o < q.opts.length; o++) {
          (function(optIdx) {
            var btn = document.createElement('div');
            btn.className = 'ge3-btn ge3-btn-dim ge3-fadein';
            btn.style.cssText = 'padding:12px 8px;text-align:center;width:100%;';
            btn.innerHTML = '🏝️ ' + q.opts[optIdx];

            btn.onclick = function () {
              optsEl.style.pointerEvents = 'none';
              if (optIdx === q.a) {
                btn.style.background = 'rgba(0,201,167,0.2)';
                btn.style.borderColor = '#00C9A7';
                btn.style.color = '#00C9A7';
                score++;
                E.addScore(1);
                discovered.push(q.opts[q.a]);
                addIslandPin(q.opts[q.a]);
                discoveredEl.textContent = 'Islands discovered: ' + discovered.length;
                E.rashidSay(pick(['You found ' + q.opts[q.a] + '! 🏝️', 'Island discovered! 🗺️', 'Great exploring! 🌊']));
                statusEl.textContent = '✅ ' + q.opts[q.a] + '!';
              } else {
                btn.style.background = 'rgba(255,80,80,0.2)';
                btn.style.borderColor = '#ff5050';
                btn.style.color = '#ff5050';
                btn.classList.add('ge3-shake');
                var allBtns = optsEl.querySelectorAll('.ge3-btn');
                allBtns[q.a].style.background = 'rgba(0,201,167,0.2)';
                allBtns[q.a].style.borderColor = '#00C9A7';
                allBtns[q.a].style.color = '#00C9A7';
                E.rashidSay('Not that one! It was ' + q.opts[q.a] + '! 🤔');
                statusEl.textContent = '❌ It was ' + q.opts[q.a];
              }
              round++;
              var t = setTimeout(function () { showRound(); }, 1400);
              self._tv.push(t);
            };
            optsEl.appendChild(btn);
          })(o);
        }
      }

      var tStart = setTimeout(function () { showRound(); }, 400);
      self._tv.push(tStart);
      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     8. GEOGRAPHY BINGO
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'geography-bingo', name: 'Geography Bingo', emoji: '🗾', category: 'fun', has2P: false,
    _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];
      var geoItems = [
        { name: 'Arabian Gulf', clue: 'Body of water north of UAE' },
        { name: 'Arabian Sea', clue: 'Body of water east of UAE' },
        { name: 'Hajar Mountains', clue: 'Mountain range in UAE' },
        { name: 'Rub al Khali', clue: 'Vast desert (Empty Quarter)' },
        { name: 'Dubai Creek', clue: 'Historic waterway in Dubai' },
        { name: 'Palm Jumeirah', clue: 'Palm-shaped island' },
        { name: 'Yas Island', clue: 'Island with Ferrari World' },
        { name: 'Jebel Jais', clue: 'Highest peak in UAE' },
        { name: 'Al Ain Oasis', clue: 'Famous oasis city' },
        { name: 'Liwa Oasis', clue: 'Oasis near Empty Quarter' },
        { name: 'Khor Fakkan', clue: 'Coastal city in Fujairah' },
        { name: 'Hatta', clue: 'Mountain town near Dubai' }
      ];

      // Pick 9 random items for the bingo grid
      var boardItems = shuffle(geoItems).slice(0, 9);
      var marked = [false,false,false,false,false,false,false,false,false];
      var clueQueue = shuffle(boardItems.slice());
      var clueIdx = 0;
      var score = 0;
      var bingoFound = false;

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Geography Bingo 🗾</div>' +
        '<div class="ge3-status" id="gbStatus">Read the clue and find the match!</div>' +
        '<div style="background:rgba(255,215,0,0.08);border-radius:10px;padding:10px 16px;margin:8px 0;border:1px solid rgba(255,215,0,0.15);width:100%;text-align:center;">' +
          '<div style="font-size:0.7rem;opacity:0.5;margin-bottom:4px;">CLUE</div>' +
          '<div id="gbClue" style="font-size:0.95rem;color:#FFD700;font-weight:600;">Loading...</div>' +
        '</div>' +
        '<div id="gbGrid" class="ge3-grid3" style="margin:10px 0;position:relative;"></div>' +
        '<div class="ge3-sub" id="gbHint">Find 3 in a row for BINGO!</div>' +
        '<div class="ge3-sub" id="gbScore" style="font-family:Orbitron,sans-serif;">Matches: 0/9</div>';
      container.appendChild(wrap);

      var statusEl = wrap.querySelector('#gbStatus');
      var clueEl = wrap.querySelector('#gbClue');
      var gridEl = wrap.querySelector('#gbGrid');
      var hintEl = wrap.querySelector('#gbHint');
      var scoreEl = wrap.querySelector('#gbScore');
      var cells = [];

      // Build bingo grid
      for (var i = 0; i < 9; i++) {
        (function(idx) {
          var cell = document.createElement('div');
          cell.className = 'ge3-bingo-cell';
          cell.textContent = boardItems[idx].name;
          cell.setAttribute('data-idx', idx);

          cell.onclick = function () {
            if (marked[idx] || bingoFound) return;
            if (clueIdx >= clueQueue.length) return;

            var currentClue = clueQueue[clueIdx];
            if (boardItems[idx].name === currentClue.name) {
              // Correct match
              marked[idx] = true;
              cell.classList.add('ge3-bingo-marked');
              cell.innerHTML = '✅ ' + boardItems[idx].name;
              cell.style.pointerEvents = 'none';
              score++;
              E.addScore(1);
              scoreEl.textContent = 'Matches: ' + score + '/9';
              E.rashidSay(pick(['Correct! 🎯', 'Nice find! 🗺️', 'Great geography! 🌍']));

              // Check for bingo (3 in a row)
              var lines = [
                [0,1,2],[3,4,5],[6,7,8], // rows
                [0,3,6],[1,4,7],[2,5,8], // cols
                [0,4,8],[2,4,6]          // diagonals
              ];
              for (var l = 0; l < lines.length; l++) {
                if (marked[lines[l][0]] && marked[lines[l][1]] && marked[lines[l][2]]) {
                  bingoFound = true;
                  statusEl.textContent = '🎉 BINGO! 3 in a row!';
                  statusEl.style.color = '#FFD700';
                  statusEl.style.fontSize = '1.3rem';
                  hintEl.textContent = '🏆 You got BINGO!';
                  hintEl.style.color = '#FFD700';

                  // Highlight the winning line
                  for (var w = 0; w < 3; w++) {
                    cells[lines[l][w]].style.background = 'rgba(255,215,0,0.25)';
                    cells[lines[l][w]].style.borderColor = '#FFD700';
                    cells[lines[l][w]].style.boxShadow = '0 0 15px rgba(255,215,0,0.3)';
                  }

                  E.rashidSay('BINGO! You\'re a geography star! 🌟🗺️');
                  var t = setTimeout(function () {
                    E.endGame(score, 9);
                  }, 1500);
                  self._tv.push(t);
                  return;
                }
              }

              // Next clue
              clueIdx++;
              if (clueIdx < clueQueue.length) {
                var t2 = setTimeout(function () {
                  clueEl.textContent = clueQueue[clueIdx].clue;
                  clueEl.className = 'ge3-pop';
                }, 600);
                self._tv.push(t2);
              } else if (!bingoFound) {
                // All clues used, no bingo
                statusEl.textContent = 'All clues used!';
                var t3 = setTimeout(function () {
                  E.endGame(score, 9);
                }, 1000);
                self._tv.push(t3);
              }
            } else {
              // Wrong cell
              cell.classList.add('ge3-shake');
              cell.style.borderColor = '#ff5050';
              E.rashidSay('That\'s not the right one! Read the clue again! 🤔');
              var t4 = setTimeout(function () {
                cell.classList.remove('ge3-shake');
                cell.style.borderColor = '';
              }, 500);
              self._tv.push(t4);
            }
          };
          gridEl.appendChild(cell);
          cells.push(cell);
        })(i);
      }

      // Show first clue
      clueEl.textContent = clueQueue[0].clue;
      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     9. DRESS UP QUIZ
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'dress-up', name: 'Dress Up Quiz', emoji: '👘', category: 'fun', has2P: false,
    _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];
      var dressQs = [
        { q: 'White robe worn by Emirati men?', emoji: '👘', opts: ['Kandura','Kimono','Sarong','Toga'], a: 0 },
        { q: 'Headscarf worn by Emirati men?', emoji: '🧕', opts: ['Turban','Ghutrah','Beret','Cap'], a: 1 },
        { q: 'What holds the ghutrah in place?', emoji: '⭕', opts: ['Pin','Agal','Belt','Clip'], a: 1 },
        { q: 'Black cloak worn by Emirati women?', emoji: '👗', opts: ['Kimono','Sari','Abaya','Robe'], a: 2 },
        { q: 'Headscarf worn by Emirati women?', emoji: '🧣', opts: ['Hijab','Sheila','Turban','Beret'], a: 1 },
        { q: 'Popular perfume ingredient in UAE?', emoji: '🪵', opts: ['Lavender','Vanilla','Oud','Rose'], a: 2 },
        { q: 'Traditional men\'s fragrance bottle?', emoji: '🏺', opts: ['Cologne','Mabkhara','Perfume','Spray'], a: 1 }
      ];

      var totalRounds = diff === 'easy' ? 5 : 7;
      var pool = shuffle(dressQs).slice(0, totalRounds);
      var round = 0, score = 0;

      // Outfit items that fill up as you answer correctly
      var outfitParts = ['👘', '🧕', '⭕', '👗', '🧣', '🪵', '🏺'];

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Dress Up Quiz 👘</div>' +
        '<div class="ge3-status" id="duStatus">Test your Emirati fashion knowledge!</div>' +
        '<div style="display:flex;align-items:center;gap:12px;width:100%;margin:8px 0;">' +
          '<div style="font-size:0.75rem;color:#FF6B35;">Outfit</div>' +
          '<div class="ge3-outfit-meter" style="flex:1;"><div class="ge3-outfit-fill" id="duMeter" style="width:0%;"></div></div>' +
          '<div id="duMeterText" style="font-size:0.75rem;font-family:Orbitron,sans-serif;color:#FFD700;">0%</div>' +
        '</div>' +
        '<div id="duOutfit" style="display:flex;gap:6px;justify-content:center;margin:4px 0;min-height:32px;"></div>' +
        '<div style="background:rgba(255,255,255,0.04);border-radius:16px;padding:20px;width:100%;text-align:center;margin:10px 0;border:1.5px solid rgba(255,255,255,0.08);">' +
          '<div id="duEmoji" style="font-size:3.5rem;">' + pool[0].emoji + '</div>' +
          '<div id="duQuestion" style="font-size:0.95rem;margin-top:10px;color:#FFD700;font-weight:600;">Loading...</div>' +
        '</div>' +
        buildDots(totalRounds) +
        '<div id="duOpts" class="ge3-grid2" style="margin-top:6px;"></div>';
      container.appendChild(wrap);

      var statusEl = wrap.querySelector('#duStatus');
      var emojiEl = wrap.querySelector('#duEmoji');
      var questionEl = wrap.querySelector('#duQuestion');
      var optsEl = wrap.querySelector('#duOpts');
      var meterEl = wrap.querySelector('#duMeter');
      var meterTextEl = wrap.querySelector('#duMeterText');
      var outfitEl = wrap.querySelector('#duOutfit');

      function updateMeter() {
        var pct = Math.round((score / totalRounds) * 100);
        meterEl.style.width = pct + '%';
        meterTextEl.textContent = pct + '%';
      }

      function addOutfitItem(emoji) {
        var item = document.createElement('span');
        item.style.cssText = 'font-size:1.5rem;';
        item.className = 'ge3-pop';
        item.textContent = emoji;
        outfitEl.appendChild(item);
      }

      function showRound() {
        if (round >= totalRounds) {
          statusEl.textContent = '🎉 Fashion expert!';
          questionEl.textContent = 'You scored ' + score + ' out of ' + totalRounds + '!';
          emojiEl.textContent = '🏆';
          optsEl.innerHTML = '';
          E.rashidSay('Fashion expert! ' + score + ' out of ' + totalRounds + '! 👘');
          E.endGame(score, totalRounds);
          return;
        }

        var q = pool[round];
        updateDots(wrap, round, totalRounds);
        statusEl.textContent = 'Question ' + (round + 1) + ' of ' + totalRounds;
        emojiEl.textContent = q.emoji;
        emojiEl.className = 'ge3-pop';
        questionEl.textContent = q.q;

        optsEl.innerHTML = '';
        optsEl.style.pointerEvents = '';
        for (var o = 0; o < q.opts.length; o++) {
          (function(optIdx) {
            var btn = document.createElement('div');
            btn.className = 'ge3-btn ge3-btn-dim ge3-fadein';
            btn.style.cssText = 'padding:12px 8px;text-align:center;width:100%;';
            btn.textContent = q.opts[optIdx];

            btn.onclick = function () {
              optsEl.style.pointerEvents = 'none';
              if (optIdx === q.a) {
                btn.style.background = 'rgba(0,201,167,0.2)';
                btn.style.borderColor = '#00C9A7';
                btn.style.color = '#00C9A7';
                score++;
                E.addScore(1);
                updateMeter();
                addOutfitItem(q.emoji);
                E.rashidSay(pick(['Correct! ' + q.opts[q.a] + '! 👘', 'Fashion genius! 🌟', 'You know your Emirati fashion! 👗']));
                statusEl.textContent = '✅ ' + q.opts[q.a] + '!';
              } else {
                btn.style.background = 'rgba(255,80,80,0.2)';
                btn.style.borderColor = '#ff5050';
                btn.style.color = '#ff5050';
                btn.classList.add('ge3-shake');
                var allBtns = optsEl.querySelectorAll('.ge3-btn');
                allBtns[q.a].style.background = 'rgba(0,201,167,0.2)';
                allBtns[q.a].style.borderColor = '#00C9A7';
                allBtns[q.a].style.color = '#00C9A7';
                E.rashidSay('Not quite! It\'s ' + q.opts[q.a] + '! 🤔');
                statusEl.textContent = '❌ It was ' + q.opts[q.a];
              }
              round++;
              var t = setTimeout(function () { showRound(); }, 1400);
              self._tv.push(t);
            };
            optsEl.appendChild(btn);
          })(o);
        }
      }

      var tStart = setTimeout(function () { showRound(); }, 400);
      self._tv.push(tStart);
      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     10. UAE BUCKET LIST
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'bucket-list', name: 'UAE Bucket List', emoji: '✈️', category: 'fun', has2P: false,
    _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];
      var activities = [
        { activity: 'Skydiving over Palm Jumeirah', emoji: '🪂', opts: ['Abu Dhabi','Dubai','Sharjah','Fujairah'], a: 1 },
        { activity: 'Visiting the Louvre museum', emoji: '🖼️', opts: ['Dubai','Sharjah','Abu Dhabi','Ajman'], a: 2 },
        { activity: 'Dune bashing in the desert', emoji: '🏜️', opts: ['Dubai','Fujairah','Sharjah','Umm Al Quwain'], a: 0 },
        { activity: 'Climbing Jebel Jais', emoji: '⛰️', opts: ['Dubai','Abu Dhabi','Ras Al Khaimah','Sharjah'], a: 2 },
        { activity: 'Visiting Ferrari World', emoji: '🏎️', opts: ['Dubai','Abu Dhabi','Sharjah','Ajman'], a: 1 },
        { activity: 'Kayaking through mangroves', emoji: '🛶', opts: ['Dubai','Abu Dhabi','Fujairah','Ajman'], a: 1 },
        { activity: 'Shopping at the Gold Souk', emoji: '💰', opts: ['Abu Dhabi','Sharjah','Dubai','Ajman'], a: 2 },
        { activity: 'Snorkeling at Fujairah beach', emoji: '🤿', opts: ['Dubai','Abu Dhabi','Sharjah','Fujairah'], a: 3 }
      ];

      var totalRounds = diff === 'easy' ? 5 : diff === 'hard' ? 8 : 6;
      var pool = shuffle(activities).slice(0, totalRounds);
      var round = 0, score = 0;

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">UAE Bucket List ✈️</div>' +
        '<div class="ge3-status" id="blStatus">Which emirate has this activity?</div>' +
        buildDots(totalRounds) +
        '<div style="background:rgba(255,255,255,0.04);border-radius:16px;padding:20px;width:100%;text-align:center;margin:10px 0;border:1.5px solid rgba(255,255,255,0.08);">' +
          '<div id="blEmoji" style="font-size:3.5rem;">✈️</div>' +
          '<div id="blActivity" style="font-size:1rem;margin-top:10px;font-weight:600;color:#FFD700;">Loading...</div>' +
        '</div>' +
        '<div id="blOpts" class="ge3-grid2" style="margin-top:6px;"></div>' +
        '<div id="blBucket" style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-top:12px;min-height:30px;"></div>' +
        '<div class="ge3-sub" id="blCount" style="margin-top:4px;">Bucket: 0 activities</div>';
      container.appendChild(wrap);

      var statusEl = wrap.querySelector('#blStatus');
      var emojiEl = wrap.querySelector('#blEmoji');
      var activityEl = wrap.querySelector('#blActivity');
      var optsEl = wrap.querySelector('#blOpts');
      var bucketEl = wrap.querySelector('#blBucket');
      var countEl = wrap.querySelector('#blCount');

      function addToBucket(emoji, name) {
        var stamp = document.createElement('div');
        stamp.className = 'ge3-stamp ge3-pop';
        stamp.innerHTML = emoji + ' ' + name;
        bucketEl.appendChild(stamp);
      }

      function showRound() {
        if (round >= totalRounds) {
          statusEl.textContent = '🎉 Bucket list complete!';
          activityEl.textContent = score + ' out of ' + totalRounds + ' activities matched!';
          emojiEl.textContent = '🏆';
          optsEl.innerHTML = '';
          E.rashidSay('Travel expert! ' + score + ' out of ' + totalRounds + '! ✈️');
          E.endGame(score, totalRounds);
          return;
        }

        var q = pool[round];
        updateDots(wrap, round, totalRounds);
        statusEl.textContent = 'Activity ' + (round + 1) + ' of ' + totalRounds;
        emojiEl.textContent = q.emoji;
        emojiEl.className = 'ge3-pop';
        activityEl.textContent = q.activity;

        optsEl.innerHTML = '';
        optsEl.style.pointerEvents = '';
        for (var o = 0; o < q.opts.length; o++) {
          (function(optIdx) {
            var btn = document.createElement('div');
            btn.className = 'ge3-btn ge3-btn-dim ge3-fadein';
            btn.style.cssText = 'padding:12px 8px;text-align:center;width:100%;';
            btn.innerHTML = '📍 ' + q.opts[optIdx];

            btn.onclick = function () {
              optsEl.style.pointerEvents = 'none';
              if (optIdx === q.a) {
                btn.style.background = 'rgba(0,201,167,0.2)';
                btn.style.borderColor = '#00C9A7';
                btn.style.color = '#00C9A7';
                score++;
                E.addScore(1);
                addToBucket(q.emoji, q.activity.split(' ').slice(0, 2).join(' '));
                countEl.textContent = 'Bucket: ' + score + ' activities';
                E.rashidSay(pick(['Correct! That\'s in ' + q.opts[q.a] + '! 📍', 'You know UAE well! 🗺️', 'Perfect! ✈️']));
                statusEl.textContent = '✅ ' + q.opts[q.a] + '!';
              } else {
                btn.style.background = 'rgba(255,80,80,0.2)';
                btn.style.borderColor = '#ff5050';
                btn.style.color = '#ff5050';
                btn.classList.add('ge3-shake');
                var allBtns = optsEl.querySelectorAll('.ge3-btn');
                allBtns[q.a].style.background = 'rgba(0,201,167,0.2)';
                allBtns[q.a].style.borderColor = '#00C9A7';
                allBtns[q.a].style.color = '#00C9A7';
                E.rashidSay('Not quite! It\'s in ' + q.opts[q.a] + '! 🤔');
                statusEl.textContent = '❌ It\'s in ' + q.opts[q.a];
              }
              round++;
              var t = setTimeout(function () { showRound(); }, 1400);
              self._tv.push(t);
            };
            optsEl.appendChild(btn);
          })(o);
        }
      }

      var tStart = setTimeout(function () { showRound(); }, 400);
      self._tv.push(tStart);
      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     11. CATEGORY BLAST
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'category-blast', name: 'Category Blast', emoji: '🏷️', category: 'fun', has2P: true,
    _iv: null, _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];

      /* ── 2-PLAYER MODE ── */
      if (mode === '2p') {
        var P1_COLOR = '#4ecdc4', P2_COLOR = '#ff6b6b';
        var catItems2 = [
          { name: 'Burj Khalifa', cat: 'Landmark' }, { name: 'Machboos', cat: 'Food' },
          { name: 'Camel', cat: 'Animal' }, { name: 'Falconry', cat: 'Tradition' },
          { name: 'Luqaimat', cat: 'Food' }, { name: 'Dubai Frame', cat: 'Landmark' },
          { name: 'Oryx', cat: 'Animal' }, { name: 'Pearl Diving', cat: 'Tradition' },
          { name: 'Harees', cat: 'Food' }, { name: 'Sheikh Zayed Mosque', cat: 'Landmark' },
          { name: 'Falcon', cat: 'Animal' }, { name: 'Henna Art', cat: 'Tradition' },
          { name: 'Balaleet', cat: 'Food' }, { name: 'Museum of Future', cat: 'Landmark' },
          { name: 'Flamingo', cat: 'Animal' }, { name: 'Arabic Coffee Ceremony', cat: 'Tradition' }
        ];

        var totalItems2 = diff === 'easy' ? 10 : 15;
        var pool2 = shuffle(catItems2).slice(0, totalItems2);
        var itemIdx2 = 0, p1Score = 0, p2Score = 0, done2 = false, answered2 = false;

        var bucketDefs2 = [
          { name: 'Food', emoji: '🍽️', color: '#FF6B35' },
          { name: 'Landmark', emoji: '🏛️', color: '#FFD700' },
          { name: 'Animal', emoji: '🐾', color: '#00C9A7' },
          { name: 'Tradition', emoji: '🏺', color: '#9b59b6' }
        ];

        var wrap2 = document.createElement('div');
        wrap2.className = 'ge3-wrap';
        wrap2.innerHTML =
          '<div class="ge3-title">Category Blast 🏷️ — 2 Players</div>' +
          '<div id="cb2Scores" style="display:flex;justify-content:center;gap:20px;font-size:1rem;font-weight:700;margin:6px 0;">' +
            '<span style="color:' + P1_COLOR + ';">P1: 0</span>' +
            '<span style="opacity:0.4;">|</span>' +
            '<span style="color:' + P2_COLOR + ';">P2: 0</span>' +
          '</div>' +
          '<div class="ge3-status" id="cb2Status">Race to sort items!</div>' +
          '<div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:18px;width:100%;text-align:center;margin:10px 0;border:1.5px solid rgba(255,255,255,0.1);min-height:70px;">' +
            '<div id="cb2Item" style="font-size:1.3rem;font-weight:700;color:#fff;">Loading...</div>' +
            '<div id="cb2ItemSub" style="font-size:0.75rem;opacity:0.5;margin-top:4px;"></div>' +
          '</div>' +
          '<div id="cb2Feedback" style="min-height:24px;margin-bottom:8px;text-align:center;font-size:0.9rem;font-weight:600;"></div>' +
          '<div style="display:flex;gap:16px;width:100%;" id="cb2Sides"></div>';
        container.appendChild(wrap2);

        var scoresEl2 = wrap2.querySelector('#cb2Scores');
        var statusEl2 = wrap2.querySelector('#cb2Status');
        var itemEl2 = wrap2.querySelector('#cb2Item');
        var itemSubEl2 = wrap2.querySelector('#cb2ItemSub');
        var feedbackEl2 = wrap2.querySelector('#cb2Feedback');
        var sidesEl2 = wrap2.querySelector('#cb2Sides');

        function updateCbScores() {
          scoresEl2.innerHTML =
            '<span style="color:' + P1_COLOR + ';">P1: ' + p1Score + '</span>' +
            '<span style="opacity:0.4;">|</span>' +
            '<span style="color:' + P2_COLOR + ';">P2: ' + p2Score + '</span>';
        }

        function showCbItem() {
          if (itemIdx2 >= pool2.length) return;
          answered2 = false;
          var current = pool2[itemIdx2];
          itemEl2.textContent = current.name;
          itemEl2.style.color = '#fff';
          itemEl2.className = 'ge3-pop';
          itemSubEl2.textContent = 'Item ' + (itemIdx2 + 1) + ' of ' + totalItems2;
          feedbackEl2.textContent = '';
          sidesEl2.style.pointerEvents = '';
        }

        // Build P1 side and P2 side with identical bucket buttons
        var players2 = [
          { label: 'P1', color: P1_COLOR, scoreKey: 'p1' },
          { label: 'P2', color: P2_COLOR, scoreKey: 'p2' }
        ];

        for (var p = 0; p < players2.length; p++) {
          (function(player) {
            var side = document.createElement('div');
            side.style.cssText = 'flex:1;';
            side.innerHTML = '<div style="text-align:center;font-weight:700;font-size:0.9rem;color:' + player.color + ';margin-bottom:8px;border-bottom:2px solid ' + player.color + '40;padding-bottom:4px;">' + player.label + '</div>';

            var bucketsDiv = document.createElement('div');
            bucketsDiv.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:6px;';

            for (var b = 0; b < bucketDefs2.length; b++) {
              (function(bDef) {
                var bucket = document.createElement('div');
                bucket.className = 'ge3-bucket';
                bucket.style.cssText = 'background:' + bDef.color + '15;border-color:' + bDef.color + '40;color:' + bDef.color + ';padding:8px 4px;font-size:0.7rem;min-width:auto;';
                bucket.innerHTML = '<div style="font-size:1.1rem;">' + bDef.emoji + '</div><div style="font-size:0.65rem;margin-top:2px;">' + bDef.name + '</div>';

                bucket.onmouseenter = function() { bucket.style.borderColor = bDef.color; bucket.style.background = bDef.color + '30'; };
                bucket.onmouseleave = function() { bucket.style.borderColor = bDef.color + '40'; bucket.style.background = bDef.color + '15'; };

                bucket.onclick = function() {
                  if (done2 || answered2 || itemIdx2 >= pool2.length) return;
                  answered2 = true;
                  sidesEl2.style.pointerEvents = 'none';
                  var current = pool2[itemIdx2];

                  if (current.cat === bDef.name) {
                    if (player.scoreKey === 'p1') { p1Score++; } else { p2Score++; }
                    E.addScore(1);
                    updateCbScores();
                    feedbackEl2.textContent = '✅ ' + player.label + ': ' + current.name + ' → ' + bDef.name;
                    feedbackEl2.style.color = '#00C9A7';
                    itemEl2.style.color = '#00C9A7';
                    bucket.style.transform = 'scale(1.15)';
                    bucket.style.boxShadow = '0 0 20px ' + bDef.color + '50';
                    var tAnim = setTimeout(function() {
                      bucket.style.transform = '';
                      bucket.style.boxShadow = '';
                    }, 300);
                    self._tv.push(tAnim);
                    E.rashidSay(player.label + ' scores! ' + pick(['Correct! 🎯', 'Nice sort! 🏷️', 'Right category! ✅']));
                  } else {
                    feedbackEl2.textContent = '❌ ' + player.label + ' wrong! ' + current.name + ' is ' + current.cat;
                    feedbackEl2.style.color = '#ff5050';
                    itemEl2.style.color = '#ff5050';
                    itemEl2.parentElement.classList.add('ge3-shake');
                    var tShake = setTimeout(function() {
                      itemEl2.parentElement.classList.remove('ge3-shake');
                    }, 400);
                    self._tv.push(tShake);
                    // Award point to the other player
                    if (player.scoreKey === 'p1') { p2Score++; } else { p1Score++; }
                    E.addScore(1);
                    updateCbScores();
                    var otherLabel = player.scoreKey === 'p1' ? 'P2' : 'P1';
                    E.rashidSay(otherLabel + ' gets the point! ' + pick(['Oops! That\'s ' + current.cat + '!', 'Wrong bucket!']));
                  }

                  itemIdx2++;
                  if (itemIdx2 >= pool2.length) {
                    done2 = true;
                    statusEl2.textContent = '🎉 All sorted!';
                    itemEl2.textContent = '🏆';
                    var winner = p1Score > p2Score ? 'Player 1' : p2Score > p1Score ? 'Player 2' : 'Tie';
                    var winMsg = winner === 'Tie' ? 'It\'s a tie!' : winner + ' wins!';
                    itemSubEl2.textContent = winMsg + ' P1: ' + p1Score + ' | P2: ' + p2Score;
                    E.rashidSay('Blast complete! ' + winMsg + ' 🏷️');
                    var t3 = setTimeout(function() { E.endGame(Math.max(p1Score, p2Score), totalItems2); }, 1200);
                    self._tv.push(t3);
                  } else {
                    var t4 = setTimeout(function() { showCbItem(); }, 400);
                    self._tv.push(t4);
                  }
                };
                bucketsDiv.appendChild(bucket);
              })(bucketDefs2[b]);
            }

            side.appendChild(bucketsDiv);
            sidesEl2.appendChild(side);
          })(players2[p]);
        }

        // Show first item
        showCbItem();
        return {};
      }

      var catItems = [
        { name: 'Burj Khalifa', cat: 'Landmark' }, { name: 'Machboos', cat: 'Food' },
        { name: 'Camel', cat: 'Animal' }, { name: 'Falconry', cat: 'Tradition' },
        { name: 'Luqaimat', cat: 'Food' }, { name: 'Dubai Frame', cat: 'Landmark' },
        { name: 'Oryx', cat: 'Animal' }, { name: 'Pearl Diving', cat: 'Tradition' },
        { name: 'Harees', cat: 'Food' }, { name: 'Sheikh Zayed Mosque', cat: 'Landmark' },
        { name: 'Falcon', cat: 'Animal' }, { name: 'Henna Art', cat: 'Tradition' },
        { name: 'Balaleet', cat: 'Food' }, { name: 'Museum of Future', cat: 'Landmark' },
        { name: 'Flamingo', cat: 'Animal' }, { name: 'Arabic Coffee Ceremony', cat: 'Tradition' },
        { name: 'Thareed', cat: 'Food' }, { name: 'Palm Jumeirah', cat: 'Landmark' },
        { name: 'Gazelle', cat: 'Animal' }, { name: 'Camel Racing', cat: 'Tradition' }
      ];

      var totalItems = diff === 'easy' ? 12 : 20;
      var totalTime = diff === 'easy' ? 60 : diff === 'hard' ? 35 : 45;
      var pool = shuffle(catItems).slice(0, totalItems);
      var itemIdx = 0, score = 0, timeLeft = totalTime, done = false;

      var bucketDefs = [
        { name: 'Food', emoji: '🍽️', color: '#FF6B35' },
        { name: 'Landmark', emoji: '🏛️', color: '#FFD700' },
        { name: 'Animal', emoji: '🐾', color: '#00C9A7' },
        { name: 'Tradition', emoji: '🏺', color: '#9b59b6' }
      ];

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Category Blast 🏷️</div>' +
        '<div style="display:flex;align-items:center;gap:10px;width:100%;margin-bottom:6px;">' +
          '<span id="cbTimer" style="font-family:Orbitron,sans-serif;font-size:1rem;color:#FF6B35;min-width:40px;">⏱️ ' + totalTime + '</span>' +
          '<div class="ge3-timer-wrap" style="flex:1;"><div class="ge3-timer-bar" id="cbBar" style="width:100%;"></div></div>' +
          '<span id="cbScore" style="font-family:Orbitron,sans-serif;font-size:0.85rem;color:#00C9A7;">' + score + '/' + totalItems + '</span>' +
        '</div>' +
        '<div class="ge3-status" id="cbStatus">Sort items into categories!</div>' +
        '<div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:18px;width:100%;text-align:center;margin:10px 0;border:1.5px solid rgba(255,255,255,0.1);min-height:70px;">' +
          '<div id="cbItem" style="font-size:1.3rem;font-weight:700;color:#fff;">Loading...</div>' +
          '<div id="cbItemSub" style="font-size:0.75rem;opacity:0.5;margin-top:4px;"></div>' +
        '</div>' +
        '<div id="cbBuckets" style="display:flex;gap:8px;width:100%;"></div>' +
        '<div id="cbFeedback" style="min-height:24px;margin-top:8px;text-align:center;font-size:0.9rem;font-weight:600;"></div>';
      container.appendChild(wrap);

      var timerEl = wrap.querySelector('#cbTimer');
      var barEl = wrap.querySelector('#cbBar');
      var scoreEl = wrap.querySelector('#cbScore');
      var statusEl = wrap.querySelector('#cbStatus');
      var itemEl = wrap.querySelector('#cbItem');
      var itemSubEl = wrap.querySelector('#cbItemSub');
      var bucketsEl = wrap.querySelector('#cbBuckets');
      var feedbackEl = wrap.querySelector('#cbFeedback');

      // Build bucket buttons
      for (var b = 0; b < bucketDefs.length; b++) {
        (function(bDef) {
          var bucket = document.createElement('div');
          bucket.className = 'ge3-bucket';
          bucket.style.background = bDef.color + '15';
          bucket.style.borderColor = bDef.color + '40';
          bucket.style.color = bDef.color;
          bucket.innerHTML = '<div style="font-size:1.3rem;">' + bDef.emoji + '</div><div style="font-size:0.75rem;margin-top:2px;">' + bDef.name + '</div>';

          bucket.onmouseenter = function () { bucket.style.borderColor = bDef.color; bucket.style.background = bDef.color + '30'; };
          bucket.onmouseleave = function () { bucket.style.borderColor = bDef.color + '40'; bucket.style.background = bDef.color + '15'; };

          bucket.onclick = function () {
            if (done || itemIdx >= pool.length) return;
            var current = pool[itemIdx];

            if (current.cat === bDef.name) {
              // Correct
              score++;
              E.addScore(1);
              scoreEl.textContent = score + '/' + totalItems;
              feedbackEl.textContent = '✅ ' + current.name + ' → ' + bDef.name;
              feedbackEl.style.color = '#00C9A7';
              itemEl.style.color = '#00C9A7';

              // Fly animation - briefly flash the bucket
              bucket.style.transform = 'scale(1.15)';
              bucket.style.boxShadow = '0 0 20px ' + bDef.color + '50';
              var t = setTimeout(function () {
                bucket.style.transform = '';
                bucket.style.boxShadow = '';
              }, 300);
              self._tv.push(t);

              E.rashidSay(pick(['Correct! 🎯', 'Nice sort! 🏷️', 'Right category! ✅']));
            } else {
              // Wrong
              feedbackEl.textContent = '❌ ' + current.name + ' is ' + current.cat + '!';
              feedbackEl.style.color = '#ff5050';
              itemEl.style.color = '#ff5050';
              itemEl.parentElement.classList.add('ge3-shake');
              var t2 = setTimeout(function () {
                itemEl.parentElement.classList.remove('ge3-shake');
              }, 400);
              self._tv.push(t2);
              E.rashidSay(pick(['Oops! That\'s ' + current.cat + '!', 'Wrong bucket!']));
            }

            itemIdx++;
            if (itemIdx >= pool.length) {
              done = true;
              clearInterval(self._iv);
              statusEl.textContent = '🎉 All sorted!';
              itemEl.textContent = '🏆';
              itemSubEl.textContent = 'Final score: ' + score + '/' + totalItems;
              E.rashidSay('Blast complete! ' + score + ' out of ' + totalItems + '! 🏷️');
              var t3 = setTimeout(function () { E.endGame(score, totalItems); }, 1200);
              self._tv.push(t3);
            } else {
              var t4 = setTimeout(function () { showItem(); }, 300);
              self._tv.push(t4);
            }
          };
          bucketsEl.appendChild(bucket);
        })(bucketDefs[b]);
      }

      function showItem() {
        if (itemIdx >= pool.length) return;
        var current = pool[itemIdx];
        itemEl.textContent = current.name;
        itemEl.style.color = '#fff';
        itemEl.className = 'ge3-pop';
        itemSubEl.textContent = 'Item ' + (itemIdx + 1) + ' of ' + totalItems;
        feedbackEl.textContent = '';
      }

      // Timer
      self._iv = setInterval(function () {
        if (done) return;
        timeLeft--;
        timerEl.textContent = '⏱️ ' + timeLeft;
        barEl.style.width = ((timeLeft / totalTime) * 100) + '%';
        if (timeLeft <= 5) {
          timerEl.style.color = '#ff5050';
          barEl.style.background = 'linear-gradient(90deg,#ff5050,#ff3030)';
        }
        if (timeLeft <= 0) {
          done = true;
          clearInterval(self._iv);
          statusEl.textContent = '⏰ Time\'s up!';
          itemEl.textContent = '⏰';
          itemSubEl.textContent = '';
          bucketsEl.style.pointerEvents = 'none';
          E.rashidSay('Time\'s up! You sorted ' + score + ' out of ' + totalItems + '! 🏷️');
          var t = setTimeout(function () { E.endGame(score, totalItems); }, 1000);
          self._tv.push(t);
        }
      }, 1000);

      // Show first item
      showItem();
      return {};
    },
    destroy: function () {
      if (this._iv) clearInterval(this._iv);
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });


  /* ═══════════════════════════════════════════════════
     12. TREASURE HUNT
     ═══════════════════════════════════════════════════ */
  E.register({
    id: 'treasure-hunt', name: 'Treasure Hunt', emoji: '🗺️', category: 'fun', has2P: false,
    _tv: [],
    init: function (container, mode, diff) {
      var self = this;
      self._tv = [];

      var maxGuesses = diff === 'easy' ? 10 : diff === 'hard' ? 6 : 8;
      var guessesLeft = maxGuesses;
      var gridSize = 5;

      // Random pearl position
      var pearlR = Math.floor(Math.random() * gridSize);
      var pearlC = Math.floor(Math.random() * gridSize);
      var found = false;
      var score = 0;

      var colLabels = ['A','B','C','D','E'];

      var wrap = document.createElement('div');
      wrap.className = 'ge3-wrap';
      wrap.innerHTML =
        '<div class="ge3-title">Treasure Hunt 🗺️</div>' +
        '<div class="ge3-status" id="thStatus">Find the hidden pearl! 💎</div>' +
        '<div style="display:flex;align-items:center;gap:12px;margin:6px 0;">' +
          '<span id="thGuesses" style="font-family:Orbitron,sans-serif;font-size:0.9rem;color:#FFD700;">Digs: ' + maxGuesses + '</span>' +
          '<span id="thHeat" style="font-size:1.2rem;min-width:30px;"></span>' +
          '<span id="thHeatText" style="font-size:0.8rem;opacity:0.6;"></span>' +
        '</div>' +
        '<div style="margin:4px 0 6px 0;">' +
          '<div style="display:flex;gap:6px;margin-left:28px;">' +
            colLabels.map(function(l) { return '<div style="width:100%;text-align:center;font-size:0.7rem;font-family:Orbitron,sans-serif;color:#FFD700;opacity:0.5;">' + l + '</div>'; }).join('') +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:0;width:100%;">' +
          '<div id="thRowLabels" style="display:flex;flex-direction:column;gap:6px;margin-right:6px;justify-content:space-around;"></div>' +
          '<div id="thGrid" class="ge3-grid5" style="flex:1;"></div>' +
        '</div>' +
        '<div class="ge3-sub" id="thHint" style="margin-top:10px;">Click a cell to dig! 🏖️</div>' +
        '<div style="display:flex;gap:8px;justify-content:center;margin-top:8px;font-size:0.7rem;opacity:0.6;">' +
          '<span>🔥 Very close</span><span>🌤️ Warm</span><span>❄️ Cold</span>' +
        '</div>';
      container.appendChild(wrap);

      var statusEl = wrap.querySelector('#thStatus');
      var guessesEl = wrap.querySelector('#thGuesses');
      var heatEl = wrap.querySelector('#thHeat');
      var heatTextEl = wrap.querySelector('#thHeatText');
      var gridEl = wrap.querySelector('#thGrid');
      var hintEl = wrap.querySelector('#thHint');
      var rowLabelsEl = wrap.querySelector('#thRowLabels');

      // Row labels
      for (var r = 0; r < gridSize; r++) {
        var rl = document.createElement('div');
        rl.style.cssText = 'display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-family:Orbitron,sans-serif;color:#FFD700;opacity:0.5;height:100%;';
        rl.textContent = (r + 1);
        rowLabelsEl.appendChild(rl);
      }

      // Build grid
      var cells = [];
      for (var row = 0; row < gridSize; row++) {
        for (var col = 0; col < gridSize; col++) {
          (function(r, c) {
            var cell = document.createElement('div');
            cell.className = 'ge3-cell ge3-sand';
            cell.textContent = '~';
            cell.style.color = 'rgba(210,180,120,0.3)';
            cell.setAttribute('data-r', r);
            cell.setAttribute('data-c', c);

            cell.onclick = function () {
              if (found) return;
              if (cell.classList.contains('ge3-dug')) return;
              if (guessesLeft <= 0) return;

              guessesLeft--;
              guessesEl.textContent = 'Digs: ' + guessesLeft;
              cell.classList.remove('ge3-sand');
              cell.classList.add('ge3-dug');

              if (r === pearlR && c === pearlC) {
                // Found the pearl!
                found = true;
                score = 1;
                cell.textContent = '💎';
                cell.style.fontSize = '1.5rem';
                cell.style.color = '#fff';
                cell.style.background = 'rgba(255,215,0,0.3)';
                cell.style.borderColor = '#FFD700';
                cell.style.boxShadow = '0 0 25px rgba(255,215,0,0.5)';
                cell.className += ' ge3-pop';

                statusEl.textContent = '🎉 You found the pearl!';
                statusEl.style.color = '#FFD700';
                heatEl.textContent = '💎';
                heatTextEl.textContent = 'FOUND!';
                hintEl.textContent = 'Incredible! Found with ' + guessesLeft + ' digs remaining!';
                hintEl.style.color = '#FFD700';

                // Bonus score: remaining guesses
                var totalScore = 1 + guessesLeft;
                E.setScore(totalScore);
                E.rashidSay('You found the pearl! 💎 +' + guessesLeft + ' bonus for remaining digs!');

                // Disable grid
                gridEl.style.pointerEvents = 'none';
                var t = setTimeout(function () { E.endGame(totalScore, maxGuesses); }, 1500);
                self._tv.push(t);
              } else {
                // Calculate Manhattan distance
                var dist = Math.abs(r - pearlR) + Math.abs(c - pearlC);

                var heatIcon, heatText, cellColor;
                if (dist <= 1) {
                  heatIcon = '🔥'; heatText = 'VERY CLOSE!'; cellColor = 'rgba(255,80,50,0.3)';
                } else if (dist <= 2) {
                  heatIcon = '🔥'; heatText = 'Hot!'; cellColor = 'rgba(255,130,50,0.25)';
                } else if (dist <= 3) {
                  heatIcon = '🌤️'; heatText = 'Warm'; cellColor = 'rgba(255,200,50,0.2)';
                } else if (dist <= 5) {
                  heatIcon = '🌤️'; heatText = 'Cool'; cellColor = 'rgba(100,180,255,0.15)';
                } else {
                  heatIcon = '❄️'; heatText = 'Cold'; cellColor = 'rgba(80,120,200,0.15)';
                }

                cell.textContent = heatIcon;
                cell.style.fontSize = '1rem';
                cell.style.background = cellColor;
                cell.style.color = '#fff';

                heatEl.textContent = heatIcon;
                heatTextEl.textContent = heatText + ' (distance: ' + dist + ')';

                if (dist <= 1) {
                  E.rashidSay('So close! The pearl is right there! 🔥');
                } else if (dist <= 3) {
                  E.rashidSay(pick(['Getting warmer! 🌤️', 'Keep digging nearby!', 'You\'re on the right track!']));
                } else {
                  E.rashidSay(pick(['Brrr, that\'s cold! ❄️', 'Try a different area!', 'The pearl is far from here!']));
                }

                if (guessesLeft <= 0 && !found) {
                  // Out of guesses
                  statusEl.textContent = '💨 No digs left!';
                  statusEl.style.color = '#ff5050';
                  hintEl.textContent = 'The pearl was at ' + colLabels[pearlC] + (pearlR + 1) + '!';
                  hintEl.style.color = '#ff5050';

                  // Reveal pearl location
                  var pearlCell = cells[pearlR * gridSize + pearlC];
                  pearlCell.textContent = '💎';
                  pearlCell.style.fontSize = '1.5rem';
                  pearlCell.style.background = 'rgba(255,215,0,0.2)';
                  pearlCell.style.borderColor = '#FFD700';
                  pearlCell.classList.remove('ge3-sand');
                  pearlCell.classList.add('ge3-dug');

                  gridEl.style.pointerEvents = 'none';
                  E.rashidSay('Out of digs! The pearl was at ' + colLabels[pearlC] + (pearlR + 1) + '! 💎');
                  var t2 = setTimeout(function () { E.endGame(0, maxGuesses); }, 1500);
                  self._tv.push(t2);
                }

                // Color code remaining guesses
                if (guessesLeft <= 2 && guessesLeft > 0) {
                  guessesEl.style.color = '#ff5050';
                }
              }
            };
            gridEl.appendChild(cell);
            cells.push(cell);
          })(row, col);
        }
      }

      return {};
    },
    destroy: function () {
      if (this._tv) { for (var i = 0; i < this._tv.length; i++) clearTimeout(this._tv[i]); this._tv = []; }
    }
  });

})();
