document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const setBtn = document.getElementById("setBtn");
  const minutesInput = document.getElementById("minutesInput");
  const sessionsCountEl = document.getElementById("sessionsCount");
  const totalMinutesEl = document.getElementById("totalMinutes");
  const progressBar = document.getElementById("progressBar");

  const apiKeyInput = document.getElementById("apiKeyInput");
  const saveKeyBtn = document.getElementById("saveKeyBtn");
  const aiTipBtn = document.getElementById("aiTipBtn");
  const summarizeBtn = document.getElementById("summarizeBtn");
  const aiLog = document.getElementById("aiLog");
  const notesEl = document.getElementById("notes");
  const clearLogBtn = document.getElementById("clearLogBtn");
  const chips = document.querySelectorAll(".chip");

  const themeToggle = document.getElementById("themeToggle");

  let defaultMinutes = Number(localStorage.getItem("defaultMinutes")) || 25;
  let originalDuration = Math.max(1, defaultMinutes) * 60;
  let remaining = originalDuration;
  let timerId = null;
  let sessionsCompleted =
    Number(localStorage.getItem("sessionsCompleted")) || 0;
  let totalMinutes = Number(localStorage.getItem("totalMinutes")) || 0;

  minutesInput.value = defaultMinutes;
  sessionsCountEl.textContent = sessionsCompleted;
  totalMinutesEl.textContent = totalMinutes;

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateDisplay() {
    display.textContent = formatTime(remaining);
    const pct =
      originalDuration > 0
        ? Math.max(0, Math.min(100, 100 - (remaining / originalDuration) * 100))
        : 0;
    progressBar.style.width = pct + "%";
  }

  function updateSessions() {
    sessionsCountEl.textContent = sessionsCompleted;
    const roundedTotal = Math.round(totalMinutes * 100) / 100;
    totalMinutesEl.textContent = roundedTotal;
    localStorage.setItem("sessionsCompleted", sessionsCompleted);
    localStorage.setItem("totalMinutes", roundedTotal);
  }

  function appendLog(text) {
    const p = document.createElement("p");
    p.textContent = text;
    aiLog.prepend(p);
  }

  function notify(msg) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Focus Timer", { body: msg });
    } else {
      try {
        if (navigator.vibrate) navigator.vibrate(200);
      } catch (e) {}
      appendLog(msg);
    }
  }

  function tick() {
    if (remaining <= 0) {
      clearInterval(timerId);
      timerId = null;
      sessionsCompleted++;
      totalMinutes += originalDuration / 60;
      updateSessions();
      notify("Session complete!");
      appendLog(
        "Session complete - you can summarize this session with the AI."
      );
      remaining = originalDuration;
      updateDisplay();
      return;
    }
    remaining--;
    updateDisplay();
  }

  startBtn.addEventListener("click", () => {
    if (timerId) return;
    timerId = setInterval(tick, 1000);
  });

  pauseBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(timerId);
    timerId = null;
    remaining = originalDuration;
    updateDisplay();
  });

  setBtn.addEventListener("click", () => {
    const minutes = Number(minutesInput.value);
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 60) {
      alert("Please enter minutes between 1 and 60");
      return;
    }
    defaultMinutes = Math.round(minutes);
    originalDuration = defaultMinutes * 60;
    remaining = originalDuration;
    localStorage.setItem("defaultMinutes", defaultMinutes);
    updateDisplay();
    appendLog(`Timer set to ${defaultMinutes} minute(s).`);
  });

  minutesInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") setBtn.click();
  });

  saveKeyBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      alert("Paste your OpenRouter API key");
      return;
    }
    localStorage.setItem("or_api_key", key);
    appendLog("API key saved locally (for testing).");
  });

  const savedKey = localStorage.getItem("or_api_key");
  if (savedKey) apiKeyInput.value = savedKey;

  async function callOpenRouter(prompt) {
    const key = localStorage.getItem("or_api_key") || apiKeyInput.value.trim();
    if (!key) {
      alert("Please paste your OpenRouter API key and Save.");
      return null;
    }
    appendLog("Calling AI...");
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        body: JSON.stringify({
          model: "xiaomi/mimo-v2-flash:free",
          messages: [{ role: "user", content: prompt }],
          reasoning: { enabled: true },
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        appendLog("AI error: " + txt);
        return null;
      }
      const data = await res.json();
      const content =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text ||
        JSON.stringify(data);
      appendLog("AI: " + String(content).slice(0, 800));
      return content;
    } catch (err) {
      appendLog("AI request failed: " + (err.message || err));
      return null;
    }
  }

  aiTipBtn.addEventListener("click", async () => {
    const notes = notesEl.value.trim();
    const prompt =
      notes ||
      "Give me a concise 3-item focus tip for a 25 minute Pomodoro session.";
    const r = await callOpenRouter(prompt);
    if (r) alert("AI Tip:\n\n" + r);
  });

  summarizeBtn.addEventListener("click", async () => {
    const notes =
      notesEl.value.trim() ||
      "No notes provided. Please summarize common benefits and suggestions for next session.";
    const prompt = `Summarize the following focus session notes and give 3 concrete suggestions to improve next session. Notes:\n\n${notes}`;
    const r = await callOpenRouter(prompt);
    if (r) {
      appendLog("Summary: " + String(r).slice(0, 900));
      alert("Session Summary:\n\n" + r);
    }
  });

  clearLogBtn.addEventListener("click", () => {
    aiLog.innerHTML = "";
  });

  chips.forEach((c) =>
    c.addEventListener("click", () => (notesEl.value = c.dataset.prompt))
  );

  function setTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.classList.add("dark");
      themeToggle.setAttribute("aria-pressed", "true");
      themeToggle.innerHTML = svgIcon("moon");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.classList.remove("dark");
      themeToggle.setAttribute("aria-pressed", "false");
      themeToggle.innerHTML = svgIcon("sun");
      localStorage.setItem("theme", "light");
    }
  }

  function svgIcon(name) {
    if (name === "moon") {
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/>
      </svg>`;
    }

    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6.76 4.84l-1.8-1.79L3.17 5.84l1.79 1.79 1.8-2.79zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm7.03-5.03l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM17.24 4.84l1.79-1.79L18.83 1.05l-1.79 1.79 0.2 2.0zM12 5a7 7 0 100 14 7 7 0 000-14z" fill="currentColor"/>
    </svg>`;
  }

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    setTheme(storedTheme === "dark" ? "dark" : "light");
  } else {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  themeToggle.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark" ||
      document.body.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });

  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().catch((err) => {
      console.error("Notification permission request failed:", err);
    });
  }

  updateDisplay();
  updateSessions();
});
