<template>
  <div style="border: solid 3px blue; margin-top: 20px; padding: 10px;">
    <h3 style="color: brown;font-weight: bold;">Card 1</h3>
    <h4>Name: {{ name }}</h4>
    <p>Age: {{ age }}</p>
    <p>img: <img :src="img" alt="" class="img-fluid"></p>
    <p>intro: {{ intro }}</p>
  </div>
  <div style="border: solid 3px blue; margin-top: 20px; padding: 10px;">
    <h3>Card 2</h3>
    <p>Counter</p>
    <p>count num : {{ count }} (ChildComponent.vue)</p>
    <div class="btn-control">
      <button class="btn btn-info" @click="increment">+1</button>
      <button class="btn btn-warning" @click="decrement">-1</button>
      <button class="btn btn-primary" @click="increment5">+5</button>
      <button class="btn btn-danger" @click="resetCount">Reset : 87</button>
      <button class="btn btn-secondary" @click="setDefault">Default 0</button>
    </div>
  </div>
  <div style="border: solid 3px blue; margin-top: 20px; padding: 10px;" class="row">
    <h3>Card 3</h3>
    <div class="card-container col-3" v-for="product in products" :key="product.id">
      <div>
        <p style="font-weight:bold;">{{ product.name }}</p>
        <p>{{ product.price }}</p>
        <span>{{ product.category }}</span>
      </div>
      <div>
        <button class="col-6 btn btn-info" @click="addToCart(product)">Add</button>
        <button class="col-6 btn btn-warning" @click="removeFromCart(product)">Del</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
// 定義props
const props = defineProps({
  // card 1
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: true
  },
  // card 2
  initialValue: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 // 驗證機制，確保值不會變成負值 
  },
  // card 3 props
  products: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(product =>
        product.hasOwnProperty('id') &&
        product.hasOwnProperty('name') &&
        product.hasOwnProperty('price')
      )
    }
  }
})

// 定義emits
const emit = defineEmits({
  increment: (value) => typeof value === 'number',
  decrement: (value) => typeof value === 'number',
  resetCount: () => true,
  setDefault: () => true,

  'add-to-cart': (product) => typeof product?.id,
  'remove-form-cart': (product) => typeof product?.id
})
// 定義計數的值
const count = ref(props.initialValue)

// 監聽 props 變化
watch(
  () => props.initialValue,
  (newValue) => count.value = newValue
)

// 方法
// card 2
const increment = () => {
  count.value++
  emit('increment', count.value)
}
const increment5 = () => {
  count.value += 5
  emit('increment', count.value)
}
const decrement = () => {
  if (count.value <= 0) { return }
  count.value--
  emit('decrement', count.value)
}
const resetCount = () => {
  count.value = 87
  emit('resetCount', count.value)
}
const setDefault = () => {
  count.value = 0
  emit('setDefault', count.value)
}

//card 3
const addToCart = (product) => {
  emit('add-to-cart', product)
}
const removeFromCart = (product) => {
  emit('remove-from-cart', product)
}
</script>

<style>
.btn-control button {
  margin-right: 8px;
}

.card-container {
  border: solid 3px #ccc;
  border-radius: 20px;
  padding: 1em;
}
</style>