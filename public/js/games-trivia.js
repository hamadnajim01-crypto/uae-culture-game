/* ===== TRIVIA & KNOWLEDGE GAMES (10) — DOM-based ===== */
(function () {
  var E = window.GamesEngine;
  var shuffle = E.shuffle, pick = E.pick;

  /* ── 33. Flag Builder ── */
  E.register({
    id: 'flag-builder', name: 'Flag Builder', emoji: '🏳️', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gmb" style="font-size:1.1rem">🇦🇪 Build the UAE Flag!</div>' +
        '<div class="gtext gtext-sm gmb" style="opacity:0.6">Select a color, then click where it goes</div>' +
        '<div style="display:flex;gap:6px;margin-bottom:20px;padding:12px;background:rgba(255,255,255,0.03);border-radius:16px;border:1.5px solid rgba(255,215,0,0.1)" id="fbFlag">' +
        '<div id="fbLeft" style="width:50px;height:150px;border:3px dashed rgba(255,215,0,0.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:rgba(255,255,255,0.35);cursor:pointer;transition:all 0.3s;letter-spacing:1px">⬅️<br>LEFT</div>' +
        '<div style="display:flex;flex-direction:column;gap:6px;flex:1;min-width:200px">' +
        '<div class="fbSlot" data-slot="1" style="flex:1;border:3px dashed rgba(255,215,0,0.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:rgba(255,255,255,0.35);cursor:pointer;transition:all 0.3s">⬆️ TOP</div>' +
        '<div class="fbSlot" data-slot="2" style="flex:1;border:3px dashed rgba(255,215,0,0.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:rgba(255,255,255,0.35);cursor:pointer;transition:all 0.3s">▪️ MIDDLE</div>' +
        '<div class="fbSlot" data-slot="3" style="flex:1;border:3px dashed rgba(255,215,0,0.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:rgba(255,255,255,0.35);cursor:pointer;transition:all 0.3s">⬇️ BOTTOM</div>' +
        '</div></div>' +
        '<div class="gtext gtext-sm gmb" id="fbSelected" style="opacity:0.5;min-height:24px">Pick a color below 👇</div>' +
        '<div class="gflex" style="gap:8px;margin-bottom:16px" id="fbColors"></div>' +
        '<button class="gbtn gbtn-gold" id="fbCheck" style="padding:14px 40px;font-size:1.05rem">Check My Flag ✓</button>';
      container.appendChild(div);

      var colorMap = { red: '#CE1126', green: '#009639', white: '#FFFFFF', black: '#111111' };
      var colorNames = { red: '🔴 Red', green: '🟢 Green', white: '⚪ White', black: '⚫ Black' };
      var colorBtns = shuffle(['red','green','white','black']);
      var slots = { left: '', top: '', mid: '', bot: '' };
      var colorsDiv = div.querySelector('#fbColors');
      var selectedColor = null;

      colorBtns.forEach(function(c) {
        var btn = document.createElement('button');
        btn.className = 'gbtn';
        btn.style.cssText = 'width:70px;height:50px;background:' + colorMap[c] + ';border:3px solid rgba(255,215,0,0.2);border-radius:12px;cursor:pointer;transition:all 0.2s;' + (c === 'white' ? 'color:#333;' : 'color:#fff;');
        btn.textContent = c.charAt(0).toUpperCase() + c.slice(1);
        btn.setAttribute('data-color', c);
        btn.onclick = function() {
          selectedColor = c;
          colorsDiv.querySelectorAll('button').forEach(function(b) { b.style.borderColor = 'rgba(255,215,0,0.2)'; b.style.transform = 'scale(1)'; });
          btn.style.borderColor = '#FFD700'; btn.style.transform = 'scale(1.1)';
          div.querySelector('#fbSelected').textContent = 'Selected: ' + colorNames[c] + ' — now click a slot!';
          div.querySelector('#fbSelected').style.opacity = '1';
        };
        colorsDiv.appendChild(btn);
      });

      function placeColor(slot, slotName, el) {
        if (!selectedColor) { E.rashidSay('Pick a color first! 🎨'); return; }
        slots[slotName] = selectedColor;
        el.style.background = colorMap[selectedColor];
        el.style.borderColor = colorMap[selectedColor];
        el.textContent = ''; el.style.boxShadow = '0 0 15px ' + colorMap[selectedColor] + '40';
        el.style.transform = 'scale(1.05)'; setTimeout(function() { el.style.transform = 'scale(1)'; }, 200);
        E.rashidSay(pick(['Nice! 🎨','Keep going!','Looking good!']));
      }

      div.querySelector('#fbLeft').onclick = function() { placeColor(this, 'left', this); };
      div.querySelectorAll('.fbSlot').forEach(function(slot) {
        slot.onclick = function() {
          var s = slot.getAttribute('data-slot');
          var name = s === '1' ? 'top' : s === '2' ? 'mid' : 'bot';
          placeColor(slot, name, slot);
        };
      });

      div.querySelector('#fbCheck').onclick = function() {
        var sc = 0, allSlots = [
          { slot: 'left', correct: 'red', el: div.querySelector('#fbLeft') },
          { slot: 'top', correct: 'green', el: div.querySelectorAll('.fbSlot')[0] },
          { slot: 'mid', correct: 'white', el: div.querySelectorAll('.fbSlot')[1] },
          { slot: 'bot', correct: 'black', el: div.querySelectorAll('.fbSlot')[2] }
        ];
        allSlots.forEach(function(s) {
          if (slots[s.slot] === s.correct) { sc++; s.el.style.boxShadow = '0 0 20px rgba(0,201,167,0.5)'; s.el.style.borderColor = '#00C9A7'; }
          else { s.el.style.boxShadow = '0 0 20px rgba(255,50,50,0.4)'; s.el.style.borderColor = '#ff6b6b'; }
        });
        if (sc === 4) { E.rashidSay('PERFECT! You know the UAE flag! 🇦🇪🎉'); }
        else { E.rashidSay(sc + '/4 correct! Red=left, Green=top, White=mid, Black=bottom!'); }
        setTimeout(function() { E.endGame(sc, 4); }, 1200);
      };
      return {};
    }, destroy: function() {}
  });

  /* ── 34. Map Puzzle ── */
  E.register({
    id: 'map-puzzle', name: 'Map Puzzle', emoji: '🗺️', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var emirateColors = {
        'Abu Dhabi': '#FFD700', 'Dubai': '#FF6B35', 'Sharjah': '#00C9A7',
        'Ajman': '#9b59b6', 'Umm Al Quwain': '#4ecdc4', 'Ras Al Khaimah': '#3498db', 'Fujairah': '#e74c3c'
      };
      var emirates = shuffle([
        { name: 'Abu Dhabi', x: 25, y: 65 },
        { name: 'Dubai', x: 55, y: 40 },
        { name: 'Sharjah', x: 60, y: 35 },
        { name: 'Ajman', x: 58, y: 30 },
        { name: 'Umm Al Quwain', x: 55, y: 25 },
        { name: 'Ras Al Khaimah', x: 58, y: 15 },
        { name: 'Fujairah', x: 75, y: 35 }
      ]);
      var placed = [], idx = 0, sc = 0;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      var ecol = emirateColors[emirates[0].name];
      div.innerHTML = '<div class="gtext gmb" id="mpStatus" style="font-size:1.1rem">📍 Place: <span style="color:' + ecol + ';font-weight:800;text-shadow:0 0 10px ' + ecol + '40">' + emirates[0].name + '</span></div>' +
        '<div style="position:relative;width:340px;height:280px;margin:0 auto;border-radius:16px;overflow:hidden" id="mpMap">' +
        '<div style="position:absolute;inset:0;background:linear-gradient(145deg,rgba(10,20,40,0.95),rgba(5,10,25,0.95));border:2px solid rgba(255,215,0,0.2);border-radius:16px"></div>' +
        /* UAE outline shape using CSS */
        '<div style="position:absolute;left:10%;top:8%;width:80%;height:84%;border:2px solid rgba(255,215,0,0.12);border-radius:20% 40% 35% 15%/25% 30% 40% 20%;background:rgba(255,215,0,0.03);box-shadow:inset 0 0 40px rgba(255,215,0,0.04)"></div>' +
        '<div style="position:absolute;top:8px;left:12px;font-size:0.65rem;color:rgba(255,215,0,0.4);font-weight:600;letter-spacing:1px">🗺️ UAE MAP</div>' +
        '<div style="position:absolute;bottom:8px;right:12px;font-size:0.55rem;color:rgba(255,255,255,0.2)">Click to place pin</div>' +
        /* Compass rose */
        '<div style="position:absolute;top:10px;right:12px;font-size:0.6rem;color:rgba(255,255,255,0.25);text-align:center;line-height:1.2">N<br>W ✦ E<br>S</div>' +
        '</div>' +
        '<div id="mpDistBar" style="width:260px;height:6px;background:rgba(255,255,255,0.06);border-radius:4px;margin-top:10px;overflow:hidden;opacity:0;transition:opacity 0.3s"><div id="mpDistFill" style="height:100%;width:0%;border-radius:4px;transition:width 0.5s,background 0.5s"></div></div>' +
        '<div class="gtext gtext-sm" id="mpDistText" style="min-height:22px;opacity:0;transition:opacity 0.3s;margin-top:4px"></div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-top:8px">' +
        '<div style="display:flex;gap:3px" id="mpDots"></div>' +
        '<div class="gtext gtext-sm" id="mpScore" style="font-family:Orbitron;opacity:0.7">0/7</div>' +
        '</div>';
      container.appendChild(div);
      var map = div.querySelector('#mpMap');
      var dotsDiv = div.querySelector('#mpDots');

      // Progress dots
      for (var d = 0; d < 7; d++) {
        var dotEl = document.createElement('div');
        dotEl.style.cssText = 'width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,215,0,0.15);transition:all 0.3s';
        dotEl.setAttribute('data-dot', d);
        dotsDiv.appendChild(dotEl);
      }

      // Add target zones (subtle hints)
      emirates.forEach(function(em) {
        var dot = document.createElement('div');
        dot.style.cssText = 'position:absolute;width:14px;height:14px;border-radius:50%;border:1.5px dashed rgba(255,215,0,0.08);left:' + em.x + '%;top:' + em.y + '%;transform:translate(-50%,-50%);transition:all 0.3s';
        dot.setAttribute('data-name', em.name);
        map.appendChild(dot);
      });

      map.onclick = function(e) {
        if (idx >= emirates.length) return;
        var rect = map.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width * 100;
        var py = (e.clientY - rect.top) / rect.height * 100;
        var target = emirates[idx];
        var dist = Math.sqrt(Math.pow(px - target.x, 2) + Math.pow(py - target.y, 2));
        var eColor = emirateColors[target.name];
        var isCorrect = dist < 15;

        // Animated pin drop
        var pin = document.createElement('div');
        pin.style.cssText = 'position:absolute;left:' + px + '%;top:' + py + '%;transform:translate(-50%,-150%) scale(0);z-index:10;transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none';
        pin.innerHTML = '<div style="font-size:1.4rem;text-align:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">📍</div>';
        map.appendChild(pin);
        setTimeout(function() { pin.style.transform = 'translate(-50%,-80%) scale(1)'; }, 30);

        // Label with emirate color
        var label = document.createElement('div');
        label.style.cssText = 'position:absolute;left:' + px + '%;top:' + (py + 6) + '%;transform:translate(-50%,0) scale(0);font-size:0.6rem;font-weight:800;padding:3px 8px;border-radius:6px;white-space:nowrap;transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.15s;letter-spacing:0.5px;z-index:10;pointer-events:none;';
        if (isCorrect) {
          sc++;
          label.style.color = eColor; label.style.background = eColor + '25'; label.style.border = '1px solid ' + eColor + '50';
          label.style.boxShadow = '0 2px 10px ' + eColor + '30';
          E.rashidSay(pick(['Correct spot! 🗺️','Right on target! 📍','You know your UAE! ✅']));
        } else {
          label.style.color = '#ff6b6b'; label.style.background = 'rgba(255,50,50,0.2)'; label.style.border = '1px solid rgba(255,50,50,0.3)';
          E.rashidSay(pick(['Not quite! Try the next one.','A bit off! 🗺️']));
          // Show correct position indicator
          var correctPin = document.createElement('div');
          correctPin.style.cssText = 'position:absolute;left:' + target.x + '%;top:' + target.y + '%;transform:translate(-50%,-50%);width:18px;height:18px;border-radius:50%;border:2px solid ' + eColor + ';background:' + eColor + '20;animation:cellPop 0.4s ease;pointer-events:none;z-index:5';
          map.appendChild(correctPin);
        }
        label.textContent = target.name;
        map.appendChild(label);
        setTimeout(function() { label.style.transform = 'translate(-50%,0) scale(1)'; }, 50);

        // Distance indicator bar
        var distBar = div.querySelector('#mpDistBar');
        var distFill = div.querySelector('#mpDistFill');
        var distText = div.querySelector('#mpDistText');
        distBar.style.opacity = '1'; distText.style.opacity = '1';
        var closeness = Math.max(0, Math.min(100, 100 - (dist / 50 * 100)));
        distFill.style.width = closeness + '%';
        distFill.style.background = isCorrect ? 'linear-gradient(90deg,#00C9A7,#4ecdc4)' : closeness > 50 ? 'linear-gradient(90deg,#FFD700,#FF6B35)' : 'linear-gradient(90deg,#ff6b6b,#FF6B35)';
        distText.textContent = isCorrect ? '✅ Perfect placement!' : closeness > 50 ? '🔶 Close! ' + Math.round(dist) + ' units away' : '❌ Far off! ' + Math.round(dist) + ' units away';
        distText.style.color = isCorrect ? '#00C9A7' : closeness > 50 ? '#FFD700' : '#ff6b6b';

        // Update progress dot
        var dots = dotsDiv.querySelectorAll('[data-dot]');
        if (dots[idx]) {
          dots[idx].style.background = isCorrect ? '#00C9A7' : '#ff6b6b';
          dots[idx].style.borderColor = isCorrect ? '#00C9A7' : '#ff6b6b';
          dots[idx].style.boxShadow = '0 0 6px ' + (isCorrect ? 'rgba(0,201,167,0.5)' : 'rgba(255,50,50,0.5)');
        }

        idx++; E.setScore(sc);
        div.querySelector('#mpScore').textContent = sc + '/7';
        if (idx < emirates.length) {
          var nc = emirateColors[emirates[idx].name];
          div.querySelector('#mpStatus').innerHTML = '📍 Place: <span style="color:' + nc + ';font-weight:800;text-shadow:0 0 10px ' + nc + '40">' + emirates[idx].name + '</span>';
          setTimeout(function() { distBar.style.opacity = '0'; distText.style.opacity = '0'; }, 1500);
        }
        else {
          div.querySelector('#mpStatus').innerHTML = '<span style="color:#FFD700;font-size:1.2rem">🏆 All placed! ' + sc + '/7 correct</span>';
          setTimeout(function() { E.endGame(sc, 7); }, 1200);
        }
      };
      return {};
    }, destroy: function() {}
  });

  /* ── 35. Timeline Sort ── */
  E.register({
    id: 'timeline-sort', name: 'Timeline Sort', emoji: '⏱️', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var events = shuffle([
        { event: 'UAE Federation founded', year: 1971 },
        { event: 'Oil discovered in Abu Dhabi', year: 1958 },
        { event: 'Burj Khalifa opened', year: 2010 },
        { event: 'Emirates airline founded', year: 1985 },
        { event: 'Hope Probe reached Mars', year: 2021 },
        { event: 'Dubai Expo 2020', year: 2020 }
      ]);
      var order = [];
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gmb" style="font-size:1.05rem">⏱️ Tap events in chronological order <span style="color:#FFD700;font-weight:700">(earliest first)</span></div>' +
        /* Timeline visual line */
        '<div style="position:relative;width:100%;max-width:420px;margin-bottom:12px">' +
        '<div style="position:absolute;left:24px;top:0;bottom:0;width:3px;background:linear-gradient(180deg,rgba(255,215,0,0.4),rgba(0,201,167,0.4));border-radius:3px"></div>' +
        '<div class="gflex-col" id="tsEvents" style="gap:10px;width:100%;padding-left:0"></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-top:10px">' +
        '<div style="display:flex;gap:4px" id="tsOrderDots"></div>' +
        '<div class="gtext gtext-sm" id="tsOrder" style="font-family:Orbitron;opacity:0.7">0/' + events.length + '</div>' +
        '</div>';
      container.appendChild(div);
      var evDiv = div.querySelector('#tsEvents');
      var dotsDiv = div.querySelector('#tsOrderDots');
      var btns = [];

      // Build order dots
      for (var d = 0; d < events.length; d++) {
        var dotEl = document.createElement('div');
        dotEl.style.cssText = 'width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,215,0,0.15);transition:all 0.3s';
        dotEl.setAttribute('data-dot', d);
        dotsDiv.appendChild(dotEl);
      }

      events.forEach(function(ev, i) {
        var card = document.createElement('div');
        card.style.cssText = 'display:flex;align-items:center;gap:12px;width:100%;cursor:pointer;transition:all 0.3s';
        card.innerHTML =
          '<div style="width:50px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;z-index:1">' +
          '<div class="tsNum" style="width:32px;height:32px;border-radius:50%;background:rgba(255,215,0,0.08);border:2px solid rgba(255,215,0,0.2);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;color:rgba(255,255,255,0.4);transition:all 0.3s;font-family:Orbitron">?</div>' +
          '</div>' +
          '<div class="tsCardBody" style="flex:1;padding:14px 16px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,215,0,0.12);border-radius:14px;transition:all 0.3s cubic-bezier(0.4,0,0.2,1)">' +
          '<div style="font-size:0.95rem;font-weight:600;color:#fff;margin-bottom:2px">' + ev.event + '</div>' +
          '<div class="tsYear" style="font-size:0.7rem;font-family:Orbitron;color:rgba(255,215,0,0.4);transition:all 0.3s">????</div>' +
          '</div>';
        card.setAttribute('data-i', i);
        card.onmouseenter = function() { if (!card.classList.contains('used')) card.querySelector('.tsCardBody').style.borderColor = 'rgba(255,215,0,0.35)'; };
        card.onmouseleave = function() { if (!card.classList.contains('used')) card.querySelector('.tsCardBody').style.borderColor = 'rgba(255,215,0,0.12)'; };
        card.onclick = function() {
          if (card.classList.contains('used')) return;
          card.classList.add('used');
          order.push(i);
          var num = card.querySelector('.tsNum');
          var body = card.querySelector('.tsCardBody');
          var yearEl = card.querySelector('.tsYear');
          num.textContent = order.length;
          num.style.background = 'linear-gradient(135deg,#00C9A7,#4ecdc4)'; num.style.borderColor = '#00C9A7';
          num.style.color = '#000'; num.style.boxShadow = '0 0 12px rgba(0,201,167,0.3)';
          body.style.background = 'rgba(0,201,167,0.06)'; body.style.borderColor = 'rgba(0,201,167,0.25)';
          yearEl.textContent = ev.year; yearEl.style.color = '#00C9A7';
          // Fill dot
          var dots = dotsDiv.querySelectorAll('[data-dot]');
          if (dots[order.length - 1]) { dots[order.length - 1].style.background = '#00C9A7'; dots[order.length - 1].style.borderColor = '#00C9A7'; }
          div.querySelector('#tsOrder').textContent = order.length + '/' + events.length;
          if (order.length === events.length) {
            // Check order
            var sc = 0;
            var sorted = events.slice().sort(function(a,b) { return a.year - b.year; });
            // Visual feedback per position
            for (var k = 0; k < order.length; k++) {
              var isRight = events[order[k]].year === sorted[k].year;
              if (isRight) sc++;
              // Find the card for order[k]
              evDiv.querySelectorAll('[data-i]').forEach(function(c) {
                if (parseInt(c.getAttribute('data-i')) === order[k]) {
                  var b = c.querySelector('.tsCardBody');
                  var n = c.querySelector('.tsNum');
                  if (isRight) {
                    b.style.background = 'rgba(0,201,167,0.15)'; b.style.borderColor = '#00C9A7'; b.style.boxShadow = '0 0 15px rgba(0,201,167,0.2)';
                    n.style.background = 'linear-gradient(135deg,#00C9A7,#4ecdc4)';
                  } else {
                    b.style.background = 'rgba(255,50,50,0.12)'; b.style.borderColor = '#ff6b6b'; b.style.boxShadow = '0 0 15px rgba(255,50,50,0.2)';
                    b.style.animation = 'cellShake 0.4s ease';
                    n.style.background = 'linear-gradient(135deg,#ff6b6b,#e74c3c)'; n.style.borderColor = '#ff6b6b';
                  }
                }
              });
              // Update dots
              var dots2 = dotsDiv.querySelectorAll('[data-dot]');
              if (dots2[k]) {
                dots2[k].style.background = isRight ? '#00C9A7' : '#ff6b6b';
                dots2[k].style.borderColor = isRight ? '#00C9A7' : '#ff6b6b';
              }
            }
            setTimeout(function() {
              E.endGame(sc, events.length);
              if (sc === events.length) E.rashidSay('Perfect timeline! ⏱️🎉');
              else E.rashidSay(sc + '/' + events.length + ' in correct position!');
            }, 800);
          }
        };
        evDiv.appendChild(card); btns.push(card);
      });
      return {};
    }, destroy: function() {}
  });

  /* ── 36. Who Am I? ── */
  E.register({
    id: 'who-am-i', name: 'Who Am I?', emoji: '🤔', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var allAnswers = ['Burj Khalifa','Falcon','Sheikh Zayed Mosque','Camel','Pearl','Dates','Dubai Frame','Dhow','Henna','Oasis','Desert','Palm Jumeirah','Oryx','Gold Souk','Dirham'];
      var items = shuffle([
        { answer: 'Burj Khalifa', clues: ['I am very, very tall.', 'I am in Dubai.', 'I am the tallest building in the world!'] },
        { answer: 'Falcon', clues: ['I am an animal.', 'I am used in a traditional sport.', 'I am a bird of prey, symbol of the UAE!'] },
        { answer: 'Sheikh Zayed Mosque', clues: ['I am a building.', 'I am in Abu Dhabi.', 'I am one of the largest mosques in the world!'] },
        { answer: 'Camel', clues: ['I am an animal.', 'I live in the desert.', 'I am called the ship of the desert!'] },
        { answer: 'Pearl', clues: ['I come from the sea.', 'I am round and shiny.', 'Divers used to collect me from oysters!'] },
        { answer: 'Dates', clues: ['I grow on trees.', 'I am sweet and brown.', 'I am the most famous fruit in the UAE!'] },
        { answer: 'Dubai Frame', clues: ['I am a structure.', 'I look like a picture frame.', 'I show old Dubai on one side and new Dubai on the other!'] },
        { answer: 'Dhow', clues: ['I float on water.', 'I am a traditional vessel.', 'I am a wooden sailing boat used for centuries!'] },
        { answer: 'Oryx', clues: ['I am an animal.', 'I have long straight horns.', 'I am the national animal of the UAE!'] }
      ]).slice(0, diff === 'easy' ? 4 : diff === 'hard' ? 7 : 5);
      var idx = 0, sc = 0, clueIdx = 0;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.innerHTML = '<div class="gtext gmb" id="waiStatus">Round 1/' + items.length + ' — Clue 1/3</div>' +
        '<div class="gtext gtext-lg gmb gtext-gold" id="waiClue" style="min-height:50px"></div>' +
        '<div class="gflex-col" style="gap:8px;width:100%;max-width:300px" id="waiChoices"></div>' +
        '<button class="gbtn gbtn-outline gmt" id="waiNext" style="opacity:0.7">Need another clue? →</button>' +
        '<div class="gtext gmt gtext-sm" id="waiPoints" style="color:rgba(255,215,0,0.6)">Answer with fewer clues = more points!</div>';
      container.appendChild(div);

      function getDistractors(answer) {
        var pool = allAnswers.filter(function(a) { return a !== answer; });
        return shuffle(pool).slice(0, 3);
      }

      function show() {
        clueIdx = 0;
        div.querySelector('#waiClue').textContent = '💡 ' + items[idx].clues[0];
        div.querySelector('#waiStatus').textContent = 'Round ' + (idx+1) + '/' + items.length + ' — Clue 1/3';
        div.querySelector('#waiPoints').textContent = '🏆 Answer now for 3 points!';
        div.querySelector('#waiNext').disabled = false; div.querySelector('#waiNext').style.opacity = '0.7';
        // Build choice buttons
        var choices = shuffle([items[idx].answer].concat(getDistractors(items[idx].answer)));
        var choicesDiv = div.querySelector('#waiChoices'); choicesDiv.innerHTML = '';
        choices.forEach(function(c) {
          var btn = document.createElement('button'); btn.className = 'gbtn gbtn-outline'; btn.style.width = '100%';
          btn.style.padding = '12px'; btn.style.fontSize = '1rem';
          btn.textContent = c;
          btn.onclick = function() {
            if (btn.disabled) return;
            choicesDiv.querySelectorAll('button').forEach(function(b) { b.disabled = true; b.style.opacity = '0.5'; });
            if (c === items[idx].answer) {
              var points = 3 - clueIdx; sc += points; E.addScore(points);
              btn.style.opacity = '1'; btn.style.background = 'rgba(0,201,167,0.3)'; btn.style.borderColor = '#00C9A7';
              E.rashidSay('Correct! +' + points + ' points! 🎯');
              div.querySelector('#waiPoints').textContent = '✅ +' + points + ' points!';
            } else {
              btn.style.opacity = '1'; btn.style.background = 'rgba(255,50,50,0.3)'; btn.style.borderColor = '#ff6b6b';
              choicesDiv.querySelectorAll('button').forEach(function(b) {
                if (b.textContent === items[idx].answer) { b.style.opacity = '1'; b.style.background = 'rgba(0,201,167,0.3)'; b.style.borderColor = '#00C9A7'; }
              });
              E.rashidSay('It was "' + items[idx].answer + '"!');
              div.querySelector('#waiPoints').textContent = '❌ It was ' + items[idx].answer;
            }
            div.querySelector('#waiNext').disabled = true;
            idx++;
            setTimeout(function() {
              if (idx >= items.length) E.endGame(sc, items.length * 3);
              else show();
            }, 1200);
          };
          choicesDiv.appendChild(btn);
        });
      }

      div.querySelector('#waiNext').onclick = function() {
        if (clueIdx < 2) {
          clueIdx++;
          div.querySelector('#waiClue').textContent = '💡 ' + items[idx].clues[clueIdx];
          div.querySelector('#waiStatus').textContent = 'Round ' + (idx+1) + '/' + items.length + ' — Clue ' + (clueIdx+1) + '/3';
          div.querySelector('#waiPoints').textContent = '🏆 Answer now for ' + (3 - clueIdx) + ' point' + (3 - clueIdx > 1 ? 's' : '') + '!';
          if (clueIdx >= 2) { div.querySelector('#waiNext').disabled = true; div.querySelector('#waiNext').style.opacity = '0.3'; }
        } else {
          E.rashidSay('No more clues! Pick your answer!');
        }
      };
      show();
      return {};
    }, destroy: function() {}
  });

  /* ── 37. Fact or Fiction ── */
  E.register({
    id: 'fact-fiction', name: 'Fact or Fiction', emoji: '✅', category: 'trivia', has2P: true,
    _tv: null,
    init: function (container, mode, diff) {
      var items = shuffle([
        { statement: 'The UAE has 7 emirates.', answer: true },
        { statement: 'Dubai is the capital of the UAE.', answer: false },
        { statement: 'The Burj Khalifa has more than 160 floors.', answer: true },
        { statement: 'The UAE flag has 5 colors.', answer: false },
        { statement: 'Falconry is a popular sport in the UAE.', answer: true },
        { statement: 'The UAE currency is the Rial.', answer: false },
        { statement: 'Abu Dhabi is the largest emirate by area.', answer: true },
        { statement: 'The UAE was founded in 1965.', answer: false },
        { statement: 'Pearl diving was once a major industry in the UAE.', answer: true },
        { statement: 'Dubai has a metro system.', answer: true },
        { statement: 'The UAE borders Saudi Arabia.', answer: true },
        { statement: 'Dates grow on cactus plants.', answer: false },
        { statement: 'The Hope Probe was sent to Jupiter.', answer: false },
        { statement: 'Arabic is read from right to left.', answer: true },
        { statement: 'The Burj Al Arab hotel is shaped like a sail.', answer: true },
        { statement: 'The UAE has snow-covered mountains.', answer: false },
        { statement: 'The Dubai Mall is the largest mall in the world.', answer: true },
        { statement: 'Henna art is a tradition in the UAE.', answer: true },
        { statement: 'Camels can survive weeks without water.', answer: true },
        { statement: 'The UAE flag was adopted in 1990.', answer: false }
      ]);
      var ffTime = diff === 'easy' ? 45 : diff === 'hard' ? 20 : 30;
      var idx = 0, sc1 = 0, sc2 = 0, timeLeft = ffTime, locked = false;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gmb" id="ffTimer" style="font-size:1.3rem;font-family:Orbitron">⏱️ ' + ffTime + '</div>' +
        '<div style="width:100%;height:4px;background:rgba(255,255,255,0.1);border-radius:4px;margin-bottom:12px;overflow:hidden"><div id="ffTimerBar" style="width:100%;height:100%;background:linear-gradient(90deg,#FFD700,#FF6B35);transition:width 1s linear;border-radius:4px"></div></div>' +
        '<div class="gtext gtext-sm gmb" style="opacity:0.5" id="ffCount">Question 1 of ' + items.length + '</div>' +
        '<div id="ffCard" style="width:100%;max-width:380px;min-height:100px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,215,0,0.12);border-radius:16px;padding:24px;margin-bottom:16px;display:flex;align-items:center;justify-content:center;text-align:center;transition:all 0.3s">' +
        '<div class="gtext gtext-lg" id="ffStatement" style="line-height:1.5">' + items[0].statement + '</div></div>' +
        '<div id="ffFeedback" style="min-height:32px;margin-bottom:12px;font-size:1.1rem;font-weight:700;transition:opacity 0.3s"></div>' +
        (mode === '2p' ?
        '<div class="gflex" style="gap:10px;width:100%;max-width:380px"><button class="gbtn gbtn-gold" id="ffTrue1" style="flex:1;padding:16px;font-size:1.1rem">P1: TRUE ✅</button><button class="gbtn" id="ffFalse1" style="flex:1;padding:16px;font-size:1.1rem;background:rgba(255,50,50,0.15);border:1.5px solid rgba(255,50,50,0.3);color:#ff6b6b">P1: FALSE ❌</button></div>' +
        '<div class="gflex gmt" style="gap:10px;width:100%;max-width:380px"><button class="gbtn gbtn-teal" id="ffTrue2" style="flex:1;padding:16px">P2: TRUE ✅</button><button class="gbtn" id="ffFalse2" style="flex:1;padding:16px;background:rgba(255,50,50,0.15);border:1.5px solid rgba(255,50,50,0.3);color:#ff6b6b">P2: FALSE ❌</button></div>' :
        '<div class="gflex" style="gap:12px;width:100%;max-width:380px"><button class="gbtn gbtn-gold" id="ffTrue1" style="flex:1;padding:18px;font-size:1.15rem;border-radius:14px">TRUE ✅</button><button class="gbtn" id="ffFalse1" style="flex:1;padding:18px;font-size:1.15rem;background:rgba(255,50,50,0.15);border:1.5px solid rgba(255,50,50,0.3);color:#ff6b6b;border-radius:14px">FALSE ❌</button></div>') +
        '<div class="gtext gmt" id="ffScore" style="font-family:Orbitron">Score: 0</div>';
      container.appendChild(div);

      function showFeedback(correct, truth) {
        var fb = div.querySelector('#ffFeedback');
        var card = div.querySelector('#ffCard');
        if (correct) {
          fb.textContent = '✅ CORRECT!'; fb.style.color = '#00C9A7';
          card.style.borderColor = '#00C9A7'; card.style.boxShadow = '0 0 25px rgba(0,201,167,0.25)';
        } else {
          fb.textContent = '❌ WRONG! Answer: ' + (truth ? 'TRUE' : 'FALSE');
          fb.style.color = '#ff6b6b';
          card.style.borderColor = '#ff6b6b'; card.style.boxShadow = '0 0 25px rgba(255,50,50,0.25)';
        }
        setTimeout(function() { card.style.borderColor = 'rgba(255,215,0,0.12)'; card.style.boxShadow = 'none'; fb.textContent = ''; }, 600);
      }

      function next() {
        idx++;
        if (idx >= items.length || timeLeft <= 0) {
          if (mode === '2p') { E.rashidSay(sc1 > sc2 ? 'P1 wins! 🏆' : sc2 > sc1 ? 'P2 wins! 🏆' : 'Draw! 🤝'); E.endGame(Math.max(sc1,sc2), items.length); }
          else E.endGame(sc1, items.length);
          return;
        }
        div.querySelector('#ffStatement').textContent = items[idx].statement;
        div.querySelector('#ffCount').textContent = 'Question ' + (idx+1) + ' of ' + items.length;
        locked = false;
      }

      function answer(player, ans) {
        if (locked) return;
        locked = true;
        var correct = ans === items[idx].answer;
        showFeedback(correct, items[idx].answer);
        if (correct) { if (player === 1) sc1++; else sc2++; E.rashidSay(pick(['Right! ✅','Correct! 🎯','Smart! 🧠'])); }
        else E.rashidSay(pick(['Nope!','Wrong!','Oops!']) + ' It was ' + (items[idx].answer ? 'TRUE' : 'FALSE'));
        E.setScore(mode === '2p' ? Math.max(sc1, sc2) : sc1);
        div.querySelector('#ffScore').textContent = mode === '2p' ? 'P1: ' + sc1 + ' | P2: ' + sc2 : 'Score: ' + sc1;
        setTimeout(next, 700);
      }

      div.querySelector('#ffTrue1').onclick = function() { answer(1, true); };
      div.querySelector('#ffFalse1').onclick = function() { answer(1, false); };
      if (mode === '2p') {
        div.querySelector('#ffTrue2').onclick = function() { answer(2, true); };
        div.querySelector('#ffFalse2').onclick = function() { answer(2, false); };
      }

      this._tv = setInterval(function() { timeLeft--;
        div.querySelector('#ffTimer').textContent = '⏱️ ' + timeLeft;
        div.querySelector('#ffTimerBar').style.width = (timeLeft / ffTime * 100) + '%';
        if (timeLeft <= 5) div.querySelector('#ffTimer').style.color = '#ff6b6b';
        if (timeLeft <= 0) { clearInterval(this._tv); next(); }
      }.bind(this), 1000);
      return {};
    }, destroy: function() { if (this._tv) clearInterval(this._tv); }
  });

  /* ── 38. Emoji Picture Quiz ── */
  E.register({
    id: 'picture-quiz', name: 'Emoji Picture', emoji: '🖼️', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var items = shuffle([
        { emojis: '🏗️📏🌆', answer: 'Burj Khalifa', options: ['Burj Khalifa','Burj Al Arab','Dubai Frame','CN Tower'] },
        { emojis: '🕌⬜🌙', answer: 'Sheikh Zayed Mosque', options: ['Blue Mosque','Sheikh Zayed Mosque','Al Aqsa','Hagia Sophia'] },
        { emojis: '🐪🏜️☀️', answer: 'Desert Safari', options: ['Beach Trip','Desert Safari','Mountain Hike','City Tour'] },
        { emojis: '🦅🧤👑', answer: 'Falconry', options: ['Falconry','Eagle Hunting','Bird Watching','Pigeon Racing'] },
        { emojis: '🌴🟤🍬', answer: 'Dates', options: ['Coconut','Dates','Figs','Raisins'] },
        { emojis: '🚢⛵🌊', answer: 'Dhow Cruise', options: ['Fishing Trip','Dhow Cruise','Surfing','Kayaking'] },
        { emojis: '🪙💰🏪', answer: 'Gold Souk', options: ['Mall','Gold Souk','Bank','Market'] },
        { emojis: '🏎️🏁🏟️', answer: 'Yas Marina Circuit', options: ['Silverstone','Monaco GP','Yas Marina Circuit','Daytona'] },
        { emojis: '🎡🌆🌃', answer: 'Ain Dubai', options: ['London Eye','Ain Dubai','Singapore Flyer','ICON Park'] },
        { emojis: '🏝️🌴🦩', answer: 'Sir Bani Yas Island', options: ['Maldives','Sir Bani Yas Island','Bali','Hawaii'] },
        { emojis: '🖼️🏛️🎨', answer: 'Louvre Abu Dhabi', options: ['Louvre Abu Dhabi','British Museum','Guggenheim','MoMA'] },
        { emojis: '🌹💧⛲', answer: 'Miracle Garden', options: ['Miracle Garden','Botanical Garden','Rose Park','Flower Valley'] }
      ]).slice(0, diff === 'easy' ? 6 : diff === 'hard' ? 10 : 8);
      var idx = 0, sc = 0, locked = false;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gmb gtext-sm" style="opacity:0.5" id="epStatus">Question 1/' + items.length + '</div>' +
        '<div style="width:200px;height:140px;background:rgba(255,255,255,0.04);border:2px solid rgba(255,215,0,0.15);border-radius:20px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;box-shadow:0 0 30px rgba(255,215,0,0.05);position:relative;overflow:hidden" id="epFrame">' +
        '<div id="epEmojis" style="font-size:3.5rem;letter-spacing:6px;transition:transform 0.3s;text-shadow:0 4px 15px rgba(0,0,0,0.3)"></div></div>' +
        '<div class="gtext gmb" style="font-size:0.85rem;opacity:0.6">What UAE thing do these emojis show? 🤔</div>' +
        '<div class="gflex-col" style="gap:8px;width:100%;max-width:320px" id="epOptions"></div>' +
        '<div id="epFeedback" style="min-height:28px;margin-top:10px;font-weight:700"></div>';
      container.appendChild(div);

      function show() {
        locked = false;
        var frame = div.querySelector('#epFrame');
        var emojis = div.querySelector('#epEmojis');
        emojis.style.transform = 'scale(0.5)';
        setTimeout(function() { emojis.style.transform = 'scale(1)'; }, 50);
        emojis.textContent = items[idx].emojis;
        div.querySelector('#epStatus').textContent = 'Question ' + (idx+1) + '/' + items.length;
        div.querySelector('#epFeedback').textContent = '';
        frame.style.borderColor = 'rgba(255,215,0,0.15)'; frame.style.boxShadow = '0 0 30px rgba(255,215,0,0.05)';
        var opts = div.querySelector('#epOptions'); opts.innerHTML = '';
        shuffle(items[idx].options).forEach(function(o) {
          var btn = document.createElement('button'); btn.className = 'gbtn gbtn-outline';
          btn.style.cssText = 'width:100%;padding:12px;transition:all 0.2s';
          btn.textContent = o;
          btn.onclick = function() {
            if (locked) return; locked = true;
            opts.querySelectorAll('button').forEach(function(b) { b.disabled = true; b.style.opacity = '0.4'; });
            var fb = div.querySelector('#epFeedback');
            if (o === items[idx].answer) {
              sc++; E.addScore(1);
              btn.style.opacity = '1'; btn.style.background = 'rgba(0,201,167,0.2)'; btn.style.borderColor = '#00C9A7';
              frame.style.borderColor = '#00C9A7'; frame.style.boxShadow = '0 0 30px rgba(0,201,167,0.3)';
              fb.textContent = '✅ Correct!'; fb.style.color = '#00C9A7';
              E.rashidSay(pick(['Right! 🖼️','You got it! 🎯','Smart guess! 🧠']));
            } else {
              btn.style.opacity = '1'; btn.style.background = 'rgba(255,50,50,0.2)'; btn.style.borderColor = '#ff6b6b';
              opts.querySelectorAll('button').forEach(function(b) { if (b.textContent === items[idx].answer) { b.style.opacity = '1'; b.style.background = 'rgba(0,201,167,0.2)'; b.style.borderColor = '#00C9A7'; } });
              frame.style.borderColor = '#ff6b6b'; frame.style.boxShadow = '0 0 30px rgba(255,50,50,0.3)';
              fb.textContent = '❌ It was ' + items[idx].answer; fb.style.color = '#ff6b6b';
              E.rashidSay('It was ' + items[idx].answer + '!');
            }
            setTimeout(function() { idx++; if (idx >= items.length) E.endGame(sc, items.length); else show(); }, 1000);
          };
          opts.appendChild(btn);
        });
      }
      show();
      return {};
    }, destroy: function() {}
  });

  /* ── 39. Capital Match ── */
  E.register({
    id: 'capital-match', name: 'Capital Match', emoji: '🏙️', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var emirateColors = {
        'Abu Dhabi': '#FFD700', 'Dubai': '#FF6B35', 'Sharjah': '#00C9A7',
        'Ajman': '#9b59b6', 'Fujairah': '#e74c3c', 'Ras Al Khaimah': '#3498db', 'Umm Al Quwain': '#4ecdc4'
      };
      var pairs = shuffle([
        { emirate: 'Abu Dhabi', capital: 'Abu Dhabi City' },
        { emirate: 'Dubai', capital: 'Dubai City' },
        { emirate: 'Sharjah', capital: 'Sharjah City' },
        { emirate: 'Ajman', capital: 'Ajman City' },
        { emirate: 'Fujairah', capital: 'Fujairah City' },
        { emirate: 'Ras Al Khaimah', capital: 'RAK City' },
        { emirate: 'Umm Al Quwain', capital: 'UAQ City' }
      ]);
      var left = pairs.map(function(p){return p.emirate;});
      var right = shuffle(pairs.map(function(p){return p.capital;}));
      var matched = [], selLeft = -1, sc = 0, wrongFlash = false;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gmb" style="font-size:1.05rem">🏙️ Match each emirate to its capital!</div>' +
        '<div class="gtext gtext-sm gmb" style="opacity:0.5" id="cmHint">Select an emirate, then its capital</div>' +
        '<div class="gflex" style="gap:16px;align-items:flex-start;width:100%;max-width:450px" id="cmArea">' +
        '<div class="gflex-col" id="cmLeft" style="flex:1;gap:6px"></div>' +
        '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;align-self:center;padding:0 4px">' +
        '<div style="font-size:1.2rem;color:rgba(255,215,0,0.3)">⟷</div></div>' +
        '<div class="gflex-col" id="cmRight" style="flex:1;gap:6px"></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-top:14px">' +
        '<div class="gtext gtext-sm" style="font-family:Orbitron;color:#FFD700" id="cmScore">0/' + pairs.length + ' matched</div>' +
        '</div>' +
        '<div id="cmFeedback" style="min-height:24px;margin-top:6px;font-weight:700;font-size:0.9rem;transition:opacity 0.3s"></div>';
      container.appendChild(div);
      var leftCol = div.querySelector('#cmLeft');
      var rightCol = div.querySelector('#cmRight');

      function render() {
        leftCol.innerHTML = ''; rightCol.innerHTML = '';
        left.forEach(function(w, i) {
          var isMatched = matched.indexOf(i) > -1;
          var isSel = selLeft === i;
          var col = emirateColors[w] || '#FFD700';
          var card = document.createElement('div');
          card.style.cssText = 'padding:12px 10px;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);font-size:0.82rem;font-weight:700;position:relative;user-select:none;';
          if (isMatched) {
            card.style.background = col + '18'; card.style.border = '2px solid ' + col + '60';
            card.style.color = col; card.style.boxShadow = '0 0 12px ' + col + '20';
            card.style.opacity = '0.65'; card.style.cursor = 'default';
            card.innerHTML = '✅ ' + w;
          } else if (isSel) {
            card.style.background = col + '25'; card.style.border = '2px solid ' + col;
            card.style.color = '#fff'; card.style.boxShadow = '0 0 20px ' + col + '35';
            card.style.transform = 'scale(1.03)';
            card.innerHTML = '<div style="position:absolute;top:-3px;right:-3px;width:10px;height:10px;border-radius:50%;background:' + col + ';box-shadow:0 0 8px ' + col + '"></div>' + w;
          } else {
            card.style.background = 'rgba(255,255,255,0.04)'; card.style.border = '2px solid ' + col + '30';
            card.style.color = '#fff';
            card.textContent = w;
          }
          if (!isMatched) {
            card.onmouseenter = function() { if (selLeft !== i) { card.style.borderColor = col + '70'; card.style.transform = 'scale(1.02)'; } };
            card.onmouseleave = function() { if (selLeft !== i) { card.style.borderColor = col + '30'; card.style.transform = 'scale(1)'; } };
            card.onclick = function() { selLeft = i; div.querySelector('#cmHint').textContent = 'Now click the capital of ' + w + ' →'; render(); };
          }
          leftCol.appendChild(card);
        });
        right.forEach(function(w, j) {
          var isMatched = matched.indexOf(j + 100) > -1;
          // Find the matching emirate's color
          var matchedPair = pairs.filter(function(p) { return p.capital === w; })[0];
          var col = matchedPair ? emirateColors[matchedPair.emirate] || '#00C9A7' : '#00C9A7';
          var card = document.createElement('div');
          card.style.cssText = 'padding:12px 10px;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);font-size:0.82rem;font-weight:600;user-select:none;';
          if (isMatched) {
            card.style.background = col + '18'; card.style.border = '2px solid ' + col + '60';
            card.style.color = col; card.style.boxShadow = '0 0 12px ' + col + '20';
            card.style.opacity = '0.65'; card.style.cursor = 'default';
            card.innerHTML = '✅ ' + w;
          } else {
            card.style.background = 'rgba(255,255,255,0.04)'; card.style.border = '2px solid rgba(255,255,255,0.12)';
            card.style.color = 'rgba(255,255,255,0.8)';
            card.textContent = w;
            card.onmouseenter = function() { card.style.borderColor = 'rgba(255,215,0,0.4)'; card.style.transform = 'scale(1.02)'; };
            card.onmouseleave = function() { card.style.borderColor = 'rgba(255,255,255,0.12)'; card.style.transform = 'scale(1)'; };
            card.onclick = function() {
              if (selLeft < 0) { E.rashidSay('Pick an emirate first! 👈'); return; }
              var isMatch = pairs[selLeft].capital === w;
              var fb = div.querySelector('#cmFeedback');
              if (isMatch) {
                matched.push(selLeft, j + 100); sc++; E.addScore(1);
                var mc = emirateColors[left[selLeft]];
                fb.textContent = '✅ ' + left[selLeft] + ' → ' + w; fb.style.color = mc || '#00C9A7';
                E.rashidSay(left[selLeft] + ' matched! 🏙️');
                // Match animation - flash both cards
                card.style.background = mc + '30'; card.style.borderColor = mc; card.style.boxShadow = '0 0 25px ' + mc + '40';
              } else {
                fb.textContent = '❌ Not a match!'; fb.style.color = '#ff6b6b';
                E.rashidSay(pick(['Not quite!','Try again!','Wrong pair!']));
                card.style.background = 'rgba(255,50,50,0.15)'; card.style.borderColor = '#ff6b6b';
                card.style.animation = 'cellShake 0.4s ease';
              }
              selLeft = -1;
              div.querySelector('#cmScore').textContent = sc + '/' + pairs.length + ' matched';
              div.querySelector('#cmHint').textContent = sc < pairs.length ? 'Select an emirate, then its capital' : '';
              setTimeout(function() { render(); }, 400);
              if (sc === pairs.length) setTimeout(function() { E.endGame(sc, pairs.length); }, 800);
            };
          }
          rightCol.appendChild(card);
        });
      }
      render();
      return {};
    }, destroy: function() {}
  });

  /* ── 40. Speed Quiz ── */
  E.register({
    id: 'speed-quiz', name: 'Speed Quiz', emoji: '⚡', category: 'trivia', has2P: true,
    _tv: null,
    init: function (container, mode, diff) {
      var items = shuffle([
        { q: 'Capital of UAE?', options: ['Abu Dhabi','Dubai','Sharjah','Ajman'], correct: 0 },
        { q: 'Tallest building?', options: ['Eiffel Tower','Burj Khalifa','Empire State','CN Tower'], correct: 1 },
        { q: 'UAE currency?', options: ['Riyal','Dollar','Dirham','Pound'], correct: 2 },
        { q: 'How many emirates?', options: ['5','6','7','8'], correct: 2 },
        { q: 'Year UAE founded?', options: ['1965','1971','1975','1980'], correct: 1 },
        { q: 'Traditional boat?', options: ['Kayak','Dhow','Canoe','Yacht'], correct: 1 },
        { q: 'National bird?', options: ['Eagle','Hawk','Falcon','Parrot'], correct: 2 },
        { q: 'Famous Abu Dhabi mosque?', options: ['Blue Mosque','Grand Mosque','Al Aqsa','Faisal Mosque'], correct: 1 },
        { q: 'UAE national day month?', options: ['January','July','October','December'], correct: 3 },
        { q: 'Biggest shopping festival city?', options: ['Abu Dhabi','Sharjah','Dubai','Ajman'], correct: 2 },
        { q: 'Traditional Emirati dish?', options: ['Sushi','Machboos','Pizza','Tacos'], correct: 1 },
        { q: 'Highest peak in UAE?', options: ['Jebel Jais','Jebel Hafeet','Hatta','Fujairah Peak'], correct: 0 },
        { q: 'Palm-shaped island?', options: ['Yas Island','Saadiyat','Palm Jumeirah','Bluewaters'], correct: 2 },
        { q: 'UAE space mission?', options: ['Apollo','Hope Probe','Voyager','Hubble'], correct: 1 },
        { q: 'Traditional dance?', options: ['Salsa','Yowla','Tango','Waltz'], correct: 1 }
      ]);
      var qTimer = diff === 'easy' ? 15 : diff === 'hard' ? 7 : 10;
      var idx = 0, sc1 = 0, sc2 = 0, timer = qTimer, locked = false, streak = 0;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">' +
        '<div class="gtext" id="sqTimer" style="font-family:Orbitron;font-size:1.4rem">⏱️ ' + qTimer + '</div>' +
        '<div class="gtext gtext-sm" id="sqStreak" style="opacity:0"></div></div>' +
        '<div style="width:100%;max-width:350px;height:5px;background:rgba(255,255,255,0.08);border-radius:5px;margin-bottom:12px;overflow:hidden"><div id="sqTimerBar" style="width:100%;height:100%;background:linear-gradient(90deg,#00C9A7,#FFD700);transition:width 0.3s;border-radius:5px"></div></div>' +
        '<div class="gtext gtext-sm gmb" style="opacity:0.5" id="sqCount">Question 1/' + items.length + '</div>' +
        '<div class="gtext gtext-lg gmb" id="sqQuestion" style="text-align:center;min-height:40px;font-size:1.2rem"></div>' +
        '<div class="gflex-col" style="gap:8px;width:100%;max-width:350px" id="sqOptions"></div>' +
        '<div id="sqFeedback" style="min-height:30px;margin-top:10px;font-weight:700;transition:opacity 0.3s"></div>' +
        '<div class="gtext gmt" id="sqScore" style="font-family:Orbitron">' + (mode==='2p' ? 'P1: 0 | P2: 0' : 'Score: 0') + '</div>';
      container.appendChild(div);
      var letters = ['A','B','C','D'];
      var letterColors = ['#FF6B35','#FFD700','#00C9A7','#4ecdc4'];

      function show() {
        timer = qTimer; locked = false;
        div.querySelector('#sqQuestion').textContent = items[idx].q;
        div.querySelector('#sqTimer').textContent = '⏱️ ' + timer;
        div.querySelector('#sqTimer').style.color = '';
        div.querySelector('#sqTimerBar').style.width = '100%';
        div.querySelector('#sqCount').textContent = 'Question ' + (idx+1) + '/' + items.length;
        div.querySelector('#sqFeedback').textContent = '';
        var opts = div.querySelector('#sqOptions'); opts.innerHTML = '';
        items[idx].options.forEach(function(o, oi) {
          var btn = document.createElement('button'); btn.className = 'gbtn gbtn-outline'; btn.style.cssText = 'width:100%;display:flex;align-items:center;gap:10px;padding:12px 16px;text-align:left;transition:all 0.2s';
          btn.innerHTML = '<span style="display:inline-flex;width:28px;height:28px;border-radius:8px;background:' + letterColors[oi] + '20;color:' + letterColors[oi] + ';align-items:center;justify-content:center;font-weight:800;font-size:0.85rem;flex-shrink:0">' + letters[oi] + '</span><span>' + o + '</span>';
          btn.setAttribute('data-oi', oi);
          btn.onclick = function() { answer(1, oi, btn); };
          opts.appendChild(btn);
        });
      }

      function answer(player, choice, btn) {
        if (locked) return;
        locked = true;
        var correct = choice === items[idx].correct;
        var fb = div.querySelector('#sqFeedback');
        var opts = div.querySelector('#sqOptions');
        // Highlight correct/wrong
        opts.querySelectorAll('button').forEach(function(b) { b.disabled = true; b.style.opacity = '0.4'; });
        if (correct) {
          streak++;
          if (player === 1) sc1++; else sc2++;
          btn.style.opacity = '1'; btn.style.background = 'rgba(0,201,167,0.2)'; btn.style.borderColor = '#00C9A7';
          fb.textContent = '✅ Correct!' + (streak > 2 ? ' 🔥 ' + streak + ' streak!' : ''); fb.style.color = '#00C9A7';
          div.querySelector('#sqStreak').textContent = streak > 1 ? '🔥' + streak : '';
          div.querySelector('#sqStreak').style.opacity = streak > 1 ? '1' : '0';
          E.rashidSay(pick(['Correct! ⚡','Fast! 🏃','Right! 🎯']));
        } else {
          streak = 0;
          btn.style.opacity = '1'; btn.style.background = 'rgba(255,50,50,0.2)'; btn.style.borderColor = '#ff6b6b';
          // Show correct answer
          opts.querySelectorAll('button').forEach(function(b) {
            if (parseInt(b.getAttribute('data-oi')) === items[idx].correct) { b.style.opacity = '1'; b.style.background = 'rgba(0,201,167,0.2)'; b.style.borderColor = '#00C9A7'; }
          });
          fb.textContent = '❌ Wrong!'; fb.style.color = '#ff6b6b';
          div.querySelector('#sqStreak').style.opacity = '0';
          E.rashidSay('Nope!');
        }
        E.setScore(mode==='2p' ? Math.max(sc1,sc2) : sc1);
        div.querySelector('#sqScore').textContent = mode==='2p' ? 'P1: '+sc1+' | P2: '+sc2 : 'Score: '+sc1;
        setTimeout(function() {
          idx++;
          if (idx >= items.length) E.endGame(mode==='2p'?Math.max(sc1,sc2):sc1, items.length);
          else show();
        }, 800);
      }

      this._tv = setInterval(function() { timer--;
        div.querySelector('#sqTimer').textContent = '⏱️ ' + timer;
        div.querySelector('#sqTimerBar').style.width = (timer / qTimer * 100) + '%';
        if (timer <= 3) { div.querySelector('#sqTimer').style.color = '#ff6b6b'; div.querySelector('#sqTimerBar').style.background = 'linear-gradient(90deg,#ff6b6b,#FF6B35)'; }
        if (timer <= 0) {
          locked = true; streak = 0;
          div.querySelector('#sqFeedback').textContent = '⏰ Time\'s up!'; div.querySelector('#sqFeedback').style.color = '#FFD700';
          E.rashidSay('Too slow!');
          setTimeout(function() { idx++; if (idx >= items.length) { clearInterval(this._tv); E.endGame(sc1, items.length); } else show(); }.bind(this), 600);
        }
      }.bind(this), 1000);
      show();
      return {};
    }, destroy: function() { if (this._tv) clearInterval(this._tv); }
  });

  /* ── 41. Category Sort ── */
  E.register({
    id: 'category-sort', name: 'Category Sort', emoji: '📂', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var categories = { Food: { emoji: '🍽️', color: '#FF6B35', items: ['Machboos','Luqaimat','Harees','Dates','Balaleet'] },
        Landmark: { emoji: '🏛️', color: '#FFD700', items: ['Burj Khalifa','Louvre Abu Dhabi','Dubai Frame','Palm Jumeirah','Sheikh Zayed Mosque'] },
        Animal: { emoji: '🐾', color: '#00C9A7', items: ['Falcon','Camel','Oryx','Flamingo','Turtle'] },
        Tradition: { emoji: '🏺', color: '#9b59b6', items: ['Pearl Diving','Falconry','Henna','Yowla Dance','Majlis'] } };
      var catKeys = Object.keys(categories);
      var allItems = [];
      catKeys.forEach(function(cat) { categories[cat].items.forEach(function(item) { allItems.push({ name: item, cat: cat }); }); });
      allItems = shuffle(allItems).slice(0, diff === 'easy' ? 8 : diff === 'hard' ? 16 : 12);
      var idx = 0, sc = 0, locked = false;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gtext-sm gmb" style="opacity:0.5" id="csCount">' + (idx+1) + '/' + allItems.length + '</div>' +
        '<div id="csItemCard" style="width:100%;max-width:320px;min-height:70px;background:rgba(255,255,255,0.05);border:2px solid rgba(255,215,0,0.15);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;padding:16px;transition:all 0.3s">' +
        '<div class="gtext gtext-lg gtext-gold" id="csItem" style="font-size:1.3rem;font-weight:700;transition:transform 0.3s"></div></div>' +
        '<div class="gtext gtext-sm gmb" style="opacity:0.5">Which category does it belong to?</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;max-width:340px" id="csBtns"></div>' +
        '<div id="csFeedback" style="min-height:28px;margin-top:12px;font-weight:700"></div>';
      container.appendChild(div);

      function show() {
        locked = false;
        var item = div.querySelector('#csItem');
        var card = div.querySelector('#csItemCard');
        item.style.transform = 'scale(0.8)';
        setTimeout(function() { item.style.transform = 'scale(1)'; }, 50);
        item.textContent = allItems[idx].name;
        card.style.borderColor = 'rgba(255,215,0,0.15)'; card.style.boxShadow = 'none';
        div.querySelector('#csCount').textContent = (idx+1) + '/' + allItems.length;
        div.querySelector('#csFeedback').textContent = '';
        var btns = div.querySelector('#csBtns'); btns.innerHTML = '';
        catKeys.forEach(function(cat) {
          var catData = categories[cat];
          var btn = document.createElement('button'); btn.className = 'gbtn';
          btn.style.cssText = 'padding:14px;border-radius:14px;background:' + catData.color + '12;border:1.5px solid ' + catData.color + '40;color:#fff;cursor:pointer;transition:all 0.2s;font-size:0.95rem;display:flex;flex-direction:column;align-items:center;gap:4px';
          btn.innerHTML = '<span style="font-size:1.4rem">' + catData.emoji + '</span><span>' + cat + '</span>';
          btn.onmouseenter = function() { btn.style.background = catData.color + '30'; btn.style.transform = 'scale(1.05)'; };
          btn.onmouseleave = function() { btn.style.background = catData.color + '12'; btn.style.transform = 'scale(1)'; };
          btn.onclick = function() {
            if (locked) return; locked = true;
            var fb = div.querySelector('#csFeedback');
            var card = div.querySelector('#csItemCard');
            if (cat === allItems[idx].cat) {
              sc++; E.addScore(1);
              btn.style.background = catData.color + '50'; btn.style.borderColor = catData.color;
              card.style.borderColor = '#00C9A7'; card.style.boxShadow = '0 0 20px rgba(0,201,167,0.3)';
              fb.textContent = '✅ ' + allItems[idx].name + ' → ' + cat + '!'; fb.style.color = '#00C9A7';
              E.rashidSay(pick(['Right! 📂','Correct! 🎯','Smart! 🧠']));
            } else {
              card.style.borderColor = '#ff6b6b'; card.style.boxShadow = '0 0 20px rgba(255,50,50,0.3)';
              fb.textContent = '❌ It belongs to ' + allItems[idx].cat + '!'; fb.style.color = '#ff6b6b';
              E.rashidSay('Nope! It\'s ' + allItems[idx].cat);
            }
            setTimeout(function() { idx++; if (idx >= allItems.length) E.endGame(sc, allItems.length); else show(); }, 800);
          };
          btns.appendChild(btn);
        });
      }
      show();
      return {};
    }, destroy: function() {}
  });

  /* ── 42. Number Guess (Estimation) ── */
  E.register({
    id: 'estimation', name: 'Number Guess', emoji: '📊', category: 'trivia', has2P: false,
    init: function (container, mode, diff) {
      var items = shuffle([
        { q: 'How tall is Burj Khalifa in meters?', answer: 828, unit: 'm', emoji: '🏗️' },
        { q: 'How many floors does Burj Khalifa have?', answer: 163, unit: '', emoji: '🏢' },
        { q: 'Area of UAE in km² (thousands)?', answer: 84, unit: 'k km²', emoji: '🗺️' },
        { q: 'UAE population in millions (approx)?', answer: 10, unit: 'M', emoji: '👥' },
        { q: 'Year the UAE was founded?', answer: 1971, unit: '', emoji: '🇦🇪' },
        { q: 'Length of Dubai Metro in km?', answer: 75, unit: 'km', emoji: '🚇' },
        { q: 'Temperature in Dubai summer (°C)?', answer: 45, unit: '°C', emoji: '🌡️' },
        { q: 'Number of Louvre Abu Dhabi artworks?', answer: 600, unit: '', emoji: '🎨' }
      ]).slice(0, 6);
      var idx = 0, sc = 0;
      var div = document.createElement('div'); div.className = 'gflex-col gw100';
      div.style.alignItems = 'center';
      div.innerHTML = '<div class="gtext gtext-sm gmb" style="opacity:0.5;font-family:Orbitron" id="ngStatus">Question 1/6</div>' +
        /* Question card */
        '<div style="width:100%;max-width:360px;padding:20px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,215,0,0.15);border-radius:16px;text-align:center;margin-bottom:16px;transition:all 0.3s" id="ngCard">' +
        '<div id="ngEmoji" style="font-size:2.2rem;margin-bottom:6px"></div>' +
        '<div class="gtext" id="ngQuestion" style="font-size:1.05rem;font-weight:600;line-height:1.5;min-height:48px"></div></div>' +
        /* Input area */
        '<div style="width:100%;max-width:320px;display:flex;gap:8px;align-items:center">' +
        '<input class="ginput" type="number" id="ngInput" placeholder="Your guess..." style="flex:1;font-size:1.2rem;font-family:Orbitron;text-align:center;padding:16px" />' +
        '<button class="gbtn gbtn-gold" id="ngSubmit" style="padding:16px 24px;font-size:1.1rem;flex-shrink:0;border-radius:14px">Go!</button>' +
        '</div>' +
        /* Thermometer / distance indicator */
        '<div id="ngThermo" style="width:100%;max-width:320px;margin-top:16px;opacity:0;transition:opacity 0.3s">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:0.65rem;color:rgba(255,255,255,0.3)">❄️ Far</span><span style="font-size:0.65rem;color:rgba(255,255,255,0.3)">🎯 Exact</span></div>' +
        '<div style="width:100%;height:12px;background:rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">' +
        '<div id="ngThermoFill" style="height:100%;width:0%;border-radius:8px;transition:width 0.8s cubic-bezier(0.4,0,0.2,1),background 0.8s"></div></div>' +
        '<div id="ngThermoLabel" style="text-align:center;margin-top:6px;font-size:0.85rem;font-weight:700;min-height:22px;transition:all 0.3s"></div>' +
        '</div>' +
        /* Result reveal area */
        '<div id="ngReveal" style="width:100%;max-width:360px;margin-top:8px;text-align:center;min-height:70px;opacity:0;transition:opacity 0.4s">' +
        '<div style="display:flex;justify-content:center;gap:16px;align-items:center">' +
        '<div><div style="font-size:0.65rem;color:rgba(255,255,255,0.4);margin-bottom:2px">YOUR GUESS</div><div id="ngGuessShow" style="font-family:Orbitron;font-size:1.4rem;font-weight:800;color:#FFD700"></div></div>' +
        '<div style="font-size:1.5rem">→</div>' +
        '<div><div style="font-size:0.65rem;color:rgba(255,255,255,0.4);margin-bottom:2px">ANSWER</div><div id="ngAnswerShow" style="font-family:Orbitron;font-size:1.4rem;font-weight:800;color:#00C9A7"></div></div>' +
        '</div>' +
        '<div id="ngPoints" style="margin-top:8px;font-weight:800;font-size:1.1rem"></div>' +
        '</div>' +
        /* Score + progress */
        '<div style="display:flex;align-items:center;gap:8px;margin-top:12px">' +
        '<div style="display:flex;gap:4px" id="ngDots"></div>' +
        '<div class="gtext gtext-sm" style="font-family:Orbitron;color:#FFD700" id="ngScoreShow">0 pts</div>' +
        '</div>';
      container.appendChild(div);

      // Build dots
      var dotsDiv = div.querySelector('#ngDots');
      for (var d = 0; d < 6; d++) {
        var dotEl = document.createElement('div');
        dotEl.style.cssText = 'width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,215,0,0.15);transition:all 0.3s';
        dotEl.setAttribute('data-dot', d);
        dotsDiv.appendChild(dotEl);
      }

      function show() {
        div.querySelector('#ngQuestion').textContent = items[idx].q;
        div.querySelector('#ngEmoji').textContent = items[idx].emoji;
        div.querySelector('#ngInput').value = '';
        div.querySelector('#ngInput').disabled = false;
        div.querySelector('#ngSubmit').disabled = false;
        div.querySelector('#ngStatus').textContent = 'Question ' + (idx+1) + '/6';
        div.querySelector('#ngThermo').style.opacity = '0';
        div.querySelector('#ngReveal').style.opacity = '0';
        div.querySelector('#ngCard').style.borderColor = 'rgba(255,215,0,0.15)';
        div.querySelector('#ngCard').style.boxShadow = 'none';
        div.querySelector('#ngInput').focus();
      }

      div.querySelector('#ngSubmit').onclick = function() {
        var guess = parseInt(div.querySelector('#ngInput').value);
        if (isNaN(guess)) { E.rashidSay('Type a number!'); return; }
        div.querySelector('#ngInput').disabled = true;
        div.querySelector('#ngSubmit').disabled = true;
        var distance = Math.abs(guess - items[idx].answer);
        var pct = distance / items[idx].answer;
        var t1 = diff === 'easy' ? 0.1 : diff === 'hard' ? 0.03 : 0.05;
        var t2 = diff === 'easy' ? 0.25 : diff === 'hard' ? 0.1 : 0.15;
        var t3 = diff === 'easy' ? 0.4 : diff === 'hard' ? 0.2 : 0.3;
        var pts = pct < t1 ? 3 : pct < t2 ? 2 : pct < t3 ? 1 : 0;
        sc += pts; E.setScore(sc);

        // Thermometer animation
        var thermo = div.querySelector('#ngThermo');
        var fill = div.querySelector('#ngThermoFill');
        var thermoLabel = div.querySelector('#ngThermoLabel');
        thermo.style.opacity = '1';
        var closeness = Math.max(0, Math.min(100, (1 - Math.min(pct, 1)) * 100));
        setTimeout(function() {
          fill.style.width = closeness + '%';
          fill.style.background = pts === 3 ? 'linear-gradient(90deg,#FFD700,#00C9A7)' : pts === 2 ? 'linear-gradient(90deg,#FF6B35,#FFD700)' : pts === 1 ? 'linear-gradient(90deg,#ff6b6b,#FF6B35)' : 'linear-gradient(90deg,#666,#ff6b6b)';
          thermoLabel.textContent = pts === 3 ? '🎯 SPOT ON!' : pts === 2 ? '🔥 Very close!' : pts === 1 ? '🌤️ Not bad!' : '❄️ Way off!';
          thermoLabel.style.color = pts === 3 ? '#00C9A7' : pts === 2 ? '#FFD700' : pts === 1 ? '#FF6B35' : '#ff6b6b';
        }, 100);

        // Reveal animation
        var reveal = div.querySelector('#ngReveal');
        setTimeout(function() {
          reveal.style.opacity = '1';
          div.querySelector('#ngGuessShow').textContent = guess;
          div.querySelector('#ngAnswerShow').textContent = items[idx].answer + items[idx].unit;
          var ptsEl = div.querySelector('#ngPoints');
          ptsEl.textContent = '+' + pts + ' point' + (pts !== 1 ? 's' : '');
          ptsEl.style.color = pts === 3 ? '#00C9A7' : pts >= 1 ? '#FFD700' : '#ff6b6b';
          // Card glow
          var card = div.querySelector('#ngCard');
          card.style.borderColor = pts >= 2 ? '#00C9A7' : pts === 1 ? '#FFD700' : '#ff6b6b';
          card.style.boxShadow = '0 0 20px ' + (pts >= 2 ? 'rgba(0,201,167,0.2)' : pts === 1 ? 'rgba(255,215,0,0.2)' : 'rgba(255,50,50,0.15)');
        }, 500);

        // Dot
        var dots = dotsDiv.querySelectorAll('[data-dot]');
        if (dots[idx]) {
          var dc = pts === 3 ? '#00C9A7' : pts >= 1 ? '#FFD700' : '#ff6b6b';
          dots[idx].style.background = dc; dots[idx].style.borderColor = dc; dots[idx].style.boxShadow = '0 0 6px ' + dc + '80';
        }
        div.querySelector('#ngScoreShow').textContent = sc + ' pts';

        var msg = 'Answer: ' + items[idx].answer + items[idx].unit + '. ';
        if (pts === 3) msg += 'Spot on! 🎯'; else if (pts === 2) msg += 'Very close! 👏'; else if (pts === 1) msg += 'Not bad! 🌤️'; else msg += 'Way off! ❄️';
        E.rashidSay(msg);

        idx++;
        setTimeout(function() {
          if (idx >= items.length) E.endGame(sc, items.length * 3);
          else show();
        }, 2200);
      };
      div.querySelector('#ngInput').onkeydown = function(e) { if (e.key === 'Enter') div.querySelector('#ngSubmit').click(); };
      show();
      return {};
    }, destroy: function() {}
  });

})();
