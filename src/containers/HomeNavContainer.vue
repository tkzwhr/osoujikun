<template>
  <home-nav :showsOnlyRecommend="uiStore.showsOnlyRecommend"
            @on-sort="sortPlace"
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
  import SortDialog from '../components/misc/SortDialog.vue'
  import {Sortable} from '@/interface'

  @Component({
    name: 'home-nav-container',
    components: {
      HomeNav,
      SortDialog,
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

    sortPlace() {
      this.$buefy.modal.open({
        parent: this,
        component: SortDialog,
        hasModalCard: true,
        props: {
          list: this.placesStore.places.map(a => ({id:a.id,value:a.name}))
        },
        events: {
          'on-submit': (value: Sortable[]) => this.placesStore.sortPlaces({placeIds: value.map(v => v.id)})
        }
      })
    }
  }
</script>
