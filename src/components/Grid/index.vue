<template>
  <svg preserveAspectRatio="xMinYMin meet" :viewBox="viewBox" @mousedown="actionStart" @mousemove="action" @mouseup="actionEnd" ref="grid">

    <defs>
        <rect v-for="(tool, index) in tools" :key="index" :id="tool.name" :width="RECT_SIZE" :height="RECT_SIZE" :class="tool.name"/>
    </defs>

    <g v-for="(line, y) in map" :key="y">
      <use v-for="(data, x) in line" :key="x" :xlink:href="'#' + data.name" :transform="transform(x, y)"/>
    </g>

    <links/>

  </svg>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'
import { normalize } from '@/utils/Lib'
import Links from './links'

export default {
  name: 'grid',
  components: {
    Links
  },
  data () {
    return {
      mouseDown: false,
      oldCoords: null
    }
  },
  computed: {
    ...mapState([
      'size',
      'map',
      'toolSelected',
      'caseSelected',
      'indexed',
      'RECT_SIZE'
    ]),
    ...mapGetters([
      'tools'
    ]),
    viewBox () {
      return '0 0 ' + this.size * this.RECT_SIZE + ' ' + this.size * this.RECT_SIZE
    },
    clonedSelected () {
      const cloned = _.cloneDeep(this.toolSelected)
      return {
        name: cloned.name,
        config: cloned.config
      }
    }
  },
  methods: {
    ...mapMutations([
      'setCaseSelected'
    ]),
    actionStart (event) {
      this.mouseDown = true
      this.action(event)
    },
    actionEnd (event) {
      this.mouseDown = false
      this.oldCoords = null
    },
    action (event) {
      const bound = this.$refs.grid.getBoundingClientRect()
      const coords = {
        x: event.clientX - bound.left,
        y: event.clientY - bound.top
      }

      if (this.mouseDown && this.toolSelected && this.oldCoords) {
        const difference = {
          x: coords.x - this.oldCoords.x,
          y: coords.y - this.oldCoords.y
        }
        let vector = normalize(difference, 1)
        let iterations = 1
        if (vector.x !== 0 && vector.y !== 0) {
          iterations = difference.x / vector.x
        }

        for (let i = 0; i < iterations; i++) {
          const x = _.floor((this.oldCoords.x + vector.x * i) / bound.width * this.size)
          const y = _.floor((this.oldCoords.y + vector.y * i) / bound.height * this.size)

          let brushSize = 1
          if (this.toolSelected.brushSize) {
            brushSize = this.toolSelected.brushSize.value
          }

          for (let offsetX = 1; offsetX <= brushSize; offsetX++) {
            for (let offsetY = 1; offsetY <= brushSize; offsetY++) {
              const targetX = x + Math.floor(offsetX - brushSize / 2)
              const targetY = y - Math.floor(offsetY - brushSize / 2)
              if (!_.isEqual(this.map[targetY][targetX], this.clonedSelected)) {
                const removed = this.map[targetY].splice(targetX, 1, this.clonedSelected)

                if (removed.name === 'Dwarf' || removed.name === 'TargetPoint') {
                  _.remove(this.indexed, (indexed) => {
                    return indexed.x === targetX && indexed.y === targetY
                  })
                }
                if (this.clonedSelected.name === 'Dwarf' || this.clonedSelected.name === 'TargetPoint') {
                  this.indexed.push({
                    item: _.cloneDeep(this.clonedSelected),
                    x: targetX,
                    y: targetY
                  })
                }
              }
            }
          }
        }
      } else {
        const x = _.floor(coords.x / bound.width * this.size)
        const y = _.floor(coords.y / bound.height * this.size)
        if (!this.caseSelected || this.caseSelected.x !== x || this.caseSelected.y !== y) {
          this.setCaseSelected({ x: x, y: y })
        }
      }

      this.oldCoords = coords
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
