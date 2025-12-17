<template>
  <div class="product-list">
    <h3>產品清單</h3>
    <div class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-info">
          <h4>{{ product.name }}</h4>
          <p class="category">{{ product.category }}</p>
          <p class="price">${{ product.price }}</p>
        </div>
        <div class="product-actions">
          <button @click="addToCart(product)" class="btn btn-primary">
            加入購物車
          </button>
          <button @click="removeFromCart(product)" class="btn btn-secondary">
            移除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定義 props - 接收產品陣列
const props = defineProps({
  products: {
    type: Array, // products屬性為陣列(Array)
    required: true, // 此props屬性為必要
    // 驗證機制，可在缺少元素資料前就可提示
    validator: (value) => { // 驗證接收的value是否符合
      return value.every(product => // 檢查陣列並回傳 product 各元素是否符合條件
        product.hasOwnProperty('id') && // 檢查是否有 id 屬性
        product.hasOwnProperty('name') && // 檢查是否有 name 屬性
        product.hasOwnProperty('price') // 檢查是否有 price 屬性
      )
    }
  }
})

// 定義 emits - 購物車操作事件
const emit = defineEmits({
  'add-to-cart': (product) => {
    return product && typeof product === 'object' && product.id
  },
  'remove-from-cart': (product) => {
    return product && typeof product === 'object' && product.id
  }
})

// 方法
const addToCart = (product) => {
  emit('add-to-cart', product)
}

const removeFromCart = (product) => {
  emit('remove-from-cart', product)
}
</script>

<style scoped>
.product-list {
  width: 100%;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-info h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
}

.category {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
  margin: 10px 0;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  flex: 1;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>