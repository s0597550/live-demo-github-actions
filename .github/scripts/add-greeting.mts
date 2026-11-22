// Wird vom Workflow "Publikum" aufgerufen (Node 24 führt TypeScript direkt aus).
// Die Eingaben kommen über Umgebungsvariablen – nie direkt in den Shell-Befehl
// eingesetzt, sonst könnte ein Issue-Titel eigene Befehle einschleusen.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { addGreeting, cleanGreeting, pickColor, type Greeting } from '../../frontend/src/guestbook.ts'

const FILE = 'frontend/src/guestbook.json'
const title = process.env.ISSUE_TITLE ?? ''
const user = (process.env.ISSUE_USER ?? 'unbekannt').replace(/[^\w-]/g, '')
const issue = Number(process.env.ISSUE_NUMBER ?? 0) || 0

const name = cleanGreeting(title)
if (!name) {
  console.log('Leerer Gruß – nichts zu tun.')
  process.exit(0)
}

const list = JSON.parse(readFileSync(FILE, 'utf8')) as Greeting[]
const entry: Greeting = { name, user, issue, time: new Date().toISOString(), color: pickColor(title, user) }
writeFileSync(FILE, JSON.stringify(addGreeting(list, entry), null, 2) + '\n')
console.log(`Gruß eingetragen: "${name}" von @${user}`)

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### 👋 Neuer Gruß\n> ${name}\n\nvon @${user}\n`)
}
