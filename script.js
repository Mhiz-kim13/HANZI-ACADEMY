const vocabulary = {
  beginner: [
    { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "hello", example: "你好，很高兴认识你。" },
    { hanzi: "谢谢", pinyin: "xiè xie", meaning: "thank you", example: "谢谢你的帮助。" },
    { hanzi: "朋友", pinyin: "péng you", meaning: "friend", example: "她是我的好朋友。" },
    { hanzi: "喜欢", pinyin: "xǐ huan", meaning: "to like", example: "我喜欢喝茶。" },
    { hanzi: "今天", pinyin: "jīn tiān", meaning: "today", example: "今天天气很好。" },
    { hanzi: "学习", pinyin: "xué xí", meaning: "to study; to learn", example: "我每天学习中文。" },
    { hanzi: "再见", pinyin: "zài jiàn", meaning: "goodbye", example: "明天见，再见！" },
    { hanzi: "家", pinyin: "jiā", meaning: "home; family", example: "我现在回家。" },
    { hanzi: "吃", pinyin: "chī", meaning: "to eat", example: "你想吃什么？" },
    { hanzi: "水", pinyin: "shuǐ", meaning: "water", example: "请给我一杯水。" },
    { hanzi: "名字", pinyin: "míng zi", meaning: "name", example: "你的名字是什么？" },
    { hanzi: "很", pinyin: "hěn", meaning: "very; quite", example: "这个菜很好吃。" },
  ],
  intermediate: [
    { hanzi: "发现", pinyin: "fā xiàn", meaning: "to discover; to notice", example: "我发现了一家新咖啡馆。" },
    { hanzi: "安排", pinyin: "ān pái", meaning: "to arrange; arrangement", example: "我们安排好了周末的旅行。" },
    { hanzi: "适合", pinyin: "shì hé", meaning: "to suit; to be suitable", example: "这本书适合初学者。" },
    { hanzi: "习惯", pinyin: "xí guàn", meaning: "habit; to get used to", example: "我已经习惯了早起。" },
    { hanzi: "附近", pinyin: "fù jìn", meaning: "nearby; in the vicinity", example: "附近有一家不错的书店。" },
    { hanzi: "坚持", pinyin: "jiān chí", meaning: "to persist; to keep at it", example: "坚持练习就会进步。" },
    { hanzi: "突然", pinyin: "tū rán", meaning: "suddenly; all of a sudden", example: "外面突然下起了雨。" },
    { hanzi: "终于", pinyin: "zhōng yú", meaning: "finally; at last", example: "我们终于到家了。" },
    { hanzi: "解释", pinyin: "jiě shì", meaning: "to explain; explanation", example: "请再解释一下这个词。" },
    { hanzi: "选择", pinyin: "xuǎn zé", meaning: "to choose; choice", example: "这是一个很难的选择。" },
    { hanzi: "提高", pinyin: "tí gāo", meaning: "to improve; to raise", example: "每天阅读能提高中文水平。" },
    { hanzi: "认真", pinyin: "rèn zhēn", meaning: "serious; conscientious", example: "她认真地准备了考试。" },
  ],
  expert: [
    { hanzi: "恰如其分", pinyin: "qià rú qí fèn", meaning: "just right; appropriate", example: "他的评论恰如其分。" },
    { hanzi: "潜移默化", pinyin: "qián yí mò huà", meaning: "to influence subtly over time", example: "阅读会潜移默化地改变一个人。" },
    { hanzi: "相得益彰", pinyin: "xiāng dé yì zhāng", meaning: "to complement each other perfectly", example: "传统与创新在这里相得益彰。" },
    { hanzi: "举足轻重", pinyin: "jǔ zú qīng zhòng", meaning: "to be of crucial importance", example: "这项发现具有举足轻重的意义。" },
    { hanzi: "不言而喻", pinyin: "bù yán ér yù", meaning: "self-evident; goes without saying", example: "保护环境的重要性不言而喻。" },
    { hanzi: "见微知著", pinyin: "jiàn wēi zhī zhù", meaning: "to infer the whole from a small clue", example: "从这个细节可以见微知著。" },
    { hanzi: "融会贯通", pinyin: "róng huì guàn tōng", meaning: "to master by integrating knowledge", example: "把理论与实践融会贯通。" },
    { hanzi: "循序渐进", pinyin: "xún xù jiàn jìn", meaning: "to advance gradually and methodically", example: "学习语言需要循序渐进。" },
    { hanzi: "权衡", pinyin: "quán héng", meaning: "to weigh; to balance considerations", example: "我们需要权衡利弊。" },
    { hanzi: "诠释", pinyin: "quán shì", meaning: "to interpret; interpretation", example: "这部作品诠释了时代精神。" },
    { hanzi: "隽永", pinyin: "juàn yǒng", meaning: "meaningful and lasting", example: "这句话读来意味隽永。" },
    { hanzi: "脉络", pinyin: "mài luò", meaning: "context; underlying structure", example: "先梳理清楚历史脉络。" },
  ],
};

