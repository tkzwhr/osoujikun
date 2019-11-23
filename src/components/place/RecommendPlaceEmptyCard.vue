<template>
  <div class="container">
    <b-message type="is-success"
               icon-pack="fas"
               has-icon
               icon-size="is-small"
    >
      <p>すべての場所が掃除されています</p>
    </b-message>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component({
    name: 'recommend-place-empty-card',
  })
  export default class RecommendPlaceEmptyCard extends Vue {}
</script>

<style scoped lang="scss">
  .container {
    padding: .5rem;
  }
</style>
