/* Rashid Alive v2 — Random idle + sneaky explorer sequence */
(function(){
  var EMOJIS = ['🇦🇪','⭐','✨','💛','🦅','🐪','🌴','☕','🔥','💎','🎮','🏆','🌙','📖','🎉','💪'];
  var IDLE_ACTIONS = ['wave','dance','nod','spin','celebrate'];
  var container, bubbleBox, timer, emojiTimer;
  var sneakyDone = false;
  var sneakyRunning = false;

  function init(){
    container = document.getElementById('mascotContainer');
    bubbleBox = document.getElementById('mascotEmojiBubbles');
    if(!container) return;

    // Start random idle actions every 12-25 seconds
    scheduleIdle();
    // Start random emoji bubbles every 8-15 seconds
    scheduleEmoji();
    // Schedule the sneaky explorer sequence after 20-40 seconds
    setTimeout(startSneakySequence, 20000 + Math.random() * 20000);
  }

  function scheduleIdle(){
    var delay = 12000 + Math.random() * 13000;
    timer = setTimeout(function(){
      if(!sneakyRunning) doIdleAction();
      scheduleIdle();
    }, delay);
  }

  function scheduleEmoji(){
    var delay = 8000 + Math.random() * 7000;
    emojiTimer = setTimeout(function(){
      if(!sneakyRunning) spawnEmoji();
      scheduleEmoji();
    }, delay);
  }

  function doIdleAction(){
    if(!container) return;
    var cls = container.className;
    if(cls.indexOf('mascot-talk')!==-1 || cls.indexOf('mascot-celebrate')!==-1 || cls.indexOf('sneaky')!==-1) return;

    var action = IDLE_ACTIONS[Math.floor(Math.random()*IDLE_ACTIONS.length)];
    var dur = action==='dance'?1600:action==='spin'?900:action==='celebrate'?1600:1200;
    setSneakyState(action);
    setTimeout(function(){ if(!sneakyRunning) setSneakyState('idle'); }, dur);
  }

  function setSneakyState(s){
    if(!container) return;
    container.className = container.className
      .replace(/mascot-(idle|wave|celebrate|talk|think|sad|dance|spin|peek|nod|shake|sneaky-hide|sneaky-peek|sneaky-gone|sneaky-run|sneaky-runback|sneaky-settle)/g,'')
      .trim();
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

  function showSpeech(text, duration){
    if(!container) return;
    var old = container.querySelector('.rashid-speech-bubble');
    if(old) old.remove();
    var b = document.createElement('div');
    b.className = 'rashid-speech-bubble';
    b.textContent = text;
    container.appendChild(b);
    setTimeout(function(){
      b.classList.add('fade');
      setTimeout(function(){ b.remove(); }, 600);
    }, duration || 2500);
  }

  /* ===== THE SNEAKY SEQUENCE ===== */
  function startSneakySequence(){
    if(sneakyDone || sneakyRunning) return;
    // Don't interrupt if chat is open
    var panel = document.getElementById('rashidChatPanel');
    if(panel && panel.classList.contains('open')) {
      setTimeout(startSneakySequence, 30000);
      return;
    }
    sneakyRunning = true;

    // Step 1: Hide down (0s)
    setSneakyState('sneaky-hide');

    // Step 2: Peek up after 1.5s
    setTimeout(function(){
      setSneakyState('sneaky-peek');
      // Eyes look left then right automatically via CSS animation (3.5s total)
    }, 1500);

    // Step 3: Hide again after peeking (1.5 + 4 = 5.5s)
    setTimeout(function(){
      setSneakyState('sneaky-hide');
    }, 5500);

    // Step 4: Fully gone after hide animation (6.5s), wait ~60 seconds
    setTimeout(function(){
      setSneakyState('sneaky-gone');
    }, 6500);

    // Step 5: Run across screen after ~60 seconds (66.5s from start)
    setTimeout(function(){
      setSneakyState('sneaky-run');
    }, 66500);

    // Step 6: Run back after running across (66.5 + 3.2 = 69.7s)
    setTimeout(function(){
      setSneakyState('sneaky-runback');
    }, 69700);

    // Step 7: Settle at bottom (69.7 + 3.2 = 72.9s)
    setTimeout(function(){
      setSneakyState('sneaky-settle');
    }, 72900);

    // Step 8: Say "huh" (73.5s)
    setTimeout(function(){
      showSpeech('huh? 😳', 3000);
    }, 73500);

    // Step 9: Back to normal after speech (77s)
    setTimeout(function(){
      sneakyRunning = false;
      sneakyDone = true;
      setSneakyState('idle');
      // Restore glow etc by removing leftover classes
      container.className = container.className.replace(/sneaky-\w+/g,'').trim();
      if(!container.classList.contains('mascot-idle')) container.classList.add('mascot-idle');
    }, 77000);
  }

  // Init on DOM ready
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 1000);
  }
})();