const levelNames = { beginner: "Beginner", intermediate: "Intermediate", expert: "Expert" };
const savedWords = new Set();
let activeLevel = "beginner";
let activeView = "overview";
let currentLevel = 1;
let highestUnlockedLevel = 1;
let completedLevels = [];
let currentStreak = 4;
let quizScore = 0;
let currentWordIndex = 0;
let revealed = false;
let expanded = false;
let toastTimer;

const wordList = document.querySelector("#word-list");
const searchInput = document.querySelector("#search-input");
const emptyState = document.querySelector("#empty-state");
const toast = document.querySelector("#toast");
const featureDialog = document.querySelector("#feature-dialog");
const dialogBody = document.querySelector("#dialog-body");

try {
  const savedProgress = JSON.parse(localStorage.getItem("lingua-progress") || "{}");
  currentLevel = Math.min(100, Math.max(1, Number(savedProgress.currentLevel) || 1));
  highestUnlockedLevel = Math.min(100, Math.max(currentLevel, Number(savedProgress.highestUnlockedLevel) || 1));
  completedLevels = Array.isArray(savedProgress.completedLevels)
    ? savedProgress.completedLevels.filter((level) => Number.isInteger(level) && level >= 1 && level <= 100)
    : [];
  currentStreak = Math.max(1, Number(savedProgress.currentStreak) || 4);
} catch (error) {
  console.error("Could not load saved learning progress.", error);
}

document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("en", {
  weekday: "long", month: "long", day: "numeric",
}).format(new Date()).toUpperCase();

function currentWords() {
  return vocabulary[activeLevel];
}

function visibleWords() {
  let words = activeView === "saved"
    ? Object.values(vocabulary).flat().filter((word) => savedWords.has(word.hanzi))
    : currentWords();
  const query = searchInput.value.trim().toLocaleLowerCase();
  if (query) {
    words = words.filter((word) =>
      `${word.hanzi} ${word.pinyin} ${word.meaning} ${word.example}`.toLocaleLowerCase().includes(query),
    );
  }
  return words;
}

function renderWords() {
  const words = visibleWords();
  const shownWords = expanded ? words : words.slice(0, 5);
  wordList.innerHTML = shownWords.map((word) => `
    <div class="word-row" data-hanzi="${word.hanzi}">
      <div class="word-main">
        <span class="word-character">${word.hanzi}</span>
        <span class="word-detail"><span class="word-pinyin">${word.pinyin}</span><span class="word-example">${word.example}</span></span>
      </div>
      <span class="word-meaning">${word.meaning}</span>
      <button class="save-word ${savedWords.has(word.hanzi) ? "saved" : ""}" data-save="${word.hanzi}" aria-label="${savedWords.has(word.hanzi) ? "Remove from" : "Save to"} saved words">${savedWords.has(word.hanzi) ? "♥" : "♡"}</button>
    </div>
  `).join("");
  emptyState.hidden = words.length > 0;
  document.querySelector("#show-more-button").hidden = words.length <= 5 || expanded;
  wordList.querySelectorAll(".word-row").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (event.target.closest(".save-word")) return;
      const ownerLevel = Object.keys(vocabulary).find((level) =>
        vocabulary[level].some((word) => word.hanzi === row.dataset.hanzi),
      );
      if (!ownerLevel) return;
      if (ownerLevel !== activeLevel) selectLevel(ownerLevel);
      currentWordIndex = currentWords().findIndex((word) => word.hanzi === row.dataset.hanzi);
      revealed = false;
      renderFlashcard();
      document.querySelector("#practice-card").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  wordList.querySelectorAll(".save-word").forEach((button) => {
    button.addEventListener("click", () => {
      const hanzi = button.dataset.save;
      if (savedWords.has(hanzi)) {
        savedWords.delete(hanzi);
        showToast("Removed from your saved words");
      } else {
        savedWords.add(hanzi);
        showToast("Word saved for later");
      }
      if (activeView === "saved") {
        document.querySelector("#word-list-title").innerHTML = `Saved words <span class="word-total">${savedWords.size} words</span>`;
      }
      renderWords();
    });
  });
}

