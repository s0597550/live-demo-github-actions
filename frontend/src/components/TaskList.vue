<script setup lang="ts">
import { computed } from 'vue'
import { countOpen, type Task } from '../tasks'

const props = defineProps<{ tasks: Task[] }>()

const openCount = computed(() => countOpen(props.tasks))
</script>

<template>
  <section>
    <p class="summary">
      {{ openCount }} von {{ tasks.length }} Aufgaben offen
    </p>
    <ul>
      <li
        v-for="task in tasks"
        :key="task.id"
        :class="{ done: task.done }"
      >
        {{ task.title }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.done {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
