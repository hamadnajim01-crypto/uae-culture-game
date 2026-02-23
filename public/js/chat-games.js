/* ============================================
   Chat Games Engine — 30 Mini-Games for Rashid
   Plays inside the persistent chat panel
   ============================================ */

const ChatGames = (function () {
  var activeGame = null;
  var gameState = {};
  var games = {};

  // === ENGINE CORE ===
  function registerGame(def) {
    games[def.id] = def;
  }

  function startGame(gameId) {
    var g = games[gameId];
    if (!g) return;
    activeGame = gameId;
    gameState = {};
    g.init(gameState);
    Mascot.hideGamesMenu();
    Mascot.addSystemMessage('🎮 ' + g.name);
    Mascot.addBotMessage(g.getIntro(gameState));
    Mascot.addHappiness(1);
    if (typeof addXP === 'function') addXP(2);
    var prompt = g.firstPrompt(gameState);
    if (prompt) Mascot.addBotMessage(prompt);
  }

  function handleInput(msg) {
    if (!activeGame) return;
    var g = games[activeGame];
    if (!g) return;
    var lower = msg.toLowerCase().trim();
    if (lower === 'quit' || lower === 'stop' || lower === 'exit') {
      cancelGame();
      return;
    }
    g.handleInput(msg, gameState);
  }

  function cancelGame() {
    Mascot.addSystemMessage('Game ended! Type anything to chat.');
    activeGame = null;
    gameState = {};
  }

  function endGame(correct, total) {
    var pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    var msg = '🏁 Final Score: ' + correct + '/' + total + ' (' + pct + '%)';
    if (pct >= 80) msg += ' Amazing!';
    else if (pct >= 50) msg += ' Good job!';
    else msg += ' Keep practicing!';
    Mascot.addSystemMessage(msg);
    if (correct > 0 && typeof addXP === 'function') addXP(correct * 5);
    Mascot.addHappiness(correct > 0 ? 2 : 1);
    activeGame = null;
    gameState = {};
  }

  function isGameActive() {
    return activeGame !== null;
  }

  function renderMenu(container) {
    container.innerHTML = '';
    var ids = Object.keys(games);
    for (var i = 0; i < ids.length; i++) {
      var g = games[ids[i]];
      var btn = document.createElement('div');
      btn.className = 'rashid-game-menu-item';
      btn.innerHTML = '<span class="game-icon">' + g.emoji + '</span>' + g.name;
      btn.setAttribute('data-game-id', g.id);
      btn.addEventListener('click', (function (id) {
        return function (e) {
          e.stopPropagation();
          startGame(id);
        };
      })(g.id));
      container.appendChild(btn);
    }
  }

  // === HELPER ===
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // ======================================================
  //  GAME 1: BATTLESHIP (Find UAE landmarks on 5x5 grid)
  // ======================================================
  registerGame({
    id: 'battleship', name: 'Battleship', emoji: '🚢',
    init: function (s) {
      s.size = 5; s.guesses = 0; s.maxGuesses = 10; s.found = 0; s.needed = 3;
      s.landmarks = ['Burj Khalifa', 'Sheikh Zayed Mosque', 'Dubai Frame'];
      s.grid = {}; s.hits = {}; s.misses = {};
      var positions = shuffle(['A1','A2','A3','A4','A5','B1','B2','B3','B4','B5','C1','C2','C3','C4','C5','D1','D2','D3','D4','D5','E1','E2','E3','E4','E5']);
      for (var i = 0; i < s.needed; i++) s.grid[positions[i]] = s.landmarks[i];
    },
    getIntro: function () { return 'Find 3 hidden UAE landmarks on a 5×5 grid! Type coordinates like A1, B3, C5. You have 10 guesses!'; },
    firstPrompt: function (s) { return renderBattleGrid(s); },
    handleInput: function (msg, s) {
      var coord = msg.toUpperCase().replace(/\s/g, '');
      if (!/^[A-E][1-5]$/.test(coord)) { Mascot.addBotMessage('Type a coordinate like A1, B3, etc. (A-E, 1-5)'); return; }
      if (s.hits[coord] || s.misses[coord]) { Mascot.addBotMessage('Already guessed ' + coord + '! Try another.'); return; }
      s.guesses++;
      if (s.grid[coord]) {
        s.hits[coord] = true; s.found++;
        Mascot.addBotMessage('💥 HIT! You found ' + s.grid[coord] + '! (' + s.found + '/' + s.needed + ')');
        Mascot.addHappiness(2);
      } else {
        s.misses[coord] = true;
        Mascot.addBotMessage('🌊 Miss! (' + (s.maxGuesses - s.guesses) + ' guesses left)');
      }
      Mascot.addBotMessage(renderBattleGrid(s));
      if (s.found >= s.needed) { Mascot.addBotMessage('🎉 You found all landmarks!'); endGame(s.found, s.needed); }
      else if (s.guesses >= s.maxGuesses) { Mascot.addBotMessage('Out of guesses! The landmarks were at: ' + Object.keys(s.grid).join(', ')); endGame(s.found, s.needed); }
    }
  });

  function renderBattleGrid(s) {
    var rows = ['A','B','C','D','E'];
    var out = '  1 2 3 4 5\n';
    for (var r = 0; r < rows.length; r++) {
      out += rows[r] + ' ';
      for (var c = 1; c <= 5; c++) {
        var k = rows[r] + c;
        if (s.hits[k]) out += '💥';
        else if (s.misses[k]) out += '🌊';
        else out += '⬜';
        if (c < 5) out += ' ';
      }
      out += '\n';
    }
    return out;
  }

  // ======================================================
  //  GAME 2: 20 QUESTIONS
  // ======================================================
  var twentyQItems = [
    { thing: 'Burj Khalifa', hints: { tall: 'y', building: 'y', dubai: 'y', landmark: 'y', old: 'n', food: 'n', animal: 'n', natural: 'n' } },
    { thing: 'Falcon', hints: { animal: 'y', bird: 'y', fly: 'y', pet: 'y', food: 'n', building: 'n', big: 'n', water: 'n' } },
    { thing: 'Luqaimat', hints: { food: 'y', sweet: 'y', small: 'y', round: 'y', animal: 'n', building: 'n', tall: 'n', fly: 'n' } },
    { thing: 'Pearl', hints: { small: 'y', valuable: 'y', white: 'y', water: 'y', ocean: 'y', food: 'n', animal: 'n', building: 'n' } },
    { thing: 'Camel', hints: { animal: 'y', big: 'y', desert: 'y', ride: 'y', fly: 'n', building: 'n', food: 'n', water: 'n' } },
    { thing: 'Dubai Frame', hints: { building: 'y', tall: 'y', dubai: 'y', gold: 'y', food: 'n', animal: 'n', old: 'n', natural: 'n' } },
    { thing: 'Arabic Coffee', hints: { food: 'y', drink: 'y', hot: 'y', traditional: 'y', animal: 'n', building: 'n', big: 'n', fly: 'n' } },
    { thing: 'Sheikh Zayed Mosque', hints: { building: 'y', big: 'y', white: 'y', abudhabi: 'y', food: 'n', animal: 'n', small: 'n', water: 'n' } }
  ];
  registerGame({
    id: 'twenty-questions', name: '20 Questions', emoji: '🤔',
    init: function (s) { s.item = pick(twentyQItems); s.questions = 0; s.max = 20; s.guessed = false; },
    getIntro: function () { return "I'm thinking of something related to the UAE! Ask me yes/no questions or guess what it is. You have 20 questions!"; },
    firstPrompt: function () { return 'Ask your first question! (e.g., "Is it a food?")'; },
    handleInput: function (msg, s) {
      if (s.guessed) return;
      s.questions++;
      var lower = msg.toLowerCase();
      // Check if guessing the thing
      if (lower.indexOf(s.item.thing.toLowerCase()) !== -1) {
        s.guessed = true;
        Mascot.addBotMessage('🎉 YES! It\'s ' + s.item.thing + '! You got it in ' + s.questions + ' questions!');
        endGame(1, 1); return;
      }
      // Match hint keywords
      var answered = false;
      var hints = s.item.hints;
      for (var key in hints) {
        if (lower.indexOf(key) !== -1) {
          Mascot.addBotMessage(hints[key] === 'y' ? '✅ Yes!' : '❌ No!');
          answered = true; break;
        }
      }
      if (!answered) Mascot.addBotMessage(pick(['Hmm, I\'m not sure about that. Try another question!', '🤷 Ask me something else!', 'I can\'t answer that one. Try yes/no questions!']));
      if (s.questions >= s.max && !s.guessed) {
        Mascot.addBotMessage('Time\'s up! It was: ' + s.item.thing + '!');
        endGame(0, 1);
      } else if (!s.guessed) {
        Mascot.addBotMessage('(' + (s.max - s.questions) + ' questions left)');
      }
    }
  });

  // ======================================================
  //  GAME 3: WORD CHAIN
  // ======================================================
  var wordChainWords = ['falcon','camel','pearl','desert','mosque','emirate','oasis','sand','gold','dirham','date','henna','khalifa','luqaimat','machboos','arabian','tower','dune','island','palace','abra','souk','dhow','burj','majlis','oryx','dolphin','flamingo','carpet','spice'];
  registerGame({
    id: 'word-chain', name: 'Word Chain', emoji: '🔗',
    init: function (s) { s.round = 0; s.max = 10; s.score = 0; s.lastLetter = ''; s.used = {}; s.lastWord = pick(wordChainWords); s.used[s.lastWord] = true; },
    getIntro: function () { return 'Word Chain! Say a UAE-related word starting with the last letter of my word. 10 rounds!'; },
    firstPrompt: function (s) { s.lastLetter = s.lastWord.charAt(s.lastWord.length - 1).toLowerCase(); return 'My word: "' + s.lastWord + '" — your turn! (starts with "' + s.lastLetter.toUpperCase() + '")'; },
    handleInput: function (msg, s) {
      var word = msg.toLowerCase().trim();
      s.round++;
      if (word.charAt(0) !== s.lastLetter) {
        Mascot.addBotMessage('❌ "' + word + '" doesn\'t start with "' + s.lastLetter.toUpperCase() + '"!');
      } else if (s.used[word]) {
        Mascot.addBotMessage('❌ "' + word + '" was already used!');
      } else {
        s.used[word] = true; s.score++;
        Mascot.addBotMessage('✅ Nice! "' + word + '" is great!');
        Mascot.addHappiness(1);
      }
      if (s.round >= s.max) { endGame(s.score, s.max); return; }
      // Rashid's turn
      var nextLetter = word.charAt(word.length - 1);
      var rashidWord = null;
      for (var i = 0; i < wordChainWords.length; i++) {
        if (wordChainWords[i].charAt(0) === nextLetter && !s.used[wordChainWords[i]]) {
          rashidWord = wordChainWords[i]; break;
        }
      }
      if (!rashidWord) rashidWord = pick(wordChainWords);
      s.used[rashidWord] = true; s.lastWord = rashidWord;
      s.lastLetter = rashidWord.charAt(rashidWord.length - 1);
      Mascot.addBotMessage('My word: "' + rashidWord + '" — your turn! (starts with "' + s.lastLetter.toUpperCase() + '") [Round ' + (s.round + 1) + '/' + s.max + ']');
    }
  });

  // ======================================================
  //  GAME 4: RIDDLE ME
  // ======================================================
  var riddles = [
    { q: "I'm the tallest building in the world and I live in Dubai. What am I?", a: 'burj khalifa' },
    { q: "I'm a bird used in a traditional Emirati sport. Kings love me! What am I?", a: 'falcon' },
    { q: "I'm small, round, sweet, and covered in date syrup. What am I?", a: 'luqaimat' },
    { q: "I'm found in oysters deep under the Arabian Gulf. What am I?", a: 'pearl' },
    { q: "I'm called the ship of the desert. What am I?", a: 'camel' },
    { q: "I have 82 domes and I'm in Abu Dhabi. What am I?", a: 'mosque' },
    { q: "I'm a picture frame you can walk through, and I'm 150 meters tall! What am I?", a: 'dubai frame' },
    { q: "I'm a traditional market where you buy spices and gold. What am I?", a: 'souk' },
    { q: "I'm the currency used in the UAE. What am I?", a: 'dirham' },
    { q: "I grow on palm trees and I'm served with Arabic coffee. What am I?", a: 'dates' }
  ];
  registerGame({
    id: 'riddle-me', name: 'Riddle Me', emoji: '🧩',
    init: function (s) { s.riddles = shuffle(riddles).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'I have 5 riddles about the UAE! Can you guess the answers?'; },
    firstPrompt: function (s) { return '🧩 Riddle 1: ' + s.riddles[0].q; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var correct = lower.indexOf(s.riddles[s.idx].a) !== -1;
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct! The answer is ' + s.riddles[s.idx].a + '!'); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ The answer was: ' + s.riddles[s.idx].a + '!');
      s.idx++;
      if (s.idx >= s.riddles.length) { endGame(s.score, s.riddles.length); }
      else Mascot.addBotMessage('🧩 Riddle ' + (s.idx + 1) + ': ' + s.riddles[s.idx].q);
    }
  });

  // ======================================================
  //  GAME 5: EMOJI GUESS
  // ======================================================
  var emojiGuesses = [
    { emojis: '🏗️📏🌆', answer: 'burj khalifa' },
    { emojis: '🕌⬜🤲', answer: 'mosque' },
    { emojis: '🐪🏜️☀️', answer: 'desert' },
    { emojis: '🦅👑🧤', answer: 'falcon' },
    { emojis: '🫘🍯🍡', answer: 'luqaimat' },
    { emojis: '⛵🐚💎', answer: 'pearl' },
    { emojis: '🖼️🏙️🌉', answer: 'dubai frame' },
    { emojis: '☕🫖🤝', answer: 'arabic coffee' },
    { emojis: '🌴🟤🍬', answer: 'dates' },
    { emojis: '🏖️🌊🏝️', answer: 'island' }
  ];
  registerGame({
    id: 'emoji-guess', name: 'Emoji Guess', emoji: '😎',
    init: function (s) { s.items = shuffle(emojiGuesses).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'Guess the UAE thing from the emojis! 5 rounds — type your answer!'; },
    firstPrompt: function (s) { return '1️⃣ ' + s.items[0].emojis + '\nWhat UAE thing is this?'; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var correct = lower.indexOf(s.items[s.idx].answer) !== -1;
      if (correct) { s.score++; Mascot.addBotMessage('✅ Yes! It\'s ' + s.items[s.idx].answer + '!'); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ It was: ' + s.items[s.idx].answer + '!');
      s.idx++;
      if (s.idx >= s.items.length) { endGame(s.score, s.items.length); }
      else Mascot.addBotMessage((s.idx + 1) + '️⃣ ' + s.items[s.idx].emojis + '\nWhat UAE thing is this?');
    }
  });

  // ======================================================
  //  GAME 6: HIGHER OR LOWER
  // ======================================================
  var hlFacts = [
    { fact: 'Height of Burj Khalifa in meters', value: 828 },
    { fact: 'Number of UAE emirates', value: 7 },
    { fact: 'Year UAE was founded', value: 1971 },
    { fact: 'Domes in Sheikh Zayed Mosque', value: 82 },
    { fact: 'Floors in Burj Khalifa', value: 163 },
    { fact: 'Year oil was discovered in UAE', value: 1958 },
    { fact: 'Width of Dubai Frame in meters', value: 93 },
    { fact: 'Number of UAE flag colors', value: 4 },
    { fact: 'Population of UAE in millions (approx)', value: 10 },
    { fact: 'Length of UAE coastline in km', value: 1318 }
  ];
  registerGame({
    id: 'higher-lower', name: 'Higher or Lower', emoji: '⬆️',
    init: function (s) { s.facts = shuffle(hlFacts); s.idx = 0; s.score = 0; s.rounds = Math.min(5, s.facts.length - 1); },
    getIntro: function () { return 'Is the next UAE number HIGHER or LOWER? Type "higher" or "lower"!'; },
    firstPrompt: function (s) { return '📊 ' + s.facts[0].fact + ': ' + s.facts[0].value + '\n\n📊 ' + s.facts[1].fact + ': ???\nIs it HIGHER or LOWER than ' + s.facts[0].value + '?'; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var isHigher = lower.indexOf('higher') !== -1 || lower.indexOf('up') !== -1;
      var isLower = lower.indexOf('lower') !== -1 || lower.indexOf('down') !== -1;
      if (!isHigher && !isLower) { Mascot.addBotMessage('Type "higher" or "lower"!'); return; }
      var prev = s.facts[s.idx].value;
      var curr = s.facts[s.idx + 1].value;
      var actualHigher = curr > prev;
      var correct = (isHigher && actualHigher) || (isLower && !actualHigher);
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct! ' + s.facts[s.idx + 1].fact + ' = ' + curr); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ Wrong! ' + s.facts[s.idx + 1].fact + ' = ' + curr);
      s.idx++;
      if (s.idx >= s.rounds) { endGame(s.score, s.rounds); }
      else {
        Mascot.addBotMessage('📊 ' + s.facts[s.idx].fact + ': ' + s.facts[s.idx].value + '\n\n📊 ' + s.facts[s.idx + 1].fact + ': ???\nHigher or Lower?');
      }
    }
  });

  // ======================================================
  //  GAME 7: STORY BUILDER
  // ======================================================
  var storyStarters = [
    'Once upon a time in Dubai, a young explorer found a golden key...',
    'In the desert near Abu Dhabi, a baby falcon opened its eyes for the first time...',
    'At the souk, a merchant discovered a glowing pearl...',
    'On National Day, fireworks lit up the sky and...',
    'A camel named Zayed started walking toward the tallest building...'
  ];
  registerGame({
    id: 'story-builder', name: 'Story Builder', emoji: '📖',
    init: function (s) { s.round = 0; s.max = 6; s.story = [pick(storyStarters)]; },
    getIntro: function () { return 'Let\'s build a UAE story together! I\'ll start, you add a sentence, then I add one. 6 turns!'; },
    firstPrompt: function (s) { return '📖 ' + s.story[0] + '\n\nYour turn! Add the next sentence:'; },
    handleInput: function (msg, s) {
      s.round++;
      s.story.push(msg);
      Mascot.addBotMessage('✍️ Nice addition!');
      if (s.round >= s.max) {
        Mascot.addBotMessage('📖 Our story:\n' + s.story.join(' '));
        Mascot.addSystemMessage('Story complete! Great teamwork!');
        Mascot.addHappiness(3);
        endGame(s.max, s.max); return;
      }
      // Rashid's turn
      var continuations = [
        'The wind carried whispers of ancient traditions...',
        'Suddenly, a falcon swooped down from the sky!',
        'The desert sand sparkled like gold under the sun.',
        'Everyone gathered to celebrate with Arabic coffee and dates.',
        'The sound of the oud filled the air with beautiful music.',
        'A dhow sailed across the Arabian Gulf carrying treasures.'
      ];
      var rashidLine = pick(continuations);
      s.story.push(rashidLine);
      Mascot.addBotMessage('📖 ' + rashidLine + '\n\nYour turn! [Round ' + (s.round + 1) + '/' + s.max + ']');
    }
  });

  // ======================================================
  //  GAME 8: FALCON PEARL SAND (Rock-Paper-Scissors UAE)
  // ======================================================
  registerGame({
    id: 'falcon-pearl-sand', name: 'Falcon Pearl Sand', emoji: '✊',
    init: function (s) { s.round = 0; s.max = 5; s.score = 0; },
    getIntro: function () { return '🦅 Falcon beats 🐚 Pearl, 🐚 Pearl beats 🏜️ Sand, 🏜️ Sand beats 🦅 Falcon! Type falcon, pearl, or sand!'; },
    firstPrompt: function () { return 'Round 1/5 — Choose: falcon, pearl, or sand?'; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var choices = ['falcon', 'pearl', 'sand'];
      var emojis = { falcon: '🦅', pearl: '🐚', sand: '🏜️' };
      var player = null;
      for (var i = 0; i < choices.length; i++) { if (lower.indexOf(choices[i]) !== -1) { player = choices[i]; break; } }
      if (!player) { Mascot.addBotMessage('Choose falcon, pearl, or sand!'); return; }
      s.round++;
      var rashid = pick(choices);
      var wins = { falcon: 'pearl', pearl: 'sand', sand: 'falcon' };
      var result;
      if (player === rashid) result = 'tie';
      else if (wins[player] === rashid) result = 'win';
      else result = 'lose';
      var line = emojis[player] + ' vs ' + emojis[rashid] + ' — ';
      if (result === 'win') { s.score++; line += 'You win!'; Mascot.addHappiness(1); }
      else if (result === 'lose') line += 'I win!';
      else line += 'Tie!';
      Mascot.addBotMessage(line);
      if (s.round >= s.max) endGame(s.score, s.max);
      else Mascot.addBotMessage('Round ' + (s.round + 1) + '/' + s.max + ' — Choose: falcon, pearl, or sand?');
    }
  });

  // ======================================================
  //  GAME 9: HANGMAN
  // ======================================================
  var hangmanWords = ['falcon','mosque','khalifa','luqaimat','dirham','emirate','oasis','henna','dhow','souk','majlis','oryx','machboos','abaya','kandura','pearl','desert','island','arabian','palace'];
  registerGame({
    id: 'hangman', name: 'Hangman', emoji: '🪢',
    init: function (s) {
      s.word = pick(hangmanWords); s.guessed = []; s.wrong = 0; s.maxWrong = 6; s.won = false;
    },
    getIntro: function () { return 'Guess the UAE word letter by letter! 6 wrong guesses and you lose!'; },
    firstPrompt: function (s) { return renderHangman(s); },
    handleInput: function (msg, s) {
      if (s.won || s.wrong >= s.maxWrong) return;
      var letter = msg.toLowerCase().trim().charAt(0);
      if (!letter || !/[a-z]/.test(letter)) { Mascot.addBotMessage('Type a single letter (a-z)!'); return; }
      if (s.guessed.indexOf(letter) !== -1) { Mascot.addBotMessage('Already guessed "' + letter + '"!'); return; }
      s.guessed.push(letter);
      if (s.word.indexOf(letter) === -1) {
        s.wrong++;
        Mascot.addBotMessage('❌ No "' + letter + '"! (' + (s.maxWrong - s.wrong) + ' lives left)');
      } else {
        Mascot.addBotMessage('✅ Yes! "' + letter + '" is in the word!');
      }
      // Check win
      var allFound = true;
      for (var i = 0; i < s.word.length; i++) {
        if (s.guessed.indexOf(s.word[i]) === -1) { allFound = false; break; }
      }
      if (allFound) {
        s.won = true;
        Mascot.addBotMessage('🎉 You got it! The word is: ' + s.word.toUpperCase());
        endGame(1, 1);
      } else if (s.wrong >= s.maxWrong) {
        Mascot.addBotMessage('💀 Game over! The word was: ' + s.word.toUpperCase());
        endGame(0, 1);
      } else {
        Mascot.addBotMessage(renderHangman(s));
      }
    }
  });

  function renderHangman(s) {
    var display = '';
    for (var i = 0; i < s.word.length; i++) {
      display += s.guessed.indexOf(s.word[i]) !== -1 ? s.word[i].toUpperCase() : '_';
      display += ' ';
    }
    var stages = ['😀','😐','😟','😰','😨','😱','💀'];
    return display.trim() + '\n' + stages[s.wrong] + ' (' + (s.maxWrong - s.wrong) + ' lives) | Guessed: ' + (s.guessed.join(', ') || 'none');
  }

  // ======================================================
  //  GAME 10: YEAR GUESSER
  // ======================================================
  var yearEvents = [
    { event: 'The UAE was founded (union of 7 emirates)', year: 1971 },
    { event: 'Oil was first discovered in Abu Dhabi', year: 1958 },
    { event: 'Burj Khalifa opened to the public', year: 2010 },
    { event: 'Dubai Metro opened (first in the Arabian Peninsula)', year: 2009 },
    { event: 'Expo 2020 was held in Dubai', year: 2020 },
    { event: 'The Hope Probe reached Mars orbit', year: 2021 },
    { event: 'The UAE flag was first raised', year: 1971 },
    { event: 'Museum of the Future opened in Dubai', year: 2022 },
    { event: 'Abu Dhabi Louvre museum opened', year: 2017 },
    { event: 'Dubai International Airport was established', year: 1960 }
  ];
  registerGame({
    id: 'year-guesser', name: 'Year Guesser', emoji: '📅',
    init: function (s) { s.events = shuffle(yearEvents).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'I\'ll describe a UAE event — guess the year it happened! Within 5 years counts as correct!'; },
    firstPrompt: function (s) { return '📅 ' + s.events[0].event + '\nWhat year? (type a number)'; },
    handleInput: function (msg, s) {
      var guess = parseInt(msg.trim());
      if (isNaN(guess)) { Mascot.addBotMessage('Type a year number like 1971!'); return; }
      var diff = Math.abs(guess - s.events[s.idx].year);
      if (diff === 0) { s.score++; Mascot.addBotMessage('🎯 Exactly right! ' + s.events[s.idx].year + '!'); Mascot.addHappiness(2); }
      else if (diff <= 5) { s.score++; Mascot.addBotMessage('✅ Close enough! It was ' + s.events[s.idx].year + ' (you were ' + diff + ' years off)'); Mascot.addHappiness(1); }
      else Mascot.addBotMessage('❌ It was ' + s.events[s.idx].year + '! (You were ' + diff + ' years off)');
      s.idx++;
      if (s.idx >= s.events.length) endGame(s.score, s.events.length);
      else Mascot.addBotMessage('📅 ' + s.events[s.idx].event + '\nWhat year?');
    }
  });

  // ======================================================
  //  GAME 11: TRIVIA BLITZ
  // ======================================================
  var triviaQs = [
    { q: 'What is the capital of the UAE?', opts: ['A) Dubai', 'B) Abu Dhabi', 'C) Sharjah', 'D) Ajman'], a: 'b' },
    { q: 'How many emirates are in the UAE?', opts: ['A) 5', 'B) 6', 'C) 7', 'D) 8'], a: 'c' },
    { q: 'What is the tallest building in the world?', opts: ['A) Dubai Frame', 'B) CN Tower', 'C) Burj Al Arab', 'D) Burj Khalifa'], a: 'd' },
    { q: 'What bird is used in Emirati falconry?', opts: ['A) Eagle', 'B) Falcon', 'C) Hawk', 'D) Parrot'], a: 'b' },
    { q: 'What is the UAE currency called?', opts: ['A) Riyal', 'B) Dinar', 'C) Dirham', 'D) Pound'], a: 'c' },
    { q: 'When is UAE National Day?', opts: ['A) Jan 1', 'B) Dec 2', 'C) Nov 30', 'D) Sep 1'], a: 'b' },
    { q: 'What is Luqaimat?', opts: ['A) A drink', 'B) A dance', 'C) A sweet dumpling', 'D) A building'], a: 'c' },
    { q: 'What is the oldest mosque in the UAE?', opts: ['A) Al Bidyah', 'B) Sheikh Zayed', 'C) Jumeirah', 'D) Al Fahidi'], a: 'a' },
    { q: 'Which emirate is the cultural capital?', opts: ['A) Dubai', 'B) Abu Dhabi', 'C) Sharjah', 'D) Fujairah'], a: 'c' },
    { q: 'What UAE probe reached Mars in 2021?', opts: ['A) Mars One', 'B) Spirit', 'C) Al Amal (Hope)', 'D) Viking'], a: 'c' }
  ];
  registerGame({
    id: 'trivia-blitz', name: 'Trivia Blitz', emoji: '⚡',
    init: function (s) { s.questions = shuffle(triviaQs).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'Quick UAE trivia! Pick A, B, C, or D. 5 questions!'; },
    firstPrompt: function (s) { return '❓ ' + s.questions[0].q + '\n' + s.questions[0].opts.join('\n'); },
    handleInput: function (msg, s) {
      var ans = msg.toLowerCase().trim().charAt(0);
      if ('abcd'.indexOf(ans) === -1) { Mascot.addBotMessage('Pick A, B, C, or D!'); return; }
      var correct = ans === s.questions[s.idx].a;
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct!'); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ The answer was ' + s.questions[s.idx].a.toUpperCase() + '!');
      s.idx++;
      if (s.idx >= s.questions.length) endGame(s.score, s.questions.length);
      else Mascot.addBotMessage('❓ ' + s.questions[s.idx].q + '\n' + s.questions[s.idx].opts.join('\n'));
    }
  });

  // ======================================================
  //  GAME 12: SPELLING BEE
  // ======================================================
  var spellingWords = [
    { meaning: 'Hello in Arabic', answer: 'marhaba' },
    { meaning: 'Thank you in Arabic', answer: 'shukran' },
    { meaning: 'Let\'s go! in Arabic', answer: 'yalla' },
    { meaning: 'Traditional men\'s robe in UAE', answer: 'kandura' },
    { meaning: 'Spiced rice dish', answer: 'machboos' },
    { meaning: 'Traditional sweet dumplings', answer: 'luqaimat' },
    { meaning: 'Sitting room for guests', answer: 'majlis' },
    { meaning: 'Traditional wooden boat', answer: 'dhow' },
    { meaning: 'UAE currency', answer: 'dirham' },
    { meaning: 'Traditional market', answer: 'souk' }
  ];
  registerGame({
    id: 'spelling-bee', name: 'Spelling Bee', emoji: '🐝',
    init: function (s) { s.words = shuffle(spellingWords).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'I\'ll give you a meaning — spell the word! 5 words to spell!'; },
    firstPrompt: function (s) { return '🐝 Spell this: "' + s.words[0].meaning + '"'; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var correct = lower === s.words[s.idx].answer;
      if (correct) { s.score++; Mascot.addBotMessage('✅ Perfect spelling! "' + s.words[s.idx].answer + '"!'); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ The correct spelling is: "' + s.words[s.idx].answer + '"');
      s.idx++;
      if (s.idx >= s.words.length) endGame(s.score, s.words.length);
      else Mascot.addBotMessage('🐝 Spell this: "' + s.words[s.idx].meaning + '"');
    }
  });

  // ======================================================
  //  GAME 13: EMIRATES QUIZ
  // ======================================================
  var emiratesQs = [
    { q: 'Which emirate is the UAE capital?', a: 'abu dhabi' },
    { q: 'Which emirate has Burj Khalifa?', a: 'dubai' },
    { q: 'Which emirate is called the cultural capital?', a: 'sharjah' },
    { q: 'Which is the smallest emirate by area?', a: 'ajman' },
    { q: 'Which emirate faces the Indian Ocean?', a: 'fujairah' },
    { q: 'Which emirate has Jebel Jais mountain?', a: 'ras al khaimah' },
    { q: 'Which emirate is known for mangrove forests?', a: 'umm al quwain' }
  ];
  registerGame({
    id: 'emirates-quiz', name: 'Emirates Quiz', emoji: '🏛️',
    init: function (s) { s.qs = shuffle(emiratesQs); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'How well do you know the 7 emirates? Answer all 7 questions!'; },
    firstPrompt: function (s) { return '🏛️ ' + s.qs[0].q; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var correct = lower.indexOf(s.qs[s.idx].a) !== -1;
      if (correct) { s.score++; Mascot.addBotMessage('✅ Yes! ' + s.qs[s.idx].a.charAt(0).toUpperCase() + s.qs[s.idx].a.slice(1) + '!'); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ It\'s ' + s.qs[s.idx].a.charAt(0).toUpperCase() + s.qs[s.idx].a.slice(1) + '!');
      s.idx++;
      if (s.idx >= s.qs.length) endGame(s.score, s.qs.length);
      else Mascot.addBotMessage('🏛️ ' + s.qs[s.idx].q);
    }
  });

  // ======================================================
  //  GAME 14: WOULD YOU RATHER (fun, always "correct")
  // ======================================================
  var wyrChoices = [
    { a: 'Visit the Burj Khalifa', b: 'Visit Sheikh Zayed Mosque', reactA: 'Amazing choice! The views from 828m are breathtaking!', reactB: 'Beautiful! The mosque has 82 domes and the world\'s largest carpet!' },
    { a: 'Ride a camel in the desert', b: 'Swim with dolphins', reactA: 'Yalla! Camels are the ships of the desert!', reactB: 'Dolphins in the Arabian Gulf are so friendly!' },
    { a: 'Eat Luqaimat', b: 'Eat Machboos', reactA: 'Sweet and crispy — the best treat!', reactB: 'Spiced rice perfection — I love it too!' },
    { a: 'Go to Mars with Hope Probe', b: 'Zipline on Jebel Jais', reactA: 'The UAE was the first Arab nation to reach Mars!', reactB: 'The world\'s longest zipline — 2.8 km of pure excitement!' },
    { a: 'Be a falconer', b: 'Be a pearl diver', reactA: 'Falcons are like royalty in the UAE!', reactB: 'The Arabian Gulf has the best pearls in the world!' }
  ];
  registerGame({
    id: 'would-you-rather', name: 'Would You Rather', emoji: '🤷',
    init: function (s) { s.choices = shuffle(wyrChoices).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'Would you rather...? Pick A or B! There\'s no wrong answer — just fun!'; },
    firstPrompt: function (s) { return '🤷 Would you rather:\nA) ' + s.choices[0].a + '\nB) ' + s.choices[0].b; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var isA = lower === 'a' || lower.indexOf(s.choices[s.idx].a.toLowerCase().split(' ')[0]) !== -1;
      s.score++;
      Mascot.addBotMessage(isA ? s.choices[s.idx].reactA : s.choices[s.idx].reactB);
      Mascot.addHappiness(1);
      s.idx++;
      if (s.idx >= s.choices.length) { Mascot.addSystemMessage('That was fun! Great choices!'); endGame(s.score, s.choices.length); }
      else Mascot.addBotMessage('🤷 Would you rather:\nA) ' + s.choices[s.idx].a + '\nB) ' + s.choices[s.idx].b);
    }
  });

  // ======================================================
  //  GAME 15: MEMORY CHAIN
  // ======================================================
  var memoryItems = ['falcon', 'date', 'pearl', 'camel', 'mosque', 'dune', 'dirham', 'souk', 'dhow', 'oasis', 'oryx', 'abaya', 'henna', 'coffee'];
  registerGame({
    id: 'memory-chain', name: 'Memory Chain', emoji: '🧠',
    init: function (s) { s.chain = []; s.round = 0; s.max = 8; s.pool = shuffle(memoryItems); },
    getIntro: function () { return 'Remember the growing list of UAE items! Each round I add one more. Repeat them all back!'; },
    firstPrompt: function (s) {
      s.chain.push(s.pool[0]);
      return '🧠 Remember: ' + s.chain.join(', ') + '\n\nNow type them all back!';
    },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var allCorrect = true;
      for (var i = 0; i < s.chain.length; i++) {
        if (lower.indexOf(s.chain[i]) === -1) { allCorrect = false; break; }
      }
      s.round++;
      if (allCorrect) {
        Mascot.addBotMessage('✅ Perfect memory! ' + s.round + '/' + s.max);
        Mascot.addHappiness(1);
        if (s.round >= s.max) { endGame(s.round, s.max); return; }
        s.chain.push(s.pool[s.round]);
        Mascot.addBotMessage('🧠 Remember: ' + s.chain.join(', ') + '\n\nType them all!');
      } else {
        Mascot.addBotMessage('❌ The chain was: ' + s.chain.join(', '));
        endGame(s.round - 1, s.max);
      }
    }
  });

  // ======================================================
  //  GAME 16: ODD ONE OUT
  // ======================================================
  var oddItems = [
    { items: ['Falcon', 'Eagle', 'Camel', 'Hawk'], odd: 'camel', reason: 'Camel is not a bird!' },
    { items: ['Abu Dhabi', 'Dubai', 'Cairo', 'Sharjah'], odd: 'cairo', reason: 'Cairo is in Egypt, not the UAE!' },
    { items: ['Luqaimat', 'Machboos', 'Harees', 'Sushi'], odd: 'sushi', reason: 'Sushi is Japanese, not Emirati!' },
    { items: ['Dirham', 'Fils', 'Dollar', 'AED'], odd: 'dollar', reason: 'Dollar is not UAE currency!' },
    { items: ['Burj Khalifa', 'Dubai Frame', 'Eiffel Tower', 'Museum of the Future'], odd: 'eiffel tower', reason: 'Eiffel Tower is in Paris, not the UAE!' },
    { items: ['Pearl Diving', 'Falconry', 'Surfing', 'Camel Racing'], odd: 'surfing', reason: 'Surfing isn\'t a traditional Emirati activity!' },
    { items: ['Kandura', 'Abaya', 'Kimono', 'Ghutrah'], odd: 'kimono', reason: 'Kimono is Japanese traditional wear!' }
  ];
  registerGame({
    id: 'odd-one-out', name: 'Odd One Out', emoji: '🔍',
    init: function (s) { s.items = shuffle(oddItems).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'Which one doesn\'t belong? Pick the odd one out! 5 rounds!'; },
    firstPrompt: function (s) { return '🔍 Which doesn\'t belong?\n1) ' + s.items[0].items.join('  2) ') + '\n(Just type the odd one)'; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var correct = lower.indexOf(s.items[s.idx].odd) !== -1;
      if (correct) { s.score++; Mascot.addBotMessage('✅ Right! ' + s.items[s.idx].reason); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ The odd one is ' + s.items[s.idx].odd + '! ' + s.items[s.idx].reason);
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('🔍 Which doesn\'t belong?\n' + s.items[s.idx].items.map(function (x, i) { return (i + 1) + ') ' + x; }).join('  '));
    }
  });

  // ======================================================
  //  GAME 17: TRUE OR FALSE
  // ======================================================
  var tfStatements = [
    { s: 'The UAE has 7 emirates.', a: true },
    { s: 'Dubai is the capital of the UAE.', a: false },
    { s: 'The Burj Khalifa is over 800 meters tall.', a: true },
    { s: 'Falcons have their own passports in the UAE.', a: true },
    { s: 'The UAE flag has 5 colors.', a: false },
    { s: 'Pearl diving was a major trade before oil.', a: true },
    { s: 'The UAE was founded in 1990.', a: false },
    { s: 'Arabic coffee is served with dates.', a: true },
    { s: 'Sharjah is the smallest emirate.', a: false },
    { s: 'The Hope Probe went to Jupiter.', a: false }
  ];
  registerGame({
    id: 'true-false-chat', name: 'True or False', emoji: '✅',
    init: function (s) { s.stmts = shuffle(tfStatements).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'Is it TRUE or FALSE? 5 quick statements about the UAE!'; },
    firstPrompt: function (s) { return '✅❌ ' + s.stmts[0].s + '\nTrue or False?'; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var isTrue = lower.indexOf('true') !== -1 || lower === 't' || lower === 'yes';
      var isFalse = lower.indexOf('false') !== -1 || lower === 'f' || lower === 'no';
      if (!isTrue && !isFalse) { Mascot.addBotMessage('Type "true" or "false"!'); return; }
      var playerSays = isTrue;
      var correct = playerSays === s.stmts[s.idx].a;
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct!'); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ Wrong! The answer is ' + (s.stmts[s.idx].a ? 'TRUE' : 'FALSE') + '!');
      s.idx++;
      if (s.idx >= s.stmts.length) endGame(s.score, s.stmts.length);
      else Mascot.addBotMessage('✅❌ ' + s.stmts[s.idx].s + '\nTrue or False?');
    }
  });

  // ======================================================
  //  GAME 18: FINISH THE FACT
  // ======================================================
  var finishFacts = [
    { start: 'The tallest building in the world is the ___', answer: 'burj khalifa' },
    { start: 'The UAE is made up of ___ emirates', answer: '7' },
    { start: 'The capital of the UAE is ___', answer: 'abu dhabi' },
    { start: 'The UAE currency is called the ___', answer: 'dirham' },
    { start: 'The national bird of the UAE is the ___', answer: 'falcon' },
    { start: 'UAE National Day is on December ___', answer: '2' },
    { start: 'The oldest mosque in the UAE is Al ___ Mosque', answer: 'bidyah' },
    { start: 'Sweet dumplings covered in date syrup are called ___', answer: 'luqaimat' },
    { start: 'The Hope Probe went to the planet ___', answer: 'mars' },
    { start: 'The world\'s longest zipline is on Jebel ___', answer: 'jais' }
  ];
  registerGame({
    id: 'finish-fact', name: 'Finish the Fact', emoji: '📝',
    init: function (s) { s.facts = shuffle(finishFacts).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'I\'ll start a UAE fact — you finish it! Fill in the blank!'; },
    firstPrompt: function (s) { return '📝 ' + s.facts[0].start; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var correct = lower.indexOf(s.facts[s.idx].answer) !== -1;
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct! The answer is: ' + s.facts[s.idx].answer); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ The answer was: ' + s.facts[s.idx].answer);
      s.idx++;
      if (s.idx >= s.facts.length) endGame(s.score, s.facts.length);
      else Mascot.addBotMessage('📝 ' + s.facts[s.idx].start);
    }
  });

  // ======================================================
  //  GAME 19: EMOJI ART
  // ======================================================
  var emojiArt = [
    { art: '    🏗️\n   🏗️🏗️\n  🏗️🏗️🏗️\n 🏗️🏗️🏗️🏗️\n🏗️🏗️🏗️🏗️🏗️', answer: 'burj khalifa' },
    { art: '  🕌\n 🕌🕌🕌\n🕌🕌🕌🕌🕌\n  ⬜⬜⬜', answer: 'mosque' },
    { art: '🐪🐪🐪\n🏜️🏜️🏜️🏜️\n☀️☀️☀️☀️☀️', answer: 'desert' },
    { art: '🦅\n  ↗️\n    🧤\n👤', answer: 'falconry' },
    { art: '🌊🌊🌊\n🚣‍♂️🐚💎\n🌊🌊🌊', answer: 'pearl diving' }
  ];
  registerGame({
    id: 'emoji-art', name: 'Emoji Art', emoji: '🎨',
    init: function (s) { s.art = shuffle(emojiArt).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'I\'ll show emoji art of UAE things — guess what it is! 5 rounds!'; },
    firstPrompt: function (s) { Mascot.addGameGrid(s.art[0].art); return 'What UAE thing is this?'; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var correct = lower.indexOf(s.art[s.idx].answer) !== -1;
      if (correct) { s.score++; Mascot.addBotMessage('✅ Yes! It\'s ' + s.art[s.idx].answer + '!'); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ It was: ' + s.art[s.idx].answer + '!');
      s.idx++;
      if (s.idx >= s.art.length) endGame(s.score, s.art.length);
      else { Mascot.addGameGrid(s.art[s.idx].art); Mascot.addBotMessage('What UAE thing is this?'); }
    }
  });

  // ======================================================
  //  GAME 20: FORTUNE TELLER (fun, always positive)
  // ======================================================
  var fortunes = [
    'You will visit the Burj Khalifa and see all of Dubai from the top!',
    'A falcon will land on your shoulder and bring you good luck!',
    'You will discover a hidden oasis in the desert with golden dates!',
    'The Sheikh will invite you for Arabic coffee and the most delicious Luqaimat!',
    'You will find a pearl in the Arabian Gulf worth a million dirhams!',
    'A magic carpet will fly you over the Sheikh Zayed Mosque at sunset!',
    'You will win a camel race and be crowned champion of the desert!',
    'The Museum of the Future will name an exhibit after you!',
    'A friendly oryx will guide you to a treasure hidden in the dunes!',
    'You will write a poem so beautiful it will be read in every majlis in the UAE!'
  ];
  registerGame({
    id: 'fortune-teller', name: 'Fortune Teller', emoji: '🔮',
    init: function (s) { s.round = 0; s.max = 3; s.pool = shuffle(fortunes); },
    getIntro: function () { return 'Ask the magical UAE fortune teller! Type anything and I\'ll reveal your UAE fortune! 3 fortunes!'; },
    firstPrompt: function () { return '🔮 Ask me your fortune... (type anything!)'; },
    handleInput: function (msg, s) {
      s.round++;
      Mascot.addBotMessage('🔮✨ ' + s.pool[s.round - 1]);
      Mascot.addHappiness(1);
      if (s.round >= s.max) {
        Mascot.addSystemMessage('May all your UAE dreams come true!');
        endGame(s.max, s.max);
      } else {
        Mascot.addBotMessage('Ask me another fortune! (' + (s.max - s.round) + ' left)');
      }
    }
  });

  // ======================================================
  //  GAME 21: WHO AM I? (progressive clues)
  // ======================================================
  var whoAmIItems = [
    { thing: 'Burj Khalifa', clues: ['I am very very tall.', 'I live in Dubai.', 'I have 163 floors.', 'I am the tallest building in the world!'] },
    { thing: 'Falcon', clues: ['I can fly very fast.', 'I am a symbol of the UAE.', 'Kings and sheikhs love me.', 'I am the national bird of the UAE!'] },
    { thing: 'Arabian Oryx', clues: ['I am a desert animal.', 'I am white with long horns.', 'I almost went extinct.', 'I am the national animal of the UAE!'] },
    { thing: 'Date Palm', clues: ['I grow in the desert.', 'My fruit is sweet and brown.', 'I am served with coffee.', 'There are over 200 varieties of my fruit in the UAE!'] },
    { thing: 'Dhow', clues: ['I travel on water.', 'I am made of wood.', 'I am traditional and ancient.', 'I am a wooden sailing boat used in the Arabian Gulf!'] },
    { thing: 'Sheikh Zayed Mosque', clues: ['I am very beautiful.', 'I am white and have many domes.', 'I am in Abu Dhabi.', 'I have the world\'s largest hand-knotted carpet!'] }
  ];
  registerGame({
    id: 'who-am-i', name: 'Who Am I?', emoji: '🎭',
    init: function (s) { s.items = shuffle(whoAmIItems).slice(0, 5); s.idx = 0; s.score = 0; s.clueIdx = 0; },
    getIntro: function () { return 'I\'ll give you clues one at a time. Guess WHO AM I? The fewer clues you need, the better! 5 rounds!'; },
    firstPrompt: function (s) { s.clueIdx = 0; return '🎭 Who Am I?\nClue 1: ' + s.items[0].clues[0]; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var item = s.items[s.idx];
      if (lower.indexOf(item.thing.toLowerCase()) !== -1 || lower.indexOf(item.thing.split(' ')[0].toLowerCase()) !== -1) {
        s.score++;
        Mascot.addBotMessage('🎉 Correct! It\'s ' + item.thing + '! (Guessed with ' + (s.clueIdx + 1) + ' clue' + (s.clueIdx > 0 ? 's' : '') + ')');
        Mascot.addHappiness(2);
        s.idx++; s.clueIdx = 0;
        if (s.idx >= s.items.length) { endGame(s.score, s.items.length); }
        else Mascot.addBotMessage('🎭 Who Am I?\nClue 1: ' + s.items[s.idx].clues[0]);
      } else if (lower === 'next' || lower === 'more' || lower === 'clue') {
        s.clueIdx++;
        if (s.clueIdx < item.clues.length) {
          Mascot.addBotMessage('Clue ' + (s.clueIdx + 1) + ': ' + item.clues[s.clueIdx]);
        } else {
          Mascot.addBotMessage('No more clues! It was: ' + item.thing + '!');
          s.idx++; s.clueIdx = 0;
          if (s.idx >= s.items.length) endGame(s.score, s.items.length);
          else Mascot.addBotMessage('🎭 Who Am I?\nClue 1: ' + s.items[s.idx].clues[0]);
        }
      } else {
        Mascot.addBotMessage('❌ Not quite! Type "clue" for another hint, or guess again!');
      }
    }
  });

  // ======================================================
  //  GAME 22: COUNTDOWN (name things in a category)
  // ======================================================
  var countdownCategories = [
    { cat: 'UAE Emirates', answers: ['abu dhabi','dubai','sharjah','ajman','fujairah','ras al khaimah','umm al quwain'] },
    { cat: 'UAE Landmarks', answers: ['burj khalifa','dubai frame','sheikh zayed mosque','museum of the future','louvre','palm','burj al arab'] },
    { cat: 'Emirati Foods', answers: ['machboos','luqaimat','harees','balaleet','thareed','khameer','regag','chebab'] },
    { cat: 'Desert Animals', answers: ['camel','oryx','falcon','gazelle','fox','scorpion','snake','lizard'] },
    { cat: 'Arabic Greetings', answers: ['marhaba','salam','ahlan','shukran','yalla','habibi','inshallah','mashallah'] }
  ];
  registerGame({
    id: 'countdown', name: 'Countdown', emoji: '⏳',
    init: function (s) {
      var c = pick(countdownCategories);
      s.cat = c.cat; s.answers = c.answers; s.found = []; s.round = 0; s.max = 8;
    },
    getIntro: function (s) { return 'Name as many ' + s.cat + ' as you can! Type one at a time. 8 tries!'; },
    firstPrompt: function (s) { return '⏳ Category: ' + s.cat + '\nName one! (' + s.max + ' tries)'; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      s.round++;
      var matched = false;
      for (var i = 0; i < s.answers.length; i++) {
        if (lower.indexOf(s.answers[i]) !== -1 && s.found.indexOf(s.answers[i]) === -1) {
          s.found.push(s.answers[i]);
          matched = true;
          Mascot.addBotMessage('✅ Yes! "' + s.answers[i] + '"! (' + s.found.length + ' found)');
          Mascot.addHappiness(1);
          break;
        }
      }
      if (!matched) {
        var alreadyFound = false;
        for (var j = 0; j < s.answers.length; j++) {
          if (lower.indexOf(s.answers[j]) !== -1 && s.found.indexOf(s.answers[j]) !== -1) { alreadyFound = true; break; }
        }
        if (alreadyFound) Mascot.addBotMessage('Already said that one! Try another.');
        else Mascot.addBotMessage('❌ Hmm, that\'s not on my list!');
      }
      if (s.round >= s.max || s.found.length >= s.answers.length) {
        endGame(s.found.length, Math.min(s.max, s.answers.length));
      } else {
        Mascot.addBotMessage('Name another! (' + (s.max - s.round) + ' tries left)');
      }
    }
  });

  // ======================================================
  //  GAME 23: RHYME TIME
  // ======================================================
  var rhymeWords = [
    { word: 'date', rhymes: ['late','gate','great','fate','mate','state','plate','rate'] },
    { word: 'sand', rhymes: ['land','hand','band','grand','stand','brand','planned'] },
    { word: 'gold', rhymes: ['bold','cold','hold','old','told','sold','fold','rolled'] },
    { word: 'sun', rhymes: ['fun','run','done','one','won','gun','bun','ton'] },
    { word: 'star', rhymes: ['car','far','bar','jar','tar','scar','are'] },
    { word: 'sea', rhymes: ['free','tree','me','key','three','be','tea','we'] }
  ];
  registerGame({
    id: 'rhyme-time', name: 'Rhyme Time', emoji: '🎵',
    init: function (s) { s.words = shuffle(rhymeWords).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'Say a word that rhymes with my word! 5 rounds of rhyming fun!'; },
    firstPrompt: function (s) { return '🎵 What rhymes with "' + s.words[0].word + '"?'; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var correct = s.words[s.idx].rhymes.indexOf(lower) !== -1;
      if (correct) { s.score++; Mascot.addBotMessage('✅ "' + lower + '" rhymes with "' + s.words[s.idx].word + '"! Nice!'); Mascot.addHappiness(1); }
      else Mascot.addBotMessage('❌ Not quite! Some rhymes: ' + s.words[s.idx].rhymes.slice(0, 3).join(', '));
      s.idx++;
      if (s.idx >= s.words.length) endGame(s.score, s.words.length);
      else Mascot.addBotMessage('🎵 What rhymes with "' + s.words[s.idx].word + '"?');
    }
  });

  // ======================================================
  //  GAME 24: SECRET WORD (Wordle-style for UAE words)
  // ======================================================
  var secretWords = ['pearl','oasis','camel','falcon','dates','souk','henna','abaya','dune','spice'];
  registerGame({
    id: 'secret-word', name: 'Secret Word', emoji: '🔤',
    init: function (s) {
      s.word = pick(secretWords); s.guesses = 0; s.max = 6;
    },
    getIntro: function (s) { return 'Guess the ' + s.word.length + '-letter UAE word! I\'ll tell you which letters are correct (🟩), misplaced (🟨), or wrong (⬜). 6 tries!'; },
    firstPrompt: function (s) { return '🔤 The word has ' + s.word.length + ' letters. Guess!'; },
    handleInput: function (msg, s) {
      var guess = msg.toLowerCase().trim();
      if (guess.length !== s.word.length) { Mascot.addBotMessage('Must be ' + s.word.length + ' letters! Try again.'); return; }
      s.guesses++;
      var result = '';
      for (var i = 0; i < s.word.length; i++) {
        if (guess[i] === s.word[i]) result += '🟩';
        else if (s.word.indexOf(guess[i]) !== -1) result += '🟨';
        else result += '⬜';
      }
      Mascot.addBotMessage(guess.toUpperCase() + '\n' + result);
      if (guess === s.word) {
        Mascot.addBotMessage('🎉 You got it in ' + s.guesses + ' tries!');
        Mascot.addHappiness(3);
        endGame(1, 1);
      } else if (s.guesses >= s.max) {
        Mascot.addBotMessage('💀 Out of tries! The word was: ' + s.word.toUpperCase());
        endGame(0, 1);
      } else {
        Mascot.addBotMessage('(' + (s.max - s.guesses) + ' tries left)');
      }
    }
  });

  // ======================================================
  //  GAME 25: MAP MASTER (UAE geography)
  // ======================================================
  var mapQs = [
    { q: 'Which emirate is on the east coast (Indian Ocean side)?', a: 'fujairah' },
    { q: 'Which emirate is the furthest north?', a: 'ras al khaimah' },
    { q: 'Which body of water borders the UAE on the north?', a: 'arabian gulf' },
    { q: 'What country borders the UAE to the south?', a: 'saudi' },
    { q: 'What country borders the UAE to the east?', a: 'oman' },
    { q: 'Which emirate is the largest by area?', a: 'abu dhabi' },
    { q: 'Which two emirates are the closest to each other (almost touching cities)?', a: 'dubai' },
    { q: 'What is the highest point in the UAE?', a: 'jebel jais' }
  ];
  registerGame({
    id: 'map-master', name: 'Map Master', emoji: '🗺️',
    init: function (s) { s.qs = shuffle(mapQs).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'Test your UAE geography knowledge! 5 questions about the map!'; },
    firstPrompt: function (s) { return '🗺️ ' + s.qs[0].q; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var correct = lower.indexOf(s.qs[s.idx].a) !== -1;
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct!'); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ The answer is: ' + s.qs[s.idx].a + '!');
      s.idx++;
      if (s.idx >= s.qs.length) endGame(s.score, s.qs.length);
      else Mascot.addBotMessage('🗺️ ' + s.qs[s.idx].q);
    }
  });

  // ======================================================
  //  GAME 26: PROVERB FINISH (complete Arabic proverbs)
  // ======================================================
  var proverbs = [
    { start: 'اللي ما يعرف الصقر...', hint: 'Complete: "...يشويه" (Those who don\'t know the falcon, grill it)', answer: 'يشويه' },
    { start: '"الصبر مفتاح ___"', hint: 'Patience is the key to...?', answer: 'الفرج' },
    { start: '"العلم نور و ___"', hint: 'Knowledge is light and ignorance is...?', answer: 'الجهل ظلام' },
    { start: '"If you want to know someone, travel with ___"', hint: 'Complete the Emirati proverb', answer: 'him' },
    { start: '"الجار قبل ___"', hint: 'The neighbor before the...?', answer: 'الدار' }
  ];
  registerGame({
    id: 'proverb-finish', name: 'Proverb Finish', emoji: '📜',
    init: function (s) { s.items = shuffle(proverbs); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'Complete the Arabic/Emirati proverbs! I\'ll give you a hint if you\'re stuck. 5 proverbs!'; },
    firstPrompt: function (s) { return '📜 ' + s.items[0].start + '\n💡 Hint: ' + s.items[0].hint; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var correct = lower.indexOf(s.items[s.idx].answer.toLowerCase()) !== -1 || msg.indexOf(s.items[s.idx].answer) !== -1;
      if (correct) { s.score++; Mascot.addBotMessage('✅ That\'s right!'); Mascot.addHappiness(2); }
      else Mascot.addBotMessage('❌ The answer was: ' + s.items[s.idx].answer);
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('📜 ' + s.items[s.idx].start + '\n💡 Hint: ' + s.items[s.idx].hint);
    }
  });

  // ======================================================
  //  GAME 27: SPEED MATH (math with UAE numbers)
  // ======================================================
  registerGame({
    id: 'speed-math', name: 'Speed Math', emoji: '🔢',
    init: function (s) {
      s.round = 0; s.max = 5; s.score = 0; s.problems = [];
      var facts = [
        { text: 'emirates in the UAE', val: 7 },
        { text: 'domes in Sheikh Zayed Mosque', val: 82 },
        { text: 'floors in Burj Khalifa', val: 163 },
        { text: 'colors on the UAE flag', val: 4 },
        { text: 'fils in a Dirham', val: 100 }
      ];
      var shuffled = shuffle(facts);
      for (var i = 0; i < s.max; i++) {
        var f = shuffled[i % shuffled.length];
        var add = Math.floor(Math.random() * 20) + 1;
        var op = pick(['+', '-']);
        var answer = op === '+' ? f.val + add : f.val - add;
        s.problems.push({ q: 'There are ' + f.val + ' ' + f.text + '. ' + (op === '+' ? 'Add' : 'Subtract') + ' ' + add + '. What do you get?', a: answer });
      }
    },
    getIntro: function () { return 'Quick math with UAE facts! Solve 5 problems!'; },
    firstPrompt: function (s) { return '🔢 ' + s.problems[0].q; },
    handleInput: function (msg, s) {
      var guess = parseInt(msg.trim());
      if (isNaN(guess)) { Mascot.addBotMessage('Type a number!'); return; }
      s.round++;
      if (guess === s.problems[s.round - 1].a) {
        s.score++;
        Mascot.addBotMessage('✅ Correct! ' + s.problems[s.round - 1].a + '!');
        Mascot.addHappiness(1);
      } else {
        Mascot.addBotMessage('❌ The answer was ' + s.problems[s.round - 1].a + '!');
      }
      if (s.round >= s.max) endGame(s.score, s.max);
      else Mascot.addBotMessage('🔢 ' + s.problems[s.round].q);
    }
  });

  // ======================================================
  //  GAME 28: EMOJI TRANSLATE
  // ======================================================
  var emojiTranslate = [
    { sentence: 'The falcon flew over the desert', answer: '🦅✈️🏜️' },
    { sentence: 'Drinking coffee with dates', answer: '☕🌴🟤' },
    { sentence: 'A camel in the sun', answer: '🐪☀️' },
    { sentence: 'Swimming in the sea with dolphins', answer: '🏊🌊🐬' },
    { sentence: 'The mosque under the moon', answer: '🕌🌙' },
    { sentence: 'A pearl in the ocean', answer: '💎🌊' },
    { sentence: 'Fireworks on National Day', answer: '🎆🇦🇪' }
  ];
  registerGame({
    id: 'emoji-translate', name: 'Emoji Translate', emoji: '💬',
    init: function (s) { s.items = shuffle(emojiTranslate).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'Translate the sentence into emojis! Use any emojis that match the meaning. 5 rounds!'; },
    firstPrompt: function (s) { return '💬 Translate to emojis:\n"' + s.items[0].sentence + '"'; },
    handleInput: function (msg, s) {
      // Any response with emojis counts — it's creative!
      var hasEmoji = /[\u{1F300}-\u{1FAFF}]/u.test(msg);
      s.score++; // Always award points for creativity
      if (hasEmoji) {
        Mascot.addBotMessage('🎨 Creative! My version: ' + s.items[s.idx].answer);
      } else {
        Mascot.addBotMessage('That works! My emoji version: ' + s.items[s.idx].answer);
      }
      Mascot.addHappiness(1);
      s.idx++;
      if (s.idx >= s.items.length) { Mascot.addSystemMessage('Great emoji skills!'); endGame(s.score, s.items.length); }
      else Mascot.addBotMessage('💬 Translate to emojis:\n"' + s.items[s.idx].sentence + '"');
    }
  });

  // ======================================================
  //  GAME 29: CATEGORY CHALLENGE
  // ======================================================
  var categoryChallenge = [
    { cat: 'Name 3 UAE cities', need: 3, answers: ['abu dhabi','dubai','sharjah','ajman','fujairah','ras al khaimah','al ain','khor fakkan'] },
    { cat: 'Name 3 traditional Emirati foods', need: 3, answers: ['machboos','luqaimat','harees','balaleet','thareed','khameer','regag','chebab'] },
    { cat: 'Name 3 animals found in the UAE', need: 3, answers: ['camel','falcon','oryx','gazelle','dolphin','flamingo','turtle','fox'] },
    { cat: 'Name 3 UAE landmarks', need: 3, answers: ['burj khalifa','dubai frame','sheikh zayed','palm','museum of the future','louvre','burj al arab'] },
    { cat: 'Name 3 Arabic words you know', need: 3, answers: ['marhaba','shukran','yalla','habibi','inshallah','mashallah','salam','ahlan'] }
  ];
  registerGame({
    id: 'category-challenge', name: 'Category Blast', emoji: '🏷️',
    init: function (s) { s.cats = shuffle(categoryChallenge).slice(0, 3); s.catIdx = 0; s.found = []; s.score = 0; s.tries = 0; },
    getIntro: function () { return 'Name items in each category! 3 categories, name 3 items each!'; },
    firstPrompt: function (s) { s.found = []; s.tries = 0; return '🏷️ ' + s.cats[0].cat + '\n(Type them one at a time)'; },
    handleInput: function (msg, s) {
      var lower = msg.toLowerCase().trim();
      var cat = s.cats[s.catIdx];
      s.tries++;
      var matched = false;
      for (var i = 0; i < cat.answers.length; i++) {
        if (lower.indexOf(cat.answers[i]) !== -1 && s.found.indexOf(cat.answers[i]) === -1) {
          s.found.push(cat.answers[i]);
          matched = true;
          s.score++;
          Mascot.addBotMessage('✅ "' + cat.answers[i] + '"! (' + s.found.length + '/' + cat.need + ')');
          Mascot.addHappiness(1);
          break;
        }
      }
      if (!matched) Mascot.addBotMessage('❌ Try another one!');
      if (s.found.length >= cat.need || s.tries >= 5) {
        s.catIdx++;
        if (s.catIdx >= s.cats.length) {
          endGame(s.score, s.cats.length * 3);
        } else {
          s.found = []; s.tries = 0;
          Mascot.addBotMessage('🏷️ Next: ' + s.cats[s.catIdx].cat + '\n(Type them one at a time)');
        }
      }
    }
  });

  // ======================================================
  //  GAME 30: TWO TRUTHS ONE LIE
  // ======================================================
  var twoTruthsItems = [
    { statements: ['The UAE has 7 emirates', 'Burj Khalifa has 163 floors', 'The UAE flag has 5 colors'], lie: 2, explain: 'The UAE flag has 4 colors (red, green, white, black)!' },
    { statements: ['Falcons have passports in the UAE', 'Dubai is the capital of the UAE', 'Oil was discovered in 1958'], lie: 1, explain: 'Abu Dhabi is the capital, not Dubai!' },
    { statements: ['The Hope Probe went to Mars', 'Jebel Jais is the tallest mountain', 'Luqaimat is a traditional drink'], lie: 2, explain: 'Luqaimat is a sweet dumpling, not a drink!' },
    { statements: ['Pearl diving was a major trade', 'The UAE was founded in 1990', 'Arabic coffee is served with dates'], lie: 1, explain: 'The UAE was founded in 1971, not 1990!' },
    { statements: ['The Dirham is the UAE currency', 'Sheikh Zayed Mosque has 82 domes', 'The UAE desert is called the Sahara'], lie: 2, explain: 'The UAE desert is the Rub\' al Khali (Empty Quarter), not the Sahara!' }
  ];
  registerGame({
    id: 'two-truths', name: 'Two Truths One Lie', emoji: '🤥',
    init: function (s) { s.items = shuffle(twoTruthsItems).slice(0, 5); s.idx = 0; s.score = 0; },
    getIntro: function () { return 'I\'ll say 3 things about the UAE. Two are TRUE, one is a LIE. Find the lie! Type 1, 2, or 3.'; },
    firstPrompt: function (s) {
      var item = s.items[0];
      return '🤥 Which is the LIE?\n1) ' + item.statements[0] + '\n2) ' + item.statements[1] + '\n3) ' + item.statements[2];
    },
    handleInput: function (msg, s) {
      var guess = parseInt(msg.trim());
      if (isNaN(guess) || guess < 1 || guess > 3) { Mascot.addBotMessage('Type 1, 2, or 3!'); return; }
      var item = s.items[s.idx];
      if (guess - 1 === item.lie) {
        s.score++;
        Mascot.addBotMessage('✅ Right! #' + guess + ' is the lie! ' + item.explain);
        Mascot.addHappiness(2);
      } else {
        Mascot.addBotMessage('❌ Nope! The lie was #' + (item.lie + 1) + '. ' + item.explain);
      }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else {
        var next = s.items[s.idx];
        Mascot.addBotMessage('🤥 Which is the LIE?\n1) ' + next.statements[0] + '\n2) ' + next.statements[1] + '\n3) ' + next.statements[2]);
      }
    }
  });

  // ── Game 31: Flag Quiz ──
  registerGame({
    id: 'flag_quiz', name: 'Flag Quiz', emoji: '🏳️',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { q: 'What are the 4 colors of the UAE flag?', a: ['red','green','white','black'], hint: 'Pan-Arab colors' },
      { q: 'Which color is on the LEFT vertical stripe of the UAE flag?', a: ['red'], hint: 'It is a warm color' },
      { q: 'The UAE flag was adopted in which year?', a: ['1971'], hint: 'Year of federation' },
      { q: 'The GREEN stripe represents...?', a: ['fertility','prosperity'], hint: 'Think of nature' },
      { q: 'The WHITE stripe represents...?', a: ['peace','honesty'], hint: 'Pure color' }
    ]).slice(0,5) }; },
    getIntro: function () { return '🏳️ Flag Quiz! Answer questions about the UAE flag!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Q1: ' + s.items[0].q + '\nHint: ' + s.items[0].hint); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var correct = item.a.some(function (a) { return lower.indexOf(a) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct!'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ The answer was: ' + item.a[0]); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Q' + (s.idx + 1) + ': ' + s.items[s.idx].q + '\nHint: ' + s.items[s.idx].hint);
    }
  });

  // ── Game 32: Capital Matcher ──
  registerGame({
    id: 'capital_matcher', name: 'Capital Matcher', emoji: '🏙️',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { emirate: 'Abu Dhabi', capital: 'abu dhabi' },
      { emirate: 'Dubai', capital: 'dubai' },
      { emirate: 'Sharjah', capital: 'sharjah' },
      { emirate: 'Ajman', capital: 'ajman' },
      { emirate: 'Fujairah', capital: 'fujairah' },
      { emirate: 'Ras Al Khaimah', capital: 'ras al khaimah' },
      { emirate: 'Umm Al Quwain', capital: 'umm al quwain' }
    ]) }; },
    getIntro: function () { return '🏙️ Capital Matcher! Name the capital city of each emirate!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('What is the capital of ' + s.items[0].emirate + '?'); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      if (lower.indexOf(item.capital) !== -1) { s.score++; Mascot.addBotMessage('✅ Correct!'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ It\'s ' + item.capital.charAt(0).toUpperCase() + item.capital.slice(1) + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('What is the capital of ' + s.items[s.idx].emirate + '?');
    }
  });

  // ── Game 33: Arabic Numbers ──
  registerGame({
    id: 'arabic_numbers', name: 'Arabic Numbers', emoji: '🔢',
    init: function () {
      var nums = [
        { arabic: '١', english: '1', word: 'wahid' }, { arabic: '٢', english: '2', word: 'ithnan' },
        { arabic: '٣', english: '3', word: 'thalatha' }, { arabic: '٤', english: '4', word: 'arba' },
        { arabic: '٥', english: '5', word: 'khamsa' }, { arabic: '٦', english: '6', word: 'sitta' },
        { arabic: '٧', english: '7', word: 'sab\'a' }, { arabic: '٨', english: '8', word: 'thamania' },
        { arabic: '٩', english: '9', word: 'tis\'a' }, { arabic: '١٠', english: '10', word: 'ashara' }
      ];
      return { score: 0, idx: 0, items: shuffle(nums).slice(0, 5) };
    },
    getIntro: function () { return '🔢 Arabic Numbers! Tell me what number this is!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('What number is this: ' + s.items[0].arabic + '?'); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      if (lower === item.english || lower.indexOf(item.word) !== -1) {
        s.score++; Mascot.addBotMessage('✅ Yes! ' + item.arabic + ' = ' + item.english + ' (' + item.word + ')'); Mascot.addHappiness(2);
      } else { Mascot.addBotMessage('❌ ' + item.arabic + ' = ' + item.english + ' (' + item.word + ')'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('What number is this: ' + s.items[s.idx].arabic + '?');
    }
  });

  // ── Game 34: Treasure Hunt ──
  registerGame({
    id: 'treasure_hunt', name: 'Treasure Hunt', emoji: '🗺️',
    init: function () {
      var tx = Math.floor(Math.random() * 5); var ty = Math.floor(Math.random() * 5);
      return { score: 0, tx: tx, ty: ty, guesses: 0, maxGuesses: 8, found: false };
    },
    getIntro: function () { return '🗺️ Treasure Hunt! Find the hidden pearl in a 5x5 desert grid! Type coordinates like A1, B3, etc. You have 8 tries!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('The pearl is hidden somewhere in the desert!\n🏜️ Grid: A-E (columns), 1-5 (rows)\nType a coordinate (e.g. B3):'); },
    handleInput: function (msg, s) {
      var m = msg.trim().toUpperCase().match(/^([A-E])([1-5])$/);
      if (!m) { Mascot.addBotMessage('Type a coordinate like A1, C4, etc.'); return; }
      var gx = m[1].charCodeAt(0) - 65; var gy = parseInt(m[2]) - 1;
      s.guesses++;
      if (gx === s.tx && gy === s.ty) {
        s.found = true; s.score = 1;
        Mascot.addBotMessage('🎉 You found the pearl at ' + m[0] + '! It took ' + s.guesses + ' tries!');
        Mascot.addHappiness(3); endGame(1, 1);
      } else {
        var dist = Math.abs(gx - s.tx) + Math.abs(gy - s.ty);
        var hint = dist <= 2 ? '🔥 Very close!' : dist <= 4 ? '🌤️ Getting warmer...' : '❄️ Cold!';
        if (s.guesses >= s.maxGuesses) { Mascot.addBotMessage('❌ Out of tries! The pearl was at ' + String.fromCharCode(65 + s.tx) + (s.ty + 1) + '!'); endGame(0, 1); }
        else Mascot.addBotMessage(hint + ' (' + (s.maxGuesses - s.guesses) + ' tries left)');
      }
    }
  });

  // ── Game 35: Tic-Tac-Toe UAE ──
  registerGame({
    id: 'tictactoe_uae', name: 'Tic-Tac-Toe UAE', emoji: '⭕',
    init: function () { return { board: ['1','2','3','4','5','6','7','8','9'], score: 0, done: false }; },
    getIntro: function () { return '⭕ Tic-Tac-Toe UAE! You are 🌙, Rashid is ⭐. Type 1-9 to place!'; },
    firstPrompt: function (s) {
      Mascot.addBotMessage(s.board[0] + ' | ' + s.board[1] + ' | ' + s.board[2] + '\n—+—+—\n' + s.board[3] + ' | ' + s.board[4] + ' | ' + s.board[5] + '\n—+—+—\n' + s.board[6] + ' | ' + s.board[7] + ' | ' + s.board[8] + '\nYour turn! Type 1-9:');
    },
    handleInput: function (msg, s) {
      if (s.done) return;
      var pos = parseInt(msg.trim()) - 1;
      if (isNaN(pos) || pos < 0 || pos > 8 || s.board[pos] === '🌙' || s.board[pos] === '⭐') { Mascot.addBotMessage('Pick an empty spot (1-9)!'); return; }
      s.board[pos] = '🌙';
      var wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      function check(mark) { return wins.some(function(w) { return s.board[w[0]] === mark && s.board[w[1]] === mark && s.board[w[2]] === mark; }); }
      function boardStr() { return s.board[0]+' | '+s.board[1]+' | '+s.board[2]+'\n—+—+—\n'+s.board[3]+' | '+s.board[4]+' | '+s.board[5]+'\n—+—+—\n'+s.board[6]+' | '+s.board[7]+' | '+s.board[8]; }
      if (check('🌙')) { s.done = true; s.score = 1; Mascot.addBotMessage(boardStr() + '\n🎉 You win!'); Mascot.addHappiness(3); endGame(1, 1); return; }
      var empty = []; s.board.forEach(function (c, i) { if (c !== '🌙' && c !== '⭐') empty.push(i); });
      if (empty.length === 0) { s.done = true; Mascot.addBotMessage(boardStr() + '\n🤝 It\'s a draw!'); Mascot.addHappiness(1); endGame(0, 1); return; }
      var ai = empty[Math.floor(Math.random() * empty.length)]; s.board[ai] = '⭐';
      if (check('⭐')) { s.done = true; Mascot.addBotMessage(boardStr() + '\n⭐ Rashid wins! Better luck next time!'); endGame(0, 1); return; }
      empty = []; s.board.forEach(function (c, i) { if (c !== '🌙' && c !== '⭐') empty.push(i); });
      if (empty.length === 0) { s.done = true; Mascot.addBotMessage(boardStr() + '\n🤝 It\'s a draw!'); Mascot.addHappiness(1); endGame(0, 1); return; }
      Mascot.addBotMessage(boardStr() + '\nYour turn! Type 1-9:');
    }
  });

  // ── Game 36: Geography Bingo ──
  registerGame({
    id: 'geography_bingo', name: 'Geography Bingo', emoji: '🗾',
    init: function () {
      var all = shuffle(['Persian Gulf','Arabian Sea','Hajar Mountains','Rub al Khali','Dubai Creek','Palm Jumeirah','Yas Island','Sir Bani Yas','Al Ain Oasis','Liwa Oasis','Jebel Jais','Khor Fakkan','Hatta','Abu Dhabi Island','Saadiyat Island']);
      return { score: 0, idx: 0, items: all.slice(0, 6), hints: [
        'Body of water north of the UAE', 'Body of water east of the UAE', 'Mountain range in the UAE',
        'Vast desert (Empty Quarter)', 'Historic waterway in Dubai', 'Man-made island shaped like a tree',
        'Island with Ferrari World', 'Nature island with wildlife', 'Famous oasis city in Abu Dhabi',
        'Oasis near the Empty Quarter', 'Highest peak in the UAE', 'Coastal city in Fujairah',
        'Mountain town near Dubai', 'Capital is on this island', 'Cultural island in Abu Dhabi'
      ].slice(0, 6) };
    },
    getIntro: function () { return '🗾 Geography Bingo! I\'ll describe a UAE place — name it!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Place 1/6: ' + s.hints[0]); },
    handleInput: function (msg, s) {
      var lower = msg.trim().toLowerCase(); var target = s.items[s.idx].toLowerCase();
      if (lower.indexOf(target.split(' ')[0].toLowerCase()) !== -1 || target.indexOf(lower) !== -1) {
        s.score++; Mascot.addBotMessage('✅ Yes! It\'s ' + s.items[s.idx] + '!'); Mascot.addHappiness(2);
      } else { Mascot.addBotMessage('❌ It was ' + s.items[s.idx] + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Place ' + (s.idx + 1) + '/' + s.items.length + ': ' + s.hints[s.idx]);
    }
  });

  // ── Game 37: UAE Timeline Race ──
  registerGame({
    id: 'timeline_race', name: 'Timeline Race', emoji: '⏱️',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { event: 'UAE Federation founded', year: 1971 },
      { event: 'Burj Khalifa opened', year: 2010 },
      { event: 'Dubai Expo started', year: 2020 },
      { event: 'Oil discovered in Abu Dhabi', year: 1958 },
      { event: 'Emirates airline founded', year: 1985 },
      { event: 'UAE\'s first astronaut in space', year: 2019 },
      { event: 'Hope Probe reached Mars', year: 2021 },
      { event: 'Palm Jumeirah completed', year: 2006 }
    ]).slice(0, 5) }; },
    getIntro: function () { return '⏱️ Timeline Race! Guess the year of each UAE event! (Within 3 years counts!)'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Event 1: ' + s.items[0].event + '\nWhat year?'); },
    handleInput: function (msg, s) {
      var guess = parseInt(msg.trim()); var item = s.items[s.idx];
      if (isNaN(guess)) { Mascot.addBotMessage('Type a year!'); return; }
      if (Math.abs(guess - item.year) <= 3) { s.score++; Mascot.addBotMessage('✅ Close enough! It was ' + item.year + '!'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ It was ' + item.year + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Event ' + (s.idx + 1) + ': ' + s.items[s.idx].event + '\nWhat year?');
    }
  });

  // ── Game 38: Ingredient Match ──
  registerGame({
    id: 'ingredient_match', name: 'Ingredient Match', emoji: '🍽️',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { dish: 'Machboos', ingredients: ['rice','meat','spices','onion'], answer: 'machboos' },
      { dish: 'Luqaimat', ingredients: ['flour','sugar','saffron','cardamom'], answer: 'luqaimat' },
      { dish: 'Harees', ingredients: ['wheat','meat','butter','salt'], answer: 'harees' },
      { dish: 'Thareed', ingredients: ['bread','vegetables','meat','broth'], answer: 'thareed' },
      { dish: 'Balaleet', ingredients: ['vermicelli','eggs','sugar','cardamom'], answer: 'balaleet' },
      { dish: 'Khameer', ingredients: ['flour','dates','yeast','butter'], answer: 'khameer' }
    ]).slice(0, 5) }; },
    getIntro: function () { return '🍽️ Ingredient Match! I\'ll give you ingredients — guess the Emirati dish!'; },
    firstPrompt: function (s) { var i = s.items[0]; Mascot.addBotMessage('Dish 1: Made with ' + i.ingredients.join(', ') + '\nWhat dish is it?'); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      if (lower.indexOf(item.answer) !== -1) { s.score++; Mascot.addBotMessage('✅ Yes! It\'s ' + item.dish + '!'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ It was ' + item.dish + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else { var next = s.items[s.idx]; Mascot.addBotMessage('Dish ' + (s.idx + 1) + ': Made with ' + next.ingredients.join(', ') + '\nWhat dish is it?'); }
    }
  });

  // ── Game 39: Dress Up Quiz ──
  registerGame({
    id: 'dress_up', name: 'Dress Up Quiz', emoji: '👘',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { q: 'What is the white robe worn by Emirati men called?', a: ['kandura','dishdasha','thawb'] },
      { q: 'What is the headscarf worn by Emirati men?', a: ['ghutrah','ghutra','keffiyeh'] },
      { q: 'What holds the ghutrah in place on the head?', a: ['agal','igal','egal'] },
      { q: 'What is the black cloak worn by Emirati women called?', a: ['abaya'] },
      { q: 'What is the face covering sometimes worn by older Emirati women?', a: ['burqa','burka','batula'] },
      { q: 'What is the headscarf worn by Emirati women called?', a: ['sheila','shayla'] },
      { q: 'What perfume ingredient is popular in UAE traditional dress?', a: ['oud','aoud'] }
    ]).slice(0, 5) }; },
    getIntro: function () { return '👘 Dress Up Quiz! Test your knowledge of traditional Emirati clothing!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Q1: ' + s.items[0].q); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var correct = item.a.some(function (a) { return lower.indexOf(a) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct! (' + item.a[0] + ')'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ The answer is: ' + item.a[0]); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Q' + (s.idx + 1) + ': ' + s.items[s.idx].q);
    }
  });

  // ── Game 40: Animal Safari ──
  registerGame({
    id: 'animal_safari', name: 'Animal Safari', emoji: '🐪',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { clue: 'I am called the "ship of the desert" and am a symbol of the UAE', a: ['camel'] },
      { clue: 'I am a bird of prey used in the traditional sport of the UAE', a: ['falcon','hawk'] },
      { clue: 'I am a large cat that can be found in some UAE zoos and was once kept as a pet', a: ['cheetah','leopard'] },
      { clue: 'I am a hoofed animal found in the Arabian desert, similar to a deer', a: ['oryx','gazelle','arabian oryx'] },
      { clue: 'I am a sea creature with a hard shell, protected in UAE waters', a: ['turtle','sea turtle','hawksbill'] },
      { clue: 'I am a pink bird found in UAE wetlands', a: ['flamingo'] },
      { clue: 'I am the national animal of the UAE', a: ['oryx','arabian oryx'] }
    ]).slice(0, 5) }; },
    getIntro: function () { return '🐪 Animal Safari! Guess the UAE animal from the clue!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Animal 1: ' + s.items[0].clue + '\nWhat am I?'); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var correct = item.a.some(function (a) { return lower.indexOf(a) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Yes! 🎉'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ It was: ' + item.a[0] + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Animal ' + (s.idx + 1) + ': ' + s.items[s.idx].clue + '\nWhat am I?');
    }
  });

  // ── Game 41: Architecture Quiz ──
  registerGame({
    id: 'architecture_quiz', name: 'Architecture Quiz', emoji: '🏗️',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { q: 'What is the tallest building in the world, located in Dubai?', a: ['burj khalifa'] },
      { q: 'What sail-shaped hotel is a symbol of Dubai?', a: ['burj al arab'] },
      { q: 'What is the name of Abu Dhabi\'s grand white mosque?', a: ['sheikh zayed','grand mosque'] },
      { q: 'What museum on Saadiyat Island shares its name with a Paris museum?', a: ['louvre'] },
      { q: 'What twisted tower in Dubai is called Cayan Tower or...?', a: ['infinity tower','cayan'] },
      { q: 'What Dubai frame-shaped landmark stands 150m tall?', a: ['dubai frame','frame'] },
      { q: 'What is the name of the man-made island shaped like a palm tree?', a: ['palm jumeirah','palm'] }
    ]).slice(0, 5) }; },
    getIntro: function () { return '🏗️ Architecture Quiz! Name these famous UAE buildings!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Building 1: ' + s.items[0].q); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var correct = item.a.some(function (a) { return lower.indexOf(a) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct! 🏛️'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ It\'s ' + item.a[0] + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Building ' + (s.idx + 1) + ': ' + s.items[s.idx].q);
    }
  });

  // ── Game 42: Poetry Builder ──
  registerGame({
    id: 'poetry_builder', name: 'Poetry Builder', emoji: '📜',
    init: function () {
      var starters = shuffle([
        'The desert wind whispers',
        'Golden dunes stretch far',
        'The falcon soars high',
        'Under starlit skies',
        'The pearl diver dives',
        'Oasis palms sway gently'
      ]);
      return { score: 0, idx: 0, lines: [starters[0]], maxLines: 6 };
    },
    getIntro: function () { return '📜 Poetry Builder! We\'ll write a UAE poem together, line by line! I start, you add the next line!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Our poem so far:\n🖊️ "' + s.lines[0] + '"\n\nAdd the next line:'); },
    handleInput: function (msg, s) {
      var line = msg.trim();
      if (line.length < 3) { Mascot.addBotMessage('Write at least a few words!'); return; }
      s.lines.push(line); s.score++;
      Mascot.addHappiness(1);
      var rashidLines = [
        'Across the seven emirates wide',
        'Where ancient trade routes used to be',
        'With camels crossing golden sands',
        'The dhow sails on the azure sea',
        'And children learn of heritage'
      ];
      if (s.lines.length < s.maxLines) {
        var rashidLine = rashidLines[Math.min(s.idx, rashidLines.length - 1)];
        s.lines.push(rashidLine); s.idx++;
        Mascot.addBotMessage('Our poem:\n' + s.lines.map(function (l) { return '🖊️ "' + l + '"'; }).join('\n') + '\n\nYour turn! Add a line:');
      } else {
        Mascot.addBotMessage('🎉 Our finished poem:\n\n' + s.lines.map(function (l) { return '  ' + l; }).join('\n') + '\n\nBeautiful! 📜');
        endGame(s.score, s.score);
      }
    }
  });

  // ── Game 43: Cultural Etiquette ──
  registerGame({
    id: 'cultural_etiquette', name: 'Cultural Etiquette', emoji: '🤝',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { q: 'When greeting an Emirati, which hand do you use to shake?', a: 'right', opts: 'A) Right hand  B) Left hand  C) Both hands' },
      { q: 'When visiting an Emirati home, should you remove your shoes?', a: 'yes', opts: 'A) Yes  B) No  C) Only sometimes' },
      { q: 'Is it polite to refuse Arabic coffee when offered?', a: 'no', opts: 'A) Yes  B) No, accept at least one cup  C) Doesn\'t matter' },
      { q: 'What do you say to thank someone in Arabic?', a: 'shukran', opts: 'A) Marhaba  B) Shukran  C) Yalla' },
      { q: 'During Ramadan, is it respectful to eat in public during fasting hours?', a: 'no', opts: 'A) Yes  B) No  C) Only indoors' },
      { q: 'When given a business card, should you look at it or put it away immediately?', a: 'look', opts: 'A) Put it away immediately  B) Look at it respectfully  C) Write on it' }
    ]).slice(0, 5) }; },
    getIntro: function () { return '🤝 Cultural Etiquette! Learn about UAE customs and manners!'; },
    firstPrompt: function (s) { var i = s.items[0]; Mascot.addBotMessage('Q1: ' + i.q + '\n' + i.opts); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      if (lower.indexOf(item.a) !== -1 || (item.a === 'right' && lower.indexOf('a') === 0) || (item.a === 'yes' && lower.indexOf('a') === 0) || (item.a === 'no' && lower.indexOf('b') === 0) || (item.a === 'shukran' && lower.indexOf('b') === 0) || (item.a === 'look' && lower.indexOf('b') === 0)) {
        s.score++; Mascot.addBotMessage('✅ That\'s right! Great cultural awareness!'); Mascot.addHappiness(2);
      } else { Mascot.addBotMessage('❌ The correct answer involves: ' + item.a + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else { var next = s.items[s.idx]; Mascot.addBotMessage('Q' + (s.idx + 1) + ': ' + next.q + '\n' + next.opts); }
    }
  });

  // ── Game 44: Island Explorer ──
  registerGame({
    id: 'island_explorer', name: 'Island Explorer', emoji: '🏝️',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { island: 'Yas Island', clue: 'Home to Ferrari World and Yas Marina Circuit', a: ['yas'] },
      { island: 'Saadiyat Island', clue: 'Cultural district with Louvre Abu Dhabi', a: ['saadiyat'] },
      { island: 'Palm Jumeirah', clue: 'Palm-tree shaped island in Dubai', a: ['palm','jumeirah'] },
      { island: 'Sir Bani Yas', clue: 'Nature reserve island with Arabian wildlife', a: ['sir bani','bani yas'] },
      { island: 'Bluewaters Island', clue: 'Home to Ain Dubai, the world\'s largest Ferris wheel', a: ['bluewaters','bluewater'] },
      { island: 'The World Islands', clue: 'Cluster of man-made islands shaped like a world map', a: ['world'] },
      { island: 'Al Marjan Island', clue: 'Coral-shaped island in Ras Al Khaimah', a: ['marjan'] }
    ]).slice(0, 5) }; },
    getIntro: function () { return '🏝️ Island Explorer! Name the UAE island from the description!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Island 1: ' + s.items[0].clue + '\nWhich island?'); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var correct = item.a.some(function (a) { return lower.indexOf(a) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Yes! ' + item.island + '! 🏝️'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ It was ' + item.island + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Island ' + (s.idx + 1) + ': ' + s.items[s.idx].clue + '\nWhich island?');
    }
  });

  // ── Game 45: Ruler Match ──
  registerGame({
    id: 'ruler_match', name: 'Ruler Match', emoji: '👑',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { q: 'Who is known as the founder of the UAE?', a: ['sheikh zayed','zayed'] },
      { q: 'Which emirate is ruled by the Al Maktoum family?', a: ['dubai'] },
      { q: 'Which emirate is ruled by the Al Nahyan family?', a: ['abu dhabi'] },
      { q: 'Sheikh Zayed bin Sultan Al Nahyan was the ruler of which emirate?', a: ['abu dhabi'] },
      { q: 'What year did Sheikh Zayed become the first president of the UAE?', a: ['1971'] },
      { q: 'The UAE is made up of how many emirates?', a: ['7','seven'] }
    ]).slice(0, 5) }; },
    getIntro: function () { return '👑 Ruler Match! Test your knowledge of UAE leadership!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Q1: ' + s.items[0].q); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var correct = item.a.some(function (a) { return lower.indexOf(a) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct! 👑'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ The answer is: ' + item.a[0]); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Q' + (s.idx + 1) + ': ' + s.items[s.idx].q);
    }
  });

  // ── Game 46: Transport Quiz ──
  registerGame({
    id: 'transport_quiz', name: 'Transport Quiz', emoji: '🚇',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { q: 'What is the name of Dubai\'s driverless metro system?', a: ['dubai metro','metro'] },
      { q: 'What traditional wooden boat is used for crossing Dubai Creek?', a: ['abra'] },
      { q: 'What is the name of the UAE\'s national airline based in Abu Dhabi?', a: ['etihad'] },
      { q: 'What is the name of Dubai\'s famous airline?', a: ['emirates'] },
      { q: 'What suspended cable car system takes you up Jebel Jais?', a: ['jais','zipline','cable'] },
      { q: 'What monorail runs along Palm Jumeirah?', a: ['palm monorail','monorail'] },
      { q: 'What kind of taxi travels on Dubai\'s waterways?', a: ['water taxi','ferry','abra'] }
    ]).slice(0, 5) }; },
    getIntro: function () { return '🚇 Transport Quiz! How well do you know UAE transportation?'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Q1: ' + s.items[0].q); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var correct = item.a.some(function (a) { return lower.indexOf(a) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Right! 🚇'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ It\'s ' + item.a[0] + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Q' + (s.idx + 1) + ': ' + s.items[s.idx].q);
    }
  });

  // ── Game 47: Festival Quiz ──
  registerGame({
    id: 'festival_quiz', name: 'Festival Quiz', emoji: '🎊',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { q: 'What month-long Islamic fasting celebration is observed in the UAE?', a: ['ramadan'] },
      { q: 'What holiday celebrates the end of Ramadan?', a: ['eid al fitr','eid'] },
      { q: 'What is UAE National Day, celebrated on December 2nd?', a: ['national day','independence','federation'] },
      { q: 'What festival of sacrifice is one of the biggest holidays in the UAE?', a: ['eid al adha','adha'] },
      { q: 'What Dubai event is the city\'s biggest shopping festival, held in January?', a: ['dubai shopping festival','dsf','shopping festival'] },
      { q: 'What is the name of the Abu Dhabi festival celebrating heritage and culture?', a: ['qasr al hosn','heritage'] }
    ]).slice(0, 5) }; },
    getIntro: function () { return '🎊 Festival Quiz! How well do you know UAE celebrations?'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Q1: ' + s.items[0].q); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var correct = item.a.some(function (a) { return lower.indexOf(a) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Correct! 🎉'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ It\'s ' + item.a[0] + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Q' + (s.idx + 1) + ': ' + s.items[s.idx].q);
    }
  });

  // ── Game 48: Color Challenge ──
  registerGame({
    id: 'color_challenge', name: 'Color Challenge', emoji: '🎨',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { q: 'What color is the desert sand in the UAE?', a: ['gold','golden','yellow','orange','tan'] },
      { q: 'What color are most traditional Emirati men\'s kanduras?', a: ['white'] },
      { q: 'What color is the Arabian Gulf water on a sunny day?', a: ['blue','turquoise','teal','aqua'] },
      { q: 'What color are dates when they are ripe?', a: ['brown','dark','amber'] },
      { q: 'What color is the precious stone found in UAE waters (hint: oysters)?', a: ['white','cream','pearl'] },
      { q: 'What color is henna, used for decorating hands?', a: ['red','brown','orange','reddish'] },
      { q: 'What color is Arabic coffee (gahwa)?', a: ['brown','gold','golden','amber'] }
    ]).slice(0, 5) }; },
    getIntro: function () { return '🎨 Color Challenge! Name the color associated with these UAE things!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Color 1: ' + s.items[0].q); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var correct = item.a.some(function (a) { return lower.indexOf(a) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Yes! 🎨'); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ Think: ' + item.a[0] + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Color ' + (s.idx + 1) + ': ' + s.items[s.idx].q);
    }
  });

  // ── Game 49: Arabic Greetings ──
  registerGame({
    id: 'arabic_greetings', name: 'Arabic Greetings', emoji: '🗣️',
    init: function () { return { score: 0, idx: 0, items: shuffle([
      { arabic: 'As-salamu alaykum', meaning: 'Peace be upon you (the universal Arabic greeting)', a: ['peace','salaam','salam'] },
      { arabic: 'Marhaba', meaning: 'Hello / Welcome', a: ['hello','welcome','hi'] },
      { arabic: 'Shukran', meaning: 'Thank you', a: ['thank'] },
      { arabic: 'Inshallah', meaning: 'God willing / hopefully', a: ['god willing','hopefully','will'] },
      { arabic: 'Mashallah', meaning: 'God has willed it (expression of appreciation)', a: ['appreciation','god','willed','wow','amazing'] },
      { arabic: 'Yalla', meaning: 'Let\'s go / Come on / Hurry up', a: ['go','hurry','come on','let'] },
      { arabic: 'Habibi', meaning: 'My dear / My love (term of endearment)', a: ['dear','love','friend','endearment'] },
      { arabic: 'Ma\'a salama', meaning: 'Goodbye (with peace)', a: ['goodbye','bye','peace'] }
    ]).slice(0, 5) }; },
    getIntro: function () { return '🗣️ Arabic Greetings! I\'ll say an Arabic phrase — tell me what it means!'; },
    firstPrompt: function (s) { Mascot.addBotMessage('Phrase 1: "' + s.items[0].arabic + '"\nWhat does it mean?'); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var correct = item.a.some(function (a) { return lower.indexOf(a) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Yes! "' + item.arabic + '" means: ' + item.meaning); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ "' + item.arabic + '" means: ' + item.meaning); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else Mascot.addBotMessage('Phrase ' + (s.idx + 1) + ': "' + s.items[s.idx].arabic + '"\nWhat does it mean?');
    }
  });

  // ── Game 50: UAE Bucket List ──
  registerGame({
    id: 'bucket_list', name: 'UAE Bucket List', emoji: '✈️',
    init: function () {
      var activities = shuffle([
        { activity: 'Skydiving over Palm Jumeirah', emoji: '🪂', location: 'Dubai' },
        { activity: 'Visiting the Louvre Abu Dhabi', emoji: '🖼️', location: 'Abu Dhabi' },
        { activity: 'Dune bashing in the desert', emoji: '🏜️', location: 'Dubai/Abu Dhabi' },
        { activity: 'Climbing Jebel Jais', emoji: '⛰️', location: 'Ras Al Khaimah' },
        { activity: 'Visiting Ferrari World', emoji: '🏎️', location: 'Abu Dhabi' },
        { activity: 'Riding a camel at sunset', emoji: '🐫', location: 'Al Ain' },
        { activity: 'Kayaking through mangroves', emoji: '🛶', location: 'Abu Dhabi' },
        { activity: 'Shopping at the Gold Souk', emoji: '💰', location: 'Dubai' },
        { activity: 'Watching sunset from Burj Khalifa', emoji: '🌅', location: 'Dubai' },
        { activity: 'Snorkeling at Fujairah beach', emoji: '🤿', location: 'Fujairah' }
      ]);
      return { score: 0, idx: 0, items: activities.slice(0, 5) };
    },
    getIntro: function () { return '✈️ UAE Bucket List! Guess which emirate each activity is in!'; },
    firstPrompt: function (s) { var i = s.items[0]; Mascot.addBotMessage(i.emoji + ' Activity 1: ' + i.activity + '\nWhich emirate is this in?'); },
    handleInput: function (msg, s) {
      var item = s.items[s.idx]; var lower = msg.trim().toLowerCase();
      var loc = item.location.toLowerCase();
      var parts = loc.split('/');
      var correct = parts.some(function (p) { return lower.indexOf(p.trim()) !== -1; });
      if (correct) { s.score++; Mascot.addBotMessage('✅ Yes! ' + item.activity + ' is in ' + item.location + '! ' + item.emoji); Mascot.addHappiness(2); }
      else { Mascot.addBotMessage('❌ It\'s in ' + item.location + '!'); }
      s.idx++;
      if (s.idx >= s.items.length) endGame(s.score, s.items.length);
      else { var next = s.items[s.idx]; Mascot.addBotMessage(next.emoji + ' Activity ' + (s.idx + 1) + ': ' + next.activity + '\nWhich emirate is this in?'); }
    }
  });

  // === PUBLIC API ===
  return {
    startGame: startGame,
    handleInput: handleInput,
    cancelGame: cancelGame,
    isGameActive: isGameActive,
    renderMenu: renderMenu,
    endGame: endGame
  };
})();
