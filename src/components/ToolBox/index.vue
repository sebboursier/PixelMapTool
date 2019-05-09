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
        <li v-if="toolSelected && tool.name === toolSelected.name" :key="-index" class="container">
          <article class="row" v-for="(value, item) in toolSelected.config" :key="item">
            <div class="input-field col s12">
              <input :id="item" type="text" class="validate" v-model="toolSelected.config[item]">
              <label :for="item" class="active">{{item}}</label>
            </div>
          </article>
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
