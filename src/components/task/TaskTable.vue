<template>
  <b-table
      :data="place.tasks"
      ref="table"
      detailed
      custom-detail-row
      show-detail-icon
      striped
      icon-pack="fas"
      :mobile-cards="false"
      :row-class="rowClass">
    <template slot-scope="props">
      <b-table-column>
        <memo-text :memo="props.row.plan.memo">
          {{ props.row.name }}
        </memo-text>
        <task-action class="task-action"
                     @on-edit-task="onEditTask(props.row.id)"
                     @on-add-plan="onAddPlan(props.row.id)"
        />
      </b-table-column>
      <b-table-column class="has-text-right">
        <clean-button v-if="isSimpleTask(props.row)"
                      :plan="props.row.plan"
                      @on-do-cleaning="onDoCleaning"
        />
        <clean-tag v-else-if="latestPlan(props.row)" :plan="latestPlan(props.row)" />
      </b-table-column>
    </template>
    <template v-if="!isSimpleTask(props.row)" slot="detail" slot-scope="props">
      <tr v-for="plan in props.row.plans" :key="`${props.row.name}.${plan.name}`">
        <td></td>
        <td class="plan-name">
          <memo-text :memo="plan.memo">
            {{ plan.name }}
          </memo-text>
          <b-button class="is-small task-action"
                    icon-pack="fas"
                    icon-right="edit"
                    @click="onEditPlan(plan.id)"
          />
        </td>
        <td class="has-text-right">
          <clean-button :plan="plan" @on-do-cleaning="onDoCleaning" />
        </td>
      </tr>
    </template>
  </b-table>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Emit, Prop} from 'vue-property-decorator'
  import dayjs from 'dayjs'
  import {Place, Plan, Task} from '@/interface'
  import CleanButton from '@/components/misc/CleanButton.vue'
  import CleanTag from '@/components/misc/CleanTag.vue'
  import TaskAction from '@/components/misc/TaskAction.vue'
  import MemoText from '@/components/misc/MemoText.vue'

  @Component({
    name: 'task-table',
    components: {
      CleanButton,
      CleanTag,
      TaskAction,
      MemoText,
    },
  })
  export default class TaskTable extends Vue {
    @Prop() readonly place!: Place

    @Emit() onEditTask(taskId: string): string { return taskId }
    @Emit() onAddPlan(taskId: string): string { return taskId }
    @Emit() onEditPlan(planId: string): string { return planId }
    @Emit() onDoCleaning(planId: string): string { return planId }

    get rowClass(): (row: Task) => string | null {
      return (row: Task) => this.isSimpleTask(row) ? 'hide-arrow-icon-detail': null
    }

    isSimpleTask(task: Task): boolean {
      return task.plans.length === 0
    }

    latestPlan(task: Task): Plan | undefined {
      return Array.from(task.plans)
          .filter(plan => plan.interval > 0 && plan.latest)
          .sort(plan => dayjs(plan.latest!).toDate().getTime())
          .pop()
    }
  }
</script>

<style scoped lang="scss">
  .plan-name {
    padding-left: 2rem;
  }
  .task-action {
    margin-left: 1rem;
  }
</style>

<style lang="scss">
  .tasks thead {
    display: none;
  }
  .hide-arrow-icon-detail a[role='button'] {
    display: none;
  }
</style>
