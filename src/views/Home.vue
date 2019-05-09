<template>
  <main class="row">
    <div class="col s3">

      <section class="row">
        <div class="card">
          <div class="card-content">
            <span class="card-title">
              Pixel Map Tool
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

          </div>
          <article class="card-action supreme-align">

            <button class="waves-effect waves-light btn" @click="generate">
              Générer
            </button>

            <div class="file-field input-field">
              <div class="waves-effect waves-light btn">
                <span>Charger</span>
                <input type="file" @change="loadFile">
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
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'home',
  components: {
    Selected,
    ToolBox,
    Grid
  },
  computed: {
    ...mapState([
      'name',
      'size'
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
    }
  },
  methods: {
    ...mapMutations([
      'initialize',
      'setName',
      'setSize'
    ]),
    ...mapActions([
      'generate'
    ]),
    loadFile (event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          try {
            this.initialize(JSON.parse(reader.result))
            this.setName(file.name)
          } catch (e) {
            console.error(e)
          }
        })
        reader.readAsText(file)
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
