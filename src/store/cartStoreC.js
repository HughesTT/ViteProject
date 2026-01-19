import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStatusStore } from '../store/statusStoreC'

export const useCartStore = defineStore('cartStore', () => {
  const cart = ref({})

  function getCart() {
    const status = useStatusStore() // 引用 statusStore
    const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/cart`
    status.isLoading = true
    axios.get(url).then((res) => {
      cart.value = res.data.data
      status.isLoading = false
      console.log(cart.value)
    })
  }

  function addToCart(id, qty = 1) {
    const status = useStatusStore()
    const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/cart`
    status.cartLoadingItem = id
    const cartData = {
      product_id: id,
      qty,
    }
    axios.post(url, { data: cartData }).then((res) => {
      getCart()
      status.cartLoadingItem = ''
    })
  }
  function updateCart(item) {
    const status = useStatusStore()
    const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/cart/${item.id}`
    status.isLoading = true
    status.cartLoadingItem = item.id
    const cartData = {
      product_id: item.product_id,
      qty: item.qty
    }
    axios.put(url, { data: cartData }).then((res) => {
      getCart()
      status.isLoading = false
      status.cartLoadingItem = ''
    })
  }
  function removeCartItem(id) {
    const status = useStatusStore()
    status.cartLoadingItem = id
    const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/cart/${id}`
    status.isLoading = true
    axios.delete(url).then((res) => {
      getCart()
      status.isLoading = false
      status.cartLoadingItem = ''
    })
  }

  return {
    cart,
    addToCart,
    getCart,
    updateCart,
    removeCartItem
  }
})

export default useCartStore