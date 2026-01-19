<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <h1>Pinia (Composition API)</h1>
    <div class="row mt-4">
      <div class="col-md-7">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortProducts" :key="item.id">
              <td>
                <div>
                  <img :src="item.imageUrl" alt="" class="img-fluid" style="width: 100px;">
                </div>
              </td>
              <td>{{ item.title }}</td>
              <td>{{ item.origin_price }}</td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button type="button" class="btn btn-outline-danger" :disabled="cartLoadingItem === item.id"
                    @click="addToCart(item.id)">
                    <span v-if="cartLoadingItem === item.id" class="spinner-border spinner-grow-sm">
                    </span>
                    加入購物車
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-5">
        <div class="sticky-top">
          <table class="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>名稱</th>
                <th>數量</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="cart.carts">
                <tr v-for="item in cart.carts" :key="item.id">
                  <td>
                    <button type="button" class="btn btn-outline-danger btn-sm" :disabled="cartLoadingItem === item.id"
                      @click="removeCartItem(item.id)">x</button>
                  </td>
                  <td>
                    {{ item.product.title }}
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input type="number" class="form-control" v-model="item.qty"
                        :disabled="cartLoadingItem === item.id" @change="updateCart(item)" min="1">
                      <div class="input-group-text">{{ item.product.unit }}</div>
                    </div>
                  </td>
                  <td class="text-end">
                    <small v-if="cart.final_total !== cart.total" class="text-success">折扣價: </small> {{
                      item.final_total }}
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot>
              <tr>
                <td class="text-end" colspan="3">
                  總計：
                </td>
                <td class="text-end">{{ cart.final_total }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../store/statusStoreC'
import { useProductStore } from '../../store/productStoreC'
import { useCartStore } from '../../store/cartStoreC'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

// 初始化 store
const statusStoreInstance = useStatusStore()
const productStoreInstance = useProductStore()
const cartStoreInstance = useCartStore()

// 使用 storeToRefs 解構 state 和 getters，以便在元件中使用
const { isLoading, cartLoadingItem } = storeToRefs(statusStoreInstance)
const { cart } = storeToRefs(cartStoreInstance)
const { sortProducts } = storeToRefs(productStoreInstance)

// 解構 actions (不需要 storeToRefs，因為方法本身不需要響應)
const { getProducts } = productStoreInstance
const { addToCart, getCart, updateCart, removeCartItem } = cartStoreInstance

// 在元件掛載時取得產品和購物車資料
onMounted(() => {
  getProducts()
  getCart()
})
</script>

<style lang="scss">
body {
  padding: 1em;

  .sticky-top {
    top: 60px;
  }

  .btn-primary {
    margin-right: 10px;
  }

  .dark-theme {
    background: #333;
    color: white;
  }
}
</style>