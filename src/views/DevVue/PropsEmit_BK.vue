<template>
  <h1>Props、Emit</h1>
  <div style="width: 90vw;padding: 20px; border: solid 3px #666;">
    <h3>Exterior(PropsEmit.vue)</h3>
    <!-- 相關事件監聽 -->
    <ChildComponent :name="user.name" :age="user.age" :img="user.img" :intro="user.intro" @increment="handleIncrement"
      @decrement="handleDecrement" @reset="handleResetCount" @setDefault="handleSetDefault" :initialValue="counterValue"
      :products="products" @addToCart="handleAddToCart" @removeFromCart="handleRemoveFromCart" />
    <div v-for="item in cart" :key="item.id" style="border-bottom: solid 1px #666">
      {{ item.name }} - ${{ item.price }} / {{ item.category }}
    </div>
    <div>${{ cartTotal }}</div>
    <p>counterValue: <span style="font-weight: bold;color: red;">{{ counterValue }}</span> (PropsEmit.vue)</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChildComponent from '../../components/ChildComponent.vue';

// Card 1
const user = {
  name: 'Audi',
  age: 30,
  img: 'https://media.audi.com/is/image/audi/nemo/models/q5/sq5/my-2025-nf/product-highlight/SQ5_2024_6850_withoutCast-S-L.jpg?width=943&auto=webp',
  intro: '得益於 quattro with ultra technology 智慧型四輪傳動系統，無論面對何種路況，皆能從容應對、穩定掌控。可選配 S 專屬主動式氣壓懸吊，依路況自動調整車高與減震設定，帶來卓越的動態表現與細膩舒適的乘坐體驗。'
}

// Card 2
const counterValue = ref(10)

const handleIncrement = (value) => {
  counterValue.value = value
}

const handleDecrement = (value) => {
  counterValue.value = value
}

const handleResetCount = () => {
  counterValue.value = 0
}

const handleSetDefault = () => {
  counterValue.value = 99
}

// Card 3
const products = ref([
  { id: 1, name: 'RS3', price: 2800000, category: 'hatchback' },
  { id: 2, name: 'RSQ3', price: 3500000, category: 'sportback' },
  { id: 3, name: 'SQ5', price: 3600000, category: 'suv' },
  { id: 4, name: 'RS6', price: 7400000, category: 'wagon' }
])

const cart = ref([])

const cartTotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.price, 0)
})

const handleAddToCart = (product) => { // 觸發函式，增加到購物車
  const existingItem = cart.value.find(item => item.id === product.id) // 定義已存在品項的變數，並與購物車內物件 id 比對
  if (!existingItem) { // 若沒有重複
    cart.value.push({ ...product })
    alert('Add Completed')
  } else if (existingItem) {
    alert('Item has existed')
  } else {
    alert('Failed')
  }
}
const handleRemoveFromCart = (product) => {
  const originalLength = cart.value.length;
  cart.value = cart.value.filter(item => item.id !== product.id);

  if (cart.value.length < originalLength) {
    alert('Remove Completed!!');
  } else {
    alert("Item doesn't existed");
  }
  // const index = cart.value.findIndex(item => item.id === product.id)
  // if (index > -1) {
  //   cart.value.splice(index, 1)
  //   alert('Remove Completed!!')
  // } else {
  //   alert("Item doesn't existed")
  //   return
  // }
}

</script>

<style></style>