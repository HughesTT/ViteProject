<template>
  <div class="wrap">
    <h1>Price Comparison</h1>
    <div class="main rounded">
      <div class="button-group d-flex justify-content-center">
        <button class="vegetablesBtn btn btn-type border-dark border-2" @click="filterData('N04')">蔬菜</button>
        <button class="fruitsBtn btn btn-type border-dark border-2" @click="filterData('N05')">水果</button>
        <button class="flowersBtn btn btn-type border-dark border-2" @click="filterData('N06')">花卉</button>
      </div>
      <div class="search-group d-flex flex-column flex-md-row">
        <div class="crop-input d-flex mb-2">
          <label for="crop" class="rounded-start text-white">作物名稱</label>
          <input type="text" class="rounded-end" placeholder="輸入作物名稱" id="crop" name="crop" v-model="searchTerm"
            @keydown="searchData">
        </div>
        <button class="search text-white btn mb-2 ms-2" @click="searchData">搜尋</button>
        <button class="reset btn btn-type border-1 mb-2 ms-2" @click="resetData">重新設定</button>
      </div>

      <div class="sort-content d-flex justify-content-md-between justify-content-center">
        <p class="show-result fw-bold"></p>
        <select v-model="sortSelection" name="" id="js-select"
          class="sort-select border-secondary d-none d-md-block rounede p-2 pe-4">
          <option value="">排序</option>
          <option value="上價-up">上價 (升序)</option>
          <option value="上價-down">上價 (降序)</option>
          <option value="中價-up">中價 (升序)</option>
          <option value="中價-down">中價 (降序)</option>
          <option value="下價-up">下價 (升序)</option>
          <option value="下價-down">下價 (降序)</option>
          <option value="平均價-up">平均價 (升序)</option>
          <option value="平均價-down">平均價 (降序)</option>
          <option value="交易量-up">交易量 (升序)</option>
          <option value="交易量-down">交易量 (降序)</option>
        </select>
      </div>
      <table class="market table me-4">
        <thead class="js-sort-advanced">
          <tr>
            <th width="15%">作物名稱</th>
            <th width="15%">市場名稱</th>
            <th width="14%">上價
              <span>
                <i class="bi bi-caret-up-fill" @click="sortData('上價', 'up')"></i>
                <i class="bi bi-caret-down-fill" @click="sortData('上價', 'down')"></i>
              </span>
            </th>
            <th width="14%">中價
              <span>
                <i class="bi bi-caret-up-fill" @click="sortData('中價', 'up')"></i>
                <i class="bi bi-caret-down-fill" @click="sortData('中價', 'down')"></i>
              </span>
            </th>
            <th width="14%">下價
              <span>
                <i class="bi bi-caret-up-fill" @click="sortData('下價', 'up')"></i>
                <i class="bi bi-caret-down-fill" @click="sortData('下價', 'down')"></i>
              </span>
            </th>
            <th width="14%">平均價
              <span>
                <i class="bi bi-caret-up-fill" @click="sortData('平均價', 'up')"></i>
                <i class="bi bi-caret-down-fill" @click="sortData('平均價', 'down')"></i>
              </span>
            </th>
            <th width="14%">交易量
              <span>
                <i class="bi bi-caret-up-fill" @click="sortData('交易量', 'up')"></i>
                <i class="bi bi-caret-down-fill" @click="sortData('交易量', 'down')"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="showList">
          <tr v-for="item in filteredData" :key="item.種類代碼">
            <td class="text-center p-3">{{ item.作物名稱 }}</td>
            <td class="text-center p-3">{{ item.市場名稱 }}</td>
            <td class="text-center p-3">{{ item.上價 }}</td>
            <td class="text-center p-3">{{ item.中價 }}</td>
            <td class="text-center p-3">{{ item.下價 }}</td>
            <td class="text-center p-3">{{ item.平均價 }}</td>
            <td class="text-center p-3">{{ item.交易量 }}</td>
          </tr>
        </tbody>

      </table>
    </div>

    <select id="js-moblie-select"
      class="mobile-select border-2 border-secondary d-block d-md-none rounded-pill pt-1 pb-1 position-fixed end-0 bottom-0  ps-2 pe-3">
      <option>排序</option>
      <option>上價</option>
      <option>中價</option>
      <option>下價</option>
      <option>平均價</option>
      <option>交易量</option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const apiUrl = 'https://shannon945.github.io/farm_produce/data.json'
const allData = ref([]) // 存放全部的資料
const fetchData = () => {
  axios.get(apiUrl)
    .then(res => {
      allData.value = res.data
      console.log(allData.value)
    })
    .catch(err => {
      console.error(err)
    })
}
const filteredData = ref([]) // 存放篩選後的資料
const filterData = (type) => { // 篩選資料函式
  if (type === 'N04' || type === 'N05' || type === 'N06') {
    filteredData.value = allData.value.filter(item => item.種類代碼 === type)
  }
}
const resetData = () => {
  filteredData.value = ''
  searchTerm.value = ''
}
const sortData = (price, sort) => { // 排序資料函式
  filteredData.value.sort((a, b) => { // 根據傳入的價格欄位和排序方式進行排序
    const aPrice = parseFloat(a[price]) // 將字串轉換為數字進行比較
    const bPrice = parseFloat(b[price])
    if (sort === 'up') { // 升冪排序
      return aPrice - bPrice
    } else {
      return bPrice - aPrice
    }
  })
}

