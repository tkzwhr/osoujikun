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
      :row-class="function(row) { return isSimpleTask(row) ? 'hide-arrow-icon-detail': ''; }">
    <template slot-scope="props">
      <b-table-column>
        <span v-if="isSimpleTask(props.row)">
          {{ props.row.name }}
        </span>
        <a v-else @click="$refs.table.toggleDetails(props.row)">
          {{ props.row.name }}
        </a>
        <b-button style="margin-left: 1rem"
                  class="is-small"
                  icon-pack="fas"
                  icon-right="edit"
                  @click="onEditTask(props.row.id)"
        />
        <b-button style="margin-left: 1rem"
                  class="is-small"
                  icon-pack="fas"
                  icon-right="plus"
                  @click="onAddPlan(props.row.id)"
        />
      </b-table-column>
      <b-table-column class="has-text-right">
        <b-button v-if="isSimpleTask(props.row) && props.row.plans[0].latest"
                  :type="buttonTypeOfPlan(props.row.plans[0])"
                  :outlined="buttonTypeOfPlan(props.row.plans[0]) === 'is-dark'"
                  class="is-small"
                  icon-pack="fas"
                  icon-left="calendar-check"
                  @click="onDoCleaning(props.row.plans[0].id)"
        >
          {{ props.row.plans[0].latest | fromNow }}
        </b-button>
        <b-button v-else-if="isSimpleTask(props.row)"
                  type="is-info"
                  class="is-small"
                  icon-pack="fas"
                  icon-left="calendar-check"
                  @click="onDoCleaning(props.row.plans[0].id)"
        >
          データなし
        </b-button>
        <b-tag v-else-if="latestPlan(props.row)"
               :class="buttonTypeOfPlan(latestPlan(props.row))"
               rounded
        >
          {{ latestPlan(props.row).latest | fromNow }}
        </b-tag>
      </b-table-column>
    </template>
    <template v-if="!isSimpleTask(props.row)" slot="detail" slot-scope="props">
      <tr v-for="plan in props.row.plans" :key="`${props.row.name}.${plan.name}`">
        <td></td>
        <td class="plan-name">
          <span>{{ plan.default ? `(${props.row.name})` : plan.name }}</span>
          <b-button v-if="plan.default"
                    style="margin-left: 1rem"
                    class="is-small"
                    icon-pack="fas"
                    icon-right="edit"
                    @click="onEditTask(props.row.id)"
          />
          <b-button v-else
                    style="margin-left: 1rem"
                    class="is-small"
                    icon-pack="fas"
                    icon-right="edit"
                    @click="onEditPlan(plan.id)"
          />
        </td>
        <td class="has-text-right">
          <b-button v-if="plan.latest"
                    :type="buttonTypeOfPlan(plan)"
                    :outlined="buttonTypeOfPlan(plan) === 'is-dark'"
                    class="is-small"
                    icon-pack="fas"
                    icon-left="calendar-check"
                    @click="onDoCleaning(plan.id)"
          >
            {{ plan.latest | fromNow }}
          </b-button>
          <b-button v-else
                    type="is-info"
                    class="is-small"
                    icon-pack="fas"
                    icon-left="calendar-check"
                    @click="onDoCleaning(plan.id)"
          >
            データなし
          </b-button>
        </td>
      </tr>
    </template>
  </b-table>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Emit, Prop} from 'vue-property-decorator'
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import {Place, Plan, Task} from '@/interface'

  dayjs.extend(relativeTime)

  @Component({
    name: 'plans-table',
    filters: {
      fromNow: (value: Date) => dayjs(value).fromNow(),
    },
  })
  export default class MultiplePlansTable extends Vue {
    @Prop() readonly place!: Place

    @Emit()
    onEditTask(taskId: string): string {
      return taskId
    }

    @Emit()
    onAddPlan(taskId: string): string {
      return taskId
    }

    @Emit()
    onEditPlan(planId: string): string {
      return planId
    }

    @Emit()
    onDoCleaning(planId: string): string {
      return planId
    }

    isSimpleTask(task: Task): boolean {
      return task.plans.find(v => !v.default) === undefined
    }

    latestPlan(task: Task): Plan | undefined {
      return Array.from(task.plans)
          .filter(plan => plan.interval > 0 && plan.latest)
          .sort(plan => new Date(plan.latest!).getTime())
          .pop()
    }

    buttonTypeOfPlan(plan: Plan): string {
      const isSilent = plan.interval === 0
      if (isSilent) {
        return 'is-dark'
      }

      const isExpired = dayjs().diff(dayjs(plan.latest), 'day') >= plan.interval
      return isExpired ? 'is-warning' : 'is-success'
    }
  }
</script>

<style scoped lang="scss">
  .plan-name {
    padding-left: 2rem;
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
