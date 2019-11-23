<template>
  <home-nav :showsOnlyRecommend="uiStore.showsOnlyRecommend"
            @on-toggle-recommend="toggleRecommend"
            @on-add-place="addPlace"
  />
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {getModule} from 'vuex-module-decorators'
  import PlacesModule from '@/store/places'
  import UiModule from '@/store/ui'
  import HomeNav from '../components/nav/HomeNav.vue'

  @Component({
    name: 'home-nav-container',
    components: {
      HomeNav,
    },
  })
  export default class HomeNavContainer extends Vue {
    placesStore = getModule(PlacesModule, this.$store)
    uiStore = getModule(UiModule, this.$store)

    toggleRecommend() {
      this.uiStore.toggleRecommend()
    }

    addPlace() {
      this.$buefy.dialog.prompt({
        title: '場所を作成',
        message: '場所の名前を入力してください',
        cancelText: 'キャンセル',
        confirmText: '作成する',
        trapFocus: true,
        inputAttrs: {
          pattern: ".*\\S+.*"
        },
        onConfirm: (value) => {
          this.placesStore.createPlace({name: value})
        }
      })
    }
  }
</script>
