<template>
  <h3 class="mb-3">RESTful API (GET)</h3>
  <div class="data-article">
    <p class="category mb-3">GET</p>
    <div class="row">
      <div class="col-md-3 product" v-for="product in products" :key="product.num">
        <p class="product-title">{{ product.title }}</p>
        <p class="product-price">價格: {{ product.price }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])
const products_backup = ref([])
const getProducts = () => {
  const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/products/all`
  axios.get(url)
    .then((res) => {
      if (res.data.success) {
        products.value = res.data.products.reverse()
        products_backup.value = [...res.data.products].reverse() // 建立備份陣列
      }
    })
    .catch((err) => {
      console.error('取得產品失敗:', err)
    })
}

onMounted(() => {
  getProducts()
})
</script>

<style lang="scss" scoped>
.data-article {
  margin-bottom: 40px;

  .category {
    width: 100px;
    font-size: 1.3em;
    font-weight: bold;
    background-color: #f37a2a;
    color: #fff;
    text-align: center;
    border-radius: 10px;
  }

  .product {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;

    .product-title {
      font-weight: bold;
      font-size: 1.2em;
    }

    .product-price {
      color: #999;
    }
  }
}
</style>