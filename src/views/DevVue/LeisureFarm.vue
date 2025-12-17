<template>
  <div class="database">
    <Loading v-model:active="isLoading" />
    <div class="row justify-content-end search-bar">
      <form class="d-flex col-4">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="searchTerm">
        <button class="btn btn-outline-success" type="submit" @click.prevent="filterData"
          @keydown="filterData">Search</button>
        <button class="btn btn-outline-secondary ms-2" type="button" @click="clearSearch">Clear</button>
      </form>
    </div>
    <div class="row">
      <p v-if="searchCache">搜尋關鍵字: {{ searchCache }}</p>
      <p>全部資料共 {{ filteredDataCount }} 筆，目前第 <span class="currentPageCount">{{ currentPage
      }}</span> 頁</p>
      <div class="col-md-5 data-card" v-for="item in paginatedData" :key="item._id">
        <div class="card-img">
          <img :src="item.Photolink" class="card-img img-fluid" alt="">
        </div>
        <div class="card-title">{{ item.Name }}</div>
        <div class="card-location"><i class="bi bi-pin-map-fill"></i> {{
          item.County }}
        </div>
      </div>
    </div>
  </div>
  <LeisureFarmPagination :totalPages="totalPages" :currentPage="currentPage" @change-page="handlePageChange" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LeisureFarm from '../../assets/LeisureFarm.json'
import LeisureFarmPagination from '../../components/LeisureFarmPagination.vue'
import Loading from 'vue-loading-overlay'

const isLoading = ref(false)
const allData = ref([])
const newData = ref([])
const searchTerm = ref('')
const searchCache = ref('')
const itemsPerPage = 10
const currentPage = ref(1)
const filteredDataCount = ref(0)
const totalPages = computed(() => {
  if (newData.value.length > 0) {
    filteredDataCount.value = newData.value.length
  } else {
    filteredDataCount.value = allData.value.length
  }
  console.log('Data Count', filteredDataCount.value)
  return Math.ceil(filteredDataCount.value / itemsPerPage)
})
onMounted(() => {
  isLoading.value = true
  setTimeout(() => {
    allData.value = LeisureFarm
    isLoading.value = false
  }, 1000)
})
// 篩選資料函式
const filterData = () => {
  console.log('searching for:', searchTerm.value)
  isLoading.value = true
  if (searchTerm.value.trim() === '') {
    allData.value = LeisureFarm
    return
  } else {
    newData.value = allData.value.filter(item => {
      return item.Name.includes(searchTerm.value) || item.County.includes(searchTerm.value)
    })
    isLoading.value = false
    if (newData.value.length > 0) {
      allData.value = newData.value
    } else {
      alert('查無資料，請重新輸入')
      allData.value = LeisureFarm
    }
  }
  searchCache.value = searchTerm.value
  searchTerm.value = ''
}

// 分頁資料計算
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  if (newData.value.length === 0) {
    return allData.value.slice(start, end)
  }
  return newData.value.slice(start, end)
})

const handlePageChange = (newPage) => {
  currentPage.value = newPage
  scrollToTop()
}

const scrollToTop = () => {
  window.scrollTo(0, 0)
}

const clearSearch = () => {
  searchTerm.value = ''
  searchCache.value = ''
  newData.value = []
  allData.value = LeisureFarm
}
</script>

<style lang="scss" scoped>
.database {
  .currentPageCount {
    color: #ff5722;
    font-weight: bold;
  }

  .search-bar {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-right: 20px;
  }

  .data-card {
    border: 1px solid #ccc;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 15px;
    margin: 1.5em auto;

    .card-img {
      border-radius: 5px;
      width: 100%;
      height: 200px;
      overflow: hidden;
    }

    .card-title {
      margin-top: 0.5em;
      font-size: 1.3em;
      font-weight: bold;
    }

    .card-location {
      margin-top: 0.3em;
      margin-right: 5px;
      font-size: 1em;
      font-weight: bold;
      color: #91a90b;
    }
  }
}
</style>