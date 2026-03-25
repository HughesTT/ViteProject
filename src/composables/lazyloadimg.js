export default {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { // 元素進入視窗時
        console.log('載入圖片：', binding.value)
        el.src = binding.value // 設定圖片 src，觸發瀏覽器載入圖片
        observer.unobserve(el) // 載入後停止監視
      }
    },
    {
      rootMargin: '0px 0px 100px 0px', // 視窗底部提前 100px 觸發
      threshold: 0.1 // 元素出現 10% 就觸發
    })
    observer.observe(el)
  }
}