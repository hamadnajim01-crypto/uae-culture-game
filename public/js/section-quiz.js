/* ============================================
   Section Quiz — "What Did You Learn?"
   Tests knowledge from the page you just read
   ============================================ */

let sectionQuizData = [];
let sectionQuizCurrent = 0;
let sectionQuizScore = 0;
let sectionQuizTotal = 0;
let sectionQuizGame = '';
let sqStartHearts = 0;

function startSectionQuiz(section) {
  sectionQuizGame = section;
  sectionQuizCurrent = 0;
  sectionQuizScore = 0;
  sqStartHearts = getHearts().current;

  fetch(`/api/section-quiz/${section}`)
    .then(r => r.json())
    .then(questions => {
      sectionQuizData = questions;
      sectionQuizTotal = questions.length;

      // Hide start, show quiz area
      const startEl = document.getElementById('sectionQuizStart');
      const areaEl = document.getElementById('sectionQuizArea');
      if (startEl) startEl.style.display = 'none';
      if (areaEl) areaEl.style.display = 'block';

      showSectionQuestion();
      speakText('Let\'s see what you learned! Here is question one.');
    });
}

function showSectionQuestion() {
  if (sectionQuizCurrent >= sectionQuizData.length) {
    finishSectionQuiz();
    return;
  }

  const q = sectionQuizData[sectionQuizCurrent];
  const num = sectionQuizCurrent + 1;

  // Update progress
  const progressFill = document.getElementById('sqProgressFill');
  const progressText = document.getElementById('sqProgressText');
  if (progressFill) progressFill.style.width = ((num / sectionQuizTotal) * 100) + '%';
  if (progressText) progressText.textContent = `${num}/${sectionQuizTotal}`;

  // Update score
  const scoreEl = document.getElementById('sqScore');
  if (scoreEl) scoreEl.textContent = `SCORE: ${sectionQuizScore}`;

  // Build question card
  const card = document.getElementById('sqCard');
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = 'fadeUp 0.4s ease';

  const questionEl = document.getElementById('sqQuestion');
  questionEl.textContent = q.question;

  const optionsEl = document.getElementById('sqOptions');
  optionsEl.innerHTML = '';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.onclick = () => answerSectionQuestion(i, btn);
    optionsEl.appendChild(btn);
  });

  // Hide next button and fact
  document.getElementById('sqNextBtn').style.display = 'none';
  document.getElementById('sqFact').style.display = 'none';

  // Read question aloud
  speakText(q.question);
}

function answerSectionQuestion(index, btn) {
  const q = sectionQuizData[sectionQuizCurrent];
  const allBtns = document.querySelectorAll('#sqOptions .quiz-option');

  // Disable all
  allBtns.forEach(b => b.classList.add('disabled'));

  if (index === q.correct) {
    btn.classList.add('correct');
    sectionQuizScore++;
    playSound('correct');
    addXP(10);
    speakText('Correct! ' + q.fact);
  } else {
    btn.classList.add('wrong');
    allBtns[q.correct].classList.add('correct');
    playSound('wrong');
    loseHeart();
    speakText('Not quite! ' + q.fact);
  }

  // Update score
  const scoreEl = document.getElementById('sqScore');
  if (scoreEl) scoreEl.textContent = `SCORE: ${sectionQuizScore}`;

  // Show fact
  const factEl = document.getElementById('sqFact');
  factEl.textContent = q.fact;
  factEl.style.display = 'block';

  // Show next button
  document.getElementById('sqNextBtn').style.display = 'inline-flex';
}

function nextSectionQuestion() {
  if (!hasHearts()) return;
  sectionQuizCurrent++;
  showSectionQuestion();
}

function finishSectionQuiz() {
  addXP(50);
  if (sectionQuizScore === sectionQuizTotal) addXP(25);
  markNodeComplete(sectionQuizGame);

  if (getHearts().current === sqStartHearts) awardAchievement('no_hearts_lost');
  if (sectionQuizScore === sectionQuizTotal) awardAchievement('perfect_score');

  showResults('What Did You Learn?', sectionQuizScore, sectionQuizTotal, sectionQuizGame);
}
