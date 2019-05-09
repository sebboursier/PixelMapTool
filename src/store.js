import Vue from 'vue'
import Vuex from 'vuex'
import Tools from '@/assets/ToolBox.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: null,
    size: 128,
    toolSelected: null,
    caseSelected: null,
    map: null
  },
  getters: {
    tools: () => Tools
  },
  mutations: {
    initialize (state, map) {
      if (map) {
        state.map = map
      } else {
        state.map = []
        for (let y = 0; y < state.size; y++) {
          state.map.push([])
          for (let x = 0; x < state.size; x++) {
            state.map[y].push({
              name: 'Voxel'
            })
          }
        }
      }
    },
    setToolSelected (state, toolSelected) {
      state.toolSelected = toolSelected
    },
    setName (state, name) {
      state.name = name
    },
    setSize (state, size) {
      state.size = size
    },
    setCaseSelected (state, caseSelected) {
      state.caseSelected = caseSelected
    },
    refreshMap (state) {
      state.map = [...state.map]
    }
  },
  actions: {
    generate ({ state }) {
      const json = JSON.stringify(state.map)
      var element = document.createElement('a')
      element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(json))
      element.setAttribute('download', state.name)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    }
  }
})
