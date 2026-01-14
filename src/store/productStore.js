import axios from 'axios'
import { defineStore } from 'pinia'
import statusStore from '../store/statusStore'

export default defineStore('productStore', {
  state: () => ({
    products: [],
  }),
  getters: {
    sortProducts: (state) => [...state.products].sort((a, b) => a.origin_price - b.origin_price)
  },
  actions: {
    getProducts() {
      const status = statusStore()
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/products/all`
      status.isLoading = true
      axios.get(url)
        .then((res) => {
          this.products = res.data.products
          status.isLoading = false
          console.log(this.products)
        })
    }
  }
})