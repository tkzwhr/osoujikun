<template>
  <div>
    <b-message type="is-warning"
               icon-pack="fas"
               has-icon
               icon-size="is-small"
    >
      <p class="subject">タスクが追加されていません</p>
      <b-button class="is-primary is-small"
                icon-pack="fas"
                icon-left="plus"
                @click="onAddTask"
      >
        タスクを追加する
      </b-button>
    </b-message>
  </div>
</template>

<script lang="ts">
  import {Component, Emit, Vue} from 'vue-property-decorator'

  @Component({
    name: 'task-empty-card',
  })
  export default class TaskEmptyCard extends Vue {
    @Emit() onAddTask() {}
  }
</script>

<style scoped lang="scss">
  .subject {
    margin-bottom: 1rem
  }
</style>
