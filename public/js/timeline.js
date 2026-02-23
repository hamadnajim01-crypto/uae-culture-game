/* ============================================
   Timeline Sort — Mini-Game
   Drag UAE historical events into chronological order
   ============================================ */

let timelineData = [];
let timelineAttempts = 0;
let timelineSolved = false;
let timelineStartHearts = 0;
let dragSrcEl = null;

async function startTimeline() {
  try {
    const res = await fetch('/api/timeline');
    timelineData = await res.json();
  } catch (e) {
    showNotification('Failed to load events!');
    return;
  }

  timelineAttempts = 0;
  timelineSolved = false;
  timelineStartHearts = getHearts().current;

  document.getElementById('timelineStart').style.display = 'none';
  document.getElementById('timelineArea').style.display = 'block';

  updateStreak();
  renderTimeline();
}

function renderTimeline() {
  const list = document.getElementById('timelineList');
  list.innerHTML = '';

  // Shuffle for display
  const shuffled = [...timelineData].sort(() => Math.random() - 0.5);

  shuffled.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.draggable = true;
    el.dataset.year = item.year;
    el.innerHTML = `
      <div class="timeline-grip">⠿</div>
      <div class="timeline-emoji">${item.emoji}</div>
      <div class="timeline-text">
        <div class="timeline-event">${item.event}</div>
      </div>
      <div class="timeline-year-badge">????</div>
    `;

    // Desktop drag events
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('dragenter', handleDragEnter);
    el.addEventListener('dragleave', handleDragLeave);
    el.addEventListener('drop', handleDrop);
    el.addEventListener('dragend', handleDragEnd);

    // Touch events for mobile
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    list.appendChild(el);
  });

  // Update hearts display
  const heartsEl = document.getElementById('timelineHearts');
  if (heartsEl) {
    const h = getHearts();
    heartsEl.textContent = '❤️'.repeat(h.current) + '🖤'.repeat(5 - h.current);
  }

  if (typeof Mascot !== 'undefined') Mascot.onThink();
}

// ===== DESKTOP DRAG & DROP =====
function handleDragStart(e) {
  if (timelineSolved) return;
  dragSrcEl = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
  e.preventDefault();
  if (this !== dragSrcEl) this.classList.add('drag-over');
}

function handleDragLeave() {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  if (dragSrcEl === this || !dragSrcEl) return;

  this.classList.remove('drag-over');
  const list = document.getElementById('timelineList');
  const items = Array.from(list.children);
  const srcIdx = items.indexOf(dragSrcEl);
  const tgtIdx = items.indexOf(this);

  if (srcIdx < tgtIdx) {
    list.insertBefore(dragSrcEl, this.nextSibling);
  } else {
    list.insertBefore(dragSrcEl, this);
  }

  playSound('flip');
}

function handleDragEnd() {
  this.classList.remove('dragging');
  document.querySelectorAll('.timeline-item').forEach(el => {
    el.classList.remove('drag-over');
  });
}

// ===== MOBILE TOUCH DRAG =====
let touchStartY = 0;
let touchEl = null;
let touchClone = null;

function handleTouchStart(e) {
  if (timelineSolved) return;
  touchEl = this;
  touchStartY = e.touches[0].clientY;
  this.classList.add('dragging');

  // Create floating clone
  touchClone = this.cloneNode(true);
  touchClone.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;opacity:0.8;width:' + this.offsetWidth + 'px;transform:scale(1.02);';
  touchClone.style.top = e.touches[0].clientY - 30 + 'px';
  touchClone.style.left = this.getBoundingClientRect().left + 'px';
  document.body.appendChild(touchClone);

  e.preventDefault();
}

function handleTouchMove(e) {
  if (!touchEl || !touchClone) return;
  e.preventDefault();

  const y = e.touches[0].clientY;
  touchClone.style.top = (y - 30) + 'px';

  // Find element under finger
  touchClone.style.display = 'none';
  const below = document.elementFromPoint(e.touches[0].clientX, y);
  touchClone.style.display = '';

  // Remove all drag-over
  document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('drag-over'));

  // Highlight the one under finger
  const target = below ? below.closest('.timeline-item') : null;
  if (target && target !== touchEl) {
    target.classList.add('drag-over');
  }
}

