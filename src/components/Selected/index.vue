<template>
  <section class="card" v-if="caseData">
    <div class="card-content">
      <span class="card-title">
        {{caseData.name}}
        <span class="badge">
          Survolé
        </span>
      </span>
      <article class="row" v-for="(value, item) in caseData.config" :key="item">
        <label class="right-align col s6">
          {{item}}
        </label>
        <span class="center-align col s6">
          {{value}}
        </span>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'tool-box',
  computed: {
    ...mapState([
      'caseSelected',
      'map'
    ]),
    caseData () {
      if (this.caseSelected) {
        return this.map[this.caseSelected.y][this.caseSelected.x]
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
