/* ============================================
   i18n — Arabic / English language switcher
   ============================================ */

const TRANSLATIONS = {
  en: {
    // Nav
    home: 'HOME',
    landmarks: 'LANDMARKS',
    traditions: 'TRADITIONS',
    food: 'FOOD',
    arabic: 'ARABIC',
    quiz: 'QUIZ',
    match: 'MATCH',
    uaeCulture: 'UAE CULTURE',

    // Hero
    welcomeBack: 'WELCOME BACK,',
    heroTitle1: 'UAE CULTURE',
    heroTitle2: 'LEARNING KIDS',
    heroSubtitle: 'Follow the learning path below — earn XP, unlock badges, and become a UAE Legend!',
    games: 'GAMES',
    questions: 'QUESTIONS',
    arabicWords: 'ARABIC WORDS',
    badges: 'BADGES',

    // Learning path
    yourLearningPath: 'YOUR LEARNING PATH',
    followThe: 'Follow the',
    journey: 'Journey',
    pathSubtitle: 'Complete each step to unlock the next. Learn first, then test your skills!',
    unit1: 'UNIT 1 — UAE BASICS',
    unit2: 'UNIT 2 — FLAVORS & LANGUAGE',
    unit3: 'UNIT 3 — QUIZ TIME',
    unit4: 'UNIT 4 — WORD GAMES',
    unit5: 'UNIT 5 — SPEED & LISTEN',
    uaeLegend: 'UAE LEGEND',
    learn: 'LEARN',
    play: 'PLAY',
    speed: 'SPEED',
    listen: 'LISTEN',

    // Node labels
    landmarksLabel: 'Landmarks',
    traditionsLabel: 'Traditions',
    foodLabel: 'Food',
    arabicLabel: 'Arabic',
    cultureQuiz: 'Culture Quiz',
    matchCards: 'Match Cards',
    fillBlank: 'Fill Blank',
    scramble: 'Scramble',
    trueFalse: 'True/False',
    listening: 'Listening',

    // Badges
    achievements: 'ACHIEVEMENTS',
    your: 'Your',
    badgesTitle: 'Badges',
    badgesSubtitle: 'Complete challenges to unlock all 10 badges!',

    // Facts
    didYouKnow: 'DID YOU KNOW?',
    funFacts: 'Fun Facts',

    // CTA
    ready: 'READY?',
    startLearningNow: 'Start Learning Now',
    beginWithLandmarks: 'BEGIN WITH LANDMARKS',

    // Game common
    start: 'START',
    next: 'NEXT',
    seeResults: 'SEE RESULTS',
    score: 'SCORE',
    playAgain: 'Play Again',
    homeBtn: 'Home',
    check: 'Check',
    clear: 'Clear',

    // Page headers
    famousUae: 'Famous UAE',
    landmarksPage: 'Landmarks',
    uaeTraditions: 'UAE',
    traditionsPage: 'Traditions',
    traditionalUae: 'Traditional UAE',
    foodPage: 'Food',
    wordScramble: 'Word',
    scramblePage: 'Scramble',
    listeningChallenge: 'Listening',
    challengePage: 'Challenge',
    trueOrFalse: 'True',
    falsePage: 'or False',
    completeThe: 'Complete',
    sentencePage: 'the Sentence',

    // Fill blank
    fillBlankTitle: 'Fill in the Blank',
    fillBlankDesc: 'Read each sentence and pick the correct word from the choices below. 10 sentences to complete!',
    fillBlankHeader: 'Choose the right word to complete each sentence about UAE culture',

    // True/false
    trueFalseTitle: 'True or False Speed Round!',
    trueFalseDesc: 'Read each statement and decide if it\'s TRUE or FALSE. The timer is ticking!',
    trueFalseHeader: '15 statements — how fast can you answer them all?',
    trueBtn: 'TRUE',
    falseBtn: 'FALSE',

    // Listening
    listeningTitle: 'Listening Challenge',
    listeningDesc: 'You\'ll hear an Arabic word spoken aloud. Pick the correct English meaning from 4 options!',
    listeningHeader: 'Hear the Arabic word and pick the English meaning',
    tapToHear: 'Tap to hear the word',

    // Scramble
    scrambleTitle: 'Word Scramble Challenge',
    scrambleDesc: 'The letters are all mixed up! Tap them in the right order to spell the word. 10 words to unscramble!',
    scrambleHeader: 'Unscramble the letters to spell UAE landmarks, foods, and traditions',

    // Timeline
    timeline: 'TIMELINE',
    timelineLabel: 'Timeline',
    timelineWord: 'Timeline',
    timelineSort: 'Sort',
    sort: 'SORT',
    unit6: 'UNIT 6 — HISTORY',
    timelineTitle: 'Timeline Sort Challenge',
    timelineDesc: 'Drag UAE historical events into the correct chronological order. Oldest first, newest last!',
    timelineHeader: 'Sort the events from earliest to latest',
    timelineDragHint: 'Drag events to reorder them, then check your answer!',

    // Results
    correctAnswers: 'Correct answers',
    completionBonus: 'Completion bonus',
    perfectBonus: 'Perfect bonus!',
    total: 'Total',

    // Splash
    splashWelcome: 'Welcome, young explorer! You are about to go on an amazing journey through the United Arab Emirates!',
    letsGo: "LET'S GO!",
    whatYouDiscover: "What You'll",
    discover: 'Discover',
    famousLandmarks: 'Famous Landmarks',
    landmarksDesc: 'Burj Khalifa, Sheikh Zayed Mosque, and more!',
    ancientTraditions: 'Ancient Traditions',
    traditionsDesc: 'Falconry, pearl diving, camel racing',
    traditionalFood: 'Traditional Food',
    foodDesc: 'Machboos, Luqaimat, and delicious dishes',
    arabicWordsTitle: 'Arabic Words',
    arabicDesc: 'Learn how to say Hello, Thank you, and more!',
    whatElse: 'WHAT ELSE?',
    howItWorks: 'How It',
    works: 'Works',
    readLearn: 'Read & Learn',
    readLearnDesc: 'Each page teaches you cool facts with a voice that reads to you!',
    playGames: 'Play Games',
    playGamesDesc: 'Quizzes, scrambles, matching, true/false — 8 different games!',
    levelUp: 'Level Up!',
    levelUpDesc: 'Earn XP, keep your streak, unlock badges, and become a Legend!',
    almostReady: 'ALMOST READY!',
    whatsYourName: "What's Your",
    name: 'Name',
    namePrompt: 'Tell us your name so we can track your progress!',
    namePlaceholder: 'Type your name here...',
    startExploring: 'START EXPLORING!',

    // Mascot — Rashid (splash + hero)
    mascotSplash1: "Marhaba! I'm Rashid! Welcome to UAE Culture Quest!",
    mascotSplash2: "We'll explore landmarks, traditions, food, and learn Arabic words!",
    mascotSplash3: "It's easy! Learn, play games, and earn XP and badges!",
    mascotSplash4: "What's your name, friend? Type it below!",
    mascotHeroGreeting: "Welcome back! Ready for more UAE adventures?",

    // Mascot — correct/wrong (5 each for variety)
    mascotCorrect1: "Amazing! You got it right!",
    mascotCorrect2: "Mashallah! You're so smart!",
    mascotCorrect3: "Perfect answer! Keep going!",
    mascotCorrect4: "Yalla! You're on fire!",
    mascotCorrect5: "Brilliant! You're a true UAE champion!",
    mascotWrong1: "Don't worry, we learn together!",
    mascotWrong2: "Almost! You'll get it next time!",
    mascotWrong3: "It's okay! Learning takes practice!",
    mascotWrong4: "Oops! But every mistake helps you learn!",
    mascotWrong5: "No worries, habibi! Try again!",

    // Mascot — results
    mascotResultsGreat: "You did amazing! I'm so proud of you!",
    mascotResultsGood: "Great job! You're learning so fast!",
    mascotResultsTry: "Don't give up! Let's try again together!",
    mascotThinking: "Hmm, let me think about this one...",

    // Mascot — tips (10 fun facts)
    mascotTip1: "Did you know falcons have their own passports in the UAE?",
    mascotTip2: "The Burj Khalifa is over 828 meters tall!",
    mascotTip3: "Luqaimat are sweet little dumplings — so yummy!",
    mascotTip4: "The UAE has 7 emirates — can you name them all?",
    mascotTip5: "Arabic coffee (gahwa) is served with dates as a welcome!",
    mascotTip6: "The Sheikh Zayed Grand Mosque has 82 domes!",
    mascotTip7: "Pearl diving was the main trade before oil was discovered!",
    mascotTip8: "The UAE flag colors are red, green, white, and black!",
    mascotTip9: "Camels are called 'ships of the desert' in Arabic!",
    mascotTip10: "'Yalla' means 'let's go' — it's the most popular word!",

    // Mascot — page greetings
    mascotGreetQuiz: "Time for a quiz! I'll be here if you need help. Good luck!",
    mascotGreetFill: "Fill in the blanks! Read each sentence carefully and pick the right word!",
    mascotGreetTF: "True or False time! Think fast — the timer is running!",
    mascotGreetListen: "Listen carefully! I'll play Arabic words and you pick the meaning!",
    mascotGreetScramble: "Unscramble the letters! Tap them in the right order to spell the word!",
    mascotGreetMatching: "Memory game! Flip the cards and find matching pairs. Ready?",
    mascotGreetLandmarks: "Welcome to UAE Landmarks! Let me show you the most amazing places!",
    mascotGreetTraditions: "Let's explore Emirati traditions — falconry, pearl diving, and more!",
    mascotGreetFood: "Mmm, Emirati food! Get ready to learn about delicious dishes!",
    mascotGreetArabic: "Marhaba! Let's learn some Arabic words together!",
    mascotGreetTimeline: "History time! Drag the events into the right order — oldest first!",

    // Mascot — chat responses
    mascotChatHello: "Marhaba! Hello, my friend! How can I help you today?",
    mascotChatName: "My name is Rashid! I'm your Emirati friend and guide!",
    mascotChatHelp: "I'm here to help! You can learn about UAE culture, play games, and earn badges. Just click on any topic in the menu!",
    mascotChatUAE: "The UAE is amazing! It has 7 emirates: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah!",
    mascotChatFood: "Emirati food is delicious! Try learning about Machboos (spiced rice), Luqaimat (sweet dumplings), and Harees (wheat porridge)!",
    mascotChatLandmarks: "The UAE has incredible landmarks! The Burj Khalifa, Sheikh Zayed Mosque, Dubai Frame, and Museum of the Future are must-sees!",
    mascotChatTraditions: "Emirati traditions are beautiful! Falconry, pearl diving, camel racing, and Arabic coffee ceremonies are part of our heritage!",
    mascotChatArabic: "Let me teach you! 'Marhaba' means hello, 'Shukran' means thank you, and 'Yalla' means let's go!",
    mascotChatGames: "We have so many games! Quiz, Fill the Blank, True or False, Listening, Word Scramble, and Memory Match. Pick one and let's play!",
    mascotChatBye: "Ma'a salama! See you soon, my friend! Come back anytime!",
    mascotChatThanks: "You're welcome, habibi! I'm always happy to help!",
    mascotChatLove: "Aww, I love you too! You make learning so much fun!",
    mascotChatWho: "I'm Rashid! I'm a young Emirati boy wearing a kandura and ghutrah. I'm your guide to UAE culture!",
    mascotChatFallback1: "Hmm, I'm not sure about that! But I know lots about UAE culture — try asking me about food, landmarks, or traditions!",
    mascotChatFallback2: "That's interesting! I'm best at teaching about the UAE. Ask me about Arabic words, games, or Emirati heritage!",
    mascotChatFallback3: "Good question! I'm still learning too. Want to know about UAE landmarks, food, or traditions instead?",
    mascotChatAsk: "Hi! I'm Rashid! Ask me anything about UAE culture, or just say hello!",

    // Mascot — expanded knowledge (emirates + topics)
    mascotChatAbuDhabi: "Abu Dhabi is the capital of the UAE! It has the stunning Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, and the beautiful Corniche!",
    mascotChatDubai: "Dubai is the city of the future! Home to Burj Khalifa, Palm Jumeirah, Dubai Mall, and the incredible Museum of the Future!",
    mascotChatSharjah: "Sharjah is the cultural capital! It has amazing museums, the Sharjah Art Foundation, and was named UNESCO's Cultural Capital!",
    mascotChatAjman: "Ajman is the smallest emirate but full of charm! It has beautiful beaches, the Ajman Museum in an old fort, and a lovely corniche!",
    mascotChatFujairah: "Fujairah is on the east coast facing the Indian Ocean! It has mountains, waterfalls, the ancient Fujairah Fort, and Al Bidyah Mosque — the oldest in the UAE!",
    mascotChatRAK: "Ras Al Khaimah has amazing nature! Jebel Jais is the highest mountain in the UAE, and it has the world's longest zipline!",
    mascotChatUAQ: "Umm Al Quwain is peaceful and beautiful! It has mangrove forests, old forts, and amazing bird-watching spots!",
    mascotChatBurjKhalifa: "The Burj Khalifa is 828 meters tall — the tallest building in the world! It has 163 floors and you can see it from 95 km away!",
    mascotChatMosque: "The Sheikh Zayed Grand Mosque in Abu Dhabi has 82 domes, over 1,000 columns, and the world's largest hand-knotted carpet!",
    mascotChatFlag: "The UAE flag has 4 colors! Red for bravery, green for hope, white for peace, and black for strength. It was adopted on December 2, 1971!",
    mascotChatOil: "Oil was discovered in the UAE in 1958! Before oil, people relied on pearl diving and fishing. Now the UAE is one of the richest countries!",
    mascotChatDesert: "The UAE desert is called the Rub' al Khali (Empty Quarter) — it's the largest sand desert in the world! Camels and oryxes live there!",
    mascotChatDates: "Dates are super important in UAE culture! There are over 200 varieties grown here. They're served with Arabic coffee as a welcome tradition!",
    mascotChatNationalDay: "UAE National Day is December 2nd! It celebrates the day all 7 emirates united in 1971. There are fireworks, parades, and celebrations everywhere!",
    mascotChatWeather: "The UAE is mostly hot and sunny! Summers can reach 50°C! Winter (November to March) is lovely with temperatures around 20-25°C — perfect for outdoor fun!",
    mascotChatSchool: "Kids in the UAE study Arabic, English, math, science, and Islamic studies! Many schools teach in both Arabic and English. Education is very important here!",
    mascotChatAnimals: "The UAE has amazing animals! Arabian oryx, falcons, camels, flamingos, dolphins, and even sea turtles! The falcon is the national bird!",
    mascotChatSpace: "The UAE went to space! In 2021, the Hope Probe reached Mars — making the UAE the first Arab country to send a mission to Mars! Sultan Al Neyadi spent 6 months on the ISS!",
    mascotChatCurrency: "The UAE currency is the Dirham (AED)! 1 Dirham = 100 fils. You'll see coins of 25 and 50 fils and 1 Dirham!",
    mascotChatSports: "The UAE loves sports! Football, camel racing, falconry, and cricket are very popular. Dubai even hosts the Dubai World Cup — one of the richest horse races!",
  },

  ar: {
    // Nav
    home: 'الرئيسية',
    landmarks: 'المعالم',
    traditions: 'التراث',
    food: 'الطعام',
    arabic: 'العربية',
    quiz: 'اختبار',
    match: 'تطابق',
    uaeCulture: 'ثقافة الإمارات',

    // Hero
    welcomeBack: 'مرحبًا بعودتك،',
    heroTitle1: 'ثقافة الإمارات',
    heroTitle2: 'تعلّم الأطفال',
    heroSubtitle: 'اتبع مسار التعلم — اكسب نقاط XP، افتح الشارات، وكن أسطورة الإمارات!',
    games: 'ألعاب',
    questions: 'أسئلة',
    arabicWords: 'كلمات عربية',
    badges: 'شارات',

    // Learning path
    yourLearningPath: 'مسار التعلم',
    followThe: 'اتبع',
    journey: 'الرحلة',
    pathSubtitle: 'أكمل كل خطوة لفتح التالية. تعلّم أولاً ثم اختبر مهاراتك!',
    unit1: 'الوحدة ١ — أساسيات الإمارات',
    unit2: 'الوحدة ٢ — النكهات واللغة',
    unit3: 'الوحدة ٣ — وقت الاختبار',
    unit4: 'الوحدة ٤ — ألعاب الكلمات',
    unit5: 'الوحدة ٥ — السرعة والاستماع',
    uaeLegend: 'أسطورة الإمارات',
    learn: 'تعلّم',
    play: 'العب',
    speed: 'سرعة',
    listen: 'استمع',

    // Node labels
    landmarksLabel: 'المعالم',
    traditionsLabel: 'التراث',
    foodLabel: 'الطعام',
    arabicLabel: 'العربية',
    cultureQuiz: 'اختبار الثقافة',
    matchCards: 'تطابق البطاقات',
    fillBlank: 'املأ الفراغ',
    scramble: 'رتّب الحروف',
    trueFalse: 'صح أو خطأ',
    listening: 'الاستماع',

    // Badges
    achievements: 'الإنجازات',
    your: '',
    badgesTitle: 'شاراتك',
    badgesSubtitle: 'أكمل التحديات لفتح جميع الشارات العشر!',

    // Facts
    didYouKnow: 'هل تعلم؟',
    funFacts: 'حقائق ممتعة',

    // CTA
    ready: 'مستعد؟',
    startLearningNow: 'ابدأ التعلم الآن',
    beginWithLandmarks: 'ابدأ بالمعالم',

    // Game common
    start: 'ابدأ',
    next: 'التالي',
    seeResults: 'النتائج',
    score: 'النتيجة',
    playAgain: 'العب مجددًا',
    homeBtn: 'الرئيسية',
    check: 'تحقق',
    clear: 'مسح',

    // Page headers
    famousUae: 'معالم الإمارات',
    landmarksPage: 'الشهيرة',
    uaeTraditions: 'تراث',
    traditionsPage: 'الإمارات',
    traditionalUae: 'طعام الإمارات',
    foodPage: 'التقليدي',
    wordScramble: 'ترتيب',
    scramblePage: 'الحروف',
    listeningChallenge: 'تحدي',
    challengePage: 'الاستماع',
    trueOrFalse: 'صح',
    falsePage: 'أو خطأ',
    completeThe: 'أكمل',
    sentencePage: 'الجملة',

    // Fill blank
    fillBlankTitle: 'أكمل الفراغ',
    fillBlankDesc: 'اقرأ كل جملة واختر الكلمة الصحيحة. ١٠ جمل لإكمالها!',
    fillBlankHeader: 'اختر الكلمة الصحيحة لإكمال كل جملة عن ثقافة الإمارات',

    // True/false
    trueFalseTitle: 'جولة صح أو خطأ السريعة!',
    trueFalseDesc: 'اقرأ كل عبارة وقرر إذا كانت صحيحة أو خاطئة. الوقت يمضي!',
    trueFalseHeader: '١٥ عبارة — ما أسرع ما يمكنك الإجابة؟',
    trueBtn: 'صح ✅',
    falseBtn: 'خطأ ❌',

    // Listening
    listeningTitle: 'تحدي الاستماع',
    listeningDesc: 'ستسمع كلمة عربية. اختر المعنى الصحيح بالإنجليزية من ٤ خيارات!',
    listeningHeader: 'استمع للكلمة العربية واختر المعنى الصحيح',
    tapToHear: 'اضغط لسماع الكلمة',

    // Scramble
    scrambleTitle: 'تحدي ترتيب الحروف',
    scrambleDesc: 'الحروف مبعثرة! اضغط عليها بالترتيب الصحيح. ١٠ كلمات!',
    scrambleHeader: 'رتّب الحروف لتكوين كلمات عن معالم وطعام وتراث الإمارات',

    // Timeline
    timeline: 'التسلسل الزمني',
    timelineLabel: 'التسلسل الزمني',
    timelineWord: 'ترتيب',
    timelineSort: 'زمني',
    sort: 'رتّب',
    unit6: 'الوحدة ٦ — التاريخ',
    timelineTitle: 'تحدي الترتيب الزمني',
    timelineDesc: 'اسحب أحداث تاريخ الإمارات ورتبها زمنياً. الأقدم أولاً والأحدث أخيراً!',
    timelineHeader: 'رتّب الأحداث من الأقدم إلى الأحدث',
    timelineDragHint: 'اسحب الأحداث لإعادة ترتيبها ثم تحقق من إجابتك!',

    // Results
    correctAnswers: 'إجابات صحيحة',
    completionBonus: 'مكافأة الإتمام',
    perfectBonus: 'مكافأة الكمال!',
    total: 'المجموع',

    // Splash
    splashWelcome: 'مرحبًا أيها المستكشف الصغير! أنت على وشك الانطلاق في رحلة رائعة عبر الإمارات العربية المتحدة!',
    letsGo: 'هيا بنا! 🚀',
    whatYouDiscover: 'ماذا ستكتشف',
    discover: '',
    famousLandmarks: 'معالم شهيرة',
    landmarksDesc: 'برج خليفة، مسجد الشيخ زايد، والمزيد!',
    ancientTraditions: 'تراث عريق',
    traditionsDesc: 'الصقارة، الغوص على اللؤلؤ، سباق الهجن',
    traditionalFood: 'طعام تقليدي',
    foodDesc: 'المجبوس، اللقيمات، وأطباق لذيذة',
    arabicWordsTitle: 'كلمات عربية',
    arabicDesc: 'تعلّم كيف تقول مرحبا، شكرًا، والمزيد!',
    whatElse: 'ماذا أيضًا؟ ←',
    howItWorks: 'كيف',
    works: 'يعمل',
    readLearn: 'اقرأ وتعلّم',
    readLearnDesc: 'كل صفحة تعلمك حقائق ممتعة مع صوت يقرأ لك!',
    playGames: 'العب الألعاب',
    playGamesDesc: 'اختبارات، ترتيب، تطابق، صح/خطأ — ٨ ألعاب مختلفة!',
    levelUp: 'ارتقِ!',
    levelUpDesc: 'اكسب XP، حافظ على سلسلتك، افتح الشارات، وكن أسطورة!',
    almostReady: 'تقريبًا جاهز! ←',
    whatsYourName: 'ما هو',
    name: 'اسمك؟',
    namePrompt: 'أخبرنا باسمك حتى نتتبع تقدمك!',
    namePlaceholder: '...اكتب اسمك هنا',
    startExploring: 'ابدأ الاستكشاف! 🌍',

    // Mascot — Rashid (splash + hero)
    mascotSplash1: 'مرحبا! أنا راشد! أهلاً بك في رحلة ثقافة الإمارات!',
    mascotSplash2: 'سنستكشف المعالم والتراث والطعام ونتعلم كلمات عربية!',
    mascotSplash3: 'سهل! تعلّم، العب، واكسب نقاط وشارات!',
    mascotSplash4: 'ما اسمك يا صديقي؟ اكتبه هنا!',
    mascotHeroGreeting: 'مرحبًا بعودتك! مستعد لمغامرات جديدة؟',

    // Mascot — correct/wrong (5 each)
    mascotCorrect1: 'ممتاز! إجابة صحيحة!',
    mascotCorrect2: 'ماشاء الله! أنت ذكي جداً!',
    mascotCorrect3: 'إجابة مثالية! استمر!',
    mascotCorrect4: 'يلا! أنت رائع!',
    mascotCorrect5: 'عبقري! أنت بطل إماراتي حقيقي!',
    mascotWrong1: 'لا تقلق، نتعلم معاً!',
    mascotWrong2: 'قريب! ستحصل عليها المرة القادمة!',
    mascotWrong3: 'لا بأس! التعلم يحتاج تمرين!',
    mascotWrong4: 'أوبس! لكن كل خطأ يساعدك على التعلم!',
    mascotWrong5: 'لا تقلق يا حبيبي! حاول مرة أخرى!',

    // Mascot — results
    mascotResultsGreat: 'أداء رائع! أنا فخور بك!',
    mascotResultsGood: 'عمل رائع! أنت تتعلم بسرعة!',
    mascotResultsTry: 'لا تستسلم! هيا نحاول مرة أخرى!',
    mascotThinking: 'هممم، دعني أفكر في هذا...',

    // Mascot — tips (10 fun facts)
    mascotTip1: 'هل تعلم أن الصقور لها جوازات سفر في الإمارات؟',
    mascotTip2: 'يزيد ارتفاع برج خليفة عن ٨٢٨ متراً!',
    mascotTip3: 'اللقيمات حلوى صغيرة لذيذة جداً!',
    mascotTip4: 'الإمارات تتكون من ٧ إمارات — هل تعرفها كلها؟',
    mascotTip5: 'القهوة العربية (الغهوة) تُقدم مع التمر ترحيباً بالضيوف!',
    mascotTip6: 'مسجد الشيخ زايد الكبير يحتوي على ٨٢ قبة!',
    mascotTip7: 'الغوص على اللؤلؤ كان التجارة الرئيسية قبل اكتشاف النفط!',
    mascotTip8: 'ألوان علم الإمارات هي الأحمر والأخضر والأبيض والأسود!',
    mascotTip9: 'الجمال تُسمى "سفن الصحراء" في العربية!',
    mascotTip10: '"يلا" تعني "هيا بنا" — أشهر كلمة عربية!',

    // Mascot — page greetings
    mascotGreetQuiz: 'وقت الاختبار! سأكون هنا إذا احتجت مساعدة. بالتوفيق!',
    mascotGreetFill: 'أكمل الفراغات! اقرأ كل جملة بعناية واختر الكلمة الصحيحة!',
    mascotGreetTF: 'وقت صح أو خطأ! فكّر بسرعة — الوقت يمضي!',
    mascotGreetListen: 'استمع بعناية! سأشغل كلمات عربية واختر المعنى الصحيح!',
    mascotGreetScramble: 'رتّب الحروف! اضغط عليها بالترتيب الصحيح لتكوين الكلمة!',
    mascotGreetMatching: 'لعبة الذاكرة! اقلب البطاقات وابحث عن الأزواج المتطابقة. مستعد؟',
    mascotGreetLandmarks: 'أهلاً بك في معالم الإمارات! دعني أريك أروع الأماكن!',
    mascotGreetTraditions: 'هيا نستكشف تراث الإمارات — الصقارة والغوص على اللؤلؤ والمزيد!',
    mascotGreetFood: 'ممم، الطعام الإماراتي! استعد لتتعرف على أشهى الأطباق!',
    mascotGreetArabic: 'مرحبا! هيا نتعلم بعض الكلمات العربية معاً!',
    mascotGreetTimeline: 'وقت التاريخ! اسحب الأحداث وضعها بالترتيب الصحيح — الأقدم أولاً!',

    // Mascot — chat responses
    mascotChatHello: 'مرحبا! أهلاً يا صديقي! كيف أقدر أساعدك اليوم؟',
    mascotChatName: 'اسمي راشد! أنا صديقك الإماراتي ودليلك!',
    mascotChatHelp: 'أنا هنا للمساعدة! يمكنك تعلم ثقافة الإمارات، لعب الألعاب، وكسب الشارات. اضغط على أي موضوع في القائمة!',
    mascotChatUAE: 'الإمارات رائعة! تتكون من ٧ إمارات: أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة!',
    mascotChatFood: 'الطعام الإماراتي لذيذ! جرب تتعلم عن المجبوس والهريس واللقيمات وخبز الرقاق!',
    mascotChatLandmarks: 'الإمارات فيها معالم مذهلة! برج خليفة، مسجد الشيخ زايد، برواز دبي، ومتحف المستقبل!',
    mascotChatTraditions: 'تراث الإمارات جميل! الصقارة، الغوص على اللؤلؤ، سباق الهجن، ومجالس القهوة العربية!',
    mascotChatArabic: 'خلني أعلمك! "مرحبا" تعني hello، "شكراً" تعني thank you، و"يلا" تعني let\'s go!',
    mascotChatGames: 'عندنا ألعاب كثيرة! اختبار، أكمل الفراغ، صح أو خطأ، استماع، ترتيب الحروف، وتطابق الذاكرة. اختر واحدة!',
    mascotChatBye: 'مع السلامة! أشوفك قريب يا صديقي! ارجع في أي وقت!',
    mascotChatThanks: 'العفو يا حبيبي! دائماً أسعد بمساعدتك!',
    mascotChatLove: 'آوو، وأنا أحبك أيضاً! أنت تجعل التعلم ممتعاً!',
    mascotChatWho: 'أنا راشد! ولد إماراتي صغير ألبس كندورة وغترة. أنا دليلك لثقافة الإمارات!',
    mascotChatFallback1: 'هممم، مو متأكد من هذا! لكن أعرف كثير عن ثقافة الإمارات — اسألني عن الطعام أو المعالم أو التراث!',
    mascotChatFallback2: 'هذا مثير للاهتمام! أنا أفضل في تعليم ثقافة الإمارات. اسألني عن الكلمات العربية أو الألعاب أو التراث!',
    mascotChatFallback3: 'سؤال حلو! أنا أيضاً أتعلم. تبي تعرف عن معالم الإمارات أو الطعام أو التراث؟',
    mascotChatAsk: 'أهلاً! أنا راشد! اسألني أي شيء عن ثقافة الإمارات، أو قل مرحبا!',

    // Mascot — expanded knowledge (emirates + topics)
    mascotChatAbuDhabi: 'أبوظبي هي عاصمة الإمارات! فيها مسجد الشيخ زايد الكبير ومتحف اللوفر أبوظبي وكورنيش أبوظبي الجميل!',
    mascotChatDubai: 'دبي مدينة المستقبل! فيها برج خليفة ونخلة جميرا ودبي مول ومتحف المستقبل المذهل!',
    mascotChatSharjah: 'الشارقة عاصمة الثقافة! فيها متاحف رائعة ومؤسسة الشارقة للفنون وحصلت على لقب عاصمة الثقافة من اليونسكو!',
    mascotChatAjman: 'عجمان أصغر إمارة لكنها جميلة! فيها شواطئ حلوة ومتحف عجمان في قلعة قديمة وكورنيش رائع!',
    mascotChatFujairah: 'الفجيرة على الساحل الشرقي! فيها جبال وشلالات وقلعة الفجيرة ومسجد البدية — أقدم مسجد في الإمارات!',
    mascotChatRAK: 'رأس الخيمة فيها طبيعة مذهلة! جبل جيس أعلى جبل في الإمارات وفيه أطول زيبلاين في العالم!',
    mascotChatUAQ: 'أم القيوين هادئة وجميلة! فيها غابات المانغروف وقلاع قديمة وأماكن رائعة لمشاهدة الطيور!',
    mascotChatBurjKhalifa: 'برج خليفة ارتفاعه ٨٢٨ متر — أطول مبنى في العالم! فيه ١٦٣ طابق ويمكن رؤيته من ٩٥ كيلومتر!',
    mascotChatMosque: 'مسجد الشيخ زايد الكبير في أبوظبي فيه ٨٢ قبة وأكثر من ١٠٠٠ عمود وأكبر سجادة يدوية في العالم!',
    mascotChatFlag: 'علم الإمارات فيه ٤ ألوان! الأحمر للشجاعة والأخضر للأمل والأبيض للسلام والأسود للقوة. اعتُمد في ٢ ديسمبر ١٩٧١!',
    mascotChatOil: 'اكتُشف النفط في الإمارات عام ١٩٥٨! قبل النفط اعتمد الناس على الغوص على اللؤلؤ والصيد. الآن الإمارات من أغنى الدول!',
    mascotChatDesert: 'صحراء الإمارات تسمى الربع الخالي — أكبر صحراء رملية في العالم! فيها الجمال والمها العربي!',
    mascotChatDates: 'التمر مهم جداً في ثقافة الإمارات! يُزرع أكثر من ٢٠٠ نوع هنا. يُقدم مع القهوة العربية ترحيباً بالضيوف!',
    mascotChatNationalDay: 'اليوم الوطني للإمارات هو ٢ ديسمبر! يحتفل بيوم اتحاد الإمارات السبع عام ١٩٧١. فيه ألعاب نارية وعروض واحتفالات!',
    mascotChatWeather: 'الإمارات حارة ومشمسة! الصيف ممكن يوصل ٥٠ درجة! الشتاء (نوفمبر-مارس) حلو والحرارة ٢٠-٢٥ درجة — مثالي للأنشطة!',
    mascotChatSchool: 'أطفال الإمارات يدرسون العربية والإنجليزية والرياضيات والعلوم والتربية الإسلامية! التعليم مهم جداً هنا!',
    mascotChatAnimals: 'الإمارات فيها حيوانات مذهلة! المها العربي والصقور والجمال والفلامنغو والدلافين وحتى السلاحف البحرية! الصقر هو الطائر الوطني!',
    mascotChatSpace: 'الإمارات راحت للفضاء! في ٢٠٢١ وصل مسبار الأمل للمريخ — أول مهمة عربية للمريخ! وسلطان النيادي قضى ٦ أشهر في محطة الفضاء!',
    mascotChatCurrency: 'عملة الإمارات هي الدرهم! ١ درهم = ١٠٠ فلس. ستجد عملات ٢٥ و٥٠ فلس و١ درهم!',
    mascotChatSports: 'الإمارات تحب الرياضة! كرة القدم وسباق الهجن والصقارة والكريكت شائعة جداً. دبي تستضيف كأس دبي العالمي للخيول!',
  }
};

// ===== Current language =====
function getLang() {
  return localStorage.getItem('uaequest_lang') || 'en';
}

function setLang(lang) {
  localStorage.setItem('uaequest_lang', lang);
}

function t(key) {
  const lang = getLang();
  return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
}

// ===== Apply language to the page =====
function applyLanguage() {
  const lang = getLang();
  const isAr = lang === 'ar';

  // Set HTML direction and lang
  document.documentElement.lang = lang;
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';

  // Toggle RTL class on body
  document.body.classList.toggle('rtl', isAr);

  // Update toggle button
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = isAr
      ? '<span class="lang-flag">🇬🇧</span><span class="lang-label">EN</span>'
      : '<span class="lang-flag">🇦🇪</span><span class="lang-label">عربي</span>';
  }

  // Translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (el.tagName === 'INPUT') {
      el.placeholder = translated;
    } else {
      el.textContent = translated;
    }
  });

  // Translate elements with data-i18n-html (allows inner HTML)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });
}

// ===== Toggle language =====
function toggleLanguage() {
  const current = getLang();
  const next = current === 'en' ? 'ar' : 'en';
  setLang(next);
  applyLanguage();
}

// ===== Init on load =====
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage();
});
