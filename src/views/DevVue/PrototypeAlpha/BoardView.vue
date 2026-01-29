<template>
  <Loading :active="isLoading" />
  <div class="board-container">
    <SideBar :username="username" @selectContent="currentContent = $event" />
    <MainBoard :selected="currentContent" />
  </div>
</template>

<script setup>
import SideBar from '../PrototypeAlpha/SideBar.vue'
import MainBoard from '../PrototypeAlpha/MainBoard.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router' // 引用 useRoute 以取得路由資訊
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import { Toast } from 'bootstrap/js/dist/toast'

const currentContent = ref('') // 預設未選擇，進入頁面時會顯示空白
const route = useRoute() // 使用 useRoute 取得目前路由資訊
const username = computed(() => route.query.username || '') // 從路由查詢參數中取得 username
const isLoading = ref(false)

onMounted(() => {
  // 模擬讀取
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style lang="scss" scoped>
.board-container {
  display: flex;
  height: auto;
  min-height: 100vh;
  background: #333;
  color: #fff;
}
</style>