function renderFlashcard() {
  const words = currentWords();
  const word = words[currentWordIndex % words.length];
  document.querySelector("#flashcard-character").textContent = word.hanzi;
  document.querySelector("#flashcard-pinyin").textContent = word.pinyin;
  document.querySelector("#flashcard-meaning").textContent = word.meaning;
  document.querySelector("#flashcard-meaning").hidden = !revealed;
  document.querySelector("#flashcard-pinyin").hidden = revealed;
  document.querySelector("#flashcard-hint").textContent = revealed ? "MEANING" : "TAP TO REVEAL";
  document.querySelector("#practice-step").textContent = `${String((currentWordIndex % words.length) + 1).padStart(2, "0")} / ${String(words.length).padStart(2, "0")}`;
  document.querySelector("#practice-progress-fill").style.width = `${((currentWordIndex % words.length) + 1) / words.length * 100}%`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2300);
}

function stageForLevel(level) {
  return level <= 30 ? "beginner" : level <= 70 ? "intermediate" : "expert";
}

function saveProgress() {
  try {
    localStorage.setItem("lingua-progress", JSON.stringify({
      currentLevel,
      highestUnlockedLevel,
      completedLevels,
      currentStreak,
    }));
  } catch (error) {
    console.error("Could not save learning progress.", error);
    showToast("Progress could not be saved in this browser");
  }
}

function renderRoadmap() {
  const stages = [
    { key: "beginner", title: "Beginner", range: "01–30", first: 1, last: 30 },
    { key: "intermediate", title: "Intermediate", range: "31–70", first: 31, last: 70 },
    { key: "expert", title: "Expert", range: "71–100", first: 71, last: 100 },
  ];
  document.querySelector("#roadmap-groups").innerHTML = stages.map((stage) => `
    <div class="roadmap-stage">
      <div class="roadmap-stage-label"><strong>${stage.title}</strong><span>Levels ${stage.range}</span></div>
      <div class="roadmap-levels">${Array.from({ length: stage.last - stage.first + 1 }, (_, index) => {
        const level = stage.first + index;
        const completed = completedLevels.includes(level);
        const locked = level > highestUnlockedLevel;
        return `<button class="roadmap-level ${completed ? "completed" : ""} ${level === currentLevel ? "current" : ""}" data-roadmap-level="${level}" ${locked ? "disabled" : ""} aria-label="Level ${level}${locked ? ", locked" : completed ? ", completed" : ""}" title="${locked ? "Pass the previous level check to unlock" : `Open level ${level}`}">${String(level).padStart(2, "0")}</button>`;
      }).join("")}</div>
    </div>`).join("");
  document.querySelector("#current-level-stat").innerHTML = `${String(currentLevel).padStart(2, "0")} <small>/ 100</small>`;
  document.querySelector("#test-level-label").textContent = String(currentLevel).padStart(2, "0");
  document.querySelector("#words-learned").innerHTML = `${completedLevels.length * 12} <small>/ 1200</small>`;
  document.querySelector(".streak-card strong").textContent = `${currentStreak} day streak`;
}

function setLevel(level) {
  if (level > highestUnlockedLevel) {
    showToast("Pass the previous level check to unlock this level");
    return;
  }
  currentLevel = level;
  activeLevel = stageForLevel(level);
  currentWordIndex = (level - 1) % currentWords().length;
  revealed = false;
  document.querySelectorAll(".level-link").forEach((button) => {
    const selected = button.dataset.level === activeLevel;
    button.classList.toggle("selected", selected);
    button.querySelector(".level-check")?.remove();
    if (selected) button.insertAdjacentHTML("beforeend", '<span class="level-check">✓</span>');
  });
  document.querySelectorAll(".learning-level-card").forEach((card) =>
    card.classList.toggle("selected", card.dataset.levelCard === activeLevel),
  );
  document.querySelector("#word-list-title").innerHTML =
    `Level ${String(currentLevel).padStart(2, "0")} · ${levelNames[activeLevel]} <span class="word-total">${currentWords().length} words</span>`;
  renderRoadmap();
  renderWords();
  renderFlashcard();
}

function selectLevel(level) {
  const firstLevel = level === "beginner" ? 1 : level === "intermediate" ? 31 : 71;
  if (firstLevel > highestUnlockedLevel) {
    showToast("Keep progressing and pass earlier level checks to unlock this stage");
    return;
  }
  activeLevel = level;
  setLevel(Math.max(firstLevel, Math.min(currentLevel, level === "beginner" ? 30 : level === "intermediate" ? 70 : 100)));
}

