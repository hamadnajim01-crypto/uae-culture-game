/* Rashid Alive v4 — Idle animations + chat-triggered sneaky sequences */
(function(){
  var EMOJIS = ['🇦🇪','⭐','✨','💛','🦅','🐪','🌴','☕','🔥','💎','🎮','🏆','🌙','📖','🎉','💪'];
  var IDLE_ACTIONS = ['wave','dance','nod','spin','celebrate'];
  var container, bubbleBox;
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
    // Hook into chat to listen for commands
    hookChat();
  }

  function scheduleIdle(){
    var delay = 12000 + Math.random() * 13000;
    setTimeout(function(){
      if(!sneakyRunning) doIdleAction();
      scheduleIdle();
    }, delay);
  }

  function scheduleEmoji(){
    var delay = 8000 + Math.random() * 7000;
    setTimeout(function(){
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

  function finishSequence(){
    sneakyRunning = false;
    setSneakyState('idle');
    restoreTab();
    container.className = container.className.replace(/sneaky-\w+/g,'').trim();
    if(!container.classList.contains('mascot-idle')) container.classList.add('mascot-idle');
  }

  /* ===== RUN SEQUENCE — triggered by chat ===== */
  function doRunSequence(){
    if(sneakyRunning) return;
    sneakyRunning = true;

    // Run across screen (0s)
    setSneakyState('sneaky-run');
    setTabThought('🏃💨 GOTTA GO FAST!!');

    // Run back (3.2s)
    setTimeout(function(){
      setSneakyState('sneaky-runback');
      setTabThought('🏃💨 WRONG WAY WRONG WAY!!');
    }, 3200);

    // Settle back (6.4s)
    setTimeout(function(){
      setSneakyState('sneaky-settle');
      setTabThought('😳 ...did anyone see that?');
    }, 6400);

    // Say "huh" (7s)
    setTimeout(function(){
      showSpeech('huh? 😳', 3000);
      setTabThought('😳 huh? nothing happened...');
    }, 7000);

    // Back to normal (10.5s)
    setTimeout(function(){
      finishSequence();
    }, 10500);
  }

  /* ===== PEEK SEQUENCE — triggered by chat ===== */
  function doPeekSequence(){
    if(sneakyRunning) return;
    sneakyRunning = true;

    // Hide down (0s)
    setSneakyState('sneaky-hide');
    setTabThought('🤫 *hides quietly*');

    // Peek up (1.5s)
    setTimeout(function(){
      setSneakyState('sneaky-peek');
      setTabThought('👀 anyone there...?');
    }, 1500);

    // Look left (2.8s)
    setTimeout(function(){
      setTabThought('👈 hmm... no one on the left');
    }, 2800);

    // Look right (4.2s)
    setTimeout(function(){
      setTabThought('👉 what about this side...');
    }, 4200);

    // Hide again (5.5s)
    setTimeout(function(){
      setSneakyState('sneaky-hide');
      setTabThought('😏 coast is clear hehe');
    }, 5500);

    // Come back up + say huh (6.5s)
    setTimeout(function(){
      setSneakyState('sneaky-settle');
      setTabThought('😳 ...wait what was i doing?');
    }, 6500);

    // Say "huh" (7s)
    setTimeout(function(){
      showSpeech('huh? 😳', 3000);
      setTabThought('😳 huh? nothing happened...');
    }, 7000);

    // Back to normal (10.5s)
    setTimeout(function(){
      finishSequence();
    }, 10500);
  }

  /* ===== CHAT COMMAND HOOK ===== */
  function hookChat(){
    var chatField = document.getElementById('rashidChatField');
    var chatSend = document.getElementById('rashidChatSend');
    if(!chatField) return;

    // Intercept Enter key and send button
    chatField.addEventListener('keydown', function(e){
      if(e.key === 'Enter') handleCommand(chatField);
    }, true);
    if(chatSend){
      chatSend.addEventListener('click', function(){
        handleCommand(chatField);
      }, true);
    }
  }

  function handleCommand(field){
    var text = field.value.trim().toLowerCase();
    if(!text) return;

    // Check for run command
    if(text === 'run' || text === 'run!' || text === 'go run' || text === 'rashid run'){
      setTimeout(function(){ doRunSequence(); }, 500);
      return;
    }

    // Check for peek/hide command
    if(text === 'peek' || text === 'hide' || text === 'look' || text === 'sneak' || text === 'rashid peek' || text === 'rashid hide'){
      setTimeout(function(){ doPeekSequence(); }, 500);
      return;
    }
  }

  // Init on DOM ready
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 1000);
  }
})();
