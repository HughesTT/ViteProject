<template>
  <div class="container home">
    <NavBar />
    <div class="vertical-text">my</div>
    <div class="homevue">Vue</div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Stack+Sans+Notch:wght@200..700&display=swap');

.home {
  margin-top: 100px;

  .vertical-text {
    position: absolute;
    font-family: "Stack Sans Notch", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-size: 6rem;
  }

  .homevue {
    font-family: "Stack Sans Notch", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-size: 24rem;
  }
}
</style>