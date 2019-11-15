<template>
  <div>
    <home-nav-container />
    <place-list-container />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import HomeNavContainer from '@/containers/HomeNavContainer.vue'
  import PlaceListContainer from '@/containers/PlaceListContainer.vue'

  @Component({
    name: 'home-page',
    components: {
      PlaceListContainer,
      HomeNavContainer,
    },
  })
  export default class HomePage extends Vue {}
</script>
