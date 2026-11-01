import { describe, expect, it } from 'vitest'
import { countOpen, isValidTitle } from '../tasks'

describe('isValidTitle', () => {
  it('akzeptiert einen normalen Titel', () => {
    expect(isValidTitle('CI-Pipeline bauen')).toBe(true)
  })

  it('lehnt leere Titel ab', () => {
    expect(isValidTitle('   ')).toBe(false)
  })

  it('lehnt Titel über 80 Zeichen ab', () => {
    expect(isValidTitle('x'.repeat(81))).toBe(false)
  })
})

describe('countOpen', () => {
  it('zählt nur offene Aufgaben', () => {
    expect(
      countOpen([
        { title: 'a', done: false },
        { title: 'b', done: true },
      ]),
    ).toBe(1)
  })
})
