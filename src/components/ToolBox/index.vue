<template>
  <section class="card">
    <div class="card-content">
      <span class="card-title">
        Boite à outils
      </span>
    </div>
    <ul class="card-image collection">
      <template v-for="(tool, index) in tools">

        <li class="collection-item" :key="index" @click="setToolSelected(tool)" :class="toolSelected && tool.name === toolSelected.name ? 'active' : ''">
          {{tool.name}}
        </li>

        <li v-if="toolSelected && tool.name === toolSelected.name && toolSelected.brushSize" :key="index * 1000" class="collection-item">
          <div class="row">
            <label for="brushSize" class="col s6">
              Taille de pinceau : {{toolSelected.brushSize.value}}
            </label>
            <p class="range-field col s6">
              <input type="range" id="brushSize" :min="toolSelected.brushSize.min" :max="toolSelected.brushSize.max" v-model="toolSelected.brushSize.value"/>
            </p>
          </div>
        </li>

        <li v-if="toolSelected && tool.name === toolSelected.name && toolSelected.config" :key="-index" class="collection-item">
          <div class="container">

            <article class="row" v-for="(value, item) in toolSelected.config" :key="item">
              <div class="input-field col s12">
                <input :id="item" type="number" class="validate" v-model.number="toolSelected.config[item]">
                <label :for="item" class="active">{{item}}</label>
              </div>
            </article>

          </div>
        </li>

      </template>
    </ul>
  </section>
</template>

<script>
import Tools from '@/assets/ToolBox.json'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'tool-box',
  computed: {
    ...mapState([
      'toolSelected'
    ]),
    tools () {
      return Tools
    }
  },
  methods: {
    ...mapMutations([
      'setToolSelected'
    ])
  }
}
</script>

<style lang="scss" scoped>

</style>
