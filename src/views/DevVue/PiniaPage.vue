<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <h1>Pinia</h1>
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

<script>
import { mapState, mapActions } from 'pinia' // Pinia 的輔助函式，可帶入 store 狀態和方法
import statusStore from '../../store/statusStore'
import cartStore from '../../store/cartStore'
import productStore from '../../store/productStore'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

export default {
  components: {
    Loading
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState(productStore, ['sortProducts']),
    ...mapState(statusStore, ['isLoading', 'cartLoadingItem']),
    ...mapState(cartStore, ['cart']),
  },
  methods: {
    ...mapActions(productStore, ['getProducts']),
    ...mapActions(
      cartStore, ['addToCart', 'getCart', 'updateCart', 'removeCartItem']
    )
  },
  created() {
    this.getProducts()
    this.getCart()
  }
}

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