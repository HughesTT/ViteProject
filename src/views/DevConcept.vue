<template>
  <div class="container concept">
    <NavBar />
    <h1 class="mb-4"><b>Portfolio</b></h1>
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>

<style lang="scss" scoped>
@import url("../style.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css");

.concept {
  margin-top: 100px;
}
</style>