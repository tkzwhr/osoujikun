<template>
  <b-dropdown aria-role="list">
    <button class="button is-small" slot="trigger">
      <b-icon pack="fas" icon="caret-down"></b-icon>
    </button>
    <b-dropdown-item aria-role="listitem" @click="onEditTask">
      <b-icon pack="fas" icon="edit"></b-icon>
      <span class="dropdown-subject">編集</span>
    </b-dropdown-item>
    <!--suppress HtmlUnknownAttribute -->
    <hr class="dropdown-divider" aria-role="menuitem">
    <b-dropdown-item aria-role="listitem" @click="onAddPlan">
      <b-icon pack="fas" icon="plus"></b-icon>
      <span class="dropdown-subject">プランを追加</span>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Emit} from 'vue-property-decorator'

  @Component({
    name: 'task-action',
  })
  export default class TaskAction extends Vue {
    @Emit() onEditTask() {}
    @Emit() onAddPlan() {}
  }
</script>

<style lang="scss">
  .dropdown-subject {
    margin-left: .5rem;
  }
</style>
