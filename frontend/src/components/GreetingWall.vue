<script setup lang="ts">
import type { Greeting } from '../guestbook'

defineProps<{ greetings: Greeting[]; issueUrl: string }>()

function ago(time: string): string {
  const min = Math.round((Date.now() - new Date(time).getTime()) / 60000)
  if (min < 1) return 'gerade eben'
  if (min < 60) return `vor ${min} Min.`
  return new Date(time).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })
}

function isFresh(time: string): boolean {
  return Date.now() - new Date(time).getTime() < 5 * 60000
}
</script>

<template>
  <section class="wall">
    <div class="wall-head">
      <h2>👋 Grüße aus dem Hörsaal <span class="count">{{ greetings.length }}</span></h2>
      <a
        class="cta"
        :href="issueUrl"
        target="_blank"
        rel="noopener"
      >Gruß senden</a>
    </div>
    <p class="how">
      Tippe auf „Gruß senden“, schreib deinen Namen und tippe auf „Create“. Ein Bot beantwortet dein Issue,
      die Pipeline testet und veröffentlicht die Website neu, und in ca. einer Minute steht dein Gruß hier.
    </p>

    <p
      v-if="greetings.length === 0"
      class="empty"
    >
      Noch keine Grüße – sei die erste Person!
    </p>
    <ul v-else>
      <li
        v-for="(g, i) in greetings"
        :key="`${g.issue}-${g.time}`"
        :class="{ fresh: i === 0 && isFresh(g.time) }"
        :style="{ '--c': g.color }"
      >
        <span class="name">{{ g.name }}</span>
        <span class="meta">@{{ g.user }}<template v-if="g.issue"> · Issue #{{ g.issue }}</template> · {{ ago(g.time) }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.wall {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}
.wall-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
h2 {
  margin: 0;
  font-size: 1.3rem;
}
.count {
  display: inline-block;
  min-width: 1.6rem;
  padding: 0 0.45rem;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 0.9rem;
  text-align: center;
  vertical-align: middle;
}
.cta {
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
.how {
  margin: 0.75rem 0 1rem;
  color: #8b949e;
  font-size: 0.9rem;
}
.empty {
  color: #8b949e;
  font-style: italic;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}
li {
  display: flex;
  flex-direction: column;
  padding: 0.6rem 0.9rem;
  border-left: 4px solid var(--c);
  border-radius: 8px;
  background: #0d1117;
}
.name {
  font-weight: 600;
  font-size: 1.05rem;
  overflow-wrap: anywhere;
}
.meta {
  color: #8b949e;
  font-size: 0.8rem;
}
.fresh {
  animation: pop 0.8s ease-out, glow 2.5s ease-in-out 0.8s 3;
}
@keyframes pop {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes glow {
  50% {
    box-shadow: 0 0 18px var(--c);
  }
}
</style>
