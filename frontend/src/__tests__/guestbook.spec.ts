import { describe, expect, it } from 'vitest'
import { addGreeting, cleanGreeting, MAX_GREETINGS, MAX_LENGTH, pickColor, type Greeting } from '../guestbook'

const g = (issue: number): Greeting => ({ name: `Gruß ${issue}`, user: 'u', issue, time: '', color: '#fff' })

describe('cleanGreeting', () => {
  it('lässt normale Grüße unverändert', () => {
    expect(cleanGreeting('Hallo von Lisa')).toBe('Hallo von Lisa')
  })

  it('entfernt Links, HTML-Klammern und doppelte Leerzeichen', () => {
    expect(cleanGreeting('  Hi <b>ich</b>   https://spam.example  ')).toBe('Hi bich/b')
  })

  it('kürzt zu lange Titel', () => {
    expect([...cleanGreeting('x'.repeat(200))]).toHaveLength(MAX_LENGTH)
  })

  it('liefert leeren Text für reine Leerzeichen', () => {
    expect(cleanGreeting('   ')).toBe('')
  })
})

describe('pickColor', () => {
  it('erkennt Farbwünsche im Titel', () => {
    expect(pickColor('Hallo von Tom, rot bitte', 'tom')).toBe('#f85149')
    expect(pickColor('Grüße in Grün', 'x')).toBe('#3fb950')
  })

  it('gibt derselben Person immer dieselbe Farbe', () => {
    expect(pickColor('Hallo', 'lisa')).toBe(pickColor('Servus', 'lisa'))
  })
})

describe('addGreeting', () => {
  it('stellt den neuen Gruß nach vorn und begrenzt die Liste', () => {
    const full = Array.from({ length: MAX_GREETINGS }, (_, i) => g(i + 1))
    const result = addGreeting(full, g(99))
    expect(result[0].issue).toBe(99)
    expect(result).toHaveLength(MAX_GREETINGS)
  })
})
