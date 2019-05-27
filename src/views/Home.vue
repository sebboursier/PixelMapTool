<template>
  <main class="row">
    <div class="col s3">

      <section class="row">
        <div class="card">
          <div class="card-content">
            <span class="card-title">
              Pixel Map Tool

              <info class="right"/>
            </span>

              <article class="input-field">
                <i class="material-icons prefix">label</i>
                <input id="name" type="text" class="validate" v-model="nameInput">
                <label for="name" class="active">Nom</label>
              </article>

              <article class="input-field">
                <i class="material-icons prefix">grid_on</i>
                <input id="sizeX" type="number" min="64" max="2048" class="validate" v-model="sizeInput">
                <label for="sizeX" class="active">Taille</label>
              </article>

              <article class="input-field">
                <i class="material-icons prefix">wallpaper</i>
                <input id="name" type="text" class="validate" v-model="textureInput">
                <label for="name" class="active">Texture</label>
              </article>

          </div>
          <article class="card-action supreme-align">

            <button class="waves-effect waves-light btn" @click="generate">
              Générer
            </button>

            <div class="file-field input-field">
              <div class="waves-effect waves-light btn">
                <span>Charger</span>
                <input type="file" accept="application/json, image/png" @change="loadFile">
              </div>
            </div>

          </article>
        </div>
      </section>

      <section class="row">
        <selected/>
      </section>

      <section class="row">
        <tool-box/>
      </section>

    </div>

    <div class="col s9">

      <section class="card">
        <div class="card-image">
          <grid/>
        </div>
      </section>

    </div>
  </main>
</template>

<script>
import ToolBox from '@/components/ToolBox'
import Grid from '@/components/Grid'
import Selected from '@/components/Selected'
import Info from '@/components/Info'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: 'home',
  components: {
    Selected,
    ToolBox,
    Grid,
    Info
  },
  computed: {
    ...mapState([
      'name',
      'size',
      'texture'
    ]),
    ...mapGetters([
      'textures'
    ]),
    nameInput: {
      get () {
        return this.name
      },
      set (value) {
        this.setName(value)
      }
    },
    sizeInput: {
      get () {
        return this.size
      },
      set (value) {
        this.setSize(value)
        this.initialize()
      }
    },
    textureInput: {
      get () {
        return this.texture
      },
      set (value) {
        this.setTexture(value)
      }
    }
  },
  methods: {
    ...mapMutations([
      'initialize',
      'setSize',
      'setName',
      'setTexture'
    ]),
    ...mapActions([
      'generate',
      'load'
    ]),
    loadFile (event) {
      const file = event.target.files[0]
      const reader = new FileReader()

      if (file) {
        if (file.type === 'image/png') {
          reader.addEventListener('load', () => {
            const image = new Image()
            image.src = reader.result
            image.onload = () => {
              const canvas = document.createElement('canvas')
              const context = canvas.getContext('2d')
              canvas.width = image.width
              canvas.height = image.height
              context.drawImage(image, 0, 0)

              const level = {
                name: _.split(file.name, '.', 1)[0],
                size: image.width,
                map: []
              }

              for (let y = 0; y < image.height; y++) {
                level.map.push([])
                for (let x = 0; x < image.width; x++) {
                  const imageData = context.getImageData(x, y, image.width, image.height)
                  if (imageData.data[0] === 0 && imageData.data[1] === 0 && imageData.data[2] === 0) {
                    level.map[y].push({
                      n: 'Vox'
                    })
                  } else if (imageData.data[0] === 255 && imageData.data[1] === 255 && imageData.data[2] === 255) {
                    level.map[y].push({
                      n: 'Void'
                    })
                  }
                }
              }

              this.load(level)
            }
          })
          reader.readAsDataURL(file)
        } else {
          reader.addEventListener('load', () => {
            try {
              this.load(JSON.parse(reader.result))
            } catch (e) {
              console.log(e)
            }
          })
          reader.readAsText(file)
        }
      }
    }
  },
  created () {
    this.initialize()
  }
}
</script>

<style lang="scss" scoped>

</style>
