<template>
  <div class="col-md-9 board-content">
    <p class="no-selection" v-if="currentComponent === undefined">selected left sidebar</p>
    <component v-else :is="currentComponent" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BoardContentA from '../views/DevVue/KanbanBoard/BoardContentA.vue'
import BoardContentB from '../views/DevVue/KanbanBoard/BoardContentB.vue'
import BoardContentC from '../views/DevVue/KanbanBoard/BoardContentC.vue'
// 定義 props 的類型
const props = defineProps({
  selected: {
    type: String,
    required: false
  }
})

// 根據 selected 的值，決定要載入的元件資料
const componentMap = {
  A: BoardContentA,
  B: BoardContentB,
  C: BoardContentC
}
// 計算屬性，根據 selected 動態選擇元件
const currentComponent = computed(() => (componentMap[props.selected]))
</script>

<style lang="scss">
.board-content {
  background-color: #ffffff;
  height: 100vh;
  overflow-y: auto;
}

.no-selection {
  padding: 20px;
  text-align: center;
  color: #999;
  position: relative;
  top: 50px;
}
</style>