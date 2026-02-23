/* ============================================
   What's New — Version changelog screen
   Shows modal on first visit after update
   ============================================ */

(function () {
  var CURRENT_VERSION = '5.1';
  var STORAGE_KEY = 'uaequest_last_version';

  var features = [
    { emoji: '👥', title: '22 Multiplayer Games!', desc: '11 new 2-player games added! Battleship, Trivia Blitz, Speed Math, Word Chain, Memory Chain, and more now support local 2P!' },
    { emoji: '🚢', title: 'Battleship 2P!', desc: 'Battleship now has full 2-player mode! Two ocean grids, take turns hunting each other\'s hidden landmarks!' },
    { emoji: '⚡', title: '2P Trivia Games', desc: 'Trivia Blitz, Speed Math, and Odd One Out now have split-screen 2-player buzzer modes — race to answer first!' },
    { emoji: '🔗', title: '2P Word Games', desc: 'Emoji Guess, Word Chain, and Arabic Numbers now support 2 players — compete head-to-head on word challenges!' },
    { emoji: '🎉', title: '2P Fun Games', desc: 'Memory Chain, Category Blast, Would You Rather, and Ingredient Match — play together with friends on the same screen!' },
    { emoji: '🏆', title: 'P1 vs P2 Scoring', desc: 'All 2P games have color-coded player indicators — P1 in teal, P2 in coral — with real-time score tracking!' },
    { emoji: '📊', title: 'Total: 22 2P Games', desc: 'From 11 to 22 multiplayer games! Challenge your friends across all 5 game categories!' }
  ];

  function show() {
    var overlay = document.createElement('div');
    overlay.className = 'results-overlay';
    overlay.id = 'whatsNewOverlay';
    overlay.style.zIndex = '10000';

    var card = document.createElement('div');
    card.className = 'results-card';
    card.style.maxWidth = '480px';
    card.style.maxHeight = '80vh';
    card.style.overflowY = 'auto';

    var title = document.createElement('h2');
    title.style.cssText = 'font-family:Orbitron,sans-serif; font-size:24px; background:linear-gradient(135deg,#FFD700,#FF6B35); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:6px;';
    title.textContent = "What's New in v" + CURRENT_VERSION;
    card.appendChild(title);

    var badge = document.createElement('div');
    badge.style.cssText = 'display:inline-block; background:linear-gradient(135deg,#FF6B35,#FFD700); color:#1a0a2e; font-size:11px; font-weight:700; padding:3px 10px; border-radius:12px; margin-bottom:14px; font-family:Orbitron,sans-serif;';
    badge.textContent = 'MULTIPLAYER UPDATE';
    card.appendChild(badge);

    var sub = document.createElement('p');
    sub.style.cssText = 'color:rgba(255,255,255,0.6); font-size:13px; margin-bottom:16px;';
    sub.textContent = '11 new 2-player games — now 22 multiplayer total!';
    card.appendChild(sub);

    for (var i = 0; i < features.length; i++) {
      var item = document.createElement('div');
      item.style.cssText = 'display:flex; align-items:flex-start; gap:10px; margin-bottom:12px; text-align:left;';
      var emojiSpan = document.createElement('span');
      emojiSpan.style.cssText = 'font-size:24px; flex-shrink:0; margin-top:2px;';
      emojiSpan.textContent = features[i].emoji;
      var textDiv = document.createElement('div');
      var titleSpan = document.createElement('strong');
      titleSpan.style.cssText = 'display:block; font-size:13px; color:#FFD700; margin-bottom:2px;';
      titleSpan.textContent = features[i].title;
      var descSpan = document.createElement('span');
      descSpan.style.cssText = 'font-size:12px; color:rgba(255,255,255,0.7); line-height:1.4;';
      descSpan.textContent = features[i].desc;
      textDiv.appendChild(titleSpan);
      textDiv.appendChild(descSpan);
      item.appendChild(emojiSpan);
      item.appendChild(textDiv);
      card.appendChild(item);
    }

    var btn = document.createElement('button');
    btn.className = 'btn btn-primary btn-lg';
    btn.style.cssText = 'margin-top:16px; width:100%;';
    btn.textContent = "Awesome! Let's Play!";
    btn.addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, CURRENT_VERSION);
      overlay.remove();
    });
    card.appendChild(btn);

    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lastVersion = localStorage.getItem(STORAGE_KEY);
    if (lastVersion !== CURRENT_VERSION) {
      setTimeout(show, 800);
    }
  });
})();
