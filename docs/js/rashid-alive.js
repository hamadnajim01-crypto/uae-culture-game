/* Rashid Alive v3 — Random idle + sneaky explorer sequence + tab thoughts */
(function(){
  var EMOJIS = ['🇦🇪','⭐','✨','💛','🦅','🐪','🌴','☕','🔥','💎','🎮','🏆','🌙','📖','🎉','💪'];
  var IDLE_ACTIONS = ['wave','dance','nod','spin','celebrate'];
  var container, bubbleBox, timer, emojiTimer;
  var sneakyDone = false;
  var sneakyRunning = false;
  var originalTitle = '';

  function init(){
    container = document.getElementById('mascotContainer');
    bubbleBox = document.getElementById('mascotEmojiBubbles');
    if(!container) return;
    originalTitle = document.title;

    // Start random idle actions every 12-25 seconds
    scheduleIdle();
    // Start random emoji bubbles every 8-15 seconds
    scheduleEmoji();
    // Schedule the sneaky explorer sequence after 90-120 seconds (give user time to see Rashid first)
    setTimeout(startSneakySequence, 90000 + Math.random() * 30000);
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

  function setTabThought(text){
    document.title = text;
  }

  function restoreTab(){
    document.title = originalTitle;
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
    setTabThought('🤫 *hides quietly*');

    // Step 2: Peek up after 1.5s
    setTimeout(function(){
      setSneakyState('sneaky-peek');
      setTabThought('👀 anyone there...?');
    }, 1500);

    // Step 2b: Looking left
    setTimeout(function(){
      setTabThought('👈 hmm... no one on the left');
    }, 2800);

    // Step 2c: Looking right
    setTimeout(function(){
      setTabThought('👉 what about this side...');
    }, 4200);

    // Step 3: Hide again after peeking (5.5s)
    setTimeout(function(){
      setSneakyState('sneaky-hide');
      setTabThought('😏 coast is clear hehe');
    }, 5500);

    // Step 4: Fully gone (6.5s)
    setTimeout(function(){
      setSneakyState('sneaky-gone');
      setTabThought('🏃 time for an adventure!');
    }, 6500);

    // Thoughts while gone (~20s away instead of 60s)
    setTimeout(function(){ setTabThought('🚶 *sneaking away...*'); }, 9000);
    setTimeout(function(){ setTabThought('🌴 ooh a palm tree!'); }, 12000);
    setTimeout(function(){ setTabThought('🐪 hello mr camel!'); }, 15000);
    setTimeout(function(){ setTabThought('☕ mmm i smell karak chai...'); }, 18000);
    setTimeout(function(){ setTabThought('💎 is that a pearl?!'); }, 21000);
    setTimeout(function(){ setTabThought('😅 wait... where am i??'); }, 24000);

    // Step 5: Run across screen (26.5s)
    setTimeout(function(){
      setSneakyState('sneaky-run');
      setTabThought('🏃💨 GOTTA GO FAST!!');
    }, 26500);

    // Step 6: Run back (29.7s)
    setTimeout(function(){
      setSneakyState('sneaky-runback');
      setTabThought('🏃💨 WRONG WAY WRONG WAY!!');
    }, 29700);

    // Step 7: Settle at bottom (32.9s)
    setTimeout(function(){
      setSneakyState('sneaky-settle');
      setTabThought('😳 ...did anyone see that?');
    }, 32900);

    // Step 8: Say "huh" (33.5s)
    setTimeout(function(){
      showSpeech('huh? 😳', 3000);
      setTabThought('😳 huh? nothing happened...');
    }, 33500);

    // Step 9: Back to normal (37s)
    setTimeout(function(){
      sneakyRunning = false;
      sneakyDone = true;
      setSneakyState('idle');
      restoreTab();
      container.className = container.className.replace(/sneaky-\w+/g,'').trim();
      if(!container.classList.contains('mascot-idle')) container.classList.add('mascot-idle');
    }, 37000);
  }

  // Init on DOM ready
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 1000);
  }
})();
