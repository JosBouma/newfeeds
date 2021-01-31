export default {
  state () {
    return {
      items: {},
      sorted: [],
      count: 0
    }
  },

  mutations: {
    ITEMS (state, xmlDoc) {
      const getText = (item, name) => {
        const el = item.querySelector(name)
        if (!el) {
          window.console.error('Not found', name, item)
          throw new Error('Element nout found: ' + name)
        }
        return el.textContent
      }

      const a = document.createElement('a')

      xmlDoc.querySelectorAll('item').forEach((item) => {
        const guid = getText(item, 'link')
        if(state.items[guid]) {
          return
        }
        a.href = guid
        state.sorted.push(guid)
        state.items[guid] = {
          title: getText(item, 'title'),
          date: new Date(getText(item, 'pubDate')),
          host: '_' + a.hostname.replaceAll('.', '')
        }
        state.count++
      })

      state.sorted.sort((a, b) => {
        if (state.items[a].date === state.items[b].date) {
          return 0
        }
        return state.items[a].date > state.items[b].date ? -1 : 1
      })
    }
  }
}
