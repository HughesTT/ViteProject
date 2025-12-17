<template>
  <h3>Axios 引用外部資料</h3>
  <div class="database">
    <div class="row">
      <div class="col-md-5 data-card" v-for="item in getData" :key="item._id">
        <div class="card-img">
          <img :src="item.Picture1" class="img-fluid" alt="">
        </div>
        <div class="card-title">{{ item.Name }}</div>
        <div class="card-location"><i class="fa-solid fa-location-crosshairs"></i> {{ item.Add }}</div>
        <div class="card-tel">{{ item.Tel }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const getData = ref([]) // 宣告變數 getData 儲存取得的資料
const fetchData = () => { // axios讀取外部資料
  const jsonUrl = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json'

  axios.get(jsonUrl)
    .then(response => {
      getData.value = response.data.result.records
      console.log(getData.value)
    })
    .catch(error => {
      console.error('Error', error)
    })
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