/* ============================================
   Learning Path — Node states + Badges grid
   ============================================ */

// Node unlock order — each node unlocks after the previous is complete
const PATH_ORDER = [
  'landmarks', 'traditions', 'food', 'arabic',
  'quiz', 'matching', 'fill-blank', 'scramble',
  'true-false', 'listening', 'timeline'
];

function updateLearningPath() {
  const completed = getCompletedNodes();

  // Find first incomplete node
  let firstLocked = PATH_ORDER.length;
  for (let i = 0; i < PATH_ORDER.length; i++) {
    if (!completed.includes(PATH_ORDER[i])) {
      firstLocked = i;
      break;
    }
  }

  // Update each node
  document.querySelectorAll('.path-node').forEach(node => {
    const id = node.dataset.node;
    const idx = PATH_ORDER.indexOf(id);
    const isDone = completed.includes(id);
    const isUnlocked = idx <= firstLocked; // current + all before are unlocked
    const isCurrent = idx === firstLocked;

    node.classList.remove('completed', 'locked', 'current');

    if (isDone) {
      node.classList.add('completed');
    } else if (isCurrent) {
      node.classList.add('current');
    } else if (!isUnlocked) {
      node.classList.add('locked');
      node.removeAttribute('href');
      node.style.pointerEvents = 'none';
    }
  });

  // Update finish trophy
  const finish = document.querySelector('.path-finish');
  if (finish && completed.length === PATH_ORDER.length) {
    finish.classList.add('unlocked');
  }
}

function renderBadges() {
  const grid = document.getElementById('badgesGrid');
  if (!grid) return;

  const earned = getEarnedAchievements();

  grid.innerHTML = ACHIEVEMENTS.map(ach => {
    const isEarned = earned.includes(ach.id);
    return `
      <div class="badge-card ${isEarned ? 'earned' : 'locked'}">
        <div class="badge-icon">${isEarned ? ach.emoji : '🔒'}</div>
        <div class="badge-name">${ach.name}</div>
        <div class="badge-desc">${ach.desc}</div>
      </div>
    `;
  }).join('');
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  updateLearningPath();
  renderBadges();

  // Set hero player name
  const heroName = document.getElementById('heroPlayerName');
  if (heroName) {
    const name = getPlayerName();
    heroName.textContent = name.toUpperCase();
  }
});