document.querySelectorAll("[data-level], [data-level-card]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.level || button.dataset.levelCard) {
      selectLevel(button.dataset.level || button.dataset.levelCard);
      if (button.dataset.levelCard) document.querySelector("#roadmap-panel").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

document.querySelectorAll(".nav-link").forEach((button) => {
  button.addEventListener("click", () => {
    activeView = button.dataset.view;
    document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link === button));
    const destinations = {
      overview: ["Overview", ".welcome-row"],
      roadmap: ["100-level roadmap", "#levels-section"],
      practice: ["Practice", "#features-section"],
      progress: ["Progress & achievements", "#progress-achievements"],
      tutor: ["AI tutor", "#features-section"],
      words: ["Word library", "#study-section"],
      saved: ["Saved words", "#study-section"],
      profile: ["Profile & settings", "#profile-settings"],
      monetization: ["Plans & subscriptions", "#monetization"],
    };
    const [label, target] = destinations[activeView];
    document.querySelector("#breadcrumb-current").textContent = label;
    if (activeView === "tutor") {
      openFeature("tutor");
      return;
    }
    if (activeView === "saved") {
      expanded = true;
      document.querySelector("#word-list-title").innerHTML = `Saved words <span class="word-total">${savedWords.size} words</span>`;
    } else if (activeView === "words") {
      expanded = true;
      document.querySelector("#word-list-title").innerHTML = `${levelNames[activeLevel]} words <span class="word-total">${currentWords().length} words</span>`;
    }
    if (activeView === "saved" || activeView === "words") renderWords();
    document.querySelector(target).scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

searchInput.addEventListener("input", renderWords);
document.querySelector("#flashcard").addEventListener("click", () => {
  revealed = !revealed;
  renderFlashcard();
});
document.querySelector("#next-word-button").addEventListener("click", () => {
  currentWordIndex = (currentWordIndex + 1) % currentWords().length;
  revealed = false;
  renderFlashcard();
});
document.querySelector("#sound-button").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) {
    showToast("Audio playback isn't available in this browser");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(currentWords()[currentWordIndex].hanzi);
  utterance.lang = "zh-CN";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
});
document.querySelector("#show-more-button").addEventListener("click", () => {
  expanded = true;
  renderWords();
});
document.querySelector("#browse-words-button").addEventListener("click", () => {
  activeView = "words";
  expanded = true;
  document.querySelector('.nav-link[data-view="words"]').classList.add("active");
  document.querySelectorAll(".nav-link:not([data-view='words'])").forEach((link) => link.classList.remove("active"));
  document.querySelector("#breadcrumb-current").textContent = "Word library";
  document.querySelector("#word-list-title").innerHTML = `${levelNames[activeLevel]} words <span class="word-total">${currentWords().length} words</span>`;
  renderWords();
});
document.querySelector("#continue-button").addEventListener("click", () => {
  document.querySelector("#study-section").scrollIntoView({ behavior: "smooth", block: "start" });
  document.querySelector("#flashcard").focus({ preventScroll: true });
});
document.querySelector("#review-button").addEventListener("click", () => {
  openFeature("games");
});
document.querySelector("#daily-plan-button").addEventListener("click", () => {
  openFeature("daily-plan");
});
document.querySelector("#all-levels-button").addEventListener("click", () => {
  document.querySelector("#roadmap-panel").scrollIntoView({ behavior: "smooth", block: "center" });
});

const themeButton = document.querySelector("#theme-button");
try {
  if (localStorage.getItem("hanzi-theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
} catch (error) {
  console.error("Could not load the color theme.", error);
}
themeButton?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  try {
    localStorage.setItem("hanzi-theme", isDark ? "dark" : "light");
  } catch (error) {
    console.error("Could not save the color theme.", error);
  }
});

document.querySelectorAll(".bottom-nav-link").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".bottom-nav-link").forEach((link) => link.classList.remove("active"));
    button.classList.add("active");
    const view = button.dataset.mobileView;
    const sideLink = document.querySelector(`.nav-link[data-view="${view}"]`);
    sideLink?.click();
  });
});
document.querySelector("#share-progress-button")?.addEventListener("click", () => {
  showToast("Your progress summary is ready to share");
});
document.querySelector("#edit-profile-button")?.addEventListener("click", () => {
  showToast("Profile editing is ready for account integration");
});
document.querySelector("#save-settings-button")?.addEventListener("click", () => {
  showToast("Settings saved on this device");
});
document.querySelectorAll("[data-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.plan} selected`);
  });
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    renderWords();
    searchInput.blur();
  }
});

function showDialog(title, content) {
  document.querySelector("#dialog-title").textContent = title;
  dialogBody.innerHTML = content;
  if (!featureDialog.open) featureDialog.showModal();
}

