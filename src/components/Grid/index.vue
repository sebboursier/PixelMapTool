<template>
  <svg preserveAspectRatio="xMinYMin meet" :viewBox="viewBox" @mousedown="actionStart" @mousemove="action" @mouseup="actionEnd" ref="grid">

    <defs>
        <rect v-for="(tool, index) in tools" :key="index" :id="tool.name" :width="RECT_SIZE + 1" :height="RECT_SIZE + 1" :class="tool.name"/>
    </defs>

    <g v-for="(line, y) in map" :key="y">
      <use v-for="(data, x) in line" :key="x" :xlink:href="'#' + data.name" :transform="transform(x, y)"/>
    </g>
  </svg>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'

export default {
  name: 'grid',
  data () {
    return {
      mouseDown: false,
      RECT_SIZE: 10
    }
  },
  computed: {
    ...mapState([
      'size',
      'map',
      'toolSelected',
      'caseSelected'
    ]),
    ...mapGetters([
      'tools'
    ]),
    viewBox () {
      return '0 0 ' + this.size * this.RECT_SIZE + ' ' + this.size * this.RECT_SIZE
    }
  },
  methods: {
    ...mapMutations([
      'refreshMap',
      'setCaseSelected'
    ]),
    actionStart (event) {
      this.mouseDown = true
      this.action(event)
    },
    actionEnd (event) {
      this.mouseDown = false
    },
    action (event) {
      const bound = this.$refs.grid.getBoundingClientRect()
      const offsetX = event.clientX - bound.left
      const offsetY = event.clientY - bound.top
      const x = _.floor(offsetX / bound.width * this.size)
      const y = _.floor(offsetY / bound.height * this.size)

      if (this.mouseDown && this.toolSelected) {
        this.map[y][x] = _.cloneDeep(this.toolSelected)
        this.refreshMap()
      } else {
        this.setCaseSelected({ x: x, y: y })
      }
    },
    transform (x, y) {
      return 'translate(' + (x * this.RECT_SIZE) + ' ' + (y * this.RECT_SIZE) + ')'
    }
  }
}
</script>

<style lang="scss" scoped>
.PlayerStart {
  fill: #8bc34a;
}

.LevelExit {
  fill: #9c27b0;
}

.Treasure {
  fill: #03a9f4;
}

.Dwarf {
  fill: #ff9800;
}

.TargetPoint {
  fill: #ffc107;
}

.Voxel {
  fill: black;
}

.Void {
  fill: white;
}
</style>
