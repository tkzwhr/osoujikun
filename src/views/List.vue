<template>
  <div>
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
          />
          <b-button class="is-primary"
                    icon-pack="fas"
                    icon-left="plus"
                    @click="createPlace"
          />
        </b-navbar-item>
      </template>
    </b-navbar>
    <div v-if="placesStore.places.length === 0" style="padding: .5rem">
      <b-message type="is-warning"
                 icon-pack="fas"
                 has-icon
                 icon-size="is-small"
      >
        <p style="margin-bottom: 1rem">場所が追加されていません</p>
        <b-button class="is-primary is-small"
                  icon-pack="fas"
                  icon-left="plus"
                  @click="createPlace"
        >
          場所を追加する
        </b-button>
      </b-message>
    </div>
    <b-collapse
        v-else
        v-for="place in placesStore.places"
        :key="place.id"
        :open="false"
        class="card place"
        :aria-id="place.id">
      <div
          slot="trigger"
          slot-scope="props"
          class="card-header"
          role="button"
          :aria-controls="place.id">
        <a class="card-header-icon">
          <b-icon
              pack="fas"
              :icon="props.open ? 'angle-down' : 'angle-right'">
          </b-icon>
        </a>
        <p class="card-header-title">
          {{place.name}}
        </p>
      </div>
      <div v-if="place.tasks.length === 0" class="card-content" style="padding: .5rem">
        <b-message type="is-warning"
                   icon-pack="fas"
                   has-icon
                   icon-size="is-small"
        >
          <p style="margin-bottom: 1rem">タスクが追加されていません</p>
          <b-button class="is-primary is-small"
                    icon-pack="fas"
                    icon-left="plus"
                    @click="createTask(place.id)"
          >
            タスクを追加する
          </b-button>
        </b-message>
      </div>
      <div v-else class="card-content tasks">
        <plans-table :place="place"
                     @on-edit-task="editTask"
                     @on-add-plan="createPlan"
                     @on-edit-plan="editPlan"
                     @on-do-cleaning="doCleaning"
        />
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <b-button type="is-small is-danger"
                    icon-pack="fas"
                    icon-left="trash"
                    @click="deletePlace(place.id)">
            削除
          </b-button>
          <div class="buttons">
            <b-button type="is-small"
                      icon-pack="fas"
                      icon-left="edit"
                      @click="editPlace(place.id)">
              名前変更
            </b-button>
            <b-button class="is-small is-primary"
                      icon-pack="fas"
                      icon-left="plus"
                      @click="createTask(place.id)">
              タスク
            </b-button>
          </div>
        </div>
      </footer>
    </b-collapse>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {getModule} from 'vuex-module-decorators'
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import PlacesModule from '@/store/places'
  import PlansTable from '@/components/PlansTable.vue'
  import EditTask from '@/components/EditTask.vue'
  import EditPlan from '@/components/EditPlan.vue'

  dayjs.extend(relativeTime)

  @Component({
    name: 'list',
    components: {
      PlansTable,
      EditTask,
      EditPlan
    },
  })
  export default class List extends Vue {
    placesStore = getModule(PlacesModule, this.$store)

    createPlace() {
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

    createTask(placeId: string) {
      const place = this.placesStore.findPlace(placeId)!
      this.$buefy.modal.open({
        parent: this,
        component: EditTask,
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

    createPlan(taskId: string) {
      const task = this.placesStore.findTask(taskId)!
      const place = this.placesStore.findPlaceByTask(taskId)!
      this.$buefy.modal.open({
        parent: this,
        component: EditPlan,
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
      const defaultPlan = task.plans.find(v => v.default)!
      this.$buefy.modal.open({
        parent: this,
        component: EditTask,
        hasModalCard: true,
        props: {
          taskId,
          placeName: place.name,
          taskName: task.name,
          interval: defaultPlan.interval,
          memo: defaultPlan.memo,
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
        component: EditPlan,
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

<style scoped lang="scss">
  .nav {
    background-color: #00d1b2;
  }
  .place {
    margin: 1rem .5rem;
  }
  .tasks {
    padding: 0;
  }
</style>

<style lang="scss">
  .card-footer-item {
    justify-content: space-between !important;
  }
</style>
