export interface Task {
  id?: number
  title: string
  done: boolean
}

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

/** Clientseitige Vorprüfung – die verbindliche Validierung macht das Backend. */
export function isValidTitle(title: string): boolean {
  const trimmed = title.trim()
  return trimmed.length > 0 && trimmed.length <= 80
}

export function countOpen(tasks: Task[]): number {
  return tasks.filter((t) => !t.done).length
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/api/tasks`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createTask(title: string): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.trim(), done: false }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
