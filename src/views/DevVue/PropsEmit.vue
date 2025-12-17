<template>
  <h1>Props、Emit</h1>
  <div style="width: 90vw;padding: 20px; border: solid 3px #666;">
    <h3>Exterior(PropsEmit.vue)</h3>
    <!-- 相關事件監聽 -->
    <ChildComponent :name="user.name" :age="user.age" :img="user.img" :intro="user.intro" :initialValue="counterValue"
      @increment="handleIncrement" @decrement="handleDecrement" @resetCount="handleResetCount"
      @setDefault="handleSetDefault" :products="products" @addToCart="handleAddToCart"
      @removeFromCart="handleRemoveFromCart" />
    <div v-for="item in cart" :key="item.id" style="border-bottom: solid 1px #666;">
      {{ item.name }} - ${{ item.price }} / {{ item.category }}
    </div>
    <div>${{ currency(cartTotal) }}</div>
    <p>counterValue: <span style="font-weight: bold;color: red;">{{ counterValue }}</span> (PropsEmit.vue)</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { currency } from './methods/filters';
import ChildComponent from '../../components/ChildComponent.vue';

// Card 1
const user = {
  name: 'Audi',
  age: 30,
  img: 'https://emea-dam.audi.com/adobe/assets/urn:aaid:aem:b934db02-1f0d-4a6b-895a-b11b5a586daf/as/SQ5_2024_6846-L.jpg?width=1920',
  intro: '得益於 quattro with ultra technology 智慧型四輪傳動系統，無論面對何種路況，皆能從容應對、穩定掌控。可選配 S 專屬主動式氣壓懸吊，依路況自動調整車高與減震設定，帶來卓越的動態表現與細膩舒適的乘坐體驗。'
}

// Card 2
const counterValue = ref(0)

const handleIncrement = (value) => {
  counterValue.value = value
}
const handleDecrement = (value) => {
  counterValue.value = value
}
const handleResetCount = () => {
  counterValue.value = 87
}
const handleSetDefault = () => {
  counterValue.value = 0
}

// Card 3
const products = ref([
  { id: 1, name: 'RS3', price: 2800000, category: 'hatchback' },
  { id: 2, name: 'RSQ3', price: 3500000, category: 'sportback' },
  { id: 3, name: 'SQ5', price: 3600000, category: 'suv' },
  { id: 4, name: 'RS6', price: 7400000, category: 'wagon' }
])

const cart = ref([]) // 定義購物車唯一空陣列

const cartTotal = computed(() => { // 計算購物車內全部項目的金額
  return cart.value.reduce((acc, item) => acc + item.price, 0)
})

const handleAddToCart = (product) => { // 觸發加入購物車的函式
  const existingItem = cart.value.find(item => item.id === product.id) // 定義一變數existingItem，比對 product 的 id 是否與列表的項目相同
  if (!existingItem) { // 如果不重複
    cart.value.push({ ...product }) // 將其加到購物車
    alert('Add Completed!')
  } else if (existingItem) { // 如果重複
    alert('Item existed')
  } else {
    alert('Failed')
  }
}
// 移除購物車項目，運作邏輯除了直接刪除，也可透過比對長度來確認是否有成功刪除
const handleRemoveFromCart = (product) => { // 觸發移除項目
  const originalLength = cart.value.length; // 定義變數originalLength，其值為 cart.value 的數量
  cart.value = cart.value.filter(item => item.id !== product.id) // 篩選 cart.value ，留下 item.id 不等於 product.id 的項目
  if (cart.value < originalLength) { // 若篩選後的數量比原本數量少
    alert('Item Removed') // 顯示 Item Removed
  } else {
    alert("Item doesn't existed")
  }
}

</script>

<style></style>