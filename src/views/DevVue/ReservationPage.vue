<template>
  <div>
    <h1>Reservation Page</h1>
  </div>
  <div class="gx-2">
    <div class="row gx-3 py-3">
      <div class="col-md-4">
        <div class="list-group" v-for="item in products" :key="item.engName">
          <a href="#" class="list-group-item list-group-item-action" @click.prevent="itemSelected(item)"
            :class="{ 'active': selectedItem.name === item.name }">
            <h6 class="card-title mb-1">{{ item.name }}</h6>
            <div class="d-flex align-items-center justify-content-between">
              <p class="mb-0">
                <small>{{ item.engName }}</small>
              </p>
              <p class="mb-0">NT$ {{ item.price }} 元</p>
            </div>
          </a>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card mb-2">
          <div class="cardblock position-absolute text-white d-flex align-item-center justify-content-conter"
            v-if="!selectedItem">請先選擇飲品
          </div>
          <div class="card-body px-4">
            <div class="mb-3">
              <label for="" class="form-label d-block">數量</label>
              <input type="number" class="form-control" min="0" v-model="selectedItem.quantity">
            </div>
            <div class="mb-3">
              <label class="form-label d-block">冰塊</label>
              <div class="form-check form-check-inline" v-for="(ice, key) in iceType" :key="'ice' + key">
                <input type="radio" name="iceType" class="form-check-input" :id="'ice' + key" :value="ice"
                  v-model="selectedItem.ice"
                  :disabled="!Object.hasOwn(selectedItem, 'defaults') || (selectedItem.defaults.ice !== '' && selectedItem.defaults.ice !== ice)">
                <label class="form-check-label" :for="'ice' + key">{{ ice }}</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="" class="form-label d-block">甜度</label>
              <div class="form-check form-check-inline" v-for="(sugar, key) in sugarType" :key="'sugar' + key">
                <input type="radio" class="form-check-input" name="sugarType" :value="sugar" :id="'sugar' + key"
                  v-model="selectedItem.sugar"
                  :disabled="!Object.hasOwn(selectedItem, 'defaults') || (selectedItem.defaults.sugar !== '' && selectedItem.defaults.sugar !== sugar)">
                <label :for="'sugar' + key" class="form-check-label">{{ sugar }}</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="" class="form-label d-block">加料</label>
              <div class="form-check form-check-inline" v-for="(toppings, key) in toppingsType" :key="toppings + key">
                <input type="checkbox" class="form-check-input" :value="toppings" :id="'toppings' + key"
                  v-model="selectedItem.toppings">
                <label :for="'toppings' + key" class="form-check-label">{{ toppings }}</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="" class="form-label">備註</label>
              <textarea name="" id="productNotice" class="form-control" rows="2"
                v-model="selectedItem.notice"></textarea>
            </div>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-outline-secondary w-100" @click.prevent="cancelSelected">取消</button>
              <button type="button" class="btn btn-warning w-100" @click.prevent="addToOrder(selectedItem)">加入</button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">品項</th>
                  <th scope="col">冰塊</th>
                  <th scope="col">甜度</th>
                  <th scope="col">加料(每樣10元)</th>
                  <th scope="col">單價</th>
                  <th scope="col">數量</th>
                  <th scope="col">小計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in orderList" :key="item.engName">
                  <th>{{ item.name }}<br>
                    <small class="text-muted fw-normal">備註: {{ item.notice }}</small>
                  </th>
                  <td>{{ item.ice }}</td>
                  <td>{{ item.sugar }}</td>
                  <td>{{ item.toppings.toString() }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.total }}</td>
                </tr>
              </tbody>
            </table>
            <p class="text-end">共 NT$ {{ totalPrice }}元</p>
            <div class="d-flex gap-2">
              <button class="btn btn-warning w-50" @click.prevent="generateOrder(orderList, totalPrice)">產生訂單</button>
              <button class="btn btn-outline-secondary w-50" @click.prevent="clearOrder">清空訂單</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-light p-3 mt-3" v-if="checkedOrder.orders.length > 0" ref="finalOrder">
    <div class="bg-white p-3 d-flex flex-column">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">品項</th>
            <th scope="col">冰塊</th>
            <th scope="col">甜度</th>
            <th scope="col">加料</th>
            <th scope="col">單價</th>
            <th scope="col">數量</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in checkedOrder.orders" :key="'order' + key">
            <th>{{ item.name }}</th>
            <td>{{ item.ice }}</td>
            <td>{{ item.sugar }}</td>
            <td>{{ item.toppings.toString() }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.total }}</td>
          </tr>
        </tbody>
      </table>
      <p class="mt-3 mb-1">訂單成立時間: {{ checkedOrder.time }}</p>
      <p class="mb-1">餐點數: {{ checkedOrder.orders.length }}</p>
      <p class="mb-1">付款狀態: 未付款</p>
      <p class="text-end mt-auto">共 NT$ {{ checkedOrder.total }} 元</p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
