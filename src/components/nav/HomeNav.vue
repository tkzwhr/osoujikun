<template>
  <b-navbar class="nav"
            fixed-top
  >
    <template slot="brand">
      <b-navbar-item tag="div">
        <span class="has-text-weight-bold has-text-white">お掃除くん</span>
      </b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item tag="div" class="is-primary buttons">
        <b-button class="is-primary"
                  icon-pack="fas"
                  icon-left="clock"
                  @click="onToggleRecommendation"
        />
        <b-button class="is-primary"
                  icon-pack="fas"
                  icon-left="plus"
                  @click="onAddPlace"
        />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
  import {Component, Emit, Vue} from 'vue-property-decorator'

  @Component({
    name: 'home-nav',
  })
  export default class HomeNav extends Vue {
    @Emit() onToggleRecommendation() {}
    @Emit() onAddPlace() {}
  }
</script>

<style scoped lang="scss">
  .nav {
    background-color: #00d1b2;
  }
</style>
