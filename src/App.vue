<script setup>
import ToastPage from './components/ToastPage.vue';
</script>

<template>
  <div>
    <router-view></router-view>
    <ToastPage />
  </div>
</template>

<style scoped>
@import url("style.css");
@import 'bootstrap/dist/css/bootstrap.min.css';
</style>
