import axios from 'axios'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStatusStore } from '../store/statusStoreC'

export const useProductStore = defineStore('productStore', () => {
  // state
  const products = ref([])

  // getters
  const sortProducts = computed(() => {
    // 以[...products.value]複製陣列做排序，避免直接修改原陣列
    return [...products.value].sort((a, b) => a.origin_price - b.origin_price)
  })

  // actions
  function getProducts() {
    const status = useStatusStore()
    const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/products/all`
    status.isLoading = true
    axios.get(url)
      .then((res) => {
        products.value = res.data.products
        status.isLoading = false
      })
  }
  return {
    products,
    sortProducts,
    getProducts
  }
})

export default useProductStore