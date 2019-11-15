<template>
  <a @click="showMemo" v-if="memo && memo.length > 0">
    <slot></slot>
  </a>
  <span v-else>
      <slot></slot>
  </span>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Prop} from 'vue-property-decorator'

  @Component({
    name: 'memo-text',
  })
  export default class MemoText extends Vue {
    @Prop() readonly memo?: string

    currentSnackbar?: {close: Function}

    showMemo() {
      if (this.currentSnackbar) {
        this.currentSnackbar.close()
      }
      this.currentSnackbar = this.$buefy.snackbar.open({
        duration: 6000,
        message: this.memo!.replace(`\n`, `<br/>`),
        type: 'is-primary',
        position: 'is-bottom',
      })
    }
  }
</script>

<style lang="scss">
</style>
