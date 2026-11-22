<script setup lang="ts">
import { ref } from 'vue'
import { cleanGreeting, type Greeting } from '../guestbook'

const props = defineProps<{ greetings: Greeting[]; sendUrl: string; issueUrl: string }>()

const name = ref('')
const state = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

async function send() {
  const clean = cleanGreeting(name.value)
  if (!clean) return
  state.value = 'sending'
  try {
    // "no-cors": Google antwortet ohne CORS-Freigabe – ankommen tut die Nachricht trotzdem
    await fetch(props.sendUrl, { method: 'POST', mode: 'no-cors', body: new URLSearchParams({ name: clean }) })
    state.value = 'sent'
    name.value = ''
  } catch {
    state.value = 'error'
  }
}

function ago(time: string): string {
  const min = Math.round((Date.now() - new Date(time).getTime()) / 60000)
  if (min < 1) return 'gerade eben'
  if (min < 60) return `vor ${min} Min.`
  return new Date(time).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })
}

function isFresh(time: string): boolean {
  return Date.now() - new Date(time).getTime() < 5 * 60000
}

function who(g: Greeting): string {
  if (g.user === 'gast') return 'per QR-Code'
  return g.issue ? `@${g.user} · Issue #${g.issue}` : `@${g.user}`
}
</script>

<template>
  <section class="wall">
    <h2>👋 Grüße aus dem Hörsaal <span class="count">{{ greetings.length }}</span></h2>

    <form
      v-if="sendUrl"
      class="send"
      @submit.prevent="send"
    >
      <input
        v-model="name"
        maxlength="50"
        placeholder="Dein Name (+ Farbe: rot, blau, lila …)"
        :disabled="state === 'sending'"
      >
      <button
        type="submit"
        :disabled="state === 'sending' || !name.trim()"
      >
        {{ state === 'sending' ? 'Sende …' : 'Senden' }}
      </button>
    </form>
    <a
      v-else
      class="cta"
      :href="issueUrl"
      target="_blank"
      rel="noopener"
    >Gruß senden</a>

    <p
      v-if="state === 'sent'"
      class="ok"
    >
      ✅ Angekommen! Die Pipeline testet und veröffentlicht die Website gerade neu – in ca. einer Minute steht dein Name hier.
    </p>
    <p
      v-else-if="state === 'error'"
      class="err"
    >
      Senden hat nicht geklappt – bitte nochmal versuchen.
    </p>
    <p
      v-else
      class="how"
    >
      Namen eintippen, „Senden“ drücken – GitHub Actions testet, baut und veröffentlicht die Website neu.
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
        <span class="meta">{{ who(g) }} · {{ ago(g.time) }}</span>
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
h2 {
  margin: 0 0 1rem;
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
.send {
  display: flex;
  gap: 0.5rem;
}
.send input {
  flex: 1;
  min-width: 0;
  font-size: 1.05rem;
}
.send button {
  font-size: 1.05rem;
}
button:disabled {
  opacity: 0.6;
  cursor: default;
}
.cta {
  display: inline-block;
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
.how,
.ok,
.err {
  margin: 0.75rem 0 1rem;
  font-size: 0.9rem;
}
.how {
  color: #8b949e;
}
.ok {
  color: #3fb950;
  font-weight: 600;
}
.err {
  color: #f85149;
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
