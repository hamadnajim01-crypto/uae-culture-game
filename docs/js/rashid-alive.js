/* Rashid Alive — Random idle animations, emoji bubbles, and personality */
(function(){
  var EMOJIS = ['🇦🇪','⭐','✨','💛','🦅','🐪','🌴','☕','🔥','💎','🎮','🏆','🌙','📖','🎉','💪'];
  var IDLE_ACTIONS = ['wave','dance','nod','peek','spin','celebrate'];
  var container, bubbleBox, timer, emojiTimer;

  function init(){
    container = document.getElementById('mascotContainer');
    bubbleBox = document.getElementById('mascotEmojiBubbles');
    if(!container) return;

    // Start random idle actions every 12-25 seconds
    scheduleIdle();
    // Start random emoji bubbles every 8-15 seconds
    scheduleEmoji();
  }

  function scheduleIdle(){
    var delay = 12000 + Math.random() * 13000;
    timer = setTimeout(function(){
      doIdleAction();
      scheduleIdle();
    }, delay);
  }

  function scheduleEmoji(){
    var delay = 8000 + Math.random() * 7000;
    emojiTimer = setTimeout(function(){
      spawnEmoji();
      scheduleEmoji();
    }, delay);
  }

  function doIdleAction(){
    if(!container) return;
    // Don't interrupt if chat is open or already in a non-idle state
    var cls = container.className;
    if(cls.indexOf('mascot-talk')!==-1 || cls.indexOf('mascot-celebrate')!==-1) return;

    var action = IDLE_ACTIONS[Math.floor(Math.random()*IDLE_ACTIONS.length)];
    var dur = action==='peek'?2200:action==='dance'?1600:action==='spin'?900:action==='celebrate'?1600:1200;

    // Set state
    setState(action);

    // Return to idle after animation
    setTimeout(function(){
      setState('idle');
    }, dur);
  }

  function setState(s){
    if(!container) return;
    container.className = container.className.replace(/mascot-(idle|wave|celebrate|talk|think|sad|dance|spin|peek|nod|shake)/g,'').trim();
    container.classList.add('mascot-'+s);
  }

  function spawnEmoji(){
    if(!bubbleBox) return;
    var em = document.createElement('span');
    em.className = 'mascot-emoji-bubble';
    em.textContent = EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
    em.style.left = (Math.random()*40-20)+'px';
    bubbleBox.appendChild(em);
    setTimeout(function(){ em.remove(); }, 2200);
  }

  // Init on DOM ready
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 1000); // slight delay to let mascot.js init first
  }
})();
