import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators'

@Module({
  namespaced: true,
  name: 'ui'
})
export default class UiModule extends VuexModule {
  showsOnlyRecommend: boolean = false

  @Mutation
  TOGGLE_RECOMMEND() {
    this.showsOnlyRecommend = !this.showsOnlyRecommend
  }

  @Action
  async toggleRecommend() {
    this.context.commit('TOGGLE_RECOMMEND')
  }
}
