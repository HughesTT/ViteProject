<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <!-- 上一頁按鈕 -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="onPageChange(currentPage - 1)">Previous</a>
      </li>

      <!-- 頁碼按鈕 -->
      <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
        <a class="page-link" href="#" @click.prevent="onPageChange(page)">{{ page }}</a>
      </li>

      <!-- 下一頁按鈕 -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="onPageChange(currentPage + 1)">Next</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['change-page'])

const onPageChange = (page) => {
  if (page >= 1 && page <= props.totalPages) { // 驗證頁碼範圍，有效時才觸發 emit 事件傳遞
    emit('change-page', page)
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  justify-content: center;
  margin-top: 20px;
}
</style>