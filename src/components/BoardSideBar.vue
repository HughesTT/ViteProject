<template>
  <div class="col-md-3">
    <ul class="sidebar">
      <li><a href="#" @click.prevent="$emit('selectContent', 'A')">Content A</a></li>
      <li><a href="#" @click.prevent="$emit('selectContent', 'B')">Content B</a></li>
      <li><a href="#" @click.prevent="$emit('selectContent', 'C')">Content C</a></li>
    </ul>
  </div>
</template>

<script setup>
defineEmits(['selectContent']) // 定義 emit 事件
</script>

<style lang="scss">
.sidebar {
  background-color: #eee;
  padding: 0;
  border-radius: 15px;

  li {
    list-style-type: none;
    text-align: center;

    a {
      display: block;
      padding: 20px 10px;
      color: #333;
      text-decoration: none;
      transition: ease-in-out 0.3s;

      &:hover {
        background-color: #ddd;
        box-sizing: border-box;
      }
    }

    &:first-child a {
      border-radius: 15px 15px 0 0;
    }

    &:last-child a {
      border-radius: 0 0 15px 15px;
    }
  }
}
</style>