const products = ref([
  {
    name: '珍珠鮮奶茶',
    engName: 'Pearl Milk Tea',
    price: 60,
    defaults: {
      toppings: ['珍珠'],
      sugar: '',
      ice: '',
    }
  },
  {
    name: '椰果鮮奶茶',
    engName: 'Coconut Milk Tea',
    price: 60,
    defaults: {
      toppings: ['椰果'],
      sugar: '',
      ice: '',
    }
  },
  {
    name: '鮮奶茶',
    engName: 'Milk Tea',
    price: 50,
    defaults: {
      toppings: [''],
      sugar: '',
      ice: '',
    }
  },
  {
    name: '古意冬瓜茶 (糖固定)',
    engName: 'Winter Melon Drink',
    price: 30,
    defaults: {
      toppings: [''],
      sugar: '全糖',
      ice: '',
    }
  },
  {
    name: '蜜香紅茶',
    engName: 'Black Tea',
    price: 30,
    defaults: {
      toppings: [''],
      sugar: '',
      ice: '',
    }
  },
  {
    name: '包種青茶',
    engName: 'Paochung Tea',
    price: 35,
    defaults: {
      toppings: [''],
      sugar: '',
      ice: '',
    }
  },
  {
    name: '檸檬烏龍',
    engName: 'Lemon Oolong Tea',
    price: 55,
    defaults: {
      toppings: [''],
      sugar: '',
      ice: '',
    }
  },
  {
    name: '薑母茶 (熱飲)',
    engName: 'Ginger Tea',
    price: 55,
    defaults: {
      toppings: [''],
      sugar: '',
      ice: '熱',
    }
  },
  {
    name: '青草茶',
    engName: 'Herbal Tea',
    price: 35,
    defaults: {
      toppings: [''],
      sugar: '',
      ice: '',
    }
  },
  {
    name: '金桔檸檬',
    engName: 'Kumquat Lemonade',
    price: 40,
    defaults: {
      toppings: [''],
      sugar: '',
      ice: '',
    }
  },
  {
    name: '柳澄青茶',
    engName: 'Orange Mountain Tea',
    price: 45,
    defaults: {
      toppings: [''],
      sugar: '',
      ice: '',
    }
  },
])
const iceType = ref(['正常冰', '少冰', '微冰', '去冰', '熱'])
const sugarType = ref(['全糖', '七分糖', '半糖', '三分糖', '無糖'])
const toppingsType = ref(['珍珠', '椰果', '粉條', '小粉圓', '芋頭'])
const selectedItem = ref('') // 選取的商品
const orderList = ref([])
const totalPrice = ref(0)
const checkedOrder = ref({
  time: '',
  orders: [],
  total: 0
})
const finalOrder = ref(null)

// 選取商品函式，帶入預設值
const itemSelected = (item) => {
  selectedItem.value = {
    ...item,
    quantity: 1,
    ice: item.defaults.ice !== '' ? item.defaults.ice : '正常冰',
    sugar: item.defaults.sugar !== '' ? item.defaults.sugar : '全糖',
    toppings: [],
    notice: '',
  }
}
// 點選項目加入訂單
const addToOrder = (item) => {
  const order = { // 建立訂單物件
    ...item,
    total: (item.price + item.toppings.length * 10) * item.quantity, // 計算項目小計
  }
  orderList.value.push(order)
  calculateTotalPrice()
  cancelSelected()
}
// 計算總價
const calculateTotalPrice = () => {
  totalPrice.value = orderList.value.reduce((acc, item) => acc + item.total, 0)
}
// 取消選取
const cancelSelected = () => {
  selectedItem.value = ''
}
const clearOrder = () => {
  orderList.value = []
  totalPrice.value = 0
}
const generateOrder = (orders, total) => {
  if (orders.length === 0) {
    alert('你尚未點餐')
    return
  }
  const date = new Date().toLocaleString()
  checkedOrder.value.time = date
  checkedOrder.value.orders = [...orders]
  checkedOrder.value.total = total
  clearOrder()
  // 使用 nextTick，確保 DOM 已更新才執行滾動
  nextTick(() => {
    if (finalOrder.value) {
      // 3. 執行滾動
      finalOrder.value.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
</script>

<style scoped>
.cardblock {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.list-group-item.active {
  background-color: #8aa73b;
  border-color: #8aa73b;
  color: #fff;
}
</style>