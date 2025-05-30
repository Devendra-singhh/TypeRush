const quotes = [
  "Typing speed is not just about hitting the keys quickly; it is about accuracy, rhythm, and consistency. Improving your typing skills will make you more efficient in everyday computer tasks and professional work.",
  
  "Practice makes perfect. The more you type and challenge yourself with difficult sentences, the faster and more accurate your typing speed will become. Always aim to improve bit by bit every day.",
  
  "In today’s digital world, being able to type fast and accurately is an essential skill that can save you hours of work. Whether you are coding, writing emails, or chatting with friends, typing well helps you communicate faster.",
  
  "Developing strong typing skills requires patience and dedication. Do not rush, focus on accuracy first, then gradually increase your speed. Remember, it’s not a race but a journey towards mastery.",
  
  "Consistent practice with diverse and complex sentences helps train your brain and fingers to coordinate better. The more words and punctuation marks you master, the more natural and fluid your typing becomes."
];

let currentQuote = "";
let timerInterval;
let startTime;
let gameState = "start"; // possible values: start, running, ended
let timerStarted = false;

const quoteDisplay = document.getElementById("quoteDisplay");
const quoteInput = document.getElementById("quoteInput");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const controlBtn = document.getElementById("controlBtn");

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function controlGame() {
  if (gameState === "start" || gameState === "ended") {
    startGame();
  } else if (gameState === "running") {
    endGame();
  }
}

function startGame() {
  gameState = "running";
  controlBtn.textContent = "End";
  quoteInput.disabled = false;
  quoteInput.value = "";
  currentQuote = getRandomQuote();
  quoteDisplay.innerHTML = currentQuote
    .split("")
    .map((char, i) => `<span id="char-${i}">${char}</span>`)
    .join("");
  timerEl.textContent = 0;
  wpmEl.textContent = 0;
  accuracyEl.textContent = 100;
  timerStarted = false; // Reset flag for timer start
  clearInterval(timerInterval);
  quoteInput.focus();
}

// Start timer on first keystroke
quoteInput.addEventListener("input", () => {
  if (gameState !== "running") return;

  if (!timerStarted) {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    timerStarted = true;
  }

  calculateStats();
});

function updateTimer() {
  const elapsed = Math.floor((new Date() - startTime) / 1000);
  timerEl.textContent = elapsed;
  calculateStats();
}

function calculateStats() {
  const input = quoteInput.value;
  const chars = currentQuote.split("");
  let correctChars = 0;

  chars.forEach((char, i) => {
    const span = document.getElementById(`char-${i}`);
    if (!input[i]) {
      span.className = "";
    } else if (input[i] === char) {
      span.className = "correct";
      correctChars++;
    } else {
      span.className = "incorrect";
    }
  });

  const timeMinutes = (new Date() - startTime) / 1000 / 60;
  const wordsTyped = input.trim().split(/\s+/).filter(Boolean).length;
  wpmEl.textContent = timeMinutes > 0 ? Math.round(wordsTyped / timeMinutes) : 0;

  const accuracy = input.length === 0 ? 100 : Math.round((correctChars / input.length) * 100);
  accuracyEl.textContent = accuracy;
}

function endGame() {
  gameState = "ended";
  controlBtn.textContent = "Start Again";
  clearInterval(timerInterval);
  quoteInput.disabled = true;

  const wpmScore = parseInt(wpmEl.textContent);
  if (wpmScore === 0) {
    alert("You didn't type anything!");
    return;
  }
  
  const name = prompt("🎉 You finished! Enter your name for the leaderboard:");
  if (name) {
    updateLeaderboard({ name, wpm: wpmScore });
  }
}

function updateLeaderboard(entry) {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  scores.push(entry);
  scores.sort((a, b) => b.wpm - a.wpm);
  scores = scores.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(scores));
  displayLeaderboard();
}

function displayLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const list = document.getElementById("leaderboard");
  if (scores.length === 0) {
    list.innerHTML = "<li>No scores yet. Play and set a record!</li>";
    return;
  }
  list.innerHTML = scores
    .map((entry, index) => `<li>#${index + 1}: ${entry.name} - ${entry.wpm} WPM</li>`)
    .join("");
}

function clearLeaderboard() {
  localStorage.removeItem("leaderboard");
  displayLeaderboard();
}

function toggleTheme() {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  document.body.className = newTheme;
  localStorage.setItem("theme", newTheme);
}

// Initialize on page load
window.onload = () => {
  document.body.className = localStorage.getItem("theme") || "light";
  displayLeaderboard();
};
