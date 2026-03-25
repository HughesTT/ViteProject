<template>
  <div class="lazyload">
    <h3>Lazy Load</h3>
    <p>這裡是 Lazy Load 頁面內容，當滾動到對應位置時才會載入。</p>
    <div class="image-container">
      <div class="row">
        <div v-for="url in images" :key="url" class="col-md-12 mb-3">
          <img v-lazy="url" alt="Lazy Image" class="img-fluid">
        </div>
      </div>
    </div>
    <button class="btn btn-secondary back-to-top" @click="backToTop">↑</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const images = [
  '/ViteProject/img/1.jpg',
  '/ViteProject/img/2.jpg',
  '/ViteProject/img/3.jpg',
  '/ViteProject/img/4.jpg',
  '/ViteProject/img/5.jpg',
  '/ViteProject/img/6.jpg',
  '/ViteProject/img/7.jpg',
  '/ViteProject/img/8.jpg',
  '/ViteProject/img/9.jpg',
]

const backToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 監聽滾動事件，當滾動到一定距離時顯示回到頂部按鈕
const handleScroll = () => {
  const backToTopButton = document.querySelector('.back-to-top');
  if (window.scrollY > 600) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: auto;
  min-height: 300px;
  /* 圖片未載入前的佔位高度，讓 IntersectionObserver 能正確判斷是否在視窗內，否則可能無法觸發Lazy Load */
  background-color: #eee;
}

.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: none;
  /* 預設隱藏，滾動到一定距離後顯示 */
}
</style>