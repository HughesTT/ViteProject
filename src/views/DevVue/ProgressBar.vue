<template>
  <div class="progressbar mb-5">
    <h3>進度顯示</h3>
    <div class="progress mb-3">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
        :style="{ width: uploading.percent }" :aria-valuenow="uploading.current" aria-valuemin="0" aria-valuemax="100">
        {{ uploading.percent }}
      </div>
    </div>
    <button class="btn btn-outline-info btn-sm me-3" @click="simulateUpload">Start Upload</button>
    <button class="btn btn-outline-primary btn-sm" @click="resetUpload">Reset</button>
  </div>
  <div class="progressbar mb-5">
    <div class="progress mb-3">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
        :style="{ width: progressinfo.percent }" :aria-valuenow="progressinfo.current" aria-valuemin="0"
        aria-valuemax="100">
        {{ progressinfo.percent }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { random } from 'lodash' // 引用 lodash 的 random 函式來模擬上傳進度的增加量
import { ref, onMounted } from 'vue'

const uploading = ref({ current: 0, total: 100, percent: '0%' }) // 定義上傳進度狀態
const progressinfo = ref({ current: 0, percent: '0%' }) // 定義讀取頁面後自動執行的進度狀態
// 模擬上傳過程函式
const simulateUpload = () => {
  const interval = setInterval(() => { // 使用 setInterval 模擬，每 500ms 重複執行符合邏輯的函式，直到條件不再滿足
    if (uploading.value.current < uploading.value.total) { // 執行條件：目前上傳進度小於100
      uploading.value.current += random(5, 35) // 模擬每次上傳增加 5-35 的進度
      uploading.value.percent = Math.min((uploading.value.current / uploading.value.total) * 100, 100).toFixed(0) + '%' // 計算百分比並限制在 100%，只顯示整數
    } else {
      clearInterval(interval) // 上傳完成後清除 interval，停止模擬
    }
  }, 500)
}
const resetUpload = () => {
  uploading.value.current = 0
  uploading.value.percent = '0%'
}

const setTimeProgress = () => {
  setTimeout(() => {
    progressinfo.value.current = 0
    progressinfo.value.percent = '72%'
  }, 500)
} // 延遲 500ms 後將進度設為 72%

onMounted(() => {
  setTimeProgress()
})
</script>

<style></style>