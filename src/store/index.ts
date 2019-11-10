import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import PlacesModule from '@/store/places'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    places: PlacesModule
  },
  plugins: [
    createPersistedState()
  ]
})
