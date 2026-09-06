/* ============================================================
   Blossom — Cute To-Do List
   (Port of the Python tasks.txt app — saved in localStorage)
   ============================================================ */

const STORAGE_KEY = "blossom-tasks";

/* ---------- Data layer (was: tasks.txt) ---------- */

// Python: def load_tasks():
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // like FileNotFoundError → return []
  }
}

// Python: def save_tasks(tasks):
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ---------- State ---------- */

let tasks = loadTasks();

// First visit → seed with sweet starter tasks
if (!tasks) {
  tasks = [
    { text: "Water the plants 🌿", done: false },
    { text: "Finish reading chapter 4 📖", done: true },
    { text: "Buy strawberries 🍓", done: false },
    { text: "Stretch for 10 minutes 🧘‍♀️", done: false },
  ];
  saveTasks();
}

let hideCompleted = false;

/* ---------- DOM refs ---------- */

const listEl = document.getElementById("task-list");
const emptyEl = document.getElementById("empty-state");
const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("task-input");
const countEl = document.getElementById("task-count");
const progressText = document.getElementById("progress-text");
const progressPct = document.getElementById("progress-pct");
const progressFill = document.getElementById("progress-fill");
const encourageEl = document.getElementById("encourage");
const toggleBtn = document.getElementById("toggle-completed");
const clearBtn = document.getElementById("clear-completed");
const resetBtn = document.getElementById("reset-all");
const taglineEl = document.getElementById("tagline");

/* ---------- Tagline with today's date ---------- */

(function setTagline() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  taglineEl.textContent = `${today} — your cute little to-do garden`;
})();

/* ---------- Rendering (was: show_tasks) ---------- */

function render() {
  listEl.innerHTML = "";

  const visible = hideCompleted ? tasks.filter((t) => !t.done) : tasks;

  visible.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " done" : "");

    const check = document.createElement("button");
    check.className = "task-check";
    check.type = "button";
    check.textContent = "✓";
    check.setAttribute("aria-label", "Toggle complete");
    check.addEventListener("click", () => toggleTask(task));

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const del = document.createElement("button");
    del.className = "task-delete";
    del.type = "button";
    del.textContent = "🗑️";
    del.setAttribute("aria-label", "Delete task");
    del.addEventListener("click", () => deleteTask(task, li));

    li.append(check, span, del);
    listEl.appendChild(li);
  });

  // Empty state
  emptyEl.hidden = visible.length > 0;

  // Counts + progress
  const doneCount = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  countEl.textContent = `${total} task${total === 1 ? "" : "s"}`;
  progressText.textContent = `${doneCount} of ${total} done`;
  progressPct.textContent = `${pct}%`;
  progressFill.style.width = pct + "%";

  // Encouragement line
  if (total === 0) encourageEl.textContent = "Plant your first task 🌱";
  else if (pct === 100) encourageEl.textContent = "All bloomed! You're amazing 🌸✨";
  else if (pct >= 60) encourageEl.textContent = "Almost there, keep growing! 🌷";
  else if (pct > 0) encourageEl.textContent = "Nice start, little sprout 🌿";
  else encourageEl.textContent = "You've got this! 💖";
}

/* ---------- Actions ---------- */

// Menu option 2 — Add task
function addTask(text) {
  tasks.push({ text, done: false });
  saveTasks();
  render();
}

// Menu option 3 — Delete task (with a soft exit animation)
function deleteTask(task, li) {
  li.classList.add("leaving");
  setTimeout(() => {
    tasks = tasks.filter((t) => t !== task);
    saveTasks();
    render();
  }, 240);
}

// Bonus — Toggle complete
function toggleTask(task) {
  task.done = !task.done;
  saveTasks();
  render();
}

/* ---------- Events ---------- */

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  addTask(text);
  inputEl.value = "";
  inputEl.focus();
});

toggleBtn.addEventListener("click", () => {
  hideCompleted = !hideCompleted;
  toggleBtn.textContent = hideCompleted ? "Show completed" : "Hide completed";
  render();
});

clearBtn.addEventListener("click", () => {
  if (!tasks.some((t) => t.done)) return;
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
});

resetBtn.addEventListener("click", () => {
  if (tasks.length === 0) return;
  if (confirm("Clear your whole garden? 🥺 This can't be undone.")) {
    tasks = [];
    saveTasks();
    render();
  }
});

/* ---------- Go! ---------- */
render();