function speakChinese(text) {
  if (!("speechSynthesis" in window)) {
    showToast("Audio playback isn't available in this browser");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function openFeature(feature) {
  const screens = {
    speaking: ["Speak Chinese", `
      <p>Say this phrase aloud. Your browser will transcribe what it hears so you can compare it. Microphone recognition depends on browser support and permission.</p>
      <div class="dialog-result"><strong>你好，很高兴认识你。</strong><br />nǐ hǎo, hěn gāo xìng rèn shi nǐ · Hello, nice to meet you.</div>
      <div class="dialog-actions"><button class="secondary-button" data-speak="你好，很高兴认识你。">▶ Hear example</button><button class="secondary-button" id="start-speaking">🎙 Start speaking</button></div>
      <div class="dialog-result" id="speech-result" aria-live="polite">Your transcript and tone practice feedback will appear here.</div>`],
    writing: ["Character writing practice", `
      <p>Trace the character 你 (nǐ · you) in the practice area. Try to follow the faint guides.</p>
      <canvas class="writing-canvas" id="writing-canvas" aria-label="Character writing canvas"></canvas>
      <div class="dialog-actions"><button class="secondary-button" id="clear-writing">Clear pad</button><button class="secondary-button" id="save-writing">Finish practice</button></div>
      <div id="writing-result" aria-live="polite"></div>`],
    games: ["Quick vocabulary challenge", `<p>Choose the meaning of each Chinese word. Complete five questions and see your score.</p><div id="quiz-content"></div>`],
    tutor: ["AI Chinese tutor · preview", `
      <div class="dialog-result">This prototype has no AI service connected, so replies use the built-in lesson vocabulary rather than a live AI model. A connected tutor needs a secure server-side AI integration.</div>
      <div class="chat-log" id="chat-log"><div class="chat-message">你好！Ask me about one of the lesson words, or try “谢谢”.</div></div>
      <form class="dialog-form-row" id="tutor-form"><input id="tutor-input" placeholder="Ask about a Chinese word..." aria-label="Ask the Chinese tutor" required /><button class="secondary-button">Send</button></form>`],
    situations: ["Real-life conversation practice", `
      <p>Choose a place to rehearse a useful phrase.</p>
      <label>Situation<select id="situation-select"><option value="restaurant">Restaurant</option><option value="airport">Airport</option><option value="shopping">Shopping</option><option value="work">Workplace</option></select></label>
      <div class="dialog-result" id="situation-result"></div><div class="dialog-actions"><button class="secondary-button" id="next-situation">Show a practice phrase</button><button class="secondary-button" id="speak-situation">▶ Hear phrase</button></div>`],
    translation: ["Phrase translation", `
      <p>Look up lesson vocabulary and a few practical phrases. This offline prototype uses a small built-in phrase list.</p>
      <label for="translation-input">Chinese or English</label><div class="dialog-form-row"><input id="translation-input" placeholder="Try 你好 or thank you" /><button class="secondary-button" id="translate-button">Translate</button></div>
      <div class="dialog-result" id="translation-result" aria-live="polite">Translations will appear here.</div>`],
    "daily-word": ["Daily Chinese word", `<div class="dialog-result"><strong>坚持 (jiān chí)</strong> · to keep going, to persist<br />坚持练习，你会进步。<br />Keep practicing and you will improve.</div><div class="dialog-actions"><button class="secondary-button" data-speak="坚持">▶ Listen</button></div>`],
    "daily-plan": ["Today's learning challenge", `<p>Make today count with a short, achievable session:</p><ul><li>Learn 5 new words from your current stage.</li><li>Listen and repeat one phrase.</li><li>Complete a quick quiz.</li></ul><div class="dialog-actions"><button class="secondary-button" id="start-daily-quiz">Start today's quiz</button></div>`],
    offline: ["Offline lesson pack", `<p>Download a simple lesson pack with vocabulary, meanings and examples. The app itself does not yet cache lessons for offline browsing.</p><div class="dialog-actions"><button class="secondary-button" id="download-lessons">Download beginner lesson pack</button></div>`],
    reminders: ["Daily practice reminders", `<p>Choose a preferred practice time. This saves your preference in this browser; scheduled notifications require a reminder service or an installed app.</p><label>Reminder time<input id="reminder-time" type="time" value="19:00" /></label><div class="dialog-actions"><button class="secondary-button" id="save-reminder">Save reminder preference</button></div>`],
    leaderboard: ["Learner leaderboard", `<p>Global rankings need accounts and a connected service, which this prototype does not have.</p><div class="dialog-result">Your local progress: ${completedLevels.length} levels completed · ${currentStreak} day practice streak.</div>`],
    hsk: ["HSK preparation", `<p>Build toward official proficiency tests with vocabulary review and level checks. Choose an HSK-style practice quiz to review your current stage.</p><div class="dialog-actions"><button class="secondary-button" id="start-hsk-quiz">Start a practice quiz</button></div>`],
    certificate: ["Stage certificates", `<p>Certificates are available after completing and passing every level check in a stage.</p><ul><li>Beginner: levels 01–30 — ${completedLevels.filter((level) => level <= 30).length}/30 complete</li><li>Intermediate: levels 31–70 — ${completedLevels.filter((level) => level >= 31 && level <= 70).length}/40 complete</li><li>Expert: levels 71–100 — ${completedLevels.filter((level) => level >= 71).length}/30 complete</li></ul><label>Certificate stage<select id="certificate-stage"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="expert">Expert</option></select></label><div class="dialog-actions"><button class="secondary-button" id="download-certificate">Check and download</button></div><div id="certificate-result"></div>`],
  };
  const [title, content] = screens[feature] || screens.games;
  showDialog(title, content);
  if (feature === "games") startQuiz();
  if (feature === "situations") updateSituation();
}

const translations = new Map();
Object.values(vocabulary).flat().forEach((word) => {
  translations.set(word.hanzi.toLocaleLowerCase(), `${word.hanzi} · ${word.pinyin} · ${word.meaning}`);
  translations.set(word.meaning.toLocaleLowerCase(), `${word.hanzi} · ${word.pinyin} · ${word.meaning}`);
});
[
  ["请问，洗手间在哪里？", "qǐng wèn, xǐ shǒu jiān zài nǎ lǐ?", "Excuse me, where is the restroom?"],
  ["这个多少钱？", "zhè ge duō shǎo qián?", "How much is this?"],
  ["我想要一杯水。", "wǒ xiǎng yào yì bēi shuǐ.", "I would like a glass of water."],
].forEach(([hanzi, pinyin, meaning]) => {
  translations.set(hanzi.toLocaleLowerCase(), `${hanzi} · ${pinyin} · ${meaning}`);
  translations.set(meaning.toLocaleLowerCase(), `${hanzi} · ${pinyin} · ${meaning}`);
});

function runLevelCheck() {
  showDialog(`Level ${String(currentLevel).padStart(2, "0")} check`, `<p>Answer at least two of three vocabulary questions correctly to unlock the next level.</p><div id="quiz-content"></div>`);
  startQuiz(true);
}

let activeQuiz;
function startQuiz(isLevelCheck = false) {
  const words = currentWords();
  activeQuiz = {
    isLevelCheck,
    questions: Array.from({ length: 3 }, (_, index) => words[(currentWordIndex + index) % words.length]),
    index: 0,
    score: 0,
  };
  renderQuizQuestion();
}

function renderQuizQuestion() {
  if (!activeQuiz) return;
  const target = activeQuiz.questions[activeQuiz.index];
  if (!target) {
    const passed = activeQuiz.score >= 2;
    const title = passed
      ? `You got ${activeQuiz.score}/3 — ${activeQuiz.isLevelCheck ? "great work!" : "nice job!"}`
      : `You got ${activeQuiz.score}/3 — try again`;
    if (activeQuiz.isLevelCheck && passed) {
      if (!completedLevels.includes(currentLevel)) completedLevels.push(currentLevel);
      if (currentLevel < 100) highestUnlockedLevel = Math.max(highestUnlockedLevel, currentLevel + 1);
      currentLevel = Math.min(100, currentLevel + (currentLevel < 100 ? 1 : 0));
      activeLevel = stageForLevel(currentLevel);
      currentStreak += 1;
      saveProgress();
      renderRoadmap();
      document.querySelectorAll(".level-link").forEach((button) => {
        const selected = button.dataset.level === activeLevel;
        button.classList.toggle("selected", selected);
        button.querySelector(".level-check")?.remove();
        if (selected) button.insertAdjacentHTML("beforeend", '<span class="level-check">✓</span>');
      });
      document.querySelectorAll(".learning-level-card").forEach((card) =>
        card.classList.toggle("selected", card.dataset.levelCard === activeLevel),
      );
      document.querySelector("#word-list-title").innerHTML =
        `Level ${String(currentLevel).padStart(2, "0")} · ${levelNames[activeLevel]} <span class="word-total">${currentWords().length} words</span>`;
      renderWords();
      renderFlashcard();
    }
    document.querySelector("#quiz-content").innerHTML = `<div class="dialog-result">${title}${activeQuiz.isLevelCheck && passed ? `<br />Level ${String(currentLevel).padStart(2, "0")} is now unlocked. Your progress is saved on this device.` : ""}</div><div class="dialog-actions"><button class="secondary-button" id="retry-quiz">${activeQuiz.isLevelCheck ? "Try level check again" : "Play again"}</button>${activeQuiz.isLevelCheck && passed ? '<button class="secondary-button" id="close-quiz">Continue learning</button>' : ""}</div>`;
    document.querySelector("#retry-quiz").addEventListener("click", () => startQuiz(activeQuiz.isLevelCheck));
    document.querySelector("#close-quiz")?.addEventListener("click", () => featureDialog.close());
    return;
  }
  const choices = [...new Set([target, ...currentWords().filter((word) => word !== target).slice(0, 3)])]
    .sort(() => Math.random() - 0.5);
  document.querySelector("#quiz-content").innerHTML = `<p>Question ${activeQuiz.index + 1} of ${activeQuiz.questions.length}: What does <strong>${target.hanzi}</strong> (${target.pinyin}) mean?</p><div class="quiz-options">${choices.map((choice, index) => `<button class="quiz-option" data-answer="${index}">${choice.meaning}</button>`).join("")}</div><div id="quiz-feedback" aria-live="polite"></div>`;
  document.querySelectorAll(".quiz-option").forEach((option, index) => {
    option.addEventListener("click", () => {
      const correct = choices[index] === target;
      if (correct) activeQuiz.score += 1;
      document.querySelectorAll(".quiz-option").forEach((button) => { button.disabled = true; });
      document.querySelector("#quiz-feedback").innerHTML = `<div class="dialog-result">${correct ? "Correct!" : `Not quite — ${target.hanzi} means “${target.meaning}.”`}</div><div class="dialog-actions"><button class="secondary-button" id="next-quiz-question">Continue</button></div>`;
      document.querySelector("#next-quiz-question").addEventListener("click", () => {
        activeQuiz.index += 1;
        renderQuizQuestion();
      });
    });
  });
}

const situations = {
  restaurant: ["请给我一杯水。", "qǐng gěi wǒ yì bēi shuǐ", "Please give me a glass of water."],
  airport: ["请问，登机口在哪里？", "qǐng wèn, dēng jī kǒu zài nǎ lǐ", "Excuse me, where is the boarding gate?"],
  shopping: ["这个多少钱？", "zhè ge duō shǎo qián", "How much is this?"],
  work: ["我们什么时候开会？", "wǒ men shén me shí hou kāi huì", "When shall we have the meeting?"],
};

function updateSituation() {
  const choice = situations[document.querySelector("#situation-select").value];
  document.querySelector("#situation-result").innerHTML = `<strong>${choice[0]}</strong><br />${choice[1]}<br />${choice[2]}`;
  document.querySelector("#speak-situation").dataset.speak = choice[0];
}

dialogBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.speak) speakChinese(button.dataset.speak);
  if (button.id === "start-speaking") {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      document.querySelector("#speech-result").textContent = "Speech recognition is not supported in this browser. Try a current Chrome-based browser.";
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    document.querySelector("#speech-result").textContent = "Listening… say 你好，很高兴认识你。";
    recognition.onresult = (resultEvent) => {
      const transcript = resultEvent.results[0][0].transcript;
      const expected = "你好很高兴认识你";
      const normalized = transcript.replace(/[，。！？、\s]/g, "");
      document.querySelector("#speech-result").textContent = `Heard: ${transcript} · ${normalized.includes(expected) || expected.includes(normalized) ? "Great match! Listen once more and notice the dipping third tone in 你 (nǐ)." : "Compare your words with the example, then try again. Speech recognition checks words, not precise tones."}`;
    };
    recognition.onerror = (error) => {
      document.querySelector("#speech-result").textContent = `Microphone practice failed: ${error.error}. Check your microphone permission and try again.`;
    };
    recognition.start();
  }
  if (button.id === "clear-writing") {
    const canvas = document.querySelector("#writing-canvas");
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector("#writing-result").textContent = "";
  }
  if (button.id === "save-writing") {
    document.querySelector("#writing-result").innerHTML = '<div class="dialog-result">Practice complete! Keep tracing slowly, stroke by stroke.</div>';
  }
  if (button.id === "next-situation") updateSituation();
  if (button.id === "translate-button") {
    const query = document.querySelector("#translation-input").value.trim().toLocaleLowerCase();
    document.querySelector("#translation-result").textContent = translations.get(query) || "Not in this small offline phrase list yet. Try a word from the lesson library.";
  }
  if (button.id === "download-lessons") downloadFile("lingua-beginner-lessons.txt", Object.values(vocabulary.beginner).map((word) => `${word.hanzi} (${word.pinyin}) — ${word.meaning}\nExample: ${word.example}`).join("\n\n"));
  if (button.id === "save-reminder") {
    const time = document.querySelector("#reminder-time").value;
    try {
      localStorage.setItem("lingua-reminder-time", time);
      document.querySelector("#dialog-body").insertAdjacentHTML("beforeend", `<div class="dialog-result">Preference saved for ${time}. This prototype cannot send scheduled notifications while closed.</div>`);
    } catch (error) {
      console.error("Could not save reminder preference.", error);
      showToast("Reminder preference could not be saved");
    }
  }
  if (button.id === "start-daily-quiz" || button.id === "start-hsk-quiz") startQuiz();
  if (button.id === "download-certificate") {
    const stage = document.querySelector("#certificate-stage").value;
    const bounds = stage === "beginner" ? [1, 30] : stage === "intermediate" ? [31, 70] : [71, 100];
    const stageComplete = Array.from({ length: bounds[1] - bounds[0] + 1 }, (_, index) => bounds[0] + index)
      .every((level) => completedLevels.includes(level));
    const result = document.querySelector("#certificate-result");
    if (!stageComplete) {
      result.innerHTML = '<div class="dialog-result">Complete and pass every level check in this stage before earning its certificate.</div>';
    } else {
      downloadFile(`lingua-${stage}-certificate.txt`, `Certificate of Completion\n${levelNames[stage]} Chinese · Levels ${bounds[0]}–${bounds[1]}\nAwarded to Jamie Parker`);
      result.innerHTML = '<div class="dialog-result">Certificate downloaded.</div>';
    }
  }
});

