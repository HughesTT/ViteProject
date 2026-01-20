<template>
  <div class="container concept">
    <NavBar />
    <h1 class="mb-4"><b>Kanban Board</b></h1>
    <div class="row">
      <BoardSideBar @selectContent="currentContent = $event" />
      <BoardContent :selected="currentContent" />
    </div>
  </div>
</template>

<script setup>
import NavBar from '../../../components/NavBar.vue'
import BoardSideBar from '../../../components/BoardSideBar.vue'
import BoardContent from '../../../components/BoardContent.vue'
import { ref } from 'vue'

const currentContent = ref('') // 預設未選擇
</script>

<style lang="scss" scoped>
@import url("../../../style.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css");

.concept {
  margin-top: 100px;
}
</style>