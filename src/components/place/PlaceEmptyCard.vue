<template>
  <div class="container">
    <b-message type="is-warning"
               icon-pack="fas"
               has-icon
               icon-size="is-small"
    >
      <p class="subject">場所が追加されていません</p>
      <b-button class="is-primary is-small"
                icon-pack="fas"
                icon-left="plus"
                @click="onAddPlace"
      >
        場所を追加する
      </b-button>
    </b-message>
  </div>
</template>

<script lang="ts">
  import {Component, Emit, Vue} from 'vue-property-decorator'

  @Component({
    name: 'place-empty-card',
  })
  export default class PlaceEmptyCard extends Vue {
    @Emit() onAddPlace() {}
  }
</script>

<style scoped lang="scss">
  .container {
    padding: .5rem;
  }
  .subject {
    margin-bottom: 1rem
  }
</style>
