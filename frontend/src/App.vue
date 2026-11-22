<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import GreetingWall from './components/GreetingWall.vue'
import TaskList from './components/TaskList.vue'
import { SITE } from './config'
import greetingData from './guestbook.json'
import type { Greeting } from './guestbook'
import { createTask, fetchTasks, isValidTitle, type Task } from './tasks'

const greetings = greetingData as Greeting[]
const repo = (import.meta.env.VITE_REPO as string | undefined) || 's0597550/live-demo-github-actions'
const issueUrl =
  `https://github.com/${repo}/issues/new?title=${encodeURIComponent('Hallo von ')}` +
  `&body=${encodeURIComponent('Schreib oben deinen Namen hin und tippe auf „Create“. Farbwunsch? Schreib rot, blau, lila, pink, orange oder gelb in den Titel.')}`

const tasks = ref<Task[]>([])
const title = ref('')
const error = ref('')

// Werden von der Pipeline beim Build gesetzt (siehe .github/workflows/ci.yml)
const env = import.meta.env
const fullSha = env.VITE_BUILD_SHA as string | undefined
const build = {
  run: env.VITE_BUILD_RUN as string | undefined,
  label: (env.VITE_BUILD_LABEL as string | undefined) || `Build #${env.VITE_BUILD_RUN}`,
  sha: fullSha?.slice(0, 7),
  time: env.VITE_BUILD_TIME as string | undefined,
}
const buildTime = build.time
  ? new Date(build.time).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })
  : ''

async function load() {
  try {
    tasks.value = await fetchTasks()
    error.value = ''
  } catch {
    error.value = 'Backend nicht erreichbar'
  }
}

async function add() {
  if (!isValidTitle(title.value)) {
    error.value = 'Titel: 1–80 Zeichen'
    return
  }
  try {
    tasks.value.push(await createTask(title.value))
    title.value = ''
    error.value = ''
  } catch {
    error.value = 'Speichern fehlgeschlagen'
  }
}

// Auto-Update: Die veröffentlichte Website fragt alle 8 Sekunden, ob die Pipeline
// eine neuere Version ausgeliefert hat – und lädt sich dann selbst neu.
const updating = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

async function checkForUpdate() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return
    const { sha } = (await res.json()) as { sha?: string }
    if (sha && sha !== fullSha) {
      updating.value = true
      if (timer) clearInterval(timer)
      setTimeout(() => location.replace(`${location.pathname}?v=${sha.slice(0, 7)}`), 1500)
    }
  } catch {
    // offline – beim nächsten Mal wieder versuchen
  }
}

onMounted(() => {
  load()
  if (fullSha) timer = setInterval(checkForUpdate, 8000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <main :style="{ '--accent': SITE.accent }">
    <header>
      <h1>{{ SITE.title }}</h1>
      <p class="subtitle">
        {{ SITE.subtitle }}
      </p>
      <p
        v-if="build.run"
        class="build"
      >
        <span class="dot" />
        Live aus der Pipeline · {{ build.label }} · {{ build.sha }} · {{ buildTime }}
      </p>
      <p
        v-else
        class="build"
      >
        Lokale Version
      </p>
    </header>

    <div
      v-if="updating"
      class="update"
    >
      🚀 Die Pipeline hat eine neue Version veröffentlicht – wird geladen …
    </div>

    <GreetingWall
      :greetings="greetings"
      :send-url="SITE.grussUrl"
      :issue-url="issueUrl"
    />

    <form @submit.prevent="add">
      <input
        v-model="title"
        placeholder="Neue Aufgabe"
      >
      <button type="submit">
        Hinzufügen
      </button>
    </form>
    <p
      v-if="error"
      class="error"
    >
      {{ error }}
    </p>
    <TaskList :tasks="tasks" />
  </main>
</template>

<style>
:root {
  color-scheme: dark;
}
body {
  margin: 0;
  min-height: 100vh;
  background: #0d1117;
  color: #e6edf3;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}
main {
  max-width: 40rem;
  margin: 0 auto;
  padding: 3rem 1rem;
}
header {
  border-top: 6px solid var(--accent);
  background: #161b22;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
h1 {
  margin: 0;
  font-size: 2.2rem;
  color: var(--accent);
}
.subtitle {
  margin: 0.4rem 0 1rem;
  color: #8b949e;
}
.build {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.35rem 0.75rem;
  border: 1px solid #30363d;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #c9d1d9;
}
.dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
}
form {
  display: flex;
  gap: 0.5rem;
}
input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid #30363d;
  border-radius: 8px;
  background: #0d1117;
  color: inherit;
  font-size: 1rem;
}
button {
  padding: 0.6rem 1rem;
  border: 0;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.error {
  color: #f85149;
}
.update {
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 8px 30px rgb(0 0 0 / 50%);
  z-index: 10;
}
</style>