function handleTouchEnd(e) {
  if (!touchEl) return;

  // Remove clone
  if (touchClone) { touchClone.remove(); touchClone = null; }

  // Find target
  const y = e.changedTouches[0].clientY;
  const below = document.elementFromPoint(e.changedTouches[0].clientX, y);
  const target = below ? below.closest('.timeline-item') : null;

  if (target && target !== touchEl) {
    const list = document.getElementById('timelineList');
    const items = Array.from(list.children);
    const srcIdx = items.indexOf(touchEl);
    const tgtIdx = items.indexOf(target);

    if (srcIdx < tgtIdx) {
      list.insertBefore(touchEl, target.nextSibling);
    } else {
      list.insertBefore(touchEl, target);
    }
    playSound('flip');
  }

  touchEl.classList.remove('dragging');
  document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('drag-over'));
  touchEl = null;
}

// ===== CHECK ORDER =====
function checkTimeline() {
  if (timelineSolved) return;
  if (!hasHearts()) return;

  timelineAttempts++;
  document.getElementById('timelineAttempts').textContent = `ATTEMPTS: ${timelineAttempts}`;

  const items = document.querySelectorAll('.timeline-item');
  const currentOrder = Array.from(items).map(el => parseInt(el.dataset.year));
  const sortedOrder = [...currentOrder].sort((a, b) => a - b);

  let correctCount = 0;
  items.forEach((el, i) => {
    const year = parseInt(el.dataset.year);
    el.classList.remove('timeline-correct', 'timeline-wrong');
    if (year === sortedOrder[i]) {
      el.classList.add('timeline-correct');
      el.querySelector('.timeline-year-badge').textContent = year;
      correctCount++;
    } else {
      el.classList.add('timeline-wrong');
    }
  });

  // Update progress
  const percent = (correctCount / items.length) * 100;
  document.getElementById('timelineProgressFill').style.width = percent + '%';
  document.getElementById('timelineProgressText').textContent = `${correctCount}/${items.length} correct`;

  if (correctCount === items.length) {
    timelineSolved = true;
    playSound('correct');
    if (typeof Mascot !== 'undefined') Mascot.onCorrect();

    // Reveal all years
    items.forEach(el => {
      el.querySelector('.timeline-year-badge').textContent = el.dataset.year;
    });

    // Show a random fact
    showTimelineFact();
    setTimeout(() => finishTimeline(), 2000);
  } else {
    playSound('wrong');
    loseHeart();
    if (typeof Mascot !== 'undefined') Mascot.onWrong();

    // Update hearts
    const heartsEl = document.getElementById('timelineHearts');
    if (heartsEl) {
      const h = getHearts();
      heartsEl.textContent = '❤️'.repeat(h.current) + '🖤'.repeat(5 - h.current);
    }

    // Show a fact about one of the correct items
    showTimelineFact();
  }
}

function showTimelineFact() {
  const correctItems = document.querySelectorAll('.timeline-correct');
  if (correctItems.length === 0) return;

  const randomItem = correctItems[Math.floor(Math.random() * correctItems.length)];
  const year = parseInt(randomItem.dataset.year);
  const eventData = timelineData.find(d => d.year === year);

  if (eventData) {
    const factEl = document.getElementById('timelineFact');
    factEl.textContent = '💡 ' + eventData.fact;
    factEl.style.display = 'block';
  }
}

function finishTimeline() {
  // Score based on attempts: 1=3 stars, 2=2 stars, 3+=1 star
  const score = Math.max(1, 4 - timelineAttempts);
  addXP(50);
  if (timelineAttempts === 1) addXP(25);
  markNodeComplete('timeline');

  if (getHearts().current === timelineStartHearts) awardAchievement('no_hearts_lost');
  if (timelineAttempts === 1) awardAchievement('perfect_score');

  showResults('Timeline Sort Complete!', score, 3, 'timeline');
}