const searchTerm = ref('') // 搜尋關鍵字
const searchData = () => {
  if (!searchTerm.value.trim()) {
    return
  }
  filteredData.value = allData.value.filter(item => item.作物名稱.includes(searchTerm.value.trim()))
  searchTerm.value = ''
}

const sortSelection = ref('') // 儲存排序選擇的變數

watch(sortSelection, (newValue) => { // 監聽排序選擇的變化
  if (!newValue) return
  const [priceType, sortOrder] = newValue.split('-') // 分割選擇的值
  sortData(priceType, sortOrder) // 呼叫排序函式
})

onMounted(() => {
  fetchData()
})

</script>

<style lang="scss" scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  height: auto;
}

.inline-flex {
  display: inline-flex;
}

body {
  background: url(https://hexschool.github.io/js-filter/assets/bg.jpg);
  background-size: cover;
  height: 100vh;
  font-family: "NotoSansCJKtc-Bold";
  color: #2a2a2a;
  letter-spacing: 1px;
  white-space: nowrap;
}

.wrap {
  max-width: 1140px;
  margin: 0 auto;
}

.logo a {
  display: block;
  background: url(https://firebasestorage.googleapis.com/v0/b/hexschool-courses.appspot.com/o/course%2FJS%20%E5%89%8D%E7%AB%AF%E4%BF%AE%E7%B7%B4%E5%85%A8%E6%94%BB%E7%95%A5%2F1628942714013-logo%20%E6%94%B9.png?alt=media&token=583e78ed-6a6c-4660-9f0e-2f59f8eb78e2) no-repeat;
  width: 450px;
  height: 105px;
  text-indent: 101%;
  overflow: hidden;
  cursor: pointer;
}

@media (max-width: 767px) {
  .logo a {
    background: url(https://firebasestorage.googleapis.com/v0/b/hexschool-courses.appspot.com/o/course%2FJS%20%E5%89%8D%E7%AB%AF%E4%BF%AE%E7%B7%B4%E5%85%A8%E6%94%BB%E7%95%A5%2F1629001163643-logo-sm.png?alt=media&token=914f40fc-c143-4aaa-a1c3-fb0bdd17fa9c) no-repeat;
    width: 178px;
    height: 50px;
    margin: 1.25rem auto;
  }
}

.main {
  background: #fff;
  border: 5px solid #fff8d45a;
  padding: 2.5rem;
}

@media (max-width: 767px) {
  .main {
    padding: 0.75rem;
  }
}

.btn-type {
  padding: 0.5rem 2.5rem;
  color: #2a2a2a;
  letter-spacing: 1px;
  margin: 0 0.625rem 1.25rem 0;
}

.btn-type:hover,
.btn-type:active {
  background: #f8d45a;
}

@media (max-width: 767px) {
  .btn-type {
    padding: 0.5rem 2.25rem;
    margin: 0 0.375rem 1rem 0;
  }
}

.seach-group {
  white-space: nowrap;
  margin-bottom: 2.5rem;
  width: 100%;
}

.date-input,
.crop-input {
  width: 40.625%;
}

.date-input label,
.crop-input label {
  background: #899e39;
  padding: 0.5rem 1rem;
  width: 27.5%;
}

.date-input input,
.crop-input input {
  width: 80%;
  border: 2px #899e39 solid;
  padding: 0.375rem;
  margin-left: -0.3125rem;
}

.search {
  width: 16.39%;
  background: #899e39;
  padding: 0.5rem 3.375rem;
}

.reset {
  color: #b64747;
  padding: 0.5rem 3.375rem;
}

@media (max-width: 767px) {
  .seach-group {
    margin-bottom: 1.5rem;
  }

  .date-input,
  .crop-input {
    width: 100%;
  }

  .search {
    width: 100%;
  }
}

.sort-select {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: url('data:image/svg+xml;utf8,<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort-down" class="svg-inline--fa fa-sort-down fa-w-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="10 0 320 900"><path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path></svg>') no-repeat;
  background-position: 105px 5px;
}

.show-result {
  font-size: 18px;
  letter-spacing: 1.12px;
}

.sort-content {
  margin-bottom: 1.25rem;
}

.market thead {
  background: #f4f1ea;
  border-top: 2px solid #2a2a2a;
  border-bottom: 2px solid #2a2a2a;
}

.market tbody {
  border-bottom: 2px solid #d9d9d9;
}

@media (max-width: 480px) {
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}

@media (max-width: 767px) {
  .mobile-select {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background: url('data:image/svg+xml;utf8,<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort-down" class="svg-inline--fa fa-sort-down fa-w-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="10 0 320 800"><path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path></svg>') no-repeat;
    background-position: 60px 3px;
  }
}

.sort-advanced {
  position: relative;
}

.fa-caret-up,
.fa-caret-down {
  position: absolute;
}

.fa-caret-up {
  top: -2px;
  right: -15px;
}

.fa-caret-down {
  top: 9px;
  right: -15px;
}
</style>