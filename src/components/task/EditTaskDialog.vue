<template>
  <form @submit.prevent="isCreateMode ? onCreate() : onUpdate()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{isCreateMode ? 'タスクを追加' : 'タスクを編集'}}
        </p>
      </header>
      <section class="modal-card-body">
        <b-field label="場所">
          <b-input
              type="text"
              :value="placeName"
              disabled>
          </b-input>
        </b-field>
        <b-field label="タスク">
          <b-input
              type="text"
              v-model="inputTaskName"
              placeholder="タスク名を入力してください"
              pattern=".*\S+.*"
              required>
          </b-input>
        </b-field>
        <b-field label="リマインド">
          <b-select v-if="hasPlans" placeholder="プランが追加されているため無効化されています" />
          <b-select v-else
                    v-model="selectedInterval"
                    required
          >
            <option v-for="ri in remindIntervals" :key="ri.value" :value="ri.value">{{ri.label}}</option>
          </b-select>
        </b-field>
        <b-field label="メモ">
          <b-input
              type="textarea"
              v-model="inputMemo"
              placeholder="メモを入力できます">
          </b-input>
        </b-field>
      </section>
      <footer :class="isCreateMode ? 'modal-card-foot right' : 'modal-card-foot between'">
        <button v-if="!isCreateMode"
                class="button is-small is-danger"
                type="button"
                @click="confirmDelete"
        >
          削除する
        </button>
        <div>
          <button class="button is-small" type="button" @click="$parent.close()">キャンセル</button>
          <button class="button is-small is-primary">{{isCreateMode ? '作成する' : '更新する'}}</button>
        </div>
      </footer>
    </div>
  </form>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue} from 'vue-property-decorator'
  import {CreateTaskParams, UpdateTaskParams} from '@/interface'
  import * as RemindInterval from '@/enum/remindInterval'

  @Component({
    name: 'edit-task-dialog'
  })
  export default class EditTaskDialog extends Vue {
    $parent: any;
    remindIntervals = RemindInterval.values.map(ri => ({
      value: ri,
      label: RemindInterval.label(ri)
    }))

    @Prop() readonly placeId?: string
    @Prop() readonly placeName!: string
    @Prop() readonly taskId?: string
    @Prop() readonly taskName?: string
    @Prop() readonly hasPlans!: boolean
    @Prop() readonly interval?: number
    @Prop() readonly memo?: string | undefined

    inputTaskName: string = this.taskName || ''
    // noinspection TypeScriptValidateTypes
    selectedInterval: string = this.interval === undefined ? '7' : `${this.interval}`
    inputMemo: string = this.memo || ''

    @Emit()
    onCreate(): CreateTaskParams {
      const params = {
        placeId: this.placeId!,
        name: this.inputTaskName,
        interval: parseInt(this.selectedInterval),
        memo: this.inputMemo.length > 0 ? this.inputMemo : null
      }
      this.$parent.close()
      return params
    }

    @Emit()
    onUpdate(): UpdateTaskParams {
      const params = {
        targetId: this.taskId!,
        name: this.inputTaskName,
        interval: parseInt(this.selectedInterval),
        memo: this.inputMemo.length > 0 ? this.inputMemo : null
      }
      this.$parent.close()
      return params
    }

    @Emit()
    onDelete(): string {
      return this.taskId!
    }

    confirmDelete() {
      this.$buefy.dialog.confirm({
        title: 'タスクを削除します',
        message: 'プランも削除されます。この操作は取り消せません。削除してもよろしいですか。',
        cancelText: 'キャンセル',
        confirmText: '削除する',
        type: 'is-danger',
        hasIcon: true,
        iconPack: 'fas',
        onConfirm: () => {
          this.onDelete()
          this.$parent.close()
        }
      })
    }

    get isCreateMode(): boolean {
      return this.taskId === undefined
    }
  }
</script>

<style lang="scss">
  .modal-card-foot.right {
    justify-content: flex-end !important;
  }
  .modal-card-foot.between {
    justify-content: space-between !important;
  }
</style>
