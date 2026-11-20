export interface Task {
  id?: number
  title: string
  done: boolean
}

/**
 * Mit VITE_API_URL spricht das Frontend mit dem Quarkus-Backend.
 * Ohne (z. B. auf GitHub Pages) speichert es die Aufgaben im Browser.
 */
export const API_URL: string | undefined = import.meta.env.VITE_API_URL || undefined

const STORAGE_KEY = 'kbe-tasks'

/** Clientseitige Vorprüfung – die verbindliche Validierung macht das Backend. */
export function isValidTitle(title: string): boolean {
  const trimmed = title.trim()
  return trimmed.length > 0 && trimmed.length <= 80
}

export function countOpen(tasks: Task[]): number {
  return tasks.filter((t) => !t.done).length
}

function loadLocal(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Task[]
  } catch {
    return []
  }
}

function saveLocal(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Speicher nicht verfügbar (z. B. privates Fenster) – Aufgaben bleiben nur bis zum Neuladen
  }
}

export async function fetchTasks(): Promise<Task[]> {
  if (!API_URL) return loadLocal()
  const res = await fetch(`${API_URL}/api/tasks`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createTask(title: string): Promise<Task> {
  if (!API_URL) {
    const task: Task = { id: Date.now(), title: title.trim(), done: false }
    saveLocal([...loadLocal(), task])
    return task
  }
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.trim(), done: false }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
