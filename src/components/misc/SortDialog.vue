<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">
        並び替え
      </p>
    </header>
    <section class="modal-card-body">
      <Draggable v-model="editedList" group="people" class="draggable-list">
        <b-button v-for="item in editedList"
                  :key="item.id"
                  type="is-dark draggable-list-item"
                  outlined
                  expanded
        >
          {{item.value}}
        </b-button>
      </Draggable>
    </section>
    <footer class="modal-card-foot right">
      <button class="button is-small" type="button" @click="$parent.close()">キャンセル</button>
      <button class="button is-small is-primary" type="button" @click="onSubmit">更新する</button>
    </footer>
  </div>
</template>

<script lang="ts">
  import Draggable from 'vuedraggable'
  import {Component, Emit, Prop, Vue} from 'vue-property-decorator'
  import {Sortable} from '@/interface'

  @Component({
    name: 'sort-dialog',
    components: {
      Draggable,
    },
  })
  export default class SortDialog extends Vue {
    $parent: any;

    @Prop() readonly list!: Sortable[]

    editedList: Sortable[] = this.list || []

    @Emit()
    onSubmit() {
      this.$parent.close()
      return this.editedList
    }
  }
</script>

<style lang="scss">
  .draggable-list {
    margin: .5rem !important;
  }
  .draggable-list-item {
    margin-bottom: .5rem !important;
  }
</style>
