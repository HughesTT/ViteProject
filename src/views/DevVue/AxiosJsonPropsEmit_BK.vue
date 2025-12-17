<template>
  <div>
    <h3>Axios引用資料，以Props、Emit傳遞資料分頁顯示</h3>
    <p>From AxiosJsonPaginationControls.vue (Component資料夾下)</p>
    <div>
      <ul>
        <li>父元件作為資料管理者，由它來發送axios請求，並將其渲染到畫面上</li>
        <li>引用子元件AxiosJsonPaginationControls.vue做分頁顯示，定義Props、Emit
        </li>
      </ul>
    </div>
    <div class="database">
      <div class="row">
        <div class="col-md-5 data-card" v-for="item in paginatedData" :key="item._id">
          <div class="card-img">
            <img :src="item.Picture1" class="img-fluid" alt="">
          </div>
          <div class="card-title">{{ item.Name }}</div>
          <div class="card-location"><i class="fa-solid fa-location-crosshairs"></i> {{ item.Add }}</div>
          <div class="card-tel">{{ item.Tel }}</div>
        </div>
      </div>
    </div>
    <PaginationEl :current-page="currentPage" :total-pages="totalPages" @change-page="handlePageChange" />
  </div>
</template>

<script setup>
import axios from 'axios'
import PaginationEl from '../../components/AxiosJsonPaginationControls.vue'
import { ref, onMounted, computed } from 'vue'

const allData = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const jsonUrl = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json'
const fetchData = () => { // 使用axios獲取資料
  axios.get(jsonUrl)
    .then(res => {
      allData.value = res.data.result.records
    })
    .catch(error => {
      console.error('Error', error)
    })
}


const totalPages = computed(() => { // 計算總頁數
  return Math.ceil(allData.value.length / itemsPerPage) // 取出整數頁數
})

const paginatedData = computed(() => { // 計算分頁後的資料
  const start = (currentPage.value - 1) * itemsPerPage // 計算起始索引
  const end = start + itemsPerPage // 計算結束索引
  return allData.value.slice(start, end) // 用 slice 回傳分頁後的資料 ，包含從start到end（不包括end）的元素
})

const handlePageChange = (newPage) => { // 處理頁面變更
  currentPage.value = newPage // 更新目前頁面
}

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