<template>
  <b-collapse
      class="card place"
      :aria-id="place.id"
      :open="opened"
      @open="onOpen(true)"
      @close="onOpen(false)"
  >
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
      <p class="card-header-title">{{place.name}}</p>
    </div>
    <div v-if="place.tasks.length === 0" class="card-content">
      <task-empty-card @on-add-task="onAddTask(place.id)" />
    </div>
    <div v-else class="card-content tasks">
      <task-table :place="place"
                   @on-edit-task="onEditTask"
                   @on-add-plan="onAddPlan"
                   @on-edit-plan="onEditPlan"
                   @on-do-cleaning="onDoCleaning"
      />
    </div>
    <footer class="card-footer">
      <div class="card-footer-item">
        <b-button type="is-small is-danger"
                  icon-pack="fas"
                  icon-left="trash"
                  @click="onDeletePlace(place.id)">
          削除
        </b-button>
        <div class="buttons">
          <b-button type="is-small"
                    icon-pack="fas"
                    icon-left="edit"
                    @click="onEditPlace(place.id)">
            名前変更
          </b-button>
          <b-button class="is-small is-primary"
                    icon-pack="fas"
                    icon-left="plus"
                    @click="onAddTask(place.id)">
            タスク
          </b-button>
        </div>
      </div>
    </footer>
  </b-collapse>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue} from 'vue-property-decorator'
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import {Place} from '@/interface'
  import TaskTable from '@/components/task/TaskTable.vue'
  import TaskEmptyCard from '@/components/task/TaskEmptyCard.vue'

  dayjs.extend(relativeTime)

  @Component({
    name: 'place-card',
    components: {
      TaskTable,
      TaskEmptyCard,
    },
  })
  export default class PlaceCard extends Vue {
    @Prop() readonly opened!: boolean
    @Prop() readonly place!: Place

    @Emit() onOpen(flag: boolean): boolean { return flag }
    @Emit() onEditPlace(placeId: string): string { return placeId }
    @Emit() onDeletePlace(placeId: string): string { return placeId }
    @Emit() onAddTask(placeId: string): string { return placeId }
    @Emit() onEditTask(taskId: string): string { return taskId }
    @Emit() onAddPlan(taskId: string): string { return taskId }
    @Emit() onEditPlan(planId: string): string { return planId }
    @Emit() onDoCleaning(planId: string): string { return planId }
  }
</script>

<style scoped lang="scss">
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
