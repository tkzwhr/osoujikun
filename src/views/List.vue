<template>
  <div>
    <b-navbar :mobile-burger="false">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <span>お掃除くん</span>
        </b-navbar-item>
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button icon-pack="fas" icon-right="clock" />
            <b-button icon-pack="fas" icon-right="plus" @click="createPlace" />
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <template>
      <b-collapse
          v-for="place in placesStore.places"
          :key="place.id"
          :open="false"
          class="card"
          :aria-id="place.id">
        <div
            slot="trigger"
            slot-scope="props"
            class="card-header"
            role="button"
            :aria-controls="place.id">
          <p class="card-header-title">
            {{place.name}}
          </p>
          <a class="card-header-icon">
            <b-icon
                pack="fas"
                :icon="props.open ? 'angle-down' : 'angle-right'">
            </b-icon>
          </a>
        </div>
        <div class="card-content tasks">
          <b-table
              :data="place.tasks"
              ref="table"
              detailed
              custom-detail-row
              show-detail-icon
              striped
              icon-pack="fas"
              :mobile-cards="false">
            <template slot-scope="props">
              <b-table-column>{{ props.row.name }}</b-table-column>
              <b-table-column class="has-text-right">
                <span :class="
                  [
                    'tag',
                    hasExpired(props.row) ? 'is-warning' : 'is-success'
                  ]"
                >
                  {{ latestPlan(props.row).latest | fromNow }}
                </span>
              </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
              <tr v-for="plan in props.row.plans" :key="`${props.row.name}.${plan.name}`">
                <td></td>
                <td class="plan-name">{{ plan.default ? `(${props.row.name})` : plan.name }}</td>
                <td class="has-text-right">
                  <span :class="
                    [
                      'tag',
                      isExpired(plan) ? 'is-warning' : 'is-success'
                    ]"
                  >
                    {{ plan.latest | fromNow }}
                  </span>
                </td>
              </tr>
            </template>
          </b-table>
        </div>
        <footer class="card-footer">
          <div class="card-footer-item buttons">
            <b-button class="is-small"
                      icon-pack="fas"
                      icon-left="plus">
              タスクを追加
            </b-button>
            <b-button type="is-small is-danger"
                      icon-pack="fas"
                      icon-left="trash"
                      @click="deletePlace(place.id)">
              削除する
            </b-button>
          </div>
        </footer>
      </b-collapse>
    </template>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {getModule} from 'vuex-module-decorators'
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import PlacesModule from '@/store/places'
  import {Plan, Task} from '@/interface'

  dayjs.extend(relativeTime)

  @Component({
    name: 'list',
    filters: {
      fromNow: (value: Date) => dayjs(value).fromNow(),
    }
  })
  export default class HelloWorld extends Vue {
    placesStore = getModule(PlacesModule)

    createPlace() {
      this.$buefy.dialog.prompt({
        message: `場所の名前を入力してください`,
        inputAttrs: {

        },
        trapFocus: true,
        onConfirm: (value) => {
          this.placesStore.createPlace({name: value})
        }
      })
    }

    deletePlace(value: string) {
      this.$buefy.dialog.confirm({
        title: '場所を削除します',
        message: 'タスクとプランも削除されます。この操作は取り消せません。よろしいですか。',
        confirmText: '削除する',
        type: 'is-danger',
        hasIcon: true,
        iconPack: 'fas',
        onConfirm: () => this.placesStore.deletePlace(value)
      })
    }

    latestPlan(task: Task): Plan | undefined {
      return Array.from(task.plans).sort(plan => plan.latest.getTime()).pop()
    }

    hasExpired(task: Task): boolean {
      const expiredPlan = task.plans
          .find(plan => dayjs().diff(dayjs(plan.latest), 'day') >= plan.interval)
      return expiredPlan !== undefined
    }

    isExpired(plan: Plan): boolean {
      return dayjs().diff(dayjs(plan.latest), 'day') >= plan.interval
    }
  }
</script>

<style scoped type="scss">
  .tasks {
    padding: 0;
  }
  .plan-name {
    padding-left: 1.5rem;
  }
  .small {
    font-size: 80%;
  }
</style>

<style type="scss">
  .tasks thead {
    display: none;
  }
</style>
