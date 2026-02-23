/* ============================================
   UAE Culture Quest — Quiz Game
   10 random questions, score tracking, fun facts
   ============================================ */

let quizQuestions = [];
let currentQuestion = 0;
let quizScore = 0;
let answered = false;
let quizStartHearts = 0;

async function startQuiz() {
  // Fetch random questions from API
  try {
    const res = await fetch('/api/quiz-questions');
    quizQuestions = await res.json();
  } catch (e) {
    showNotification('Failed to load questions. Try again!');
    return;
  }

  currentQuestion = 0;
  quizScore = 0;
  answered = false;
  quizStartHearts = getHearts().current;

  document.getElementById('quizStart').style.display = 'none';
  document.getElementById('quizArea').style.display = 'block';

  updateStreak();
  displayQuestion();
}

function displayQuestion() {
  if (currentQuestion >= quizQuestions.length) {
    showQuizResults();
    return;
  }

  answered = false;
  const q = quizQuestions[currentQuestion];
  const total = quizQuestions.length;

  // Update progress
  const progress = ((currentQuestion) / total) * 100;
  document.getElementById('quizProgressFill').style.width = progress + '%';
  document.getElementById('quizProgressText').textContent = `${currentQuestion + 1}/${total}`;
  document.getElementById('quizScore').textContent = `Score: ${quizScore}`;

  // Update question
  document.getElementById('quizQuestion').textContent = q.question;

  // Create options
  const optionsDiv = document.getElementById('quizOptions');
  optionsDiv.innerHTML = '';

  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = option;
    btn.onclick = () => selectAnswer(index);
    optionsDiv.appendChild(btn);
  });

  // Hide fact and next button
  document.getElementById('quizFact').style.display = 'none';
  document.getElementById('quizNextBtn').style.display = 'none';

  // Mascot thinks while player reads question
  if (typeof Mascot !== 'undefined') Mascot.onThink();

  // Animate card
  const card = document.getElementById('quizCard');
  card.style.animation = 'none';
  card.offsetHeight; // Trigger reflow
  card.style.animation = 'slideUp 0.4s ease-out';
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const q = quizQuestions[currentQuestion];
  const options = document.querySelectorAll('.quiz-option');

  // Disable all options
  options.forEach(opt => opt.classList.add('disabled'));

  if (index === q.correct) {
    // Correct!
    options[index].classList.add('correct');
    quizScore++;
    playSound('correct');
    addXP(10);
    document.getElementById('quizScore').textContent = `Score: ${quizScore}`;
    if (typeof Mascot !== 'undefined') Mascot.onCorrect();
  } else {
    // Wrong
    options[index].classList.add('wrong');
    options[q.correct].classList.add('correct');
    playSound('wrong');
    loseHeart();
    if (typeof Mascot !== 'undefined') Mascot.onWrong();
  }

  // Show fun fact
  const factDiv = document.getElementById('quizFact');
  factDiv.textContent = '💡 ' + q.fact;
  factDiv.style.display = 'block';

  // Show next button
  const nextBtn = document.getElementById('quizNextBtn');
  if (currentQuestion < quizQuestions.length - 1) {
    nextBtn.textContent = 'Next Question →';
  } else {
    nextBtn.textContent = 'See Results! 🏆';
  }
  nextBtn.style.display = 'inline-flex';
}

function nextQuestion() {
  if (!hasHearts()) return;
  currentQuestion++;
  displayQuestion();
}

function showQuizResults() {
  const total = quizQuestions.length;

  // Update progress bar to 100%
  document.getElementById('quizProgressFill').style.width = '100%';
  document.getElementById('quizProgressText').textContent = 'Done!';

  addXP(50); // game complete bonus
  if (quizScore === total) addXP(25); // perfect bonus
  markNodeComplete('quiz');

  if (getHearts().current === quizStartHearts) awardAchievement('no_hearts_lost');
  if (quizScore === total) awardAchievement('perfect_score');

  showResults('Quiz Complete!', quizScore, total, 'quiz');
}
