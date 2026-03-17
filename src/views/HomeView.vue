<template>
  <div class="container home">
    <NavBar />
    <div class="vertical-text">my</div>
    <div class="homevue">Vue</div>
    <div class="journey">Journey</div>

  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Stack+Sans+Notch:wght@200..700&display=swap');

.home {
  margin-top: 6%;

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

  .journey {
    font-family: "Stack Sans Notch", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-size: 5rem;
    position: absolute;
    margin-left: 750px;
    margin-top: -240px;
    vertical-align: -webkit-baseline-middle;
  }
}
</style>