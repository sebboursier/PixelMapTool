<template>
  <g>
    <line v-for="(link, index) in links" :key="index" :x1="RECT_SIZE / 2 + RECT_SIZE * link.start.x" :y1="RECT_SIZE / 2 + RECT_SIZE * link.start.y" :x2="RECT_SIZE / 2 + RECT_SIZE * link.end.x" :y2="RECT_SIZE / 2 + RECT_SIZE * link.end.y"/>
  </g>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'links',
  data () {
    return {
      links: null
    }
  },
  computed: {
    ...mapState([
      'caseSelected',
      'indexed',
      'map',
      'RECT_SIZE'
    ]),
    caseData () {
      if (this.caseSelected) {
        return this.map[this.caseSelected.y][this.caseSelected.x]
      }
      return null
    }
  },
  methods: {
    initialize () {
      this.links = []

      if (this.caseData) {
        let index = -1
        if (this.caseData.name === 'Dwarf') {
          index = this.caseData.config.index
        } else if (this.caseData.name === 'TargetPoint') {
          index = this.caseData.config.dwarf
        }

        if (index >= 0) {
          let cursor = 0
          let item = _.find(this.indexed, indexed => indexed.item.name === 'Dwarf' && indexed.item.config.index === index)

          while (item) {
            const nextItem = _.find(this.indexed, indexed => indexed.item.name === 'TargetPoint' && indexed.item.config.index === cursor && indexed.item.config.dwarf === index)
            if (nextItem) {
              this.links.push({
                start: {
                  x: item.x,
                  y: item.y
                },
                end: {
                  x: nextItem.x,
                  y: nextItem.y
                }
              })
            }
            item = nextItem
            cursor++
          }
        }
      }
    }
  },
  watch: {
    caseSelected () {
      this.initialize()
    }
  },
  created () {
    this.initialize()
  }
}
</script>

<style lang="scss" scoped>
line {
  stroke: #00bcd4;
  stroke-width: 5;
}
</style>
