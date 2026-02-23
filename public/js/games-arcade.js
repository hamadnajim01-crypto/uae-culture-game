/* ===== ARCADE GAMES (12) — Canvas-based, Enhanced Graphics ===== */
(function () {
  var E = window.GamesEngine;
  var shuffle = E.shuffle, pick = E.pick, clamp = E.clamp;

  /* ── Shared Helpers ── */
  function gradBg(ctx, w, h, c1, c2) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function glow(ctx, color, blur) { ctx.shadowColor = color; ctx.shadowBlur = blur || 15; }
  function noGlow(ctx) { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; }
  function rRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }
  function timerBar(ctx, x, y, w, h, ratio, c1, c2) {
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    rRect(ctx, x, y, w, h, h / 2); ctx.fill();
    if (ratio > 0) {
      var g = ctx.createLinearGradient(x, y, x + w, y);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; rRect(ctx, x, y, w * Math.max(0, ratio), h, h / 2); ctx.fill();
    }
  }
  /* Simple particle system */
  function Sparks() { this.p = []; }
  Sparks.prototype.emit = function (x, y, col, n, spd) {
    n = n || 6; spd = spd || 3;
    for (var i = 0; i < n; i++) this.p.push({ x: x, y: y, vx: (Math.random() - 0.5) * spd * 2, vy: (Math.random() - 0.5) * spd * 2 - 1, life: 1, c: col, r: 1.5 + Math.random() * 2 });
  };
  Sparks.prototype.tick = function (ctx) {
    for (var i = this.p.length - 1; i >= 0; i--) {
      var q = this.p[i]; q.x += q.vx; q.y += q.vy; q.vy += 0.05; q.life -= 0.025;
      if (q.life <= 0) { this.p.splice(i, 1); continue; }
      ctx.globalAlpha = q.life; ctx.fillStyle = q.c;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.r * q.life, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
  /* Fixed star field */
  var _stars = {};
  function stars(ctx, w, h, n) {
    var k = w + 'x' + h;
    if (!_stars[k]) { var a = []; for (var i = 0; i < (n || 50); i++) a.push({ x: Math.random() * w, y: Math.random() * h, a: 0.15 + Math.random() * 0.5, s: 0.5 + Math.random() * 1.5 }); _stars[k] = a; }
    var s = _stars[k];
    for (var i = 0; i < s.length; i++) { ctx.fillStyle = 'rgba(255,255,255,' + s[i].a + ')'; ctx.fillRect(s[i].x, s[i].y, s[i].s, s[i].s); }
  }

  /* ── 1. Desert Snake ── */
  E.register({
    id: 'desert-snake', name: 'Desert Snake', emoji: '🐍', category: 'arcade', has2P: false,
    _iv: null,
    init: function (container, mode, diff) {
      var W = 20, H = 15, SZ = 24;
      var speed = diff === 'easy' ? 190 : diff === 'hard' ? 95 : 140;
      var canvas = E.makeCanvas(W * SZ, H * SZ); container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var snake = [{ x: 10, y: 7 }], dir = { x: 1, y: 0 }, food = null, sc = 0, dead = false;
      var sparks = new Sparks();
      var pulse = 0; // food pulse animation

      function placeFood() { food = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) }; }
      placeFood();

      function draw() {
        // gradient desert night background
        gradBg(ctx, W * SZ, H * SZ, '#0d1b2a', '#1b2d1b');
        // subtle grid
        ctx.strokeStyle = 'rgba(255,215,0,0.04)';
        for (var i = 0; i <= W; i++) { ctx.beginPath(); ctx.moveTo(i * SZ, 0); ctx.lineTo(i * SZ, H * SZ); ctx.stroke(); }
        for (var j = 0; j <= H; j++) { ctx.beginPath(); ctx.moveTo(0, j * SZ); ctx.lineTo(W * SZ, j * SZ); ctx.stroke(); }

        // pulsating food glow
        pulse += 0.08;
        var pr = SZ / 2 + Math.sin(pulse) * 3;
        glow(ctx, '#FF6B35', 18 + Math.sin(pulse) * 8);
        ctx.fillStyle = '#FF6B35'; ctx.beginPath();
        ctx.arc(food.x * SZ + SZ / 2, food.y * SZ + SZ / 2, pr - 2, 0, Math.PI * 2); ctx.fill();
        noGlow(ctx);
        ctx.fillStyle = '#fff'; ctx.font = (SZ - 4) + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🌴', food.x * SZ + SZ / 2, food.y * SZ + SZ / 2);

        // snake with gradient body
        snake.forEach(function (s, i) {
          var ratio = 1 - i / (snake.length || 1);
          var r = Math.round(255 * ratio), g = Math.round(215 * ratio + 40 * (1 - ratio)), b = 0;
          if (i === 0) { ctx.fillStyle = '#FFD700'; glow(ctx, '#FFD700', 10); }
          else { ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'; noGlow(ctx); }
          rRect(ctx, s.x * SZ + 1, s.y * SZ + 1, SZ - 2, SZ - 2, 5); ctx.fill();
          noGlow(ctx);
          // eyes on head
          if (i === 0) {
            ctx.fillStyle = '#000';
            var ex1 = s.x * SZ + 6, ex2 = s.x * SZ + SZ - 9, ey = s.y * SZ + 7;
            ctx.beginPath(); ctx.arc(ex1 + 2, ey, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(ex2 + 2, ey, 2.5, 0, Math.PI * 2); ctx.fill();
          }
        });

        sparks.tick(ctx);

        // HUD: score with glow
        glow(ctx, '#FFD700', 8);
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 16px Orbitron'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('🌴 ' + sc, 8, 6);
        noGlow(ctx);

        if (dead) {
          ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, W * SZ, H * SZ);
          glow(ctx, '#FFD700', 20);
          ctx.fillStyle = '#FFD700'; ctx.font = 'bold 30px Orbitron'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('GAME OVER', W * SZ / 2, H * SZ / 2 - 10);
          noGlow(ctx);
          ctx.fillStyle = '#fff'; ctx.font = '16px Inter';
          ctx.fillText('Score: ' + sc, W * SZ / 2, H * SZ / 2 + 25);
        }
      }

      function tick() {
        if (dead) return;
        var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H) { dead = true; draw(); E.endGame(sc, sc || 1); return; }
        for (var i = 0; i < snake.length; i++) { if (snake[i].x === head.x && snake[i].y === head.y) { dead = true; draw(); E.endGame(sc, sc || 1); return; } }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          sc++; E.setScore(sc); placeFood();
          sparks.emit(head.x * SZ + SZ / 2, head.y * SZ + SZ / 2, '#FFD700', 10, 4);
          E.rashidSay(pick(['Yum! 🌴', 'Tasty date!', 'Keep going! 🐍', 'Delicious! 😋']));
        } else snake.pop();
        draw();
      }
      this._iv = setInterval(tick, speed); draw();

      this._keyHandler = function (e) {
        if (dead) return;
        if (e.key === 'ArrowUp' && dir.y === 0) dir = { x: 0, y: -1 };
        else if (e.key === 'ArrowDown' && dir.y === 0) dir = { x: 0, y: 1 };
        else if (e.key === 'ArrowLeft' && dir.x === 0) dir = { x: -1, y: 0 };
        else if (e.key === 'ArrowRight' && dir.x === 0) dir = { x: 1, y: 0 };
        e.preventDefault();
      };
      document.addEventListener('keydown', this._keyHandler);
      var touchStart = null;
      this._touchStart = function (e) { touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
      this._touchEnd = function (e) {
        if (!touchStart) return;
        var dx = e.changedTouches[0].clientX - touchStart.x, dy = e.changedTouches[0].clientY - touchStart.y;
        if (Math.abs(dx) > Math.abs(dy)) { if (dx > 20 && dir.x === 0) dir = { x: 1, y: 0 }; else if (dx < -20 && dir.x === 0) dir = { x: -1, y: 0 }; }
        else { if (dy > 20 && dir.y === 0) dir = { x: 0, y: 1 }; else if (dy < -20 && dir.y === 0) dir = { x: 0, y: -1 }; }
        touchStart = null;
      };
      canvas.addEventListener('touchstart', this._touchStart);
      canvas.addEventListener('touchend', this._touchEnd);
      return {};
    },
    destroy: function () { if (this._iv) clearInterval(this._iv); if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler); }
  });

  /* ── 2. Flappy Falcon ── */
  E.register({
    id: 'flappy-falcon', name: 'Flappy Falcon', emoji: '🦅', category: 'arcade', has2P: false,
    _running: false,
    init: function (container, mode, diff) {
      var CW = 400, CH = 500;
      var canvas = E.makeCanvas(CW, CH); container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var gapSize = diff === 'easy' ? 160 : diff === 'hard' ? 100 : 130;
      var pSpeed = diff === 'easy' ? 1.8 : diff === 'hard' ? 3 : 2.2;
      var grav = diff === 'easy' ? 0.28 : diff === 'hard' ? 0.42 : 0.35;
      var bird = { y: CH / 2, vy: 0, tilt: 0 }, gravity = grav, jump = -6.5;
      var pipes = [], gap = gapSize, pipeW = 50, pipeSpeed = pSpeed, spawnTimer = 0;
      var sc = 0, dead = false, started = false;
      var sparks = new Sparks();
      // clouds for parallax
      var clouds = [];
      for (var ci = 0; ci < 5; ci++) clouds.push({ x: Math.random() * CW, y: 30 + Math.random() * 150, w: 40 + Math.random() * 60, speed: 0.2 + Math.random() * 0.4 });
      this._running = true; var self = this;

      function addPipe() {
        var topH = 60 + Math.random() * (CH - gap - 120);
        pipes.push({ x: CW, topH: topH, scored: false });
      }

      function draw() {
        // sunset sky gradient
        gradBg(ctx, CW, CH, '#1a0533', '#c94b22');
        // stars at top
        ctx.globalAlpha = 0.4; stars(ctx, CW, CH / 2, 30); ctx.globalAlpha = 1;
        // clouds
        clouds.forEach(function (c) {
          c.x -= c.speed; if (c.x < -c.w) c.x = CW + 20;
          ctx.fillStyle = 'rgba(255,255,255,0.06)';
          ctx.beginPath(); ctx.ellipse(c.x, c.y, c.w / 2, 12, 0, 0, Math.PI * 2); ctx.fill();
        });
        // ground with gradient
        var gg = ctx.createLinearGradient(0, CH - 30, 0, CH);
        gg.addColorStop(0, '#C4935A'); gg.addColorStop(1, '#8B6914');
        ctx.fillStyle = gg; ctx.fillRect(0, CH - 30, CW, 30);
        // ground pattern dots
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        for (var d = 0; d < CW; d += 20) { ctx.beginPath(); ctx.arc(d, CH - 15, 2, 0, Math.PI * 2); ctx.fill(); }

        // pipes with gradient
        pipes.forEach(function (p) {
          var pg = ctx.createLinearGradient(p.x, 0, p.x + pipeW, 0);
          pg.addColorStop(0, '#009977'); pg.addColorStop(0.5, '#00C9A7'); pg.addColorStop(1, '#009977');
          ctx.fillStyle = pg;
          ctx.fillRect(p.x, 0, pipeW, p.topH);
          ctx.fillRect(p.x, p.topH + gap, pipeW, CH - p.topH - gap - 30);
          // pipe caps
          var cg = ctx.createLinearGradient(p.x - 4, 0, p.x + pipeW + 4, 0);
          cg.addColorStop(0, '#FFB700'); cg.addColorStop(0.5, '#FFD700'); cg.addColorStop(1, '#FFB700');
          ctx.fillStyle = cg;
          rRect(ctx, p.x - 4, p.topH - 10, pipeW + 8, 10, 3); ctx.fill();
          rRect(ctx, p.x - 4, p.topH + gap, pipeW + 8, 10, 3); ctx.fill();
        });

        // bird with tilt
        bird.tilt = clamp(bird.vy * 3, -30, 45);
        ctx.save();
        ctx.translate(80, bird.y);
        ctx.rotate(bird.tilt * Math.PI / 180);
        ctx.font = '30px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🦅', 0, 0);
        ctx.restore();

        sparks.tick(ctx);

        // score
        glow(ctx, '#fff', 10);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 28px Orbitron'; ctx.textAlign = 'center';
        ctx.fillText(sc, CW / 2, 45);
        noGlow(ctx);

        if (!started) {
          ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(0, CH / 2 + 30, CW, 40);
          ctx.fillStyle = '#FFD700'; ctx.font = 'bold 16px Inter'; ctx.fillText('Click or Tap to Start', CW / 2, CH / 2 + 55);
        }
        if (dead) {
          ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0, 0, CW, CH);
          glow(ctx, '#FFD700', 25);
          ctx.fillStyle = '#FFD700'; ctx.font = 'bold 32px Orbitron'; ctx.fillText('GAME OVER', CW / 2, CH / 2 - 10);
          noGlow(ctx);
          ctx.fillStyle = '#fff'; ctx.font = '18px Inter'; ctx.fillText('Score: ' + sc, CW / 2, CH / 2 + 30);
        }
      }

      function update() {
        if (!started || dead) return;
        bird.vy += gravity; bird.y += bird.vy;
        if (bird.y > CH - 40 || bird.y < 0) { dead = true; E.endGame(sc, sc || 1); return; }
        spawnTimer++;
        if (spawnTimer > 90) { addPipe(); spawnTimer = 0; }
        for (var i = pipes.length - 1; i >= 0; i--) {
          pipes[i].x -= pipeSpeed;
          if (pipes[i].x + pipeW < 0) { pipes.splice(i, 1); continue; }
          if (!pipes[i].scored && pipes[i].x + pipeW < 80) {
            pipes[i].scored = true; sc++; E.setScore(sc);
            sparks.emit(80, bird.y, '#FFD700', 6, 2);
            if (sc % 5 === 0) E.rashidSay(pick(['Amazing flying! 🦅', 'Keep soaring!', sc + ' pipes! Wow!']));
          }
          if (80 + 14 > pipes[i].x && 80 - 14 < pipes[i].x + pipeW) {
            if (bird.y - 14 < pipes[i].topH || bird.y + 14 > pipes[i].topH + gap) { dead = true; E.endGame(sc, sc || 1); return; }
          }
        }
      }

      function flap() { if (dead) return; if (!started) started = true; bird.vy = jump; }
      E.loop(function () { if (!self._running) return; update(); draw(); });
      canvas.onclick = flap;
      canvas.ontouchstart = function (e) { e.preventDefault(); flap(); };
      this._keyHandler = function (e) { if (e.code === 'Space') { e.preventDefault(); flap(); } };
      document.addEventListener('keydown', this._keyHandler);
      return {};
    },
    destroy: function () { this._running = false; if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler); }
  });

  /* ── 3. Catch the Dates ── */
  E.register({
    id: 'catch-dates', name: 'Catch the Dates', emoji: '🌴', category: 'arcade', has2P: false,
    _running: false,
    init: function (container, mode, diff) {
      var CW = 400, CH = 500;
      var canvas = E.makeCanvas(CW, CH); container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var maxMiss = diff === 'easy' ? 5 : diff === 'hard' ? 2 : 3;
      var fallSpeed = diff === 'easy' ? 1.5 : diff === 'hard' ? 3 : 2;
      var spawnRate = diff === 'easy' ? 50 : diff === 'hard' ? 30 : 40;
      var basket = { x: CW / 2, w: diff === 'easy' ? 80 : diff === 'hard' ? 50 : 60 };
      var dates = [], missed = 0, sc = 0, spawnTimer = 0;
      var sparks = new Sparks();
      this._running = true; var self = this;

      function spawn() { dates.push({ x: 20 + Math.random() * (CW - 40), y: -20, speed: fallSpeed + Math.random() * 2, rot: Math.random() * 0.1 - 0.05 }); }

      E.loop(function () {
        if (!self._running) return;
        spawnTimer++; if (spawnTimer > spawnRate) { spawn(); spawnTimer = 0; }
        for (var i = dates.length - 1; i >= 0; i--) {
          dates[i].y += dates[i].speed;
          dates[i].rot += 0.02;
          if (dates[i].y > CH - 55 && Math.abs(dates[i].x - basket.x) < basket.w / 2 + 15) {
            sparks.emit(dates[i].x, CH - 55, '#FFD700', 8, 3);
            dates.splice(i, 1); sc++; E.setScore(sc);
            E.rashidSay(pick(['Caught it! 🌴', 'Nice! 😋', 'Yummy!', 'Great catch!']));
            continue;
          }
          if (dates[i].y > CH) {
            sparks.emit(dates[i].x, CH - 10, '#ff4444', 4, 2);
            dates.splice(i, 1); missed++;
            if (missed >= maxMiss) { self._running = false; E.endGame(sc, sc || 1); return; }
          }
        }
        // sky gradient
        gradBg(ctx, CW, CH, '#0d1b3e', '#1a3a5c');
        // ground
        var gg = ctx.createLinearGradient(0, CH - 25, 0, CH);
        gg.addColorStop(0, '#C4935A'); gg.addColorStop(1, '#8B6914');
        ctx.fillStyle = gg; ctx.fillRect(0, CH - 25, CW, 25);

        // dates with rotation
        dates.forEach(function (d) {
          ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(d.rot);
          ctx.font = '24px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('🌴', 0, 0);
          ctx.restore();
        });

        // basket with gradient and glow
        glow(ctx, '#FF6B35', 12);
        var bg = ctx.createLinearGradient(basket.x - basket.w / 2, CH - 50, basket.x + basket.w / 2, CH - 50);
        bg.addColorStop(0, '#CC5522'); bg.addColorStop(0.5, '#FF6B35'); bg.addColorStop(1, '#CC5522');
        ctx.fillStyle = bg;
        rRect(ctx, basket.x - basket.w / 2, CH - 50, basket.w, 22, 6); ctx.fill();
        noGlow(ctx);
        ctx.font = '14px serif'; ctx.textAlign = 'center'; ctx.fillText('🧺', basket.x, CH - 34);

        sparks.tick(ctx);

        // HUD
        ctx.fillStyle = '#fff'; ctx.font = '13px Inter'; ctx.textAlign = 'left';
        var hearts = '';
        for (var h = 0; h < maxMiss; h++) hearts += (h < maxMiss - missed) ? '❤️' : '🖤';
        ctx.fillText(hearts, 10, 22);
        glow(ctx, '#FFD700', 6);
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 16px Orbitron'; ctx.textAlign = 'right';
        ctx.fillText(sc, CW - 12, 22);
        noGlow(ctx);
      });

      this._moveHandler = function (e) {
        var rect = canvas.getBoundingClientRect();
        basket.x = clamp((e.clientX - rect.left) / (rect.width / CW), basket.w / 2, CW - basket.w / 2);
      };
      this._touchHandler = function (e) {
        e.preventDefault(); var rect = canvas.getBoundingClientRect();
        basket.x = clamp((e.touches[0].clientX - rect.left) / (rect.width / CW), basket.w / 2, CW - basket.w / 2);
      };
      canvas.addEventListener('mousemove', this._moveHandler);
      canvas.addEventListener('touchmove', this._touchHandler);
      return {};
    },
    destroy: function () { this._running = false; }
  });

  /* ── 4. Whack-a-Camel ── */
  E.register({
    id: 'whack-camel', name: 'Whack-a-Camel', emoji: '🐫', category: 'arcade', has2P: false,
    _iv: null, _tv: null,
    init: function (container, mode, diff) {
      var timeTotal = diff === 'easy' ? 40 : diff === 'hard' ? 20 : 30;
      var popRate = diff === 'easy' ? 1200 : diff === 'hard' ? 700 : 1000;
      var div = document.createElement('div');
      div.className = 'gflex-col gw100';
      div.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;width:100%;max-width:310px">' +
          '<span style="color:#FFD700;font:bold 18px Orbitron" id="wacScore">0</span>' +
          '<div style="flex:1;margin:0 12px;height:10px;background:rgba(255,255,255,0.08);border-radius:5px;overflow:hidden">' +
            '<div id="wacBar" style="height:100%;width:100%;background:linear-gradient(90deg,#FF6B35,#FFD700);border-radius:5px;transition:width 0.3s"></div>' +
          '</div>' +
          '<span style="color:#fff;font:14px Orbitron" id="wacTimer">' + timeTotal + 's</span>' +
        '</div>' +
        '<div class="gboard" style="grid-template-columns:repeat(3,95px);gap:8px" id="wacGrid"></div>';
      container.appendChild(div);
      var grid = div.querySelector('#wacGrid');
      var cells = [];
      for (var i = 0; i < 9; i++) {
        var cell = document.createElement('div');
        cell.className = 'gcell';
        cell.style.cssText = 'height:95px;font-size:2.8rem;background:radial-gradient(circle,rgba(139,105,20,0.25),rgba(10,10,18,0.5));border:2px solid rgba(139,105,20,0.3);border-radius:50%;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;display:flex;align-items:center;justify-content:center';
        cell.textContent = '🕳️';
        cell.setAttribute('data-i', i);
        grid.appendChild(cell);
        cells.push(cell);
      }
      var sc = 0, timeLeft = timeTotal, active = -1;
      var self = this;

      function showCamel() {
        if (active >= 0) { cells[active].textContent = '🕳️'; cells[active].style.transform = ''; cells[active].style.boxShadow = ''; }
        active = Math.floor(Math.random() * 9);
        cells[active].textContent = '🐫';
        cells[active].style.transform = 'scale(1.15)';
        cells[active].style.boxShadow = '0 0 20px rgba(255,107,53,0.5)';
      }

      cells.forEach(function (cell, idx) {
        cell.onclick = function () {
          if (idx === active) {
            sc++; E.setScore(sc);
            div.querySelector('#wacScore').textContent = sc;
            cell.textContent = '💥';
            cell.style.transform = 'scale(0.85)';
            cell.style.boxShadow = '0 0 25px rgba(255,215,0,0.6)';
            cell.style.background = 'radial-gradient(circle,rgba(255,215,0,0.3),rgba(10,10,18,0.5))';
            setTimeout(function () {
              cell.textContent = '🕳️'; cell.style.transform = ''; cell.style.boxShadow = '';
              cell.style.background = 'radial-gradient(circle,rgba(139,105,20,0.25),rgba(10,10,18,0.5))';
            }, 250);
            active = -1;
            E.rashidSay(pick(['WHACK! 💥', 'Got it! 🎯', 'Nice hit!', 'Boom! 💪']));
          } else {
            cell.style.transform = 'scale(0.95)';
            setTimeout(function () { cell.style.transform = ''; }, 150);
          }
        };
      });

      showCamel();
      this._iv = setInterval(showCamel, popRate);

      this._tv = setInterval(function () {
        timeLeft--;
        div.querySelector('#wacTimer').textContent = timeLeft + 's';
        div.querySelector('#wacBar').style.width = (timeLeft / timeTotal * 100) + '%';
        if (timeLeft <= 5) div.querySelector('#wacBar').style.background = 'linear-gradient(90deg,#ff3232,#FF6B35)';
        if (timeLeft <= 0) {
          clearInterval(self._iv); clearInterval(self._tv);
          E.endGame(sc, timeTotal);
        }
      }, 1000);
      return {};
    },
    destroy: function () { if (this._iv) clearInterval(this._iv); if (this._tv) clearInterval(this._tv); }
  });

  /* ── 5. Brick Breaker ── */
  E.register({
    id: 'brick-breaker', name: 'Brick Breaker', emoji: '🧱', category: 'arcade', has2P: false,
    _running: false,
    init: function (container, mode, diff) {
      var CW = 400, CH = 500;
      var canvas = E.makeCanvas(CW, CH); container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var paddleW = diff === 'easy' ? 90 : diff === 'hard' ? 55 : 70;
      var ballSpd = diff === 'easy' ? 2.5 : diff === 'hard' ? 4 : 3;
      var paddle = { x: CW / 2, w: paddleW, h: 14 };
      var ball = { x: CW / 2, y: CH - 50, vx: ballSpd, vy: -ballSpd, r: 7 };
      var bricks = [], cols = 8, rows = diff === 'easy' ? 4 : diff === 'hard' ? 6 : 5, bw = CW / cols - 4, bh = 22;
      var colors = ['#FF6B35', '#FFD700', '#00C9A7', '#4ecdc4', '#ff6b6b', '#9b59b6'];
      var sc = 0, total = cols * rows, lives = diff === 'easy' ? 5 : diff === 'hard' ? 2 : 3;
      var trail = []; // ball trail
      var sparks = new Sparks();

      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++)
        bricks.push({ x: c * (bw + 4) + 2, y: r * (bh + 4) + 45, w: bw, h: bh, alive: true, color: colors[r % colors.length] });
      this._running = true; var self = this;

      E.loop(function () {
        if (!self._running) return;
        // trail
        trail.push({ x: ball.x, y: ball.y });
        if (trail.length > 8) trail.shift();

        ball.x += ball.vx; ball.y += ball.vy;
        if (ball.x < ball.r || ball.x > CW - ball.r) ball.vx *= -1;
        if (ball.y < ball.r) ball.vy *= -1;
        if (ball.y > CH) {
          lives--;
          if (lives <= 0) { self._running = false; E.endGame(sc, total); return; }
          ball.x = CW / 2; ball.y = CH - 50; ball.vy = -ballSpd; ball.vx = ballSpd; trail = [];
        }
        if (ball.y + ball.r > CH - 32 && ball.x > paddle.x - paddle.w / 2 && ball.x < paddle.x + paddle.w / 2 && ball.vy > 0) {
          ball.vy *= -1; ball.vx = (ball.x - paddle.x) / (paddle.w / 2) * 4;
          sparks.emit(ball.x, ball.y, '#FFD700', 4, 2);
        }
        for (var i = 0; i < bricks.length; i++) {
          var b = bricks[i]; if (!b.alive) continue;
          if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w && ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
            b.alive = false; ball.vy *= -1; sc++; E.setScore(sc);
            sparks.emit(b.x + b.w / 2, b.y + b.h / 2, b.color, 10, 4);
            if (sc === total) { self._running = false; E.endGame(sc, total); return; }
            break;
          }
        }

        // draw
        gradBg(ctx, CW, CH, '#0a0a1a', '#0d1b2a');

        // bricks with gradient and roundness
        bricks.forEach(function (b) {
          if (!b.alive) return;
          var bg = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
          bg.addColorStop(0, b.color); bg.addColorStop(1, 'rgba(0,0,0,0.3)');
          ctx.fillStyle = bg;
          rRect(ctx, b.x, b.y, b.w, b.h, 3); ctx.fill();
          // highlight
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(b.x + 2, b.y + 1, b.w - 4, b.h / 3);
        });

        // ball trail
        for (var t = 0; t < trail.length; t++) {
          var alpha = (t + 1) / trail.length * 0.3;
          ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
          ctx.beginPath(); ctx.arc(trail[t].x, trail[t].y, ball.r * (t / trail.length), 0, Math.PI * 2); ctx.fill();
        }

        // paddle with gradient
        glow(ctx, '#FFD700', 10);
        var pg = ctx.createLinearGradient(paddle.x - paddle.w / 2, 0, paddle.x + paddle.w / 2, 0);
        pg.addColorStop(0, '#CC9900'); pg.addColorStop(0.5, '#FFD700'); pg.addColorStop(1, '#CC9900');
        ctx.fillStyle = pg;
        rRect(ctx, paddle.x - paddle.w / 2, CH - 32, paddle.w, paddle.h, 4); ctx.fill();
        noGlow(ctx);

        // ball with glow
        glow(ctx, '#fff', 12);
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
        noGlow(ctx);

        sparks.tick(ctx);

        // HUD - lives
        ctx.fillStyle = '#fff'; ctx.font = '13px Inter'; ctx.textAlign = 'left';
        var hearts = '';
        for (var h = 0; h < (diff === 'easy' ? 5 : diff === 'hard' ? 2 : 3); h++) hearts += (h < lives) ? '❤️' : '🖤';
        ctx.fillText(hearts, 8, 20);
        // score
        glow(ctx, '#FFD700', 6);
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 14px Orbitron'; ctx.textAlign = 'right';
        ctx.fillText(sc + '/' + total, CW - 8, 20);
        noGlow(ctx);
      });

      this._moveHandler = function (e) {
        var rect = canvas.getBoundingClientRect();
        paddle.x = clamp((e.clientX - rect.left) / (rect.width / CW), paddle.w / 2, CW - paddle.w / 2);
      };
      this._touchHandler = function (e) {
        e.preventDefault(); var rect = canvas.getBoundingClientRect();
        paddle.x = clamp((e.touches[0].clientX - rect.left) / (rect.width / CW), paddle.w / 2, CW - paddle.w / 2);
      };
      canvas.addEventListener('mousemove', this._moveHandler);
      canvas.addEventListener('touchmove', this._touchHandler);
      return {};
    },
    destroy: function () { this._running = false; }
  });

  /* ── 6. Pearl Diver ── */
  E.register({
    id: 'pearl-diver', name: 'Pearl Diver', emoji: '🤿', category: 'arcade', has2P: false,
    _running: false,
    init: function (container, mode, diff) {
      var CW = 400, CH = 500;
      var canvas = E.makeCanvas(CW, CH); container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var diver = { x: CW / 2, y: 50 }, keys = {};
      var pearlCount = diff === 'easy' ? 8 : diff === 'hard' ? 15 : 12;
      var jellyCount = diff === 'easy' ? 3 : diff === 'hard' ? 10 : 6;
      var o2Drain = diff === 'easy' ? 0.03 : diff === 'hard' ? 0.08 : 0.05;
      var pearls = [], jellies = [], sc = 0, oxygen = 100;
      var bubbles = []; // ambient bubbles
      var sparks = new Sparks();

      for (var i = 0; i < pearlCount; i++) pearls.push({ x: 30 + Math.random() * (CW - 60), y: 80 + Math.random() * (CH - 130), collected: false, pulse: Math.random() * 6 });
      for (var j = 0; j < jellyCount; j++) jellies.push({ x: 30 + Math.random() * (CW - 60), y: 80 + Math.random() * (CH - 130), vx: (Math.random() - 0.5) * 2, bob: Math.random() * 6 });
      this._running = true; var self = this;

      this._keyHandler = function (e) { keys[e.key] = e.type === 'keydown'; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) > -1) e.preventDefault(); };
      document.addEventListener('keydown', this._keyHandler);
      document.addEventListener('keyup', this._keyHandler);

      E.loop(function () {
        if (!self._running) return;
        var spd = 3;
        if (keys.ArrowUp || keys.w) diver.y -= spd;
        if (keys.ArrowDown || keys.s) diver.y += spd;
        if (keys.ArrowLeft || keys.a) diver.x -= spd;
        if (keys.ArrowRight || keys.d) diver.x += spd;
        diver.x = clamp(diver.x, 15, CW - 15); diver.y = clamp(diver.y, 15, CH - 15);
        oxygen -= o2Drain;
        if (oxygen <= 0) { self._running = false; E.endGame(sc, pearls.length); return; }

        pearls.forEach(function (p) {
          if (p.collected) return;
          if (Math.abs(diver.x - p.x) < 20 && Math.abs(diver.y - p.y) < 20) {
            p.collected = true; sc++; E.setScore(sc);
            oxygen = Math.min(100, oxygen + 8);
            sparks.emit(p.x, p.y, '#FFD700', 10, 4);
            E.rashidSay(pick(['Pearl found! 🦪', 'Beautiful! ✨', 'Keep diving!']));
          }
        });
        if (sc === pearls.length) { self._running = false; E.endGame(sc, pearls.length); return; }

        jellies.forEach(function (jf) {
          jf.x += jf.vx; jf.bob += 0.04;
          if (jf.x < 10 || jf.x > CW - 10) jf.vx *= -1;
          if (Math.abs(diver.x - jf.x) < 18 && Math.abs(diver.y - jf.y) < 18) {
            oxygen -= 15;
            sparks.emit(jf.x, jf.y, '#ff4444', 6, 3);
            E.rashidSay('Ouch! Jellyfish! 😣'); jf.x = -50;
          }
        });

        // ambient bubbles
        if (Math.random() < 0.06) bubbles.push({ x: diver.x + (Math.random() - 0.5) * 10, y: diver.y - 5, r: 1 + Math.random() * 3, speed: 0.5 + Math.random() });
        for (var bi = bubbles.length - 1; bi >= 0; bi--) {
          bubbles[bi].y -= bubbles[bi].speed; bubbles[bi].x += Math.sin(bubbles[bi].y * 0.05) * 0.3;
          if (bubbles[bi].y < -5) bubbles.splice(bi, 1);
        }

        // draw ocean gradient
        gradBg(ctx, CW, CH, '#0a1a3a', '#05102a');
        // underwater light rays
        ctx.save(); ctx.globalAlpha = 0.03;
        for (var lr = 0; lr < 5; lr++) {
          ctx.fillStyle = '#4ecdc4';
          ctx.beginPath(); ctx.moveTo(50 + lr * 80, 0); ctx.lineTo(30 + lr * 80, CH); ctx.lineTo(70 + lr * 80, CH); ctx.fill();
        }
        ctx.restore();

        // bubbles
        bubbles.forEach(function (bu) {
          ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(bu.x, bu.y, bu.r, 0, Math.PI * 2); ctx.stroke();
        });

        // pearls with glow
        ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        pearls.forEach(function (p) {
          if (p.collected) return;
          p.pulse += 0.06;
          glow(ctx, '#FFD700', 10 + Math.sin(p.pulse) * 5);
          ctx.fillText('🦪', p.x, p.y);
          noGlow(ctx);
        });

        // jellies with bob
        jellies.forEach(function (jf) {
          var bobY = Math.sin(jf.bob) * 5;
          glow(ctx, '#ff6bff', 8);
          ctx.fillText('🪼', jf.x, jf.y + bobY);
          noGlow(ctx);
        });

        // diver
        glow(ctx, '#00C9A7', 10);
        ctx.fillText('🤿', diver.x, diver.y);
        noGlow(ctx);

        sparks.tick(ctx);

        // O2 bar
        timerBar(ctx, 15, 12, CW - 30, 12, oxygen / 100, oxygen > 30 ? '#00C9A7' : '#ff3232', oxygen > 30 ? '#4ecdc4' : '#ff6b6b');
        ctx.fillStyle = '#fff'; ctx.font = '10px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('O₂ ' + Math.round(oxygen) + '%', 18, 28);
        // score
        glow(ctx, '#FFD700', 5);
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 12px Orbitron'; ctx.textAlign = 'right';
        ctx.fillText('🦪 ' + sc + '/' + pearls.length, CW - 15, 28);
        noGlow(ctx);
      });
      return {};
    },
    destroy: function () { this._running = false; if (this._keyHandler) { document.removeEventListener('keydown', this._keyHandler); document.removeEventListener('keyup', this._keyHandler); } }
  });

  /* ── 7. Dune Jumper ── */
  E.register({
    id: 'dune-jumper', name: 'Dune Jumper', emoji: '🏜️', category: 'arcade', has2P: false,
    _running: false,
    init: function (container, mode, diff) {
      var CW = 500, CH = 300;
      var canvas = E.makeCanvas(CW, CH); container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var baseSpeed = diff === 'easy' ? 3 : diff === 'hard' ? 5.5 : 4;
      var accel = diff === 'easy' ? 0.08 : diff === 'hard' ? 0.25 : 0.15;
      var player = { x: 80, y: CH - 60, vy: 0, jumping: false }, ground = CH - 40;
      var obstacles = [], sc = 0, speed = baseSpeed, spawnTimer = 0;
      var dust = []; // ground dust particles
      var bestDist = 0;
      // background dunes (parallax)
      var dunes = [];
      for (var di = 0; di < 6; di++) dunes.push({ x: di * 100, h: 15 + Math.random() * 30 });
      this._running = true; var self = this;

      function jump() { if (!player.jumping) { player.vy = -10; player.jumping = true; } }

      E.loop(function () {
        if (!self._running) return;
        player.vy += 0.5; player.y += player.vy;
        if (player.y >= ground - 20) {
          player.y = ground - 20; player.vy = 0;
          if (player.jumping) { // landing dust
            for (var dp = 0; dp < 4; dp++) dust.push({ x: player.x + (Math.random() - 0.5) * 10, y: ground, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 2, life: 1 });
          }
          player.jumping = false;
        }
        spawnTimer++;
        if (spawnTimer > 60 + Math.random() * 40) {
          obstacles.push({ x: CW + 20, w: 20 + Math.random() * 15, h: 25 + Math.random() * 20 });
          spawnTimer = 0;
        }
        for (var i = obstacles.length - 1; i >= 0; i--) {
          obstacles[i].x -= speed;
          if (obstacles[i].x + obstacles[i].w < 0) {
            obstacles.splice(i, 1); sc++; E.setScore(sc);
            speed = baseSpeed + sc * accel;
            if (sc % 10 === 0) E.rashidSay(pick([sc + 'm! Keep running! 🏃', 'Amazing distance!', 'You can do it! 💪']));
            continue;
          }
          if (player.x + 12 > obstacles[i].x && player.x - 12 < obstacles[i].x + obstacles[i].w && player.y + 20 > ground - obstacles[i].h) {
            self._running = false; E.endGame(sc, sc || 1); return;
          }
        }

        // update dust
        for (var di2 = dust.length - 1; di2 >= 0; di2--) {
          var dd = dust[di2]; dd.x += dd.vx; dd.y += dd.vy; dd.life -= 0.04;
          if (dd.life <= 0) dust.splice(di2, 1);
        }

        // draw
        // sky gradient (desert dusk)
        gradBg(ctx, CW, CH, '#1a0533', '#c94b22');
        // sun
        glow(ctx, '#FFD700', 30);
        ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(CW - 60, 50, 25, 0, Math.PI * 2); ctx.fill();
        noGlow(ctx);

        // parallax dunes in background
        ctx.fillStyle = 'rgba(139,105,20,0.2)';
        dunes.forEach(function (du) {
          du.x -= speed * 0.3;
          if (du.x < -100) du.x = CW + 50;
          ctx.beginPath(); ctx.moveTo(du.x, ground); ctx.quadraticCurveTo(du.x + 50, ground - du.h, du.x + 100, ground); ctx.fill();
        });

        // ground with gradient
        var gg = ctx.createLinearGradient(0, ground, 0, CH);
        gg.addColorStop(0, '#C4935A'); gg.addColorStop(1, '#8B6914');
        ctx.fillStyle = gg; ctx.fillRect(0, ground, CW, CH - ground);
        // ground texture
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        for (var gt = 0; gt < CW; gt += 15) ctx.fillRect(gt, ground + 2, 6, 1);

        // obstacles with gradient
        obstacles.forEach(function (o) {
          var og = ctx.createLinearGradient(o.x, ground - o.h, o.x, ground);
          og.addColorStop(0, '#6B3410'); og.addColorStop(1, '#8B4513');
          ctx.fillStyle = og;
          rRect(ctx, o.x, ground - o.h, o.w, o.h, 3); ctx.fill();
          ctx.font = '16px serif'; ctx.textAlign = 'center';
          ctx.fillText('🌵', o.x + o.w / 2, ground - o.h - 6);
        });

        // dust particles
        dust.forEach(function (dd) {
          ctx.globalAlpha = dd.life * 0.5;
          ctx.fillStyle = '#C4935A';
          ctx.beginPath(); ctx.arc(dd.x, dd.y, 2, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;

        // player
        ctx.font = '26px serif'; ctx.textAlign = 'center';
        ctx.fillText('🏃', player.x, player.y + 14);

        // HUD
        glow(ctx, '#FFD700', 8);
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 18px Orbitron'; ctx.textAlign = 'right';
        ctx.fillText(sc + 'm', CW - 15, 28);
        noGlow(ctx);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px Inter';
        ctx.fillText('Speed: ' + speed.toFixed(1) + 'x', CW - 15, 46);
      });

      canvas.onclick = jump;
      canvas.ontouchstart = function (e) { e.preventDefault(); jump(); };
      this._keyHandler = function (e) { if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); jump(); } };
      document.addEventListener('keydown', this._keyHandler);
      return {};
    },
    destroy: function () { this._running = false; if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler); }
  });

  /* ── 8. Balloon Pop ── */
  E.register({
    id: 'balloon-pop', name: 'Balloon Pop', emoji: '🎈', category: 'arcade', has2P: false,
    _running: false, _tv: null,
    init: function (container, mode, diff) {
      var CW = 400, CH = 500;
      var canvas = E.makeCanvas(CW, CH); container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var timeTotal = diff === 'easy' ? 40 : diff === 'hard' ? 20 : 30;
      var riseSpeed = diff === 'easy' ? 1 : diff === 'hard' ? 2.5 : 1.5;
      var balloons = [], sc = 0, timeLeft = timeTotal;
      var bColors = ['#ff4444', '#FFD700', '#00C9A7', '#4488ff', '#9b59b6', '#FF6B35'];
      var sparks = new Sparks();
      this._running = true; var self = this;

      function spawn() {
        var col = pick(bColors);
        balloons.push({ x: 20 + Math.random() * (CW - 40), y: CH + 30, speed: riseSpeed + Math.random() * 2, color: col, r: 16 + Math.random() * 10, wobble: Math.random() * 6 });
      }
      for (var i = 0; i < 5; i++) { spawn(); balloons[i].y = 100 + Math.random() * 300; }

      E.loop(function () {
        if (!self._running) return;
        if (Math.random() < 0.035) spawn();
        balloons.forEach(function (b) {
          b.y -= b.speed; b.wobble += 0.04;
          b.x += Math.sin(b.wobble) * 0.5; // gentle wobble
        });
        balloons = balloons.filter(function (b) { return b.y > -50; });

        // sky gradient
        gradBg(ctx, CW, CH, '#0d1b3e', '#4a1a6b');
        stars(ctx, CW, CH, 40);

        // draw balloons as shapes
        balloons.forEach(function (b) {
          // string
          ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(b.x, b.y + b.r); ctx.lineTo(b.x + Math.sin(b.wobble) * 5, b.y + b.r + 25); ctx.stroke();
          // balloon body
          glow(ctx, b.color, 8);
          ctx.fillStyle = b.color;
          ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r * 0.8, b.r, 0, 0, Math.PI * 2); ctx.fill();
          // highlight
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          ctx.beginPath(); ctx.ellipse(b.x - b.r * 0.25, b.y - b.r * 0.3, b.r * 0.25, b.r * 0.35, -0.3, 0, Math.PI * 2); ctx.fill();
          noGlow(ctx);
          // knot
          ctx.fillStyle = b.color;
          ctx.beginPath(); ctx.moveTo(b.x - 3, b.y + b.r); ctx.lineTo(b.x + 3, b.y + b.r); ctx.lineTo(b.x, b.y + b.r + 5); ctx.fill();
        });

        sparks.tick(ctx);

        // HUD
        timerBar(ctx, 15, 12, CW - 30, 10, timeLeft / timeTotal, '#FF6B35', '#FFD700');
        glow(ctx, '#FFD700', 6);
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 20px Orbitron'; ctx.textAlign = 'center';
        ctx.fillText(sc, CW / 2, 45);
        noGlow(ctx);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px Inter';
        ctx.fillText(timeLeft + 's', CW / 2, 58);
      });

      function checkPop(cx, cy) {
        var rect = canvas.getBoundingClientRect();
        var mx = cx / (rect.width / CW), my = cy / (rect.height / CH);
        for (var i = balloons.length - 1; i >= 0; i--) {
          var b = balloons[i];
          var dx = mx - b.x, dy = my - b.y;
          if (dx * dx / (b.r * b.r * 0.64) + dy * dy / (b.r * b.r) < 1) {
            sparks.emit(b.x, b.y, b.color, 12, 5);
            balloons.splice(i, 1); sc++; E.setScore(sc); break;
          }
        }
      }
      canvas.onclick = function (e) { var r = canvas.getBoundingClientRect(); checkPop(e.clientX - r.left, e.clientY - r.top); };
      canvas.ontouchstart = function (e) { e.preventDefault(); var t = e.touches[0]; var r = canvas.getBoundingClientRect(); checkPop(t.clientX - r.left, t.clientY - r.top); };

      this._tv = setInterval(function () { timeLeft--; if (timeLeft <= 0) { self._running = false; clearInterval(self._tv); E.endGame(sc, sc || 1); } }, 1000);
      return {};
    },
    destroy: function () { this._running = false; if (this._tv) clearInterval(this._tv); }
  });

  /* ── 9. Space Falcon ── */
  E.register({
    id: 'space-falcon', name: 'Space Falcon', emoji: '🚀', category: 'arcade', has2P: false,
    _running: false,
    init: function (container, mode, diff) {
      var CW = 400, CH = 500;
      var canvas = E.makeCanvas(CW, CH); container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var spawnRate = diff === 'easy' ? 60 : diff === 'hard' ? 30 : 45;
      var alienSpd = diff === 'easy' ? 0.8 : diff === 'hard' ? 2 : 1;
      var ship = { x: CW / 2 }, bullets = [], aliens = [], sc = 0;
      var lives = diff === 'easy' ? 5 : diff === 'hard' ? 2 : 3;
      var spawnTimer = 0, exhaust = [];
      var sparks = new Sparks();
      this._running = true; var self = this;

      E.loop(function () {
        if (!self._running) return;
        spawnTimer++;
        if (spawnTimer > spawnRate) {
          aliens.push({ x: 20 + Math.random() * (CW - 40), y: -20, speed: alienSpd + Math.random() * 1.5, wobble: Math.random() * 6 });
          spawnTimer = 0;
        }
        // update bullets
        for (var b = bullets.length - 1; b >= 0; b--) {
          bullets[b].y -= 7;
          if (bullets[b].y < 0) { bullets.splice(b, 1); continue; }
          for (var a = aliens.length - 1; a >= 0; a--) {
            if (Math.abs(bullets[b].x - aliens[a].x) < 18 && Math.abs(bullets[b].y - aliens[a].y) < 18) {
              sparks.emit(aliens[a].x, aliens[a].y, '#FF6B35', 12, 5);
              aliens.splice(a, 1); bullets.splice(b, 1); sc++; E.setScore(sc);
              if (sc % 10 === 0) E.rashidSay(pick([sc + ' aliens! 🚀', 'Great shooting!', 'Space hero! ⭐']));
              break;
            }
          }
        }
        // update aliens
        for (var i = aliens.length - 1; i >= 0; i--) {
          aliens[i].y += aliens[i].speed; aliens[i].wobble += 0.03;
          aliens[i].x += Math.sin(aliens[i].wobble) * 0.5;
          if (aliens[i].y > CH) { aliens.splice(i, 1); lives--; if (lives <= 0) { self._running = false; E.endGame(sc, sc || 1); return; } }
          if (Math.abs(ship.x - aliens[i].x) < 20 && aliens[i].y > CH - 50) {
            sparks.emit(aliens[i].x, aliens[i].y, '#ff4444', 8, 4);
            aliens.splice(i, 1); lives--; if (lives <= 0) { self._running = false; E.endGame(sc, sc || 1); return; }
          }
        }
        // ship exhaust
        exhaust.push({ x: ship.x + (Math.random() - 0.5) * 8, y: CH - 18, vy: 1 + Math.random() * 2, life: 1, r: 2 + Math.random() * 2 });
        for (var ei = exhaust.length - 1; ei >= 0; ei--) {
          exhaust[ei].y += exhaust[ei].vy; exhaust[ei].life -= 0.05;
          if (exhaust[ei].life <= 0) exhaust.splice(ei, 1);
        }

        // draw
        gradBg(ctx, CW, CH, '#000011', '#0a0a2a');
        stars(ctx, CW, CH, 80);

        // exhaust particles
        exhaust.forEach(function (ex) {
          ctx.globalAlpha = ex.life * 0.6;
          var c = ex.life > 0.5 ? '#FFD700' : '#FF6B35';
          ctx.fillStyle = c;
          ctx.beginPath(); ctx.arc(ex.x, ex.y, ex.r * ex.life, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;

        // bullets with glow
        bullets.forEach(function (bu) {
          glow(ctx, '#FFD700', 10);
          ctx.fillStyle = '#FFD700';
          rRect(ctx, bu.x - 2, bu.y, 4, 14, 2); ctx.fill();
          noGlow(ctx);
        });

        // aliens with glow
        aliens.forEach(function (al) {
          glow(ctx, '#ff4444', 6);
          ctx.font = '24px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('👾', al.x, al.y);
          noGlow(ctx);
        });

        // ship
        glow(ctx, '#00C9A7', 12);
        ctx.font = '30px serif'; ctx.textAlign = 'center';
        ctx.fillText('🦅', ship.x, CH - 30);
        noGlow(ctx);

        sparks.tick(ctx);

        // HUD
        ctx.fillStyle = '#fff'; ctx.font = '13px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        var hearts = '';
        for (var h = 0; h < (diff === 'easy' ? 5 : diff === 'hard' ? 2 : 3); h++) hearts += (h < lives) ? '❤️' : '🖤';
        ctx.fillText(hearts, 8, 8);
        glow(ctx, '#FFD700', 6);
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 16px Orbitron'; ctx.textAlign = 'right';
        ctx.fillText(sc, CW - 12, 10);
        noGlow(ctx);
      });

      this._moveHandler = function (e) { var rect = canvas.getBoundingClientRect(); ship.x = clamp((e.clientX - rect.left) / (rect.width / CW), 20, CW - 20); };
      this._touchHandler = function (e) { e.preventDefault(); var rect = canvas.getBoundingClientRect(); ship.x = clamp((e.touches[0].clientX - rect.left) / (rect.width / CW), 20, CW - 20); };
      canvas.addEventListener('mousemove', this._moveHandler);
      canvas.addEventListener('touchmove', this._touchHandler);
      canvas.onclick = function () { bullets.push({ x: ship.x, y: CH - 50 }); };
      canvas.ontouchstart = function (e) { e.preventDefault(); bullets.push({ x: ship.x, y: CH - 50 }); };
      return {};
    },
    destroy: function () { this._running = false; }
  });

  /* ── 10. Gold Rush ── */
  E.register({
    id: 'gold-rush', name: 'Gold Rush', emoji: '💰', category: 'arcade', has2P: false,
    _running: false, _tv: null,
    init: function (container, mode, diff) {
      var CW = 400, CH = 500;
      var canvas = E.makeCanvas(CW, CH); container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var timeTotal = diff === 'easy' ? 60 : diff === 'hard' ? 30 : 45;
      var bombChance = diff === 'easy' ? 0.1 : diff === 'hard' ? 0.3 : 0.2;
      var collector = { x: CW / 2, w: diff === 'easy' ? 70 : diff === 'hard' ? 40 : 50 };
      var items = [], sc = 0, timeLeft = timeTotal;
      var sparks = new Sparks();
      var flash = 0; // screen flash on bomb
      this._running = true; var self = this;

      function spawn() {
        var isBomb = Math.random() < bombChance;
        items.push({ x: 20 + Math.random() * (CW - 40), y: -20, speed: 2 + Math.random() * 2, bomb: isBomb, emoji: isBomb ? '💣' : pick(['💰', '💎', '🪙']), rot: 0 });
      }

      E.loop(function () {
        if (!self._running) return;
        if (Math.random() < 0.04) spawn();
        for (var i = items.length - 1; i >= 0; i--) {
          items[i].y += items[i].speed; items[i].rot += 0.03;
          if (items[i].y > CH - 45 && Math.abs(items[i].x - collector.x) < collector.w / 2 + 12) {
            if (items[i].bomb) {
              sc = Math.max(0, sc - 5); E.setScore(sc);
              E.rashidSay('Boom! 💥 -5 points');
              sparks.emit(items[i].x, CH - 45, '#ff4444', 15, 5);
              flash = 8;
            } else {
              var pts = items[i].emoji === '💎' ? 3 : items[i].emoji === '💰' ? 2 : 1;
              sc += pts; E.setScore(sc);
              sparks.emit(items[i].x, CH - 45, '#FFD700', 8, 3);
            }
            items.splice(i, 1); continue;
          }
          if (items[i].y > CH) items.splice(i, 1);
        }

        // draw
        gradBg(ctx, CW, CH, '#1a0a00', '#0d1b2a');
        stars(ctx, CW, CH, 30);

        // items with rotation and glow
        items.forEach(function (it) {
          ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(Math.sin(it.rot) * 0.2);
          if (it.bomb) glow(ctx, '#ff4444', 8); else glow(ctx, '#FFD700', 8);
          ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(it.emoji, 0, 0);
          noGlow(ctx);
          ctx.restore();
        });

        // collector with gradient
        glow(ctx, '#FFD700', 12);
        var cg = ctx.createLinearGradient(collector.x - collector.w / 2, 0, collector.x + collector.w / 2, 0);
        cg.addColorStop(0, '#CC9900'); cg.addColorStop(0.5, '#FFD700'); cg.addColorStop(1, '#CC9900');
        ctx.fillStyle = cg;
        rRect(ctx, collector.x - collector.w / 2, CH - 40, collector.w, 22, 5); ctx.fill();
        noGlow(ctx);

        sparks.tick(ctx);

        // bomb flash overlay
        if (flash > 0) {
          ctx.fillStyle = 'rgba(255,50,50,' + (flash / 8 * 0.2) + ')';
          ctx.fillRect(0, 0, CW, CH); flash--;
        }

        // HUD
        timerBar(ctx, 15, 12, CW - 30, 10, timeLeft / timeTotal, '#FF6B35', '#FFD700');
        glow(ctx, '#FFD700', 6);
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 18px Orbitron'; ctx.textAlign = 'center';
        ctx.fillText(sc, CW / 2, 42);
        noGlow(ctx);
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '11px Inter';
        ctx.fillText(timeLeft + 's', CW / 2, 56);
      });

      this._moveHandler = function (e) { var r = canvas.getBoundingClientRect(); collector.x = clamp((e.clientX - r.left) / (r.width / CW), 25, CW - 25); };
      canvas.addEventListener('mousemove', this._moveHandler);
      canvas.addEventListener('touchmove', function (e) { e.preventDefault(); var r = canvas.getBoundingClientRect(); collector.x = clamp((e.touches[0].clientX - r.left) / (r.width / CW), 25, CW - 25); });
      this._tv = setInterval(function () { timeLeft--; if (timeLeft <= 0) { self._running = false; clearInterval(self._tv); E.endGame(sc, sc || 1); } }, 1000);
      return {};
    },
    destroy: function () { this._running = false; if (this._tv) clearInterval(this._tv); }
  });

  /* ── 11. Camel Race ── */
  E.register({
    id: 'camel-race', name: 'Camel Race', emoji: '🐪', category: 'arcade', has2P: true,
    _running: false,
    init: function (container, mode, diff) {
      var aiInterval = diff === 'easy' ? 400 : diff === 'hard' ? 200 : 300;
      var aiStep = diff === 'easy' ? 3 : diff === 'hard' ? 7 : 5;
      var div = document.createElement('div');
      div.className = 'gflex-col gw100';
      div.style.maxWidth = '520px';
      div.innerHTML =
        '<div style="text-align:center;margin-bottom:14px">' +
          '<div style="color:#FFD700;font:bold 20px Orbitron">🏁 CAMEL RACE 🏁</div>' +
          '<div style="color:rgba(255,255,255,0.5);font:12px Inter;margin-top:4px">Tap your button as fast as you can!</div>' +
        '</div>' +
        // Progress bars
        '<div style="margin-bottom:8px;background:rgba(255,255,255,0.05);border-radius:8px;padding:8px 12px">' +
          '<div style="display:flex;align-items:center;margin-bottom:6px"><span style="color:#FFD700;font:bold 12px Orbitron;width:30px">P1</span>' +
            '<div style="flex:1;height:14px;background:rgba(255,215,0,0.1);border-radius:7px;overflow:hidden;margin:0 8px">' +
              '<div id="bar1" style="height:100%;width:0%;background:linear-gradient(90deg,#FFD700,#FF6B35);border-radius:7px;transition:width 0.1s"></div>' +
            '</div><span style="font-size:1.4rem">🐪</span></div>' +
          '<div style="display:flex;align-items:center"><span style="color:#00C9A7;font:bold 12px Orbitron;width:30px">' + (mode === '2p' ? 'P2' : 'AI') + '</span>' +
            '<div style="flex:1;height:14px;background:rgba(0,201,167,0.1);border-radius:7px;overflow:hidden;margin:0 8px">' +
              '<div id="bar2" style="height:100%;width:0%;background:linear-gradient(90deg,#00C9A7,#4ecdc4);border-radius:7px;transition:width 0.1s"></div>' +
            '</div><span style="font-size:1.4rem">🐫</span></div>' +
        '</div>' +
        // Track
        '<div style="position:relative;width:100%;height:180px;background:linear-gradient(180deg,rgba(194,147,90,0.15),rgba(10,10,18,0.8));border-radius:14px;border:2px solid rgba(255,215,0,0.15);overflow:hidden;margin-bottom:10px" id="raceTrack">' +
          '<div style="position:absolute;left:0;right:0;top:50%;height:2px;background:rgba(255,255,255,0.05)"></div>' +
          '<div style="position:absolute;right:12px;top:0;bottom:0;width:4px;background:linear-gradient(180deg,#FFD700,#FF6B35);border-radius:2px"></div>' +
          '<div id="camel1" style="position:absolute;top:35px;left:10px;font-size:2.2rem;transition:left 0.1s;filter:drop-shadow(0 0 6px rgba(255,215,0,0.4))">🐪</div>' +
          '<div id="camel2" style="position:absolute;top:110px;left:10px;font-size:2.2rem;transition:left 0.1s;filter:drop-shadow(0 0 6px rgba(0,201,167,0.4))">🐫</div>' +
        '</div>' +
        // Buttons
        '<div style="display:flex;gap:10px">' +
          '<button class="gbtn gbtn-gold" id="raceBtn1" style="flex:1;padding:22px 10px;font:bold 16px Orbitron;border-radius:14px">🐪 TAP!</button>' +
          '<button class="gbtn gbtn-teal" id="raceBtn2" style="flex:1;padding:22px 10px;font:bold 16px Orbitron;border-radius:14px">' + (mode === '2p' ? '🐫 TAP!' : '🐫 Rashid') + '</button>' +
        '</div>';
      container.appendChild(div);

      var pos1 = 0, pos2 = 0, maxPos = 430, done = false;
      var camel1 = div.querySelector('#camel1'), camel2 = div.querySelector('#camel2');
      var bar1 = div.querySelector('#bar1'), bar2 = div.querySelector('#bar2');
      this._running = true; var self = this;

      function updateBars() {
        bar1.style.width = Math.min(pos1 / maxPos * 100, 100) + '%';
        bar2.style.width = Math.min(pos2 / maxPos * 100, 100) + '%';
      }

      div.querySelector('#raceBtn1').onclick = function () {
        if (done) return;
        pos1 += 8 + Math.random() * 5;
        camel1.style.left = Math.min(pos1, maxPos) + 'px'; updateBars();
        if (pos1 >= maxPos) { done = true; self._running = false; E.rashidSay('Player 1 wins! 🏆🐪'); E.endGame(1, 1); }
      };

      if (mode === '2p') {
        div.querySelector('#raceBtn2').onclick = function () {
          if (done) return;
          pos2 += 8 + Math.random() * 5;
          camel2.style.left = Math.min(pos2, maxPos) + 'px'; updateBars();
          if (pos2 >= maxPos) { done = true; self._running = false; E.rashidSay('Player 2 wins! 🏆🐫'); E.endGame(1, 1); }
        };
      } else {
        this._iv = setInterval(function () {
          if (done) return;
          pos2 += aiStep + Math.random() * 4;
          camel2.style.left = Math.min(pos2, maxPos) + 'px'; updateBars();
          if (pos2 >= maxPos) { done = true; self._running = false; clearInterval(self._iv); E.rashidSay('Rashid wins! 🐫💨'); E.endGame(0, 1); }
        }, aiInterval);
      }
      return {};
    },
    destroy: function () { this._running = false; if (this._iv) clearInterval(this._iv); }
  });

  /* ── 12. Sand Storm Dodge ── */
  E.register({
    id: 'sand-storm', name: 'Sand Storm Dodge', emoji: '⛈️', category: 'arcade', has2P: false,
    _running: false, _tv: null,
    init: function (container, mode, diff) {
      var CW = 400, CH = 400;
      var canvas = E.makeCanvas(CW, CH); container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var timeTotal = diff === 'easy' ? 30 : diff === 'hard' ? 60 : 45;
      var cloudFreq = diff === 'easy' ? 0.025 : diff === 'hard' ? 0.06 : 0.04;
      var cloudSpd = diff === 'easy' ? 1.5 : diff === 'hard' ? 3.5 : 2;
      var player = { x: CW / 2, y: CH / 2 }, keys = {}, clouds = [], timeLeft = timeTotal, sc = 0;
      var sandParticles = []; // ambient sand
      var trail = []; // player trail
      this._running = true; var self = this;

      function spawnCloud() {
        var fromLeft = Math.random() < 0.5;
        clouds.push({ x: fromLeft ? -30 : CW + 30, y: 30 + Math.random() * (CH - 60), vx: fromLeft ? (cloudSpd + Math.random() * 3) : -(cloudSpd + Math.random() * 3), r: 20 + Math.random() * 15, rot: Math.random() * 6 });
      }

      this._keyHandler = function (e) { keys[e.key] = e.type === 'keydown'; };
      document.addEventListener('keydown', this._keyHandler);
      document.addEventListener('keyup', this._keyHandler);

      E.loop(function () {
        if (!self._running) return;
        if (Math.random() < cloudFreq) spawnCloud();
        var spd = 3.5;
        if (keys.ArrowUp || keys.w) player.y -= spd;
        if (keys.ArrowDown || keys.s) player.y += spd;
        if (keys.ArrowLeft || keys.a) player.x -= spd;
        if (keys.ArrowRight || keys.d) player.x += spd;
        player.x = clamp(player.x, 15, CW - 15); player.y = clamp(player.y, 15, CH - 15);

        // player trail
        trail.push({ x: player.x, y: player.y, life: 1 });
        if (trail.length > 12) trail.shift();

        // ambient sand particles
        if (Math.random() < 0.2) sandParticles.push({ x: Math.random() * CW, y: -5, vx: (Math.random() - 0.3) * 2, vy: 1 + Math.random() * 2, life: 1 });
        for (var si = sandParticles.length - 1; si >= 0; si--) {
          var sp = sandParticles[si]; sp.x += sp.vx; sp.y += sp.vy; sp.life -= 0.01;
          if (sp.y > CH || sp.life <= 0) sandParticles.splice(si, 1);
        }

        for (var i = clouds.length - 1; i >= 0; i--) {
          clouds[i].x += clouds[i].vx; clouds[i].rot += 0.02;
          if (clouds[i].x < -50 || clouds[i].x > CW + 50) { clouds.splice(i, 1); continue; }
          if (Math.abs(player.x - clouds[i].x) < clouds[i].r * 0.8 && Math.abs(player.y - clouds[i].y) < clouds[i].r * 0.8) {
            self._running = false; E.endGame(sc, timeTotal); return;
          }
        }

        // draw
        gradBg(ctx, CW, CH, '#2a1a08', '#0d0a06');

        // ambient sand
        sandParticles.forEach(function (sp) {
          ctx.globalAlpha = sp.life * 0.3;
          ctx.fillStyle = '#C4935A';
          ctx.fillRect(sp.x, sp.y, 1.5, 1.5);
        });
        ctx.globalAlpha = 1;

        // ground
        var gg = ctx.createLinearGradient(0, CH - 20, 0, CH);
        gg.addColorStop(0, '#C4935A'); gg.addColorStop(1, '#8B6914');
        ctx.fillStyle = gg; ctx.fillRect(0, CH - 20, CW, 20);

        // player trail
        trail.forEach(function (t, idx) {
          var a = (idx + 1) / trail.length * 0.2;
          ctx.globalAlpha = a; ctx.font = '20px serif'; ctx.textAlign = 'center';
          ctx.fillText('🏃', t.x, t.y + 8);
        });
        ctx.globalAlpha = 1;

        // clouds with spinning and glow
        clouds.forEach(function (c) {
          ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot);
          glow(ctx, 'rgba(194,147,90,0.6)', 15);
          ctx.fillStyle = 'rgba(194,147,90,0.45)';
          ctx.beginPath(); ctx.arc(0, 0, c.r, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(c.r * 0.3, -c.r * 0.3, c.r * 0.6, 0, Math.PI * 2); ctx.fill();
          noGlow(ctx);
          ctx.font = (c.r * 0.8) + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('🌪️', 0, 0);
          ctx.restore();
        });

        // player
        glow(ctx, '#00C9A7', 10);
        ctx.font = '26px serif'; ctx.textAlign = 'center';
        ctx.fillText('🏃', player.x, player.y + 8);
        noGlow(ctx);

        // HUD
        timerBar(ctx, 15, 12, CW - 30, 10, timeLeft / timeTotal, '#00C9A7', '#4ecdc4');
        glow(ctx, '#FFD700', 6);
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 14px Orbitron'; ctx.textAlign = 'right';
        ctx.fillText('Survive: ' + timeLeft + 's', CW - 15, 38);
        noGlow(ctx);
      });

      this._tv = setInterval(function () {
        timeLeft--; sc = timeTotal - timeLeft;
        if (timeLeft <= 0) {
          self._running = false; clearInterval(self._tv);
          E.endGame(timeTotal, timeTotal);
          E.rashidSay('You survived! Amazing! 🏆');
        }
      }, 1000);
      return {};
    },
    destroy: function () { this._running = false; if (this._keyHandler) { document.removeEventListener('keydown', this._keyHandler); document.removeEventListener('keyup', this._keyHandler); } if (this._tv) clearInterval(this._tv); }
  });

})();
