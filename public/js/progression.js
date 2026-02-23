/* ============================================
   Progression Engine — Duolingo-style
   XP, Levels, Streaks, Hearts, Achievements
   ============================================ */

// ===== LEVEL DEFINITIONS =====
const LEVELS = [
  { name: 'Explorer',  minXP: 0,    emoji: '🧭' },
  { name: 'Learner',   minXP: 100,  emoji: '📘' },
  { name: 'Scholar',   minXP: 300,  emoji: '🎓' },
  { name: 'Expert',    minXP: 600,  emoji: '🏆' },
  { name: 'Champion',  minXP: 1000, emoji: '👑' },
  { name: 'Legend',    minXP: 1500, emoji: '🌟' },
];

// ===== ACHIEVEMENT DEFINITIONS =====
const ACHIEVEMENTS = [
  { id: 'first_lesson',   name: 'First Steps',    emoji: '👣', desc: 'Complete your first lesson' },
  { id: 'perfect_score',  name: 'Perfect Score',   emoji: '💯', desc: 'Get 100% on any quiz' },
  { id: 'streak_7',       name: 'Week Warrior',    emoji: '🔥', desc: '7-day streak' },
  { id: 'streak_30',      name: 'Monthly Legend',   emoji: '📅', desc: '30-day streak' },
  { id: 'all_sections',   name: 'UAE Expert',      emoji: '🇦🇪', desc: 'Complete all learning sections' },
  { id: 'xp_500',         name: 'XP Hunter',       emoji: '⚡', desc: 'Earn 500 XP' },
  { id: 'xp_1000',        name: 'XP Master',       emoji: '💎', desc: 'Earn 1000 XP' },
  { id: 'all_games',      name: 'Game Master',     emoji: '🎮', desc: 'Play all mini-games' },
  { id: 'speed_demon',    name: 'Speed Demon',     emoji: '⏱️', desc: 'Finish True/False under 60s' },
  { id: 'no_hearts_lost', name: 'Flawless',        emoji: '❤️', desc: 'Finish a quiz with all hearts' },
  { id: 'happy_rashid',   name: 'Happy Rashid',     emoji: '😄', desc: 'Make Rashid very happy!' },
];

// ===== XP SYSTEM =====
function getXP() {
  return parseInt(localStorage.getItem('uaequest_xp') || '0');
}

function getCurrentLevel() {
  const xp = getXP();
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) level = l;
  }
  return level;
}

function getNextLevel() {
  const xp = getXP();
  for (const l of LEVELS) {
    if (xp < l.minXP) return l;
  }
  return null; // max level
}

function getXPProgress() {
  const xp = getXP();
  const current = getCurrentLevel();
  const next = getNextLevel();
  if (!next) return { xp, level: current, nextLevel: null, percent: 100 };
  const progress = xp - current.minXP;
  const needed = next.minXP - current.minXP;
  return { xp, level: current, nextLevel: next, percent: Math.floor((progress / needed) * 100) };
}

function addXP(amount) {
  const oldLevel = getCurrentLevel();
  const xp = getXP() + amount;
  localStorage.setItem('uaequest_xp', xp.toString());
  const newLevel = getCurrentLevel();

  // Check level up
  if (newLevel.name !== oldLevel.name) {
    setTimeout(() => showLevelUpCelebration(newLevel), 500);
  }

  // Check XP achievements
  if (xp >= 500) awardAchievement('xp_500');
  if (xp >= 1000) awardAchievement('xp_1000');

  updateNavDisplay();
  return xp;
}

// ===== STREAK SYSTEM =====
function getStreak() {
  return JSON.parse(localStorage.getItem('uaequest_streak') || '{"count":0,"lastPlayedDate":null,"freezeAvailable":true}');
}

function updateStreak() {
  const streak = getStreak();
  const today = new Date().toISOString().split('T')[0];

  if (streak.lastPlayedDate === today) return streak; // already counted today

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (streak.lastPlayedDate === yesterday) {
    streak.count++;
  } else if (streak.lastPlayedDate && streak.freezeAvailable) {
    const dayBefore = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    if (streak.lastPlayedDate === dayBefore) {
      streak.count++;
      streak.freezeAvailable = false;
    } else {
      streak.count = 1;
      streak.freezeAvailable = true;
    }
  } else {
    streak.count = streak.lastPlayedDate ? 1 : 1;
    streak.freezeAvailable = true;
  }

  streak.lastPlayedDate = today;
  localStorage.setItem('uaequest_streak', JSON.stringify(streak));

  // Streak achievements
  if (streak.count >= 7) awardAchievement('streak_7');
  if (streak.count >= 30) awardAchievement('streak_30');

  updateNavDisplay();
  return streak;
}

// ===== HEARTS SYSTEM =====
function getHearts() {
  return JSON.parse(localStorage.getItem('uaequest_hearts') || '{"current":5,"max":5}');
}

function loseHeart() {
  const data = getHearts();
  data.current = Math.max(0, data.current - 1);
  localStorage.setItem('uaequest_hearts', JSON.stringify(data));
  updateHeartsDisplay();
  if (data.current === 0) {
    showOutOfHeartsModal();
  }
  return data.current;
}

