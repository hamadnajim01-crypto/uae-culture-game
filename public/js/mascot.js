/* ============================================
   Rashid — Emirati Mascot Controller v3
   Persistent chat panel, happiness system,
   expanded UAE knowledge, game hooks, hearts
   ============================================ */

const Mascot = (function () {
  // === PRIVATE STATE ===
  var currentState = 'idle';
  var currentContext = 'default';
  var heartInterval = null;
  var panelOpen = false;
  var happiness = 0;
  var greetingQueued = null;
  var hasGreeted = false;

  // === DIALOGUE KEYS (resolved via i18n t() function) ===
  var DIALOGUE = {
    splash_step1: 'mascotSplash1',
    splash_step2: 'mascotSplash2',
    splash_step3: 'mascotSplash3',
    splash_step4: 'mascotSplash4',
    hero_greeting: 'mascotHeroGreeting',
    quiz_correct: ['mascotCorrect1', 'mascotCorrect2', 'mascotCorrect3', 'mascotCorrect4', 'mascotCorrect5'],
    quiz_wrong: ['mascotWrong1', 'mascotWrong2', 'mascotWrong3', 'mascotWrong4', 'mascotWrong5'],
    results_great: 'mascotResultsGreat',
    results_good: 'mascotResultsGood',
    results_try: 'mascotResultsTry',
    thinking: 'mascotThinking',
    idle_tips: [
      'mascotTip1', 'mascotTip2', 'mascotTip3', 'mascotTip4', 'mascotTip5',
      'mascotTip6', 'mascotTip7', 'mascotTip8', 'mascotTip9', 'mascotTip10'
    ],
    greet_quiz: 'mascotGreetQuiz',
    greet_fill: 'mascotGreetFill',
    greet_tf: 'mascotGreetTF',
    greet_listen: 'mascotGreetListen',
    greet_scramble: 'mascotGreetScramble',
    greet_matching: 'mascotGreetMatching',
    greet_landmarks: 'mascotGreetLandmarks',
    greet_traditions: 'mascotGreetTraditions',
    greet_food: 'mascotGreetFood',
    greet_arabic: 'mascotGreetArabic',
    greet_timeline: 'mascotGreetTimeline',
    chat_hello: 'mascotChatHello',
    chat_name: 'mascotChatName',
    chat_help: 'mascotChatHelp',
    chat_uae: 'mascotChatUAE',
    chat_food: 'mascotChatFood',
    chat_landmarks: 'mascotChatLandmarks',
    chat_traditions: 'mascotChatTraditions',
    chat_arabic: 'mascotChatArabic',
    chat_games: 'mascotChatGames',
    chat_bye: 'mascotChatBye',
    chat_thanks: 'mascotChatThanks',
    chat_love: 'mascotChatLove',
    chat_who: 'mascotChatWho',
    chat_fallback: ['mascotChatFallback1', 'mascotChatFallback2', 'mascotChatFallback3'],
    chat_ask: 'mascotChatAsk',
    // Expanded knowledge
    chat_abudhabi: 'mascotChatAbuDhabi',
    chat_dubai: 'mascotChatDubai',
    chat_sharjah: 'mascotChatSharjah',
    chat_ajman: 'mascotChatAjman',
    chat_fujairah: 'mascotChatFujairah',
    chat_rak: 'mascotChatRAK',
    chat_uaq: 'mascotChatUAQ',
    chat_burjkhalifa: 'mascotChatBurjKhalifa',
    chat_mosque: 'mascotChatMosque',
    chat_flag: 'mascotChatFlag',
    chat_oil: 'mascotChatOil',
    chat_desert: 'mascotChatDesert',
    chat_dates: 'mascotChatDates',
    chat_nationalday: 'mascotChatNationalDay',
    chat_weather: 'mascotChatWeather',
    chat_school: 'mascotChatSchool',
    chat_animals: 'mascotChatAnimals',
    chat_space: 'mascotChatSpace',
    chat_currency: 'mascotChatCurrency',
    chat_sports: 'mascotChatSports'
  };

  // === EXPANDED CHAT KEYWORD MATCHING (32 categories) ===
  var CHAT_KEYWORDS = [
    { keys: ['hello', 'hi', 'hey', 'marhaba', 'hala', 'salam', 'السلام', 'مرحبا', 'هلا'], reply: 'chat_hello' },
    { keys: ['name', 'who are you', 'your name', 'اسمك', 'من انت'], reply: 'chat_who' },
    { keys: ['help', 'how', 'what do', 'مساعدة', 'كيف'], reply: 'chat_help' },
    { keys: ['food', 'eat', 'machboos', 'luqaimat', 'harees', 'طعام', 'أكل', 'مجبوس', 'لقيمات', 'هريس'], reply: 'chat_food' },
    { keys: ['tradition', 'falcon', 'pearl', 'camel', 'heritage', 'تراث', 'صقر', 'لؤلؤ', 'جمل'], reply: 'chat_traditions' },
    { keys: ['arabic', 'word', 'language', 'speak', 'عربي', 'كلمة', 'لغة'], reply: 'chat_arabic' },
    { keys: ['game', 'quiz', 'play', 'score', 'لعبة', 'اختبار', 'العب', 'نقاط'], reply: 'chat_games' },
    { keys: ['bye', 'goodbye', 'see you', 'مع السلامة', 'باي'], reply: 'chat_bye' },
    { keys: ['thank', 'thanks', 'شكر', 'شكراً'], reply: 'chat_thanks' },
    { keys: ['love', 'cute', 'like you', 'أحبك', 'حلو'], reply: 'chat_love' },
    // Expanded: each emirate
    { keys: ['abu dhabi', 'abudhabi', 'أبوظبي', 'أبو ظبي', 'capital'], reply: 'chat_abudhabi' },
    { keys: ['dubai', 'دبي'], reply: 'chat_dubai' },
    { keys: ['sharjah', 'الشارقة', 'شارقة'], reply: 'chat_sharjah' },
    { keys: ['ajman', 'عجمان'], reply: 'chat_ajman' },
    { keys: ['fujairah', 'الفجيرة', 'فجيرة'], reply: 'chat_fujairah' },
    { keys: ['ras al khaimah', 'rak', 'رأس الخيمة'], reply: 'chat_rak' },
    { keys: ['umm al quwain', 'uaq', 'أم القيوين'], reply: 'chat_uaq' },
    // Expanded: specific topics
    { keys: ['burj khalifa', 'burj', 'khalifa', 'tallest', 'برج خليفة'], reply: 'chat_burjkhalifa' },
    { keys: ['mosque', 'zayed mosque', 'grand mosque', 'مسجد', 'مسجد زايد'], reply: 'chat_mosque' },
    { keys: ['flag', 'colors', 'علم', 'ألوان العلم'], reply: 'chat_flag' },
    { keys: ['oil', 'petroleum', 'نفط', 'بترول'], reply: 'chat_oil' },
    { keys: ['desert', 'sand', 'صحراء', 'رمل', 'الربع الخالي'], reply: 'chat_desert' },
    { keys: ['date', 'dates', 'تمر', 'تمور'], reply: 'chat_dates' },
    { keys: ['national day', 'december 2', 'اليوم الوطني', '2 ديسمبر'], reply: 'chat_nationalday' },
    { keys: ['weather', 'hot', 'temperature', 'طقس', 'حار', 'حرارة'], reply: 'chat_weather' },
    { keys: ['school', 'education', 'study', 'مدرسة', 'تعليم', 'دراسة'], reply: 'chat_school' },
    { keys: ['animal', 'oryx', 'dolphin', 'turtle', 'حيوان', 'مها', 'دلفين'], reply: 'chat_animals' },
    { keys: ['space', 'mars', 'hope probe', 'فضاء', 'المريخ', 'مسبار الأمل'], reply: 'chat_space' },
    { keys: ['currency', 'dirham', 'money', 'عملة', 'درهم', 'فلوس'], reply: 'chat_currency' },
    { keys: ['sport', 'football', 'cricket', 'racing', 'رياضة', 'كرة', 'سباق'], reply: 'chat_sports' },
    // General UAE last (lower priority than specific emirates)
    { keys: ['uae', 'emirates', 'الإمارات', 'إمارات'], reply: 'chat_uae' },
    { keys: ['landmark', 'museum', 'معالم', 'متحف'], reply: 'chat_landmarks' }
  ];

  // === DOM REFS ===
  var containerEl, characterEl, heartsEl;
  var chatPanel, chatMessages, chatField, chatSendBtn, chatCloseBtn;
  var gamesMenuBtn, gamesMenu, gamesMenuGrid, gamesMenuBack;
  var gamesFloatingBtn;
  var happinessFill, happinessLabel;

  // === INIT ===
  function init() {
    containerEl = document.getElementById('mascotContainer');
    characterEl = document.getElementById('mascotCharacter');
    heartsEl = document.getElementById('mascotHearts');

    // Chat panel refs
    chatPanel = document.getElementById('rashidChatPanel');
    chatMessages = document.getElementById('rashidChatMessages');
    chatField = document.getElementById('rashidChatField');
    chatSendBtn = document.getElementById('rashidChatSend');
    chatCloseBtn = document.getElementById('rashidChatClose');

    // Games menu refs
    gamesMenuBtn = document.getElementById('rashidGamesMenuBtn');
    gamesMenu = document.getElementById('rashidGamesMenu');
    gamesMenuGrid = document.getElementById('rashidGamesMenuGrid');
    gamesMenuBack = document.getElementById('rashidGamesMenuBack');

    // Happiness refs
    happinessFill = document.getElementById('rashidHappinessFill');
    happinessLabel = document.getElementById('rashidHappinessLabel');

    if (!containerEl) return;

    currentContext = detectContext();
    loadHappiness();

    // Arabic placeholder
    if (chatField && typeof getLang === 'function' && getLang() === 'ar') {
      chatField.placeholder = 'اسألني أي شيء...';
    }

    // Chat panel events
    if (chatCloseBtn) {
      chatCloseBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeChat();
      });
    }

    if (chatSendBtn) {
      chatSendBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        handleChatSend();
      });
    }

    if (chatField) {
      chatField.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.key === 'Enter') handleChatSend();
      });
      chatField.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    // Games menu events
    if (gamesMenuBtn) {
      gamesMenuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleGamesMenu();
      });
    }
    if (gamesMenuBack) {
      gamesMenuBack.addEventListener('click', function (e) {
        e.stopPropagation();
        hideGamesMenu();
      });
    }

    // Floating games button
    gamesFloatingBtn = document.getElementById('rashidGamesFloatingBtn');
    if (gamesFloatingBtn) {
      gamesFloatingBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openChatWithGames();
      });
    }

    // Stop click propagation inside chat panel
    if (chatPanel) {
      chatPanel.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    // Click Rashid = toggle chat
    containerEl.addEventListener('click', onMascotClick);

    // Floating hearts on hover
    containerEl.addEventListener('mouseenter', startHearts);
    containerEl.addEventListener('mouseleave', stopHearts);

    setState('idle');

    // Render games menu if ChatGames available
    if (typeof ChatGames !== 'undefined' && gamesMenuGrid) {
      ChatGames.renderMenu(gamesMenuGrid);
    }

    // Queue page greeting
    queuePageGreeting();
  }

  function detectContext() {
    var path = window.location.pathname;
    if (path === '/' || path === '') {
      var splash = document.getElementById('splashOverlay');
      if (splash && splash.style.display !== 'none') return 'splash';
      return 'hero';
    }
    if (path.indexOf('quiz') !== -1) return 'quiz';
    if (path.indexOf('matching') !== -1) return 'matching';
    if (path.indexOf('fill-blank') !== -1) return 'fill-blank';
    if (path.indexOf('true-false') !== -1) return 'true-false';
    if (path.indexOf('listening') !== -1) return 'listening';
    if (path.indexOf('scramble') !== -1) return 'scramble';
    if (path.indexOf('timeline') !== -1) return 'timeline';
    if (path.indexOf('landmarks') !== -1 || path.indexOf('traditions') !== -1 ||
        path.indexOf('food') !== -1 || path.indexOf('arabic') !== -1) return 'learn';
    return 'default';
  }

  // === STATE MANAGEMENT ===
  function setState(state) {
    if (!containerEl) return;
    containerEl.className = containerEl.className
      .replace(/mascot-(idle|wave|celebrate|talk|think|sad)/g, '')
      .trim();
    currentState = state;
    containerEl.classList.add('mascot-' + state);
  }

  // === CHAT PANEL OPEN/CLOSE ===
  function openChat() {
    if (!chatPanel) return;
    panelOpen = true;
    chatPanel.classList.add('open');
    setState('wave');
    setTimeout(function () { setState('idle'); }, 1500);

    // Show queued greeting if first open
    if (!hasGreeted && greetingQueued) {
      addBotMessage(greetingQueued);
      hasGreeted = true;
    } else if (!hasGreeted) {
      addBotMessage(resolveText(DIALOGUE.chat_ask));
      hasGreeted = true;
    }

    if (chatField) {
      setTimeout(function () { chatField.focus(); }, 300);
    }
  }

  function closeChat() {
    if (!chatPanel) return;
    panelOpen = false;
    chatPanel.classList.remove('open');
    hideGamesMenu();
  }

  function toggleChat() {
    if (panelOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  function openChatWithGames() {
    if (!panelOpen) openChat();
    setTimeout(showGamesMenu, 150);
  }

  // === MESSAGE SYSTEM ===
  function addBotMessage(text) {
    if (!chatMessages) return;
    var div = document.createElement('div');
    div.className = 'rashid-msg rashid-msg-bot';
    div.textContent = text;
    chatMessages.appendChild(div);
    scrollToBottom();

    // Talk animation briefly
    setState('talk');
    setTimeout(function () { setState('idle'); }, 800);
  }

  function addUserMessage(text) {
    if (!chatMessages) return;
    var div = document.createElement('div');
    div.className = 'rashid-msg rashid-msg-user';
    div.textContent = text;
    chatMessages.appendChild(div);
    scrollToBottom();
  }

  function addSystemMessage(text) {
    if (!chatMessages) return;
    var div = document.createElement('div');
    div.className = 'rashid-msg rashid-msg-system';
    div.textContent = text;
    chatMessages.appendChild(div);
    scrollToBottom();
  }

  function addGameGrid(html) {
    if (!chatMessages) return;
    var div = document.createElement('div');
    div.className = 'rashid-msg rashid-msg-bot';
    var grid = document.createElement('div');
    grid.className = 'rashid-game-grid';
    grid.innerHTML = html;
    div.appendChild(grid);
    chatMessages.appendChild(div);
    scrollToBottom();
  }

  function scrollToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // === TEXT RESOLUTION ===
  function resolveText(dialogueKey) {
    var key = dialogueKey;
    if (Array.isArray(dialogueKey)) {
      key = dialogueKey[Math.floor(Math.random() * dialogueKey.length)];
    }
    return (typeof t === 'function') ? t(key) : key;
  }

  // === PAGE GREETING ===
  function queuePageGreeting() {
    var pageGreetings = {
      'quiz': DIALOGUE.greet_quiz,
      'fill-blank': DIALOGUE.greet_fill,
      'true-false': DIALOGUE.greet_tf,
      'listening': DIALOGUE.greet_listen,
      'scramble': DIALOGUE.greet_scramble,
      'matching': DIALOGUE.greet_matching,
      'timeline': DIALOGUE.greet_timeline
    };

    var path = window.location.pathname;

    if (currentContext === 'hero') {
      greetingQueued = resolveText(DIALOGUE.hero_greeting);
      // Auto wave on hero
      setTimeout(function () {
        setState('wave');
        setTimeout(function () { setState('idle'); }, 2500);
      }, 1500);
    } else if (pageGreetings[currentContext]) {
      greetingQueued = resolveText(pageGreetings[currentContext]);
      // Auto wave on game pages
      setTimeout(function () {
        setState('wave');
        setTimeout(function () { setState('idle'); }, 2500);
      }, 1500);
    } else if (path.indexOf('landmarks') !== -1) {
      greetingQueued = resolveText(DIALOGUE.greet_landmarks);
    } else if (path.indexOf('traditions') !== -1) {
      greetingQueued = resolveText(DIALOGUE.greet_traditions);
    } else if (path.indexOf('food') !== -1) {
      greetingQueued = resolveText(DIALOGUE.greet_food);
    } else if (path.indexOf('arabic') !== -1) {
      greetingQueued = resolveText(DIALOGUE.greet_arabic);
    }
  }

  // === CHAT SEND ===
  function handleChatSend() {
    if (!chatField) return;
    var msg = chatField.value.trim();
    if (!msg) return;
    chatField.value = '';

    addUserMessage(msg);
    addHappiness(1); // +1 for chatting

    // Check if a game is active (ChatGames integration)
    if (typeof ChatGames !== 'undefined' && ChatGames.isGameActive()) {
      ChatGames.handleInput(msg);
      return;
    }

    // Check for quit/stop commands
    var lower = msg.toLowerCase();
    if (lower === 'quit' || lower === 'stop' || lower === 'exit') {
      if (typeof ChatGames !== 'undefined' && ChatGames.isGameActive()) {
        ChatGames.cancelGame();
      } else {
        addBotMessage(resolveText(DIALOGUE.chat_bye));
      }
      return;
    }

    // Match keywords
    var replyKey = matchChatKeywords(msg);
    var replyText = resolveText(replyKey);
    addBotMessage(replyText);

    // Focus back on input
    setTimeout(function () {
      if (chatField) chatField.focus();
    }, 100);
  }

  function matchChatKeywords(msg) {
    var lower = msg.toLowerCase();
    for (var i = 0; i < CHAT_KEYWORDS.length; i++) {
      var entry = CHAT_KEYWORDS[i];
      for (var j = 0; j < entry.keys.length; j++) {
        if (lower.indexOf(entry.keys[j]) !== -1) {
          var dialogueEntry = DIALOGUE[entry.reply];
          return dialogueEntry;
        }
      }
    }
    // Fun fact fallback (30% chance) or standard fallback
    if (Math.random() < 0.3) {
      return DIALOGUE.idle_tips[Math.floor(Math.random() * DIALOGUE.idle_tips.length)];
    }
    return DIALOGUE.chat_fallback;
  }

  // === GAMES MENU ===
  function toggleGamesMenu() {
    if (!gamesMenu) return;
    if (gamesMenu.style.display === 'none' || !gamesMenu.style.display) {
      showGamesMenu();
    } else {
      hideGamesMenu();
    }
  }

  function showGamesMenu() {
    if (!gamesMenu) return;
    gamesMenu.style.display = 'flex';
    // Re-render if ChatGames loaded
    if (typeof ChatGames !== 'undefined' && gamesMenuGrid) {
      ChatGames.renderMenu(gamesMenuGrid);
    }
  }

  function hideGamesMenu() {
    if (gamesMenu) gamesMenu.style.display = 'none';
  }

  // === HAPPINESS SYSTEM ===
  function loadHappiness() {
    happiness = parseInt(localStorage.getItem('uaequest_rashid_happiness') || '0');
    updateHappinessBar();
  }

  function saveHappiness() {
    localStorage.setItem('uaequest_rashid_happiness', happiness.toString());
  }

  function addHappiness(amount) {
    happiness = Math.min(100, happiness + amount);
    saveHappiness();
    updateHappinessBar();

    // Award badge at 50
    if (happiness >= 50 && typeof awardAchievement === 'function') {
      awardAchievement('happy_rashid');
    }
  }

  function getHappiness() {
    return happiness;
  }

  function updateHappinessBar() {
    if (happinessFill) {
      happinessFill.style.width = happiness + '%';
    }
    if (happinessLabel) {
      if (happiness >= 75) happinessLabel.textContent = '🥰';
      else if (happiness >= 50) happinessLabel.textContent = '😄';
      else if (happiness >= 25) happinessLabel.textContent = '😊';
      else happinessLabel.textContent = '🙂';
    }
  }

  // === FLOATING HEARTS ===
  function spawnHeart() {
    if (!heartsEl) return;
    var heart = document.createElement('span');
    heart.className = 'mascot-heart';
    heart.textContent = ['❤️', '💛', '✨', '⭐'][Math.floor(Math.random() * 4)];
    heart.style.left = (Math.random() * 40 - 20) + 'px';
    heartsEl.appendChild(heart);
    setTimeout(function () { heart.remove(); }, 1200);
  }

  function startHearts() {
    spawnHeart();
    heartInterval = setInterval(spawnHeart, 400);
  }

  function stopHearts() {
    if (heartInterval) {
      clearInterval(heartInterval);
      heartInterval = null;
    }
  }

  // === GAME HOOKS ===
  function onCorrect() {
    setState('celebrate');
    if (panelOpen) {
      addBotMessage(resolveText(DIALOGUE.quiz_correct));
    }
    addHappiness(2);
    setTimeout(function () { setState('idle'); }, 2500);
  }

  function onWrong() {
    setState('sad');
    if (panelOpen) {
      addBotMessage(resolveText(DIALOGUE.quiz_wrong));
    }
    setTimeout(function () { setState('idle'); }, 3000);
  }

  function onThink() {
    setState('think');
  }

  function onResults(stars) {
    if (stars >= 3) {
      setState('celebrate');
      if (panelOpen) addBotMessage(resolveText(DIALOGUE.results_great));
    } else if (stars >= 2) {
      setState('celebrate');
      if (panelOpen) addBotMessage(resolveText(DIALOGUE.results_good));
    } else {
      setState('sad');
      if (panelOpen) addBotMessage(resolveText(DIALOGUE.results_try));
    }
    addHappiness(1);
  }

  // === SPLASH HOOKS ===
  function onSplashStep(step) {
    var config = {
      1: { key: DIALOGUE.splash_step1, state: 'wave' },
      2: { key: DIALOGUE.splash_step2, state: 'idle' },
      3: { key: DIALOGUE.splash_step3, state: 'celebrate' },
      4: { key: DIALOGUE.splash_step4, state: 'think' }
    };

    var c = config[step];
    if (c) {
      setState(c.state);
      // Don't use old speech bubble — instead queue for chat if needed
      if (c.state !== 'idle' && c.state !== 'think') {
        setTimeout(function () { setState('idle'); }, 2500);
      }
    }
  }

  // === CLICK HANDLER ===
  function onMascotClick() {
    toggleChat();
  }

  // === VISIBILITY ===
  function show() {
    if (containerEl) containerEl.classList.remove('mascot-hidden');
  }

  function hide() {
    if (containerEl) containerEl.classList.add('mascot-hidden');
  }

  function setSize(size) {
    if (!containerEl) return;
    containerEl.classList.remove('mascot-large');
    if (size === 'large') containerEl.classList.add('mascot-large');
  }

  // === INIT ON DOM READY ===
  document.addEventListener('DOMContentLoaded', init);

  // === PUBLIC API ===
  return {
    init: init,
    setState: setState,
    openChat: openChat,
    closeChat: closeChat,
    toggleChat: toggleChat,
    openChatWithGames: openChatWithGames,
    addBotMessage: addBotMessage,
    addUserMessage: addUserMessage,
    addSystemMessage: addSystemMessage,
    addGameGrid: addGameGrid,
    addHappiness: addHappiness,
    getHappiness: getHappiness,
    hideGamesMenu: hideGamesMenu,
    onCorrect: onCorrect,
    onWrong: onWrong,
    onThink: onThink,
    onResults: onResults,
    onSplashStep: onSplashStep,
    show: show,
    hide: hide,
    setSize: setSize
  };
})();
