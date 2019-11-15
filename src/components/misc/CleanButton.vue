<template>
  <div>
    <b-button v-if="plan.latest"
              :type="buttonType"
              :outlined="buttonOutlined"
              class="is-small"
              icon-pack="fas"
              icon-left="calendar-check"
              @click="onDoCleaning"
    >
      {{ plan.latest | fromNow }}
    </b-button>
    <b-button v-else
              type="is-info"
              class="is-small"
              icon-pack="fas"
              icon-left="calendar-check"
              @click="onDoCleaning"
    >
      データなし
    </b-button>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Emit, Prop} from 'vue-property-decorator'
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import {Plan} from '@/interface'
  import {RemindInterval} from '@/enum/remindInterval'

  dayjs.extend(relativeTime)

  @Component({
    name: 'clean-button',
    filters: {
      fromNow: (value: Date) => {
        const date = dayjs(value)
        if (dayjs().diff(date, 'hour') < 24) {
          return '実施済み'
        }
        return date.fromNow()
      },
    },
  })
  export default class CleanButton extends Vue {
    @Prop() readonly plan!: Plan

    @Emit() onDoCleaning(): string { return this.plan.id }

    get buttonType(): string {
      const isSilent = this.plan.interval === RemindInterval.NONE
      if (isSilent) {
        return 'is-dark'
      }

      const isExpired = dayjs().diff(dayjs(this.plan.latest!), 'day') >= this.plan.interval
      return isExpired ? 'is-warning' : 'is-success'
    }

    get buttonOutlined(): boolean {
      return this.plan.interval === RemindInterval.NONE
    }
  }
</script>
