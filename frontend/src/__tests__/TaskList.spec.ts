import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '../components/TaskList.vue'

describe('TaskList', () => {
  it('zeigt Aufgaben und Zusammenfassung an', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [
          { id: 1, title: 'Workflow schreiben', done: true },
          { id: 2, title: 'Demo üben', done: false },
        ],
      },
    })

    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.text()).toContain('1 von 2 Aufgaben offen')
  })
})
