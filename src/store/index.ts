import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import PlacesModule from '@/store/places'
import UiModule from '@/store/ui'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    places: PlacesModule,
    ui: UiModule
  },
  plugins: [
    createPersistedState({
      paths: ['places.places']
    })
  ]
})
