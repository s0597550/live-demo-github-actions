<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TaskList from './components/TaskList.vue'
import { SITE } from './config'
import { createTask, fetchTasks, isValidTitle, type Task } from './tasks'

const tasks = ref<Task[]>([])
const title = ref('')
const error = ref('')

// Werden von der Pipeline beim Build gesetzt (siehe .github/workflows/ci.yml)
const env = import.meta.env
const build = {
  run: env.VITE_BUILD_RUN as string | undefined,
  sha: (env.VITE_BUILD_SHA as string | undefined)?.slice(0, 7),
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

onMounted(load)
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
        Live aus der Pipeline · Build #{{ build.run }} · {{ build.sha }} · {{ buildTime }}
      </p>
      <p
        v-else
        class="build"
      >
        Lokale Version
      </p>
    </header>

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
</style>
