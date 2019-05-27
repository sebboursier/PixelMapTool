<template>
  <section>

    <i class="material-icons modal-trigger blue-grey-text tooltipped" data-position="bottom" data-tooltip="Aide" data-target="modalInfo" ref="modalTrigger">
      info
    </i>

    <article id="modalInfo" class="modal" ref="modal">
      <div class="modal-content">

        <h4>
          Comment générer une nouvelle map
        </h4>

        <blockquote>
          Minimum requis :
          <ul>
            <li>1 PlayerStart</li>
            <li>1 LevelExit</li>
            <li>1 Trésor d'Index 0</li>
          </ul>
        </blockquote>

        <blockquote>
          Où déposer le JSON généré ?
          <ul>
            <li>RACINE_PROJET/Content/Map/Level/Maps</li>
          </ul>
        </blockquote>

        <blockquote>
          Cela suffit-il ?
          <ul>
            <li>Non ! Il faut rajouter les infos de la map dans le Blueprint :</li>
            <li>RACINE_PROJET/Content/System/DataGameInstance_BP</li>
          </ul>
          Si la checkbox "IsInGame" est coché, la map sera disponible depuis l'écran de sélection des niveaux pour le joueur.
        </blockquote>

      </div>
      <div class="modal-footer">
        <a class="modal-close btn-flat">Fermer</a>
      </div>
    </article>

  </section>
</template>

<script>
import Materialize from 'materialize-css'

export default {
  name: 'info',
  mounted () {
    Materialize.Modal.init(this.$refs.modal)
    Materialize.Tooltip.init(this.$refs.modalTrigger)
  }
}
</script>

<style lang="scss" scoped>
.modal-trigger {
  cursor: pointer;
}
</style>