function resetHearts() {
  localStorage.setItem('uaequest_hearts', JSON.stringify({ current: 5, max: 5 }));
  updateHeartsDisplay();
}

function hasHearts() {
  return getHearts().current > 0;
}

function updateHeartsDisplay() {
  const hearts = getHearts();
  // Update navbar hearts
  const navHearts = document.getElementById('heartsDisplay');
  if (navHearts) {
    navHearts.textContent = '❤️'.repeat(hearts.current) + '🖤'.repeat(5 - hearts.current);
  }
  // Update any quiz hearts
  document.querySelectorAll('.quiz-hearts').forEach(el => {
    el.textContent = '❤️'.repeat(hearts.current) + '🖤'.repeat(5 - hearts.current);
  });
}

function showOutOfHeartsModal() {
  const overlay = document.createElement('div');
  overlay.className = 'results-overlay';
  overlay.id = 'heartsModal';
  overlay.innerHTML = `
    <div class="results-card">
      <div style="font-size:3rem; margin-bottom:12px;">💔</div>
      <h2 style="font-family:'Orbitron',sans-serif; font-size:24px; margin-bottom:8px;">Out of Hearts!</h2>
      <p class="results-message">Go back and study to earn more hearts!</p>
      <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        <a href="/landmarks" class="btn btn-primary">Study More 📖</a>
        <a href="/" class="btn btn-outline">Home 🏠</a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ===== ACHIEVEMENTS =====
function getEarnedAchievements() {
  return JSON.parse(localStorage.getItem('uaequest_achievements') || '[]');
}

function awardAchievement(id) {
  const earned = getEarnedAchievements();
  if (earned.includes(id)) return false; // already earned

  earned.push(id);
  localStorage.setItem('uaequest_achievements', JSON.stringify(earned));

  // Find achievement info
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (ach) {
    showAchievementToast(ach);
  }
  return true;
}

function showAchievementToast(ach) {
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <div class="achievement-toast-icon">${ach.emoji}</div>
    <div class="achievement-toast-text">
      <strong>Badge Earned!</strong>
      <span>${ach.name}</span>
    </div>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);

  playSound('match');
}

function checkAchievements() {
  const completed = getCompletedNodes();
  const earned = getEarnedAchievements();

  if (completed.length >= 1 && !earned.includes('first_lesson')) awardAchievement('first_lesson');

  const learnSections = ['landmarks', 'traditions', 'food'];
  if (learnSections.every(s => completed.includes(s)) && !earned.includes('all_sections')) {
    awardAchievement('all_sections');
  }

  const allGames = ['quiz', 'matching', 'fill-blank', 'true-false', 'listening', 'scramble', 'timeline'];
  if (allGames.every(g => completed.includes(g)) && !earned.includes('all_games')) {
    awardAchievement('all_games');
  }
}

// ===== COMPLETION TRACKING =====
function getCompletedNodes() {
  return JSON.parse(localStorage.getItem('uaequest_completed') || '[]');
}

function markNodeComplete(nodeId) {
  const completed = getCompletedNodes();
  if (!completed.includes(nodeId)) {
    completed.push(nodeId);
    localStorage.setItem('uaequest_completed', JSON.stringify(completed));
  }
  checkAchievements();
}

function isNodeComplete(nodeId) {
  return getCompletedNodes().includes(nodeId);
}

// ===== NAV DISPLAY UPDATE =====
function updateNavDisplay() {
  // XP bar
  const progress = getXPProgress();
  const xpFill = document.getElementById('navXPFill');
  const xpText = document.getElementById('navXPText');
  const levelBadge = document.getElementById('navLevelBadge');

  if (xpFill) xpFill.style.width = progress.percent + '%';
  if (xpText) xpText.textContent = progress.xp + ' XP';
  if (levelBadge) levelBadge.textContent = progress.level.emoji + ' ' + progress.level.name;

  // Streak
  const streak = getStreak();
  const streakCount = document.getElementById('streakCount');
  if (streakCount) streakCount.textContent = streak.count;

  // Hearts
  updateHeartsDisplay();
}

// ===== LEVEL UP CELEBRATION =====
function showLevelUpCelebration(newLevel) {
  if (typeof launchConfetti === 'function') launchConfetti();
  if (typeof playSound === 'function') playSound('correct');

  const overlay = document.createElement('div');
  overlay.className = 'results-overlay';
  overlay.innerHTML = `
    <div class="results-card">
      <div style="font-size:4rem; margin-bottom:8px;">${newLevel.emoji}</div>
      <h2 style="font-family:'Orbitron',sans-serif; font-size:28px; background:linear-gradient(135deg,#FFD700,#FF6B35); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:8px;">LEVEL UP!</h2>
      <p style="font-size:20px; font-weight:700; margin-bottom:4px;">${newLevel.name}</p>
      <p class="results-message">You reached ${newLevel.minXP} XP!</p>
      <button class="btn btn-primary btn-lg" onclick="this.closest('.results-overlay').remove()">AWESOME!</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ===== INIT ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  updateStreak();
  updateNavDisplay();
});
