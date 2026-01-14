import axios from 'axios'
import { defineStore } from 'pinia'
import statusStore from '../store/statusStore'

export default defineStore('cartStore', {
  state: () => ({
    cart: {}
  }),
  actions: {
    addToCart(id, qty = 1) {
      const status = statusStore()
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/cart`
      status.cartLoadingItem = id
      const cart = {
        product_id: id,
        qty,
      }
      axios.post(url, { data: cart })
        .then((res) => {
          status.cartLoadingItem = ''
          this.getCart()
          console.log(res)
        })
    },
    getCart() {
      const status = statusStore()
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/cart`
      status.isLoading = true
      axios.get(url)
        .then((res) => {
          this.cart = res.data.data
          status.isLoading = false
        })
    },
    updateCart(item) {
      const status = statusStore()
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/cart/${item.id}`
      status.isLoading = true
      status.cartLoadingItem = item.id
      const cart = {
        product_id: item.product_id,
        qty: item.qty
      }
      axios.put(url, { data: cart })
        .then((res) => {
          console.log(res)
          this.getCart()
          status.isLoading = false
          status.cartLoadingItem = ''
        })
    },
    removeCartItem(id) {
      const status = statusStore()
      status.cartLoadingItem = id
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/cart/${id}`
      status.isLoading = true
      axios.delete(url)
        .then((res) => {
          console.log(res)
          status.isLoading = false
          status.cartLoadingItem = ''
          this.getCart()
        })
    }
  }
})