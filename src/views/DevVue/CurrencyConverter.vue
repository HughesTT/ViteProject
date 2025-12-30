<template>
  <h1>Currency Converter</h1>
  <div>
    <p class="mb-4">即時匯率換算 </p>
    <div class="row">
      <div class="col-md-2">
        <div>
          <img src="https://cdn-icons-png.flaticon.com/128/5373/5373308.png" alt="" class="countryimg">
          台幣 TWD<input class="form-control me-2" type="text" v-model="twd" @keyup="convertFromTWD">
        </div>
      </div>
      <div class="col-md-3">
        <div>
          <img src="https://cdn-icons-png.flaticon.com/128/197/197604.png" alt="" class="countryimg"> 日幣 JPY <input
            class="form-control me-2 mb-3" type="text" v-model="jpy">
        </div>
        <div>
          <img src="https://cdn-icons-png.flaticon.com/128/323/323310.png" alt="" class="countryimg"> 美金 USD <input
            class="form-control me-2 mb-3" type="text" v-model="usd">
        </div>
        <div>
          <img src="https://cdn-icons-png.flaticon.com/512/3840/3840766.png" alt="" class="countryimg"> 歐元 EUR <input
            class="form-control me-2 mb-3" type="text" v-model="eur">
        </div>
        <div>
          <img src="https://cdn-icons-png.flaticon.com/128/5111/5111586.png" alt="" class="countryimg"> 韓元 KRW <input
            class="form-control me-2 mb-3" type="text" v-model="krw">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const exchangeUrl = 'https://open.er-api.com/v6/latest/TWD'
const exchangeData = ref({})
const twd = ref(0)
const jpy = ref(0)
const usd = ref(0)
const krw = ref(0)
const eur = ref(0)

const getExchange = () => {
  axios.get(exchangeUrl)
    .then((res) => {
      exchangeData.value = res.data.rates
      twd.value = 1 // 設定 TWD 為 1，下一行執行函式會自動計算其他幣別，在重新整理時會看到初始值
      convertFromTWD()
    })
    .catch((err) => {
      console.log(err)
    })
}

const convertFromTWD = () => {
  jpy.value = (twd.value * exchangeData.value.JPY).toFixed(3)
  usd.value = (twd.value * exchangeData.value.USD).toFixed(3)
  eur.value = (twd.value * exchangeData.value.EUR).toFixed(3)
  krw.value = (twd.value * exchangeData.value.KRW).toFixed(3)
}


onMounted(() => {
  getExchange()
})
</script>

<style scoped>
.countryimg {
  width: 20px;
  height: auto;
  margin-right: 5px;
}
</style>