dialogBody.addEventListener("submit", (event) => {
  if (event.target.id !== "tutor-form") return;
  event.preventDefault();
  const input = document.querySelector("#tutor-input");
  const question = input.value.trim();
  const chat = document.querySelector("#chat-log");
  const userMessage = document.createElement("div");
  userMessage.className = "chat-message user";
  userMessage.textContent = question;
  chat.append(userMessage);
  const reply = document.createElement("div");
  reply.className = "chat-message";
  reply.textContent = translations.get(question.toLocaleLowerCase())
    ? `${translations.get(question.toLocaleLowerCase())}. Try saying it aloud, then use the speaking practice to compare your pronunciation.`
    : "I can explain words from the lesson library in this preview. Try 你好, 谢谢, 朋友 or “thank you”. Live AI conversation is not connected yet.";
  chat.append(reply);
  chat.scrollTop = chat.scrollHeight;
  input.value = "";
});

dialogBody.addEventListener("change", (event) => {
  if (event.target.id === "situation-select") updateSituation();
});

dialogBody.addEventListener("pointerdown", (event) => {
  if (event.target.id !== "writing-canvas") return;
  const canvas = event.target;
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  context.beginPath();
  context.moveTo((event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY);
  context.lineWidth = 5;
  context.lineCap = "round";
  context.strokeStyle = "#345b44";
  canvas.setPointerCapture(event.pointerId);
  const move = (moveEvent) => {
    if (!canvas.hasPointerCapture(moveEvent.pointerId)) return;
    context.lineTo((moveEvent.clientX - rect.left) * scaleX, (moveEvent.clientY - rect.top) * scaleY);
    context.stroke();
  };
  const end = () => {
    canvas.removeEventListener("pointermove", move);
    canvas.removeEventListener("pointerup", end);
    canvas.removeEventListener("pointercancel", end);
  };
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
});

document.querySelector("#level-test-button").addEventListener("click", runLevelCheck);
document.querySelector("#roadmap-groups").addEventListener("click", (event) => {
  const button = event.target.closest("[data-roadmap-level]");
  if (!button || button.disabled) return;
  const level = Number(button.dataset.roadmapLevel);
  setLevel(level);
  document.querySelector("#test-level-label").textContent = String(level).padStart(2, "0");
  showToast(`Level ${String(level).padStart(2, "0")} selected · ${levelNames[activeLevel]}`);
});
document.querySelectorAll("[data-feature]").forEach((button) => {
  button.addEventListener("click", () => openFeature(button.dataset.feature));
});
document.querySelector("#dialog-close").addEventListener("click", () => featureDialog.close());
featureDialog.addEventListener("click", (event) => {
  if (event.target === featureDialog) featureDialog.close();
});

function downloadFile(filename, contents) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(new Blob([contents], { type: "text/plain;charset=utf-8" }));
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

selectLevel("beginner");
setLevel(currentLevel);
renderRoadmap();
