<template>
  <div v-if="hasPlaces">
    <place-card v-for="place in places"
                :place="place"
                :key="place.id"
                :opened="opens[place.id] !== undefined ? opens[place.id] : true"
                @on-open="function(flag) { opens[place.id] = flag }"
                @on-edit-place="editPlace"
                @on-delete-place="deletePlace"
                @on-add-task="addTask"
                @on-edit-task="editTask"
                @on-add-plan="addPlan"
                @on-edit-plan="editPlan"
                @on-do-cleaning="doCleaning"
    />
  </div>
  <div v-else-if="placesStore.hasPlaces">
    <recommend-place-empty-card />
  </div>
  <div v-else>
    <place-empty-card @on-add-place="addPlace"/>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {getModule} from 'vuex-module-decorators'
  import PlacesModule from '@/store/places'
  import UiModule from '@/store/ui'
  import PlaceCard from '@/components/place/PlaceCard.vue'
  import PlaceEmptyCard from '@/components/place/PlaceEmptyCard.vue'
  import RecommendPlaceEmptyCard from '@/components/place/RecommendPlaceEmptyCard.vue'
  import EditTaskDialog from '@/components/task/EditTaskDialog.vue'
  import EditPlanDialog from '@/components/plan/EditPlanDialog.vue'
  import {Place} from '@/interface'

  @Component({
    name: 'place-list-container',
    components: {
      PlaceCard,
      PlaceEmptyCard,
      RecommendPlaceEmptyCard,
      EditTaskDialog,
      EditPlanDialog,
    },
  })
  export default class PlaceListContainer extends Vue {
    placesStore = getModule(PlacesModule, this.$store)
    uiStore = getModule(UiModule, this.$store)
    opens = {}

    get places(): Place[] {
      return this.uiStore.showsOnlyRecommend ? this.placesStore.listRecommendPlaces : this.placesStore.places
    }

    get hasPlaces(): boolean {
      return this.uiStore.showsOnlyRecommend ? this.placesStore.hasRecommendPlaces : this.placesStore.hasPlaces
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

    addTask(placeId: string) {
      const place = this.placesStore.findPlace(placeId)!
      this.$buefy.modal.open({
        parent: this,
        component: EditTaskDialog,
        hasModalCard: true,
        props: {
          placeId,
          placeName: place.name
        },
        events: {
          'on-create': this.placesStore.createTask
        }
      })
    }

    addPlan(taskId: string) {
      const task = this.placesStore.findTask(taskId)!
      const place = this.placesStore.findPlaceByTask(taskId)!
      this.$buefy.modal.open({
        parent: this,
        component: EditPlanDialog,
        hasModalCard: true,
        props: {
          taskId,
          placeName: place.name,
          taskName: task.name
        },
        events: {
          'on-create': this.placesStore.createPlan
        }
      })
    }

    editPlace(placeId: string) {
      const place = this.placesStore.findPlace(placeId)!
      this.$buefy.dialog.prompt({
        title: '場所の名前を編集',
        message: '場所の名前を入力してください',
        cancelText: 'キャンセル',
        confirmText: '更新する',
        inputAttrs: {
          value: place.name
        },
        trapFocus: true,
        onConfirm: (value) => {
          this.placesStore.updatePlace({targetId: placeId, name: value})
        }
      })
    }

    editTask(taskId: string) {
      const task = this.placesStore.findTask(taskId)!
      const place = this.placesStore.findPlaceByTask(taskId)!
      this.$buefy.modal.open({
        parent: this,
        component: EditTaskDialog,
        hasModalCard: true,
        props: {
          taskId,
          placeName: place.name,
          taskName: task.name,
          hasPlans: task.plans.length > 0,
          interval: task.plan.interval,
          memo: task.plan.memo,
        },
        events: {
          'on-update': this.placesStore.updateTask,
          'on-delete': this.placesStore.deleteTask
        }
      })
    }

    editPlan(planId: string) {
      const plan = this.placesStore.findPlan(planId)!
      const task = this.placesStore.findTaskByPlan(planId)!
      const place = this.placesStore.findPlaceByTask(task.id)!
      this.$buefy.modal.open({
        parent: this,
        component: EditPlanDialog,
        hasModalCard: true,
        props: {
          planId,
          placeName: place.name,
          taskName: task.name,
          planName: plan.name,
          interval: plan.interval,
          memo: plan.memo,
        },
        events: {
          'on-update': this.placesStore.updatePlan,
          'on-delete': this.placesStore.deletePlan
        }
      })
    }

    deletePlace(value: string) {
      this.$buefy.dialog.confirm({
        title: '場所を削除します',
        message: 'タスクとプランも削除されます。この操作は取り消せません。削除してもよろしいですか。',
        cancelText: 'キャンセル',
        confirmText: '削除する',
        type: 'is-danger',
        hasIcon: true,
        iconPack: 'fas',
        onConfirm: () => this.placesStore.deletePlace(value)
      })
    }

    doCleaning(planId: string) {
      this.placesStore.doCleaning(planId)
    }
  }
</script>
