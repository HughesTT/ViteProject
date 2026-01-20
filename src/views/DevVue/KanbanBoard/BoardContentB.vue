<template>
  <div class="content">
    <h3>Content B</h3>
    <p>Banana</p>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.content {
  background: #ececd6;
  height: 300px;
  padding: 20px;
  border-radius: 15px;
  animation: fadeIn 0.5s ease-in-out;

  h3 {
    font-size: 2em;
  }

  p {
    color: #999;
    font-size: 1.5em;
    font-weight: bold;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
}
</style>