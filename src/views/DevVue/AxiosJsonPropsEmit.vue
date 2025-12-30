<template>
  <div>
    <h3>資料分頁顯示</h3>
    <div class="database">
      <div class="row">
        <div class="col-md-5 data-card" v-for="item in paginatedData" :key="item._id">
          <div class="card-img">
            <img class="img-fluid" alt="" :src="item.Picture1">
          </div>
          <div class=" card-title">{{ item.name }}
          </div>
          <div class="card-location"><i class="fa-solid fa-location-crosshairs"></i> {{ item.Add }}</div>
          <div class="card-tel">{{ item.Tel }}</div>
        </div>
      </div>
    </div>
  </div>
  <Pagination :currentPage="currentPage" :totalPages="totalPages" @change-page="handlePageChange" />
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import axios from 'axios'
import Pagination from '../../components/AxiosJsonPaginationControls.vue'

const jsonUrl = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json' // 本地JSON檔案路徑
const allData = ref([]) // 定義 allData 儲存所有資料
const currentPage = ref(3) // 定義 currentPage，預設為第1頁
const itemsPerPage = 10 // 每頁顯示項目數量
const fetchData = () => { // 使用 axios 獲取全部資料
  axios.get(jsonUrl)
    .then(res => {
      allData.value = res.data.result.records
      console.log(allData.value)
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}

const paginatedData = computed(() => { // 計算目前頁面要顯示的資料
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allData.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(allData.value.length / itemsPerPage)
})

const handlePageChange = (newPage) => {
  currentPage.value = newPage
}

// 定義滾動到頂部的函式，增加使用者體驗
const scrollToTop = () => {
  window.scrollTo(0, 0)
}

watch(currentPage, () => {
  scrollToTop()
})

onMounted(() => {
  fetchData()
})



</script>

<style lang="scss" scoped>
.database {
  margin-top: 20px;

  .data-card {
    border: 1px solid #999;
    border-radius: 8px;
    padding: 15px;
    margin: 1.5em auto;

    .card-title {
      margin-top: 0.5em;
      font-size: 1.3em;
      font-weight: bold;
    }
  }
}
</style>