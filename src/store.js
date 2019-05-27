import Vue from 'vue'
import Vuex from 'vuex'
import Tools from '@/assets/ToolBox.json'
import Textures from '@/assets/Textures.json'
import _ from 'lodash'
import Materialize from 'materialize-css'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    RECT_SIZE: 10,

    name: null,
    size: 128,
    texture: null,
    map: null,

    toolSelected: null,
    caseSelected: null,
    indexed: null
  },
  getters: {
    tools: () => Tools,
    textures: () => Textures
  },
  mutations: {
    initialize (state, map) {
      state.indexed = []

      if (map) {
        state.map = map
        console.log(map)
        for (const y in map) {
          for (const x in map[y]) {
            if (!_.includes([ 'Void', 'Vox' ], map[y][x].n)) {
              state.indexed.push({
                item: _.cloneDeep(map[y][x]),
                x: _.toInteger(x),
                y: _.toInteger(y)
              })
            }
          }
        }
      } else {
        state.map = []
        for (let y = 0; y < state.size; y++) {
          state.map.push([])
          for (let x = 0; x < state.size; x++) {
            state.map[y].push({
              n: 'Vox'
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
    setTexture (state, texture) {
      state.texture = texture
    },
    setCaseSelected (state, caseSelected) {
      state.caseSelected = caseSelected
    }
  },
  actions: {
    generate ({ state }) {
      let valid = true

      const playerStarts = _.filter(state.indexed, indexed => indexed.item.n === 'PlayerStart')
      if (playerStarts.length > 1) {
        valid = false
        Materialize.toast({ html: 'Trop de PlayerStart !', classes: 'deep-orange' })
      } else if (playerStarts.length === 0) {
        valid = false
        Materialize.toast({ html: 'Il faut un PlayerStart !', classes: 'deep-orange' })
      }

      const levelExits = _.filter(state.indexed, indexed => indexed.item.n === 'LevelExit')
      if (levelExits.length > 1) {
        valid = false
        Materialize.toast({ html: 'Trop de LevelExit !', classes: 'deep-orange' })
      } else if (levelExits.length === 0) {
        valid = false
        Materialize.toast({ html: 'Il faut un LevelExit !', classes: 'deep-orange' })
      }

      const treasures = _.filter(state.indexed, indexed => indexed.item.n === 'Treasure' && indexed.item.config.index === 0)
      if (treasures.length === 0) {
        valid = false
        Materialize.toast({ html: 'Il faut un Treasure avec l\'Index 0!', classes: 'deep-orange' })
      }

      if (valid) {
        const json = JSON.stringify({
          name: state.name,
          size: state.size,
          texture: state.texture,
          map: state.map
        })

        var element = document.createElement('a')
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(json))
        element.setAttribute('download', state.name)

        element.style.display = 'none'
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)
      }
    },
    load ({ state, commit }, datas) {
      state.name = datas.name
      state.size = datas.size
      state.texture = datas.texture
      commit('initialize', datas.map)
    }
  }
})
