/**
 * Google-Helfer für die Live-Demo (Google Apps Script, als Web-App veröffentlicht).
 *
 * Die Website schickt einen Namen hierher. Dieses Skript gibt ihn mit dem
 * GitHub-Token an GitHub weiter (repository_dispatch) und startet damit den
 * Workflow "Publikum". Das Token liegt NUR hier in den Skript-Eigenschaften
 * (GITHUB_TOKEN) – nie auf der öffentlichen Website.
 */
const REPO = 's0597550/live-demo-github-actions'
const MAX_PER_10_MIN = 60 // Schutz gegen Spam

function doPost(e) {
  const name = String((e && e.parameter && e.parameter.name) || '').trim().slice(0, 50)
  if (!name) return json({ ok: false, error: 'Kein Name' })

  // einfache Bremse: höchstens MAX_PER_10_MIN Grüße in 10 Minuten
  const cache = CacheService.getScriptCache()
  const count = Number(cache.get('count') || 0)
  if (count >= MAX_PER_10_MIN) return json({ ok: false, error: 'Zu viele Grüße – kurz warten' })
  cache.put('count', String(count + 1), 600)

  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN')
  const res = UrlFetchApp.fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    payload: JSON.stringify({ event_type: 'gruss', client_payload: { name } }),
    muteHttpExceptions: true,
  })
  const ok = res.getResponseCode() === 204
  if (!ok) console.log(`GitHub antwortet ${res.getResponseCode()}: ${res.getContentText()}`)
  return json({ ok })
}

// Zum Testen im Browser: Web-App-URL mit ?name=Test aufrufen
function doGet(e) {
  if (e && e.parameter && e.parameter.name) return doPost(e)
  return json({ ok: true, info: 'Helfer läuft. Test: ?name=Test an die URL hängen.' })
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
