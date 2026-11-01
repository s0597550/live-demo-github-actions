<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TaskList from './components/TaskList.vue'
import { createTask, fetchTasks, isValidTitle, type Task } from './tasks'

const tasks = ref<Task[]>([])
const title = ref('')
const error = ref('')

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
  <main>
    <h1>KBE Task-Board</h1>
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
body {
  font-family: system-ui, sans-serif;
  max-width: 40rem;
  margin: 2rem auto;
  padding: 0 1rem;
}
.error {
  color: #b42318;
}
</style>
