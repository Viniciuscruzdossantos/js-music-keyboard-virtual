// ===== Dados =====
const NOTES = { a: "Dó", w: "Dó#", s: "Ré", e: "Ré#", d: "Mi", f: "Fá", t: "Fá#", g: "Sol", y: "Sol#", h: "Lá", u: "Lá#", j: "Si", k: "Dó", o: "Dó#", l: "Ré", p: "Ré#", ";": "Mi" };

const SONGS = {
  ode: { title: "Ode à Alegria", notes: "d d f g g f d s a a s d d s s".split(" ") },
  star: { title: "Brilha, brilha, estrelinha", notes: "a a g g h h g f f d d s s a".split(" ") },
  birthday: { title: "Parabéns pra Você", notes: "a a s a f d a a s a g f a a k h f d s u u h f g f".split(" ") },
};

// ===== Elementos e estado =====
const pianoKeys = document.querySelectorAll(".piano-keys .key");
const piano = document.querySelector(".piano-keys");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheck = document.querySelector(".keys-check input");
const notesCheck = document.querySelector(".notes-check input");
const $ = (id) => document.getElementById(id);
const ui = { rec: $("btn-rec"), play: $("btn-play"), clear: $("btn-clear"), song: $("song"), listen: $("btn-listen"), learn: $("btn-learn"), status: $("status") };

const els = {};            // tecla -> elemento
const held = new Set();    // teclas pressionadas agora
const cache = {};          // áudios já carregados
const SAVE_KEY = "piano-gravacao";
let volume = Number(volumeSlider.value);
let recording = false, recStart = 0;
let take = [];             // gravação: [{ k, t }]
let timers = [];           // reprodução em andamento
let learn = null;          // { notes, idx, mistakes }

try { take = JSON.parse(localStorage.getItem(SAVE_KEY)) || []; } catch (e) { take = []; }

const say = (text) => (ui.status.textContent = text);

// ===== Som (várias notas ao mesmo tempo) =====
function playSound(k) {
  cache[k] ??= Object.assign(new Audio(`src/tunes/${k}.wav`), { preload: "auto" });
  const a = cache[k].cloneNode();
  a.volume = volume;
  a.play().catch(() => {});
}

// ===== Teclas =====
function spawnNote(el) {
  const n = document.createElement("b");
  n.className = "pop";
  n.textContent = Math.random() > 0.5 ? "♪" : "♫";
  n.style.left = 20 + Math.random() * 60 + "%";
  n.addEventListener("animationend", () => n.remove());
  el.appendChild(n);
}

function press(k) {
  const el = els[k];
  if (!el || held.has(k)) return;
  held.add(k);
  el.classList.add("active");
  playSound(k);
  spawnNote(el);
  if (recording) take.push({ k, t: Math.round(performance.now() - recStart) });
  if (learn) checkLearn(k);
}
const release = (k) => { held.delete(k); els[k]?.classList.remove("active"); };

pianoKeys.forEach((key, i) => {
  const k = key.dataset.key;
  els[k] = key;
  key.style.setProperty("--hue", i * 21);
  key.querySelector("em").textContent = NOTES[k];
  key.addEventListener("pointerdown", (e) => { e.preventDefault(); press(k); });
  key.addEventListener("pointerenter", (e) => { if (e.buttons === 1) press(k); });   // deslizar o dedo/mouse
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => key.addEventListener(ev, () => release(k)));
});

document.addEventListener("keydown", (e) => {
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (els[k]) { e.preventDefault(); press(k); }
});
document.addEventListener("keyup", (e) => release(e.key.toLowerCase()));
addEventListener("blur", () => [...held].forEach(release));

// ===== Opções =====
volumeSlider.addEventListener("input", (e) => (volume = Number(e.target.value)));
keysCheck.addEventListener("change", () => piano.classList.toggle("hide-letters", !keysCheck.checked));
notesCheck.addEventListener("change", () => piano.classList.toggle("hide-notes", !notesCheck.checked));

// ===== Reprodução (gravação e músicas) =====
function stopPlayback() { timers.forEach(clearTimeout); timers = []; [...held].forEach(release); }

function playSequence(seq, done) {
  stopPlayback();
  seq.forEach(({ k, t }) => {
    timers.push(setTimeout(() => { press(k); timers.push(setTimeout(() => release(k), 220)); }, t));
  });
  const end = (seq.at(-1)?.t ?? 0) + 500;
  timers.push(setTimeout(() => { timers = []; done?.(); }, end));
}
const songToSeq = (notes) => notes.map((k, i) => ({ k, t: i * 420 }));

// ===== Gravar / Tocar =====
function refreshTake() {
  ui.play.disabled = ui.clear.disabled = take.length === 0 || recording;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(take)); } catch (e) {}
}
ui.rec.addEventListener("click", () => {
  if (!recording) {
    stopPlayback(); stopLearn();
    recording = true; take = []; recStart = performance.now();
    ui.rec.textContent = "■ Parar"; ui.rec.classList.add("on");
    say("Gravando... toque o que quiser! 🔴");
  } else {
    recording = false;
    ui.rec.textContent = "● Gravar"; ui.rec.classList.remove("on");
    say(take.length ? `Gravação salva: ${take.length} notas.` : "Nada foi gravado.");
  }
  refreshTake();
});
ui.play.addEventListener("click", () => {
  if (take.length === 0) return;
  say("Tocando a sua gravação... 🎶");
  playSequence(take, () => say("Fim da gravação."));
});
ui.clear.addEventListener("click", () => { take = []; refreshTake(); say("Gravação apagada."); });

// ===== Músicas: ouvir e aprender =====
Object.entries(SONGS).forEach(([id, s]) => ui.song.add(new Option(s.title, id)));

ui.listen.addEventListener("click", () => {
  stopLearn();
  const s = SONGS[ui.song.value];
  say(`Ouvindo: ${s.title} 🎧`);
  playSequence(songToSeq(s.notes), () => say("Agora é a sua vez! Clique em Aprender."));
});

function showTarget() {
  pianoKeys.forEach((k) => k.classList.remove("target"));
  if (learn && learn.idx < learn.notes.length) els[learn.notes[learn.idx]].classList.add("target");
}
function stopLearn() {
  learn = null; showTarget();
  ui.learn.textContent = "Aprender"; ui.learn.classList.remove("on");
}
ui.learn.addEventListener("click", () => {
  if (learn) { stopLearn(); return say("Aula encerrada."); }
  if (recording) return;
  stopPlayback();
  const s = SONGS[ui.song.value];
  learn = { notes: s.notes, idx: 0, mistakes: 0, title: s.title };
  ui.learn.textContent = "Parar aula"; ui.learn.classList.add("on");
  say(`${s.title}: toque a tecla que está piscando (1/${s.notes.length}).`);
  showTarget();
});

function checkLearn(k) {
  if (k === learn.notes[learn.idx]) {
    learn.idx++;
    if (learn.idx >= learn.notes.length) {
      const m = learn.mistakes, stars = m === 0 ? 3 : m <= 3 ? 2 : 1;
      say(`Parabéns! 🎉 "${learn.title}" completa com ${m} erro(s). ${"⭐".repeat(stars)}`);
      return stopLearn();
    }
    say(`${learn.title}: ${learn.idx + 1}/${learn.notes.length}`);
    showTarget();
  } else {
    learn.mistakes++;
    els[k].classList.remove("wrong"); void els[k].offsetWidth; els[k].classList.add("wrong");
  }
}

refreshTake();
